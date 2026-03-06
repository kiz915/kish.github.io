/**
 * Secure Cloud Module - File Management with AES-256 Encryption
 * KISHORE Secure Cloud System
 */

const Cloud = (function() {
    // Private variables
    let currentUser = null;
    let userRole = null;
    let filesListener = null;

    // Initialize auth listener
    Auth.addAuthListener((user, role) => {
        currentUser = user;
        userRole = role;
        if (user) {
            loadDashboard();
            setupRealtimeListener();
        } else {
            showAuthSection();
            if (filesListener) filesListener();
        }
    });

    function showAuthSection() {
        document.getElementById('authSection').style.display = 'flex';
        document.getElementById('dashboardSection').style.display = 'none';
    }

    function showDashboard() {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';
    }

    function setupRealtimeListener() {
        if (filesListener) filesListener();
        
        const query = firebaseDb.collection('files')
            .where('uploadedBy', '==', currentUser.uid)
            .orderBy('uploadedAt', 'desc');
        
        filesListener = query.onSnapshot((snapshot) => {
            const files = [];
            snapshot.forEach(doc => {
                files.push({ id: doc.id, ...doc.data() });
            });
            renderFileList(files);
        }, (error) => {
            console.error('Realtime listener error:', error);
            UI.showToast('Error loading files', 'error');
        });
    }

    async function loadDashboard() {
        showDashboard();
        updateUserInfo();
        setupUploadArea();
        loadUserStats();
    }

    function updateUserInfo() {
        document.getElementById('userDisplayName').textContent = 
            currentUser.displayName || currentUser.email;
        const roleBadge = document.getElementById('userRoleBadge');
        roleBadge.textContent = userRole === 'admin' ? 'Administrator' : 'Viewer';
        roleBadge.className = `user-role ${userRole === 'admin' ? 'role-admin' : 'role-viewer'}`;
    }

    async function loadUserStats() {
        try {
            const filesSnapshot = await firebaseDb.collection('files')
                .where('uploadedBy', '==', currentUser.uid)
                .get();
            
            let totalSize = 0;
            filesSnapshot.forEach(doc => {
                totalSize += doc.data().fileSize || 0;
            });

            // Update stats in UI if needed
            console.log(`Total files: ${filesSnapshot.size}, Total size: ${formatBytes(totalSize)}`);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    function setupUploadArea() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        if (!uploadArea) return;

        // Show upload area only for admin
        if (userRole === 'admin') {
            uploadArea.style.display = 'block';
            
            uploadArea.addEventListener('click', () => fileInput.click());
            
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                handleFiles(files);
            });
            
            fileInput.addEventListener('change', (e) => {
                handleFiles(e.target.files);
                fileInput.value = ''; // Reset for same file upload
            });
        } else {
            uploadArea.style.display = 'none';
        }
    }

    async function handleFiles(files) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 
                             'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                             'text/plain'];
        
        for (let file of files) {
            // Check file size (10MB max)
            if (file.size > 10 * 1024 * 1024) {
                UI.showToast(`File ${file.name} exceeds 10MB limit`, 'error');
                continue;
            }

            // Check file type
            if (!allowedTypes.includes(file.type) && !file.type.startsWith('image/')) {
                UI.showToast(`File type ${file.type} not allowed for ${file.name}`, 'error');
                continue;
            }

            await uploadFile(file);
        }
    }

    async function uploadFile(file) {
        if (!currentUser) return;

        try {
            // Show upload progress
            const progressId = `progress-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            showUploadProgress(progressId, file.name, 0);

            // Encrypt file
            const encryptedBlob = await Encryption.encryptFile(file, currentUser.uid);
            
            // Generate file hash
            const fileHash = await Encryption.hashFile(file);
            
            // Update progress
            updateUploadProgress(progressId, 30);

            // Create metadata
            const metadata = {
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                encryptedSize: encryptedBlob.size,
                uploadedBy: currentUser.uid,
                uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
                fileHash: fileHash,
                encryptionMethod: 'AES-256-GCM',
                downloads: 0,
                sharedWith: []
            };

            // Upload to Firebase Storage
            const storageRef = firebaseStorage.ref();
            const filePath = `encrypted/${currentUser.uid}/${Date.now()}_${file.name}`;
            const fileRef = storageRef.child(filePath);
            
            updateUploadProgress(progressId, 50);

            const uploadTask = fileRef.put(encryptedBlob, { 
                contentType: 'application/octet-stream',
                customMetadata: {
                    originalName: file.name,
                    originalType: file.type,
                    encrypted: 'true'
                }
            });

            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = 50 + (snapshot.bytesTransferred / snapshot.totalBytes) * 40;
                    updateUploadProgress(progressId, Math.round(progress));
                },
                (error) => {
                    console.error('Upload error:', error);
                    removeUploadProgress(progressId);
                    UI.showToast(`Upload failed for ${file.name}: ${error.message}`, 'error');
                },
                async () => {
                    const downloadURL = await fileRef.getDownloadURL();
                    metadata.storagePath = filePath;
                    metadata.downloadURL = downloadURL;
                    
                    updateUploadProgress(progressId, 95);

                    // Save to Firestore
                    await firebaseDb.collection('files').add(metadata);
                    
                    // Update user stats
                    await firebaseDb.collection('users').doc(currentUser.uid).update({
                        totalUploads: firebase.firestore.FieldValue.increment(1)
                    });

                    removeUploadProgress(progressId);
                    UI.showToast(`File ${file.name} uploaded successfully`, 'success');
                }
            );
        } catch (error) {
            console.error('Upload error:', error);
            UI.showToast(`Upload failed: ${error.message}`, 'error');
        }
    }

    function showUploadProgress(id, fileName, progress) {
        const fileList = document.getElementById('fileList');
        const progressHtml = `
            <div class="upload-progress" id="${id}">
                <div class="file-info">
                    <i class="fas fa-spinner fa-pulse file-icon"></i>
                    <div class="file-details">
                        <div class="file-name">${fileName}</div>
                        <div class="file-meta">Encrypting and uploading...</div>
                    </div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${progress}%"></div>
                </div>
                <div class="upload-status">
                    <span>Uploading...</span>
                    <span class="upload-percent">${progress}%</span>
                </div>
            </div>
        `;
        fileList.insertAdjacentHTML('afterbegin', progressHtml);
    }

    function updateUploadProgress(id, progress) {
        const progressEl = document.getElementById(id);
        if (progressEl) {
            const fill = progressEl.querySelector('.progress-bar-fill');
            const percent = progressEl.querySelector('.upload-percent');
            if (fill) fill.style.width = `${progress}%`;
            if (percent) percent.textContent = `${progress}%`;
        }
    }

    function removeUploadProgress(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function renderFileList(files) {
        const fileList = document.getElementById('fileList');
        
        if (files.length === 0) {
            fileList.innerHTML = `
                <div class="file-item placeholder">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <span>No files uploaded yet</span>
                </div>
            `;
            return;
        }

        fileList.innerHTML = files.map(file => createFileElement(file)).join('');
    }

    function createFileElement(file) {
        const date = file.uploadedAt ? new Date(file.uploadedAt.toDate()).toLocaleString() : 'Unknown';
        const fileIcon = getFileIcon(file.fileType);
        
        return `
            <div class="file-item" data-id="${file.id}">
                <div class="file-info">
                    <i class="fas ${fileIcon} file-icon"></i>
                    <div class="file-details">
                        <div class="file-name">${escapeHtml(file.fileName)}</div>
                        <div class="file-meta">
                            <span><i class="fas fa-weight"></i> ${formatBytes(file.fileSize)}</span>
                            <span><i class="fas fa-calendar"></i> ${date}</span>
                            <span><i class="fas fa-download"></i> ${file.downloads || 0}</span>
                            <span class="encryption-badge"><i class="fas fa-lock"></i> AES-256</span>
                        </div>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="file-action-btn download" onclick="Cloud.downloadFile('${file.id}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                    ${userRole === 'admin' ? `
                        <button class="file-action-btn delete" onclick="Cloud.deleteFile('${file.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    function getFileIcon(mimeType) {
        if (mimeType.startsWith('image/')) return 'fa-file-image';
        if (mimeType === 'application/pdf') return 'fa-file-pdf';
        if (mimeType.includes('word')) return 'fa-file-word';
        if (mimeType === 'text/plain') return 'fa-file-alt';
        return 'fa-file';
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // Public API
    return {
        async downloadFile(fileId) {
            try {
                const doc = await firebaseDb.collection('files').doc(fileId).get();
                if (!doc.exists) throw new Error('File not found');
                
                const file = doc.data();
                
                UI.showToast('Downloading and decrypting...', 'info');
                
                // Download encrypted file
                const response = await fetch(file.downloadURL);
                const encryptedBlob = await response.blob();
                
                // Decrypt
                const arrayBuffer = await encryptedBlob.arrayBuffer();
                const decryptedBlob = await Encryption.decryptFile(arrayBuffer, file.uploadedBy, file.fileType);
                
                // Create download link
                const url = URL.createObjectURL(decryptedBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                // Update download count
                await firebaseDb.collection('files').doc(fileId).update({
                    downloads: firebase.firestore.FieldValue.increment(1)
                });
                
                // Update user stats
                await firebaseDb.collection('users').doc(currentUser.uid).update({
                    totalDownloads: firebase.firestore.FieldValue.increment(1)
                });
                
                UI.showToast('File downloaded successfully', 'success');
                
            } catch (error) {
                console.error('Download error:', error);
                UI.showToast(`Download failed: ${error.message}`, 'error');
            }
        },

        async deleteFile(fileId) {
            if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) return;
            
            try {
                const doc = await firebaseDb.collection('files').doc(fileId).get();
                if (!doc.exists) throw new Error('File not found');
                
                const file = doc.data();
                
                // Delete from Storage
                const storageRef = firebaseStorage.ref();
                const fileRef = storageRef.child(file.storagePath);
                await fileRef.delete();
                
                // Delete from Firestore
                await firebaseDb.collection('files').doc(fileId).delete();
                
                UI.showToast('File deleted successfully', 'success');
                
            } catch (error) {
                console.error('Delete error:', error);
                UI.showToast(`Delete failed: ${error.message}`, 'error');
            }
        },

        async shareFile(fileId, email) {
            try {
                // Find user by email
                const usersSnapshot = await firebaseDb.collection('users')
                    .where('email', '==', email)
                    .get();
                
                if (usersSnapshot.empty) {
                    throw new Error('User not found');
                }
                
                const targetUser = usersSnapshot.docs[0];
                
                // Add to sharedWith array
                await firebaseDb.collection('files').doc(fileId).update({
                    sharedWith: firebase.firestore.FieldValue.arrayUnion(targetUser.id)
                });
                
                UI.showToast('File shared successfully', 'success');
                
            } catch (error) {
                console.error('Share error:', error);
                UI.showToast(`Share failed: ${error.message}`, 'error');
            }
        }
    };
})();

// Expose globally
window.Cloud = Cloud;

// Auth form event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            forms.forEach(f => f.classList.remove('active'));
            document.getElementById(target + 'Form').classList.add('active');
        });
    });

    // Login form
    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorDiv = document.getElementById('loginError');
        
        const result = await Auth.login(email, password);
        if (!result.success) {
            errorDiv.textContent = result.error;
        } else {
            errorDiv.textContent = '';
        }
    });

    // Register form
    document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirm = document.getElementById('registerConfirmPassword').value;
        const errorDiv = document.getElementById('registerError');
        
        if (password !== confirm) {
            errorDiv.textContent = 'Passwords do not match';
            return;
        }
        
        const result = await Auth.register(name, email, password);
        if (!result.success) {
            errorDiv.textContent = result.error;
        } else {
            errorDiv.textContent = '';
        }
    });

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
        await Auth.logout();
    });
});

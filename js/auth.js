/**
 * Authentication Module - Firebase Auth with Role Management
 * KISHORE Secure Cloud System
 */

const Auth = (function() {
    // Private variables
    let currentUser = null;
    let userRole = null;
    let authListeners = [];

    // Initialize auth state observer
    firebaseAuth.onAuthStateChanged(async (user) => {
        currentUser = user;
        if (user) {
            try {
                // Fetch user role from Firestore
                const doc = await firebaseDb.collection('users').doc(user.uid).get();
                if (doc.exists) {
                    userRole = doc.data().role || 'viewer';
                } else {
                    // Create user document if not exists
                    await firebaseDb.collection('users').doc(user.uid).set({
                        email: user.email,
                        displayName: user.displayName || user.email.split('@')[0],
                        role: 'viewer',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                        photoURL: user.photoURL || ''
                    });
                    userRole = 'viewer';
                }
                
                // Update last login
                await firebaseDb.collection('users').doc(user.uid).update({
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                });
                
            } catch (error) {
                console.error('Error fetching user role:', error);
                userRole = 'viewer';
            }
        } else {
            userRole = null;
        }
        
        // Notify listeners
        authListeners.forEach(listener => listener(user, userRole));
    });

    // Public API
    return {
        // Login with email/password
        async login(email, password) {
            try {
                const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
                return { success: true, user: userCredential.user };
            } catch (error) {
                let errorMessage = 'Login failed';
                switch(error.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'User not found';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Incorrect password';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email address';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many failed attempts. Try again later';
                        break;
                    default:
                        errorMessage = error.message;
                }
                return { success: false, error: errorMessage };
            }
        },

        // Register new user
        async register(name, email, password) {
            try {
                const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
                
                // Update profile
                await userCredential.user.updateProfile({ 
                    displayName: name 
                });
                
                // Create user document in Firestore
                await firebaseDb.collection('users').doc(userCredential.user.uid).set({
                    email: email,
                    displayName: name,
                    role: 'viewer',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                    photoURL: '',
                    totalUploads: 0,
                    totalDownloads: 0
                });
                
                return { success: true, user: userCredential.user };
            } catch (error) {
                let errorMessage = 'Registration failed';
                switch(error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'Email already in use';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email address';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Password should be at least 6 characters';
                        break;
                    default:
                        errorMessage = error.message;
                }
                return { success: false, error: errorMessage };
            }
        },

        // Logout
        async logout() {
            try {
                await firebaseAuth.signOut();
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Get current user
        getCurrentUser() {
            return currentUser;
        },

        // Get current user role
        getUserRole() {
            return userRole;
        },

        // Check if user is admin
        isAdmin() {
            return userRole === 'admin';
        },

        // Add auth state listener
        addAuthListener(callback) {
            authListeners.push(callback);
            if (currentUser !== undefined) {
                callback(currentUser, userRole);
            }
        },

        // Remove auth listener
        removeAuthListener(callback) {
            authListeners = authListeners.filter(cb => cb !== callback);
        },

        // Set user role (admin only)
        async setUserRole(uid, role) {
            try {
                await firebaseDb.collection('users').doc(uid).update({ role });
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Get all users (admin only)
        async getAllUsers() {
            try {
                const snapshot = await firebaseDb.collection('users').get();
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (error) {
                console.error('Error fetching users:', error);
                return [];
            }
        },

        // Check if email is verified
        isEmailVerified() {
            return currentUser?.emailVerified || false;
        },

        // Send verification email
        async sendVerificationEmail() {
            if (currentUser) {
                try {
                    await currentUser.sendEmailVerification();
                    return { success: true };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            }
            return { success: false, error: 'No user logged in' };
        },

        // Reset password
        async resetPassword(email) {
            try {
                await firebaseAuth.sendPasswordResetEmail(email);
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    };
})();

// Expose globally
window.Auth = Auth;

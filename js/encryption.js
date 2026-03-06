/**
 * Encryption Module - AES-256-GCM File Encryption
 * KISHORE Secure Cloud System
 */

const Encryption = (function() {
    // Configuration - In production, get this from secure backend
    const PEPPER = "KISHORE_SECURE_PEPPER_2025_CHANGE_THIS";
    
    // Derive key using PBKDF2
    function deriveKey(userId, salt) {
        return CryptoJS.PBKDF2(PEPPER + userId, salt, {
            keySize: 256 / 32,
            iterations: 10000,
            hasher: CryptoJS.algo.SHA256
        });
    }

    // Convert ArrayBuffer to WordArray
    function arrayBufferToWordArray(buffer) {
        const words = [];
        const length = buffer.byteLength / 4;
        const array = new Uint32Array(buffer);
        
        for (let i = 0; i < length; i++) {
            words.push(array[i]);
        }
        
        return CryptoJS.lib.WordArray.create(words, buffer.byteLength);
    }

    // Convert WordArray to ArrayBuffer
    function wordArrayToArrayBuffer(wordArray) {
        const words = wordArray.words;
        const sigBytes = wordArray.sigBytes;
        const buffer = new ArrayBuffer(sigBytes);
        const view = new Uint8Array(buffer);
        
        for (let i = 0; i < sigBytes; i++) {
            view[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
        }
        
        return buffer;
    }

    // Generate random salt
    function generateSalt(length = 16) {
        return CryptoJS.lib.WordArray.random(length);
    }

    // Public API
    return {
        /**
         * Encrypt file using AES-256-GCM
         */
        async encryptFile(file, userId) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    try {
                        // Generate random salt and IV
                        const salt = generateSalt(16);
                        const iv = CryptoJS.lib.WordArray.random(12); // 96 bits for GCM
                        
                        // Derive key
                        const key = deriveKey(userId, salt);
                        
                        // Convert file data to WordArray
                        const fileData = arrayBufferToWordArray(e.target.result);
                        
                        // Encrypt with AES-256-GCM
                        const encrypted = CryptoJS.AES.encrypt(fileData, key, {
                            iv: iv,
                            mode: CryptoJS.mode.GCM,
                            padding: CryptoJS.pad.NoPadding
                        });
                        
                        // Combine: salt (16) + iv (12) + ciphertext
                        const combined = salt.concat(iv).concat(encrypted.ciphertext);
                        
                        // Convert to Blob
                        const combinedBase64 = CryptoJS.enc.Base64.stringify(combined);
                        const blob = new Blob([combinedBase64], { 
                            type: 'application/octet-stream' 
                        });
                        
                        resolve(blob);
                    } catch (error) {
                        reject(error);
                    }
                };
                
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });
        },

        /**
         * Decrypt file
         */
        async decryptFile(encryptedData, userId, mimeType) {
            return new Promise((resolve, reject) => {
                try {
                    let dataStr;
                    if (encryptedData instanceof ArrayBuffer) {
                        dataStr = CryptoJS.enc.Latin1.stringify(
                            arrayBufferToWordArray(encryptedData)
                        );
                    } else {
                        dataStr = encryptedData;
                    }
                    
                    // Parse base64
                    const combined = CryptoJS.enc.Base64.parse(dataStr);
                    
                    // Extract components
                    const salt = CryptoJS.lib.WordArray.create(
                        combined.words.slice(0, 4)
                    ); // 16 bytes = 4 words
                    
                    const iv = CryptoJS.lib.WordArray.create(
                        combined.words.slice(4, 7)
                    ); // 12 bytes = 3 words
                    
                    const ciphertext = CryptoJS.lib.WordArray.create(
                        combined.words.slice(7)
                    );
                    
                    // Derive key
                    const key = deriveKey(userId, salt);
                    
                    // Decrypt
                    const decrypted = CryptoJS.AES.decrypt(
                        { ciphertext: ciphertext },
                        key,
                        {
                            iv: iv,
                            mode: CryptoJS.mode.GCM,
                            padding: CryptoJS.pad.NoPadding
                        }
                    );
                    
                    // Convert to Blob
                    const decryptedBuffer = wordArrayToArrayBuffer(decrypted);
                    const blob = new Blob([decryptedBuffer], { 
                        type: mimeType || 'application/octet-stream' 
                    });
                    
                    resolve(blob);
                } catch (error) {
                    reject(error);
                }
            });
        },

        /**
         * Generate SHA-256 hash of file
         */
        async hashFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    try {
                        const wordArray = arrayBufferToWordArray(e.target.result);
                        const hash = CryptoJS.SHA256(wordArray).toString();
                        resolve(hash);
                    } catch (error) {
                        reject(error);
                    }
                };
                
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });
        },

        /**
         * Verify file integrity using hash
         */
        async verifyFile(file, expectedHash) {
            const actualHash = await this.hashFile(file);
            return actualHash === expectedHash;
        },

        /**
         * Generate random encryption key (for admin use)
         */
        generateRandomKey() {
            return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Base64);
        }
    };
})();

window.Encryption = Encryption;

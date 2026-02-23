// ============================================
// Firebase Configuration
// ============================================

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, update, remove, onValue, push, onDisconnect, serverTimestamp } from 'firebase/database';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB09X9CUqeTaA9MUwJoFjrBWjjN8o6blqo",
    authDomain: "pmsonet-2d731.firebaseapp.com",
    databaseURL: "https://pmsonet-2d731-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "pmsonet-2d731",
    storageBucket: "pmsonet-2d731.firebasestorage.app",
    messagingSenderId: "1076768247056",
    appId: "1:1076768247056:web:0c0c16dc9b5777b6e8a995"
};

let app, db, auth;
let currentUser = null;

/**
 * Initialize Firebase
 */
export function initFirebase() {
    try {
        app = initializeApp(firebaseConfig);
        db = getDatabase(app);
        auth = getAuth(app);
        return true;
    } catch (error) {
        console.warn('Firebase init failed, running in offline mode:', error);
        return false;
    }
}

/**
 * Sign in anonymously
 */
export async function signIn() {
    try {
        const result = await signInAnonymously(auth);
        currentUser = result.user;
        return currentUser;
    } catch (error) {
        console.warn('Auth failed:', error);
        // Generate local user ID
        currentUser = {
            uid: 'local_' + Math.random().toString(36).substr(2, 9),
            isAnonymous: true
        };
        return currentUser;
    }
}

/**
 * Get current user ID
 */
export function getCurrentUserId() {
    return currentUser?.uid || 'local_user';
}

/**
 * Listen for auth state changes
 */
export function onAuthChange(callback) {
    if (auth) {
        return onAuthStateChanged(auth, callback);
    }
    callback(currentUser);
    return () => { };
}

/**
 * Firebase Database helpers
 */
export function dbRef(path) {
    return ref(db, path);
}

export function dbSet(path, data) {
    return set(ref(db, path), data);
}

export function dbUpdate(path, data) {
    return update(ref(db, path), data);
}

export function dbGet(path) {
    return get(ref(db, path));
}

export function dbRemove(path) {
    return remove(ref(db, path));
}

export function dbListen(path, callback) {
    return onValue(ref(db, path), (snapshot) => {
        callback(snapshot.val(), snapshot);
    });
}

export function dbPush(path) {
    return push(ref(db, path));
}

export function dbOnDisconnect(path) {
    return onDisconnect(ref(db, path));
}

export function getServerTimestamp() {
    return serverTimestamp();
}

export { db, auth, currentUser };

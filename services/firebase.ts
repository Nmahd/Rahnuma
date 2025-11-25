import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

// Helper to get env vars safely (supports Vite and standard process.env)
const getEnv = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || process.env[key.replace('VITE_', 'REACT_APP_')] || process.env[key.replace('VITE_', '')];
  }
  return '';
};

// Your web app's Firebase configuration
// These must be set in your Netlify Environment Variables
const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID')
};

// Initialize Firebase
let auth: any = null;

try {
  // Simple check to ensure config is present before initializing to avoid nasty crash loops
  if (firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    console.warn("Firebase configuration missing. Please check VITE_FIREBASE_API_KEY environment variable.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  if (!auth) throw new Error("Firebase not initialized. Check API keys.");
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logoutUser = async () => {
  if (!auth) return;
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};

export const subscribeToAuthChanges = (callback: (user: FirebaseUser | null) => void) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

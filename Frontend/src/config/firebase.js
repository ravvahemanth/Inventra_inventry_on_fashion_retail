import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  signOut 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAax71-mevJvBZ_Krjh441BzcMIfL-Hf6c",
  authDomain: "inventra-retail.firebaseapp.com",
  projectId: "inventra-retail",
  storageBucket: "inventra-retail.firebasestorage.app",
  messagingSenderId: "241186628322",
  appId: "1:241186628322:web:474305c4ff78e7b821b4bb",
  measurementId: "G-W9HWWGE63Q"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider custom parameters
googleProvider.setCustomParameters({ 
  prompt: 'select_account' 
});

// Custom Google Sign-In helper with popup and redirect fallback
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const idToken = await user.getIdToken();
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL,
      idToken: idToken
    };
  } catch (error) {
    if (error.code === 'auth/popup-blocked') {
      console.warn("Popup blocked by browser. Falling back to redirect...");
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw error;
  }
};

// Map Firebase Auth error codes to helpful, user-friendly messages
export const mapFirebaseAuthError = (error) => {
  if (!error) return 'Authentication failed. Please try again.';
  
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      return 'Google sign-in window was closed before completing. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Authentication request in progress. Please complete the open sign-in popup.';
    case 'auth/unauthorized-domain':
      return `Domain (${window.location.hostname}) is not authorized in Firebase. Please add '${window.location.hostname}' to Firebase Console > Authentication > Settings > Authorized domains.`;
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not enabled in Firebase Console. Please enable Google provider in Firebase Console > Authentication > Sign-in method.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please verify your internet connection.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email address under different credentials.';
    default:
      return error.message || 'Google sign-in failed. Please try again or sign in with your corporate email.';
  }
};

export { signInWithPopup, signInWithRedirect, getRedirectResult, signOut };
export default app;

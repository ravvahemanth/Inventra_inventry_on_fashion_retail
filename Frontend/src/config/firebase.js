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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Custom Google Sign-In helper with redirect fallback for popup blockers
export const signInWithGoogle = async () => {
  googleProvider.setCustomParameters({ prompt: 'select_account' });
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

export { signInWithPopup, signInWithRedirect, getRedirectResult, signOut };
export default app;

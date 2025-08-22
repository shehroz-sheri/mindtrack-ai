import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAzZaWzSr_xHCgtY3bVUC6Hrn41LUkL8A8",
  authDomain: "mindtrack-ai.firebaseapp.com",
  projectId: "mindtrack-ai",
  storageBucket: "mindtrack-ai.firebasestorage.app",
  messagingSenderId: "468141097664",
  appId: "1:468141097664:web:cf228520054b1b068ba325"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
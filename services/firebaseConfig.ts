import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDVAa6tsLty5b1yllQbLkgx9GfdjotI3hA",
  authDomain: "gastosjav2.firebaseapp.com",
  projectId: "gastosjav2",
  storageBucket: "gastosjav2.firebasestorage.app",
  messagingSenderId: "192664327167",
  appId: "1:192664327167:web:2aa30c86464098e42b8dca"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
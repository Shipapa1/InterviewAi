// Import the functions you need from the SDKs you need
import { initializeApp , getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCcNWglsq49NWASQRjm_tWveYaPb0YMZuI",
  authDomain: "prepwise-ce70b.firebaseapp.com",
  projectId: "prepwise-ce70b",
  storageBucket: "prepwise-ce70b.firebasestorage.app",
  messagingSenderId: "105557826153",
  appId: "1:105557826153:web:8cf678ccc844a0b17e20f8",
  measurementId: "G-NFDGDZPWMW"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
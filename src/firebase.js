// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <--- YOU MISSED THIS IMPORT

const firebaseConfig = {
  apiKey: "AIzaSyBAt4asvX0lnI8nF85t0zRJMemHJTrCH4Y",
  authDomain: "electron-academy-cd50b.firebaseapp.com",
  projectId: "electron-academy-cd50b",
  storageBucket: "electron-academy-cd50b.firebasestorage.app",
  messagingSenderId: "670381977113",
  appId: "1:670381977113:web:b3983a6a495ccca1f18488",
  measurementId: "G-X618BEJF5H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db, app };
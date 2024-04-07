
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-realestate-d22a1.firebaseapp.com",
  projectId: "mern-realestate-d22a1",
  storageBucket: "mern-realestate-d22a1.appspot.com",
  messagingSenderId: "916538512980",
  appId: "1:916538512980:web:bfabe2e37b6f507bdbbfc1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

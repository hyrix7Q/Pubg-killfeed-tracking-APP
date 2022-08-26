// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAhqz4ochrtzMSxMexdVHDNJ7uZnnn8yw",
  authDomain: "pubg-killfeed-tracking.firebaseapp.com",
  projectId: "pubg-killfeed-tracking",
  storageBucket: "pubg-killfeed-tracking.appspot.com",
  messagingSenderId: "670115288258",
  appId: "1:670115288258:web:2c7bb62ab956e9c035575b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage();

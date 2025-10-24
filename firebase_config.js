
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";           
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyDIm9JGFJjjPJbBJwJwooAFUL4hE8JROdI",
  authDomain: "norbertosite.firebaseapp.com",
  projectId: "norbertosite",
  storageBucket: "norbertosite.firebasestorage.app",
  messagingSenderId: "407675683935",
  appId: "1:407675683935:web:522d16efb7f5b7a43787ea",
  measurementId: "G-W30BCJKG77"
};


const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app); 
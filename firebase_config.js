// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyDkcSxsI8I90CnH-KoecXWZJCUV6mT5g3k",
  authDomain: "dbtest-fce24.firebaseapp.com",
  projectId: "dbtest-fce24",
  storageBucket: "dbtest-fce24.firebasestorage.app",
  messagingSenderId: "103674634303",
  appId: "1:103674634303:web:c92a8ea39a436d5f49988a",
  measurementId: "G-XZ35RZ4LD3"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
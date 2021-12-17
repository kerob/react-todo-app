// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDE3zmshv9G8TjbTAALVK6R-JmKISm5z0Y",
  authDomain: "react-todo-fe335.firebaseapp.com",
  projectId: "react-todo-fe335",
  storageBucket: "react-todo-fe335.appspot.com",
  messagingSenderId: "326279714911",
  appId: "1:326279714911:web:b4fc795398c0638829a3ea",
  measurementId: "G-LHEVGKC9G9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();
const auth = getAuth(app);

const boardsRef = collection(db, "boards");
const listsRef = collection(db, "lists");
const cardsRef = collection(db, "cards");

export { boardsRef, listsRef, cardsRef, analytics, auth };

// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyCrONnDFvY8aXDpv7TL2ZfdqT-VqyYcv30",

  authDomain: "instagram-clone2-40efe.firebaseapp.com",

  projectId: "instagram-clone2-40efe",

  storageBucket: "instagram-clone2-40efe.appspot.com",

  messagingSenderId: "149088189786",

  appId: "1:149088189786:web:70d8f6bf62792d076a8763",

  measurementId: "G-V5TS3MT8JL"

};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore();
const storage = getStorage();

export { db, app, storage };

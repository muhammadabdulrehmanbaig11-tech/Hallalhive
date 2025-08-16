// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTdinFIbzMgWI0ZXqvjyee6bEM89Jjr1A",
  authDomain: "halalhive-1.firebaseapp.com",
  projectId: "halalhive-1",
  storageBucket: "halalhive-1.firebasestorage.app",
  messagingSenderId: "1030529190896",
  appId: "1:1030529190896:web:2b3b1181f7aae006fcab35",
  measurementId: "G-J4S9RZ5XRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
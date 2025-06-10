// Import the functions you need from the SDKs you need
console.log("conectado al archivo firebase")
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8jY3NSlr8nYf8QBSseAS6XjPoqzpBk5Q",
  authDomain: "control-de-asistencia-329a8.firebaseapp.com",
  projectId: "control-de-asistencia-329a8",
  storageBucket: "control-de-asistencia-329a8.firebasestorage.app",
  messagingSenderId: "314711618322",
  appId: "1:314711618322:web:a3a96a23e96771ced379cb",
  measurementId: "G-4M1DBXDMED"
};








// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
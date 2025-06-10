
// ...existing code...
// Configura tu Firebase
const firebaseConfig = {
apiKey: "AIzaSyC8jY3NSlr8nYf8QBSseAS6XjPoqzpBk5Q",
  authDomain: "control-de-asistencia-329a8.firebaseapp.com",
  projectId: "control-de-asistencia-329a8",
  storageBucket: "control-de-asistencia-329a8.firebasestorage.app",
  messagingSenderId: "314711618322",
  appId: "1:314711618322:web:a3a96a23e96771ced379cb",
  measurementId: "G-4M1DBXDMED"
};
firebase.initializeApp(firebaseConfig);

// Configura FirebaseUI
const uiConfig = {
  signInSuccessUrl: 'alumno.html',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    // Puedes agregar Google, Facebook, etc.
  ],
};
const ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);
// ...existing code...
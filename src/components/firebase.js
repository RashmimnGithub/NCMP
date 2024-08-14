// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7iEx6xxZ5Na7dDNOuX7oG8Ghq1N0cXYQ",
  authDomain: "serene-tooling-420705.firebaseapp.com",
  projectId: "serene-tooling-420705",
  storageBucket: "serene-tooling-420705.appspot.com",
  messagingSenderId: "219608655218",
  appId: "1:219608655218:web:c632c2983eae789252a9eb",
  measurementId: "G-JS1F7VCQRN"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);

// export default app;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
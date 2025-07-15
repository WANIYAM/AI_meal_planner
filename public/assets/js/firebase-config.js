import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyDyrxAfmCUizgDA5C-t9zD-UcbxtdM_338",
  authDomain: "desimealplannerai.firebaseapp.com",
  projectId: "desimealplannerai",
  storageBucket: "desimealplannerai.firebasestorage.app",
  messagingSenderId: "345592750463",
  appId: "1:345592750463:web:2a98ed32b23ec3e712fa4a",
  measurementId: "G-J3ZY7TSZF4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export const storage = getStorage();
export { app, auth, db };

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Ganti nilai di bawah ini dengan config dari Firebase Console lo!
const firebaseConfig = {
  apiKey: "AIzaSyAiwJ3VZrX_PlKuaLBqb01wRu5RiN81QoQ",
  authDomain: "global-library-app.firebaseapp.com",
  projectId: "global-library-app",
  storageBucket: "global-library-app.firebasestorage.app",
  messagingSenderId: "123714643739",
  appId: "1:123714643739:web:f8a1c118c9ab0c89f895be"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

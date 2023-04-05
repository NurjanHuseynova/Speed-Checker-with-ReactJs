import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCMT2tHsWB8V2wVNXtwqmQYCePUHidZG0A",
  authDomain: "speed-checker-app-f6d84.firebaseapp.com",
  databaseURL:
    "https://speed-checker-app-f6d84-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "speed-checker-app-f6d84",
  storageBucket: "speed-checker-app-f6d84.appspot.com",
  messagingSenderId: "380696136159",
  appId: "1:380696136159:web:3b851a01f91fc3d42edc6a",
  measurementId: "G-GV1ZHQ3LRJ",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export { db };

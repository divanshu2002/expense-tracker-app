import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  push,
  get,
  child,
  query,
  orderByChild,
  onValue
} from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyAy9WgXVmLee1vdNCgsV8PCtXbA1NtD_1c",
  authDomain: "expense-tracker-6c73b.firebaseapp.com",
  databaseURL: "https://expense-tracker-6c73b-default-rtdb.firebaseio.com",
  projectId: "expense-tracker-6c73b",
  storageBucket: "expense-tracker-6c73b.firebasestorage.app",
  messagingSenderId: "977096333705",
  appId: "1:977096333705:web:95fe67e6ab5f3b25bca958",
  databaseUrl: "https://expense-tracker-6c73b-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);
export { db, ref, set, push, get, child, query, orderByChild ,onValue};

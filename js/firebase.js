import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_BElquXYWy6uRuGKqM7VgmZ0QUJMU43I",
  authDomain: "everestfc-efc777.firebaseapp.com",
  projectId: "everestfc-efc777",
  storageBucket: "everestfc-efc777.appspot.com",
  messagingSenderId: "983221158380",
  appId: "1:983221158380:web:d9aac4d382ee3654bf40c9",
  measurementId: "G-L7M2NQS8RK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);
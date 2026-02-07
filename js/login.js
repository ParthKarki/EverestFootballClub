import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB_BElquXYWy6uRuGKqM7VgmZ0QUJMU43I",
  authDomain: "everestfc-efc777.firebaseapp.com",
  projectId: "everestfc-efc777",
  storageBucket: "everestfc-efc777.appspot.com",
  messagingSenderId: "983221158380",
  appId: "1:983221158380:web:d9aac4d382ee3654bf40c9",
  measurementId: "G-L7M2NQS8RK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById("loginForm");
const errorDiv = document.getElementById("error");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "admin.html"; // redirect to dashboard
  } catch (err) {
    errorDiv.textContent = "Invalid email or password!";
    console.error(err);
  }
});

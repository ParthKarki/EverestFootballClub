import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

/* ---------------- ELEMENTS ---------------- */

const loginForm = document.getElementById("loginForm");
const errorDiv = document.getElementById("error");

/* ---------------- LOGIN HANDLER ---------------- */

loginForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {

    await signInWithEmailAndPassword(auth, email, password);

    // redirect to admin dashboard
    window.location.href = "admin.html";

  } catch (err) {

    console.error(err);

    errorDiv.textContent = "Invalid email or password!";
    errorDiv.style.display = "block";

  }

});
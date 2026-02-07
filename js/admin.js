import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

// Check login
onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "login.html";
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () =>
  signOut(auth).then(() => window.location.href = "login.html")
);

// Elements
const form = document.getElementById("teamForm");
const teamIdInput = document.getElementById("teamId");
const teamNameInput = document.getElementById("teamName");
const coachInput = document.getElementById("coach");
const playersContainer = document.getElementById("playersContainer");
const addPlayerBtn = document.getElementById("addPlayer");
const resetBtn = document.getElementById("resetForm");
const teamsList = document.getElementById("teamsList");
const messageDiv = document.getElementById("message");

// Show professional messages
function showMessage(text, type = "success") {
  messageDiv.textContent = text;
  messageDiv.style.display = "block";
  messageDiv.style.opacity = "1";
  messageDiv.style.background = type === "error" ? "#ff4e4e" : "#4e8cff";
  messageDiv.style.color = "#fff";
  setTimeout(() => {
    messageDiv.style.transition = "opacity 0.5s";
    messageDiv.style.opacity = "0";
    setTimeout(() => { messageDiv.style.display = "none"; }, 500);
  }, 3000);
}

// Create player input block
function createPlayerBlock(player = {}) {
  const div = document.createElement("div");
  div.classList.add("player");
  div.innerHTML = `
    <label>Player Name:</label><input type="text" class="pname" value="${player.name||''}" required>
    <label>Jersey Number:</label><input type="number" class="pjersey" value="${player.jersey||''}" required>
    <label>Age:</label><input type="number" class="page" value="${player.age||''}" required>
    <label>Position:</label><input type="text" class="pposition" value="${player.position||''}" required>
    <button type="button" class="removePlayer">Remove Player</button>
  `;
  div.querySelector(".removePlayer").addEventListener("click", () => div.remove());
  playersContainer.appendChild(div);
}

addPlayerBtn.addEventListener("click", () => createPlayerBlock());
resetBtn.addEventListener("click", () => {
  form.reset(); 
  teamIdInput.value = ""; 
  playersContainer.innerHTML = "";
});

// Save team
form.addEventListener("submit", async e => {
  e.preventDefault();
  const teamData = {
    teamName: teamNameInput.value,
    coach: coachInput.value,
    players: Array.from(playersContainer.children).map(div => ({
      name: div.querySelector(".pname").value,
      jersey: Number(div.querySelector(".pjersey").value),
      age: Number(div.querySelector(".page").value),
      position: div.querySelector(".pposition").value
    }))
  };

  try {
    if (teamIdInput.value) {
      await updateDoc(doc(db, "teams", teamIdInput.value), teamData);
      showMessage("✅ Team updated successfully!");
    } else {
      await addDoc(collection(db, "teams"), teamData);
      showMessage("✅ Team added successfully!");
    }
    form.reset(); 
    playersContainer.innerHTML = ""; 
    teamIdInput.value = "";
    loadTeams();
  } catch (err) {
    console.error(err);
    showMessage("❌ Error saving team.", "error");
  }
});

// Load teams
async function loadTeams() {
  teamsList.innerHTML = "";
  const snapshot = await getDocs(collection(db, "teams"));
  snapshot.forEach(docSnap => {
    const team = docSnap.data();
    const div = document.createElement("div");
    div.classList.add("team");
    div.innerHTML = `
      <div class="team-header">
        <strong>${team.teamName} (Coach: ${team.coach})</strong>
        <div>
          <button class="edit">Edit</button>
          <button class="delete" style="background:#ff4e4e;">Delete</button>
        </div>
      </div>
      <table>
        <thead><tr><th>Player</th><th>Jersey</th><th>Age</th><th>Position</th></tr></thead>
        <tbody>${team.players.map(p => `<tr><td>${p.name}</td><td>${p.jersey}</td><td>${p.age}</td><td>${p.position}</td></tr>`).join('')}</tbody>
      </table>
    `;

    // Edit
    div.querySelector(".edit").addEventListener("click", () => {
      teamIdInput.value = docSnap.id;
      teamNameInput.value = team.teamName;
      coachInput.value = team.coach;
      playersContainer.innerHTML = "";
      team.players.forEach(p => createPlayerBlock(p));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Delete with inline confirmation
    div.querySelector(".delete").addEventListener("click", () => {
      if (div.querySelector(".confirmDelete")) return;

      const confirmDiv = document.createElement("div");
      confirmDiv.classList.add("confirmDelete");
      confirmDiv.style.marginTop = "10px";
      confirmDiv.style.padding = "10px";
      confirmDiv.style.background = "#fff3f3";
      confirmDiv.style.border = "1px solid #ff4e4e";
      confirmDiv.style.borderRadius = "6px";
      confirmDiv.style.display = "flex";
      confirmDiv.style.justifyContent = "space-between";
      confirmDiv.style.alignItems = "center";

      confirmDiv.innerHTML = `
        <span>Are you sure you want to delete this team?</span>
        <div>
          <button class="yesDelete" style="background:#ff4e4e; color:#fff; margin-right:5px; border:none; padding:5px 10px; border-radius:4px;">Yes</button>
          <button class="noDelete" style="background:#ccc; color:#333; border:none; padding:5px 10px; border-radius:4px;">No</button>
        </div>
      `;

      div.appendChild(confirmDiv);

      confirmDiv.querySelector(".noDelete").addEventListener("click", () => confirmDiv.remove());
      confirmDiv.querySelector(".yesDelete").addEventListener("click", async () => {
        await deleteDoc(doc(db, "teams", docSnap.id));
        showMessage("✅ Team deleted successfully!");
        loadTeams();
      });
    });

    teamsList.appendChild(div);
  });
}

// Initial load
loadTeams();

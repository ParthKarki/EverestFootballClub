import { db, auth } from "./firebase.js";
import { initMenuToggle, initProgressBar } from "./ui.js";

import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

/* ---------------- UI INIT ---------------- */

initMenuToggle();
initProgressBar();

/* ---------------- AUTH GUARD ---------------- */

onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "login.html";
});

/* ---------------- LOGOUT ---------------- */

document.getElementById("logoutBtn").addEventListener("click", () =>
  signOut(auth).then(() => window.location.href = "login.html")
);

/* ---------------- ELEMENTS ---------------- */

const form = document.getElementById("teamForm");
const teamIdInput = document.getElementById("teamId");
const teamNameInput = document.getElementById("teamName");
const coachInput = document.getElementById("coach");
const playersContainer = document.getElementById("playersContainer");
const addPlayerBtn = document.getElementById("addPlayer");
const resetBtn = document.getElementById("resetForm");
const teamsList = document.getElementById("teamsList");
const messageDiv = document.getElementById("message");
const searchInput = document.getElementById("searchTeam");

const playerTemplate = document.getElementById("playerTemplate");

let allTeams = [];

/* ---------------- MESSAGE ---------------- */

function showMessage(text, type = "success") {

  messageDiv.textContent = text;
  messageDiv.style.display = "block";
  messageDiv.style.opacity = "1";

  messageDiv.style.background =
    type === "error" ? "#ff4e4e" : "#4e8cff";

  messageDiv.style.color = "#fff";

  setTimeout(() => {

    messageDiv.style.transition = "opacity 0.5s";
    messageDiv.style.opacity = "0";

    setTimeout(() => {
      messageDiv.style.display = "none";
    }, 500);

  }, 3000);
}

/* ---------------- CREATE PLAYER CARD ---------------- */

function createPlayerBlock(player = {}) {

  const clone = playerTemplate.content.cloneNode(true);
  const card = clone.querySelector(".player-card");

  const nameInput = clone.querySelector(".playerName");
  const jerseyInput = clone.querySelector(".playerNumber");
  const ageInput = clone.querySelector(".playerAge");
  const positionInput = clone.querySelector(".playerPosition");
  const preview = clone.querySelector(".player-name-preview");

  nameInput.value = player.name || "";
  jerseyInput.value = player.jersey || "";
  ageInput.value = player.age || "";
  positionInput.value = player.position || "";

  preview.textContent =
    `${player.jersey ? "#" + player.jersey : ""} ${player.name || "Unnamed player"}`;

  /* toggle editor */

 clone.querySelector(".togglePlayer").addEventListener("click", (e) => {

  card.classList.toggle("open");

  e.target.textContent =
    card.classList.contains("open") ? "Close" : "Edit";

});
  /* remove player */

  clone.querySelector(".removePlayer").addEventListener("click", () => {
    card.remove();
  });

  /* update preview */

  function updatePreview(){
    const name = nameInput.value || "Unnamed";
    const jersey = jerseyInput.value ? "#" + jerseyInput.value : "";
    preview.textContent = `${jersey} ${name}`;
  }

  nameInput.addEventListener("input", updatePreview);
  jerseyInput.addEventListener("input", updatePreview);

  /* ADD TO PAGE (missing before) */

  playersContainer.appendChild(clone);

}
/* ---------------- ADD PLAYER ---------------- */

addPlayerBtn.addEventListener("click", () => {
  createPlayerBlock();
  const last = playersContainer.lastElementChild;
  if(last) last.classList.add("open");
});

/* ---------------- RESET FORM ---------------- */

resetBtn.addEventListener("click", () => {

  form.reset();
  teamIdInput.value = "";
  playersContainer.innerHTML = "";

});

/* ---------------- SAVE TEAM ---------------- */

form.addEventListener("submit", async e => {

  e.preventDefault();

const players = Array.from(
  playersContainer.querySelectorAll(".player-card")
)
.map(card => ({
  name: card.querySelector(".playerName").value.trim(),
  jersey: card.querySelector(".playerNumber").value,
  age: card.querySelector(".playerAge").value,
  position: card.querySelector(".playerPosition").value.trim()
}))
.filter(p => p.name !== "" && p.jersey !== "" && p.age !== "");

  if (!teamNameInput.value.trim()) {
    showMessage("Team name required", "error");
    return;
  }

  const teamData = {
    teamName: teamNameInput.value,
    coach: coachInput.value,
    players
  };

  try {

    if (teamIdInput.value) {

      await updateDoc(
        doc(db, "teams", teamIdInput.value),
        teamData
      );

      showMessage("Team updated");

    } else {

      await addDoc(
        collection(db, "teams"),
        teamData
      );

      showMessage("Team added");

    }

    form.reset();
    playersContainer.innerHTML = "";
    teamIdInput.value = "";

  } catch (err) {

    console.error(err);
    showMessage("Error saving team", "error");

  }

});

/* ---------------- RENDER TEAMS ---------------- */

function renderTeams(teams) {

  teamsList.innerHTML = "";

  teams.forEach(team => {

    const playersRows = team.players
      .sort((a,b)=>a.jersey-b.jersey)
      .map(p => `
        <tr>
          <td>${p.name}</td>
          <td>${p.jersey}</td>
          <td>${p.age}</td>
          <td>${p.position}</td>
        </tr>
      `).join("");

    const div = document.createElement("div");
    div.classList.add("team");

    div.innerHTML = `
      <div class="team-header">
        <strong>${team.teamName} (Coach: ${team.coach})</strong>
        <div class="team-actions">
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Jersey</th>
            <th>Age</th>
            <th>Position</th>
          </tr>
        </thead>

        <tbody>
          ${playersRows}
        </tbody>
      </table>
    `;

    /* EDIT TEAM */

    div.querySelector(".edit").addEventListener("click", () => {

      teamIdInput.value = team.id;
      teamNameInput.value = team.teamName;
      coachInput.value = team.coach;

      playersContainer.innerHTML = "";

      team.players.forEach(p => createPlayerBlock(p));

      window.scrollTo({ top: 0, behavior: "smooth" });

    });

    /* DELETE TEAM */

    div.querySelector(".delete").addEventListener("click", () => {

      if (confirm("Delete this team?")) {

        deleteDoc(doc(db, "teams", team.id));
        showMessage("Team deleted");

      }

    });

    teamsList.appendChild(div);

  });
}

/* ---------------- REALTIME TEAMS ---------------- */

onSnapshot(collection(db, "teams"), snapshot => {

  allTeams = snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  }));

  renderTeams(allTeams);

});

/* ---------------- SEARCH ---------------- */

searchInput.addEventListener("input", () => {

  const value = searchInput.value.toLowerCase();

  const filtered = allTeams.filter(t =>
    t.teamName.toLowerCase().includes(value)
  );

  renderTeams(filtered);

});
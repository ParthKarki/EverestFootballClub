import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import {
  initMenuToggle,
  initProgressBar,
  initHeaderScroll,
  initScrollTop,
  initScrollAnimations
} from "./ui.js";

/* ---------------- INIT UI ---------------- */

initMenuToggle();
initProgressBar();
initHeaderScroll();
initScrollTop();
initScrollAnimations();

/* ---------------- ELEMENTS ---------------- */

const container = document.getElementById("teamsContainer");

/* ---------------- LOAD TEAMS ---------------- */

async function loadTeams() {

  if (!container) return;

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "teams"));

  snapshot.forEach(docSnap => {

    const team = docSnap.data();

    const playersRows = team.players
      .map(p => `
        <tr>
          <td>${p.name}</td>
          <td>${p.jersey}</td>
          <td>${p.position}</td>
        </tr>
      `)
      .join("");

    const div = document.createElement("div");
    div.classList.add("team-card");

    div.innerHTML = `
      <div class="team-header">
        <div class="team-info">
          <h3>${team.teamName}</h3>
          <p>Coach: ${team.coach}</p>
          <p>Players: ${team.players.length}</p>
        </div>
      </div>

      <div class="team-players">
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Jersey</th>
              <th>Position</th>
            </tr>
          </thead>

          <tbody>
            ${playersRows}
          </tbody>
        </table>
      </div>
    `;

    container.appendChild(div);

  });

}

loadTeams();
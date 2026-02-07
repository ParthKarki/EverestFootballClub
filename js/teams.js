import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB_BElquXYWy6uRuGKqM7VgmZ0QUJMU43I",
  authDomain: "everestfc-efc777.firebaseapp.com",
  projectId: "everestfc-efc777",
  storageBucket: "everestfc-efc777.appspot.com",
  messagingSenderId: "983221158380",
  appId: "1:983221158380:web:d9aac4d382ee3654bf40c9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const container = document.getElementById("teamsContainer");

async function loadTeams() {
  container.innerHTML = "";
  const snapshot = await getDocs(collection(db, "teams"));

  snapshot.forEach(docSnap => {
    const team = docSnap.data();
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
            <tr><th>Player</th><th>Jersey</th><th>Age</th><th>Position</th></tr>
          </thead>
          <tbody>
            ${team.players.map(p => `<tr>
              <td>${p.name}</td>
              <td>${p.jersey}</td>
              <td>${p.age}</td>
              <td>${p.position}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    `;

    container.appendChild(div);
  });
}

loadTeams();
// ------------------- Scroll To Section -------------------
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
    document.getElementById('navLinks').classList.remove('active');
}


// ------------------- Menu Toggle -------------------
document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});
// ------------------- Progress Bar -------------------
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progressBar').style.width = scrolled + '%';

    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

// ------------------- Scroll Animations -------------------
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');

                // Animate numbers
                if (entry.target.classList.contains('stat-card') && !animatedNumbers) {
                    animateNumbers();
                    animatedNumbers = true;
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}
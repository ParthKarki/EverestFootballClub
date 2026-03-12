/* ---------------- MENU TOGGLE ---------------- */

export function initMenuToggle() {

  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navLinks");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

}


/* ---------------- PROGRESS BAR ---------------- */

export function initProgressBar() {

  const bar = document.getElementById("progressBar");

  if (!bar) return;

  window.addEventListener("scroll", () => {

    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;

    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const progress = (scrollTop / height) * 100;

    bar.style.width = progress + "%";

  });

}


/* ---------------- HEADER SCROLL EFFECT ---------------- */

export function initHeaderScroll() {

  const header = document.getElementById("header");

  if (!header) return;

  window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

  });

}


/* ---------------- SCROLL TO SECTION ---------------- */

export function scrollToSection(id) {

  const element = document.getElementById(id);
  const nav = document.getElementById("navLinks");

  if (!element) return;

  const offset = 80;

  const position =
    element.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({
    top: position,
    behavior: "smooth"
  });

  if (nav) nav.classList.remove("active");

}


/* ---------------- SCROLL TO TOP BUTTON ---------------- */

export function initScrollTop() {

  const btn = document.getElementById("scrollTopBtn");

  if (!btn) return;

  window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }

  });

  btn.addEventListener("click", () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });

}


/* ---------------- SCROLL ANIMATIONS ---------------- */

export function initScrollAnimations() {

  const elements = document.querySelectorAll(".animate-on-scroll");

  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
      }

    });

  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));

}
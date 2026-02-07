let gallery = [];
let animatedNumbers = false;

// ------------------- Load & Init -------------------
window.addEventListener('load', () => {
    loadGallery();
    initScrollAnimations();
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

// ------------------- Animate Numbers -------------------
function animateNumbers() {
    document.querySelectorAll('.stat-number').forEach(num => {
        const target = parseInt(num.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                num.textContent = target + '+';
                clearInterval(timer);
            } else {
                num.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// ------------------- Load Gallery -------------------


// 🔥 AUTO-REBUILD IF EMPTY
async function loadGallery() {
    const stored = localStorage.getItem('gallery-images');

    if (!stored || stored === '[]') {
        console.warn('Gallery empty, rebuilding...');
        rebuildGalleryFromFolder(); // render happens INSIDE
        return;
    }

    gallery = JSON.parse(stored);
    renderGallery();
}


// ------------------- Render Gallery Preview -------------------
function renderGallery() {
    const container = document.getElementById('galleryContainer');
    const seeMoreBtn = document.getElementById('seeMoreBtn');
    if (!container) return;

    const imagesToShow = gallery.slice(-6).reverse(); // latest 6

    // Empty gallery fallback
    if (imagesToShow.length === 0) {
        container.innerHTML = `
            <div class="empty-gallery">
                <div style="font-size:5rem;opacity:0.2;margin-bottom:1.5rem">📷</div>
                <p style="color:#6b7280;font-size:1.1rem;font-weight:500">No photos yet.</p>
            </div>
        `;
        if (seeMoreBtn) seeMoreBtn.style.display = 'none';
        return;
    }

    container.innerHTML = '<div class="gallery-grid">' + imagesToShow.map((img, index) => `
        <div class="gallery-item animate-on-scroll" style="animation-delay: ${index * 0.1}s">
            <img src="${img.url}" alt="${img.title}">
            <div class="gallery-overlay">
                <p style="color:white;font-weight:600">${img.title}</p>
            </div>
        </div>
    `).join('') + '</div>';

    // Show "See More" button if container is a preview and gallery has more than 8 images
    if (seeMoreBtn) {
        if (container.classList.contains('gallery-preview') && gallery.length > 6) {
            seeMoreBtn.style.display = 'inline-block';
            seeMoreBtn.onclick = () => { window.location.href = 'gallery.html'; };
        } else {
            seeMoreBtn.style.display = 'none';
        }
    }

    initScrollAnimations();
}

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

// ------------------- Close Modal on Outside Click -------------------
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) e.target.classList.remove('active');
});

// ------------------- Parallax Hero -------------------
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) hero.style.transform = `translateY(${scrolled * 0.5}px)`;
});
function rebuildGalleryFromFolder() {
    const folderPath = 'images/gallery/img';
    const maxTry = 100;
    const extensions = ['jpg', 'jpeg', 'png', 'webp'];

    let index = 1;
    let rebuiltGallery = [];

    function tryNext() {
        if (index > maxTry) {
            localStorage.setItem('gallery-images', JSON.stringify(rebuiltGallery));
            gallery = rebuiltGallery;
            renderGallery();
            return;
        }

        let extIndex = 0;

        function tryExt() {
            if (extIndex >= extensions.length) {
                index++;
                tryNext();
                return;
            }

            const src = `${folderPath}${index}.${extensions[extIndex]}`;
            const img = new Image();
            img.src = src;

            img.onload = () => {
                rebuiltGallery.push({
                    url: src,
                    title: `Everest FA`
                });
                index++;
                tryNext();
            };

            img.onerror = () => {
                extIndex++;
                tryExt();
            };
        }

        tryExt();
    }

    tryNext();
}

// ==================== CONTACT FORM ====================
document.addEventListener("DOMContentLoaded", function () {
  // Initialize EmailJS
  emailjs.init("Jv4ZWm5CNAkUSFpEA"); // Replace with your EmailJS public key

  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");

  if (!form || !status) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent page reload

    // Honeypot spam check
    if (form.company.value.trim() !== "") return; // Bot detected

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();

    // Validation
    if (!name || !email || !phone || !message) {
      status.style.color = "#dc2626";
      status.textContent = "❌ Please fill in all fields";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      status.style.color = "#dc2626";
      status.textContent = "❌ Please enter a valid email";
      return;
    }

    // Disable submit button while sending
    const submitBtn = form.querySelector(".submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending... ⏳";
    status.style.color = "#2563eb";
    status.textContent = "⏳ Sending your message...";

    // Send email via EmailJS
    emailjs
      .sendForm("service_boygds7", "template_500sthk", form)
      .then(() => {
        status.style.color = "#16a34a";
        status.textContent = "✅ Message sent successfully!";
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";

        setTimeout(() => (status.textContent = ""), 4000);
      })
      .catch((err) => {
        console.error("EmailJS Error:", err);
        status.style.color = "#dc2626";
        status.textContent = "❌ Failed to send message. Try again!";
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      });
  });
});

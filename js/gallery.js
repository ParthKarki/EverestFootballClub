const galleryContainer = document.getElementById('galleryContainer');
const folderPath = '/images/gallery/img';
const maxTry = 1000;
const extensions = ['jpg', 'jpeg', 'png', 'webp'];

let galleryData = [];

function loadGallery() {
    // 🔥 STEP 1: CLEAR EVERYTHING
    galleryContainer.innerHTML = '';
    galleryData = [];
    localStorage.removeItem('gallery-images');

    let index = 1;

    function tryLoadNext() {
        if (index > maxTry) {
            // 🔥 STEP 4: SAVE FINAL RESULT
            localStorage.setItem('gallery-images', JSON.stringify(galleryData));
            console.log(`Gallery rebuilt with ${galleryData.length} images`);
            return;
        }

        let extIndex = 0;

        function tryExtension() {
            if (extIndex >= extensions.length) {
                index++;
                tryLoadNext();
                return;
            }

            const ext = extensions[extIndex];
            const src = `${folderPath}${index}.${ext}`;
            const img = new Image();
            img.src = src;

            img.onload = () => {
                // 🔥 STEP 3: STORE IMAGE
                galleryData.push({
                    url: src,
                    title: `Everest FA`
                });

                const div = document.createElement('div');
                div.className = 'gallery-item animate-on-scroll';
                div.innerHTML = `
                    <img src="${src}" alt="Gallery Image ${index}">
                    <div class="gallery-overlay">
                        <p>Everest FA</p>
                    </div>
                `;
                galleryContainer.appendChild(div);

                index++;
                tryLoadNext();
            };

            img.onerror = () => {
                extIndex++;
                tryExtension();
            };
        }

        tryExtension();
    }

    tryLoadNext();
}

// Scroll animation
function animateOnScroll() {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
            el.classList.add('animated');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', () => {
    loadGallery();
    animateOnScroll();
});
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
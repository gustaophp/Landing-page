/* ═══════════════════════════════════════════════════════════
   EXTREMA MTB — Interactivity
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ── NAVBAR: scroll effect + hamburger ───────────────────── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('navMobileMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 90);
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

/* ── HERO IMAGE: pan effect on load ─────────────────────── */
const heroImg = document.querySelector('.hero-img');
if (heroImg) {
  heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
  if (heroImg.complete) heroImg.classList.add('loaded');
}

/* ── HERO PARTICLES ──────────────────────────────────────── */
function spawnParticle() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 4 + 2;
  p.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${Math.random() * 100}%;
    bottom: ${Math.random() * 20}%;
    animation-duration: ${Math.random() * 6 + 5}s;
    animation-delay: ${Math.random() * 2}s;
    opacity: 0;
  `;
  container.appendChild(p);
  setTimeout(() => p.remove(), 10000);
}

setInterval(spawnParticle, 700);
for (let i = 0; i < 6; i++) spawnParticle();

/* ── REVEAL ON SCROLL ────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach(el => revealObs.observe(el));

/* ── CHARACTER CAROUSEL ──────────────────────────────────── */
const cards = document.querySelectorAll('.char-card');
const dots = document.querySelectorAll('.char-dot');
let current = 0;
let autoTimer = null;

function showChar(idx) {
  cards.forEach((c, i) => c.classList.toggle('active', i === idx));
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  current = idx;
}

document.getElementById('charPrev').addEventListener('click', () => {
  resetAutoplay();
  const n = (current - 1 + cards.length) % cards.length;
  showChar(n);
});
document.getElementById('charNext').addEventListener('click', () => {
  resetAutoplay();
  showChar((current + 1) % cards.length);
});
dots.forEach(d => d.addEventListener('click', () => {
  resetAutoplay();
  showChar(+d.dataset.target);
}));

function startAutoplay() {
  autoTimer = setInterval(() => showChar((current + 1) % cards.length), 5000);
}
function resetAutoplay() {
  clearInterval(autoTimer);
  startAutoplay();
}
startAutoplay();

/* ── NEWSLETTER FORM ─────────────────────────────────────── */
const form = document.getElementById('betaForm');
const nlSuccess = document.getElementById('nlSuccess');
const nlSubmit = document.getElementById('nlSubmit');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('nlName').value.trim();
    const email = document.getElementById('nlEmail').value.trim();

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      shakeForm(form);
      return;
    }

    // Simulate sending
    nlSubmit.querySelector('.btn-text').style.display = 'none';
    nlSubmit.querySelector('.btn-spinner').style.display = 'inline';
    nlSubmit.disabled = true;

    await new Promise(r => setTimeout(r, 1400));

    form.style.display = 'none';
    nlSuccess.style.display = 'block';
    nlSuccess.classList.add('visible');

    // Log for demo
    console.log('[Extrema MTB] Beta signup:', { name, email });
  });
}

function shakeForm(el) {
  el.style.animation = 'none';
  el.style.transform = 'translateX(-8px)';
  setTimeout(() => el.style.transform = 'translateX(8px)', 80);
  setTimeout(() => el.style.transform = 'translateX(-5px)', 160);
  setTimeout(() => el.style.transform = 'translateX(5px)', 240);
  setTimeout(() => el.style.transform = '', 320);
}

/* ── BACK TO TOP ─────────────────────────────────────────── */
const backToTopBtn = document.getElementById('backToTop');
backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── STAT COUNTER ANIMATION ──────────────────────────────── */
const statVals = document.querySelectorAll('.stat-val');
const counterObs = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.textContent;
        if (target === '∞') return;
        const num = parseInt(target, 10);
        if (isNaN(num)) return;
        let current = 0;
        const step = Math.max(1, Math.floor(num / 30));
        const ticker = setInterval(() => {
          current = Math.min(current + step, num);
          el.textContent = current + (target.includes('+') ? '+' : '');
          if (current >= num) clearInterval(ticker);
        }, 40);
        counterObs.unobserve(el);
      }
    });
  },
  { threshold: 0.8 }
);
statVals.forEach(el => counterObs.observe(el));

/* ── SMOOTH ANCHOR SCROLL (nav) ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ── PARALLAX on hero ────────────────────────────────────── */
window.addEventListener('scroll', () => {
  if (!heroImg) return;
  const y = window.scrollY;
  heroImg.style.transform = `scale(1) translateY(${y * 0.25}px)`;
}, { passive: true });

/* ── FEAT CARD TILT ──────────────────────────────────────── */
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── 11. GALLERY LIGHTBOX ────────────────────────────────── */
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('galleryLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

if (galleryItems.length > 0 && lightbox) {
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src');
      if (src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightboxImg.src = '';
    }, 300);
  };

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ── 12. GALLERY SLIDER ──────────────────────────────────── */
const gallerySlider = document.getElementById('gallerySlider');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');

if (gallerySlider && galleryPrev && galleryNext) {
  const scrollAmount = 320; // Aproximadamente card (300) + gap (1.5rem)

  galleryPrev.addEventListener('click', () => {
    gallerySlider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  galleryNext.addEventListener('click', () => {
    gallerySlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

/* ── 13. TEAM SLIDER ─────────────────────────────────────── */
const teamSlider = document.getElementById('teamSlider');
const teamPrev = document.getElementById('teamPrev');
const teamNext = document.getElementById('teamNext');

if (teamSlider && teamPrev && teamNext) {
  const teamScrollAmount = 280; // Card (250) + gap (1.5rem)

  teamPrev.addEventListener('click', () => {
    teamSlider.scrollBy({ left: -teamScrollAmount, behavior: 'smooth' });
  });

  teamNext.addEventListener('click', () => {
    teamSlider.scrollBy({ left: teamScrollAmount, behavior: 'smooth' });
  });
}

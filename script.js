// ===== SCROLL-TRIGGERED FADE IN =====
const fadeElements = document.querySelectorAll('.fade-in-up');

const observerOptions = {
  threshold: 0.05,
  rootMargin: '20px 0px -20px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger children within the same parent section
      const siblings = entry.target.parentElement.querySelectorAll('.fade-in-up');
      let delay = 0;
      siblings.forEach(sib => {
        if (!sib.classList.contains('visible')) {
          setTimeout(() => sib.classList.add('visible'), delay);
          delay += 120;
        }
      });
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeElements.forEach(el => observer.observe(el));

// ===== HERO SLIDESHOW =====
const heroSlides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

setInterval(() => {
  const prevSlide = currentSlide;
  currentSlide = (currentSlide + 1) % heroSlides.length;

  // Move old slide to 'prev' (stays visible behind, no transition)
  heroSlides[prevSlide].classList.remove('active');
  heroSlides[prevSlide].classList.add('prev');

  // New slide fades in on top (opacity 0 → 1 over 2s)
  heroSlides[currentSlide].classList.add('active');

  // After fade-in completes, hide the old slide instantly
  setTimeout(() => {
    heroSlides[prevSlide].classList.remove('prev');
  }, 1300);
}, 4000);

// ===== PARALLAX ON HERO IMAGE =====
const heroImg = document.querySelector('.hero-img-wrap');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroHeight = document.querySelector('.hero').offsetHeight;

  if (scrolled < heroHeight) {
    const rate = scrolled / heroHeight;
    if (heroImg) {
      heroImg.style.transform = `scale(${1 + scrolled * 0.0003}) translateY(${scrolled * 0.3}px)`;
    }
    if (heroContent) {
      heroContent.style.opacity = 1 - rate * 1.8;
      heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
  }
});

// ===== YEAR DISPLAY =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== CONFETTI =====
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let confettiPieces = [];
let animationId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const confettiColors = [
  '#c9a96e', '#ddc48e', '#8ba4c4', '#a7c4e6',
  '#e8ecf2', '#6b7a90', '#fff', '#f0d8a0'
];

class ConfettiPiece {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = -20 - Math.random() * canvas.height * 0.5;
    this.size = Math.random() * 6 + 3;
    this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    this.speedY = Math.random() * 2.5 + 1.5;
    this.speedX = Math.random() * 1.5 - 0.75;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 4 - 2;
    this.opacity = 1;
    this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
    this.wobble = Math.random() * 10;
    this.wobbleSpeed = Math.random() * 0.08 + 0.02;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.wobble) * 0.4;
    this.wobble += this.wobbleSpeed;
    this.rotation += this.rotationSpeed;

    if (this.y > canvas.height - 50) {
      this.opacity -= 0.015;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.fillStyle = this.color;

    if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

function launchConfetti() {
  confettiPieces = [];
  for (let i = 0; i < 180; i++) {
    confettiPieces.push(new ConfettiPiece());
  }
  if (animationId) cancelAnimationFrame(animationId);
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiPieces = confettiPieces.filter(p => p.opacity > 0);

  confettiPieces.forEach(p => {
    p.update();
    p.draw();
  });

  if (confettiPieces.length > 0) {
    animationId = requestAnimationFrame(animateConfetti);
  }
}

document.getElementById('confettiBtn').addEventListener('click', launchConfetti);

// ===== BIRTHDAY CARD EXPLODE =====
const birthdayCard = document.getElementById('birthdayCard');
const cardReveal = document.getElementById('cardReveal');
let cardOpened = false;

birthdayCard.addEventListener('click', () => {
  if (cardOpened) return;
  cardOpened = true;

  // Launch confetti
  launchConfetti();

  // Explode card away
  birthdayCard.classList.add('exploded');

  // After card fades, reveal the photo
  setTimeout(() => {
    birthdayCard.style.display = 'none';
    cardReveal.classList.add('visible');
  }, 500);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

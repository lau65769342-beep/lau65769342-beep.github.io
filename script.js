const progress = document.querySelector('.page-progress span');
const glow = document.querySelector('.cursor-glow');
const revealItems = [...document.querySelectorAll('[data-reveal]')];
const navLinks = [...document.querySelectorAll('.nav-links a')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
};

const updateActiveNav = () => {
  const marker = window.scrollY + window.innerHeight * 0.34;
  let current = sections[0]?.id;
  sections.forEach((section) => {
    if (section.offsetTop <= marker) current = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};

window.addEventListener('scroll', () => {
  updateProgress();
  updateActiveNav();
}, { passive: true });

window.addEventListener('pointermove', (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
}, { passive: true });

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.animate(
        [
          { opacity: 1, transform: 'translateY(24px) scale(.992)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' }
        ],
        { duration: 720, easing: 'cubic-bezier(.2,.75,.2,1)', fill: 'both' }
      );
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  revealItems.forEach((item) => observer.observe(item));
}

updateProgress();
updateActiveNav();

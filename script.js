const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');
const scrollProgress = document.getElementById('scroll-progress');

const closeMenu = () => {
  menuToggle.classList.remove('is-open');
  mobileNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
  document.body.classList.remove('menu-open');
};

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.classList.toggle('is-open');
  mobileNav.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('menu-open', isOpen);
});

mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileNav.classList.contains('is-open')) {
    closeMenu();
    menuToggle.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900 && mobileNav.classList.contains('is-open')) closeMenu();
});

const updateScrollState = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  scrollProgress.style.width = `${Math.min(progress, 100)}%`;
};

updateScrollState();
window.addEventListener('scroll', updateScrollState, { passive: true });

const activeSectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: '-35% 0px -55%', threshold: 0 }
);

sections.forEach((section) => activeSectionObserver.observe(section));

const revealItems = document.querySelectorAll('.reveal');

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -50px' }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

document.getElementById('current-year').textContent = new Date().getFullYear();

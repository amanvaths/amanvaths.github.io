(function () {
  'use strict';

  document.getElementById('year').textContent = new Date().getFullYear();

  /* Hero Slider */
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  let slideIndex = 0;
  let slideTimer;

  function goSlide(i) {
    slideIndex = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => {
      s.classList.toggle('hero__slide--active', idx === slideIndex);
    });
    dots.forEach((d, idx) => {
      d.classList.toggle('hero__dot--active', idx === slideIndex);
    });
  }

  function startSlider() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => goSlide(slideIndex + 1), 6000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goSlide(i);
      startSlider();
    });
  });

  if (slides.length > 1) startSlider();

  /* Mobile Nav */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* Scroll Spy */
  const sections = document.querySelectorAll('section[id], .cta-banner[id]');
  const dockLinks = document.querySelectorAll('.mobile-dock a');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

  function setActive(id) {
    dockLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.nav === id));
    navLinks.forEach((a) => {
      const href = a.getAttribute('href').slice(1);
      a.classList.toggle('is-active', href === id);
    });
  }

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );

  sections.forEach((s) => spy.observe(s));

  /* Counter Animation */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1800;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString();
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString();
        }

        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => counterObserver.observe(c));

  /* Reveal */
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  reveals.forEach((el) => revealObs.observe(el));

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = window.innerWidth <= 900 ? 70 : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  setActive('top');
})();

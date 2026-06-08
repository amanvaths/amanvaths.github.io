(function () {
  'use strict';

  document.getElementById('year').textContent = new Date().getFullYear();

  const header = document.querySelector('.header');
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  const dockItems = document.querySelectorAll('.app-dock__item');
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');

  const sections = ['top', 'about', 'organization', 'expertise', 'projects', 'writing', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function setActiveNav(id) {
    const key = id === 'top' ? 'top' : id;
    dockItems.forEach((item) => {
      item.classList.toggle('is-active', item.dataset.nav === key);
    });
    navLinks.forEach((link) => {
      const href = link.getAttribute('href').slice(1);
      link.classList.toggle('is-active', href === key);
    });
  }

  // Header scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
    if (window.innerWidth <= 900) {
      header.style.transform = y > lastScroll && y > 120 ? 'translateY(-110%)' : 'translateY(0)';
    } else {
      header.style.transform = '';
    }
    lastScroll = y;
  }, { passive: true });

  // Mobile menu
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Scroll spy
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    },
    { rootMargin: '-40% 0px -45% 0px', threshold: 0 }
  );

  sections.forEach((section) => spyObserver.observe(section));

  // Smooth anchor scroll with offset
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = window.innerWidth <= 900
        ? 80
        : 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 50);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  reveals.forEach((el) => revealObserver.observe(el));

  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 100 + i * 80);
    });
    setActiveNav('top');
  });

  // Resize: reset header
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      header.style.transform = '';
      links.classList.remove('open');
      toggle.classList.remove('open');
    }
  }, { passive: true });
})();

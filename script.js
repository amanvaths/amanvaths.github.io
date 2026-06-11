(function () {
  'use strict';

  document.getElementById('year').textContent = new Date().getFullYear();

  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  const navLinks = document.querySelectorAll('.nav__links a, .nav__mobile a');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const open = navMobile.hidden;
    navMobile.hidden = !open;
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });

  navMobile.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navMobile.hidden = true;
      navToggle.classList.remove('open');
    });
  });

  /* Scroll spy */
  const sections = document.querySelectorAll('section[id], .cta[id]');
  const dockLinks = document.querySelectorAll('.dock a[data-nav]');

  function setActive(id) {
    dockLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.nav === id));
    document.querySelectorAll('.nav__links a[href^="#"]').forEach((a) => {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
    });
  }

  const spy = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
    { rootMargin: '-40% 0px -45% 0px', threshold: 0 }
  );
  sections.forEach((s) => spy.observe(s));

  /* Counters */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const target = +el.dataset.count;
      const start = performance.now();
      const dur = 1800;
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    }, { threshold: 0.5 });
    obs.observe(el);
  });

  /* Reveal */
  const revealObs = new IntersectionObserver(
    (entries) => entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 50);
        revealObs.unobserve(e.target);
      }
    }),
    { threshold: 0.08 }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' });
    });
  });

  setActive('top');
})();

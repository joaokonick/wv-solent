'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL
  const hdr = document.getElementById('hdr');
  if (hdr) {
    const onScroll = () => hdr.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── MOBILE BURGER
  const burger = document.getElementById('navBurger');
  const links  = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ── SCROLL REVEAL
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.js-reveal').forEach(el => io.observe(el));

  const ios = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); ios.unobserve(e.target); }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.js-stagger').forEach(el => ios.observe(el));

  // ── FAQ ACCORDION
  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-btn').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        const a = document.getElementById(b.getAttribute('aria-controls'));
        if (a) a.hidden = true;
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        const a = document.getElementById(btn.getAttribute('aria-controls'));
        if (a) a.hidden = false;
      }
    });
  });

  // ── CONTACT CHAR COUNT
  const msg   = document.getElementById('message');
  const count = document.getElementById('charCount');
  if (msg && count) {
    msg.addEventListener('input', () => {
      const n = Math.min(msg.value.length, 1000);
      count.textContent = n + ' / 1000';
      if (msg.value.length > 1000) msg.value = msg.value.slice(0, 1000);
      count.style.color = n > 900 ? '#e07070' : '';
    });
  }

  // ── ACTIVE NAV LINK
  const path = window.location.pathname;
  document.querySelectorAll('.nav__a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (href !== '/' && path.startsWith(href)))
      a.style.color = 'var(--accent)';
  });

});

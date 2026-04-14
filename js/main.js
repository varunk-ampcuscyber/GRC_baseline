/* ═══════════════════════════════════════════════════════════
   GRC ASIA CONCLAVE – INDIA 2026
   Ultra-Modern Interactive JS v3.0
   ═══════════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initLogoBanner();
  initTheme();
  initNavbar();
  initParticles();
  initCountdown();
  initAOS();
  initStats();
  initHamburger();
  initContactForm();
  initNewsletterForm();
  initBackToTop();
  initActiveNavLink();
  initCustomCursor();
  initScrollProgress();
  initCardTilt();
  initMagneticButtons();
  initThemeTagHover();
});

/* ────────────────────────────────────────
   1. PRELOADER
──────────────────────────────────────── */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  document.body.style.overflow = 'hidden';

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2400);
  });

  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 3800);
}

/* ────────────────────────────────────────
   2. LOGO BANNER POPUP
──────────────────────────────────────── */
function initLogoBanner() {
  const banner  = document.getElementById('logoBannerModal');
  const closeBtn = document.getElementById('closeLogoBannerModal');
  if (!banner || !closeBtn) return;

  const show  = () => { banner.classList.add('open'); banner.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; };
  const close = () => { banner.classList.remove('open'); banner.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; };

  setTimeout(show, 5000);
  closeBtn.addEventListener('click', close);
  banner.addEventListener('click', e => { if (e.target === banner) close(); });
}

/* ────────────────────────────────────────
   3. THEME TOGGLE
──────────────────────────────────────── */
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const html   = document.documentElement;
  const KEY    = 'grc-theme';

  const saved = localStorage.getItem(KEY);
  if (saved) html.setAttribute('data-theme', saved);

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(KEY, next);
    if (window.particleSystem) window.particleSystem.updateTheme(next);
  });
}

/* ────────────────────────────────────────
   4. NAVBAR
──────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
}

/* ────────────────────────────────────────
   5. PARTICLE CANVAS
──────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, particles = [];
  let isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  let mouse  = { x: -1000, y: -1000 };

  const COUNT = 100;
  const CONN  = 130;

  function resize() {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * width;
      this.y  = initial ? Math.random() * height : -12;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = Math.random() * 0.35 + 0.08;
      this.r  = Math.random() * 1.8 + 0.5;
      this.opacity = Math.random() * 0.55 + 0.1;
      const dark  = ['rgba(124,58,237', 'rgba(236,72,153', 'rgba(249,115,22', 'rgba(167,139,250'];
      const light = ['rgba(124,58,237', 'rgba(236,72,153', 'rgba(139,92,246'];
      const palette = isDark ? dark : light;
      this.color = palette[Math.floor(Math.random() * palette.length)];
    }

    update() {
      // Mouse repel
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 90) {
        const force = (90 - dist) / 90;
        this.vx += (dx / dist) * force * 0.8;
        this.vy += (dy / dist) * force * 0.8;
      }

      // Damping
      this.vx *= 0.96;
      this.vy *= 0.96;
      this.vy = Math.max(this.vy, 0.08);

      this.x += this.vx;
      this.y += this.vy;

      if (this.y > height + 12) this.reset(false);
      if (this.x < -12 || this.x > width + 12) this.x = Math.random() * width;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color},${this.opacity})`;
      ctx.fill();
    }
  }

  function initArray() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONN) {
          const alpha = (1 - dist / CONN) * (isDark ? 0.18 : 0.09);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.particleSystem = {
    updateTheme(theme) {
      isDark = theme === 'dark';
      particles.forEach(p => p.reset(true));
    }
  };

  resize();
  initArray();
  animate();
  window.addEventListener('resize', () => { resize(); initArray(); });
}

/* ────────────────────────────────────────
   6. COUNTDOWN
──────────────────────────────────────── */
function initCountdown() {
  const eventDate = new Date('2026-06-27T09:00:00+05:30');
  const els = {
    days:  document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins:  document.getElementById('cd-mins'),
    secs:  document.getElementById('cd-secs'),
  };
  if (!els.days) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function flip(el, val) {
    if (el.textContent === val) return;
    el.style.transform = 'translateY(-8px)';
    el.style.opacity   = '0';
    setTimeout(() => {
      el.textContent = val;
      el.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease';
      el.style.transform  = 'translateY(0)';
      el.style.opacity    = '1';
    }, 120);
  }

  function tick() {
    const diff = eventDate - new Date();
    if (diff <= 0) { Object.values(els).forEach(el => { el.textContent = '00'; }); return; }
    flip(els.days,  pad(Math.floor(diff / 86400000)));
    flip(els.hours, pad(Math.floor((diff % 86400000) / 3600000)));
    flip(els.mins,  pad(Math.floor((diff % 3600000)  / 60000)));
    flip(els.secs,  pad(Math.floor((diff % 60000)    / 1000)));
  }

  tick();
  setInterval(tick, 1000);
}

/* ────────────────────────────────────────
   7. AOS
──────────────────────────────────────── */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 750, easing: 'ease-out-cubic', once: true, offset: 70 });
  }
}

/* ────────────────────────────────────────
   8. ANIMATED STATS COUNTER
──────────────────────────────────────── */
function initStats() {
  const els = document.querySelectorAll('.stat-num[data-target]');
  if (!els.length) return;

  // Only animate the first set (duplicated for marquee)
  const seen = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      const key    = el.dataset.target + el.closest('.stat-item')?.textContent?.slice(-5);

      if (!seen.has(el)) {
        seen.add(el);
        animateCounter(el, 0, target, 1800);
      }
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  els.forEach(el => observer.observe(el));
}

function animateCounter(el, start, end, duration) {
  const t0 = performance.now();
  (function step(now) {
    const p = Math.min((now - t0) / duration, 1);
    const e = 1 - Math.pow(1 - p, 4); // ease-out-quart
    el.textContent = Math.round(start + (end - start) * e);
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

/* ────────────────────────────────────────
   9. HAMBURGER
──────────────────────────────────────── */
function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });

  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      btn.classList.remove('open');
      links.classList.remove('open');
    }
  });
}

/* ────────────────────────────────────────
   10. CONTACT FORM (MODAL)
──────────────────────────────────────── */
function initContactForm() {
  const modal    = document.getElementById('enquiryModal');
  const closeBtn = document.getElementById('closeEnquiryModal');
  const triggers = document.querySelectorAll('.open-enquiry-popup');
  const form     = document.getElementById('contactForm');
  const success  = document.getElementById('form-success');
  if (!form || !modal || !closeBtn) return;

  const rules = {
    fname:       { regex: /^[A-Za-z][A-Za-z\s'-]{1,49}$/,           msg: 'First name: 2–50 letters only.' },
    lname:       { regex: /^[A-Za-z][A-Za-z\s'-]{1,49}$/,           msg: 'Last name: 2–50 letters only.' },
    email:       { regex: /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/,     msg: 'Enter a valid work email.' },
    phone:       { regex: /^(?:\+?\d{1,3})?[6-9]\d{9}$/,            msg: 'Enter a valid 10-digit phone number.' },
    company:     { regex: /^[A-Za-z0-9].{1,98}$/,                   msg: 'Company name: 2–100 characters.' },
    designation: { regex: /^[A-Za-z].{1,78}$/,                      msg: 'Designation: 2–80 characters.' },
    interest:    { regex: /^(delegate|vip|speaking|sponsorship|media|other)$/, msg: 'Please select an option.' },
    message:     { regex: /^[\s\S]{20,1000}$/,                       msg: 'Message: 20–1000 characters.' },
  };

  const setError   = (f, msg) => { f.closest('.form-group')?.classList.add('error'); const e = document.getElementById(`${f.id}-error`); if (e) e.textContent = msg; };
  const clearError = (f)      => { f.closest('.form-group')?.classList.remove('error'); const e = document.getElementById(`${f.id}-error`); if (e) e.textContent = ''; };

  const openModal  = () => { modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; };
  const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; };

  triggers.forEach(t => t.addEventListener('click', e => { e.preventDefault(); openModal(); }));
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  function validateField(field) {
    const rule = rules[field.name];
    if (!rule) return true;
    clearError(field);
    const val = field.value.trim();
    if (!val)              { setError(field, 'This field is required.'); return false; }
    if (!rule.regex.test(val)) { setError(field, rule.msg); return false; }
    return true;
  }

  form.querySelectorAll('input,select,textarea').forEach(f => {
    f.addEventListener('blur',  () => validateField(f));
    f.addEventListener('input', () => { if (f.value.trim()) clearError(f); });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn     = form.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('span');
    let valid = true;
    form.querySelectorAll('[required][name]').forEach(f => { if (!validateField(f)) valid = false; });
    if (!valid) { shakeEl(form); return; }

    btn.disabled  = true;
    btnText.textContent = 'Sending…';

    try {
      const data = {};
      ['fname','lname','email','phone','company','designation','interest','message']
        .forEach(k => { data[k] = form.querySelector(`#${k}`)?.value.trim(); });

      const res    = await fetch('api/submit-enquiry.php', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
      const result = await res.json();

      if (!res.ok || !result.success) {
        if (result.errors) Object.entries(result.errors).forEach(([k,v]) => { const f = form.querySelector(`[name="${k}"]`); if (f) setError(f,v); });
        throw new Error(result.message || 'Submission failed.');
      }

      form.reset();
      form.style.display = 'none';
      success.classList.remove('hidden');
      setTimeout(() => { success.classList.add('hidden'); form.style.display = ''; closeModal(); }, 2400);
    } catch (_) {
      shakeEl(form);
    } finally {
      btn.disabled = false;
      btnText.textContent = 'Submit Enquiry';
    }
  });
}

function shakeEl(el) {
  el.animate(
    [{ transform:'translateX(-7px)' }, { transform:'translateX(7px)' }, { transform:'translateX(-5px)' }, { transform:'translateX(5px)' }, { transform:'translateX(0)' }],
    { duration: 350, easing: 'ease-in-out' }
  );
}

/* ────────────────────────────────────────
   11. NEWSLETTER FORM
──────────────────────────────────────── */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn   = form.querySelector('button');
    if (!input.value.trim()) return;

    const email = input.value.trim();
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.background = '#22c55e';
    input.value = '';

    try {
      await fetch('tables/newsletter', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
    } catch (_) { /* silent */ }

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-arrow-right"></i>';
      btn.style.background = '';
    }, 3000);
  });
}

/* ────────────────────────────────────────
   12. BACK TO TOP
──────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ────────────────────────────────────────
   13. CUSTOM CURSOR (Desktop only)
──────────────────────────────────────── */
function initCustomCursor() {
  if (window.innerWidth < 1024) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'custom-cursor';
  wrapper.innerHTML = `<div id="cursor-dot"></div><div id="cursor-ring"></div><div id="cursor-glow"></div>`;
  document.body.appendChild(wrapper);

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const glow = document.getElementById('cursor-glow');

  let mx = 0, my = 0, rx = 0, ry = 0, gx = 0, gy = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  (function animateCursor() {
    // Dot: instant
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';

    // Ring: lag
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    // Glow: more lag
    gx += (mx - gx) * 0.06;
    gy += (my - gy) * 0.06;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';

    requestAnimationFrame(animateCursor);
  })();

  // Scale ring on hover over interactive elements
  const interactives = 'a, button, .why-card, .acard, .speaker-card, .ticket-card, .audience-card, .pillar, .theme-tag';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '60px';
      ring.style.height = '60px';
      ring.style.borderColor = 'rgba(236,72,153,0.6)';
      dot.style.transform = 'translate(-50%,-50%) scale(2)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(167,139,250,0.6)';
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
}

/* ────────────────────────────────────────
   14. SCROLL PROGRESS
──────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
}

/* ────────────────────────────────────────
   15. 3D CARD TILT
──────────────────────────────────────── */
function initCardTilt() {
  if (window.innerWidth < 768) return;

  const cards = document.querySelectorAll('.why-card, .acard, .audience-card, .ticket-card, .speaker-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -8;
      const tiltY  = dx * 8;

      card.style.transform  = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
}

/* ────────────────────────────────────────
   16. MAGNETIC BUTTONS
──────────────────────────────────────── */
function initMagneticButtons() {
  if (window.innerWidth < 1024) return;

  const buttons = document.querySelectorAll('.btn-primary, .btn-glow, .nav-cta-link');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx   = (e.clientX - (rect.left + rect.width  / 2)) * 0.22;
      const dy   = (e.clientY - (rect.top  + rect.height / 2)) * 0.22;
      btn.style.transform  = `translate(${dx}px, ${dy}px)`;
      btn.style.transition = 'transform 0.1s ease';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform  = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
}

/* ────────────────────────────────────────
   17. THEME TAG RANDOM COLORS
──────────────────────────────────────── */
function initThemeTagHover() {
  const colors = [
    ['rgba(124,58,237,1)', 'rgba(236,72,153,1)'],
    ['rgba(236,72,153,1)', 'rgba(249,115,22,1)'],
    ['rgba(6,182,212,1)',  'rgba(124,58,237,1)'],
    ['rgba(249,115,22,1)', 'rgba(245,158,11,1)'],
    ['rgba(124,58,237,1)', 'rgba(6,182,212,1)'],
  ];

  document.querySelectorAll('.theme-tag').forEach((tag, i) => {
    const [c1, c2] = colors[i % colors.length];
    tag.style.setProperty('--tag-c1', c1);
    tag.style.setProperty('--tag-c2', c2);
  });
}

/* ────────────────────────────────────────
   SMOOTH SCROLL
──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const href   = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('navbar')?.offsetHeight || 72;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
  });
});

/* ────────────────────────────────────────
   FORM VALIDATION STYLES (injected)
──────────────────────────────────────── */
(function() {
  const s = document.createElement('style');
  s.textContent = `
    .form-group.error input,
    .form-group.error select,
    .form-group.error textarea {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 3px rgba(239,68,68,0.15) !important;
    }
    .form-group.error label { color: #ef4444; }

    #custom-cursor { pointer-events: none; }
    #cursor-dot    { position: fixed; width: 7px; height: 7px; background: #fff; border-radius: 50%; transform: translate(-50%,-50%); z-index: 9997; mix-blend-mode: difference; transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1); }
    #cursor-ring   { position: fixed; width: 36px; height: 36px; border: 1.5px solid rgba(167,139,250,0.6); border-radius: 50%; transform: translate(-50%,-50%); z-index: 9996; transition: width 0.3s cubic-bezier(0.34,1.56,0.64,1), height 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s ease; pointer-events: none; }
    #cursor-glow   { position: fixed; width: 220px; height: 220px; background: radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%); border-radius: 50%; transform: translate(-50%,-50%); z-index: 9995; pointer-events: none; }

    @media (max-width: 1023px) { #custom-cursor { display: none !important; } }
  `;
  document.head.appendChild(s);
})();

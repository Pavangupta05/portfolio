// ─────────────────────────────────────────────────────────────────────────────
//  PERFORMANCE-OPTIMISED SCRIPT
//  Key changes vs. original:
//  • Single merged, passive, rAF-throttled scroll handler
//  • Cached getBoundingClientRect (not recalculated on every mousemove)
//  • drawLines() skipped on mobile entirely
//  • One ScrollReveal init block (duplicate removed)
//  • All event listeners marked passive where possible
// ─────────────────────────────────────────────────────────────────────────────

window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("dark-mode");
  document.body.style.overflow = "auto";

  // ── LIVE IST CLOCK ──────────────────────────────────────────────────────────
  function updateJaipurTime() {
    const el = document.getElementById('jaipur-time');
    if (!el) return;
    el.textContent = `IST ${new Date().toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true
    })}`;
  }
  updateJaipurTime();
  setInterval(updateJaipurTime, 1000);

  // ── FORM VALIDATION ─────────────────────────────────────────────────────────
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const fields = {
      name:    { el: document.getElementById("nameInput"),    err: document.getElementById("nameError"),    min: 2,  msg: "Name must be at least 2 characters" },
      email:   { el: document.getElementById("emailInput"),   err: document.getElementById("emailError"),   re: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: "Please enter a valid email" },
      message: { el: document.getElementById("messageInput"), err: document.getElementById("messageError"), min: 10, msg: "Message must be at least 10 characters" }
    };
    function validate(key) {
      const f = fields[key];
      if (!f.el) return true;
      const v = f.el.value.trim();
      const ok = f.re ? f.re.test(v) : v.length >= f.min;
      if (f.err) f.err.textContent = ok ? '' : f.msg;
      f.el.classList.toggle('error', !ok);
      return ok;
    }
    Object.keys(fields).forEach(k => {
      if (fields[k].el) fields[k].el.addEventListener('blur', () => validate(k));
    });
    contactForm.addEventListener('submit', e => {
      const valid = Object.keys(fields).map(validate).every(Boolean);
      if (!valid) e.preventDefault();
    });
  }

  // ── ADAPTIVE FOOTER YEAR ────────────────────────────────────────────────────
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ── PARTICLE CANVAS ─────────────────────────────────────────────────────────
  const canvas = document.getElementById("bg-canvas");
  if (canvas) {
    const isMobile = window.innerWidth < 768;
    // alpha:false = skip alpha-compositing pass → faster rendering
    const ctx = canvas.getContext("2d", { alpha: false });
    const particleCount = isMobile ? 20 : 50;
    const connectionDistance = 120;
    const connDistSq = connectionDistance * connectionDistance;
    const mouseRadius = 120;
    const mouseRadSq  = mouseRadius * mouseRadius;

    let particles = [];
    let mouse = { x: null, y: null };
    let scrollYOffset = 0;
    let animationId = null;
    let frameCount = 0;

    // Throttled mouse (~30 fps cap)
    let mouseTick = false;
    window.addEventListener("mousemove", e => {
      if (mouseTick) return;
      mouseTick = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setTimeout(() => { mouseTick = false; }, 32);
    }, { passive: true });
    window.addEventListener("mouseout", () => { mouse.x = null; mouse.y = null; }, { passive: true });

    // Pause when tab hidden
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { if (animationId) cancelAnimationFrame(animationId); }
      else animate();
    });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x    = Math.random() * canvas.width;
        this.y    = Math.random() * canvas.height;
        this.vx   = (Math.random() - 0.5) * 0.3;
        this.vy   = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 0.8;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        const pY = scrollYOffset * 0.08;
        const cy = this.y + pY;
        if (cy < 0) this.y += canvas.height;
        if (cy > canvas.height) this.y -= canvas.height;
        if (mouse.x != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - cy;
          const dSq = dx * dx + dy * dy;
          if (dSq < mouseRadSq) {
            const d = Math.sqrt(dSq);
            const f = (mouseRadius - d) / mouseRadius;
            this.x -= (dx / d) * f * 1.2;
            this.y -= (dy / d) * f * 1.2;
          }
        }
      }
      draw(pY) {
        ctx.beginPath();
        ctx.arc(this.x, this.y + pY, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: particleCount }, () => new Particle());
    }

    // O(n²) line drawing — skipped entirely on mobile
    function drawLines(pY) {
      if (isMobile) return;
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx  = particles[i].x - particles[j].x;
          const dy  = particles[i].y - particles[j].y;
          const dSq = dx * dx + dy * dy;
          if (dSq < connDistSq) {
            const opacity = (1 - Math.sqrt(dSq) / connectionDistance) * 0.12;
            ctx.strokeStyle = `rgba(0,191,255,${opacity})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y + pY);
            ctx.lineTo(particles[j].x, particles[j].y + pY);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      frameCount++;
      const pY = scrollYOffset * 0.08;
      // Must fill bg each frame because alpha:false skips transparent clear
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0,191,255,0.3)";
      particles.forEach(p => { p.update(); p.draw(pY); });
      if (frameCount % 2 === 0) drawLines(pY); // lines every other frame
      animationId = requestAnimationFrame(animate);
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 200);
    }, { passive: true });
    init();
    animate();

    // Contact form async submit
    const successModal = document.getElementById("contact-success");
    if (contactForm && successModal) {
      contactForm.addEventListener("submit", async e => {
        if (e.defaultPrevented) return;
        e.preventDefault();
        const btn    = contactForm.querySelector("button");
        const btnTxt = btn && btn.querySelector(".btn-text");
        const spin   = btn && btn.querySelector(".spinner");
        if (btnTxt) btnTxt.style.display = "none";
        if (spin)   spin.style.display   = "block";
        if (btn)    btn.disabled = true;
        try {
          const res = await fetch(contactForm.action, {
            method: "POST", body: new FormData(contactForm),
            headers: { Accept: "application/json" }
          });
          if (res.ok) { successModal.classList.add("active"); contactForm.reset(); }
          else alert("Oops! There was a problem sending your message.");
        } catch { alert("Oops! A network error occurred."); }
        finally {
          if (btnTxt) btnTxt.style.display = "block";
          if (spin)   spin.style.display   = "none";
          if (btn)    btn.disabled = false;
        }
      });
    }
  }

  // ── SCROLL REVEAL (single init) ─────────────────────────────────────────────
  if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
      origin: 'bottom', distance: '40px', duration: 700,
      delay: 80, easing: 'cubic-bezier(0.25,1,0.5,1)', reset: false
    });
    sr.reveal('.section-title',    { origin: 'left', distance: '30px' });
    sr.reveal('.about-img',        { origin: 'left', distance: '50px' });
    sr.reveal('.about-text',       { origin: 'right', distance: '50px' });
    sr.reveal('.project-card',     { interval: 120 });
    sr.reveal('.skill-card',       { interval: 80, scale: 0.9 });
    sr.reveal('.certificate-card', { interval: 120 });
    sr.reveal('.hobby-card',       { interval: 80 });
    sr.reveal('.timeline-item',    { interval: 100, origin: 'left', distance: '30px' });
    sr.reveal('.blog-card',        { interval: 120 });
    sr.reveal('.soft-skill-item',  { interval: 80 });
    sr.reveal('.contact-form, .recruiter-card', { delay: 100 });
  }

  // ── INPUT FOCUS ──────────────────────────────────────────────────────────────
  document.querySelectorAll(".contact-form input, .contact-form textarea").forEach(el => {
    el.addEventListener("focus", () => el.classList.add("focused"),    { passive: true });
    el.addEventListener("blur",  () => el.classList.remove("focused"), { passive: true });
  });

  // ── TYPEWRITER ───────────────────────────────────────────────────────────────
  const typingTarget = document.getElementById("typingText");
  if (typingTarget) {
    const phrases = [" Pavan Kumar Gupta", "MERN Stack Developer"];
    let pi = 0, ci = 0, deleting = false;
    function typeLoop() {
      const phrase = phrases[pi];
      typingTarget.textContent = deleting ? phrase.slice(0, ci - 1) : phrase.slice(0, ci + 1);
      deleting ? ci-- : ci++;
      if (!deleting && ci === phrase.length) { deleting = true; return setTimeout(typeLoop, 900); }
      if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; return setTimeout(typeLoop, 500); }
      setTimeout(typeLoop, deleting ? 45 : 70);
    }
    (function waitForLoader() {
      document.body.classList.contains('loading') ? setTimeout(waitForLoader, 200) : setTimeout(typeLoop, 400);
    })();
  }

  // ── DESKTOP NAVBAR SLIDER ───────────────────────────────────────────────────
  const desktopNav   = document.querySelector('.nav-links-pill');
  const navSlider    = document.getElementById('navSlider');
  const navPillLinks = desktopNav ? [...desktopNav.querySelectorAll('a')] : [];

  function updateSlider(link) {
    if (!link || !navSlider || !desktopNav) return;
    const lr = link.getBoundingClientRect();
    const nr = desktopNav.getBoundingClientRect();
    navSlider.style.transform = `translateX(${lr.left - nr.left}px)`;
    navSlider.style.width     = `${lr.width}px`;
  }

  if (desktopNav && navSlider && navPillLinks.length) {
    navPillLinks.forEach(link => link.addEventListener('mouseenter', () => updateSlider(link)));
    desktopNav.addEventListener('mouseleave', () => {
      updateSlider(document.querySelector('.nav-links-pill a.active') || navPillLinks[0]);
    });
    setTimeout(() => {
      const init = document.querySelector('.nav-links-pill a.active') || navPillLinks[0];
      if (init) { init.classList.add('active'); updateSlider(init); }
    }, 100);
  }

  const mobileLinks = [...document.querySelectorAll('.mobile-nav-links a')];
  const sections    = [...document.querySelectorAll('section')];
  const progressBar = document.getElementById("scroll-progress");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  // ── UNIFIED SCROLL HANDLER (passive + rAF) ───────────────────────────────────
  let scrollRafPending = false;
  window.addEventListener('scroll', () => {
    if (scrollRafPending) return;
    scrollRafPending = true;
    requestAnimationFrame(() => {
      const sy    = window.scrollY;
      const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (scrollTopBtn) scrollTopBtn.style.display = sy > 400 ? "block" : "none";
      if (progressBar)  progressBar.style.width = ((sy / total) * 100) + "%";

      let current = '';
      sections.forEach(s => { if (sy >= s.offsetTop - s.clientHeight / 3) current = s.id; });

      navPillLinks.forEach(link => {
        const active = Boolean(current && link.getAttribute('href').includes(current));
        link.classList.toggle('active', active);
        if (active) updateSlider(link);
      });
      mobileLinks.forEach(link => {
        link.classList.toggle('active', Boolean(current && link.getAttribute('href').includes(current)));
      });

      scrollRafPending = false;
    });
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── FILTER (SKILLS & PROJECTS) ───────────────────────────────────────────────
  function applyFilter(btnsSel, cardsSel, attr) {
    const btns  = [...document.querySelectorAll(btnsSel)];
    const cards = [...document.querySelectorAll(cardsSel)];
    if (!btns.length || !cards.length) return;
    btns.forEach(btn => btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const fv  = btn.getAttribute('data-filter');
      const out = cards.filter(c => c.style.display !== 'none' && !c.classList.contains('hide'));
      out.forEach(c => { c.classList.add('animating-out'); c.style.animationDelay = '0s'; });
      setTimeout(() => {
        out.forEach(c => { c.classList.remove('animating-out'); c.style.display = 'none'; });
        const show = cards.filter(c => fv === 'all' || (c.getAttribute(attr) || '').includes(fv));
        show.forEach((c, i) => {
          c.style.display = 'flex';
          c.classList.add('animating-in');
          c.style.animationDelay = `${i * 0.05}s`;
          setTimeout(() => { c.classList.remove('animating-in'); c.style.animationDelay = '0s'; }, 500 + i * 50);
        });
      }, 300);
    }));
  }
  applyFilter('.skill-filter-btn', '#skillsGrid .skill-card', 'data-category');
  applyFilter('.project-filters .filter-btn', '.project-card', 'data-project-tags');

  // ── MAGNETIC BUTTONS (rect cached on mouseenter) ──────────────────────────────
  document.querySelectorAll('.btn-primary, .btn-secondary, .nav-contact-btn').forEach(btn => {
    btn.classList.add('magnetic-btn');
    let rect;
    btn.addEventListener('mouseenter', () => { rect = btn.getBoundingClientRect(); });
    btn.addEventListener('mousemove', e => {
      if (!rect) return;
      btn.style.transform = `translate(${(e.clientX - rect.left - rect.width/2) * 0.3}px,${(e.clientY - rect.top - rect.height/2) * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; rect = null; });
  });

  // ── 3D TILT CARDS (rect cached on mouseenter) ────────────────────────────────
  document.querySelectorAll('.skill-card, .project-card, .recruiter-card').forEach(card => {
    let rect;
    card.addEventListener('mouseenter', () => { rect = card.getBoundingClientRect(); });
    card.addEventListener('mousemove', e => {
      if (!rect) return;
      const dx = (e.clientX - rect.left - rect.width/2)  / (rect.width/2);
      const dy = (e.clientY - rect.top  - rect.height/2) / (rect.height/2);
      card.style.transform = `perspective(600px) rotateX(${-dy*7}deg) rotateY(${dx*7}deg) translateY(-8px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; rect = null; });
  });

  // ── LIQUID RIPPLE ────────────────────────────────────────────────────────────
  if (!document.getElementById('lg-ripple-style')) {
    const s = document.createElement('style');
    s.id = 'lg-ripple-style';
    s.textContent = `@keyframes liquidRipple{0%{transform:translate(-50%,-50%) scale(0);opacity:1}100%{transform:translate(-50%,-50%) scale(30);opacity:0}}`;
    document.head.appendChild(s);
  }
  document.addEventListener('click', e => {
    if (e.target.closest('input,textarea,select')) return;
    const r = document.createElement('div');
    r.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:6px;height:6px;border-radius:50%;transform:translate(-50%,-50%) scale(0);background:rgba(10,132,255,.35);border:1.5px solid rgba(255,255,255,.55);pointer-events:none;z-index:99997;animation:liquidRipple 0.7s cubic-bezier(.23,1,.32,1) forwards`;
    document.body.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });
});

// ── MOBILE MENU ────────────────────────────────────────────────────────────────
window.toggleMobileMenu = function() {
  const menu      = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('mobileHamburger');
  if (!menu) return;
  const active = menu.classList.toggle('active');
  if (hamburger) hamburger.classList.toggle('active', active);
  document.body.style.overflow = active ? 'hidden' : '';
};

// ── PROJECT MODAL ──────────────────────────────────────────────────────────────
window.openProjectModal = function(title, tagsStr, contentHTML) {
  let overlay = document.getElementById('project-modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'project-modal';
    overlay.className = 'project-modal-overlay';
    overlay.innerHTML = `
      <div class="project-modal-content">
        <div class="project-modal-close" onclick="closeProjectModal()"><i class="fa-solid fa-xmark"></i></div>
        <h2 class="modal-project-title" id="modal-title"></h2>
        <div class="modal-project-meta" id="modal-meta"></div>
        <div class="modal-project-body" id="modal-body"></div>
      </div>`;
    document.body.appendChild(overlay);
  }
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-meta').innerHTML = tagsStr.split(',').map(t => `<span class="badge">${t.trim()}</span>`).join('');
  document.getElementById('modal-body').innerHTML = contentHTML;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeProjectModal = function() {
  const o = document.getElementById('project-modal');
  if (o) { o.classList.remove('active'); document.body.style.overflow = ''; }
};

// ── COPY EMAIL ─────────────────────────────────────────────────────────────────
function copyEmail() {
  const email = 'pavangupta150605@gmail.com';
  const btn   = document.getElementById('copy-email-btn');
  function showOk() {
    if (!btn) return;
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    btn.style.background  = 'rgba(0,230,118,.15)';
    btn.style.borderColor = 'rgba(0,230,118,.5)';
    btn.style.color       = '#00e676';
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
      btn.style.background  = 'none';
      btn.style.borderColor = 'rgba(0,230,255,.3)';
      btn.style.color       = '#00e6ff';
    }, 2500);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(showOk).catch(fallback);
  } else { fallback(); }
  function fallback() {
    const ta = document.createElement('textarea');
    ta.value = email;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showOk(); } catch(err) { console.error(err); }
    document.body.removeChild(ta);
  }
}

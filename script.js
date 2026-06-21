// Initialize Vercel Speed Insights (Commented out because bare module specifiers need a bundler)
// import('@vercel/speed-insights').then(module => {
//   module.injectSpeedInsights();
// }).catch(err => console.error('Failed to load Speed Insights:', err));

window.addEventListener("DOMContentLoaded", () => {
  // Force dark mode
  document.body.classList.add("dark-mode");
  document.body.style.overflow = "auto";

  // ============ LIVE JAIPUR TIME (IST) ============
  function updateJaipurTime() {
    const el = document.getElementById('jaipur-time');
    if (!el) return;
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
    const timeStr = now.toLocaleTimeString('en-US', options);
    el.textContent = `IST ${timeStr}`;
  }
  updateJaipurTime();
  setInterval(updateJaipurTime, 1000);

  // ============ PROJECT FILTERING ============
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  // Removed redundant filter logic here. The staggered filter logic handles this.

  // ============ FORM VALIDATION ============
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const messageInput = document.getElementById("messageInput");
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");

    const validateName = () => {
      const value = nameInput.value.trim();
      if (value.length < 2) {
        nameError.textContent = "Name must be at least 2 characters";
        nameInput.classList.add("error");
        return false;
      }
      nameError.textContent = "";
      nameInput.classList.remove("error");
      return true;
    };

    const validateEmail = () => {
      const value = emailInput.value.trim();
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (!emailRegex.test(value)) {
        emailError.textContent = "Please enter a valid email";
        emailInput.classList.add("error");
        return false;
      }
      emailError.textContent = "";
      emailInput.classList.remove("error");
      return true;
    };

    const validateMessage = () => {
      const value = messageInput.value.trim();
      if (value.length < 10) {
        messageError.textContent = "Message must be at least 10 characters";
        messageInput.classList.add("error");
        return false;
      }
      messageError.textContent = "";
      messageInput.classList.remove("error");
      return true;
    };

    nameInput.addEventListener("blur", validateName);
    emailInput.addEventListener("blur", validateEmail);
    messageInput.addEventListener("blur", validateMessage);

    contactForm.addEventListener("submit", (e) => {
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        e.preventDefault();
      }
    });
  }

  // ============ ScrollReveal for Testimonials ============
  if (typeof ScrollReveal !== "undefined") {
    const sr = ScrollReveal({
      reset: false,
      distance: "80px",
      duration: 1200,
      delay: 100,
      easing: "cubic-bezier(0.5, 0, 0, 1)",
      viewFactor: 0.2
    });

    sr.reveal(".section-title", { origin: "top", scale: 0.9, opacity: 0 });
    
    sr.reveal(".about-img", { origin: "left", rotate: { y: 20 }, scale: 0.8 });
    sr.reveal(".about-text", { origin: "right", distance: "40px" });

    sr.reveal(".skill-card, .project-card, .education-card, .experience-card, .certificate-card, .hobby-card, .testimonial-card", {
      origin: "bottom",
      interval: 150,
      scale: 0.85,
      rotate: { x: 10, y: 0, z: 0 },
      distance: "100px"
    });

    sr.reveal(".contact-form", { origin: "bottom", scale: 0.9 });
  }
  // ============ IOS NAVBAR ACTIVE LINK ============
  const navContainer = document.querySelector(".ios-nav-container");
  const navLinks = document.querySelectorAll(".ios-nav-item a");
  const sections = document.querySelectorAll("section");

  if (navContainer && navLinks.length > 0 && sections.length > 0) {
    const activePill = document.createElement("div");
    activePill.classList.add("active-pill");
    navContainer.appendChild(activePill);

    const updatePill = () => {
      const activeLink = document.querySelector(".ios-nav-item a.active");
      if (activeLink) {
        const linkRect = activeLink.getBoundingClientRect();
        const containerRect = navContainer.getBoundingClientRect();
        activePill.style.width = `${linkRect.width}px`;
        activePill.style.left = `${linkRect.left - containerRect.left}px`;
      } else {
        activePill.style.width = `0px`;
      }
    };

    window.addEventListener("scroll", () => {
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - sectionHeight / 3) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (current && link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        }
      });
      updatePill();
    });

    // Initial pill setup
    setTimeout(updatePill, 100);
    window.addEventListener("resize", updatePill);
  }

  // ---------------- Scroll to Top ----------------
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      scrollTopBtn.style.display = window.scrollY > 400 ? "block" : "none";
    });

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---------------- Input Focus ----------------
  const inputs = document.querySelectorAll(".contact-form input, .contact-form textarea");
  inputs.forEach(input => {
    input.addEventListener("focus", () => input.classList.add("focused"));
    input.addEventListener("blur", () => input.classList.remove("focused"));
  });

  // ---------------- Typewriter Effect ----------------
  const typingTarget = document.getElementById("typingText");
  if (typingTarget) {
    const phrases = [" Pavan Kumar Gupta", "MERN Stack Developer"];
    const typingSpeedMs = 70;
    const erasingSpeedMs = 45;
    const holdOnTypedMs = 900;
    const holdBeforeStartMs = 500;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        typingTarget.textContent = currentPhrase.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          setTimeout(typeLoop, holdOnTypedMs);
          return;
        }
        setTimeout(typeLoop, typingSpeedMs);
      } else {
        typingTarget.textContent = currentPhrase.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typeLoop, holdBeforeStartMs);
          return;
        }
        setTimeout(typeLoop, erasingSpeedMs);
      }
    }

    function startTypingWhenReady() {
      if (!document.body.classList.contains('loading')) {
        setTimeout(typeLoop, 400);
      } else {
        setTimeout(startTypingWhenReady, 200);
      }
    }
    startTypingWhenReady();
  }
  // ---------------- Adaptive Footer Year ----------------
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ---------------- PARTICLE BACKGROUND (Optimized) ----------------
  const canvas = document.getElementById("bg-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d", { alpha: true });
    let particles = [];
    // Reduce particle count for better performance
    const particleCount = window.innerWidth < 768 ? 25 : 50;
    const connectionDistance = 120;
    const mouseRadius = 120;

    let mouse = { x: null, y: null };
    let scrollYOffset = 0;
    let animationId = null;
    let frameCount = 0; // For throttling expensive operations

    // Throttled mousemove
    let mouseThrottle = false;
    window.addEventListener("mousemove", (e) => {
      if (mouseThrottle) return;
      mouseThrottle = true;
      mouse.x = e.x;
      mouse.y = e.y;
      setTimeout(() => { mouseThrottle = false; }, 16);
    });

    window.addEventListener("mouseout", () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Throttled scroll
    let scrollThrottle = false;
    const progressBar = document.getElementById("scroll-progress");
    window.addEventListener("scroll", () => {
      if (scrollThrottle) return;
      scrollThrottle = true;
      requestAnimationFrame(() => {
        scrollYOffset = window.scrollY;
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + "%";
        scrollThrottle = false;
      });
    });

    // Pause animation when tab is hidden (saves CPU/battery)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (animationId) cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    });

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 0.8;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        const parallaxY = scrollYOffset * 0.08;
        let currentY = this.y + parallaxY;
        if (currentY < 0) this.y += canvas.height;
        if (currentY > canvas.height) this.y -= canvas.height;
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - (this.y + parallaxY);
          let distSq = dx * dx + dy * dy;
          if (distSq < mouseRadius * mouseRadius) {
            let distance = Math.sqrt(distSq);
            let force = (mouseRadius - distance) / mouseRadius;
            this.x -= (dx / distance) * force * 1.2;
            this.y -= (dy / distance) * force * 1.2;
          }
        }
      }
      draw() {
        const parallaxY = scrollYOffset * 0.08;
        ctx.fillStyle = "rgba(0, 191, 255, 0.3)";
        ctx.beginPath();
        ctx.arc(this.x, this.y + parallaxY, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    }

    function drawLines() {
      const pY = scrollYOffset * 0.08;
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          // Use squared distance to avoid sqrt when possible
          let distSq = dx * dx + dy * dy;
          if (distSq < connectionDistance * connectionDistance) {
            let opacity = (1 - Math.sqrt(distSq) / connectionDistance) * 0.12;
            ctx.strokeStyle = `rgba(0, 191, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y + pY);
            ctx.lineTo(particles[j].x, particles[j].y + pY);
            ctx.stroke();
          }
        }
      }
    }

    const bgTexts = document.querySelectorAll(".bg-scroll-text");

    function animate() {
      frameCount++;
      // 1. Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 2. Update/Draw Particles
      particles.forEach(p => { p.update(); p.draw(); });

      // 3. Draw lines every other frame (saves ~30% CPU)
      if (frameCount % 2 === 0) drawLines();

      // 4. Parallax Background Text (only every 3 frames)
      if (frameCount % 3 === 0) {
        bgTexts.forEach((text, index) => {
          const speed = (index + 1) * 0.12;
          const currentTransform = text.style.transform.includes('rotate') ? 'rotate(90deg)' : '';
          text.style.transform = `translateY(${scrollYOffset * speed}px) ${currentTransform}`;
        });
      }

      animationId = requestAnimationFrame(animate);
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 200);
    });
    init();
    animate();

    // ---------------- Contact Success Handler ----------------
    const successModal = document.getElementById("contact-success");
    if (contactForm && successModal) {
      contactForm.addEventListener("submit", async (e) => {
        if (e.defaultPrevented) return;
        e.preventDefault();
        const btn = contactForm.querySelector("button");
        const btnText = btn.querySelector(".btn-text");
        const spinner = btn.querySelector(".spinner");

        if (btnText && spinner) {
          btnText.style.display = "none";
          spinner.style.display = "block";
        }
        btn.disabled = true;

        const formData = new FormData(contactForm);

        try {
          const response = await fetch(contactForm.action, {
            method: "POST",
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });

          if (response.ok) {
            successModal.classList.add("active");
            contactForm.reset();
          } else {
            alert("Oops! There was a problem sending your message.");
          }
        } catch (error) {
          console.error("Form submission error:", error);
          alert("Oops! There was a network problem sending your message.");
        } finally {
          if (btnText && spinner) {
            btnText.style.display = "block";
            spinner.style.display = "none";
          }
          btn.disabled = false;
        }
      });
    }
  }
});




// ================= WHOLE UI ANIMATIONS (ScrollReveal) =================
document.addEventListener("DOMContentLoaded", () => {
  if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
      origin: 'bottom',
      distance: '40px',
      duration: 800,
      delay: 100,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      reset: false // Only animate once
    });

    // Reveal Titles
    sr.reveal('.section-title', { origin: 'left', distance: '30px' });
    
    // Reveal Cards with staggered intervals
    sr.reveal('.project-card', { interval: 150 });
    sr.reveal('.skill-card', { interval: 100, scale: 0.9 });
    sr.reveal('.experience-card', { interval: 150, origin: 'right' });
    sr.reveal('.certificate-card', { interval: 150, origin: 'bottom' });
    sr.reveal('.action-card', { interval: 100, scale: 0.8 });
    
    // Custom elements
    sr.reveal('.about-img', { origin: 'left', distance: '50px' });
    sr.reveal('.about-text', { origin: 'right', distance: '50px' });
    sr.reveal('.schedule-card', { delay: 300, scale: 0.95 });
    sr.reveal('.ios-form', { delay: 400, distance: '20px' });
  }
});

// ================= MOBILE MENU LOGIC =================
window.toggleMobileMenu = function() {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('mobileHamburger');
  if (menu) {
    const isActive = menu.classList.toggle('active');
    if (hamburger) {
      hamburger.classList.toggle('active', isActive);
    }
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
};

// ================= DESKTOP NAVBAR SLIDER ANIMATION =================
document.addEventListener("DOMContentLoaded", () => {
  const desktopNav = document.querySelector('.nav-links-pill');
  const navSlider = document.getElementById('navSlider');
  const navLinks = document.querySelectorAll('.nav-links-pill a');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
  const sections = document.querySelectorAll('section');

  if (desktopNav && navSlider && navLinks.length > 0) {
    function updateSlider(activeLink) {
      if (!activeLink) return;
      // Calculate relative position based on parent container padding
      const linkRect = activeLink.getBoundingClientRect();
      const navRect = desktopNav.getBoundingClientRect();
      
      const leftPos = linkRect.left - navRect.left;
      const width = linkRect.width;
      
      navSlider.style.transform = `translateX(${leftPos}px)`;
      navSlider.style.width = `${width}px`;
    }

    // Active state tracking on scroll
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (current && link.getAttribute('href').includes(current)) {
          link.classList.add('active');
          updateSlider(link);
        }
      });

      mobileLinks.forEach(link => {
        link.classList.remove('active');
        if (current && link.getAttribute('href').includes(current)) {
          link.classList.add('active');
        }
      });
    });

    // Hover effect: Slider follows mouse
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        updateSlider(link);
      });
    });

    // Mouse leave: Slider returns to active item
    desktopNav.addEventListener('mouseleave', () => {
      const activeLink = document.querySelector('.nav-links-pill a.active');
      if (activeLink) {
        updateSlider(activeLink);
      } else {
        // Default to first item if at very top
        updateSlider(navLinks[0]);
      }
    });

    // Initial position setup
    setTimeout(() => {
      const initialActive = document.querySelector('.nav-links-pill a.active') || navLinks[0];
      if (initialActive) {
        initialActive.classList.add('active');
        updateSlider(initialActive);
      }
    }, 100);
  }
});


// ================= STAGGERED FILTER TRANSITIONS (PROJECTS & SKILLS) =================
document.addEventListener("DOMContentLoaded", () => {
  const applyStaggeredFilter = (filterBtnsSelector, cardsSelector, categoryAttribute) => {
    const filterBtns = document.querySelectorAll(filterBtnsSelector);
    const cards = document.querySelectorAll(cardsSelector);
    
    if (filterBtns.length === 0 || cards.length === 0) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        let visibleCards = [];
        cards.forEach(card => {
          if (card.style.display !== 'none' && !card.classList.contains('hide')) {
            visibleCards.push(card);
            card.classList.add('animating-out');
            card.style.animationDelay = '0s';
          }
        });
        
        setTimeout(() => {
          visibleCards.forEach(card => {
            card.classList.remove('animating-out');
            card.style.display = 'none';
          });
          
          let cardsToShow = [];
          cards.forEach(card => {
            const categories = card.getAttribute(categoryAttribute) || '';
            if (filterValue === 'all' || categories.includes(filterValue)) {
              cardsToShow.push(card);
            }
          });
          
          cardsToShow.forEach((card, index) => {
            card.style.display = 'flex';
            card.classList.add('animating-in');
            card.style.animationDelay = `${index * 0.05}s`;
            
            setTimeout(() => {
              card.classList.remove('animating-in');
              card.style.animationDelay = '0s';
            }, 500 + (index * 50));
          });
        }, 300);
      });
    });
  };

  applyStaggeredFilter('.skill-filter-btn', '#skillsGrid .skill-card', 'data-category');
  applyStaggeredFilter('.project-filters .filter-btn', '.project-card', 'data-project-tags');
});

// ================= MAGNETIC CTA BUTTONS =================
document.addEventListener("DOMContentLoaded", () => {
  const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-contact-btn');
  
  magneticBtns.forEach(btn => {
    btn.classList.add('magnetic-btn');
    
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const h = rect.width / 2;
      const v = rect.height / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - v;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });
});

// ================= PROJECT MODAL DRAWERS =================
window.openProjectModal = function(title, tagsStr, contentHTML) {
  let modalOverlay = document.getElementById('project-modal');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'project-modal';
    modalOverlay.className = 'project-modal-overlay';
    
    modalOverlay.innerHTML = `
      <div class="project-modal-content">
        <div class="project-modal-close" onclick="closeProjectModal()">
          <i class="fa-solid fa-xmark"></i>
        </div>
        <h2 class="modal-project-title" id="modal-title">Project Title</h2>
        <div class="modal-project-meta" id="modal-meta">
        </div>
        <div class="modal-project-body" id="modal-body">
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);
  }
  
  document.getElementById('modal-title').textContent = title;
  const tags = tagsStr.split(',').map(tag => `<span class="badge">${tag.trim()}</span>`).join('');
  document.getElementById('modal-meta').innerHTML = tags;
  document.getElementById('modal-body').innerHTML = contentHTML;
  
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeProjectModal = function() {
  const modalOverlay = document.getElementById('project-modal');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// ============================================================
//   LIQUID GLASS INTERACTIVITY SYSTEM
// ============================================================
(function() {

  // --- 2. LIQUID RIPPLE ON CLICK ---
  document.addEventListener('click', (e) => {
    // don't ripple on inputs
    if (e.target.closest('input, textarea, select')) return;

    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 6px; height: 6px;
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      background: rgba(10, 132, 255, 0.35);
      border: 1.5px solid rgba(255, 255, 255, 0.55);
      pointer-events: none;
      z-index: 99997;
      animation: liquidRipple 0.7s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    `;
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  // Inject ripple keyframe once
  if (!document.getElementById('lg-ripple-style')) {
    const style = document.createElement('style');
    style.id = 'lg-ripple-style';
    style.textContent = `
      @keyframes liquidRipple {
        0%   { transform: translate(-50%,-50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%,-50%) scale(30); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // --- 3. 3D TILT EFFECT ON CARDS ---
  const tiltCards = document.querySelectorAll('.skill-card, .project-card, .recruiter-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(600px) rotateX(${-dy * 7}deg) rotateY(${dx * 7}deg) translateY(-8px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

})();

// ============ COPY EMAIL (global) ============
function copyEmail() {
  const email = 'pavangupta150605@gmail.com';
  const btn = document.getElementById('copy-email-btn');

  const showSuccessFeedback = () => {
    if (!btn) return;
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    btn.style.background = 'rgba(0,230,118,0.15)';
    btn.style.borderColor = 'rgba(0,230,118,0.5)';
    btn.style.color = '#00e676';
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
      btn.style.background = 'none';
      btn.style.borderColor = 'rgba(0,230,255,0.3)';
      btn.style.color = '#00e6ff';
    }, 2500);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(() => {
      showSuccessFeedback();
    }).catch(() => {
      fallbackCopy();
    });
  } else {
    fallbackCopy();
  }

  function fallbackCopy() {
    const ta = document.createElement('textarea');
    ta.value = email;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showSuccessFeedback();
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(ta);
  }
}

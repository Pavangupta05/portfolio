// Unified DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  // Force dark mode
  document.body.classList.add("dark-mode");

  // ---------------- Hamburger Menu ----------------
  const burger = document.getElementById("hamburger");
  const nav = document.getElementById("primary-nav");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("show");
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      burger.classList.toggle("open", isOpen);
    });

    // Close menu on link click
    nav.querySelectorAll("a").forEach(a => 
      a.addEventListener("click", () => {
        nav.classList.remove("show");
        burger.setAttribute("aria-expanded", "false");
      })
    );
  }

  // ---------------- ScrollReveal ----------------
  if (typeof ScrollReveal !== "undefined") {
    const sr = ScrollReveal({
      reset: false,
      distance: "60px",
      duration: 1000,
      delay: 50
    });

    sr.reveal(".section-title", { origin: "top" });
    sr.reveal(
      ".about-img, .skill-card, .project-card, .education-card, .experience-card, .certificate-card, .hobby-card",
      { origin: "bottom", interval: 200 }
    );
    sr.reveal(".about-text, .contact-form", { origin: "left" });
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
    const phrases = ["Hi, I’m Pavan Kumar Gupta", "MERN Stack Developer"];
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

    setTimeout(typeLoop, 400);
  }
});

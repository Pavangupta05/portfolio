
// Force dark mode and remove theme toggle logic
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("dark-mode");
  // Mobile nav toggle
  const burger = document.getElementById("hamburger");
  const nav = document.getElementById("primary-nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("show");
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      burger.classList.toggle("open", isOpen);
    });
    // Close on link click
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("show");
      burger.setAttribute("aria-expanded", "false");
    }));
  }
});

// ScrollReveal Animations
ScrollReveal({
  reset: false,
  distance: "60px",
  duration: 1000,
  delay: 50,
});

ScrollReveal().reveal(".section-title", { origin: "top" });
ScrollReveal().reveal(".about-img, .skill-card, .project-card, .education-card, .experience-card, .certificate-card, .hobby-card", { origin: "bottom", interval: 200 });
ScrollReveal().reveal(".about-text, .contact-form", { origin: "left" });


// Scroll to Top Button
const scrollTopBtn = document.getElementById("scrollTopBtn");
window.addEventListener("scroll", () => {
  scrollTopBtn.style.display = window.scrollY > 400 ? "block" : "none";
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


// Add focus effect to form inputs (optional redundant due to CSS)
const inputs = document.querySelectorAll(".contact-form input, .contact-form textarea");

inputs.forEach(input => {
  input.addEventListener("focus", () => {
    input.classList.add("focused");
  });
  input.addEventListener("blur", () => {
    input.classList.remove("focused");
  });
});

// Typewriter effect for Home section
window.addEventListener("DOMContentLoaded", () => {
  const typingTarget = document.getElementById("typingText");
  if (!typingTarget) return;

  const phrases = [
    "Hi, I’m Pavan Kumar Gupta",
    "MERN Stack Developer"
  ];

  const typingSpeedMs = 70;      // typing speed per character
  const erasingSpeedMs = 45;     // backspace speed per character
  const holdOnTypedMs = 900;     // pause after finishing a phrase
  const holdBeforeStartMs = 500; // pause before starting next phrase

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      // typing forward
      typingTarget.textContent = currentPhrase.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeLoop, holdOnTypedMs);
        return;
      }
      setTimeout(typeLoop, typingSpeedMs);
    } else {
      // deleting
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

  // kick off
  setTimeout(typeLoop, 400);
});

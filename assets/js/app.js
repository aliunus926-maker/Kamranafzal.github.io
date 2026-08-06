/* =========================================================
   app.js — third-party library setup only
   (particles.js, typed.js, vanilla-tilt, scrollreveal)
   ========================================================= */

(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Particles.js — hero background ----------
     Gated behind reduced-motion since it is continuous ambient motion. */
  if (!prefersReducedMotion && typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 900 } },
        color: { value: "#ff0000" },
        shape: { type: "circle" },
        opacity: {
          value: 0.35,
          random: true,
          anim: { enable: true, speed: 0.5, opacity_min: 0.1 },
        },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#3a0000",
          opacity: 0.3,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.2,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: false },
          resize: true,
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 0.5 } },
        },
      },
      retina_detect: true,
    });
  }

  /* ---------- Typed.js — rotating hero role text ---------- */
  const typedEl = document.getElementById("typed-role");
  if (typedEl && typeof Typed !== "undefined") {
    new Typed("#typed-role", {
      strings: [
        "YouTube Scriptwriter",
        "Faceless Channel Writer",
        "Documentary-Style Storyteller",
        "Geopolitics &amp; Economics Researcher",
      ],
      typeSpeed: 45,
      backSpeed: 25,
      backDelay: 1600,
      loop: true,
      smartBackspace: true,
    });
  }

  /* ---------- Vanilla-Tilt — hover tilt on photo/cards ----------
     Not gated behind reduced-motion: this is a one-time hover
     interaction, not continuous ambient motion. */
  if (typeof VanillaTilt !== "undefined") {
    const tiltTargets = document.querySelectorAll(
      ".photo-ring, .folder-card, .research-card, .timeline-card, .edu-card"
    );
    if (tiltTargets.length) {
      VanillaTilt.init(tiltTargets, {
        max: 6,
        speed: 400,
        glare: true,
        "max-glare": 0.15,
        scale: 1.02,
      });
    }
  }

  /* ---------- ScrollReveal — scroll-in animations ----------
     Also a one-time reveal, not continuous, so it stays on
     regardless of prefers-reduced-motion. */
  if (typeof ScrollReveal !== "undefined") {
    const sr = ScrollReveal({
      distance: "40px",
      duration: 700,
      easing: "cubic-bezier(0.5, 0, 0, 1)",
      reset: false,
    });

    sr.reveal(".reveal", { interval: 80 });
  } else {
    // Fail-safe: if the library didn't load, make sure content
    // hidden by the .reveal class still becomes visible.
    document.querySelectorAll(".reveal").forEach((el) => {
      el.style.visibility = "visible";
    });
  }
})();

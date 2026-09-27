/* ==========================================================
   MocoScripts — configuration
   Replace these with your real links.
   ========================================================== */
const DISCORD_URL = "YOUR_DISCORD_INVITE_HERE";
const YOUTUBE_URL = "YOUR_YOUTUBE_CHANNEL_HERE";

const PS99_SCRIPT = 'loadstring(game:HttpGet("https://w4zi.github.io/wz/ps99.lua"))()';

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Intro animation ---------------- */
  const intro = document.getElementById("intro");
  const introDelay = prefersReducedMotion ? 0 : 1600;

  window.setTimeout(() => {
    intro.classList.add("intro-hide");
  }, introDelay);

  intro.addEventListener("transitionend", () => {
    intro.style.display = "none";
  });

  /* ---------------- External link config ---------------- */
  const externalUrls = {
    discord: DISCORD_URL,
    youtube: YOUTUBE_URL,
  };

  document.querySelectorAll("[data-external]").forEach((el) => {
    const key = el.getAttribute("data-external");
    const url = externalUrls[key];
    if (el.tagName === "A") el.setAttribute("href", url);

    el.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(url, "_blank", "noopener,noreferrer");
    });
  });

  /* ---------------- Mobile menu ---------------- */
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  function closeMobileMenu() {
    mobileMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", closeMobileMenu);
  });

  /* ---------------- PS99 Modal ---------------- */
  const ps99Modal = document.getElementById("ps99Modal");
  const modalClose = document.getElementById("modalClose");
  const copyBtn = document.getElementById("copyBtn");
  const scriptCode = document.getElementById("scriptCode");
  scriptCode.textContent = PS99_SCRIPT;

  let lastFocusedElement = null;

  function openModal() {
    lastFocusedElement = document.activeElement;
    ps99Modal.classList.add("open");
    ps99Modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeMobileMenu();
    window.setTimeout(() => modalClose.focus(), 50);
  }

  function closeModal() {
    ps99Modal.classList.remove("open");
    ps99Modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  document.querySelectorAll("[data-open-modal='ps99']").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  modalClose.addEventListener("click", closeModal);

  ps99Modal.addEventListener("click", (e) => {
    if (e.target === ps99Modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && ps99Modal.classList.contains("open")) {
      closeModal();
    }
  });

  // simple focus trap
  ps99Modal.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const focusable = ps99Modal.querySelectorAll("button, a[href]");
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* ---------------- Copy to clipboard ---------------- */
  let copyTimeout;

  copyBtn.addEventListener("click", async () => {
    try {
      await copyText(PS99_SCRIPT);
      showCopied();
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  });

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  function showCopied() {
    const label = copyBtn.querySelector(".copy-btn-label");
    copyBtn.classList.add("copied");
    label.textContent = "Copied!";

    window.clearTimeout(copyTimeout);
    copyTimeout = window.setTimeout(() => {
      copyBtn.classList.remove("copied");
      label.textContent = "Copy Script";
    }, 1800);
  }

  /* ---------------- Ambient particles ---------------- */
  const canvas = document.getElementById("particles");
  if (canvas && !prefersReducedMotion) {
    initParticles(canvas);
  }

  /* ---------------- Footer year ---------------- */
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ==========================================================
   Lightweight ambient particle field (vanilla canvas)
   ========================================================== */
function initParticles(canvas) {
  const ctx = canvas.getContext("2d");
  let width, height, particles;
  const DENSITY = 14000; // px^2 per particle

  function resize() {
    width = canvas.width = canvas.offsetWidth * devicePixelRatio;
    height = canvas.height = canvas.offsetHeight * devicePixelRatio;
    const count = Math.min(70, Math.floor((width * height) / (DENSITY * devicePixelRatio * devicePixelRatio)));
    particles = Array.from({ length: count }, () => createParticle());
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: (Math.random() * 1.2 + 0.4) * devicePixelRatio,
      vy: (Math.random() * 0.12 + 0.03) * devicePixelRatio,
      alpha: Math.random() * 0.35 + 0.08,
    };
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.y -= p.vy;
      if (p.y < -4) {
        p.y = height + 4;
        p.x = Math.random() * width;
      }
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 143, 196, ${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(tick);
}

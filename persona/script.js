const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const projectCards = [...document.querySelectorAll("[data-category]")];
const canvas = document.querySelector("#burstCanvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let pointerX = 0.72;
let pointerY = 0.28;
let frame = 0;

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

function closeNav() {
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function setActiveLink() {
  const offset = window.innerHeight * 0.35;
  let active = navLinks[0];

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (!section) return;

    const box = section.getBoundingClientRect();
    if (box.top - offset <= 0) {
      active = link;
    }
  });

  navLinks.forEach((link) => link.classList.toggle("is-active", link === active));
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawBurst() {
  frame += 0.008;
  ctx.clearRect(0, 0, width, height);

  const originX = width * pointerX;
  const originY = height * pointerY;
  const rays = 22;
  const radius = Math.hypot(width, height);

  for (let i = 0; i < rays; i += 1) {
    const start = (Math.PI * 2 * i) / rays + Math.sin(frame + i) * 0.015;
    const end = start + Math.PI / rays;

    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.arc(originX, originY, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? "rgba(239, 24, 55, 0.16)" : "rgba(255, 247, 236, 0.07)";
    ctx.fill();
  }

  const dotSize = width < 700 ? 18 : 24;
  for (let y = -dotSize; y < height + dotSize; y += dotSize) {
    for (let x = -dotSize; x < width + dotSize; x += dotSize) {
      const distance = Math.hypot(x - originX, y - originY);
      const size = Math.max(1, 5 - distance / 180);
      if (size <= 1) continue;

      ctx.beginPath();
      ctx.arc(x + Math.sin(frame + y) * 2, y + Math.cos(frame + x) * 2, size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 212, 71, 0.16)";
      ctx.fill();
    }
  }

  requestAnimationFrame(drawBurst);
}

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeNav);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      card.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

window.addEventListener("scroll", () => {
  setHeaderState();
  setActiveLink();
});

window.addEventListener("resize", resizeCanvas);

window.addEventListener("pointermove", (event) => {
  pointerX = event.clientX / window.innerWidth;
  pointerY = event.clientY / window.innerHeight;
});

resizeCanvas();
setHeaderState();
setActiveLink();

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  drawBurst();
}

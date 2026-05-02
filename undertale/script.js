const canvas = document.querySelector("#stars");
const ctx = canvas.getContext("2d");
const navLinks = [...document.querySelectorAll(".top-nav a")];
const soul = document.querySelector("[data-soul]");

let width = 0;
let height = 0;
let stars = [];
let soulX = 0;
let soulY = 0;

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  stars = Array.from({ length: Math.max(70, Math.floor(width / 10)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() > 0.84 ? 3 : 2,
    speed: 0.15 + Math.random() * 0.45,
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(255,255,255,0.86)";

  stars.forEach((star) => {
    ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
    star.y += star.speed;
    if (star.y > height) {
      star.y = -4;
      star.x = Math.random() * width;
    }
  });

  requestAnimationFrame(drawStars);
}

function setActiveNav() {
  const marker = window.innerHeight * 0.34;
  let active = navLinks[0];

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (!section) return;

    if (section.getBoundingClientRect().top <= marker) {
      active = link;
    }
  });

  navLinks.forEach((link) => link.classList.toggle("is-active", link === active));
}

function moveSoul(x, y) {
  soulX = Math.max(-72, Math.min(72, soulX + x));
  soulY = Math.max(-72, Math.min(72, soulY + y));
  soul.style.transform = `translate(${soulX}px, ${soulY}px) rotate(45deg)`;
}

window.addEventListener("resize", resize);
window.addEventListener("scroll", setActiveNav);
window.addEventListener("keydown", (event) => {
  const step = 12;
  const moves = {
    ArrowUp: [0, -step],
    ArrowDown: [0, step],
    ArrowLeft: [-step, 0],
    ArrowRight: [step, 0],
  };

  if (!moves[event.key]) return;
  event.preventDefault();
  moveSoul(...moves[event.key]);
});

window.addEventListener("pointermove", (event) => {
  const box = soul.closest(".sprite-frame").getBoundingClientRect();
  if (
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom
  ) {
    return;
  }

  soulX = event.clientX - (box.left + box.width / 2);
  soulY = event.clientY - (box.top + box.height / 2);
  soulX = Math.max(-72, Math.min(72, soulX));
  soulY = Math.max(-72, Math.min(72, soulY));
  soul.style.transform = `translate(${soulX}px, ${soulY}px) rotate(45deg)`;
});

resize();
setActiveNav();

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  drawStars();
}

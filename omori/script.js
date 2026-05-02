const canvas = document.querySelector("#dreamCanvas");
const ctx = canvas.getContext("2d");
const navLinks = [...document.querySelectorAll(".page-nav a")];
const face = document.querySelector(".face");

let width = 0;
let height = 0;
let doodles = [];
let tick = 0;

const shapes = ["star", "flower", "eye", "dot"];

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  doodles = Array.from({ length: Math.max(28, Math.floor(width / 35)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 8 + Math.random() * 20,
    type: shapes[Math.floor(Math.random() * shapes.length)],
    speed: 0.08 + Math.random() * 0.22,
    wobble: Math.random() * Math.PI * 2,
  }));
}

function drawStar(x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size * 0.28, y - size * 0.28);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x + size * 0.28, y + size * 0.28);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size * 0.28, y + size * 0.28);
  ctx.lineTo(x - size, y);
  ctx.lineTo(x - size * 0.28, y - size * 0.28);
  ctx.closePath();
  ctx.stroke();
}

function drawFlower(x, y, size) {
  for (let i = 0; i < 5; i += 1) {
    const angle = (Math.PI * 2 * i) / 5;
    ctx.beginPath();
    ctx.arc(x + Math.cos(angle) * size * 0.42, y + Math.sin(angle) * size * 0.42, size * 0.24, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(x, y, size * 0.18, 0, Math.PI * 2);
  ctx.fill();
}

function drawEye(x, y, size) {
  ctx.beginPath();
  ctx.ellipse(x, y, size * 0.68, size * 0.34, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, size * 0.14, 0, Math.PI * 2);
  ctx.fill();
}

function drawDoodles() {
  tick += 0.01;
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(17, 17, 17, 0.18)";
  ctx.fillStyle = "rgba(17, 17, 17, 0.16)";

  doodles.forEach((doodle) => {
    const x = doodle.x + Math.sin(tick + doodle.wobble) * 10;
    const y = doodle.y;

    if (doodle.type === "star") drawStar(x, y, doodle.size);
    if (doodle.type === "flower") drawFlower(x, y, doodle.size);
    if (doodle.type === "eye") drawEye(x, y, doodle.size);
    if (doodle.type === "dot") {
      ctx.beginPath();
      ctx.arc(x, y, doodle.size * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }

    doodle.y += doodle.speed;
    if (doodle.y > height + 40) {
      doodle.y = -40;
      doodle.x = Math.random() * width;
    }
  });

  requestAnimationFrame(drawDoodles);
}

function setActiveNav() {
  const offset = window.innerHeight * 0.34;
  let active = navLinks[0];

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (!section) return;
    if (section.getBoundingClientRect().top <= offset) {
      active = link;
    }
  });

  navLinks.forEach((link) => link.classList.toggle("is-active", link === active));
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("scroll", setActiveNav);
window.addEventListener("pointermove", (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 10;
  const y = (event.clientY / window.innerHeight - 0.5) * 10;
  face.style.transform = `translate(${x}px, ${y}px)`;
});

resizeCanvas();
setActiveNav();

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  drawDoodles();
}

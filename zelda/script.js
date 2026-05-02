const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const filterButtons = document.querySelectorAll("[data-filter]");
const questCards = document.querySelectorAll("[data-category]");
const canvas = document.querySelector("#runeCanvas");
const ctx = canvas.getContext("2d");

const motes = [];
let width = 0;
let height = 0;
let animationFrame = 0;

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter || "all";

    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    questCards.forEach((card) => {
      const categories = (card.dataset.category || "").split(/\s+/);
      card.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  seedMotes();
}

function seedMotes() {
  motes.length = 0;
  const count = Math.min(46, Math.max(18, Math.floor(width / 30)));
  const colors = ["#f0c94a", "#7ed4d6", "#88b85b", "#f8edcc"];

  for (let index = 0; index < count; index += 1) {
    motes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 3 + Math.random() * 7,
      speed: 0.16 + Math.random() * 0.44,
      drift: -0.18 + Math.random() * 0.36,
      pulse: Math.random() * Math.PI * 2,
      color: colors[index % colors.length],
      kind: index % 4,
    });
  }
}

function drawShard(size) {
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.88, size * 0.64);
  ctx.lineTo(-size * 0.88, size * 0.64);
  ctx.closePath();
}

function drawMote(mote) {
  const glow = 0.45 + Math.sin(mote.pulse) * 0.2;
  ctx.save();
  ctx.translate(mote.x, mote.y);
  ctx.globalAlpha = glow;
  ctx.fillStyle = mote.color;
  ctx.strokeStyle = "rgba(248, 237, 204, 0.42)";
  ctx.lineWidth = 1;

  if (mote.kind === 0) {
    drawShard(mote.size);
  } else if (mote.kind === 1) {
    ctx.beginPath();
    ctx.arc(0, 0, mote.size * 0.72, 0, Math.PI * 2);
  } else if (mote.kind === 2) {
    ctx.beginPath();
    ctx.rect(-mote.size * 0.55, -mote.size * 0.55, mote.size * 1.1, mote.size * 1.1);
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -mote.size);
    ctx.lineTo(mote.size * 0.28, -mote.size * 0.28);
    ctx.lineTo(mote.size, 0);
    ctx.lineTo(mote.size * 0.28, mote.size * 0.28);
    ctx.lineTo(0, mote.size);
    ctx.lineTo(-mote.size * 0.28, mote.size * 0.28);
    ctx.lineTo(-mote.size, 0);
    ctx.lineTo(-mote.size * 0.28, -mote.size * 0.28);
    ctx.closePath();
  }

  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  motes.forEach((mote) => {
    mote.y -= mote.speed;
    mote.x += mote.drift;
    mote.pulse += 0.02;

    if (mote.y < -24) {
      mote.y = height + 24;
      mote.x = Math.random() * width;
    }

    drawMote(mote);
  });

  animationFrame = window.requestAnimationFrame(animate);
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

if (!reducedMotion.matches) {
  animate();
}

reducedMotion.addEventListener("change", () => {
  window.cancelAnimationFrame(animationFrame);
  if (!reducedMotion.matches) {
    animate();
  } else {
    ctx.clearRect(0, 0, width, height);
  }
});

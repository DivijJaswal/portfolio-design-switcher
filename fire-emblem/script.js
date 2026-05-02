const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const filterButtons = document.querySelectorAll("[data-filter]");
const missionCards = document.querySelectorAll("[data-category]");
const canvas = document.querySelector("#emberCanvas");
const ctx = canvas.getContext("2d");

const embers = [];
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
    missionCards.forEach((card) => {
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
  seedEmbers();
}

function seedEmbers() {
  embers.length = 0;
  const count = Math.min(44, Math.max(18, Math.floor(width / 32)));
  const colors = ["#d9aa4a", "#b7353c", "#d8deea", "#f4ead4"];

  for (let index = 0; index < count; index += 1) {
    embers.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 3 + Math.random() * 8,
      speed: 0.16 + Math.random() * 0.42,
      drift: -0.22 + Math.random() * 0.44,
      angle: Math.random() * Math.PI,
      spin: -0.01 + Math.random() * 0.02,
      color: colors[index % colors.length],
      kind: index % 3,
    });
  }
}

function drawEmber(ember) {
  ctx.save();
  ctx.translate(ember.x, ember.y);
  ctx.rotate(ember.angle);
  ctx.globalAlpha = 0.42;
  ctx.fillStyle = ember.color;
  ctx.strokeStyle = "rgba(244, 234, 212, 0.35)";
  ctx.lineWidth = 1;

  if (ember.kind === 0) {
    ctx.beginPath();
    ctx.moveTo(0, -ember.size);
    ctx.lineTo(ember.size * 0.88, ember.size * 0.72);
    ctx.lineTo(-ember.size * 0.88, ember.size * 0.72);
    ctx.closePath();
  } else if (ember.kind === 1) {
    ctx.beginPath();
    ctx.rect(-ember.size * 0.56, -ember.size * 0.56, ember.size * 1.12, ember.size * 1.12);
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, ember.size * 0.72, 0, Math.PI * 2);
  }

  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  embers.forEach((ember) => {
    ember.y -= ember.speed;
    ember.x += ember.drift;
    ember.angle += ember.spin;

    if (ember.y < -24) {
      ember.y = height + 24;
      ember.x = Math.random() * width;
    }

    drawEmber(ember);
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

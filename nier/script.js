const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const filterButtons = document.querySelectorAll("[data-filter]");
const recordCards = document.querySelectorAll("[data-category]");
const canvas = document.querySelector("#signalCanvas");
const ctx = canvas.getContext("2d");

const fragments = [];
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
    recordCards.forEach((card) => {
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
  seedFragments();
}

function seedFragments() {
  fragments.length = 0;
  const count = Math.min(46, Math.max(18, Math.floor(width / 32)));
  const colors = ["#f8f6ef", "#a9a292", "#72745d", "#9f3030"];

  for (let index = 0; index < count; index += 1) {
    fragments.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 3 + Math.random() * 8,
      speed: 0.12 + Math.random() * 0.35,
      drift: -0.2 + Math.random() * 0.4,
      angle: Math.random() * Math.PI,
      spin: -0.01 + Math.random() * 0.02,
      color: colors[index % colors.length],
      kind: index % 4,
    });
  }
}

function drawFragment(fragment) {
  ctx.save();
  ctx.translate(fragment.x, fragment.y);
  ctx.rotate(fragment.angle);
  ctx.globalAlpha = 0.42;
  ctx.fillStyle = fragment.color;
  ctx.strokeStyle = "rgba(248, 246, 239, 0.32)";
  ctx.lineWidth = 1;

  if (fragment.kind === 0) {
    ctx.beginPath();
    ctx.rect(-fragment.size * 0.6, -fragment.size * 0.6, fragment.size * 1.2, fragment.size * 1.2);
  } else if (fragment.kind === 1) {
    ctx.beginPath();
    ctx.arc(0, 0, fragment.size * 0.72, 0, Math.PI * 2);
  } else if (fragment.kind === 2) {
    ctx.beginPath();
    ctx.moveTo(0, -fragment.size);
    ctx.lineTo(fragment.size * 0.86, fragment.size * 0.68);
    ctx.lineTo(-fragment.size * 0.86, fragment.size * 0.68);
    ctx.closePath();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -fragment.size);
    ctx.lineTo(fragment.size * 0.32, -fragment.size * 0.32);
    ctx.lineTo(fragment.size, 0);
    ctx.lineTo(fragment.size * 0.32, fragment.size * 0.32);
    ctx.lineTo(0, fragment.size);
    ctx.lineTo(-fragment.size * 0.32, fragment.size * 0.32);
    ctx.lineTo(-fragment.size, 0);
    ctx.lineTo(-fragment.size * 0.32, -fragment.size * 0.32);
    ctx.closePath();
  }

  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  fragments.forEach((fragment) => {
    fragment.y -= fragment.speed;
    fragment.x += fragment.drift;
    fragment.angle += fragment.spin;

    if (fragment.y < -24) {
      fragment.y = height + 24;
      fragment.x = Math.random() * width;
    }

    drawFragment(fragment);
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

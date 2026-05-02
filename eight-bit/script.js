const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const filterButtons = document.querySelectorAll("[data-filter]");
const stageCards = document.querySelectorAll("[data-category]");
const canvas = document.querySelector("#pixelCanvas");
const ctx = canvas.getContext("2d");

const pixels = [];
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
    stageCards.forEach((card) => {
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
  seedPixels();
}

function seedPixels() {
  pixels.length = 0;
  const count = Math.min(54, Math.max(22, Math.floor(width / 26)));
  const colors = ["#41e4ff", "#56f28b", "#ffd84a", "#ff5bd6", "#ff5268"];

  for (let index = 0; index < count; index += 1) {
    const size = 6 + Math.floor(Math.random() * 3) * 4;
    pixels.push({
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      size,
      speed: 0.18 + Math.random() * 0.42,
      drift: -0.24 + Math.random() * 0.48,
      color: colors[index % colors.length],
      blink: Math.random() * Math.PI * 2,
      shape: index % 4,
    });
  }
}

function drawPixel(pixel) {
  const alpha = 0.42 + Math.sin(pixel.blink) * 0.18;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = pixel.color;
  ctx.strokeStyle = "#050711";
  ctx.lineWidth = 2;
  const x = Math.round(pixel.x / 4) * 4;
  const y = Math.round(pixel.y / 4) * 4;

  if (pixel.shape === 0) {
    ctx.fillRect(x, y, pixel.size, pixel.size);
    ctx.strokeRect(x, y, pixel.size, pixel.size);
  } else if (pixel.shape === 1) {
    ctx.fillRect(x, y + pixel.size / 3, pixel.size, pixel.size / 3);
    ctx.fillRect(x + pixel.size / 3, y, pixel.size / 3, pixel.size);
    ctx.strokeRect(x, y + pixel.size / 3, pixel.size, pixel.size / 3);
  } else if (pixel.shape === 2) {
    ctx.fillRect(x + pixel.size / 3, y, pixel.size / 3, pixel.size / 3);
    ctx.fillRect(x, y + pixel.size / 3, pixel.size, pixel.size / 3);
    ctx.fillRect(x + pixel.size / 3, y + (pixel.size * 2) / 3, pixel.size / 3, pixel.size / 3);
  } else {
    ctx.fillRect(x, y, pixel.size * 1.4, pixel.size / 2);
    ctx.fillRect(x + pixel.size / 2, y - pixel.size / 2, pixel.size / 2, pixel.size * 1.4);
  }

  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  pixels.forEach((pixel) => {
    pixel.y -= pixel.speed;
    pixel.x += pixel.drift;
    pixel.blink += 0.04;

    if (pixel.y < -28) {
      pixel.y = height + 28;
      pixel.x = Math.random() * width;
    }

    drawPixel(pixel);
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

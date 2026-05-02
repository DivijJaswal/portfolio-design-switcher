const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const filterButtons = document.querySelectorAll("[data-filter]");
const commissionCards = document.querySelectorAll("[data-category]");
const canvas = document.querySelector("#elementCanvas");
const ctx = canvas.getContext("2d");

const particles = [];
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
    commissionCards.forEach((card) => {
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
  seedParticles();
}

function seedParticles() {
  particles.length = 0;
  const count = Math.min(44, Math.max(18, Math.floor(width / 32)));
  const colors = ["#efbf54", "#74cfe0", "#54a76f", "#db6a63", "#5969ab"];

  for (let index = 0; index < count; index += 1) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 3 + Math.random() * 8,
      speed: 0.14 + Math.random() * 0.38,
      drift: -0.2 + Math.random() * 0.4,
      angle: Math.random() * Math.PI,
      spin: -0.012 + Math.random() * 0.024,
      color: colors[index % colors.length],
      kind: index % 4,
    });
  }
}

function drawParticle(particle) {
  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate(particle.angle);
  ctx.globalAlpha = 0.46;
  ctx.fillStyle = particle.color;
  ctx.strokeStyle = "rgba(255, 253, 242, 0.42)";
  ctx.lineWidth = 1;

  if (particle.kind === 0) {
    ctx.beginPath();
    ctx.moveTo(0, -particle.size);
    ctx.lineTo(particle.size * 0.32, -particle.size * 0.32);
    ctx.lineTo(particle.size, 0);
    ctx.lineTo(particle.size * 0.32, particle.size * 0.32);
    ctx.lineTo(0, particle.size);
    ctx.lineTo(-particle.size * 0.32, particle.size * 0.32);
    ctx.lineTo(-particle.size, 0);
    ctx.lineTo(-particle.size * 0.32, -particle.size * 0.32);
    ctx.closePath();
  } else if (particle.kind === 1) {
    ctx.beginPath();
    ctx.rect(-particle.size * 0.58, -particle.size * 0.58, particle.size * 1.16, particle.size * 1.16);
  } else if (particle.kind === 2) {
    ctx.beginPath();
    ctx.moveTo(0, -particle.size);
    ctx.lineTo(particle.size * 0.86, particle.size * 0.68);
    ctx.lineTo(-particle.size * 0.86, particle.size * 0.68);
    ctx.closePath();
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, particle.size * 0.72, 0, Math.PI * 2);
  }

  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((particle) => {
    particle.y -= particle.speed;
    particle.x += particle.drift;
    particle.angle += particle.spin;

    if (particle.y < -24) {
      particle.y = height + 24;
      particle.x = Math.random() * width;
    }

    drawParticle(particle);
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

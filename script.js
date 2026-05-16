const header = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navAnchors = Array.from(navLinks.querySelectorAll("a"));

function updateHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 18);
}

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navAnchors.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const sections = navAnchors
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navAnchors.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  {
    rootMargin: "-42% 0px -48%",
    threshold: 0.01
  }
);

sections.forEach((section) => observer.observe(section));

window.addEventListener("scroll", updateHeaderState);
updateHeaderState();

const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");
const nodes = [];
const nodeCount = 42;
let animationFrame;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  nodes.length = 0;

  for (let index = 0; index < nodeCount; index += 1) {
    nodes.push({
      x: rect.width * (0.46 + Math.random() * 0.52),
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.24,
      radius: 1.4 + Math.random() * 2.2,
      hue: Math.random() > 0.52 ? "green" : "blue"
    });
  }
}

function drawScene() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  ctx.clearRect(0, 0, width, height);

  const glow = ctx.createLinearGradient(width * 0.46, 0, width, 0);
  glow.addColorStop(0, "rgba(15, 23, 42, 0)");
  glow.addColorStop(1, "rgba(15, 23, 42, 0.25)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < nodes.length; i += 1) {
    const current = nodes[i];
    current.x += current.vx;
    current.y += current.vy;

    if (current.x < width * 0.44 || current.x > width * 0.98) {
      current.vx *= -1;
    }

    if (current.y < 16 || current.y > height - 16) {
      current.vy *= -1;
    }

    for (let j = i + 1; j < nodes.length; j += 1) {
      const next = nodes[j];
      const dx = current.x - next.x;
      const dy = current.y - next.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 145) {
        const opacity = 1 - distance / 145;
        ctx.strokeStyle = current.hue === "green"
          ? `rgba(16, 185, 129, ${opacity * 0.34})`
          : `rgba(59, 130, 246, ${opacity * 0.28})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }
    }
  }

  nodes.forEach((node) => {
    ctx.beginPath();
    ctx.fillStyle = node.hue === "green" ? "rgba(16, 185, 129, 0.95)" : "rgba(59, 130, 246, 0.95)";
    ctx.shadowBlur = 16;
    ctx.shadowColor = node.hue === "green" ? "rgba(16, 185, 129, 0.8)" : "rgba(59, 130, 246, 0.75)";
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.shadowBlur = 0;
  animationFrame = window.requestAnimationFrame(drawScene);
}

window.addEventListener("resize", () => {
  window.cancelAnimationFrame(animationFrame);
  resizeCanvas();
  drawScene();
});

resizeCanvas();
drawScene();

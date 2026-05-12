const canvas = document.querySelector(".particle-canvas");
const ctx = canvas.getContext("2d");
const particles = [];
const pointer = {
  x: 0,
  y: 0,
  lastX: 0,
  lastY: 0,
  active: false,
  pointerVelocity: 0
};

let width = 0;
let height = 0;
let pixelRatio = 1;
let lastTime = performance.now();

function createParticles() {
  particles.length = 0;
  const count = Math.min(170, Math.max(80, Math.floor((width * height) / 12000)));

  for (let i = 0; i < count; i += 1) {
    const homeX = Math.random() * width;
    const homeY = Math.random() * height;
    particles.push({
      homeX,
      homeY,
      x: homeX,
      y: homeY,
      vx: 0,
      vy: 0,
      size: 1.4 + Math.random() * 2.8,
      alpha: 0.42 + Math.random() * 0.5,
      drift: Math.random() * Math.PI * 2
    });
  }
}

function resize() {
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  createParticles();
}

function updatePointer(event) {
  pointer.active = true;
  pointer.lastX = pointer.x || event.clientX;
  pointer.lastY = pointer.y || event.clientY;
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.pointerVelocity = Math.hypot(pointer.x - pointer.lastX, pointer.y - pointer.lastY);
}

function releasePointer() {
  pointer.active = false;
}

function drawParticle(particle) {
  const glow = ctx.createRadialGradient(
    particle.x,
    particle.y,
    0,
    particle.x,
    particle.y,
    particle.size * 4
  );
  glow.addColorStop(0, `rgba(255, 255, 255, ${particle.alpha})`);
  glow.addColorStop(0.42, `rgba(255, 255, 255, ${particle.alpha * 0.38})`);
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.fill();
}

function animate(now) {
  const delta = Math.min((now - lastTime) / 16.67, 2);
  lastTime = now;
  ctx.clearRect(0, 0, width, height);

  for (const particle of particles) {
    const distanceToPointer = pointer.active
      ? Math.hypot(pointer.x - particle.x, pointer.y - particle.y)
      : Infinity;
    const canFollow = pointer.active && pointer.pointerVelocity < 44 && distanceToPointer < 190;
    const pull = canFollow ? Math.max(0, 1 - distanceToPointer / 190) : 0;

    const driftX = Math.cos(now * 0.00035 + particle.drift) * 7;
    const driftY = Math.sin(now * 0.00042 + particle.drift) * 7;
    const targetX = canFollow
      ? particle.homeX + (pointer.x - particle.homeX) * (0.22 + pull * 0.42)
      : particle.homeX + driftX;
    const targetY = canFollow
      ? particle.homeY + (pointer.y - particle.homeY) * (0.22 + pull * 0.42)
      : particle.homeY + driftY;

    const spring = canFollow ? 0.028 + pull * 0.04 : 0.018;
    const damping = canFollow ? 0.86 : 0.9;

    particle.vx += (targetX - particle.x) * spring * delta;
    particle.vy += (targetY - particle.y) * spring * delta;
    particle.vx *= damping;
    particle.vy *= damping;
    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;

    drawParticle(particle);
  }

  pointer.pointerVelocity *= 0.88;
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);
window.addEventListener("pointermove", updatePointer);
window.addEventListener("pointerleave", releasePointer);
window.addEventListener("blur", releasePointer);

resize();
requestAnimationFrame(animate);

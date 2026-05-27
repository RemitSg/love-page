const fireworkCanvas = document.querySelector(".firework-canvas");
const fireworkCtx = fireworkCanvas.getContext("2d");
const bursts = [];
let fireworkWidth = 0;
let fireworkHeight = 0;
let fireworkRatio = 1;
let lastLaunch = 0;

function resizeFireworks() {
  fireworkRatio = Math.min(window.devicePixelRatio || 1, 2);
  fireworkWidth = window.innerWidth;
  fireworkHeight = window.innerHeight;
  fireworkCanvas.width = Math.floor(fireworkWidth * fireworkRatio);
  fireworkCanvas.height = Math.floor(fireworkHeight * fireworkRatio);
  fireworkCanvas.style.width = `${fireworkWidth}px`;
  fireworkCanvas.style.height = `${fireworkHeight}px`;
  fireworkCtx.setTransform(fireworkRatio, 0, 0, fireworkRatio, 0, 0);
}

function launchFirework() {
  const x = fireworkWidth * (0.18 + Math.random() * 0.64);
  const y = fireworkHeight * (0.16 + Math.random() * 0.38);
  const hue = 320 + Math.random() * 80;
  const count = 38 + Math.floor(Math.random() * 26);
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = 1.6 + Math.random() * 4.4;
    bursts.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.012 + Math.random() * 0.012,
      hue,
      size: 1.2 + Math.random() * 2.4
    });
  }
}

function drawFireworks(now) {
  fireworkCtx.globalCompositeOperation = "source-over";
  fireworkCtx.fillStyle = "rgba(4, 7, 18, 0.16)";
  fireworkCtx.fillRect(0, 0, fireworkWidth, fireworkHeight);
  fireworkCtx.globalCompositeOperation = "lighter";

  if (now - lastLaunch > 1100) {
    launchFirework();
    lastLaunch = now;
  }

  for (let i = bursts.length - 1; i >= 0; i -= 1) {
    const spark = bursts[i];
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vy += 0.025;
    spark.vx *= 0.992;
    spark.vy *= 0.992;
    spark.life -= spark.decay;

    const gradient = fireworkCtx.createRadialGradient(spark.x, spark.y, 0, spark.x, spark.y, spark.size * 8);
    gradient.addColorStop(0, `hsla(${spark.hue}, 100%, 78%, ${spark.life})`);
    gradient.addColorStop(0.35, `hsla(${spark.hue}, 100%, 62%, ${spark.life * 0.38})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    fireworkCtx.fillStyle = gradient;
    fireworkCtx.beginPath();
    fireworkCtx.arc(spark.x, spark.y, spark.size * 8, 0, Math.PI * 2);
    fireworkCtx.fill();

    if (spark.life <= 0) bursts.splice(i, 1);
  }

  requestAnimationFrame(drawFireworks);
}

window.addEventListener("resize", resizeFireworks);
resizeFireworks();
requestAnimationFrame(drawFireworks);

(() => {
const gift = {
  image: "assets/fish.png"
};

let scratching = false;
let revealed = false;

const card = document.querySelector(".gift-card");
const image = document.querySelector(".gift-image");
const canvas = document.querySelector(".scratch-layer");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const progressBar = document.querySelector(".scratch-progress span");
const resetButton = document.querySelector(".reset-scratch");

function paintGift() {
  image.style.background = `center / cover no-repeat url("${gift.image}")`;
  image.innerHTML = "";
}

function resetScratch() {
  revealed = false;
  canvas.classList.remove("is-revealed");
  const rect = card.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.fillStyle = "#d9dde7";
  ctx.fillRect(0, 0, rect.width, rect.height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.32)";
  for (let x = -rect.height; x < rect.width; x += 28) {
    ctx.fillRect(x, 0, 12, rect.height * 1.6);
  }
  ctx.fillStyle = "rgba(43, 32, 36, 0.62)";
  ctx.font = "700 22px Microsoft YaHei, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("刮开看看", rect.width / 2, rect.height / 2);
  updateProgress(0);
}

function getPoint(event) {
  const point = event.touches ? event.touches[0] : event;
  const rect = canvas.getBoundingClientRect();
  return {
    x: point.clientX - rect.left,
    y: point.clientY - rect.top
  };
}

function scratchAt(event) {
  if (revealed) return;
  const { x, y } = getPoint(event);
  ctx.globalCompositeOperation = "destination-out";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 48;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 0.1, y + 0.1);
  ctx.stroke();
  const progress = getScratchProgress();
  updateProgress(progress);
  if (progress >= 0.62) revealCard();
}

function getScratchProgress() {
  const sample = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let clear = 0;
  for (let i = 3; i < sample.length; i += 16) {
    if (sample[i] < 20) clear += 1;
  }
  return clear / (sample.length / 16);
}

function updateProgress(value) {
  progressBar.style.width = `${Math.min(100, Math.round(value * 100))}%`;
}

function revealCard() {
  revealed = true;
  updateProgress(1);
  canvas.classList.add("is-revealed");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener("pointerdown", (event) => {
  scratching = true;
  canvas.setPointerCapture(event.pointerId);
  scratchAt(event);
});

canvas.addEventListener("pointermove", (event) => {
  if (scratching) scratchAt(event);
});

canvas.addEventListener("pointerup", () => {
  scratching = false;
});

canvas.addEventListener("pointercancel", () => {
  scratching = false;
});

resetButton.addEventListener("click", resetScratch);
window.addEventListener("resize", resetScratch);

paintGift();
requestAnimationFrame(resetScratch);
})();

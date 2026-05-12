const gifts = [
  {
    title: "第一张礼物卡",
    text: "兑换一次认真安排的约会",
    colors: ["#f7d1dc", "#b7d9e8"]
  },
  {
    title: "第二张礼物卡",
    text: "兑换一个只属于你的惊喜",
    colors: ["#ffe3a8", "#d9ece4"]
  },
  {
    title: "第三张礼物卡",
    text: "兑换一个大大的拥抱",
    colors: ["#cbb7ff", "#ffd0e1"]
  }
];

let currentGift = 0;
const card = document.querySelector(".gift-card");
const image = document.querySelector(".gift-image");
const canvas = document.querySelector(".scratch-layer");
const ctx = canvas.getContext("2d");
const caption = document.querySelector(".gift-caption");
const prev = document.querySelector(".prev-card");
const next = document.querySelector(".next-card");
let scratching = false;

function paintGift() {
  const gift = gifts[currentGift];
  image.style.background = `linear-gradient(135deg, ${gift.colors[0]}, ${gift.colors[1]})`;
  image.innerHTML = `<strong>${gift.title}</strong><span>${gift.text}</span>`;
  caption.textContent = `${currentGift + 1} / ${gifts.length}`;
}

function resetScratch() {
  const rect = card.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#d9dde7";
  ctx.fillRect(0, 0, rect.width, rect.height);
  ctx.fillStyle = "rgba(43, 32, 36, 0.62)";
  ctx.font = "700 22px Microsoft YaHei, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("刮开看看", rect.width / 2, rect.height / 2);
}

function scratchAt(event) {
  const point = event.touches ? event.touches[0] : event;
  const rect = canvas.getBoundingClientRect();
  const x = point.clientX - rect.left;
  const y = point.clientY - rect.top;
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 28, 0, Math.PI * 2);
  ctx.fill();
}

function showGift(index) {
  currentGift = (index + gifts.length) % gifts.length;
  paintGift();
  resetScratch();
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
prev.addEventListener("click", () => showGift(currentGift - 1));
next.addEventListener("click", () => showGift(currentGift + 1));
window.addEventListener("resize", resetScratch);

showGift(0);

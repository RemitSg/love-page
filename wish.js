const WISH_KEY = "love-page-wishes";
const MAX_WISHES = 3;

const form = document.querySelector(".wish-form");
const input = document.querySelector(".wish-input");
const count = document.querySelector(".wish-count strong");
const list = document.querySelector(".wish-list");

function loadWishes() {
  try {
    return JSON.parse(localStorage.getItem(WISH_KEY)) || [];
  } catch {
    return [];
  }
}

function saveWishes(wishes) {
  localStorage.setItem(WISH_KEY, JSON.stringify(wishes));
}

function renderWishes() {
  const wishes = loadWishes();
  count.textContent = String(Math.max(0, MAX_WISHES - wishes.length));
  input.disabled = wishes.length >= MAX_WISHES;
  form.querySelector("button").disabled = wishes.length >= MAX_WISHES;
  list.innerHTML = wishes.map((wish, index) => `
    <article class="wish-item">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <p>${wish.text}</p>
    </article>
  `).join("");
}

function launchWishStar(text) {
  const star = document.createElement("span");
  star.className = "wish-star";
  star.textContent = "★";
  star.style.left = `${window.innerWidth / 2}px`;
  star.style.top = `${window.innerHeight * 0.58}px`;
  star.dataset.text = text;
  document.body.appendChild(star);

  window.setTimeout(() => star.classList.add("fly"), 20);
  window.setTimeout(() => {
    for (let i = 0; i < 10; i += 1) {
      const spark = document.createElement("span");
      spark.className = "wish-spark";
      spark.style.left = star.style.left;
      spark.style.top = "18vh";
      spark.style.setProperty("--x", `${Math.cos(i) * (36 + i * 5)}px`);
      spark.style.setProperty("--y", `${Math.sin(i) * (28 + i * 4)}px`);
      document.body.appendChild(spark);
      window.setTimeout(() => spark.remove(), 900);
    }
    star.remove();
  }, 980);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();
  const wishes = loadWishes();
  if (!value || wishes.length >= MAX_WISHES) return;

  wishes.push({ text: value, createdAt: new Date().toISOString() });
  saveWishes(wishes);
  launchWishStar(value);
  input.value = "";
  renderWishes();
});

renderWishes();

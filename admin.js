const REPLY_STORAGE_KEY = "love-page-reply-rules";
const form = document.querySelector(".admin-form");
const rulesWrap = document.querySelector(".admin-rules");
const output = document.querySelector(".json-output");
const exportButton = document.querySelector(".export-json");
const resetButton = document.querySelector(".reset-json");
let rules = [];

async function loadDefaults() {
  const response = await fetch("data/replies.json");
  return response.json();
}

async function loadRules() {
  const saved = localStorage.getItem(REPLY_STORAGE_KEY);
  rules = saved ? JSON.parse(saved) : await loadDefaults();
  renderRules();
}

function saveRules() {
  localStorage.setItem(REPLY_STORAGE_KEY, JSON.stringify(rules));
}

function renderRules() {
  rulesWrap.innerHTML = rules.map((rule, index) => `
    <article class="rule-card">
      <strong>${rule.keywords.join(" / ")}</strong>
      <p>${rule.replies.join(" | ")}</p>
      <button class="text-button delete-rule" type="button" data-index="${index}">删除</button>
    </article>
  `).join("");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const keywords = String(data.get("keywords") || "").split(/[,，]/).map((item) => item.trim()).filter(Boolean);
  const replies = String(data.get("replies") || "").split(/\n/).map((item) => item.trim()).filter(Boolean);
  if (!keywords.length || !replies.length) return;
  rules.push({ keywords, replies });
  saveRules();
  renderRules();
  form.reset();
});

rulesWrap.addEventListener("click", (event) => {
  const button = event.target.closest(".delete-rule");
  if (!button) return;
  rules.splice(Number(button.dataset.index), 1);
  saveRules();
  renderRules();
});

exportButton.addEventListener("click", () => {
  output.value = JSON.stringify(rules, null, 2);
  output.select();
});

resetButton.addEventListener("click", async () => {
  rules = await loadDefaults();
  saveRules();
  renderRules();
  output.value = "";
});

loadRules();

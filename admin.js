const REPLY_STORAGE_KEY = "love-page-reply-rules";
const form = document.querySelector(".admin-form");
const rulesWrap = document.querySelector(".admin-rules");
const output = document.querySelector(".json-output");
const exportButton = document.querySelector(".export-json");
const resetButton = document.querySelector(".reset-json");
const submitButton = document.querySelector(".save-rule");
const cancelButton = document.querySelector(".cancel-edit");
let rules = [];
let editingIndex = -1;

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
      <button class="text-button edit-rule" type="button" data-index="${index}">编辑</button>
      <button class="text-button delete-rule" type="button" data-index="${index}">删除</button>
    </article>
  `).join("");
}

function stopEditing() {
  editingIndex = -1;
  submitButton.textContent = "保存规则";
  cancelButton.hidden = true;
  form.reset();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const keywords = String(data.get("keywords") || "").split(/[,，]/).map((item) => item.trim()).filter(Boolean);
  const replies = String(data.get("replies") || "").split(/\n/).map((item) => item.trim()).filter(Boolean);
  if (!keywords.length || !replies.length) return;
  if (editingIndex >= 0) {
    rules[editingIndex] = { keywords, replies };
  } else {
    rules.push({ keywords, replies });
  }
  saveRules();
  renderRules();
  stopEditing();
});

rulesWrap.addEventListener("click", (event) => {
  const editButton = event.target.closest(".edit-rule");
  if (editButton) {
    editingIndex = Number(editButton.dataset.index);
    const rule = rules[editingIndex];
    form.elements.keywords.value = rule.keywords.join("，");
    form.elements.replies.value = rule.replies.join("\n");
    submitButton.textContent = "保存修改";
    cancelButton.hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const deleteButton = event.target.closest(".delete-rule");
  if (deleteButton) {
    rules.splice(Number(deleteButton.dataset.index), 1);
    saveRules();
    renderRules();
    stopEditing();
  }
});

cancelButton.addEventListener("click", stopEditing);

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

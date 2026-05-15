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

function createDefaultRule() {
  return {
    isDefault: true,
    keywords: ["默认"],
    replies: [
      "这个关键词我还没有学会，但我会先把你的话认真收好。",
      "我暂时还没找到对应答案，不过这句话已经被我悄悄记下了。",
      "这个暗号还没有登记，但我愿意认真听你说。"
    ]
  };
}

function ensureDefaultRule(existingRules) {
  if (existingRules.some((rule) => rule.isDefault)) return existingRules;
  return [...existingRules, createDefaultRule()];
}

async function loadDefaults() {
  const response = await fetch("data/replies.json");
  return ensureDefaultRule(await response.json());
}

async function loadRules() {
  const saved = localStorage.getItem(REPLY_STORAGE_KEY);
  rules = saved ? ensureDefaultRule(JSON.parse(saved)) : await loadDefaults();
  saveRules();
  renderRules();
}

function saveRules() {
  localStorage.setItem(REPLY_STORAGE_KEY, JSON.stringify(rules));
}

function renderRules() {
  rulesWrap.innerHTML = rules.map((rule, index) => `
    <article class="rule-card ${rule.isDefault ? "default-rule" : ""}">
      <strong>${rule.isDefault ? "默认分组" : rule.keywords.join(" / ")}</strong>
      <p>${rule.replies.join(" | ")}</p>
      <button class="text-button edit-rule" type="button" data-index="${index}">编辑</button>
      <button class="text-button delete-rule" type="button" data-index="${index}" ${rule.isDefault ? "disabled" : ""}>删除</button>
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
  const previous = editingIndex >= 0 ? rules[editingIndex] : {};
  const nextRule = { keywords, replies };
  if (previous.isDefault) nextRule.isDefault = true;
  if (editingIndex >= 0) {
    rules[editingIndex] = nextRule;
  } else {
    rules.push(nextRule);
  }
  rules = ensureDefaultRule(rules);
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
  if (deleteButton && !deleteButton.disabled) {
    rules.splice(Number(deleteButton.dataset.index), 1);
    rules = ensureDefaultRule(rules);
    saveRules();
    renderRules();
    stopEditing();
  }
});

cancelButton.addEventListener("click", stopEditing);

exportButton.addEventListener("click", () => {
  output.value = JSON.stringify(ensureDefaultRule(rules), null, 2);
  output.select();
});

resetButton.addEventListener("click", async () => {
  rules = await loadDefaults();
  saveRules();
  renderRules();
  output.value = "";
});

loadRules();

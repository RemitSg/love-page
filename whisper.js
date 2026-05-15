const REPLY_STORAGE_KEY = "love-page-reply-rules";
const REPLY_DELAY = 3000;
const chatWindow = document.querySelector(".chat-window");
const chatForm = document.querySelector(".chat-form");
const chatInput = document.querySelector(".chat-input");
const chatSubmit = document.querySelector(".chat-submit");

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

function ensureDefaultRule(rules) {
  if (rules.some((rule) => rule.isDefault)) return rules;
  return [...rules, createDefaultRule()];
}

async function loadReplyRules() {
  const saved = localStorage.getItem(REPLY_STORAGE_KEY);
  if (saved) return ensureDefaultRule(JSON.parse(saved));
  const response = await fetch("data/replies.json");
  return ensureDefaultRule(await response.json());
}

function addBubble(text, type) {
  const bubble = document.createElement("p");
  bubble.className = `chat-bubble ${type}`;
  bubble.textContent = text;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addTypingIndicator() {
  const bubble = document.createElement("p");
  bubble.className = "chat-bubble bot typing-indicator";
  bubble.innerHTML = "对方正在打字中<span></span><span></span><span></span>";
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return bubble;
}

function setWaiting(isWaiting) {
  chatInput.disabled = isWaiting;
  chatSubmit.disabled = isWaiting;
  if (!isWaiting) chatInput.focus();
}

function pickRandom(replies) {
  return replies[Math.floor(Math.random() * replies.length)];
}

function findReply(message, rules) {
  const normalized = message.toLowerCase();
  const normalRules = rules.filter((item) => !item.isDefault);
  const defaultRule = rules.find((item) => item.isDefault) || createDefaultRule();
  const rule = normalRules.find((item) => item.keywords.some((keyword) => normalized.includes(keyword.toLowerCase())));
  return rule ? pickRandom(rule.replies) : pickRandom(defaultRule.replies);
}

let rulesPromise = loadReplyRules();

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (chatInput.disabled) return;
  const message = chatInput.value.trim();
  if (!message) return;
  chatInput.value = "";
  addBubble(message, "user");
  setWaiting(true);
  const typing = addTypingIndicator();
  const rules = await rulesPromise;
  window.setTimeout(() => {
    typing.remove();
    addBubble(findReply(message, rules), "bot");
    setWaiting(false);
  }, REPLY_DELAY);
});

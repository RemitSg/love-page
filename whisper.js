const REPLY_STORAGE_KEY = "love-page-reply-rules";
const chatWindow = document.querySelector(".chat-window");
const chatForm = document.querySelector(".chat-form");
const chatInput = document.querySelector(".chat-input");

async function loadReplyRules() {
  const saved = localStorage.getItem(REPLY_STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  const response = await fetch("data/replies.json");
  return response.json();
}

function addBubble(text, type) {
  const bubble = document.createElement("p");
  bubble.className = `chat-bubble ${type}`;
  bubble.textContent = text;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function findReply(message, rules) {
  const normalized = message.toLowerCase();
  const rule = rules.find((item) => item.keywords.some((keyword) => normalized.includes(keyword.toLowerCase())));
  if (!rule) return "这个关键词我还没学会，但我会先把你的话认真收好。";
  return rule.replies[Math.floor(Math.random() * rule.replies.length)];
}

let rulesPromise = loadReplyRules();

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  chatInput.value = "";
  addBubble(message, "user");
  const rules = await rulesPromise;
  window.setTimeout(() => addBubble(findReply(message, rules), "bot"), 220);
});

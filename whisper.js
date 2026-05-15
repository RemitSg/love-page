const REPLY_STORAGE_KEY = "love-page-reply-rules";
const REPLY_DELAY = 3000;
const chatWindow = document.querySelector(".chat-window");
const chatForm = document.querySelector(".chat-form");
const chatInput = document.querySelector(".chat-input");
const chatSubmit = document.querySelector(".chat-submit");

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

function addTypingIndicator() {
  const bubble = document.createElement("p");
  bubble.className = "chat-bubble bot typing-indicator";
  bubble.innerHTML = '对方正在打字中<span></span><span></span><span></span>';
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return bubble;
}

function setWaiting(isWaiting) {
  chatInput.disabled = true;
  chatSubmit.disabled = true;
  if (!isWaiting) {
    chatInput.disabled = false;
    chatSubmit.disabled = false;
    chatInput.focus();
  }
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

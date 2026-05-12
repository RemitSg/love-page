const messages = [
  "今天也很喜欢你。",
  "谢谢你出现在我的世界里。",
  "以后每个普通日子，都想和你一起过。",
  "这个网页会慢慢装满我们的故事。"
];

const button = document.querySelector(".heart-button");
const text = document.querySelector("#promise-text");

button.addEventListener("click", () => {
  const next = messages[Math.floor(Math.random() * messages.length)];
  text.textContent = next;
});

const messages = [
  "浠婂ぉ涔熷緢鍠滄浣犮€?,
  "璋㈣阿浣犲嚭鐜板湪鎴戠殑涓栫晫閲屻€?,
  "浠ュ悗姣忎釜鏅€氭棩瀛愶紝閮芥兂鍜屼綘涓€璧疯繃銆?,
  "杩欎釜缃戦〉浼氭參鎱㈣婊℃垜浠殑鏁呬簨銆?
];

const button = document.querySelector(".heart-button");
const text = document.querySelector("#promise-text");

button.addEventListener("click", () => {
  const next = messages[Math.floor(Math.random() * messages.length)];
  text.textContent = next;
});

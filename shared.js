const LOVE_START = new Date("2024-10-06T00:00:00+08:00").getTime();

function splitDuration(totalSeconds) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function twoDigits(value) {
  return String(value).padStart(2, "0");
}

function renderTimerUnit(unit, label, value) {
  return `<span class="timer-unit" data-unit="${unit}"><span class="timer-number" data-value="${value}">${value}</span><span class="timer-label">${label}</span></span>`;
}

function getTimerValues(now = Date.now()) {
  const elapsed = Math.max(0, Math.floor((now - LOVE_START) / 1000));
  const time = splitDuration(elapsed);
  return {
    days: String(time.days),
    hours: twoDigits(time.hours),
    minutes: twoDigits(time.minutes),
    seconds: twoDigits(time.seconds)
  };
}

function updateTimer(timer, now = Date.now()) {
  const values = getTimerValues(now);

  if (!timer.dataset.ready) {
    timer.innerHTML = [
      '<span class="timer-prefix">我们已经在一起</span>',
      renderTimerUnit("days", "天", values.days),
      renderTimerUnit("hours", "时", values.hours),
      renderTimerUnit("minutes", "分", values.minutes),
      renderTimerUnit("seconds", "秒", values.seconds)
    ].join("");
    timer.dataset.ready = "true";
    return;
  }

  for (const [unit, value] of Object.entries(values)) {
    const number = timer.querySelector(`[data-unit="${unit}"] .timer-number`);
    if (number && number.dataset.value !== value) {
      number.dataset.value = value;
      number.textContent = value;
      number.classList.remove("tick");
      void number.offsetWidth;
      number.classList.add("tick");
    }
  }
}

function initTimers() {
  const timers = document.querySelectorAll(".love-timer");
  timers.forEach((timer) => updateTimer(timer));
  window.setInterval(() => timers.forEach((timer) => updateTimer(timer)), 1000);
}

function initMusicButton() {
  const buttons = document.querySelectorAll(".music-toggle");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("is-on");
      button.setAttribute("aria-label", button.classList.contains("is-on") ? "背景音乐等待接入" : "播放背景音乐");
      button.textContent = button.classList.contains("is-on") ? "♫" : "♪";
    });
  });
}

initTimers();
initMusicButton();

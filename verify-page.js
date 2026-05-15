const fs = require("fs");

const files = {
  home: fs.readFileSync("index.html", "utf8"),
  letter: fs.readFileSync("letter.html", "utf8"),
  timeline: fs.readFileSync("timeline.html", "utf8"),
  whisper: fs.readFileSync("whisper.html", "utf8"),
  wish: fs.readFileSync("wish.html", "utf8"),
  gift: fs.readFileSync("gift.html", "utf8"),
  admin: fs.readFileSync("admin.html", "utf8"),
  styles: fs.readFileSync("styles.css", "utf8"),
  particles: fs.readFileSync("home-particles.js", "utf8"),
  shared: fs.readFileSync("shared.js", "utf8"),
  wishes: fs.readFileSync("wish.js", "utf8"),
  gifts: fs.readFileSync("gift.js", "utf8"),
  whisperJs: fs.readFileSync("whisper.js", "utf8"),
  adminJs: fs.readFileSync("admin.js", "utf8"),
  replies: fs.readFileSync("data/replies.json", "utf8")
};

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    process.exitCode = 1;
  }
}

const pages = [files.home, files.letter, files.timeline, files.whisper, files.wish, files.gift, files.admin];

assert(files.home.includes("<h1 id=\"title\">给最特别的你</h1>"), "Hero keeps the main title");
assert(files.home.includes('href="wish.html"'), "Home links to wish page");
assert(files.home.includes('href="gift.html"'), "Home links to gift page");
assert(pages.every((page) => page.includes('class="particle-canvas"')), "Every page includes the particle canvas");
assert(pages.every((page) => page.includes('src="home-particles.js?v=20260512-distance-fix"')), "Every page loads particles");
assert(pages.every((page) => page.includes('src="shared.js?v=20260512-expansion"')), "Every page loads shared JS");
assert(pages.every((page) => page.includes('class="love-timer"')), "Every page includes timer");
assert(pages.every((page) => page.includes('class="music-toggle"')), "Every page includes music toggle");
assert(files.styles.includes("assets/StarrySky_x4.png"), "All pages use the StarrySky background asset");
assert(files.styles.includes("background: rgba(255, 255, 255, 0.14);"), "Home panel stays transparent");
assert(!files.styles.includes("background: rgba(255, 255, 255, 0.58);"), "Panels should match the home transparency");
assert(files.styles.includes("white-space: nowrap;"), "Home title stays on one line");

assert(files.shared.includes('new Date("2024-10-06T00:00:00+08:00")'), "Timer starts at the requested date");
assert(files.shared.includes('data-unit="${unit}"'), "Timer renders stable data-unit markers");
assert(files.shared.includes('querySelector(`[data-unit="${unit}"] .timer-number`)'), "Timer updates by unit instead of nth-of-type");
assert(!files.shared.includes("nth-of-type"), "Timer should not use positional selectors");
assert(files.shared.includes("timer-number") && files.shared.includes("tick"), "Timer animates number updates");
assert(files.shared.includes("music-toggle"), "Shared JS wires music placeholder");

assert(files.wish.includes('class="wish-form"'), "Wish page includes form");
assert(files.wish.includes("clear-wishes"), "Wish page can clear wishes");
assert(files.wishes.includes("MAX_WISHES = 3"), "Wish page allows three wishes");
assert(files.wishes.includes('WISH_KEY = "love-page-wishes-v2"'), "Wish storage key is reset");
assert(files.wishes.includes("localStorage.removeItem(WISH_KEY)"), "Wish script clears saved wishes");
assert(files.wishes.includes("localStorage"), "Wishes persist locally");
assert(files.wishes.includes("wish-star") && files.wishes.includes("wish-spark"), "Wish animation creates star and particles");

assert(files.gift.includes('class="scratch-layer"'), "Gift page includes scratch canvas");
assert(files.gifts.includes("destination-out"), "Gift scratch canvas reveals card");
assert(files.gifts.includes("prev-card") && files.gifts.includes("next-card"), "Gift cards can switch left/right");
assert((files.gifts.match(/title:/g) || []).length === 3, "Gift page defines three cards");

assert(files.whisper.includes('class="chat-form"'), "Whisper page includes chat form");
assert(files.whisper.includes('<div class="chat-window" aria-live="polite"></div>'), "Whisper chat starts empty");
assert(!files.whisper.includes("告诉我一个关键词"), "Whisper should not show the initial prompt bubble");
assert(files.whisper.includes("admin.html"), "Whisper page links to admin");
assert(files.whisper.includes("管理关键词"), "Whisper page names the keyword editor");
assert(files.whisperJs.includes("data/replies.json"), "Whisper loads default replies JSON");
assert(files.whisperJs.includes("localStorage"), "Whisper supports local reply overrides");
assert(files.whisperJs.includes("ensureDefaultRule"), "Whisper preserves existing rules and appends a default group");
assert(files.whisperJs.includes("normalRules = rules.filter((item) => !item.isDefault)"), "Whisper matches normal rules before default group");
assert(files.whisperJs.includes("pickRandom(defaultRule.replies)"), "Unmatched keywords use random default replies");
assert(files.whisperJs.includes("REPLY_DELAY = 3000"), "Whisper replies wait for three seconds");
assert(files.whisperJs.includes("typing-indicator"), "Whisper shows typing indicator");
assert(files.whisperJs.includes("chatInput.disabled = isWaiting"), "Whisper disables input while replying");
assert(JSON.parse(files.replies).length >= 3, "Default replies include starter rules");
assert(JSON.parse(files.replies).some((rule) => rule.isDefault), "Default replies include a default group");
assert(files.admin.includes('class="admin-form"'), "Admin page includes editor form");
assert(files.admin.includes("导出 JSON 后交给我更新到仓库"), "Admin explains how to update default rules");
assert(files.adminJs.includes("export-json"), "Admin can export JSON");
assert(files.adminJs.includes("reset-json"), "Admin can reset defaults");
assert(files.adminJs.includes("editingIndex"), "Admin can edit existing rules");
assert(files.adminJs.includes("edit-rule"), "Admin renders edit buttons");
assert(files.adminJs.includes("submitButton.textContent"), "Admin changes submit button while editing");
assert(files.adminJs.includes("ensureDefaultRule"), "Admin appends default group without overwriting existing rules");
assert(files.adminJs.includes("默认分组"), "Admin labels the default group");
assert(files.adminJs.includes('rule.isDefault ? "disabled" : ""'), "Admin prevents deleting the default group");
assert(files.styles.includes("typing-indicator"), "Typing indicator has styles");
assert(files.styles.includes(".rule-card.default-rule"), "Default group has distinct styling");

assert(files.particles.includes("const PARTICLE_COUNT = 1000"), "Particles remain at requested count");
assert(files.particles.includes("const PARTICLE_SIZE = 2.3"), "Particles remain at requested size");
assert(files.particles.includes("distanceToPointer < FOLLOW_RADIUS"), "Particles use current pointer distance to follow");
assert(files.particles.includes("particle.x + (pointer.x - particle.x) * pull"), "Particle follow uses current position");

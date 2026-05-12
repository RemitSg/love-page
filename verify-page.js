const fs = require("fs");

const html = fs.readFileSync("index.html", "utf8");
const script = fs.readFileSync("script.js", "utf8");
const letter = fs.readFileSync("letter.html", "utf8");
const timeline = fs.readFileSync("timeline.html", "utf8");
const whisper = fs.readFileSync("whisper.html", "utf8");

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    process.exitCode = 1;
  }
}

const heroMatch = html.match(/<section class="hero"[\s\S]*?<\/section>/);
assert(heroMatch, "Missing hero section");

const hero = heroMatch ? heroMatch[0] : "";
assert(hero.includes("<h1 id=\"title\">给最特别的你</h1>"), "Hero keeps the main title");
assert(!hero.includes("intro"), "Hero should not contain intro copy");
assert(!hero.includes("A tiny page for you"), "Hero should not contain eyebrow text");
assert((hero.match(/class="button/g) || []).length >= 3, "Hero should provide navigation buttons");

assert(!html.includes('href="#letter"'), "Home should not use letter anchor links");
assert(!html.includes('href="#timeline"'), "Home should not use timeline anchor links");
assert(!html.includes('href="#whisper"'), "Home should not use whisper anchor links");
assert(!html.includes('id="letter"'), "Letter content should not be on the home page");
assert(!html.includes('id="timeline"'), "Timeline content should not be on the home page");
assert(!html.includes('id="whisper"'), "Whisper content should not be on the home page");
assert(html.includes('href="letter.html"'), "Home links to letter page");
assert(html.includes('href="timeline.html"'), "Home links to timeline page");
assert(html.includes('href="whisper.html"'), "Home links to whisper page");
assert(letter.includes('href="index.html"'), "Letter page can return home");
assert(timeline.includes('href="index.html"'), "Timeline page can return home");
assert(whisper.includes('href="index.html"'), "Whisper page can return home");
assert(script.includes("今天也很喜欢你。"), "Script keeps UTF-8 Chinese messages");

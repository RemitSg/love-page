const fs = require("fs");

const html = fs.readFileSync("index.html", "utf8");
const script = fs.readFileSync("script.js", "utf8");

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

assert(html.includes('id="letter"'), "Letter section exists outside the hero");
assert(html.includes('id="timeline"'), "Timeline section exists outside the hero");
assert(html.includes('id="whisper"'), "Whisper section exists outside the hero");
assert(html.includes('href="#letter"'), "Hero links to letter");
assert(html.includes('href="#timeline"'), "Hero links to timeline");
assert(html.includes('href="#whisper"'), "Hero links to whisper");
assert(script.includes("今天也很喜欢你。"), "Script keeps UTF-8 Chinese messages");

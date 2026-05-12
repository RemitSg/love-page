const fs = require("fs");

const html = fs.readFileSync("index.html", "utf8");
const script = fs.readFileSync("script.js", "utf8");
const particles = fs.readFileSync("home-particles.js", "utf8");
const styles = fs.readFileSync("styles.css", "utf8");
const letter = fs.readFileSync("letter.html", "utf8");
const timeline = fs.readFileSync("timeline.html", "utf8");
const whisper = fs.readFileSync("whisper.html", "utf8");
const pages = [html, letter, timeline, whisper];

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

assert(html.includes('class="particle-canvas"'), "Home includes the particle canvas");
assert(html.includes('src="home-particles.js?v=20260512-distance-fix"'), "Home loads the cache-busted particle script");
assert(pages.every((page) => page.includes('class="particle-canvas"')), "Every page includes the particle canvas");
assert(pages.every((page) => page.includes('src="home-particles.js?v=20260512-distance-fix"')), "Every page loads the cache-busted particle script");
assert(styles.includes("assets/StarrySky_x4.png"), "All pages use the StarrySky background asset");
assert(particles.includes("pointerVelocity"), "Particle script tracks pointer velocity");
assert(particles.includes("homeX") && particles.includes("homeY"), "Particles keep original positions");
assert(particles.includes("requestAnimationFrame"), "Particles animate smoothly");
assert(particles.includes("Math.hypot"), "Particles use smooth distance checks");
assert(particles.includes("const PARTICLE_COUNT = 1000"), "Home uses exactly 1000 particles");
assert(particles.includes("const PARTICLE_SIZE = 2.3"), "Particles use the requested fixed size");
assert(particles.includes("size: PARTICLE_SIZE"), "Every particle has the same size");
assert(!particles.includes("Math.random() * 2.8"), "Particles should not use random sizes");
assert(particles.includes("const FOLLOW_RADIUS = 300"), "Particles follow when currently close enough to the pointer");
assert(particles.includes("distanceToPointer < FOLLOW_RADIUS"), "Particles use current pointer distance to follow");
assert(!particles.includes("Math.hypot(pointer.x - particle.homeX"), "Particles should not use initial home position for follow checks");
assert(particles.includes("particle.x + (pointer.x - particle.x) * pull"), "Follow target uses current particle position");
assert(!particles.includes("(pointer.x - particle.homeX) *"), "Follow target should not pull from the original home position");
assert(particles.includes("const FAST_POINTER_SPEED = 56"), "Fast mouse movement releases particles");
assert(particles.includes("pointer.pointerVelocity < FAST_POINTER_SPEED && distanceToPointer < FOLLOW_RADIUS"), "Follow depends on speed and current distance");

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

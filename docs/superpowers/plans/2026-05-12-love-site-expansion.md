# Love Site Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a shared relationship timer, wish page, scratch gift cards, music scaffolding, and keyword-based whisper chat/editor to the static GitHub Pages love site.

**Architecture:** Keep the site static and data-driven. Shared features live in small focused JavaScript files, page-specific files own page interactions, and editable content is stored in JSON/localStorage so the site works without a server.

**Tech Stack:** Plain HTML, CSS, JavaScript, Canvas, localStorage, GitHub Pages.

---

### Task 1: Shared Shell

**Files:**
- Modify: `index.html`, `letter.html`, `timeline.html`, `whisper.html`
- Create: `wish.html`, `gift.html`, `admin.html`
- Modify: `styles.css`
- Create: `shared.js`

- [ ] Add shared top timer markup and music button to every page.
- [ ] Add navigation links for wish and gift pages.
- [ ] Implement timer from `2024-10-06T00:00:00+08:00` with animated digit updates.
- [ ] Add cache-busted script references.

### Task 2: Wishes

**Files:**
- Create: `wish.js`
- Modify: `wish.html`, `styles.css`

- [ ] Build a three-wish form backed by `localStorage`.
- [ ] Animate submitted wish text into a star that flies upward and dissolves.
- [ ] Render saved wishes in a scene list.

### Task 3: Gift Cards

**Files:**
- Create: `gift.js`
- Modify: `gift.html`, `styles.css`

- [ ] Build a three-card carousel.
- [ ] Add scratch canvas masks that reveal image-backed cards.
- [ ] Support mouse and touch scratching.

### Task 4: Whisper Chat and Admin

**Files:**
- Create: `data/replies.json`
- Create: `whisper.js`
- Create: `admin.js`
- Modify: `whisper.html`, `admin.html`, `styles.css`

- [ ] Replace heart button with chat UI.
- [ ] Match user input against keyword rules.
- [ ] Use JSON defaults plus localStorage overrides.
- [ ] Add admin editor for keyword/reply pairs with JSON import/export.

### Task 5: Verification and Deploy

**Files:**
- Modify: `verify-page.js`

- [ ] Extend static checks for new pages, scripts, timer, and data files.
- [ ] Run `node verify-page.js` and JavaScript syntax checks.
- [ ] Commit and upload changed files to GitHub Pages.

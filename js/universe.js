/* ============================================================
   The Atelier — explorable portfolio engine
   Free-roam 2D world · pick-your-tool avatar · room panels
   ============================================================ */

const WORLD_W = 2600, WORLD_H = 1800;
const NEAR_RADIUS = 155;

const ROOMS = [
  { key: "about",      icon: "📓", label: "The Sketchbook", sub: "About",      x: 720,  y: 520  },
  { key: "experience", icon: "🛠️", label: "The Workbench",  sub: "Experience", x: 1300, y: 360  },
  { key: "projects",   icon: "🎨", label: "The Gallery",    sub: "Projects",   x: 1940, y: 560  },
  { key: "skills",     icon: "🧰", label: "The Toolbox",    sub: "Skills",     x: 2040, y: 1200 },
  { key: "education",  icon: "📚", label: "The Archive",    sub: "Education",  x: 1300, y: 1400 },
  { key: "contact",    icon: "✉️", label: "The Postbox",    sub: "Contact",    x: 600,  y: 1220 },
  { key: "learnings",  icon: "🪶", label: "The Reading Nook", sub: "Learnings", x: 430,  y: 880  },
];

const DOODLES = [
  { e: "✦", x: 1000, y: 880 }, { e: "✺", x: 1640, y: 940 }, { e: "❉", x: 1300, y: 760 },
  { e: "✦", x: 480,  y: 760 }, { e: "✷", x: 2200, y: 820 }, { e: "❋", x: 1750, y: 1300 },
  { e: "✦", x: 900,  y: 1450 }, { e: "✺", x: 2300, y: 520 }, { e: "❉", x: 300, y: 1000 },
];

// ---- state ----
let tool = null;
let started = false;
const avatar = { x: WORLD_W / 2, y: WORLD_H / 2 };
let target = null;        // click-to-move target {x,y}
let autoEnter = null;     // room key to auto-open on arrival (fast-travel)
let camX = 0, camY = 0;
let nearRoom = null;
let panelOpen = false;
let sceneOpen = false;
let projectsLoaded = false;
const keys = {};
let particles = [];

// ---- dom ----
const $ = (s) => document.querySelector(s);
const intro = $("#intro");
const stage = $("#stage");
const world = $("#world");
const viewport = $("#viewport");
const avatarEl = $("#avatar");
const enterHint = $("#enter-hint");
const panel = $("#panel");
const panelBody = $("#panel-body");
const trail = $("#trail");
const tctx = trail.getContext("2d");

/* ===================== INTRO ===================== */
document.querySelectorAll(".tool").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tool").forEach((b) => b.setAttribute("aria-checked", "false"));
    btn.setAttribute("aria-checked", "true");
    tool = btn.dataset.tool;
    $("#enter-btn").disabled = false;
  });
});
$("#enter-btn").addEventListener("click", startWorld);

function startWorld() {
  if (!tool || started) return;
  started = true;
  intro.hidden = true;
  stage.hidden = false;
  avatarEl.dataset.tool = tool;

  trail.width = WORLD_W;
  trail.height = WORLD_H;

  buildRooms();
  buildDoodles();
  buildLegend();
  requestAnimationFrame(loop);
}

/* ===================== BUILD WORLD ===================== */
function buildRooms() {
  ROOMS.forEach((r) => {
    const el = document.createElement("div");
    el.className = "room";
    el.style.left = r.x + "px";
    el.style.top = r.y + "px";
    el.dataset.key = r.key;
    el.innerHTML = `
      <div class="room__disc">${r.icon}</div>
      <div class="room__label">${r.label}</div>
      <div class="room__sub">${r.sub}</div>`;
    el.addEventListener("click", (e) => { e.stopPropagation(); enterRoom(r.key); });
    world.appendChild(el);
    r.el = el;
  });
}

function buildDoodles() {
  DOODLES.forEach((d) => {
    const s = document.createElement("span");
    s.className = "doodle";
    s.textContent = d.e;
    s.style.left = d.x + "px";
    s.style.top = d.y + "px";
    world.appendChild(s);
  });
}

function buildLegend() {
  const ul = $("#legend ul");
  ROOMS.forEach((r) => {
    const li = document.createElement("li");
    li.innerHTML = `<button data-key="${r.key}">${r.icon} ${r.label}</button>`;
    li.querySelector("button").addEventListener("click", () => travelTo(r.key));
    ul.appendChild(li);
  });
}

function travelTo(key) {
  const r = ROOMS.find((x) => x.key === key);
  target = { x: r.x, y: r.y + 40 };
  autoEnter = key;
}

/* ===================== INPUT ===================== */
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && panelOpen) { closePanel(); return; }
  if (panelOpen || sceneOpen) return;
  keys[e.key.toLowerCase()] = true;
  if ((e.key === " " || e.key === "e" || e.key === "Enter") && nearRoom) {
    enterRoom(nearRoom.key);
  }
  if (e.key.startsWith("Arrow")) e.preventDefault();
});
window.addEventListener("keyup", (e) => { keys[e.key.toLowerCase()] = false; });

viewport.addEventListener("click", (e) => {
  if (panelOpen) return;
  target = { x: e.clientX - camX, y: e.clientY - camY };
  autoEnter = null;
});

$("#panel-close").addEventListener("click", closePanel);
panel.addEventListener("click", (e) => { if (e.target === panel) closePanel(); });
$("#help-btn").addEventListener("click", showHelp);

/* ===================== GAME LOOP ===================== */
function loop() {
  if (!panelOpen && !sceneOpen) update();
  requestAnimationFrame(loop);
}

function update() {
  const speed = 5;
  let dx = 0, dy = 0;

  if (keys["w"] || keys["arrowup"]) dy -= 1;
  if (keys["s"] || keys["arrowdown"]) dy += 1;
  if (keys["a"] || keys["arrowleft"]) dx -= 1;
  if (keys["d"] || keys["arrowright"]) dx += 1;

  if (dx || dy) {
    target = null; // keyboard overrides click-move
    const len = Math.hypot(dx, dy);
    avatar.x += (dx / len) * speed;
    avatar.y += (dy / len) * speed;
  } else if (target) {
    const tx = target.x - avatar.x, ty = target.y - avatar.y;
    const dist = Math.hypot(tx, ty);
    if (dist < 4) { target = null; }
    else {
      const step = Math.min(speed + 1, dist);
      avatar.x += (tx / dist) * step;
      avatar.y += (ty / dist) * step;
      dx = tx; dy = ty;
    }
  }

  // clamp to world
  avatar.x = Math.max(40, Math.min(WORLD_W - 40, avatar.x));
  avatar.y = Math.max(40, Math.min(WORLD_H - 40, avatar.y));

  // emit trail while moving
  if (dx || dy) {
    particles.push({ x: avatar.x, y: avatar.y + 16, life: 1, r: 3 + Math.random() * 3 });
    if (particles.length > 170) particles.shift();
    const lean = Math.max(-12, Math.min(12, dx * 0.5));
    avatarEl.style.rotate = lean + "deg";
  }

  // camera follows avatar (clamped to world)
  const vw = window.innerWidth, vh = window.innerHeight;
  camX = clamp(vw / 2 - avatar.x, Math.min(0, vw - WORLD_W), 0);
  camY = clamp(vh / 2 - avatar.y, Math.min(0, vh - WORLD_H), 0);
  world.style.transform = `translate(${camX}px, ${camY}px)`;

  avatarEl.style.left = avatar.x + "px";
  avatarEl.style.top = avatar.y + "px";

  drawTrail();
  updateProximity();

  // fast-travel auto-enter
  if (autoEnter && nearRoom && nearRoom.key === autoEnter) {
    const k = autoEnter; autoEnter = null; target = null;
    enterRoom(k);
  }
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/* ===================== TRAIL ===================== */
function drawTrail() {
  tctx.clearRect(0, 0, WORLD_W, WORLD_H);
  for (const p of particles) {
    p.life -= 0.012;
    if (p.life <= 0) continue;
    tctx.globalAlpha = Math.max(0, p.life) * 0.8;
    if (tool === "brush") {
      tctx.fillStyle = "#c0613f";
      tctx.beginPath(); tctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); tctx.fill();
    } else if (tool === "pencil") {
      tctx.fillStyle = "#2b2622";
      tctx.beginPath(); tctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); tctx.fill();
    } else if (tool === "scissors") {
      tctx.strokeStyle = "#3a6b66"; tctx.lineWidth = 2;
      tctx.beginPath(); tctx.moveTo(p.x - 5, p.y - 5); tctx.lineTo(p.x + 5, p.y + 5); tctx.stroke();
    } else { // thread
      tctx.strokeStyle = "#c0613f"; tctx.lineWidth = 2.4; tctx.setLineDash([3, 4]);
      tctx.beginPath(); tctx.moveTo(p.x - 6, p.y); tctx.lineTo(p.x + 6, p.y); tctx.stroke();
      tctx.setLineDash([]);
    }
  }
  tctx.globalAlpha = 1;
  particles = particles.filter((p) => p.life > 0);
}

/* ===================== PROXIMITY ===================== */
function updateProximity() {
  let found = null, best = NEAR_RADIUS;
  for (const r of ROOMS) {
    const d = Math.hypot(r.x - avatar.x, r.y - avatar.y);
    if (d < best) { best = d; found = r; }
  }
  if (found !== nearRoom) {
    if (nearRoom) nearRoom.el.classList.remove("near");
    nearRoom = found;
    if (nearRoom) nearRoom.el.classList.add("near");
  }
  if (nearRoom) {
    enterHint.hidden = false;
    enterHint.querySelector("strong").textContent = nearRoom.label;
    enterHint.style.left = (nearRoom.x + camX) + "px";
    enterHint.style.top = (nearRoom.y + camY - 86) + "px";
  } else {
    enterHint.hidden = true;
  }
}

/* ===================== ROOM PANEL ===================== */
function enterRoom(key) {
  if (SCENES[key]) { openScene(key); return; }
  const src = document.getElementById("room-" + key);
  if (!src) return;
  panelBody.innerHTML = "";
  panelBody.appendChild(src.cloneNode(true));
  panelBody.firstElementChild.removeAttribute("id");
  panel.hidden = false;
  panelOpen = true;
  $("#panel-title")?.remove();
  // mark for aria
  const h2 = panelBody.querySelector("h2");
  if (h2) h2.id = "panel-title";

  if (key === "projects") loadProjects();
}

function closePanel() {
  panel.hidden = true;
  panelOpen = false;
  // release any held keys so avatar doesn't drift
  for (const k in keys) keys[k] = false;
}

function showHelp() {
  panelBody.innerHTML = `
    <h2 id="panel-title">How to roam</h2>
    <p class="room__kicker">Quick guide</p>
    <ul>
      <li><strong>Move:</strong> W A S D or the arrow keys — or click anywhere to walk there.</li>
      <li><strong>Enter a space:</strong> walk up to it and click it (or press <kbd>E</kbd>).</li>
      <li><strong>Jump to a space:</strong> use the <em>Spaces</em> list, bottom-left.</li>
      <li><strong>In a hurry?</strong> Hit <em>Résumé view</em> (top-right) for the classic page.</li>
    </ul>
    <p class="muted">You're exploring as a ${tool}. Notice the trail it leaves behind ✨</p>`;
  panel.hidden = false;
  panelOpen = true;
}

/* ===================== PROJECTS (live GitHub) ===================== */
async function loadProjects() {
  const grid = document.getElementById("gallery-grid");
  if (!grid || projectsLoaded) return;
  try {
    const res = await fetch(
      "https://api.github.com/users/jermynyeo/repos?per_page=100&sort=updated",
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (!res.ok) throw new Error(res.status);
    const repos = await res.json();
    const featured = repos
      .filter((r) => !r.fork && !r.archived && r.name !== "jermynyeo")
      .sort((a, b) =>
        b.stargazers_count - a.stargazers_count ||
        new Date(b.updated_at) - new Date(a.updated_at)
      )
      .slice(0, 6);

    grid.innerHTML = featured.map((r) => `
      <div class="gcard">
        <h4>${pretty(r.name)}</h4>
        <p class="meta">${r.language || ""}${r.stargazers_count ? " · ★ " + r.stargazers_count : ""}</p>
        <p>${esc(r.description || "")}</p>
        <a href="${r.html_url}" target="_blank" rel="noopener">View on GitHub ↗</a>
      </div>`).join("");
    projectsLoaded = true;
  } catch (err) {
    grid.innerHTML = `<p class="muted">Couldn't reach GitHub right now —
      <a href="https://github.com/jermynyeo?tab=repositories" target="_blank" rel="noopener">browse my repos →</a></p>`;
  }
}

function pretty(n) { return esc(n.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())); }
function esc(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

/* ============================================================
   IMMERSIVE SCENE — Experience as a Milky-Way timeline
   ============================================================ */
const MILESTONES = [
  { year: "2018", badge: "🎓", title: "Where it began", org: "Singapore Management University",
    lines: ["Began a BSc in Information Systems — the launchpad.",
            "A foundation in ML, AI, text mining & analytics."] },
  { year: "2020", badge: "🛰️", title: "First missions", org: "GovTech · SMU Research",
    lines: ["SWE Intern at GovTech — dashboards in Python, Power BI & Tableau.",
            "Research Assistant at SMU — a game-analytics data pipeline."] },
  { year: "2021", badge: "🪐", title: "New orbits", org: "YouTrip",
    lines: ["Software Engineer Intern — built backend APIs in Go."] },
  { year: "2022", badge: "🚀", title: "Liftoff", org: "Ernst & Young → JPMorganChase",
    lines: ["Compliance Intern at EY; graduated SMU Summa Cum Laude.",
            "Joined JPMorgan as a Software Engineer (Trade Surveillance).",
            "Batch ETL with stored procs; Spring Boot microservices."] },
  { year: "2024", badge: "✨", title: "Associate Software Engineer", org: "JPMorganChase · Data Governance & Controls",
    lines: ["Built a Java Spring Boot self-service data-feed platform.",
            "Engineered Spark / Databricks ETL over terabyte-scale data.",
            "Led migration to AWS (S3, Glue, Athena, Lambda)."] },
  { year: "2026", badge: "🌟", title: "Senior Associate Software Engineer", org: "JPMorganChase · Data Governance & Controls",
    lines: ["Leading automated reconciliation jobs across the data platform.",
            "Built data-quality validations for cloud-onboarded data.",
            "Spearheaded a real-time reconciliation-metrics dashboard (Kafka + Spring Boot)."],
    present: true },
];
MILESTONES.reverse(); // present day first, then journey back in time

/* ---- room content for the scenes ---- */
const SKILL_GROUPS = [
  { h: "Languages", items: "Python · Java · Go · JavaScript · SQL" },
  { h: "Frameworks & Tools", items: "Spring Boot · Flask · React · Vue · Docker · Git" },
  { h: "Data Engineering", items: "Apache Spark · Kafka · Databricks · ETL & Pipelines · Data Governance · Data Quality · Tableau · Power BI" },
  { h: "Cloud & Infra", items: "AWS (S3 · Glue · Athena · EMR · Lambda) · Kubernetes · Terraform · Linux / RHEL · Microservices" },
  { h: "Certifications", items: "CKAD · Terraform Associate · Databricks Lakehouse · AWS Cloud Practitioner · Claude 101 / Code 101" },
];
const ABOUT = {
  paras: [
    "I'm a data and platform engineer who likes owning the whole journey of data — from ingestion and ETL through the quality, governance, and reporting layers teams depend on. At JPMorgan I've spent four years building exactly that across compliance technology.",
    "I work mostly in Java and Python, steadily deepening the platform side — Kubernetes (CKAD), Terraform, and AWS. I'm happiest with problems that are equal parts systems design and data craft.",
  ],
  facts: ["💼 Engineering @ JPMorganChase", "🗣️ English & Mandarin (native) · Cantonese", "📍 Singapore"],
};
const EDU = {
  degree: "BSc, Information Systems",
  org: "Singapore Management University · Summa Cum Laude · 2018–2022",
  lines: [
    "🏆 SIS Aspirations Scholarship · Dean's List (AY 2019, 2022)",
    "🧐 Final-year project on online discussion forums — NLP & learning analytics.",
    "📚 Focus: Machine Learning · AI · Text Mining · Social & Visual Analytics.",
    "💼 Teaching Assistant across six courses.",
  ],
  cca: "CCAs: SMUX Trekking · SMU Strategica · SCIS Ellipsis",
};
// DRAFT reflections — replace each `text` with your own 感想 / thoughts.
const REFLECTIONS = [
  { topic: "CKAD — Kubernetes", kind: "Certificate · 2024",
    text: "DRAFT — your thoughts after CKAD: what finally clicked about Kubernetes, what surprised you, and how it changed the way you think about shipping services." },
  { topic: "This Portfolio", kind: "Project · 2026",
    text: "DRAFT — building my own site as an explorable craft world taught me… (scoping a playful idea, the design vs. engineering trade-offs, what you'd reuse next time)." },
  { topic: "Fake News Detection", kind: "Project · University",
    text: "DRAFT — reflecting on the NLP project: what worked, what was hard about the data, and what you'd do differently now with more experience." },
];

/* ---- exhibit renderers ---- */
function milestoneHTML(m) {
  return `
    <div class="milestone__node"></div>
    <div class="milestone__card">
      <div class="milestone__year">${m.year}</div>
      <div class="milestone__badge">${m.badge}</div>
      <div class="milestone__title">${esc(m.title)}</div>
      <div class="milestone__org">${esc(m.org)}</div>
      <ul class="milestone__lines">${m.lines.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
      ${m.present ? '<span class="milestone__present">Present day</span>' : ""}
    </div>`;
}
function frameHTML(r) {
  return `
    <div class="frame">
      <div class="frame__hook"></div>
      <div class="frame__mat">
        <div class="frame__canvas">
          <span class="frame__tag">${esc(r.language || "project")}</span>
          <h3 class="frame__title">${pretty(r.name)}</h3>
          <p class="frame__desc">${esc(r.description || "A little experiment.")}</p>
        </div>
      </div>
      <div class="frame__plate">
        <a href="${esc(r.html_url)}" target="_blank" rel="noopener">View on GitHub ↗</a>
        ${r.stargazers_count ? `<span>★ ${r.stargazers_count}</span>` : ""}
      </div>
    </div>`;
}
function boardHTML(groups) {
  return `<div class="board">${groups.map((g, i) => `
    <div class="postit postit--${i % 4}">
      <h4>${esc(g.h)}</h4>
      <p>${esc(g.items)}</p>
    </div>`).join("")}</div>`;
}
function diplomaHTML(e) {
  return `
    <div class="diploma">
      <div class="diploma__seal">🎓</div>
      <h2 class="diploma__degree">${esc(e.degree)}</h2>
      <p class="diploma__org">${esc(e.org)}</p>
      <ul class="diploma__lines">${e.lines.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
      <p class="diploma__cca">${esc(e.cca)}</p>
    </div>`;
}
function bookHTML(a) {
  return `
    <div class="book">
      <div class="book__page">
        <h2>The Sketchbook</h2>
        ${a.paras.map((p) => `<p>${esc(p)}</p>`).join("")}
      </div>
      <div class="book__page book__page--right">
        <h3>A few facts</h3>
        <ul>${a.facts.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
      </div>
    </div>`;
}
function postHTML() {
  return `
    <div class="postbox">
      <div class="postbox__flag"></div>
      <div class="postbox__icon">✉️</div>
      <h2>The Postbox</h2>
      <p>Open to interesting problems and good conversations.</p>
      <p class="postbox__links">
        <a href="mailto:jermyn1999@gmail.com">jermyn1999@gmail.com</a><br>
        <a href="https://www.linkedin.com/in/jywh/" target="_blank" rel="noopener">LinkedIn</a> ·
        <a href="https://github.com/jermynyeo" target="_blank" rel="noopener">GitHub</a>
      </p>
    </div>`;
}
function journalHTML(r) {
  return `
    <div class="journal">
      <div class="journal__pin"></div>
      <span class="journal__kind">${esc(r.kind)}</span>
      <h3 class="journal__topic">${esc(r.topic)}</h3>
      <p class="journal__text">${esc(r.text)}</p>
    </div>`;
}
async function fetchReflections() {
  try {
    const res = await fetch("learnings/reflections.json", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length) return data;
    }
  } catch (e) { /* fall through to drafts */ }
  return REFLECTIONS; // draft fallback until you publish your own
}
async function fetchProjects() {
  try {
    const res = await fetch("https://api.github.com/users/jermynyeo/repos?per_page=100&sort=updated",
      { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(res.status);
    const repos = await res.json();
    return repos
      .filter((r) => !r.fork && !r.archived && r.name !== "jermynyeo")
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 8);
  } catch (e) {
    return [{ name: "my-github", language: "", stargazers_count: 0,
      description: "Couldn't load live projects right now — visit my GitHub to browse them.",
      html_url: "https://github.com/jermynyeo" }];
  }
}

/* ---- scene registry: every room is its own craft place ---- */
const SCENES = {
  experience: { theme: "milestone", spacing: 760, render: milestoneHTML, label: (m) => m.year,         items: () => MILESTONES },
  projects:   { theme: "frame",     spacing: 560, render: frameHTML,      label: (r) => pretty(r.name),  items: fetchProjects },
  skills:     { theme: "board",     spacing: 0, single: true, render: boardHTML, label: () => "Skills",   items: () => [SKILL_GROUPS] },
  education:  { theme: "diploma",   spacing: 0, single: true, render: diplomaHTML, label: () => "Education", items: () => [EDU] },
  about:      { theme: "book",      spacing: 0, single: true, render: bookHTML,    label: () => "About",     items: () => [ABOUT] },
  contact:    { theme: "post",      spacing: 0, single: true, render: postHTML,    label: () => "Contact",   items: () => [0] },
  learnings:  { theme: "journal",   spacing: 620, render: journalHTML, label: (r) => r.topic, items: fetchReflections },
};
let scene = null, items = [], exhibitEls = [];
const sceneEl = $("#scene");
const sky = $("#sky");
const sctx = sky.getContext("2d");
const timelineEl = $("#timeline");
const yearEl = $("#scene-year");

let camS = 0, camTargetS = 0;
let stars = [];
let dragS = null;

function camMax() { return scene ? Math.max(0, (items.length - 1) * scene.spacing) : 0; }

async function openScene(key) {
  const cfg = SCENES[key];
  if (!cfg) return;
  scene = cfg;
  sceneOpen = true;
  sceneEl.hidden = false;
  for (const k in keys) keys[k] = false;
  sizeSky();
  const data = await Promise.resolve(cfg.items());
  items = Array.isArray(data) ? data : [];
  buildExhibits();
  camS = camTargetS = 0;
  document.querySelector(".scene__hint").style.display = items.length > 1 ? "" : "none";
  sceneEl.addEventListener("wheel", onSceneWheel, { passive: false });
  sceneEl.addEventListener("pointerdown", onSceneDown);
  window.addEventListener("pointermove", onSceneMove);
  window.addEventListener("pointerup", onSceneUp);
  window.addEventListener("keydown", onSceneKey);
  window.addEventListener("resize", sizeSky);
  $("#scene-back").addEventListener("click", closeScene); // dedup-safe (same fn ref)
  requestAnimationFrame(sceneLoop);
}

function closeScene() {
  sceneOpen = false;
  sceneEl.hidden = true;
  sceneEl.removeEventListener("wheel", onSceneWheel);
  sceneEl.removeEventListener("pointerdown", onSceneDown);
  window.removeEventListener("pointermove", onSceneMove);
  window.removeEventListener("pointerup", onSceneUp);
  window.removeEventListener("keydown", onSceneKey);
  window.removeEventListener("resize", sizeSky);
  scene = null;
}

function buildExhibits() {
  timelineEl.innerHTML = "";
  exhibitEls = [];
  const nav = $("#scene-nav");
  nav.innerHTML = "";
  items.forEach((d, i) => {
    const el = document.createElement("div");
    el.className = "exhibit exhibit--" + scene.theme;
    el.innerHTML = scene.render(d);
    timelineEl.appendChild(el);
    exhibitEls.push(el);
    if (items.length > 1) {
      const b = document.createElement("button");
      b.title = scene.label(d);
      b.addEventListener("click", () => { camTargetS = i * scene.spacing; });
      nav.appendChild(b);
    }
  });
}

function sizeSky() {
  sky.width = window.innerWidth;
  sky.height = window.innerHeight;
  initStars();
}

function initStars() {
  const vw = sky.width, vh = sky.height;
  const layers = [
    { count: 130, z: 0.2, size: 0.8, col: "rgba(246,241,231,0.45)", stitch: false },
    { count: 80,  z: 0.5, size: 1.2, col: "rgba(255,217,168,0.7)",  stitch: false },
    { count: 42,  z: 0.9, size: 1.8, col: "rgba(246,241,231,0.92)", stitch: true  },
  ];
  stars = [];
  for (const L of layers) {
    for (let i = 0; i < L.count; i++) {
      stars.push({
        bx: Math.random() * vw, by: Math.random() * vh,
        z: L.z, size: L.size, col: L.col, stitch: L.stitch,
        tw: Math.random() * Math.PI * 2,
      });
    }
  }
}

function onSceneWheel(e) {
  e.preventDefault();
  const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
  camTargetS = clamp(camTargetS + d * 1.1, 0, camMax());
}
function onSceneDown(e) { dragS = e.clientX; sceneEl.classList.add("dragging"); }
function onSceneMove(e) {
  if (dragS == null) return;
  camTargetS = clamp(camTargetS - (e.clientX - dragS) * 1.5, 0, camMax());
  dragS = e.clientX;
}
function onSceneUp() { dragS = null; sceneEl.classList.remove("dragging"); }
function onSceneKey(e) {
  if (e.key === "Escape") return closeScene();
  if (!scene || scene.single) return;
  const sp = scene.spacing;
  const idx = Math.round(camTargetS / sp);
  if (e.key === "ArrowRight" || e.key === "d") { e.preventDefault(); camTargetS = clamp((idx + 1) * sp, 0, camMax()); }
  if (e.key === "ArrowLeft"  || e.key === "a") { e.preventDefault(); camTargetS = clamp((idx - 1) * sp, 0, camMax()); }
}

function sceneLoop() {
  if (!sceneOpen) return;
  const prev = camS;
  camS += (camTargetS - camS) * 0.12;
  const vel = camS - prev;
  drawSky(vel);
  layoutExhibits();
  requestAnimationFrame(sceneLoop);
}

function drawSky(vel) {
  const vw = sky.width, vh = sky.height;
  sctx.clearRect(0, 0, vw, vh);

  // soft warm nebula glow for depth
  const ng = sctx.createRadialGradient(vw * 0.5, vh * 0.5, 0, vw * 0.5, vh * 0.5, vh * 0.95);
  ng.addColorStop(0, "rgba(140,92,118,0.16)");
  ng.addColorStop(0.5, "rgba(78,96,112,0.07)");
  ng.addColorStop(1, "rgba(0,0,0,0)");
  sctx.fillStyle = ng;
  sctx.fillRect(0, 0, vw, vh);

  // the stitched embroidery thread we ride along
  const midY = vh * 0.5, amp = Math.min(vh * 0.13, 110);
  sctx.strokeStyle = "rgba(192,97,63,0.55)";
  sctx.lineWidth = 2.4; sctx.lineCap = "round"; sctx.setLineDash([2, 8]);
  sctx.beginPath();
  for (let px = 0; px <= vw; px += 6) {
    const wx = px + camS * 0.6;
    const y = midY + Math.sin(wx * 0.0038) * amp;
    px === 0 ? sctx.moveTo(px, y) : sctx.lineTo(px, y);
  }
  sctx.stroke(); sctx.setLineDash([]);

  // craft stars: warm dots + cross-stitches, parallax + warp streaks
  const streak = Math.min(Math.abs(vel), 60);
  const dir = vel > 0 ? -1 : 1;
  for (const s of stars) {
    let x = (s.bx - camS * s.z) % vw;
    if (x < 0) x += vw;
    const len = streak * s.z * 0.7;
    if (len > 1.5) {
      sctx.strokeStyle = s.col; sctx.lineWidth = s.size;
      sctx.beginPath(); sctx.moveTo(x, s.by); sctx.lineTo(x + dir * len, s.by); sctx.stroke();
    } else if (s.stitch) {
      s.tw += 0.04;
      sctx.globalAlpha = 0.5 + Math.sin(s.tw) * 0.5;
      sctx.strokeStyle = s.col; sctx.lineWidth = 1.2;
      const r = s.size + 1;
      sctx.beginPath();
      sctx.moveTo(x - r, s.by - r); sctx.lineTo(x + r, s.by + r);
      sctx.moveTo(x + r, s.by - r); sctx.lineTo(x - r, s.by + r);
      sctx.stroke(); sctx.globalAlpha = 1;
    } else {
      s.tw += 0.05;
      sctx.globalAlpha = 0.55 + Math.sin(s.tw) * 0.45;
      sctx.fillStyle = s.col;
      sctx.beginPath(); sctx.arc(x, s.by, s.size, 0, Math.PI * 2); sctx.fill();
      sctx.globalAlpha = 1;
    }
  }
}

function layoutExhibits() {
  if (!scene || !exhibitEls.length) return;
  const vw = window.innerWidth;
  const sp = scene.spacing || 1;
  const activeIdx = scene.single
    ? 0
    : Math.max(0, Math.min(items.length - 1, Math.round(camS / sp)));
  exhibitEls.forEach((el, i) => {
    const x = vw / 2 + (i * scene.spacing - camS);
    el.style.left = x + "px";
    el.classList.toggle("active", scene.single || i === activeIdx);
  });
  yearEl.textContent = scene.label(items[activeIdx]);
  document.querySelectorAll("#scene-nav button").forEach((b, i) =>
    b.classList.toggle("on", i === activeIdx));
}

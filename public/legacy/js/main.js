/* ============================================================
   Portfolio — live GitHub project feed
   ------------------------------------------------------------
   How curation works:
   - Repos tagged with the GitHub topic in FEATURE_TOPIC are shown.
   - If NONE are tagged yet, it falls back to your most relevant
     repos automatically (non-fork, not the profile repo, sorted
     by stars then last-updated).
   Tag a repo on GitHub → it appears here. No code changes needed.
   ============================================================ */

const CONFIG = {
  USERNAME: "jermynyeo",
  FEATURE_TOPIC: "portfolio", // add this topic to repos you want featured
  FALLBACK_COUNT: 6,          // how many repos to show before you've tagged any
  EXCLUDE: ["jermynyeo"],     // repos to always hide (e.g. profile README repo)
};

// Language → dot color (kept small; falls back to a neutral tone)
const LANG_COLORS = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  "Jupyter Notebook": "#DA5B0B",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Shell: "#89e051",
  Java: "#b07219",
};

const grid = document.getElementById("projects-grid");
document.getElementById("year").textContent = new Date().getFullYear();

init();

async function init() {
  try {
    const repos = await fetchRepos();
    const featured = curate(repos);
    render(featured);
  } catch (err) {
    console.error(err);
    showError();
  }
}

async function fetchRepos() {
  const url = `https://api.github.com/users/${CONFIG.USERNAME}/repos?per_page=100&sort=updated`;
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return res.json();
}

function curate(repos) {
  const usable = repos.filter(
    (r) => !r.fork && !r.archived && !CONFIG.EXCLUDE.includes(r.name)
  );

  const tagged = usable.filter(
    (r) => Array.isArray(r.topics) && r.topics.includes(CONFIG.FEATURE_TOPIC)
  );

  if (tagged.length > 0) {
    return tagged.sort(byStarsThenUpdated);
  }

  // Fallback: best repos by stars, then recency
  return usable.sort(byStarsThenUpdated).slice(0, CONFIG.FALLBACK_COUNT);
}

function byStarsThenUpdated(a, b) {
  if (b.stargazers_count !== a.stargazers_count) {
    return b.stargazers_count - a.stargazers_count;
  }
  return new Date(b.updated_at) - new Date(a.updated_at);
}

function render(repos) {
  if (!repos.length) {
    grid.innerHTML =
      '<p class="projects__error">No public projects to show yet — check back soon.</p>';
    return;
  }

  grid.innerHTML = repos.map(cardHTML).join("");
}

function cardHTML(repo) {
  const title = prettifyName(repo.name);
  const desc = repo.description
    ? escapeHTML(repo.description)
    : "<em>No description yet — add one on GitHub and it'll show here.</em>";

  const lang = repo.language
    ? `<span class="card__lang"><span class="card__lang-dot" style="background:${
        LANG_COLORS[repo.language] || "#3a6b66"
      }"></span>${escapeHTML(repo.language)}</span>`
    : "";

  const stars = repo.stargazers_count
    ? `<span>★ ${repo.stargazers_count}</span>`
    : "";

  const updated = `<span>Updated ${formatDate(repo.updated_at)}</span>`;

  const topics = (repo.topics || [])
    .filter((t) => t !== CONFIG.FEATURE_TOPIC)
    .slice(0, 4)
    .map((t) => `<span class="card__topic">${escapeHTML(t)}</span>`)
    .join("");

  const homepage =
    repo.homepage && repo.homepage.startsWith("http")
      ? `<a href="${escapeAttr(repo.homepage)}" target="_blank" rel="noopener">Live ↗</a>`
      : "";

  return `
    <article class="card">
      <h3 class="card__title">${title}</h3>
      <p class="card__desc">${desc}</p>
      <div class="card__meta">${lang}${stars}${updated}</div>
      ${topics ? `<div class="card__topics">${topics}</div>` : ""}
      <div class="card__links">
        <a href="${escapeAttr(repo.html_url)}" target="_blank" rel="noopener">Code ↗</a>
        ${homepage}
      </div>
    </article>`;
}

function showError() {
  grid.innerHTML = `
    <p class="projects__error">
      Couldn't reach GitHub right now (the public API allows ~60 requests/hour).
      Meanwhile, you can browse everything on
      <a href="https://github.com/${CONFIG.USERNAME}?tab=repositories" target="_blank" rel="noopener">my GitHub →</a>
    </p>`;
}

/* ---------- helpers ---------- */
function prettifyName(name) {
  return escapeHTML(
    name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}

/* ---------- learnings (refined reflections, auto-published via CI) ---------- */
renderLearnings();
async function renderLearnings() {
  const section = document.getElementById("learnings");
  if (!section) return;
  const grid = section.querySelector(".learnings");
  try {
    const res = await fetch("learnings/reflections.json", { cache: "no-store" });
    if (!res.ok) return;
    const items = await res.json();
    if (!Array.isArray(items) || !items.length) return; // keep static draft cards
    grid.innerHTML = items.map((r) => `
      <article class="learn-card">
        <span class="learn-card__kind">${escapeHTML(r.kind || "")}</span>
        <h3>${escapeHTML(r.topic || "")}</h3>
        <p>${escapeHTML(r.text || "")}</p>
      </article>`).join("");
    const note = section.querySelector(".section__note");
    if (note) note.remove();
  } catch (e) { /* keep static draft cards */ }
}

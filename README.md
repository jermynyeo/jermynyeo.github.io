# Jermyn Yeo — Portfolio

A personal portfolio built as a single-page Next.js 15 app, exported as a
static site and deployed to GitHub Pages. Terminal/matrix aesthetic, with
a fading raining-letters background, an animated data-flow diagram, and
a handful of Magic UI accents (scroll progress, scramble titles, magic
cards, border beams).

Live: <https://jermynyeo.github.io>

---

## Table of contents

- [Run it locally](#run-it-locally)
- [Editing content (the easy way)](#editing-content-the-easy-way)
- [Inline formatting (`**bold**` / `*italic*` / `` `code` ``)](#inline-formatting)
- [Tuning the animations](#tuning-the-animations)
- [Project structure](#project-structure)
- [Build & deploy](#build--deploy)
- [Learnings drop-box (legacy)](#learnings-drop-box-legacy)

---

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build + static export to `out/` |
| `npm run start` | Serve the production build |
| `npm run lint` | Run Next.js's ESLint config |
| `npm run typecheck` | `tsc --noEmit` |

---

## Editing content (the easy way)

**Everything you'd want to change lives in `content/`.** Each file is a
plain TypeScript object — open it, edit strings, save. The site updates on
hot reload.

| File | What's in it |
|---|---|
| `content/site.ts` | Name, role, `<head>` title/description, footer byline |
| `content/nav.ts` | Top-right anchor nav (label + `#href`) |
| `content/hero.ts` | Big "JERMYN YEO" headline + the phrases that cycle/scramble below it |
| `content/about.ts` | About copy + the "Currently" card |
| `content/experience.ts` | Timeline: companies, roles, dates, bullets |
| `content/projects.ts` | GitHub username, feature topic, fallback count, language colors, section copy |
| `content/stack.ts` | The data-flow diagram (columns, nodes, beams), platform row, certs |
| `content/education.ts` | Degrees + the small blocks (awards, focus modules…) |
| `content/learnings.ts` | Reflection cards |
| `content/contact.ts` | Final CTA buttons (label, href, primary/ghost) |
| `content/theme.ts` | All animation knobs — see [Tuning the animations](#tuning-the-animations) |

### Common edits

- **Add a job to Experience** — open `content/experience.ts`, add an item to
  the `items` array. If it's a new role at an existing company, push to the
  existing item's `roles[]` instead. Bullets go in `bullets[]`.

- **Change a tool in the data flow** — open `content/stack.ts`. To rename
  "Spark" → "Spark 3.5", edit the node's `name`. To add a new tool, push to
  the matching column's `nodes[]` (give it a unique `id`), then add beams
  that reference that `id` in `flow.beams[]`.

- **Add a certification** — push to `stack.certifications` in
  `content/stack.ts`.

- **Swap an email / social link** — `content/contact.ts`.

- **Change the cycled hero phrases** — `content/hero.ts`, edit `phrases[]`.

- **Reorder or hide a nav item** — `content/nav.ts`. Removing it from the
  array hides it from the top-right nav; the section itself still renders.
  To remove a section entirely, also delete its `<Section />` line in
  `app/page.tsx`.

- **Change a section heading** — edit `heading` in that section's content
  file (e.g. change "Stack" back to "Skills" in `content/stack.ts`).

---

## Inline formatting

Content strings are plain text, but a tiny renderer (`components/rich-text.tsx`)
gives you three inline tokens so you don't have to write JSX for emphasis:

| Write | Renders as |
|---|---|
| `**bold**` | **bold** (`<strong>`) |
| `*italic*` | *italic* (`<em>`) |
| `` `code` `` | `code` (`<code>`) |

Nesting isn't supported — keep tokens flat (`**Java**` not `**_Java_**`).

Apostrophes, em-dashes, and emoji can be typed directly into the TS
strings — no HTML entities needed.

---

## Tuning the animations

All effect parameters live in **`content/theme.ts`**. The most useful knobs:

### Raining letters (the matrix background)

```ts
rain: {
  charCount: 300,                      // density
  opacityCurve: {
    progress: [0, 0.05, 0.22, 1],      // scroll progress (0 = top, 1 = bottom)
    opacity:  [1, 0.55, 0.18, 0.06],   // rain opacity at each breakpoint
  },
},
```

To make the rain disappear faster: lower the second `opacity` value
(e.g. `0.3 → 0.1`). To keep it visible longer: raise the `progress`
breakpoints.

### Flickering grid (behind Experience + Stack)

```ts
flickerGrid: {
  color: "rgb(0, 255, 0)",
  maxOpacity: 0.08,                    // raise for more visible cells
  flickerChance: 0.12,                 // higher = faster flicker
  squareSize: 3,                       // pixel size
  gridGap: 6,
},
```

### Data-flow beams (Stack section)

```ts
beam: {
  pathColor: "rgba(0, 255, 0, 0.32)",  // always-on line
  pathWidth: 2.2,
  gradientStartColor: "#00ff5a",       // traveling bead head
  gradientStopColor: "#ffffff",        // tail
  duration: 3.4,                       // seconds per traversal
},
```

### MagicCard spotlight, BorderBeam, HyperText, ScrollProgress

Same file — all named, all commented.

### Switching the global accent color

The matrix-green palette is centralized as CSS variables at the top of
`app/globals.css` (`--accent-mx`, `--bg`, `--text`, `--line`, `--glow`).
Change those and the entire site recolors. You'll also want to update the
hex colors in `content/theme.ts` (beams, flicker grid).

---

## Project structure

```
app/
  layout.tsx              # <head>, <body>, mounts ScrollProgress
  page.tsx                # composes hero + main sections + footer
  globals.css             # all custom CSS (vars, layout, sections, animations)

content/                  # ← edit this for content/copy/theme changes
  site.ts hero.ts nav.ts about.ts experience.ts projects.ts
  stack.ts education.ts learnings.ts contact.ts theme.ts

components/
  reveal.tsx              # scroll-into-view fade
  rich-text.tsx           # tiny **bold**/*italic*/`code` renderer
  section-title.tsx       # h2 + HyperText scramble
  sections/               # one file per section; pulls from content/
    about.tsx experience.tsx projects.tsx projects-grid.tsx
    skills.tsx education.tsx learnings.tsx contact.tsx
  ui/                     # Magic UI components, adapted for this stack
    animated-beam.tsx       # SVG path with traveling gradient bead
    border-beam.tsx         # bead orbiting a button border
    data-flow.tsx           # the Stack diagram; renders from content/stack.ts
    flickering-grid.tsx     # canvas pixel grid
    hyper-text.tsx          # letter scramble on view + hover
    kinetic-shatter-box-section.tsx  # BreakableCard (used by projects)
    magic-card.tsx          # mouse-following spotlight wrapper
    modern-animated-hero-section.tsx # RainingLettersBg + ScrambledTitle
    scroll-progress.tsx     # top progress bar
    section-backdrop.tsx    # mounts FlickeringGrid behind a section

lib/
  utils.ts                # cn() — tailwind-merge + clsx
```

### How the layers stack on screen

```
z:50  ┌──────────────────────────────┐  hero-nav (fixed top-right)
z:60  │                              │  scroll-progress (fixed top edge)
      ├──────────────────────────────┤
z:1   │   main / sections / footer   │  (transparent bg → rain shows through)
      ├──────────────────────────────┤
z:0   │   RainingLettersBg (fixed)   │  (fades on scroll via theme.rain)
      ├──────────────────────────────┤
       body background (solid black via --bg)
```

Sections that opt in to `.section--with-bg` or `.section--data` get a
`SectionBackdrop` (FlickeringGrid) layered between the rain and their
content. `MagicCard`, `BorderBeam`, and `AnimatedBeam` are local overlays
within their parents.

---

## Build & deploy

The site is configured for static export (`next.config.mjs` →
`output: "export"`), so a build produces a fully static `out/` directory
deployable to any static host.

Currently the repo is hosted at `https://github.com/jermynyeo/jermynyeo.github.io`
and served from the `main` branch root via GitHub Pages.

```bash
npm run build                 # writes out/
# commit & push — Pages picks up the new build automatically
git add -A && git commit -m "…" && git push
```

If you want a CI build instead of committing `out/`, add a GitHub Action
that runs `npm ci && npm run build` and publishes `out/` to the
`gh-pages` branch.

---

## Learnings drop-box (legacy)

The repo also still contains a Claude-API powered drop-box for portfolio
"learnings" notes — `learnings/drafts/*.md` get refined by a GitHub Action
and written to `learnings/reflections.json`. The current site reads
learning content from `content/learnings.ts` rather than that JSON, but
the drop-box and its workflow remain for future use; see
`scripts/refine-learnings.mjs` and `.github/workflows/refine-learnings.yml`.

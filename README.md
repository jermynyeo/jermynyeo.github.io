# Jermyn Yeo — Portfolio

A handmade-but-professional personal portfolio. Static site (HTML/CSS/JS),
no build step, with a **live GitHub project feed**.

## How the project feed works

`js/main.js` fetches your public repos from the GitHub API on page load.

- **To feature a project:** add the GitHub **topic** `portfolio` to that repo
  (repo page → ⚙️ next to *About* → Topics). It then appears automatically.
- Until you've tagged any repo, the site falls back to showing your top 6
  repos (by stars, then most recently updated).
- Each card pulls its title, description, language, stars, and topics straight
  from GitHub — so projects stay up to date on their own.

Config lives at the top of `js/main.js` (`CONFIG` object): username, feature
topic, fallback count, and a list of repos to always hide.

## Editing content

All static content (bio, experience, skills, education, contact) is plain HTML
in `index.html`. Search for `DRAFT` / `Placeholder` comments to find the bits
that still need your real details.

## Deploy to GitHub Pages

1. Create a repo, e.g. `jermynyeo.github.io` (a repo with this exact name is
   served at `https://jermynyeo.github.io`). Or use any repo name and enable
   Pages on it.
2. Push these files to the repo's default branch:
   ```
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/jermynyeo/jermynyeo.github.io.git
   git push -u origin main
   ```
3. Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch:
   `main` / `/ (root)` → Save.
4. Wait ~1 minute, then visit `https://jermynyeo.github.io`.

## Local preview

Just open `index.html` in a browser. (The GitHub fetch works from `file://`
too, but running a tiny local server avoids any browser quirks:
`python -m http.server` then visit `http://localhost:8000`.)

# Drop your thoughts here 🪶

This folder is your **thought drop-box**. Add a note here and it gets refined
and published to your portfolio automatically — no terminal, no fuss. You can
do this straight from **github.com** (the "Add file → Create new file" button)
or its mobile app.

## How to add a reflection

1. Create a new file in this folder, e.g. `ckad.md` (any name ending in `.md`).
2. Use this shape:

```markdown
---
topic: CKAD — Kubernetes
kind: Certificate · 2024
refine: true
---
Brain-dump whatever you're thinking, however rough. What you set out to learn,
what clicked, what surprised you, what was hard, what you'd do differently.
Don't worry about polish — that's what `refine` is for.
```

3. Commit it. Within a minute, a GitHub Action refines your note with Claude and
   publishes it to the **Reading Nook** (universe) and the **Learnings** section
   (résumé).

## The `refine` option

- `refine: true` (default) — Claude turns your rough notes into a tight,
  authentic 2–4 sentence reflection in your voice.
- `refine: false` — your text is published **exactly as written**, untouched.

Leave the line out entirely and it defaults to `true`.

## Fields

| Field   | Required | Example                     |
|---------|----------|-----------------------------|
| `topic` | no\*     | `CKAD — Kubernetes`         |
| `kind`  | no       | `Certificate · 2024` / `Project` |
| `refine`| no       | `true` (default) or `false` |

\* If you omit `topic`, the filename is used.

## One-time setup (already wired, just needs your key)

The Action needs an Anthropic API key. In your GitHub repo:
**Settings → Secrets and variables → Actions → New repository secret**
- Name: `ANTHROPIC_API_KEY`
- Value: your key from the Anthropic Console

That's it. Files named `README.md` or starting with `_` are ignored.

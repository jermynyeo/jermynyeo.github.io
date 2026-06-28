"use client"

import { useEffect, useState } from "react"

const CONFIG = {
  USERNAME: "jermynyeo",
  FEATURE_TOPIC: "portfolio",
  FALLBACK_COUNT: 6,
  EXCLUDE: ["jermynyeo"],
}

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  "Jupyter Notebook": "#DA5B0B",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Shell: "#89e051",
  Java: "#b07219",
}

interface Repo {
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics?: string[]
  stargazers_count: number
  updated_at: string
  fork: boolean
  archived: boolean
}

type State =
  | { kind: "loading" }
  | { kind: "ok"; repos: Repo[] }
  | { kind: "error" }

function curate(repos: Repo[]): Repo[] {
  const usable = repos.filter(
    (r) => !r.fork && !r.archived && !CONFIG.EXCLUDE.includes(r.name)
  )
  const tagged = usable.filter(
    (r) => Array.isArray(r.topics) && r.topics.includes(CONFIG.FEATURE_TOPIC)
  )
  const sorted = (list: Repo[]) =>
    [...list].sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count
      }
      return +new Date(b.updated_at) - +new Date(a.updated_at)
    })
  return tagged.length > 0
    ? sorted(tagged)
    : sorted(usable).slice(0, CONFIG.FALLBACK_COUNT)
}

function prettifyName(name: string) {
  return name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  })
}

export default function ProjectsGrid() {
  const [state, setState] = useState<State>({ kind: "loading" })

  useEffect(() => {
    const url = `https://api.github.com/users/${CONFIG.USERNAME}/repos?per_page=100&sort=updated`
    fetch(url, { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => {
        if (!r.ok) throw new Error(`GitHub API ${r.status}`)
        return r.json() as Promise<Repo[]>
      })
      .then((repos) => setState({ kind: "ok", repos: curate(repos) }))
      .catch(() => setState({ kind: "error" }))
  }, [])

  if (state.kind === "loading") {
    return (
      <div id="projects-grid" className="projects" aria-live="polite">
        <div className="projects__loading">Fetching projects from GitHub…</div>
      </div>
    )
  }

  if (state.kind === "error") {
    return (
      <div id="projects-grid" className="projects" aria-live="polite">
        <p className="projects__error">
          Couldn&apos;t reach GitHub right now (the public API allows ~60
          requests/hour). Meanwhile, you can browse everything on{" "}
          <a
            href={`https://github.com/${CONFIG.USERNAME}?tab=repositories`}
            target="_blank"
            rel="noopener"
          >
            my GitHub →
          </a>
        </p>
      </div>
    )
  }

  if (state.repos.length === 0) {
    return (
      <div id="projects-grid" className="projects" aria-live="polite">
        <p className="projects__error">
          No public projects to show yet — check back soon.
        </p>
      </div>
    )
  }

  return (
    <div id="projects-grid" className="projects" aria-live="polite">
      {state.repos.map((repo) => {
        const topics = (repo.topics ?? [])
          .filter((t) => t !== CONFIG.FEATURE_TOPIC)
          .slice(0, 4)
        return (
          <article key={repo.name} className="card">
            <h3 className="card__title">{prettifyName(repo.name)}</h3>
            <p className="card__desc">
              {repo.description ?? (
                <em>No description yet — add one on GitHub and it&apos;ll show here.</em>
              )}
            </p>
            <div className="card__meta">
              {repo.language && (
                <span className="card__lang">
                  <span
                    className="card__lang-dot"
                    style={{
                      background: LANG_COLORS[repo.language] ?? "#3a6b66",
                    }}
                  />
                  {repo.language}
                </span>
              )}
              {repo.stargazers_count > 0 && (
                <span>★ {repo.stargazers_count}</span>
              )}
              <span>Updated {formatDate(repo.updated_at)}</span>
            </div>
            {topics.length > 0 && (
              <div className="card__topics">
                {topics.map((t) => (
                  <span key={t} className="card__topic">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="card__links">
              <a href={repo.html_url} target="_blank" rel="noopener">
                Code ↗
              </a>
              {repo.homepage && repo.homepage.startsWith("http") && (
                <a href={repo.homepage} target="_blank" rel="noopener">
                  Live ↗
                </a>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}

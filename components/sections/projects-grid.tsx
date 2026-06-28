"use client"

import { useEffect, useState } from "react"
import { BreakableCard } from "@/components/ui/kinetic-shatter-box-section"
import { richText } from "@/components/rich-text"
import { projects } from "@/content/projects"

const GITHUB = projects.github
const LANG_COLORS = projects.langColors

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
    (r) => !r.fork && !r.archived && !GITHUB.exclude.includes(r.name)
  )
  const tagged = usable.filter(
    (r) => Array.isArray(r.topics) && r.topics.includes(GITHUB.featureTopic)
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
    : sorted(usable).slice(0, GITHUB.fallbackCount)
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

function RepoBody({ repo }: { repo: Repo }) {
  const topics = (repo.topics ?? [])
    .filter((t) => t !== GITHUB.featureTopic)
    .slice(0, 4)
  return (
    <div className="flex flex-col gap-3">
      <p className="line-clamp-3 m-0">
        {repo.description ?? (
          <em className="text-[#64748b]">No description yet.</em>
        )}
      </p>
      <div className="flex items-center gap-3 text-[11px] text-[#64748b] flex-wrap tabular-nums">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5 text-[#94a3b8]">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: LANG_COLORS[repo.language] ?? "#00ff00" }}
            />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && <span>★ {repo.stargazers_count}</span>}
        <span>upd {formatDate(repo.updated_at)}</span>
      </div>
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {topics.map((t) => (
            <span
              key={t}
              className="text-[10px] px-1.5 py-0.5 border border-[rgba(0,255,0,0.18)] text-[#94a3b8] rounded-sm"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-4 text-[12px] font-bold text-[#00ff00] mt-auto">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          code ↗
        </a>
        {repo.homepage && repo.homepage.startsWith("http") && (
          <a
            href={repo.homepage}
            target="_blank"
            rel="noopener"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            live ↗
          </a>
        )}
      </div>
    </div>
  )
}

export default function ProjectsGrid() {
  const [state, setState] = useState<State>({ kind: "loading" })

  useEffect(() => {
    const url = `https://api.github.com/users/${GITHUB.username}/repos?per_page=100&sort=updated`
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
        <div className="projects__loading">{projects.loadingText}</div>
      </div>
    )
  }

  if (state.kind === "error") {
    return (
      <div id="projects-grid" className="projects" aria-live="polite">
        <p className="projects__error">
          {projects.errorFallback.text}{" "}
          <a
            href={projects.errorFallback.linkHref}
            target="_blank"
            rel="noopener"
          >
            {projects.errorFallback.linkLabel}
          </a>
        </p>
      </div>
    )
  }

  if (state.repos.length === 0) {
    return (
      <div id="projects-grid" className="projects" aria-live="polite">
        <p className="projects__error">{projects.emptyText}</p>
      </div>
    )
  }

  return (
    <>
      <p className="section__note" style={{ marginTop: "-12px" }}>
        {richText(projects.tip)}
      </p>
      <div id="projects-grid" className="projects" aria-live="polite">
        {state.repos.map((repo) => (
          <div key={repo.name} className="min-h-[18rem]">
            <BreakableCard
              title={prettifyName(repo.name)}
              description={<RepoBody repo={repo} />}
            />
          </div>
        ))}
      </div>
    </>
  )
}

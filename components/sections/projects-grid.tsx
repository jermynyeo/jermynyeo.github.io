"use client"

import { BreakableCard } from "@/components/ui/kinetic-shatter-box-section"
import { richText } from "@/components/rich-text"
import { projects } from "@/content/projects"
import type { Repo } from "@/lib/github"

const GITHUB = projects.github
const LANG_COLORS = projects.langColors

function prettifyName(name: string) {
  return name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

// Fixed month table — locale-independent. `toLocaleDateString` disagrees
// between Node (SSR) and modern browser ICU (e.g. "Sep" vs "Sept"), which
// caused a hydration mismatch. UTC avoids timezone month-boundary drift.
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]
function formatDate(iso: string) {
  const d = new Date(iso)
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
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
              style={{
                background: LANG_COLORS[repo.language] ?? "var(--accent-mx)",
              }}
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
              className="text-[10px] px-1.5 py-0.5 border border-[rgba(74,222,128,0.18)] text-[#94a3b8] rounded-sm"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-4 text-[12px] font-bold text-[var(--accent-mx)] mt-auto">
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
            Article ↗
          </a>
        )}
      </div>
    </div>
  )
}

export default function ProjectsGrid({ repos }: { repos: Repo[] }) {
  if (repos.length === 0) {
    return (
      <div id="projects-grid" className="projects">
        <p className="projects__error">{projects.emptyText}</p>
      </div>
    )
  }

  return (
    <>
      <p className="section__note" style={{ marginTop: "-12px" }}>
        {richText(projects.tip)}
      </p>
      <div id="projects-grid" className="projects">
        {repos.map((repo) => (
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

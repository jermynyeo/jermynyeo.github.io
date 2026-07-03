import { projects } from "@/content/projects"
import snapshot from "@/data/github-repos.json"

const GITHUB = projects.github

export interface Repo {
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

export function curate(repos: Repo[]): Repo[] {
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

/**
 * Fetch repos at build time so project cards land in the exported HTML.
 * Falls back to the committed snapshot in data/github-repos.json when the
 * API is unreachable or rate-limited (60 req/hr unauthenticated locally;
 * CI passes GITHUB_TOKEN for 5k req/hr).
 */
export async function getRepos(): Promise<{
  repos: Repo[]
  source: "live" | "snapshot"
}> {
  const url = `https://api.github.com/users/${GITHUB.username}/repos?per_page=100&sort=updated`
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  }
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  try {
    const res = await fetch(url, { headers, cache: "force-cache" })
    if (!res.ok) throw new Error(`GitHub API ${res.status}`)
    const repos = (await res.json()) as Repo[]
    const curated = curate(repos)
    if (curated.length > 0) return { repos: curated, source: "live" }
  } catch {
    // fall through to snapshot
  }

  return { repos: curate(snapshot as Repo[]), source: "snapshot" }
}

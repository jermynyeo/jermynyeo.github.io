import fs from "fs"
import path from "path"

/**
 * Reflections are authored as one Markdown file each in `content/reflections/`.
 * Frontmatter carries the metadata; the body is plain prose (blank line = new
 * paragraph, inline **bold** supported by richText). Read at build time only —
 * import this from Server Components, never from a "use client" module.
 */
export interface Reflection {
  slug: string
  kind: string
  title: string
  reflection: string
  body: string
  order: number
}

const DIR = path.join(process.cwd(), "content/reflections")

/** Minimal frontmatter parser — single-line `key: value` pairs, no deps. */
function parse(raw: string): { data: Record<string, string>; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return { data: {}, body: raw.trim() }
  const data: Record<string, string> = {}
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":")
    if (i === -1) continue
    data[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { data, body: m[2].trim() }
}

export function getReflections(): Reflection[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, body } = parse(fs.readFileSync(path.join(DIR, f), "utf8"))
      return {
        slug: f.replace(/\.md$/, ""),
        kind: data.kind ?? "",
        title: data.title ?? "",
        reflection: data.reflection ?? "",
        body,
        order: Number(data.order ?? 999),
      }
    })
    .sort((a, b) => a.order - b.order)
}

export function getReflection(slug: string): Reflection | undefined {
  return getReflections().find((r) => r.slug === slug)
}

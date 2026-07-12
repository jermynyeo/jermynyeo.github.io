import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { richText } from "@/components/rich-text"
import { learnings } from "@/content/learnings"
import { getReflection, getReflections } from "@/lib/reflections"

/** Pre-render one page per reflection (static export). */
export function generateStaticParams() {
  return getReflections().map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = getReflection(slug)
  return {
    title: item?.title ?? "Reflection",
    description: item?.question,
  }
}

function toParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p !== "")
}

export default async function ReflectionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = getReflection(slug)
  if (!item) notFound()

  const related = item.related
    .map((s) => getReflection(s))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))

  return (
    <main className="reflection-page">
      <nav className="reflection-page__bar" aria-label="Reflection">
        <a className="reflection-page__back" href="/#reflections">
          ← back to portfolio
        </a>
      </nav>
      <article>
        <span className="reflection-page__kind">{item.kind}</span>
        <h1 className="reflection-page__title">{item.title}</h1>
        <span className="reflection-q-label">{learnings.questionLabel}</span>
        <p className="reflection-page__lead">{richText(item.question)}</p>
        {item.tags.length > 0 && (
          <ul className="reflection-tags">
            {item.tags.map((t) => (
              <li key={t} className="reflection-tag">
                {t}
              </li>
            ))}
          </ul>
        )}
        <div className="reflection-page__body">
          {toParagraphs(item.body).map((p, i) => (
            <p key={i}>{richText(p)}</p>
          ))}
        </div>

        {related.length > 0 && (
          <footer className="reflection-page__related">
            <h2>Related reflections</h2>
            <ul>
              {related.map((r) => (
                <li key={r.slug}>
                  <a href={`/reflections/${r.slug}`}>
                    <span className="reflection-page__related-title">
                      {r.title}
                    </span>
                    <span className="reflection-page__related-hook">
                      {r.question}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </footer>
        )}
      </article>
    </main>
  )
}

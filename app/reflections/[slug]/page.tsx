import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { richText } from "@/components/rich-text"
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
    description: item?.reflection,
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
        <p className="reflection-page__lead">{richText(item.reflection)}</p>
        <div className="reflection-page__body">
          {toParagraphs(item.body).map((p, i) => (
            <p key={i}>{richText(p)}</p>
          ))}
        </div>
      </article>
    </main>
  )
}

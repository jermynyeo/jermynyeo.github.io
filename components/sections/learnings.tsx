"use client"

import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion"
import Reveal from "@/components/reveal"
import { SectionTitle } from "@/components/section-title"
import { richText } from "@/components/rich-text"
import { learnings } from "@/content/learnings"
import type { Reflection } from "@/lib/reflections"

/** Reading time per reflection before it auto-advances. */
const AUTO_MS = 90_000

/** A reflection lives in the AI lane when it carries the "AI" tag. */
function isAiReflection(r: Reflection): boolean {
  return r.tags.some((t) => t.trim().toLowerCase() === "ai")
}

/** Split a body into paragraphs (blank line = new paragraph). */
function toParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p !== "")
}

type Item = Reflection

/** The editorial lead | detail card body, shared by both layouts. */
function SlideBody({ item }: { item: Item }) {
  return (
    <>
      <div className="learn-card__lead">
        <span className="learn-card__kind">{item.kind}</span>
        <h3>{item.title}</h3>
        <span className="reflection-q-label">{learnings.questionLabel}</span>
        <p className="learn-card__reflection">{richText(item.question)}</p>
        {item.tags.length > 0 && (
          <ul className="reflection-tags">
            {item.tags.map((t) => (
              <li key={t} className="reflection-tag">
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="learn-card__detail">
        <p className="learn-card__body">
          {richText(toParagraphs(item.body)[0] ?? "")}
        </p>
        <a
          className="learn-card__more"
          href={`/reflections/${item.slug}`}
          target="_blank"
          rel="noopener"
        >
          read the full story →
        </a>
      </div>
    </>
  )
}

/**
 * One self-contained lane: a labelled carousel that auto-advances (~90s),
 * pauses on hover/focus, and only ticks while on screen. Falls back to a
 * static stack for reduced motion, small screens, or a single reflection.
 */
function ReflectionCarousel({ label, items }: { label: string; items: Item[] }) {
  const count = items.length
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const inView = useInView(wrapRef, { amount: 0.4 })
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)

  // Auto-advance ~90s per reflection — only while on screen and not paused
  // (hover/focus). Depends on `index`, so manual nav resets the timer.
  useEffect(() => {
    if (reduce || count <= 1 || paused || !inView) return
    const id = window.setTimeout(() => {
      setDir(1)
      setIndex((i) => (i + 1) % count)
    }, AUTO_MS)
    return () => window.clearTimeout(id)
  }, [reduce, count, paused, inView, index])

  const go = (next: number, d: number) => {
    setDir(d)
    setIndex(((next % count) + count) % count)
  }

  const Label = <h3 className="reflection-lane__label">{label}</h3>

  // Static fallback for reduced motion or a single reflection. On phones the
  // carousel stays active (one card at a time) instead of dumping every card.
  if (reduce || count <= 1) {
    return (
      <div className="reflection-lane">
        {Label}
        <div className="reflections reflections--static">
          {items.map((item, i) => (
            <article key={i} className="learn-card">
              <SlideBody item={item} />
            </article>
          ))}
        </div>
      </div>
    )
  }

  const slide = 28

  return (
    <div className="reflection-lane">
      {Label}
      <div
        ref={wrapRef}
        className="reflections"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div className="reflections__viewport">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.article
              key={index}
              className="learn-card"
              custom={dir}
              initial={{ opacity: 0, x: dir * slide }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -slide }}
              transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
            >
              <SlideBody item={items[index]} />
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="reflections__controls">
          <button
            type="button"
            className="reflections__arrow"
            aria-label="Previous reflection"
            onClick={() => go(index - 1, -1)}
          >
            ‹
          </button>
          <div className="reflections__dots" role="tablist" aria-label={label}>
            {items.map((it, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={it.title}
                className={`reflections__dot${i === index ? " is-active" : ""}`}
                onClick={() => go(i, i > index ? 1 : -1)}
              />
            ))}
          </div>
          <button
            type="button"
            className="reflections__arrow"
            aria-label="Next reflection"
            onClick={() => go(index + 1, 1)}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LearningsSection({
  reflections,
}: {
  reflections: Reflection[]
}) {
  const aiLane = reflections.filter(isAiReflection)
  const craftLane = reflections.filter((r) => !isAiReflection(r))

  return (
    <Reveal as="section" x={-24} id={learnings.id} className="section">
      <SectionTitle>{learnings.heading}</SectionTitle>
      <p className="section__note">{richText(learnings.intro)}</p>

      <div className="reflections-split">
        {aiLane.length > 0 && (
          <ReflectionCarousel label={learnings.lanes.ai} items={aiLane} />
        )}
        {craftLane.length > 0 && (
          <ReflectionCarousel label={learnings.lanes.craft} items={craftLane} />
        )}
      </div>
    </Reveal>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion"
import Reveal from "@/components/reveal"
import { SectionTitle } from "@/components/section-title"
import { richText } from "@/components/rich-text"
import { learnings } from "@/content/learnings"

/** Normalize a body into paragraphs: split strings on newlines, keep arrays as-is. */
function toParagraphs(body: string | string[]): string[] {
  const parts = Array.isArray(body) ? body : body.split(/\n+/)
  return parts.map((p) => p.trim()).filter((p) => p !== "")
}

type Item = (typeof learnings.items)[number]

/** The editorial lead | detail card body, shared by both layouts. */
function SlideBody({ item }: { item: Item }) {
  return (
    <>
      <div className="learn-card__lead">
        <span className="learn-card__kind">{item.kind}</span>
        <h3>{item.title}</h3>
        <p className="learn-card__reflection">{richText(item.reflection)}</p>
      </div>
      <div className="learn-card__detail">
        {toParagraphs(item.body).map((para, j) => (
          <p key={j} className="learn-card__body">
            {richText(para)}
          </p>
        ))}
      </div>
    </>
  )
}

export default function LearningsSection() {
  const items = learnings.items
  const count = items.length
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)
  const [compact, setCompact] = useState(false)

  // The bit "turns the page" as you scroll past: map the section's transit
  // through the viewport to the active reflection. No pinning, normal scroll.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.15"],
  })
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(count - 1, Math.max(0, Math.floor(v * count)))
    setIndex((prev) => (prev === i ? prev : i))
  })

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)")
    const sync = () => setCompact(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  // Static fallback: reduced motion, small screens, or a single reflection.
  if (reduce || compact || count <= 1) {
    return (
      <Reveal as="section" x={-24} id={learnings.id} className="section">
        <SectionTitle>{learnings.heading}</SectionTitle>
        <p className="section__note">{richText(learnings.intro)}</p>
        <div className="reflections reflections--static">
          {items.map((item, i) => (
            <article key={i} className="learn-card">
              <SlideBody item={item} />
            </article>
          ))}
        </div>
      </Reveal>
    )
  }

  // Dot click: scroll so the section transit lands mid-page `i`.
  const goTo = (i: number) => {
    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const top = rect.top + window.scrollY
    const vh = window.innerHeight
    // Matches the useScroll offset window ["start 0.85", "end 0.15"].
    const startY = top - 0.85 * vh
    const endY = top + rect.height - 0.15 * vh
    const p = (i + 0.5) / count
    window.scrollTo({ top: startY + p * (endY - startY), behavior: "smooth" })
  }

  return (
    <section ref={sectionRef} id={learnings.id} className="section">
      <SectionTitle>{learnings.heading}</SectionTitle>
      <p className="section__note">{richText(learnings.intro)}</p>

      <div className="reflections">
        <div className="reflections__viewport">
          <AnimatePresence mode="wait">
            <motion.article
              key={index}
              className="learn-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
            >
              <SlideBody item={items[index]} />
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="reflections__controls">
          <span className="reflections__progress">
            {index + 1} / {count}
          </span>
          <div
            className="reflections__dots"
            role="tablist"
            aria-label="Reflections"
          >
            {items.map((it, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={it.title}
                className={`reflections__dot${i === index ? " is-active" : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

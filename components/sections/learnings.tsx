"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import Reveal from "@/components/reveal"
import { SectionTitle } from "@/components/section-title"
import { richText } from "@/components/rich-text"
import { learnings } from "@/content/learnings"

/** Auto-advance interval — a slow 90s so it never distracts. */
const AUTO_MS = 90_000

/** Normalize a body into paragraphs: split strings on newlines, keep arrays as-is. */
function toParagraphs(body: string | string[]): string[] {
  const parts = Array.isArray(body) ? body : body.split(/\n+/)
  return parts.map((p) => p.trim()).filter((p) => p !== "")
}

export default function LearningsSection() {
  const items = learnings.items
  const count = items.length
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dir, setDir] = useState(1)
  const reduce = useReducedMotion()

  const go = useCallback(
    (next: number, d: number) => {
      setDir(d)
      setIndex(((next % count) + count) % count)
    },
    [count]
  )

  // Auto-advance. Re-runs when `index` changes, so manual nav resets the timer.
  // Disabled while paused (hover), for single-item lists, and under reduced motion.
  useEffect(() => {
    if (paused || count <= 1 || reduce) return
    const id = window.setInterval(() => {
      setDir(1)
      setIndex((i) => (i + 1) % count)
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [paused, count, index, reduce])

  const item = items[index]
  const slide = 28

  return (
    <Reveal as="section" id={learnings.id} className="section">
      <SectionTitle>{learnings.heading}</SectionTitle>
      <p className="section__note">{richText(learnings.intro)}</p>

      <div
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
              initial={reduce ? false : { opacity: 0, x: dir * slide }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -slide }}
              transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
            >
              <div className="learn-card__lead">
                <span className="learn-card__kind">{item.kind}</span>
                <h3>{item.title}</h3>
                <p className="learn-card__reflection">
                  {richText(item.reflection)}
                </p>
              </div>
              <div className="learn-card__detail">
                {toParagraphs(item.body).map((para, j) => (
                  <p key={j} className="learn-card__body">
                    {richText(para)}
                  </p>
                ))}
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        {count > 1 && (
          <div className="reflections__controls">
            <button
              type="button"
              className="reflections__arrow"
              aria-label="Previous reflection"
              onClick={() => go(index - 1, -1)}
            >
              ‹
            </button>
            <div className="reflections__dots" role="tablist" aria-label="Reflections">
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
        )}
      </div>
    </Reveal>
  )
}

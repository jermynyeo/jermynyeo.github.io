"use client"

import { motion, useReducedMotion } from "framer-motion"
import { richText } from "@/components/rich-text"
import {
  experience,
  type ExperienceItem,
  type ExperienceRole,
} from "@/content/experience"

/**
 * Career-arc view: each role is one first-person line about what was owned
 * and how the scope grew. The full bullet record lives on `/resume` (the
 * bullets stay in the data for that page), so the main page is a story, not
 * a duplicate of the résumé.
 */
function Role({ role }: { role: ExperienceRole }) {
  return (
    <div className="role">
      <RoleHead role={role} />
      <p className="role__summary">
        {richText(role.summary ?? role.bullets[0])}
      </p>
    </div>
  )
}

function RoleHead({ role }: { role: ExperienceRole }) {
  return (
    <>
      <div className="role__head">
        <h4>
          {role.title}
          {role.promoted && (
            <span
              className="role__promoted-mark"
              role="img"
              title={experience.promotedHint}
              aria-label={experience.promotedHint}
            >
              ▲
            </span>
          )}
        </h4>
        <span className="role__date">{role.dates}</span>
      </div>
      {role.team && <p className="role__team">{role.team}</p>}
    </>
  )
}

/** Timeline dot that pulses once as it scrolls into view. */
function TimelineDot() {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="timeline__dot"
      initial={reduce ? false : { scale: 0.4, opacity: 0.4 }}
      whileInView={
        reduce ? { scale: 1, opacity: 1 } : { scale: [0.4, 1.3, 1], opacity: 1 }
      }
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    />
  )
}

export function ExperienceItemView({ item }: { item: ExperienceItem }) {
  return (
    <li className="timeline__item">
      <TimelineDot />
      <div className="timeline__body">
        <div className="timeline__head">
          <h3>{item.title}</h3>
          <span className="timeline__date">{item.dates}</span>
        </div>
        {item.org && <p className="timeline__org">{item.org}</p>}

        {item.bullets && (
          <ul>
            {item.bullets.map((b, j) => (
              <li key={j}>{richText(b)}</li>
            ))}
          </ul>
        )}

        {item.roles?.map((role, j) => (
          <Role key={j} role={role} />
        ))}
      </div>
    </li>
  )
}

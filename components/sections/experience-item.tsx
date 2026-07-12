"use client"

import { useId, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { richText } from "@/components/rich-text"
import {
  experience,
  type ExperienceItem,
  type ExperienceRole,
} from "@/content/experience"

/**
 * Bullets stay mounted (they ship in the exported HTML for crawlers) —
 * only their height/opacity animates.
 */
function Bullets({
  bullets,
  open,
  panelId,
}: {
  bullets: string[]
  open: boolean
  panelId: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      id={panelId}
      initial={false}
      animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }
      }
      style={{ overflow: "hidden" }}
      aria-hidden={!open}
    >
      <ul>
        {bullets.map((b, i) => (
          <li key={i}>{richText(b)}</li>
        ))}
      </ul>
    </motion.div>
  )
}

/** "▲ promoted" chip shown above roles the person was promoted into. */
function PromoChip() {
  const reduce = useReducedMotion()
  return (
    <motion.span
      className="role__promo"
      initial={reduce ? false : { opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {experience.promotionLabel}
    </motion.span>
  )
}

function Role({ role }: { role: ExperienceRole }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  if (!role.summary) {
    return (
      <div className="role">
        {role.promoted && <PromoChip />}
        <RoleHead role={role} />
        <ul>
          {role.bullets.map((b, i) => (
            <li key={i}>{richText(b)}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="role">
      {role.promoted && <PromoChip />}
      <RoleHead role={role} />
      <p className="role__summary">{richText(role.summary)}</p>
      <button
        type="button"
        className="disclosure__btn"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "[-] collapse" : "[+] details"}
      </button>
      <Bullets bullets={role.bullets} open={open} panelId={panelId} />
    </div>
  )
}

function RoleHead({ role }: { role: ExperienceRole }) {
  return (
    <>
      <div className="role__head">
        <h4>{role.title}</h4>
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

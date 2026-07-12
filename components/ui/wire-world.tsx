"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import { theme } from "@/content/theme"
import { wireWorld as content } from "@/content/wire-world"
import { eggs } from "@/content/eggs"
import { useActiveSection } from "@/lib/use-active-section"

/**
 * Wire world — the "data warehouse" circuit layer below the hero.
 *
 * A document-spanning, pointer-transparent layer renders PCB-style traces
 * that route through the side gutters, page-edge rails, and the horizontal
 * bands between sections — never crossing section content. Ambient packets
 * flow along the wires (CSS animations, zero React work per frame); one
 * brighter "visitor bit" rides the main trail pinned to scroll progress,
 * docking at a junction port beside each section title.
 *
 * Geometry is measured from the real DOM (offsetTop accumulation — immune
 * to Reveal's entrance transforms) and generated with a seeded RNG so the
 * network is stable across re-measures. Renders nothing until measured
 * (hydration-safe; the static export contains no wire markup).
 */

/* ---------------- geometry helpers ---------------- */

interface Pt {
  x: number
  y: number
}

interface Island {
  id: string
  left: number
  right: number
  top: number
  bottom: number
  titleY: number
  /** Checkpoint-dot centers (Experience) — the main trail threads through these. */
  nodes?: Pt[]
}

interface Measured {
  W: number
  H: number
  vh: number
  islands: Island[]
}

interface Trace {
  d: string
  length: number
  energized: boolean
}

interface Junction {
  id: string
  padX: number
  stubX: number
  y: number
}

interface Geometry {
  W: number
  H: number
  vh: number
  hasGutters: boolean
  traces: Trace[]
  vias: Pt[]
  junctions: Junction[]
  trail: { d: string; length: number; junctionDist: number[] }
  fadeStart: number
  fadeEnd: number
  islands: Island[]
}

/** Tiny seeded RNG — deterministic wire layout across re-measures. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Document-space y via offsetParent accumulation (ignores transforms). */
function docTop(el: HTMLElement): number {
  let y = 0
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) {
    y += n.offsetTop
  }
  return y
}

function docLeft(el: HTMLElement): number {
  let x = 0
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) {
    x += n.offsetLeft
  }
  return x
}

/** Replace each 90° corner with a 45° chamfer of size c (clamped). */
function chamfer(pts: Pt[], c: number): Pt[] {
  if (pts.length < 3) return pts
  const out: Pt[] = [pts[0]]
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1]
    const p = pts[i]
    const b = pts[i + 1]
    const inLen = Math.hypot(p.x - a.x, p.y - a.y)
    const outLen = Math.hypot(b.x - p.x, b.y - p.y)
    const cc = Math.min(c, inLen / 2, outLen / 2)
    if (cc < 1) {
      out.push(p)
      continue
    }
    // Point cc px back along the incoming segment / forward along outgoing.
    out.push({
      x: p.x + ((a.x - p.x) / inLen) * cc,
      y: p.y + ((a.y - p.y) / inLen) * cc,
    })
    out.push({
      x: p.x + ((b.x - p.x) / outLen) * cc,
      y: p.y + ((b.y - p.y) / outLen) * cc,
    })
  }
  out.push(pts[pts.length - 1])
  return out
}

function toPathD(pts: Pt[]): string {
  return (
    "M" + pts.map((p) => `${Math.round(p.x)} ${Math.round(p.y)}`).join("L")
  )
}

function polylineLength(pts: Pt[]): number {
  let len = 0
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)
  }
  return len
}

/**
 * Arc distance along a y-monotonic polyline at the given document y.
 * Used to place the visitor bit exactly at each junction regardless of
 * how chamfering altered segment lengths.
 */
function distanceAtY(pts: Pt[], y: number): number {
  let acc = 0
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const segLen = Math.hypot(b.x - a.x, b.y - a.y)
    if (b.y > a.y && a.y <= y && y <= b.y) {
      return acc + segLen * ((y - a.y) / (b.y - a.y))
    }
    acc += segLen
  }
  return acc
}

/* ---------------- measurement ---------------- */

function measure(ids: readonly string[]): Measured | null {
  const islands: Island[] = []
  for (const id of ids) {
    const el = document.getElementById(id)
    if (!el) continue
    const style = getComputedStyle(el)
    const padTop = parseFloat(style.paddingTop) || 0
    const padBottom = parseFloat(style.paddingBottom) || 0
    const padLeft = parseFloat(style.paddingLeft) || 0
    const padRight = parseFloat(style.paddingRight) || 0
    const top = docTop(el)
    const left = docLeft(el)
    const title = el.querySelector<HTMLElement>(".section__title")
    // Waypoint elements the bit threads through (config per section).
    // Offset-based coords ignore any pulse/entrance transform, staying accurate.
    const selector = content.waypoints[id]
    const wpEls = selector
      ? el.querySelectorAll<HTMLElement>(selector)
      : ([] as unknown as NodeListOf<HTMLElement>)
    const nodes: Pt[] = Array.from(wpEls)
      .map((d) => ({
        x: docLeft(d) + d.offsetWidth / 2,
        y: docTop(d) + d.offsetHeight / 2,
      }))
      // Thread top-to-bottom, then left-to-right (columns, rows, and grids).
      .sort((a, b) => a.y - b.y || a.x - b.x)
    islands.push({
      id,
      left: left + padLeft,
      right: left + el.offsetWidth - padRight,
      top: top + padTop,
      bottom: top + el.offsetHeight - padBottom,
      titleY: title
        ? docTop(title) + title.offsetHeight / 2
        : top + padTop + 24,
      nodes: nodes.length ? nodes : undefined,
    })
  }
  if (islands.length < 2) return null
  return {
    W: document.documentElement.clientWidth,
    // Flow height of the body — NOT scrollHeight, which would include this
    // layer's own previous height and never shrink back (phantom scroll).
    H: document.body.offsetHeight,
    vh: window.innerHeight,
    islands,
  }
}

/* ---------------- generation ---------------- */

function generateGeometry(m: Measured, seed: number): Geometry {
  const knobs = theme.wireWorld
  const rng = mulberry32(seed)
  const { W, H, vh, islands } = m
  const edge = 14
  const secLeft = Math.min(...islands.map((i) => i.left))
  const secRight = Math.max(...islands.map((i) => i.right))
  const first = islands[0]
  const last = islands[islands.length - 1]
  const startY = first.top - 140
  const endY = Math.min(last.bottom + 60, H - 20)

  // Vertical lanes: page-edge rails always; gutter lanes on wide screens.
  const hasGutters = secLeft - edge > 90
  const lanes: number[] = [edge, W - edge]
  if (hasGutters) {
    const lg: [number, number] = [edge + 12, secLeft - 24]
    const rg: [number, number] = [secRight + 24, W - edge - 12]
    for (let i = 0; i < knobs.gutterLanes; i++) {
      const t = (i + 0.5) / knobs.gutterLanes
      lanes.push(lg[0] + (lg[1] - lg[0]) * t + (rng() - 0.5) * 8)
      lanes.push(rg[0] + (rg[1] - rg[0]) * t + (rng() - 0.5) * 8)
    }
  }

  // Horizontal bands between consecutive content islands.
  const bands: { y0: number; y1: number; laneYs: number[] }[] = []
  for (let i = 0; i < islands.length - 1; i++) {
    const y0 = islands[i].bottom + 10
    const y1 = islands[i + 1].top - 10
    if (y1 - y0 < 28) continue
    const laneYs: number[] = []
    for (let j = 0; j < knobs.bandLanes; j++) {
      const t = (j + 0.5) / knobs.bandLanes
      laneYs.push(y0 + (y1 - y0) * t + (rng() - 0.5) * 10)
    }
    bands.push({ y0, y1, laneYs })
  }

  // --- Ambient traces ---
  const rawTraces: Pt[][] = []

  // Vertical runners: one per lane, jogging across the page at random bands.
  for (const laneX of lanes) {
    const pts: Pt[] = [{ x: laneX, y: startY + rng() * 90 }]
    let curX = laneX
    for (const band of bands) {
      if (rng() > 0.42) continue
      const bandY = band.laneYs[Math.floor(rng() * band.laneYs.length)]
      let targetX = lanes[Math.floor(rng() * lanes.length)]
      if (Math.abs(targetX - curX) < 30) targetX = curX === edge ? W - edge : edge
      pts.push({ x: curX, y: bandY })
      pts.push({ x: targetX, y: bandY })
      curX = targetX
    }
    pts.push({ x: curX, y: endY - rng() * 50 })
    rawTraces.push(pts)
  }

  // Band runners: left rail → right rail with a zigzag inside a band.
  const runnerBands = bands.filter((_, i) => i % 2 === 0)
  for (const band of runnerBands.slice(0, 3)) {
    const y1 = band.y0 + (band.y1 - band.y0) * 0.25
    const y2 = band.y0 + (band.y1 - band.y0) * 0.75
    const xm = W * (0.25 + rng() * 0.5)
    rawTraces.push([
      { x: edge, y: y1 },
      { x: xm, y: y1 },
      { x: xm, y: y2 },
      { x: W - edge, y: y2 },
    ])
  }

  const energizedPicks = new Set<number>()
  while (
    energizedPicks.size < Math.min(knobs.energizedCount, rawTraces.length)
  ) {
    energizedPicks.add(Math.floor(rng() * rawTraces.length))
  }

  const vias: Pt[] = []
  const traces: Trace[] = rawTraces.map((pts, i) => {
    // A few corner vias for PCB flavor.
    for (let j = 1; j < pts.length - 1; j++) {
      if (rng() < 0.3 && vias.length < 24) vias.push(pts[j])
    }
    const ch = chamfer(pts, knobs.chamfer)
    return {
      d: toPathD(ch),
      length: polylineLength(ch),
      energized: energizedPicks.has(i),
    }
  })

  // --- Junction ports ---
  const junctions: Junction[] = islands.map((island) => ({
    id: island.id,
    padX: Math.max(island.left - 14, 8),
    stubX: 0, // filled below once trailX is known
    y: island.titleY,
  }))

  // --- Main trail (visitor bit's track) — y-monotonic ---
  const trailX = hasGutters ? secLeft - 24 : edge + 4
  const trailPts: Pt[] = [{ x: trailX, y: junctions[0].y }]
  for (let i = 0; i < islands.length - 1; i++) {
    const nextY = junctions[i + 1].y
    const nodes = islands[i].nodes
    if (nodes && nodes.length) {
      // Thread the bit through this section's waypoints (each at its own
      // position, so columns AND horizontal rows work), jogging in from and
      // back to the gutter. Sorted by y, so the path stays y-monotonic.
      trailPts.push({ x: trailX, y: nodes[0].y })
      for (const n of nodes) trailPts.push({ x: n.x, y: n.y })
      trailPts.push({ x: trailX, y: nodes[nodes.length - 1].y })
    } else {
      // Flavor jog inside the band between these sections (desktop only).
      const band = bands.find((b) => b.y0 > junctions[i].y && b.y1 < nextY)
      if (band && hasGutters && rng() < 0.6) {
        const jx = Math.max(trailX - (30 + rng() * 60), edge + 6)
        const y1 = band.y0 + (band.y1 - band.y0) * 0.2
        const y2 = band.y0 + (band.y1 - band.y0) * 0.8
        trailPts.push({ x: trailX, y: y1 })
        trailPts.push({ x: jx, y: y1 })
        trailPts.push({ x: jx, y: y2 })
        trailPts.push({ x: trailX, y: y2 })
      }
    }
    trailPts.push({ x: trailX, y: nextY })
  }
  const trailCh = chamfer(trailPts, knobs.chamfer)
  const trail = {
    d: toPathD(trailCh),
    length: polylineLength(trailCh),
    junctionDist: junctions.map((j) => distanceAtY(trailCh, j.y)),
  }
  for (const j of junctions) j.stubX = trailX

  return {
    W,
    H,
    vh,
    hasGutters,
    traces,
    vias,
    junctions,
    trail,
    fadeStart: Math.max(startY - 40, 0),
    fadeEnd: first.top - 20,
    islands,
  }
}

/* ---------------- visitor bit ---------------- */

function VisitorBit({ geo }: { geo: Geometry }) {
  const knobs = theme.wireWorld.bit
  const { scrollYProgress } = useScroll()

  const [inputStops, outputStops] = useMemo(() => {
    const denom = Math.max(geo.H - geo.vh, 1)
    const inputs: number[] = []
    const outputs: number[] = []
    geo.junctions.forEach((j, i) => {
      let s = (j.y - geo.vh / 2) / denom
      s = Math.min(Math.max(s, 0), 1)
      if (i > 0 && s <= inputs[i - 1]) s = inputs[i - 1] + 0.001
      inputs.push(s)
      outputs.push((geo.trail.junctionDist[i] / geo.trail.length) * 100)
    })
    return [inputs, outputs] as const
  }, [geo])

  const raw = useTransform(scrollYProgress, inputStops, outputStops)
  const sprung = useSpring(raw, knobs.spring)
  const dist = useTransform(sprung, (v) => `${v}%`)

  return (
    <motion.div
      className="wire-world__bit"
      style={{
        offsetPath: `path("${geo.trail.d}")`,
        offsetDistance: dist,
        width: knobs.size,
        height: knobs.size,
        background: knobs.color,
        boxShadow: knobs.glow,
      }}
    />
  )
}

/* ---------------- the layer ---------------- */

export function WireWorld() {
  const knobs = theme.wireWorld
  const [geo, setGeo] = useState<Geometry | null>(null)
  const [geoVersion, setGeoVersion] = useState(0)
  const [canOffset, setCanOffset] = useState(false)
  const layerRef = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef(0)
  const reduce = useReducedMotion()
  const activeId = useActiveSection(content.sectionIds)

  // Bit-docking accent: brighten the title of the section the bit has reached.
  useEffect(() => {
    for (const id of content.sectionIds) {
      const title = document
        .getElementById(id)
        ?.querySelector(".section__title")
      title?.toggleAttribute("data-bit-here", id === activeId)
    }
  }, [activeId])

  useEffect(() => {
    setCanOffset(
      typeof CSS !== "undefined" &&
        CSS.supports("offset-path", 'path("M0 0L10 10")')
    )

    const remeasure = () => {
      window.clearTimeout(debounceTimer.current)
      debounceTimer.current = window.setTimeout(() => {
        const m = measure(content.sectionIds)
        if (m) {
          setGeo(generateGeometry(m, knobs.seed))
          setGeoVersion((v) => v + 1)
        }
      }, 150)
    }

    remeasure()
    const ro = new ResizeObserver(remeasure)
    ro.observe(document.body)
    window.addEventListener("resize", remeasure)
    document.fonts?.ready.then(remeasure).catch(() => {})
    return () => {
      window.clearTimeout(debounceTimer.current)
      ro.disconnect()
      window.removeEventListener("resize", remeasure)
    }
  }, [knobs.seed])

  // Konami rain-surge synergy: retime the CSS wire animations via WAAPI
  // (updatePlaybackRate keeps positions continuous — no jumps).
  useEffect(() => {
    const onSurge = () => {
      const layer = layerRef.current
      if (!layer) return
      const anims = layer
        .getAnimations({ subtree: true })
        .filter(
          (a): a is CSSAnimation =>
            a instanceof CSSAnimation &&
            (a.animationName === "wire-flow" || a.animationName === "wire-dash")
        )
      for (const a of anims) {
        if (typeof a.updatePlaybackRate === "function") {
          a.updatePlaybackRate(knobs.surge.speedMultiplier)
        }
      }
      layer.classList.add("wire-world--surge")
      window.setTimeout(() => {
        for (const a of anims) {
          if (typeof a.updatePlaybackRate === "function") a.updatePlaybackRate(1)
        }
        layer.classList.remove("wire-world--surge")
      }, theme.rain.surge.durationMs)
    }
    window.addEventListener(eggs.surgeEvent, onSurge)
    return () => window.removeEventListener(eggs.surgeEvent, onSurge)
  }, [knobs.surge.speedMultiplier])

  if (!geo) return null

  const packetKnobs = knobs.packets
  const packetCount = geo.hasGutters
    ? packetKnobs.count
    : packetKnobs.countMobile
  const packetTraces = [...geo.traces]
    .sort((a, b) => b.length - a.length)
    .slice(0, packetCount)
  const showMotion = !reduce && canOffset
  const dashPeriod = knobs.dash.pattern[0] + knobs.dash.pattern[1]

  return (
    <>
    <div
      ref={layerRef}
      className="wire-world"
      aria-hidden
      style={{
        height: geo.H,
        maskImage: `linear-gradient(to bottom, transparent ${geo.fadeStart}px, #000 ${geo.fadeEnd}px)`,
        WebkitMaskImage: `linear-gradient(to bottom, transparent ${geo.fadeStart}px, #000 ${geo.fadeEnd}px)`,
      }}
    >
      <svg
        width={geo.W}
        height={geo.H}
        viewBox={`0 0 ${geo.W} ${geo.H}`}
        shapeRendering="geometricPrecision"
      >
        {/* base copper traces */}
        {geo.traces.map((t, i) => (
          <path
            key={i}
            d={t.d}
            fill="none"
            stroke={knobs.traceColor}
            strokeWidth={knobs.strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
        {/* main trail — slightly brighter so the bit's road reads */}
        <path
          d={geo.trail.d}
          fill="none"
          stroke={knobs.energizedColor}
          strokeWidth={knobs.strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.55}
        />
        {/* energized dashed overlays */}
        {!reduce &&
          geo.traces
            .filter((t) => t.energized)
            .map((t, i) => (
              <path
                key={`dash-${i}`}
                className="wire-world__dash"
                d={t.d}
                fill="none"
                stroke={knobs.energizedColor}
                strokeWidth={knobs.strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
                style={
                  {
                    strokeDasharray: knobs.dash.pattern.join(" "),
                    "--dash-dur": `${knobs.dash.periodSeconds}s`,
                    "--dash-offset": `${-dashPeriod}`,
                  } as React.CSSProperties
                }
              />
            ))}
        {/* vias */}
        {geo.vias.map((v, i) => (
          <circle
            key={`via-${i}`}
            cx={v.x}
            cy={v.y}
            r={2}
            fill="none"
            stroke={knobs.viaColor}
            strokeWidth={1}
          />
        ))}
        {/* junction ports: stub + pad */}
        {geo.junctions.map((j) => {
          const active = activeId === j.id
          const x1 = Math.min(j.stubX, j.padX)
          const x2 = Math.max(j.stubX, j.padX)
          return (
            <g
              key={j.id}
              className="wire-world__port"
              data-active={active || undefined}
            >
              <line x1={x1} y1={j.y} x2={x2} y2={j.y} />
              <circle cx={j.padX} cy={j.y} r={5} fill="none" />
              <circle cx={j.padX} cy={j.y} r={1.8} className="wire-world__port-core" />
            </g>
          )
        })}
      </svg>

      {/* port labels (desktop gutters only) */}
      {geo.hasGutters &&
        geo.junctions.map((j) => (
          <span
            key={`label-${j.id}`}
            className="wire-world__port-label"
            data-active={activeId === j.id || undefined}
            style={{
              right: geo.W - j.padX + 12,
              top: j.y - 8,
            }}
          >
            {content.portLabel(j.id)}
          </span>
        ))}

      {/* ambient packets */}
      {showMotion &&
        knobs.ambientEnabled &&
        packetTraces.map((t, i) => {
          const dur = t.length / packetKnobs.pxPerSecond
          return (
            <div
              key={`packet-${geoVersion}-${i}`}
              className="wire-world__packet"
              style={
                {
                  offsetPath: `path("${t.d}")`,
                  width: packetKnobs.size,
                  height: packetKnobs.size,
                  background: packetKnobs.color,
                  boxShadow: packetKnobs.glow,
                  "--dur": `${dur}s`,
                  "--delay": `${-(dur * ((i + 0.7) / packetCount))}s`,
                } as React.CSSProperties
              }
            />
          )
        })}

      {/* debug overlay: measured islands + junctions */}
      {knobs.debug && (
        <svg
          width={geo.W}
          height={geo.H}
          viewBox={`0 0 ${geo.W} ${geo.H}`}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {geo.islands.map((isl) => (
            <rect
              key={isl.id}
              x={isl.left}
              y={isl.top}
              width={isl.right - isl.left}
              height={isl.bottom - isl.top}
              fill="rgba(255,0,0,0.08)"
              stroke="rgba(255,0,0,0.4)"
            />
          ))}
          {geo.junctions.map((j) => (
            <circle key={j.id} cx={j.padX} cy={j.y} r={8} fill="rgba(0,128,255,0.5)" />
          ))}
        </svg>
      )}
    </div>
    {/* The bit rides a separate top layer so it stays visible while it
        threads through opaque cards, not hidden behind them. */}
    {showMotion && (
      <div
        className="wire-world__bit-layer"
        aria-hidden
        style={{ height: geo.H }}
      >
        {/* No geoVersion key: keep the bit mounted across re-measures so it
            glides to the new position instead of re-dropping from the top. */}
        <VisitorBit geo={geo} />
      </div>
    )}
    </>
  )
}

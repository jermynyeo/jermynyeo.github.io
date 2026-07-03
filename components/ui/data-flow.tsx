"use client"

import {
  forwardRef,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { cn } from "@/lib/utils"
import { stack } from "@/content/stack"
import { theme } from "@/content/theme"

interface NodeProps {
  id: string
  name: string
  hint?: string
  description?: string
  active: boolean
  dimmed: boolean
  onActivate: (id: string) => void
  onDeactivate: () => void
  onToggle: (id: string) => void
}

const DataNode = forwardRef<HTMLDivElement, NodeProps>(
  (
    {
      id,
      name,
      hint,
      description,
      active,
      dimmed,
      onActivate,
      onDeactivate,
      onToggle,
    },
    ref
  ) => {
    const isTouch = useRef(false)
    return (
      <div
        ref={ref}
        className={cn(
          "data-node",
          active && "data-node--hot",
          dimmed && "data-node--dim"
        )}
        tabIndex={0}
        aria-describedby={active && description ? `tip-${id}` : undefined}
        onMouseEnter={() => {
          if (!isTouch.current) onActivate(id)
        }}
        onMouseLeave={() => {
          if (!isTouch.current) onDeactivate()
        }}
        onFocus={() => onActivate(id)}
        onBlur={onDeactivate}
        onTouchStart={() => {
          isTouch.current = true
        }}
        onClick={() => {
          if (isTouch.current) onToggle(id)
        }}
      >
        <span className="data-node__name">{name}</span>
        {hint && <span className="data-node__hint">{hint}</span>}
        {active && description && (
          <span role="tooltip" id={`tip-${id}`} className="data-node__tip">
            {description}
          </span>
        )}
      </div>
    )
  }
)
DataNode.displayName = "DataNode"

/**
 * Build a stable ref per node id (declared in `content/stack.ts`).
 * Returning a Map<string, RefObject> keeps beam lookups O(1).
 */
function useNodeRefs(): Map<string, RefObject<HTMLDivElement | null>> {
  // useMemo runs once; refs survive re-renders because they're stored by id
  // inside the Map. We never mutate the Map shape.
  return useMemo(() => {
    const refs = new Map<string, RefObject<HTMLDivElement | null>>()
    for (const col of stack.flow.columns) {
      for (const node of col.nodes) {
        refs.set(node.id, { current: null })
      }
    }
    return refs
  }, [])
}

export function DataFlow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useNodeRefs()
  const beam = theme.beam
  const [active, setActive] = useState<string | null>(null)

  // Adjacency from the beam list: hovering a node keeps itself + direct
  // neighbors bright and dims the rest of the diagram.
  const connected = useMemo(() => {
    const map = new Map<string, Set<string>>()
    for (const col of stack.flow.columns) {
      for (const node of col.nodes) map.set(node.id, new Set())
    }
    for (const b of stack.flow.beams) {
      map.get(b.from)?.add(b.to)
      map.get(b.to)?.add(b.from)
    }
    return map
  }, [])

  const isNodeDimmed = (id: string) =>
    active !== null && id !== active && !connected.get(active)?.has(id)

  return (
    <div className="data-flow-wrap">
      <div ref={containerRef} className="data-flow">
        {stack.flow.columns.map((col) => (
          <div key={col.title} className="data-flow__col">
            <h4 className="data-flow__col-title">{col.title}</h4>
            {col.nodes.map((node) => (
              <DataNode
                key={node.id}
                ref={nodeRefs.get(node.id)!}
                id={node.id}
                name={node.name}
                hint={node.hint}
                description={node.description}
                active={active === node.id}
                dimmed={isNodeDimmed(node.id)}
                onActivate={setActive}
                onDeactivate={() => setActive(null)}
                onToggle={(id) =>
                  setActive((prev) => (prev === id ? null : id))
                }
              />
            ))}
          </div>
        ))}

        {stack.flow.beams.map((b, i) => {
          const fromRef = nodeRefs.get(b.from)
          const toRef = nodeRefs.get(b.to)
          if (!fromRef || !toRef) return null
          const isHot =
            active !== null && (b.from === active || b.to === active)
          const isDim = active !== null && !isHot
          return (
            <AnimatedBeam
              key={`${b.from}->${b.to}-${i}`}
              className={cn("beam", isHot && "beam--hot", isDim && "beam--dim")}
              containerRef={containerRef}
              fromRef={fromRef}
              toRef={toRef}
              curvature={b.curvature ?? 0}
              delay={b.delay ?? 0}
              duration={beam.duration}
              pathColor={beam.pathColor}
              pathWidth={beam.pathWidth}
              pathOpacity={beam.pathOpacity}
              gradientStartColor={beam.gradientStartColor}
              gradientStopColor={beam.gradientStopColor}
            />
          )
        })}
      </div>

      <div className="data-flow__platform" aria-label="Platform foundation">
        <span className="data-flow__platform-label">{stack.platformLabel}</span>
        {stack.platform.map((item, i) => (
          <span key={item} style={{ display: "contents" }}>
            <span className="data-flow__platform-item">{item}</span>
            {i < stack.platform.length - 1 && (
              <span className="data-flow__platform-sep">·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}

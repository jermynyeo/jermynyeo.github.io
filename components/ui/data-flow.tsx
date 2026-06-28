"use client"

import { forwardRef, useMemo, useRef, type RefObject } from "react"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { cn } from "@/lib/utils"
import { stack } from "@/content/stack"
import { theme } from "@/content/theme"

interface NodeProps {
  name: string
  hint?: string
  className?: string
}

const DataNode = forwardRef<HTMLDivElement, NodeProps>(
  ({ name, hint, className }, ref) => {
    return (
      <div ref={ref} className={cn("data-node", className)}>
        <span className="data-node__name">{name}</span>
        {hint && <span className="data-node__hint">{hint}</span>}
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
                name={node.name}
                hint={node.hint}
              />
            ))}
          </div>
        ))}

        {stack.flow.beams.map((b, i) => {
          const fromRef = nodeRefs.get(b.from)
          const toRef = nodeRefs.get(b.to)
          if (!fromRef || !toRef) return null
          return (
            <AnimatedBeam
              key={`${b.from}->${b.to}-${i}`}
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

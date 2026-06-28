"use client"

import { forwardRef, useRef } from "react"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { cn } from "@/lib/utils"

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

const BEAM = {
  pathColor: "rgba(0, 255, 0, 0.32)",
  pathWidth: 2.2,
  pathOpacity: 1,
  gradientStartColor: "#00ff5a",
  gradientStopColor: "#ffffff",
  duration: 3.4,
}

export function DataFlow() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Sources
  const kafkaRef = useRef<HTMLDivElement>(null)
  const postgresRef = useRef<HTMLDivElement>(null)
  const filesRef = useRef<HTMLDivElement>(null)

  // Processing
  const sparkRef = useRef<HTMLDivElement>(null)
  const databricksRef = useRef<HTMLDivElement>(null)
  const glueRef = useRef<HTMLDivElement>(null)

  // Lakehouse
  const s3Ref = useRef<HTMLDivElement>(null)
  const deltaRef = useRef<HTMLDivElement>(null)

  // Serving
  const athenaRef = useRef<HTMLDivElement>(null)
  const tableauRef = useRef<HTMLDivElement>(null)
  const powerbiRef = useRef<HTMLDivElement>(null)

  return (
    <div className="data-flow-wrap">
      <div ref={containerRef} className="data-flow">
        <div className="data-flow__col">
          <h4 className="data-flow__col-title">Sources</h4>
          <DataNode ref={kafkaRef} name="Kafka" hint="streams" />
          <DataNode ref={postgresRef} name="Postgres" hint="OLTP" />
          <DataNode ref={filesRef} name="Files" hint="batch" />
        </div>

        <div className="data-flow__col">
          <h4 className="data-flow__col-title">Processing</h4>
          <DataNode ref={sparkRef} name="Apache Spark" hint="ETL" />
          <DataNode ref={databricksRef} name="Databricks" hint="notebooks" />
          <DataNode ref={glueRef} name="AWS Glue" hint="managed ETL" />
        </div>

        <div className="data-flow__col">
          <h4 className="data-flow__col-title">Lakehouse</h4>
          <DataNode ref={s3Ref} name="S3" hint="object store" />
          <DataNode ref={deltaRef} name="Delta Lake" hint="table format" />
        </div>

        <div className="data-flow__col">
          <h4 className="data-flow__col-title">Serving</h4>
          <DataNode ref={athenaRef} name="Athena" hint="SQL" />
          <DataNode ref={tableauRef} name="Tableau" hint="BI" />
          <DataNode ref={powerbiRef} name="Power BI" hint="dashboards" />
        </div>

        {/* Sources → Processing */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={kafkaRef}
          toRef={sparkRef}
          curvature={-20}
          duration={BEAM.duration}
          delay={0}
          pathColor={BEAM.pathColor}
          pathWidth={BEAM.pathWidth}
          pathOpacity={BEAM.pathOpacity}
          gradientStartColor={BEAM.gradientStartColor}
          gradientStopColor={BEAM.gradientStopColor}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={postgresRef}
          toRef={databricksRef}
          duration={BEAM.duration}
          delay={0.4}
          pathColor={BEAM.pathColor}
          pathWidth={BEAM.pathWidth}
          pathOpacity={BEAM.pathOpacity}
          gradientStartColor={BEAM.gradientStartColor}
          gradientStopColor={BEAM.gradientStopColor}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={postgresRef}
          toRef={glueRef}
          curvature={25}
          duration={BEAM.duration}
          delay={0.8}
          pathColor={BEAM.pathColor}
          pathWidth={BEAM.pathWidth}
          pathOpacity={BEAM.pathOpacity}
          gradientStartColor={BEAM.gradientStartColor}
          gradientStopColor={BEAM.gradientStopColor}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={filesRef}
          toRef={glueRef}
          duration={BEAM.duration}
          delay={1.2}
          pathColor={BEAM.pathColor}
          pathWidth={BEAM.pathWidth}
          pathOpacity={BEAM.pathOpacity}
          gradientStartColor={BEAM.gradientStartColor}
          gradientStopColor={BEAM.gradientStopColor}
        />

        {/* Processing → Lakehouse */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={sparkRef}
          toRef={s3Ref}
          curvature={-15}
          duration={BEAM.duration}
          delay={1.6}
          pathColor={BEAM.pathColor}
          pathWidth={BEAM.pathWidth}
          pathOpacity={BEAM.pathOpacity}
          gradientStartColor={BEAM.gradientStartColor}
          gradientStopColor={BEAM.gradientStopColor}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={databricksRef}
          toRef={deltaRef}
          duration={BEAM.duration}
          delay={2.0}
          pathColor={BEAM.pathColor}
          pathWidth={BEAM.pathWidth}
          pathOpacity={BEAM.pathOpacity}
          gradientStartColor={BEAM.gradientStartColor}
          gradientStopColor={BEAM.gradientStopColor}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={glueRef}
          toRef={s3Ref}
          curvature={30}
          duration={BEAM.duration}
          delay={2.4}
          pathColor={BEAM.pathColor}
          pathWidth={BEAM.pathWidth}
          pathOpacity={BEAM.pathOpacity}
          gradientStartColor={BEAM.gradientStartColor}
          gradientStopColor={BEAM.gradientStopColor}
        />

        {/* Lakehouse → Serving */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={s3Ref}
          toRef={athenaRef}
          duration={BEAM.duration}
          delay={2.8}
          pathColor={BEAM.pathColor}
          pathWidth={BEAM.pathWidth}
          pathOpacity={BEAM.pathOpacity}
          gradientStartColor={BEAM.gradientStartColor}
          gradientStopColor={BEAM.gradientStopColor}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={deltaRef}
          toRef={athenaRef}
          curvature={-20}
          duration={BEAM.duration}
          delay={3.2}
          pathColor={BEAM.pathColor}
          pathWidth={BEAM.pathWidth}
          pathOpacity={BEAM.pathOpacity}
          gradientStartColor={BEAM.gradientStartColor}
          gradientStopColor={BEAM.gradientStopColor}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={athenaRef}
          toRef={tableauRef}
          curvature={20}
          duration={BEAM.duration}
          delay={3.6}
          pathColor={BEAM.pathColor}
          pathWidth={BEAM.pathWidth}
          pathOpacity={BEAM.pathOpacity}
          gradientStartColor={BEAM.gradientStartColor}
          gradientStopColor={BEAM.gradientStopColor}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={athenaRef}
          toRef={powerbiRef}
          curvature={40}
          duration={BEAM.duration}
          delay={4.0}
          pathColor={BEAM.pathColor}
          pathWidth={BEAM.pathWidth}
          pathOpacity={BEAM.pathOpacity}
          gradientStartColor={BEAM.gradientStartColor}
          gradientStopColor={BEAM.gradientStopColor}
        />
      </div>

      <div className="data-flow__platform" aria-label="Platform foundation">
        <span className="data-flow__platform-label">// runs on</span>
        <span className="data-flow__platform-item">AWS</span>
        <span className="data-flow__platform-sep">·</span>
        <span className="data-flow__platform-item">Kubernetes</span>
        <span className="data-flow__platform-sep">·</span>
        <span className="data-flow__platform-item">Terraform</span>
        <span className="data-flow__platform-sep">·</span>
        <span className="data-flow__platform-item">Docker</span>
        <span className="data-flow__platform-sep">·</span>
        <span className="data-flow__platform-item">Linux</span>
      </div>
    </div>
  )
}

"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { cn } from "@/lib/utils"

/**
 * Matrix-themed BreakableCard — drag/shake to crack, fully break, respawn.
 * Adapted from the kinetic-shatter-box-section reference component to
 * fit the terminal/green-glow palette in app/globals.css.
 */

export interface SectionCardProps {
  title: string
  description?: React.ReactNode
  className?: string
  onBreak?: () => void
}

interface FallState {
  active: boolean
  velocityX: number
  velocityY: number
  rotation: number
}

interface DebrisData {
  id: number
  x: number
  y: number
  rot: number
  delay: number
  path: string
}

const PHYSICS = {
  MAX_RANGE: 45,
  DAMAGE_THRESHOLD: 2.5,
  DAMAGE_INCREMENT: 0.08,
  RECOVERY_RATE: 0.05,
  RESPAWN_TIME_MS: 7000,
  DEBRIS_DISAPPEAR_MS: 3000,
  HEALING_DURATION_MS: 10000,
} as const

const CHUNK_PATHS = [
  "M 0 0 L 20 5 L 15 25 L 5 20 Z",
  "M 5 0 L 25 10 L 15 30 L 0 25 Z",
  "M 10 5 L 30 0 L 25 25 L 5 30 Z",
  "M 0 10 L 20 0 L 30 20 L 10 30 Z",
]

const DEBRIS_THRESHOLDS = [0.3, 0.5, 0.7, 0.9]

const useBreakableCard = (onBreak?: () => void) => {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [crackLevel, setCrackLevel] = useState(0)
  const [isBroken, setIsBroken] = useState(false)
  const [fallState, setFallState] = useState<FallState>({
    active: false,
    velocityX: 0,
    velocityY: 0,
    rotation: 0,
  })
  const [debrisChunks, setDebrisChunks] = useState<DebrisData[]>([])
  const [respawnProgress, setRespawnProgress] = useState(0)
  const [isFlashing, setIsFlashing] = useState(false)

  const lastPos = useRef({ x: 0, y: 0 })
  const startPos = useRef({ x: 0, y: 0 })
  const lastTime = useRef(0)
  const shakeIntensity = useRef(0)
  const velocityRef = useRef({ x: 0, y: 0 })
  const crackLevelRef = useRef(0)
  const isBrokenRef = useRef(false)

  const triggerBreak = useCallback(() => {
    if (isBrokenRef.current) return
    isBrokenRef.current = true
    setIsBroken(true)
    setIsDragging(false)
    const vx = velocityRef.current.x
    const baseRotation = Math.max(-60, Math.min(60, vx))
    setFallState({
      active: true,
      velocityX: vx * 0.3,
      velocityY: 5,
      rotation: baseRotation,
    })
    onBreak?.()
  }, [onBreak])

  const spawnDebris = useCallback(
    (level: number) => {
      const newChunks: DebrisData[] = []
      DEBRIS_THRESHOLDS.forEach((threshold, i) => {
        if (level >= threshold && debrisChunks.length <= i) {
          newChunks.push({
            id: Date.now() + i,
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10,
            rot: Math.random() * 360,
            delay: 0,
            path:
              CHUNK_PATHS[Math.floor(Math.random() * CHUNK_PATHS.length)],
          })
        }
      })
      if (newChunks.length > 0) {
        setDebrisChunks((prev) => [...prev, ...newChunks])
      }
    },
    [debrisChunks.length]
  )

  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (isBrokenRef.current) return
      setIsDragging(true)
      const clientX =
        "touches" in e
          ? e.touches[0].clientX
          : (e as React.MouseEvent).clientX
      const clientY =
        "touches" in e
          ? e.touches[0].clientY
          : (e as React.MouseEvent).clientY
      startPos.current = {
        x: clientX - position.x,
        y: clientY - position.y,
      }
      lastPos.current = { x: clientX, y: clientY }
      lastTime.current = Date.now()
      shakeIntensity.current = 0
    },
    [position.x, position.y]
  )

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || isBrokenRef.current) return
      const now = Date.now()
      const dt = Math.max(1, now - lastTime.current)

      const dx = clientX - lastPos.current.x
      const dy = clientY - lastPos.current.y
      const vx = dx / dt
      const vy = dy / dt
      velocityRef.current = { x: vx * 100, y: vy * 100 }

      const newX = clientX - startPos.current.x
      const newY = clientY - startPos.current.y
      const clampedX = Math.max(
        -PHYSICS.MAX_RANGE,
        Math.min(PHYSICS.MAX_RANGE, newX)
      )
      const clampedY = Math.max(
        -PHYSICS.MAX_RANGE,
        Math.min(PHYSICS.MAX_RANGE, newY)
      )
      setPosition({ x: clampedX, y: clampedY })

      const pushedRight = clampedX >= PHYSICS.MAX_RANGE && vx > 0
      const pushedLeft = clampedX <= -PHYSICS.MAX_RANGE && vx < 0
      const pushedDown = clampedY >= PHYSICS.MAX_RANGE && vy > 0
      const pushedUp = clampedY <= -PHYSICS.MAX_RANGE && vy < 0
      const isHorizontalImpact =
        (pushedRight || pushedLeft) && Math.abs(vx) > 0.5
      const isVerticalImpact =
        (pushedDown || pushedUp) && Math.abs(vy) > 0.5

      if (isHorizontalImpact) {
        shakeIntensity.current += PHYSICS.DAMAGE_INCREMENT * 1.5
        setIsFlashing(true)
        setTimeout(() => setIsFlashing(false), 150)
      } else if (isVerticalImpact) {
        shakeIntensity.current += PHYSICS.DAMAGE_INCREMENT * 0.5
      } else {
        shakeIntensity.current = Math.max(
          0,
          shakeIntensity.current - PHYSICS.RECOVERY_RATE
        )
      }

      setCrackLevel((prev) => {
        const newLevel = Math.min(1, prev + shakeIntensity.current * 0.025)
        crackLevelRef.current = newLevel
        spawnDebris(newLevel)
        if (newLevel >= 1) {
          setTimeout(() => triggerBreak(), 0)
        }
        return newLevel
      })

      lastPos.current = { x: clientX, y: clientY }
      lastTime.current = now
    },
    [isDragging, spawnDebris, triggerBreak]
  )

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    setPosition({ x: 0, y: 0 })
    shakeIntensity.current = 0
  }, [isDragging])

  useEffect(() => {
    if (!isDragging && !isBroken && crackLevel > 0) {
      const interval = setInterval(() => {
        setCrackLevel((prev) => {
          const healAmount = 50 / PHYSICS.HEALING_DURATION_MS
          const newLevel = Math.max(0, prev - healAmount)
          crackLevelRef.current = newLevel
          if (newLevel <= 0) {
            setDebrisChunks([])
          }
          return newLevel
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isDragging, isBroken, crackLevel])

  useEffect(() => {
    if (isBroken) {
      setRespawnProgress(0)
      const startTime = Date.now()
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(
          100,
          (elapsed / PHYSICS.RESPAWN_TIME_MS) * 100
        )
        setRespawnProgress(progress)
        if (elapsed >= PHYSICS.RESPAWN_TIME_MS) {
          clearInterval(interval)
          setIsBroken(false)
          isBrokenRef.current = false
          setCrackLevel(0)
          crackLevelRef.current = 0
          setPosition({ x: 0, y: 0 })
          setDebrisChunks([])
          setFallState({
            active: false,
            velocityX: 0,
            velocityY: 0,
            rotation: 0,
          })
          shakeIntensity.current = 0
          velocityRef.current = { x: 0, y: 0 }
          setRespawnProgress(0)
        }
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isBroken])

  useEffect(() => {
    if (!isDragging) return
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX
      const clientY =
        "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY
      handleDragMove(clientX, clientY)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", handleDragEnd)
    window.addEventListener("touchmove", onMove, { passive: false })
    window.addEventListener("touchend", handleDragEnd)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", handleDragEnd)
      window.removeEventListener("touchmove", onMove)
      window.removeEventListener("touchend", handleDragEnd)
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  return {
    isDragging,
    position,
    crackLevel,
    isBroken,
    fallState,
    debrisChunks,
    handleDragStart,
    respawnProgress,
    isFlashing,
  }
}

interface DebrisChunkProps {
  x: number
  y: number
  rot: number
  path: string
}

const DebrisChunk = ({ x, y, rot, path }: DebrisChunkProps) => {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const timer = setTimeout(
      () => setVisible(false),
      PHYSICS.DEBRIS_DISAPPEAR_MS
    )
    return () => clearTimeout(timer)
  }, [])
  if (!visible) return null
  return (
    <svg
      className="absolute w-8 h-8 pointer-events-none z-30 overflow-visible"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `rotate(${rot}deg)`,
        animation: `debris-fall 0.8s cubic-bezier(0.55, 0, 1, 0.45) 0s forwards`,
      }}
    >
      <path d={path} fill="#00ff00" stroke="#000" strokeWidth="2" />
    </svg>
  )
}

const CrackLines = ({ level }: { level: number }) => {
  if (level < 0.1) return null
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {level >= 0.1 && (
        <path
          d="M0 20 L15 25 L8 40 L20 50"
          fill="none"
          stroke="rgba(0,255,0,0.85)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: Math.min(1, level * 2) }}
        />
      )}
      {level >= 0.5 && (
        <path
          d="M50 100 L55 80 L45 70 L60 55"
          fill="none"
          stroke="rgba(0,255,0,0.85)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: Math.min(1, (level - 0.4) * 2) }}
        />
      )}
      {level >= 0.9 && (
        <path
          d="M20 0 L25 20 L40 25 L35 45 L50 50"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeDasharray="4 2"
        />
      )}
    </svg>
  )
}

export const BreakableCard = ({
  title,
  description,
  className,
  onBreak,
}: SectionCardProps) => {
  const {
    isDragging,
    position,
    crackLevel,
    isBroken,
    fallState,
    debrisChunks,
    handleDragStart,
    respawnProgress,
    isFlashing,
  } = useBreakableCard(onBreak)

  const cardId = useMemo(
    () => `card-${Math.random().toString(36).substring(2, 11)}`,
    []
  )
  const figNum = useMemo(() => Math.floor(Math.random() * 99) + 1, [])

  const fallTransform = useMemo(() => {
    if (!fallState.active) return ""
    const horizontalDrift = fallState.velocityX * 5
    const rotation =
      fallState.rotation + (fallState.velocityX > 0 ? 45 : -45)
    return `translate(${horizontalDrift}px, 120vh) rotate(${rotation}deg)`
  }, [fallState])

  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* LAYER 1: 'Gone' remnant */}
      <div className="absolute inset-0 bg-black border border-dashed border-[rgba(0,255,0,0.3)] rounded-md flex flex-col items-center justify-center z-0">
        <span className="text-[#00ff00]/70 font-mono text-[10px] uppercase tracking-[0.2em] mb-2">
          // shattered
        </span>
        {isBroken && (
          <div className="w-24 h-1.5 border border-[rgba(0,255,0,0.3)] bg-black relative overflow-hidden mt-1 rounded-sm">
            <div
              className="absolute inset-0 bg-[#00ff00] transition-all duration-75 ease-linear"
              style={{
                width: `${respawnProgress}%`,
                boxShadow: "0 0 8px rgba(0,255,0,0.6)",
              }}
            />
          </div>
        )}
        {isBroken && (
          <span className="text-[#64748b] font-mono text-[9px] uppercase tracking-wider mt-2">
            rebuilding {Math.ceil((100 - respawnProgress) / 100 * 7)}s
          </span>
        )}
      </div>

      {/* LAYER 2: Debris (rendered above and outside masked card) */}
      <div
        className="pointer-events-none absolute inset-0 z-50 overflow-visible"
        style={{
          transform: isBroken
            ? fallTransform
            : `translate(${position.x}px, ${position.y}px) rotate(${
                position.x * 0.15
              }deg)`,
        }}
      >
        {debrisChunks.map((chunk) => (
          <DebrisChunk
            key={chunk.id}
            x={chunk.x}
            y={chunk.y}
            rot={chunk.rot}
            path={chunk.path}
          />
        ))}
      </div>

      {/* LAYER 3: Interactive card */}
      <div
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        className={cn(
          "relative z-10 bg-[#0a0a0a] border border-[rgba(0,255,0,0.2)] rounded-md p-5 cursor-grab active:cursor-grabbing select-none h-full flex flex-col justify-between overflow-hidden transition-[background-color,border-color,box-shadow]",
          !isDragging && !isBroken &&
            "hover:border-[#00ff00] hover:shadow-[0_0_12px_rgba(0,255,0,0.25)] hover:animate-[hover-wiggle_0.8s_ease-in-out_infinite]",
          isBroken && "pointer-events-none",
          isFlashing && "bg-[rgba(0,255,0,0.08)]"
        )}
        style={{
          transform: isBroken
            ? fallTransform
            : `translate(${position.x}px, ${position.y}px) rotate(${
                position.x * 0.15
              }deg)`,
          transition: isDragging
            ? "none"
            : isBroken
              ? "transform 1.0s cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity 1.0s ease-out"
              : "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
          opacity: isBroken ? 0 : 1,
          maskImage:
            debrisChunks.length > 0 ? `url(#mask-${cardId})` : "none",
          WebkitMaskImage:
            debrisChunks.length > 0 ? `url(#mask-${cardId})` : "none",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      >
        <div className="flex-1 min-h-0">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-mono text-base font-bold uppercase tracking-wider text-white leading-tight break-words pr-2">
              <span className="text-[#00ff00]">▸ </span>
              {title}
            </h3>
            <div
              className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
              style={{
                background: "#00ff00",
                boxShadow: "0 0 8px rgba(0,255,0,0.6)",
              }}
            />
          </div>
          {/* Body */}
          {description && (
            <div className="text-[#94a3b8] text-[13px] leading-snug">
              {description}
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="mt-4 pt-2 border-t border-[rgba(0,255,0,0.15)] flex justify-between text-[10px] font-mono uppercase tracking-wider text-[#64748b]">
          <span>Fig. {figNum.toString().padStart(2, "0")}</span>
          <span
            className={cn(
              crackLevel > 0.7 && "text-red-500 font-bold animate-pulse"
            )}
          >
            {crackLevel > 0
              ? `${Math.round(crackLevel * 100)}% dmg`
              : "intact"}
          </span>
        </div>
        {/* Overlays */}
        <CrackLines level={crackLevel} />
        {crackLevel > 0.2 && (
          <div
            className="absolute inset-0 bg-red-500 mix-blend-screen pointer-events-none"
            style={{ opacity: crackLevel * 0.12 }}
          />
        )}
      </div>

      {/* LAYER 4: SVG mask definitions for the punched-out holes */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <mask
            id={`mask-${cardId}`}
            maskUnits="objectBoundingBox"
            maskContentUnits="objectBoundingBox"
          >
            <rect x="0" y="0" width="1" height="1" fill="white" />
            {debrisChunks.map((chunk) => (
              <g
                key={`hole-${chunk.id}`}
                transform={`translate(${chunk.x / 100}, ${
                  chunk.y / 100
                }) rotate(${chunk.rot}) scale(0.003)`}
              >
                <path d={chunk.path} fill="black" />
              </g>
            ))}
          </mask>
        </defs>
      </svg>
    </div>
  )
}

export const Component = BreakableCard
export default BreakableCard

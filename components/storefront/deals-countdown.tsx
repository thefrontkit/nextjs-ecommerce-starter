"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { Product } from "@/types"
import { ProductCard } from "@/components/storefront/product-card"

interface DealsCountdownProps {
  products: Product[]
}

/** Returns milliseconds until midnight UTC. */
function msUntilMidnightUTC(): number {
  const now = new Date()
  const midnight = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0,
  ))
  return midnight.getTime() - now.getTime()
}

/** Formats milliseconds as HH:MM:SS. Returns null when expired. */
function formatCountdown(ms: number): string | null {
  if (ms <= 0) return null
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function DealsCountdown({ products }: DealsCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(() =>
    formatCountdown(msUntilMidnightUTC()),
  )
  const sectionRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const tick = useCallback(() => {
    const remaining = msUntilMidnightUTC()
    setTimeLeft(formatCountdown(remaining))
    if (remaining <= 0 && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Start ticking when visible
          tick()
          if (!intervalRef.current) {
            intervalRef.current = setInterval(tick, 1000)
          }
        } else {
          // Stop ticking when not visible
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        }
      },
      { threshold: 0 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [tick])

  return (
    <div ref={sectionRef}>
      <div className="mb-4 flex items-center gap-3">
        {timeLeft !== null ? (
          <span
            className="rounded-sm bg-destructive px-2 py-1 text-xs font-bold uppercase tracking-wider text-white"
            suppressHydrationWarning
          >
            Ends in {timeLeft}
          </span>
        ) : (
          <span className="rounded-sm bg-muted px-2 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Deal ended
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

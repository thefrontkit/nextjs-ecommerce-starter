"use client"

import { createContext, useContext, useState, useCallback } from "react"
import type { Product } from "@/types"

interface RecentlyViewedContextValue {
  items: Product[]
  trackView: (product: Product) => void
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue>({
  items: [],
  trackView: () => {},
})

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([])

  const trackView = useCallback((product: Product) => {
    setItems((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id)
      return [product, ...filtered].slice(0, 8)
    })
  }, [])

  return (
    <RecentlyViewedContext value={{ items, trackView }}>
      {children}
    </RecentlyViewedContext>
  )
}

export function useRecentlyViewed() {
  return useContext(RecentlyViewedContext)
}

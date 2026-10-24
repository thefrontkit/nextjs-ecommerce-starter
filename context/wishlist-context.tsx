"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Product, WishlistItem } from "@/types"
import { wishlistItems as seedWishlistItems } from "@/data/seed"

interface WishlistContextValue {
  items: WishlistItem[]
  count: number
  isInWishlist: (productId: string) => boolean
  toggle: (product: Product) => void
  remove: (productId: string) => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(seedWishlistItems)

  const count = items.length

  const isInWishlist = useCallback(
    (productId: string) => items.some((i) => i.product.id === productId),
    [items]
  )

  const toggle = useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.product.id === product.id)
      if (exists) {
        return prev.filter((i) => i.product.id !== product.id)
      }
      return [
        ...prev,
        { product, addedAt: new Date().toISOString() },
      ]
    })
  }, [])

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
  }, [])

  return (
    <WishlistContext.Provider value={{ items, count, isInWishlist, toggle, remove }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}

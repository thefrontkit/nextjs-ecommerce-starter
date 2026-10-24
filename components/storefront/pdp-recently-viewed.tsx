"use client"

import { useEffect } from "react"
import { useRecentlyViewed } from "@/context/recently-viewed-context"
import { ProductCard } from "@/components/storefront/product-card"
import type { Product } from "@/types"

interface PdpRecentlyViewedProps {
  product: Product
}

export function PdpRecentlyViewed({ product }: PdpRecentlyViewedProps) {
  const { items, trackView } = useRecentlyViewed()

  useEffect(() => {
    trackView(product)
  }, [product, trackView])

  const recentItems = items.filter((p) => p.id !== product.id)

  if (recentItems.length === 0) return null

  return (
    <div className="mt-12 sm:mt-16">
      <h2 className="mb-6 text-xl font-bold text-foreground sm:text-2xl">Recently Viewed</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin sm:gap-4">
        {recentItems.map((p) => (
          <div key={p.id} className="w-44 shrink-0 sm:w-52">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  )
}

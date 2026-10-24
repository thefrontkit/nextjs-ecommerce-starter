"use client"

import { useRecentlyViewed } from "@/context/recently-viewed-context"
import { ProductCard } from "@/components/storefront/product-card"

export function RecentlyViewed() {
  const { items } = useRecentlyViewed()

  if (items.length === 0) return null

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h2 className="mb-6 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        Recently Viewed
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin sm:gap-4">
        {items.map((product) => (
          <div key={product.id} className="w-44 shrink-0 sm:w-52">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}

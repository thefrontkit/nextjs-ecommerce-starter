import Link from "next/link"
import { products } from "@/data/seed"

const ugcEntries = [
  { imageId: "1509631179647-0177331693ae", productId: "prod-001", alt: "Customer wearing a relaxed linen shirt outdoors" },
  { imageId: "1483985988355-763728e1935b", productId: "prod-011", alt: "Customer styled in a silk wrap dress" },
  { imageId: "1515886657613-9f3515b0c78f", productId: "prod-022", alt: "Customer posing in classic leather court sneakers" },
  { imageId: "1490481651871-ab68de25d43d", productId: "prod-031", alt: "Customer carrying a structured leather tote" },
  { imageId: "1469334031218-e382a71b716b", productId: "prod-013", alt: "Customer wearing a pleated midi skirt" },
  { imageId: "1441984904996-e0b6ba687e04", productId: "prod-004", alt: "Customer in a heavyweight hoodie" },
]

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`
}

export function UGCGrid() {
  return (
    <div>
      <p className="mb-6 text-sm text-muted-foreground">
        Real customers, real style. Tag us to be featured.
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {ugcEntries.map((entry) => {
          const product = products.find((p) => p.id === entry.productId)
          if (!product) return null

          const displayPrice = product.salePrice ?? product.price

          return (
            <Link
              key={entry.imageId}
              href={`/products/${product.slug}`}
              className="group relative block aspect-square overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <img
                src={`https://images.unsplash.com/photo-${entry.imageId}?w=400&h=400&fit=crop&auto=format`}
                alt={entry.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40 group-focus-visible:bg-black/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="text-[10px] font-medium uppercase tracking-wider text-white/70">
                  {product.brand}
                </span>
                <span className="mt-0.5 text-xs font-medium text-white">
                  {product.name}
                </span>
                <span className="mt-1 text-xs font-semibold text-white">
                  {formatPrice(displayPrice)}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

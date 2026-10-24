"use client"

import Link from "next/link"
import { useState } from "react"
import type { Product } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Heart, ShoppingCart, Star, StarHalf, Eye, GitCompareArrows } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { QuickViewDialog } from "@/components/storefront/quick-view-dialog"

interface ProductCardProps {
  product: Product
  view?: "grid" | "list"
  showCompare?: boolean
  isCompareSelected?: boolean
  onCompareToggle?: (productId: string) => void
  onQuickAdd?: (product: Product) => void
  onWishlistToggle?: (product: Product) => void
}

function StockStatus({ stock }: { stock: number }) {
  if (stock === 0) return <span className="text-xs font-medium text-destructive">Out of Stock</span>
  if (stock <= 15) return <span className="text-xs font-medium text-chart-4">Only {stock} left</span>
  return null
}

export function formatReviewCount(count: number): string {
  if (count >= 1000) {
    const k = count / 1000
    return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`
  }
  return count.toString()
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: fullStars }, (_, i) => (
          <Star key={`full-${i}`} className="size-3 fill-warning text-warning" />
        ))}
        {hasHalf && <StarHalf key="half" className="size-3 fill-warning text-warning" />}
        {Array.from({ length: emptyStars }, (_, i) => (
          <Star key={`empty-${i}`} className="size-3 fill-muted text-muted" />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">({formatReviewCount(count)})</span>
    </div>
  )
}

function isNewArrival(createdAt: string): boolean {
  const created = new Date(createdAt)
  const now = new Date()
  const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays <= 30
}

function getPriceRange(product: Product): { min: number; max: number } | null {
  if (!product.variants?.length) return null
  const adjustments = product.variants.map((v) => v.priceAdjustment)
  const minAdj = Math.min(...adjustments)
  const maxAdj = Math.max(...adjustments)
  if (minAdj === maxAdj) return null
  const base = product.salePrice ?? product.price
  return { min: base + minAdj, max: base + maxAdj }
}

function PriceDisplay({ product }: { product: Product }) {
  const range = getPriceRange(product)
  const pct = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0

  if (range) {
    return (
      <div className="flex flex-wrap items-baseline gap-1.5">
        <span className="text-sm font-bold text-foreground">${range.min.toFixed(2)}–${range.max.toFixed(2)}</span>
        {product.salePrice && (
          <span className="text-xs text-muted-foreground line-through">${product.price.toFixed(2)}</span>
        )}
      </div>
    )
  }
  if (product.salePrice) {
    return (
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm font-bold text-foreground">${product.salePrice.toFixed(2)}</span>
        <span className="text-xs text-muted-foreground line-through">${product.price.toFixed(2)}</span>
        <span className="text-xs font-semibold text-chart-4">{pct}% OFF</span>
      </div>
    )
  }
  return <span className="text-sm font-bold text-foreground">${product.price.toFixed(2)}</span>
}

/* ------------------------------------------------------------------ */
/* P1-3: Colour variant swatches                                       */
/* ------------------------------------------------------------------ */
function ColorSwatches({
  product,
  selectedIdx,
  onSelect,
}: {
  product: Product
  selectedIdx: number
  onSelect: (idx: number) => void
}) {
  const colorVariants = product.variants.filter((v) => v.type === "color")
  if (colorVariants.length <= 1) return null

  return (
    <div
      className="flex gap-1.5 p-0.5"
      role="listbox"
      aria-label="Colour options"
    >
      {colorVariants.map((v, idx) => (
        <button
          key={v.id}
          role="option"
          aria-selected={idx === selectedIdx}
          aria-label={v.name}
          className={cn(
            "size-4 shrink-0 rounded-full ring-1 ring-border transition-shadow",
            idx === selectedIdx && "ring-2 ring-foreground ring-offset-2 ring-offset-background"
          )}
          style={{ backgroundColor: v.value }}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSelect(idx) }}
          onMouseEnter={() => onSelect(idx)}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* P1-4: Size availability on card hover                               */
/* ------------------------------------------------------------------ */
function DescriptorWithSizes({
  product,
}: {
  product: Product
}) {
  const sizeVariants = product.variants.filter((v) => v.type === "size")
  const hasSizes = sizeVariants.length > 0

  if (!hasSizes) {
    // No size dimension — always show product name
    return (
      <h3 className="line-clamp-1 text-[13px] text-muted-foreground">
        {product.name}
      </h3>
    )
  }

  const inStockSizes = sizeVariants.filter((v) => v.stock > 0)
  const allOutOfStock = inStockSizes.length === 0
  const sizeLine = allOutOfStock
    ? "Out of stock"
    : `Sizes: ${inStockSizes.map((v) => v.name).join(", ")}`

  return (
    <div className="relative h-[1.25rem] overflow-hidden">
      {/* Default: product name */}
      <h3 className="absolute inset-0 line-clamp-1 text-[13px] text-muted-foreground transition-opacity duration-200 lg:group-hover:opacity-0">
        {product.name}
      </h3>
      {/* Hover: sizes (lg+ only) */}
      <p
        className={cn(
          "absolute inset-0 line-clamp-1 text-[13px] transition-opacity duration-200 opacity-0 lg:group-hover:opacity-100",
          allOutOfStock ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {sizeLine}
      </p>
    </div>
  )
}

export function ProductCard({
  product,
  view = "grid",
  showCompare = false,
  isCompareSelected = false,
  onCompareToggle,
  onQuickAdd,
  onWishlistToggle,
}: ProductCardProps) {
  const { addItem } = useCart()
  const { isInWishlist, toggle: toggleWishlist } = useWishlist()
  const wishActive = isInWishlist(product.id)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)

  // P1-3: derive colour-specific link query param
  const colorVariants = product.variants.filter((v) => v.type === "color")
  const selectedColorName = colorVariants.length > 1 ? colorVariants[selectedColorIdx]?.name : undefined
  const productHref = selectedColorName
    ? `/products/${product.slug}?colour=${encodeURIComponent(selectedColorName)}`
    : `/products/${product.slug}`

  if (view === "list") {
    return (
      <Card className="group transition-colors hover:bg-accent/30">
        <CardContent className="flex gap-4 p-4">
          {/* P2-8: list view — aspect-[3/4] with w-24/w-32 instead of square */}
          <Link
            href={productHref}
            className="relative block w-24 shrink-0 overflow-hidden rounded-md bg-muted sm:w-32 aspect-[3/4]"
          >
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            {product.salePrice && (
              <span className="absolute left-1.5 top-1.5 rounded-sm bg-destructive px-1.5 py-0.5 text-[10px] font-semibold text-white">Sale</span>
            )}
          </Link>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-start justify-between gap-2">
              <Link href={productHref}>
                <p className="text-sm font-bold text-foreground">{product.brand}</p>
                <h3 className="text-[13px] text-muted-foreground transition-colors hover:text-primary">
                  {product.name}
                </h3>
              </Link>
              <button
                className="shrink-0 p-1"
                aria-label="Add to wishlist"
                onClick={() => { toggleWishlist(product); onWishlistToggle?.(product); toast.success(wishActive ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`) }}
              >
                <Heart className={cn("size-4 text-muted-foreground hover:text-foreground transition-colors", wishActive && "fill-primary text-primary")} />
              </button>
            </div>
            <StarRating rating={product.rating} count={product.reviewCount} />
            <div className="mt-auto flex items-center gap-2">
              <PriceDisplay product={product} />
              <span className="ml-auto"><StockStatus stock={product.stock} /></span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const secondImage = product.images?.[1]
  const hasSale = !!product.salePrice
  const isNew = product.stock > 0 && isNewArrival(product.createdAt) && !hasSale

  return (
    <div className="group h-full">
      <div className="h-full flex flex-col">
        {/* Image */}
        <Link href={productHref} className="relative block aspect-[3/4] overflow-hidden rounded-md bg-muted">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
              secondImage && "group-hover:opacity-0"
            )}
          />
          {secondImage && (
            <img
              src={secondImage}
              alt={`${product.name} alternate view`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          {/* Single badge */}
          {hasSale && (
            <span className="absolute left-2 top-2 z-10 rounded-sm bg-destructive px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Sale
            </span>
          )}
          {!hasSale && product.stock === 0 && (
            <span className="absolute left-2 top-2 z-10 rounded-sm bg-foreground/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-background">
              Sold Out
            </span>
          )}
          {isNew && (
            <span className="absolute left-2 top-2 z-10 rounded-sm bg-foreground px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-background">
              New
            </span>
          )}

          {/* Rating chip — bottom-left of image */}
          <span className="absolute bottom-2 left-2 z-10 flex items-center gap-1 rounded-sm bg-black/70 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-white">
            {product.rating} <Star className="size-2.5 fill-white" /> | {formatReviewCount(product.reviewCount)}
          </span>

          {/* Wishlist */}
          <button
            className={cn(
              "absolute right-2 top-2 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-opacity",
              wishActive ? "opacity-100" : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
            )}
            aria-label={wishActive ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); onWishlistToggle?.(product); toast.success(wishActive ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`) }}
          >
            <Heart className={cn("size-4", wishActive ? "fill-destructive text-destructive" : "text-foreground/60")} />
          </button>

          {/* Quick View */}
          <button
            className="absolute right-2 top-12 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100"
            aria-label={`Quick view ${product.name}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickViewOpen(true) }}
          >
            <Eye className="size-4 text-foreground/60" />
          </button>

          {/* Compare icon — hover only, below quick view */}
          {showCompare && (
            <button
              className={cn(
                "absolute right-2 top-[5.5rem] z-10 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-opacity",
                isCompareSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
              aria-label={isCompareSelected ? `Remove ${product.name} from compare` : `Compare ${product.name}`}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCompareToggle?.(product.id) }}
            >
              <GitCompareArrows className={cn("size-4", isCompareSelected ? "text-primary" : "text-foreground/60")} />
            </button>
          )}

          {/* Add to bag */}
          {product.stock > 0 && (
            <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full p-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
              <button
                className="flex w-full items-center justify-center gap-2 bg-foreground py-2.5 text-xs font-semibold uppercase tracking-wider text-background transition-opacity hover:opacity-90"
                aria-label={`Add ${product.name} to bag`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product); onQuickAdd?.(product); toast.success(`${product.name} added to cart`) }}
              >
                Add to Bag
              </button>
            </div>
          )}
        </Link>

        {/* Info — brand bold, name/sizes swap, price, colour swatches */}
        <div className="flex flex-col gap-1 pt-2.5">
          <Link href={productHref}>
            <p className="text-sm font-bold text-foreground">{product.brand}</p>
            {/* P1-4: size availability on hover (lg+) */}
            <DescriptorWithSizes product={product} />
          </Link>
          <PriceDisplay product={product} />
          {/* P1-3: colour swatches below price */}
          <ColorSwatches
            product={product}
            selectedIdx={selectedColorIdx}
            onSelect={setSelectedColorIdx}
          />
        </div>
      </div>
      <QuickViewDialog product={product} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
    </div>
  )
}

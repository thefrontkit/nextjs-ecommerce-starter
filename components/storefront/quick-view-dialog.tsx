"use client"

import Link from "next/link"
import { useState } from "react"
import type { Product } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star, StarHalf, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"
import { formatReviewCount } from "@/components/storefront/product-card"

interface QuickViewDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickViewDialog({ product, open, onOpenChange }: QuickViewDialogProps) {
  const { addItem } = useCart()
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const colorVariants = product.variants.filter((v) => v.type === "color")
  const sizeVariants = product.variants.filter((v) => v.type === "size")
  const fullStars = Math.floor(product.rating)
  const hasHalf = product.rating - fullStars >= 0.25 && product.rating - fullStars < 0.75

  function handleAddToCart() {
    addItem(product)
    toast.success(`${product.name} added to cart`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" showCloseButton={true}>
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="flex items-center">
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-bold text-foreground">
              {product.brand}
            </p>
            <h2 className="font-heading text-lg font-bold text-foreground">
              {product.name}
            </h2>

            <div className="flex items-center gap-2">
              <span className="rounded-sm bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                {product.rating} ★ | {formatReviewCount(product.reviewCount)}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              {product.salePrice ? (
                <>
                  <span className="text-xl font-bold text-foreground">${product.salePrice.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-xl font-bold text-foreground">${product.price.toFixed(2)}</span>
              )}
            </div>

            <p className="line-clamp-3 text-sm text-muted-foreground">
              {product.description}
            </p>

            {colorVariants.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground">Color</span>
                <div className="flex gap-1.5">
                  {colorVariants.map((v) => (
                    <button
                      key={v.id}
                      className={`size-7 rounded-full border-2 transition-colors ${selectedColor === v.id ? "border-primary" : "border-transparent"}`}
                      style={{ backgroundColor: v.value }}
                      onClick={() => setSelectedColor(v.id)}
                      aria-label={v.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {sizeVariants.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground">Size</span>
                <div className="flex flex-wrap gap-1.5">
                  {sizeVariants.map((v) => (
                    <button
                      key={v.id}
                      className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                        selectedSize === v.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-foreground hover:border-primary"
                      } ${v.stock === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                      onClick={() => v.stock > 0 && setSelectedSize(v.id)}
                      disabled={v.stock === 0}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-col gap-2 pt-2">
              <Button
                className="w-full"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 size-4" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Link
                href={`/products/${product.slug}`}
                className="text-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => onOpenChange(false)}
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

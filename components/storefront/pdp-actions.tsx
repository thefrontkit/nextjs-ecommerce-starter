"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ShoppingCart, Heart } from "lucide-react"
import { QuantitySelector } from "@/components/storefront/quantity-selector"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import type { Product } from "@/types"

interface PdpActionsProps {
  product: Product
  selectedSizeLabel?: string | null
  sizeSelectorId?: string
}

export function PdpActions({ product, selectedSizeLabel, sizeSelectorId }: PdpActionsProps) {
  const { addItem } = useCart()
  const { isInWishlist, toggle: toggleWishlist } = useWishlist()
  const wishActive = isInWishlist(product.id)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  function handleAddToCart() {
    addItem(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  function handleWishlistToggle() {
    toggleWishlist(product)
  }

  return (
    <div className="flex items-center gap-3">
      <QuantitySelector min={1} max={product.stock} defaultValue={1} onChange={setQuantity} />
      <Button size="lg" className="flex-[3] rounded-full" disabled={product.stock === 0} onClick={handleAddToCart}>
        {addedToCart ? (
          <>
            <svg className="mr-2 size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 size-5" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </>
        )}
      </Button>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 size-11"
              aria-label={wishActive ? "Remove from wishlist" : "Add to wishlist"}
              onClick={handleWishlistToggle}
            >
              <Heart className={cn("size-5", wishActive && "fill-primary text-primary")} />
            </Button>
          }
        />
        <TooltipContent>{wishActive ? "Remove from wishlist" : "Add to wishlist"}</TooltipContent>
      </Tooltip>
    </div>
  )
}

interface MobileStickyCartProps {
  product: Product
  visible: boolean
  selectedSizeLabel?: string | null
  sizeSelectorId?: string
}

export function MobileStickyCart({ product, visible, selectedSizeLabel, sizeSelectorId }: MobileStickyCartProps) {
  const { addItem } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = useCallback(() => {
    // If product has sizes but none selected, scroll to the size selector
    const hasSizes = product.variants.some((v) => v.type === "size")
    if (hasSizes && !selectedSizeLabel && sizeSelectorId) {
      const el = document.getElementById(sizeSelectorId)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    addItem(product)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }, [product, selectedSizeLabel, sizeSelectorId, addItem])

  if (!visible || product.stock === 0) return null

  const displayPrice = product.salePrice ?? product.price

  // Build label text: "Size M . $168.00" or just "$168.00"
  const priceText = `$${displayPrice.toFixed(2)}`

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur p-3 md:hidden transition-transform duration-300">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <div className="flex flex-col min-w-0">
          {selectedSizeLabel ? (
            <span className="text-sm text-muted-foreground truncate">
              Size {selectedSizeLabel}
            </span>
          ) : null}
          {product.salePrice ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">{priceText}</span>
              <span className="text-xs text-muted-foreground line-through">${product.price.toFixed(2)}</span>
            </div>
          ) : (
            <span className="text-lg font-bold text-foreground">{priceText}</span>
          )}
        </div>
        <Button size="lg" className="flex-1 rounded-full" onClick={handleAddToCart}>
          {addedToCart ? (
            <>
              <svg className="mr-2 size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Added
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 size-4" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

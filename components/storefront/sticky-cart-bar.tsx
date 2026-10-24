"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"
import type { Product } from "@/types"

interface StickyCartBarProps {
  product: Product
  targetRef: React.RefObject<HTMLDivElement | null>
}

export function StickyCartBar({ product, targetRef }: StickyCartBarProps) {
  const [visible, setVisible] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [targetRef])

  if (!visible || product.stock === 0) return null

  const displayPrice = product.salePrice ?? product.price

  function handleAddToCart() {
    addItem(product)
    toast.success(`${product.name} added to cart`)
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50 hidden border-b border-border bg-background/95 backdrop-blur shadow-sm md:block animate-fade-in">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">{product.name}</span>
          <span className="text-sm font-bold text-foreground">${displayPrice.toFixed(2)}</span>
          {product.salePrice && (
            <span className="text-xs text-muted-foreground line-through">${product.price.toFixed(2)}</span>
          )}
        </div>
        <Button size="sm" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 size-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { CartLineItem } from "@/components/storefront/cart-line-item"
import { OrderSummary } from "@/components/storefront/order-summary"
import { ProductCard } from "@/components/storefront/product-card"
import { ShoppingCart, ShoppingBag, Tag, Check, AlertCircle, Bookmark, Truck } from "lucide-react"
import { savedForLaterItems as initialSaved, products, getEstimatedDelivery } from "@/data/seed"
import type { CartItem } from "@/types"
import { useCart } from "@/context/cart-context"

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity, addItem } = useCart()
  const [savedItems, setSavedItems] = useState<CartItem[]>(initialSaved)
  const [promoCode, setPromoCode] = useState("")
  const [promoStatus, setPromoStatus] = useState<"idle" | "success" | "error">("idle")
  const [discount, setDiscount] = useState(0)

  // Dynamic recommendations: products in same category as cart items, excluding cart items
  const cartProductIds = new Set(items.map((i) => i.product.id))
  const cartCategories = [...new Set(items.map((i) => i.product.category))]
  const dynamicRecommendations = products
    .filter((p) => p.status === "active" && !cartProductIds.has(p.id) && cartCategories.includes(p.category))
    .slice(0, 4)

  // For empty cart, show trending products
  const trendingProducts = products
    .filter((p) => p.status === "active")
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 4)

  const shipping = subtotal >= 100 ? 0 : 5.99
  const tax = (subtotal - discount) * 0.08
  const total = subtotal + shipping + tax - discount

  function handleQuantityChange(id: string, quantity: number) {
    updateQuantity(id, quantity)
  }

  function handleRemove(id: string) {
    removeItem(id)
  }

  function handleSaveForLater(id: string) {
    const item = items.find((i) => i.id === id)
    if (item) {
      setSavedItems((prev) => [...prev, { ...item, id: `saved-${Date.now()}` }])
      removeItem(id)
    }
  }

  function handleMoveToCart(id: string) {
    const item = savedItems.find((i) => i.id === id)
    if (item) {
      addItem(item.product, item.quantity)
      setSavedItems((prev) => prev.filter((i) => i.id !== id))
    }
  }

  function handleApplyPromo() {
    const code = promoCode.trim().toUpperCase()
    if (code === "WELCOME10") {
      setDiscount(subtotal * 0.1)
      setPromoStatus("success")
    } else if (code === "VIP20") {
      setDiscount(subtotal * 0.2)
      setPromoStatus("success")
    } else {
      setDiscount(0)
      setPromoStatus("error")
    }
  }

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8 animate-fade-in">
        <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="size-10 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-foreground md:text-4xl">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Looks like you haven&apos;t added any items yet. Browse our collection to find something you&apos;ll love.
        </p>
        <Button className="mt-6 rounded-full" size="lg" render={<Link href="/products" />}>
          Continue Shopping
        </Button>

        {/* Recommended products even on empty cart */}
        <div className="mt-16 text-left">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Popular Products</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">Shopping Cart</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          {items.length > 0 ? (
            <div className="divide-y divide-border">
              {items.map((item) => (
                <CartLineItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                  onSaveForLater={handleSaveForLater}
                />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">No items in cart.</p>
          )}

          <Separator className="my-4" />
          <div className="flex justify-between">
            <Button variant="outline" render={<Link href="/products" />}>
              Continue Shopping
            </Button>
          </div>

          {/* Saved for later */}
          {savedItems.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Bookmark className="size-5 text-muted-foreground" />
                Saved for Later ({savedItems.length})
              </h2>
              <div className="divide-y divide-border rounded-xl border border-border bg-card">
                {savedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4">
                    <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                      <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-foreground">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">${(item.product.salePrice ?? item.product.price).toFixed(2)}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleMoveToCart(item.id)}>
                      Move to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* You might also like */}
          {dynamicRecommendations.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-4 text-lg font-semibold text-foreground">You Might Also Like</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {dynamicRecommendations.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 lg:sticky lg:top-24 lg:self-start">
          {/* Promo code input */}
          <div className="mb-4 rounded-xl border border-border bg-card p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Tag className="size-4" />
              Promo Code
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => { setPromoCode(e.target.value); setPromoStatus("idle") }}
                className="h-9"
              />
              <Button variant="outline" size="sm" onClick={handleApplyPromo} disabled={!promoCode.trim()}>
                Apply
              </Button>
            </div>
            {promoStatus === "success" && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-chart-3">
                <Check className="size-3.5" />
                Code applied! You saved ${discount.toFixed(2)}
              </div>
            )}
            {promoStatus === "error" && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                <AlertCircle className="size-3.5" />
                Invalid promo code
              </div>
            )}
          </div>

          {/* Free shipping progress */}
          <div className="mb-4 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="size-4 text-muted-foreground" />
              {subtotal >= 100 ? (
                <span className="font-medium text-chart-3">You qualify for free shipping!</span>
              ) : (
                <span className="text-muted-foreground">
                  Add <span className="font-semibold text-foreground">${(100 - subtotal).toFixed(2)}</span> more for free shipping
                </span>
              )}
            </div>
            <Progress value={Math.min((subtotal / 100) * 100, 100)} className="mt-2 h-1.5" />
          </div>

          <OrderSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total} discount={discount} />

          {/* Estimated delivery */}
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="size-4 shrink-0" />
            <span>Estimated delivery: {getEstimatedDelivery()}</span>
          </div>

          <Button className="mt-4 w-full rounded-full" size="lg" render={<a href="https://thefrontkit.com/apps/ecommerce-kit?utm_source=github&utm_medium=storefront-lite&utm_campaign=cart-checkout" />}>
            Proceed to Checkout
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Checkout, customer accounts and the admin panel are in the{" "}
            <a href="https://thefrontkit.com/apps/ecommerce-kit?utm_source=github&utm_medium=storefront-lite&utm_campaign=cart-note" className="underline underline-offset-2 hover:text-foreground">
              full E-commerce Kit
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

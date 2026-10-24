"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/context/cart-context"

interface MiniCartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MiniCartDrawer({ open, onOpenChange }: MiniCartDrawerProps) {
  const { items, subtotal, removeItem, updateQuantity } = useCart()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-4 py-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-primary" />
            Your Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="size-8 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Add items to get started</p>
            <Button variant="outline" onClick={() => onOpenChange(false)} render={<Link href="/products" />}>
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-4">
              <div className="flex flex-col gap-4 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-border">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/products/${item.product.slug}`} className="text-sm font-medium text-foreground hover:underline line-clamp-2" onClick={() => onOpenChange(false)}>
                          {item.product.name}
                        </Link>
                        <button onClick={() => removeItem(item.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors" aria-label={`Remove ${item.product.name}`}>
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      {item.selectedVariants.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {item.selectedVariants.map((v) => v.value).join(" / ")}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1 rounded-lg border border-border">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          ${((item.product.salePrice ?? item.product.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Button className="w-full" onClick={() => onOpenChange(false)} render={<a href="https://thefrontkit.com/apps/ecommerce-kit?utm_source=github&utm_medium=storefront-lite&utm_campaign=mini-cart" />}>
                  Checkout (full kit)
                </Button>
                <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)} render={<Link href="/cart" />}>
                  View Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

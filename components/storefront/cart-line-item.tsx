"use client"

import type { CartItem } from "@/types"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { QuantitySelector } from "@/components/storefront/quantity-selector"
import { Trash2, Bookmark } from "lucide-react"

interface CartLineItemProps {
  item: CartItem
  onQuantityChange?: (id: string, quantity: number) => void
  onRemove?: (id: string) => void
  onSaveForLater?: (id: string) => void
}

export function CartLineItem({ item, onQuantityChange, onRemove, onSaveForLater }: CartLineItemProps) {
  const unitPrice = item.product.salePrice ?? item.product.price
  const lineTotal = unitPrice * item.quantity

  return (
    <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-24">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-foreground">{item.product.name}</h3>
          {item.selectedVariants.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {item.selectedVariants.map((v) => `${v.type}: ${v.value}`).join(" / ")}
            </p>
          )}
          <p className="text-sm text-muted-foreground">${unitPrice.toFixed(2)} each</p>
          <div className="flex items-center gap-3 mt-1">
            {onSaveForLater && (
              <button
                onClick={() => onSaveForLater(item.id)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Bookmark className="size-3" />
                Save for Later
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <QuantitySelector
            min={1}
            max={item.product.stock}
            defaultValue={item.quantity}
            onChange={(qty) => onQuantityChange?.(item.id, qty)}
          />
          <span className="min-w-16 text-right font-semibold text-foreground">
            ${lineTotal.toFixed(2)}
          </span>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove?.(item.id)}
                  aria-label={`Remove ${item.product.name} from cart`}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              }
            />
            <TooltipContent>Remove</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

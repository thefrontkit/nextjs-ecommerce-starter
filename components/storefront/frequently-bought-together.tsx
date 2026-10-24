"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"
import type { Product } from "@/types"

interface FrequentlyBoughtTogetherProps {
  mainProduct: Product
  companions: Product[]
}

export function FrequentlyBoughtTogether({ mainProduct, companions }: FrequentlyBoughtTogetherProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(companions.map((p) => [p.id, true]))
  )
  const { addItem } = useCart()
  const selectedCompanions = companions.filter((p) => checked[p.id])
  const totalPrice =
    (mainProduct.salePrice ?? mainProduct.price) +
    selectedCompanions.reduce((sum, p) => sum + (p.salePrice ?? p.price), 0)

  function handleAddAll() {
    addItem(mainProduct)
    selectedCompanions.forEach((p) => addItem(p))
    toast.success("Added to cart", {
      description: `${1 + selectedCompanions.length} items added to your cart`,
    })
  }

  if (companions.length === 0) return null

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Frequently Bought Together</h3>
        <div className="flex flex-wrap items-center gap-3">
          {/* Main product */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative size-24 overflow-hidden rounded-lg border border-border">
              <Image src={mainProduct.image} alt={mainProduct.name} fill className="object-cover" sizes="96px" />
            </div>
            <span className="max-w-24 truncate text-xs font-medium text-foreground">{mainProduct.name}</span>
            <span className="text-xs text-muted-foreground">${(mainProduct.salePrice ?? mainProduct.price).toFixed(2)}</span>
          </div>

          {companions.map((companion) => (
            <div key={companion.id} className="flex items-center gap-3">
              <Plus className="size-4 text-muted-foreground shrink-0" />
              <div className="flex flex-col items-center gap-2">
                <div className="relative size-24 overflow-hidden rounded-lg border border-border">
                  <Image src={companion.image} alt={companion.name} fill className="object-cover" sizes="96px" />
                </div>
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    id={`companion-${companion.id}`}
                    checked={checked[companion.id]}
                    onCheckedChange={(v) =>
                      setChecked((prev) => ({ ...prev, [companion.id]: v === true }))
                    }
                  />
                  <label htmlFor={`companion-${companion.id}`} className="max-w-20 truncate text-xs font-medium text-foreground cursor-pointer">
                    {companion.name}
                  </label>
                </div>
                <span className="text-xs text-muted-foreground">${(companion.salePrice ?? companion.price).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div>
            <span className="text-sm text-muted-foreground">Total: </span>
            <span className="text-lg font-bold text-foreground">${totalPrice.toFixed(2)}</span>
          </div>
          <Button onClick={handleAddAll} disabled={selectedCompanions.length === 0}>
            <Check className="mr-2 size-4" />
            Add All to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

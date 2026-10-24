"use client"

import { useState } from "react"
import type { ProductVariant } from "@/types"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface VariantSelectorProps {
  variants: ProductVariant[]
  type: "size" | "color"
  onSelectionChange?: (id: string) => void
}

export function VariantSelector({ variants, type, onSelectionChange }: VariantSelectorProps) {
  const [selected, setSelected] = useState(variants[0]?.id ?? "")

  function handleSelect(id: string) {
    setSelected(id)
    onSelectionChange?.(id)
  }

  if (type === "color") {
    return (
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Color">
        {variants.map((variant) => (
          <Tooltip key={variant.id}>
            <TooltipTrigger
              onClick={() => handleSelect(variant.id)}
              className={cn(
                "size-10 rounded-full border-2 transition-all",
                selected === variant.id
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-muted-foreground"
              )}
              style={{ backgroundColor: variant.value }}
              aria-label={variant.name}
              role="radio"
              aria-checked={selected === variant.id}
            />
            <TooltipContent>
              {variant.name} ({variant.stock} in stock)
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
      {variants.map((variant) => (
        <button
          key={variant.id}
          onClick={() => handleSelect(variant.id)}
          className={cn(
            "min-h-10 min-w-10 rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
            selected === variant.id
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-border bg-background text-foreground hover:border-primary hover:text-primary",
            variant.stock === 0 && "opacity-40 line-through cursor-not-allowed"
          )}
          disabled={variant.stock === 0}
          role="radio"
          aria-checked={selected === variant.id}
          aria-label={`${variant.name}${variant.stock === 0 ? " (out of stock)" : ""}`}
        >
          {variant.value}
        </button>
      ))}
    </div>
  )
}

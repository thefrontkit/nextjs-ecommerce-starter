"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus } from "lucide-react"

interface QuantitySelectorProps {
  min?: number
  max?: number
  defaultValue?: number
  onChange?: (value: number) => void
}

export function QuantitySelector({
  min = 1,
  max = 99,
  defaultValue = 1,
  onChange,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(defaultValue)

  function updateQuantity(newValue: number) {
    const clamped = Math.min(Math.max(newValue, min), max)
    setQuantity(clamped)
    onChange?.(clamped)
  }

  return (
    <div className="flex items-center" role="group" aria-label="Quantity selector">
      <Button
        variant="outline"
        size="icon"
        onClick={() => updateQuantity(quantity - 1)}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className="rounded-r-none"
      >
        <Minus className="size-4" />
      </Button>
      <Input
        type="number"
        value={quantity}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10)
          if (!isNaN(val)) updateQuantity(val)
        }}
        min={min}
        max={max}
        className="h-8 w-14 rounded-none border-x-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label="Quantity"
      />
      <Button
        variant="outline"
        size="icon"
        onClick={() => updateQuantity(quantity + 1)}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className="rounded-l-none"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  )
}

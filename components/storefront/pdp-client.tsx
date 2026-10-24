"use client"

import { useState } from "react"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { VariantSelector } from "@/components/storefront/variant-selector"
import { SizeGuideDialog } from "@/components/storefront/size-guide-dialog"
import { PdpStickyWrapper } from "@/components/storefront/pdp-sticky-wrapper"
import { NotifyMeForm } from "@/components/storefront/notify-me-form"

import { MapPin, Truck, RotateCcw, Shield } from "lucide-react"
import { getEstimatedDelivery } from "@/data/seed"

interface PdpClientProps {
  product: Product
}

const SIZE_SELECTOR_ID = "pdp-size-selector"

export function PdpClient({ product }: PdpClientProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const colorVariants = product.variants.filter((v) => v.type === "color")
  const sizeVariants = product.variants.filter((v) => v.type === "size")

  const selectedColorVariant = colorVariants.find((v) => v.id === selectedColor)
  const selectedSizeVariant = sizeVariants.find((v) => v.id === selectedSize)

  // Calculate adjusted price based on selected variant
  const basePrice = product.salePrice ?? product.price
  const priceAdjustment = (selectedColorVariant?.priceAdjustment ?? 0) + (selectedSizeVariant?.priceAdjustment ?? 0)
  const displayPrice = basePrice + priceAdjustment

  const savings = product.salePrice ? product.price - product.salePrice : 0
  const savingsPct = product.salePrice ? Math.round((savings / product.price) * 100) : 0

  // Get the label for the selected size (e.g. "M", "L")
  const selectedSizeLabel = selectedSizeVariant?.value ?? null

  return (
    <div className="flex flex-col gap-4">
      {/* Price */}
      <div className="flex items-baseline gap-2">
        {product.salePrice ? (
          <>
            <span className="text-2xl font-bold text-foreground">${displayPrice.toFixed(2)}</span>
            <span className="text-base text-muted-foreground line-through">${product.price.toFixed(2)}</span>
            <span className="text-sm font-semibold text-chart-4">{savingsPct}% OFF</span>
          </>
        ) : (
          <span className="text-2xl font-bold text-foreground">${displayPrice.toFixed(2)}</span>
        )}
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

      <Separator />

      {/* Color with name label */}
      {colorVariants.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            Color{selectedColorVariant ? `: ${selectedColorVariant.name}` : ""}
          </span>
          <div className="flex gap-2">
            {colorVariants.map((v) => (
              <button
                key={v.id}
                className={`size-8 rounded-full border-2 transition-colors ${selectedColor === v.id ? "border-primary ring-2 ring-primary/20" : "border-border"}`}
                style={{ backgroundColor: v.value }}
                onClick={() => setSelectedColor(v.id)}
                aria-label={v.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      {sizeVariants.length > 0 && (
        <div className="flex flex-col gap-2" id={SIZE_SELECTOR_ID}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Size</span>
            <SizeGuideDialog />
          </div>
          <VariantSelector variants={sizeVariants} type="size" onSelectionChange={(id) => setSelectedSize(id)} />
        </div>
      )}

      {/* Low stock */}
      {product.stock > 0 && product.stock <= 15 && (
        <p className="text-sm font-medium text-chart-4">
          Only {product.stock} left in stock
        </p>
      )}

      {/* Add to Cart / Notify Me */}
      {product.stock > 0 ? (
        <PdpStickyWrapper
          product={product}
          selectedSizeLabel={selectedSizeLabel}
          sizeSelectorId={SIZE_SELECTOR_ID}
        />
      ) : (
        <NotifyMeForm productName={product.name} />
      )}

      {/* Delivery & returns */}
      <div className="flex flex-col gap-3 rounded-lg border border-border p-4 text-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <MapPin className="size-4 text-muted-foreground" />
          Delivery
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Enter ZIP code"
            className="h-9 max-w-36"
            aria-label="ZIP code for delivery estimate"
          />
          <Button variant="outline" size="sm">Check</Button>
        </div>
        <div className="flex flex-col gap-1.5 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Truck className="size-4 shrink-0" />
            <span>Estimated delivery: {getEstimatedDelivery()}</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="size-4 shrink-0" />
            <span>30-day easy returns</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="size-4 shrink-0" />
            <span>Secure payment</span>
          </div>
        </div>
      </div>

    </div>
  )
}

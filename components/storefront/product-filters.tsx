"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FilterState, FacetCounts } from "@/hooks/use-product-filters"

// ============================================================
// Types
// ============================================================

interface ProductFiltersProps {
  filters: FilterState
  facets: FacetCounts
  onToggleFilter: (key: "sizes" | "categories" | "brands" | "colours", value: string) => void
  onSetDiscount: (value: number | null) => void
  onSetRating: (value: number | null) => void
  onSetPriceRange: (range: [number, number] | null) => void
  onClearAll: () => void
  hasFilters: boolean
}

// ============================================================
// Collapsible facet section
// ============================================================

function FacetSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={(v) => setOpen(v)}>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-semibold uppercase tracking-wide text-foreground hover:text-foreground/80 transition-colors">
        {title}
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-4 pt-1">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// ============================================================
// Show more / less wrapper
// ============================================================

function ShowMoreList<T extends { value: string }>({
  items,
  initialCount,
  children,
}: {
  items: T[]
  initialCount: number
  children: (items: T[], showAll: boolean) => React.ReactNode
}) {
  const [showAll, setShowAll] = useState(false)
  const hasMore = items.length > initialCount
  const visible = showAll ? items : items.slice(0, initialCount)

  return (
    <div>
      {children(visible, showAll)}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-xs font-medium text-primary hover:underline"
        >
          {showAll ? "Show less" : `+ ${items.length - initialCount} more`}
        </button>
      )}
    </div>
  )
}

// ============================================================
// Size chip grid
// ============================================================

function SizeFacet({
  facets,
  selected,
  onToggle,
}: {
  facets: FacetCounts
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <ShowMoreList items={facets.sizes} initialCount={9}>
      {(visible) => (
        <div className="flex flex-wrap gap-2">
          {visible.map((opt) => {
            const isActive = selected.includes(opt.value)
            const isDisabled = opt.count === 0 && !isActive
            return (
              <button
                key={opt.value}
                onClick={() => !isDisabled && onToggle(opt.value)}
                disabled={isDisabled}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : isDisabled
                      ? "border-border bg-muted text-muted-foreground/50 cursor-not-allowed"
                      : "border-border bg-background text-foreground hover:border-primary hover:bg-primary/5"
                )}
                aria-pressed={isActive}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )}
    </ShowMoreList>
  )
}

// ============================================================
// Checkbox facet (category, brand)
// ============================================================

function CheckboxFacet({
  options,
  selected,
  onToggle,
  initialCount = 5,
}: {
  options: { value: string; label: string; count: number }[]
  selected: string[]
  onToggle: (value: string) => void
  initialCount?: number
}) {
  return (
    <ShowMoreList items={options} initialCount={initialCount}>
      {(visible) => (
        <div className="flex flex-col gap-2.5">
          {visible.map((opt) => {
            const isChecked = selected.some(
              (s) => s.toLowerCase() === opt.value.toLowerCase()
            )
            const isDisabled = opt.count === 0 && !isChecked
            return (
              <label
                key={opt.value}
                className={cn(
                  "flex items-center gap-2 cursor-pointer text-sm",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => !isDisabled && onToggle(opt.value)}
                  disabled={isDisabled}
                />
                <span className="flex-1 text-muted-foreground">{opt.label}</span>
                <span className="text-xs text-muted-foreground/70">({opt.count})</span>
              </label>
            )
          })}
        </div>
      )}
    </ShowMoreList>
  )
}

// ============================================================
// Colour checkbox facet with swatches
// ============================================================

function ColourFacet({
  options,
  selected,
  onToggle,
}: {
  options: { value: string; label: string; count: number; hex?: string }[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <ShowMoreList items={options} initialCount={6}>
      {(visible) => (
        <div className="flex flex-col gap-2.5">
          {visible.map((opt) => {
            const isChecked = selected.some(
              (s) => s.toLowerCase() === opt.value.toLowerCase()
            )
            const isDisabled = opt.count === 0 && !isChecked
            return (
              <label
                key={opt.value}
                className={cn(
                  "flex items-center gap-2 cursor-pointer text-sm",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => !isDisabled && onToggle(opt.value)}
                  disabled={isDisabled}
                />
                <span
                  className="size-4 shrink-0 rounded-full ring-1 ring-border"
                  style={{ backgroundColor: opt.hex ?? "#808080" }}
                  aria-hidden="true"
                />
                <span className="flex-1 text-muted-foreground">{opt.label}</span>
                <span className="text-xs text-muted-foreground/70">({opt.count})</span>
              </label>
            )
          })}
        </div>
      )}
    </ShowMoreList>
  )
}

// ============================================================
// Price range slider
// ============================================================

function PriceFacet({
  priceMin,
  priceMax,
  currentRange,
  onChange,
}: {
  priceMin: number
  priceMax: number
  currentRange: [number, number] | null
  onChange: (range: [number, number] | null) => void
}) {
  const lo = currentRange?.[0] ?? priceMin
  const hi = currentRange?.[1] ?? priceMax

  return (
    <div className="flex flex-col gap-3">
      <Slider
        min={priceMin}
        max={priceMax}
        value={[lo, hi]}
        onValueChange={(v) => {
          const arr = v as readonly number[]
          const next: [number, number] = [arr[0], arr[1]]
          if (next[0] === priceMin && next[1] === priceMax) {
            onChange(null)
          } else {
            onChange(next)
          }
        }}
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>${lo}</span>
        <span>${hi}</span>
      </div>
    </div>
  )
}

// ============================================================
// Radio facet (discount, rating)
// ============================================================

function RadioFacet({
  options,
  selected,
  onSelect,
}: {
  options: { value: string; label: string; count: number }[]
  selected: string | null
  onSelect: (value: string | null) => void
}) {
  return (
    <RadioGroup
      value={selected ?? ""}
      onValueChange={(v: string) => onSelect(v === selected ? null : v)}
    >
      <div className="flex flex-col gap-2.5">
        {options.map((opt) => {
          const isDisabled = opt.count === 0 && opt.value !== selected
          return (
            <label
              key={opt.value}
              className={cn(
                "flex items-center gap-2 cursor-pointer text-sm",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <RadioGroupItem
                value={opt.value}
                disabled={isDisabled}
                onClick={() => {
                  if (opt.value === selected) {
                    onSelect(null)
                  }
                }}
              />
              <span className="flex-1 text-muted-foreground">{opt.label}</span>
              <span className="text-xs text-muted-foreground/70">({opt.count})</span>
            </label>
          )
        })}
      </div>
    </RadioGroup>
  )
}

// ============================================================
// Main ProductFilters
// ============================================================

export function ProductFilters({
  filters,
  facets,
  onToggleFilter,
  onSetDiscount,
  onSetRating,
  onSetPriceRange,
  onClearAll,
  hasFilters,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
          Filters
        </h3>
        {hasFilters && (
          <button
            onClick={onClearAll}
            className="text-xs font-medium text-primary hover:underline"
          >
            CLEAR ALL
          </button>
        )}
      </div>

      <div className="flex flex-col divide-y divide-border">
        {/* 1. SIZE */}
        {facets.sizes.length > 0 && (
          <FacetSection title="Size" defaultOpen>
            <SizeFacet
              facets={facets}
              selected={filters.sizes}
              onToggle={(v) => onToggleFilter("sizes", v)}
            />
          </FacetSection>
        )}

        {/* 2. CATEGORY (subcategories) */}
        {facets.categories.length > 0 && (
          <FacetSection title="Category">
            <CheckboxFacet
              options={facets.categories}
              selected={filters.categories}
              onToggle={(v) => onToggleFilter("categories", v)}
            />
          </FacetSection>
        )}

        {/* 3. PRICE */}
        <FacetSection title="Price">
          <PriceFacet
            priceMin={facets.priceMin}
            priceMax={facets.priceMax}
            currentRange={filters.priceRange}
            onChange={onSetPriceRange}
          />
        </FacetSection>

        {/* 4. BRAND */}
        {facets.brands.length > 0 && (
          <FacetSection title="Brand">
            <CheckboxFacet
              options={facets.brands}
              selected={filters.brands}
              onToggle={(v) => onToggleFilter("brands", v)}
            />
          </FacetSection>
        )}

        {/* 5. COLOUR */}
        {facets.colours.length > 0 && (
          <FacetSection title="Colour">
            <ColourFacet
              options={facets.colours}
              selected={filters.colours}
              onToggle={(v) => onToggleFilter("colours", v)}
            />
          </FacetSection>
        )}

        {/* 6. DISCOUNT */}
        <FacetSection title="Discount">
          <RadioFacet
            options={facets.discounts}
            selected={filters.discount !== null ? String(filters.discount) : null}
            onSelect={(v) => onSetDiscount(v !== null ? Number(v) : null)}
          />
        </FacetSection>

        {/* 7. RATING */}
        <FacetSection title="Rating">
          <RadioFacet
            options={facets.ratings}
            selected={filters.rating !== null ? String(filters.rating) : null}
            onSelect={(v) => onSetRating(v !== null ? Number(v) : null)}
          />
        </FacetSection>
      </div>
    </div>
  )
}

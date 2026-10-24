"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ProductFilters } from "@/components/storefront/product-filters"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowUpDown, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Product } from "@/types"
import {
  type FilterState,
  emptyFilters,
  SORT_OPTIONS,
  applyFilters,
  computeFacets,
  buildChips,
} from "@/hooks/use-product-filters"

// ============================================================
// Sticky bottom bar (mobile only)
// ============================================================

interface MobileFilterBarProps {
  filterCount: number
  onSortOpen: () => void
  onFilterOpen: () => void
}

export function MobileFilterBar({
  filterCount,
  onSortOpen,
  onFilterOpen,
}: MobileFilterBarProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-border bg-background pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-12">
        <button
          onClick={onSortOpen}
          className="flex flex-1 items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground active:bg-muted transition-colors"
        >
          <ArrowUpDown className="size-4" />
          Sort
        </button>
        <div className="w-px bg-border" />
        <button
          onClick={onFilterOpen}
          className="flex flex-1 items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground active:bg-muted transition-colors"
        >
          <SlidersHorizontal className="size-4" />
          Filter
          {filterCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {filterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

// ============================================================
// Sort bottom sheet
// ============================================================

interface SortSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentSort: string
  onSortChange: (sort: string) => void
}

export function SortSheet({
  open,
  onOpenChange,
  currentSort,
  onSortChange,
}: SortSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl px-0 pb-[env(safe-area-inset-bottom)]">
        <SheetHeader className="border-b border-border px-4 pb-3">
          <SheetTitle>Sort by</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <RadioGroup
            value={currentSort}
            onValueChange={(v: string) => {
              onSortChange(v)
              onOpenChange(false)
            }}
          >
            <div className="flex flex-col gap-1">
              {SORT_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm cursor-pointer transition-colors",
                    currentSort === opt.value
                      ? "bg-primary/5 text-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <RadioGroupItem value={opt.value} />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </RadioGroup>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ============================================================
// Filter full-height sheet (mobile)
// Filters are pending until user taps "Show N results"
// ============================================================

interface FilterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentFilters: FilterState
  onApplyFilters: (filters: FilterState) => void
  allProducts: Product[]
}

export function FilterSheet({
  open,
  onOpenChange,
  currentFilters,
  onApplyFilters,
  allProducts,
}: FilterSheetProps) {
  // Pending filter state (not applied until user taps "Show results")
  const [pending, setPending] = useState<FilterState>(currentFilters)

  // Reset pending state when sheet opens
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset pending filters each time the sheet opens
      setPending(currentFilters)
    }
  }, [open, currentFilters])

  // Compute filtered count for pending state
  const pendingFiltered = useMemo(
    () => applyFilters(allProducts, pending),
    [allProducts, pending]
  )

  const pendingFacets = useMemo(
    () => computeFacets(allProducts, pending),
    [allProducts, pending]
  )

  const pendingChips = useMemo(() => buildChips(pending), [pending])
  const pendingHasFilters = pendingChips.length > 0

  // Handlers for pending state
  const handleToggleFilter = useCallback(
    (key: "sizes" | "categories" | "brands" | "colours", value: string) => {
      setPending((prev) => {
        const arr = prev[key] as string[]
        const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
        return { ...prev, [key]: next }
      })
    },
    []
  )

  const handleSetDiscount = useCallback((value: number | null) => {
    setPending((prev) => ({
      ...prev,
      discount: prev.discount === value ? null : value,
    }))
  }, [])

  const handleSetRating = useCallback((value: number | null) => {
    setPending((prev) => ({
      ...prev,
      rating: prev.rating === value ? null : value,
    }))
  }, [])

  const handleSetPriceRange = useCallback((range: [number, number] | null) => {
    setPending((prev) => ({ ...prev, priceRange: range }))
  }, [])

  const handleClearAll = useCallback(() => {
    setPending((prev) => ({ ...emptyFilters, sort: prev.sort }))
  }, [])

  const handleApply = useCallback(() => {
    onApplyFilters(pending)
    onOpenChange(false)
  }, [pending, onApplyFilters, onOpenChange])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton
        className="flex h-full w-full flex-col p-0 sm:max-w-md data-[side=right]:w-full"
      >
        {/* Sticky header */}
        <SheetHeader className="shrink-0 border-b border-border px-4 py-4">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <ProductFilters
            filters={pending}
            facets={pendingFacets}
            onToggleFilter={handleToggleFilter}
            onSetDiscount={handleSetDiscount}
            onSetRating={handleSetRating}
            onSetPriceRange={handleSetPriceRange}
            onClearAll={handleClearAll}
            hasFilters={pendingHasFilters}
          />
        </div>

        {/* Sticky footer */}
        <SheetFooter className="shrink-0 flex-row gap-3 border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleClearAll}
          >
            Clear All
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Show {pendingFiltered.length} Result{pendingFiltered.length !== 1 ? "s" : ""}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

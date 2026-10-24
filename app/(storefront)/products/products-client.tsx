"use client"

import { Suspense, useState, useCallback, useMemo } from "react"
import { ProductGrid } from "@/components/storefront/product-grid"
import { ProductFilters } from "@/components/storefront/product-filters"
import {
  MobileFilterBar,
  SortSheet,
  FilterSheet,
} from "@/components/storefront/filter-sheet"
import { useProductFilters, type FilterState } from "@/hooks/use-product-filters"
import { products } from "@/data/seed"

function ProductsPageInner() {
  const activeProducts = useMemo(() => products.filter((p) => p.status === "active"), [])

  const {
    filters,
    setFilters,
    toggleFilter,
    setDiscount,
    setRating,
    setPriceRange,
    setSort,
    removeChip,
    clearAll,
    filtered,
    sorted,
    facets,
    chips,
    hasFilters,
    filterCount,
  } = useProductFilters(activeProducts)

  const [sortSheetOpen, setSortSheetOpen] = useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)

  const handleApplyMobileFilters = useCallback(
    (pending: FilterState) => {
      setFilters(pending)
    },
    [setFilters]
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">All Products</h1>
        <p className="mt-1 text-base text-muted-foreground">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}{hasFilters ? " found" : " available"}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar filters */}
        <aside className="hidden w-[260px] shrink-0 lg:block lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2 scrollbar-thin">
          <ProductFilters
            filters={filters}
            facets={facets}
            onToggleFilter={toggleFilter}
            onSetDiscount={setDiscount}
            onSetRating={setRating}
            onSetPriceRange={setPriceRange}
            onClearAll={clearAll}
            hasFilters={hasFilters}
          />
        </aside>

        <div className="flex-1 min-w-0 pb-16 lg:pb-0">
          <ProductGrid
            products={sorted}
            totalCount={filtered.length}
            activeChips={chips}
            onRemoveChip={removeChip}
            onClearAll={clearAll}
            sortValue={filters.sort}
            onSortChange={setSort}
            hideSortOnMobile
          />
        </div>
      </div>

      {/* Mobile bottom bar */}
      <MobileFilterBar
        filterCount={filterCount}
        onSortOpen={() => setSortSheetOpen(true)}
        onFilterOpen={() => setFilterSheetOpen(true)}
      />

      {/* Mobile sort sheet */}
      <SortSheet
        open={sortSheetOpen}
        onOpenChange={setSortSheetOpen}
        currentSort={filters.sort}
        onSortChange={setSort}
      />

      {/* Mobile filter sheet */}
      <FilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        currentFilters={filters}
        onApplyFilters={handleApplyMobileFilters}
        allProducts={activeProducts}
      />
    </div>
  )
}

export function ProductsPageClient() {
  return (
    <Suspense fallback={null}>
      <ProductsPageInner />
    </Suspense>
  )
}

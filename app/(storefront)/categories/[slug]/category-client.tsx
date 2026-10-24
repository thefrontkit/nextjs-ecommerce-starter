"use client"

import { Suspense, useState, useCallback } from "react"
import type { Product, Category } from "@/types"
import { ProductGrid } from "@/components/storefront/product-grid"
import { ProductFilters } from "@/components/storefront/product-filters"
import {
  MobileFilterBar,
  SortSheet,
  FilterSheet,
} from "@/components/storefront/filter-sheet"
import { useProductFilters, type FilterState } from "@/hooks/use-product-filters"

interface CategoryClientProps {
  category: Category
  products: Product[]
}

function CategoryPageInner({ products }: CategoryClientProps) {
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
  } = useProductFilters(products)

  const [sortSheetOpen, setSortSheetOpen] = useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)

  const handleApplyMobileFilters = useCallback(
    (pending: FilterState) => {
      setFilters(pending)
    },
    [setFilters]
  )

  return (
    <>
      {/* Two-column layout */}
      <div className="flex gap-8">
        {/* Desktop filter rail */}
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

        {/* Product grid */}
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
        allProducts={products}
      />
    </>
  )
}

// Wrap in Suspense because useSearchParams requires it
export function CategoryClient(props: CategoryClientProps) {
  return (
    <Suspense fallback={null}>
      <CategoryPageInner {...props} />
    </Suspense>
  )
}

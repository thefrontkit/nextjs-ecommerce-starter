"use client"

import { useMemo, useCallback, useRef } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import type { Product } from "@/types"

// ============================================================
// Filter State Types
// ============================================================

export interface FilterState {
  sizes: string[]
  categories: string[]      // subcategory checkboxes
  priceRange: [number, number] | null  // [min, max]
  brands: string[]
  colours: string[]
  discount: number | null    // e.g. 10, 20, 30, 40, 50
  rating: number | null      // e.g. 2, 3, 4
  sort: string
}

export const emptyFilters: FilterState = {
  sizes: [],
  categories: [],
  priceRange: null,
  brands: [],
  colours: [],
  discount: null,
  rating: null,
  sort: "popular",
}

export interface FacetOption {
  value: string
  label: string
  count: number
  hex?: string  // for colour swatches
  disabled?: boolean
}

export interface FacetCounts {
  sizes: FacetOption[]
  categories: FacetOption[]
  brands: FacetOption[]
  colours: FacetOption[]
  discounts: FacetOption[]
  ratings: FacetOption[]
  priceMin: number
  priceMax: number
}

export interface ActiveChip {
  type: keyof FilterState
  value: string
  label: string
}

// ============================================================
// Colour name-to-hex mapping
// ============================================================

const COLOUR_HEX_MAP: Record<string, string> = {
  "White": "#f5f5f5",
  "Black": "#1a1a1a",
  "Navy": "#16213e",
  "Sand": "#c4a882",
  "Charcoal": "#36454f",
  "Olive": "#556b2f",
  "Washed Black": "#2a2a2a",
  "Heather Grey": "#9e9e9e",
  "Forest Green": "#228b22",
  "Sky Blue": "#a8c4d8",
  "Burgundy": "#800020",
  "Stone": "#c8c0b8",
  "Light Blue": "#add8e6",
  "Cream": "#f5f0e8",
  "Blush": "#f4c2c2",
  "Dusty Rose": "#dcae96",
  "Emerald": "#50c878",
  "Midnight": "#191970",
  "Camel": "#c19a6b",
  "Ivory": "#fffff0",
  "Champagne": "#f7e7ce",
  "Brown": "#5c3a21",
  "Dark Brown": "#3b2714",
  "Cognac": "#9a6633",
  "Nude": "#e2c5a8",
  "Tan": "#d2b48c",
  "Red": "#cc0000",
  "Blue": "#0000cc",
  "Grey": "#808080",
  "Silver": "#c0c0c0",
  "Gold": "#ffd700",
  "Rose Gold": "#b76e79",
  "Tortoise": "#6f4e37",
  "Matte Black": "#28282b",
  "Gunmetal": "#2a3439",
  "Green": "#228b22",
  "Pink": "#ff69b4",
  "Sage": "#9caf88",
  "Rust": "#b7410e",
}

// ============================================================
// Sort options
// ============================================================

export const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const

export function getSortLabel(value: string): string {
  return SORT_OPTIONS.find((o) => o.value === value)?.label ?? "Most Popular"
}

// ============================================================
// Effective price helper
// ============================================================

function effectivePrice(p: Product): number {
  return p.salePrice ?? p.price
}

function discountPercent(p: Product): number {
  if (!p.salePrice) return 0
  return Math.round(((p.price - p.salePrice) / p.price) * 100)
}

// ============================================================
// URL serialization
// ============================================================

function filtersToParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.sizes.length) params.set("size", filters.sizes.join(","))
  if (filters.categories.length) params.set("sub", filters.categories.join(","))
  if (filters.priceRange) params.set("price", `${filters.priceRange[0]}-${filters.priceRange[1]}`)
  if (filters.brands.length) params.set("brand", filters.brands.join(","))
  if (filters.colours.length) params.set("colour", filters.colours.join(","))
  if (filters.discount !== null) params.set("discount", String(filters.discount))
  if (filters.rating !== null) params.set("rating", String(filters.rating))
  if (filters.sort !== "popular") params.set("sort", filters.sort)
  return params
}

function paramsToFilters(params: URLSearchParams): FilterState {
  const filters: FilterState = { ...emptyFilters }

  const size = params.get("size")
  if (size) filters.sizes = size.split(",").filter(Boolean)

  const sub = params.get("sub")
  if (sub) filters.categories = sub.split(",").filter(Boolean)

  const price = params.get("price")
  if (price) {
    const [min, max] = price.split("-").map(Number)
    if (!isNaN(min) && !isNaN(max)) filters.priceRange = [min, max]
  }

  const brand = params.get("brand")
  if (brand) filters.brands = brand.split(",").filter(Boolean)

  const colour = params.get("colour")
  if (colour) filters.colours = colour.split(",").filter(Boolean)

  const discount = params.get("discount")
  if (discount) {
    const d = Number(discount)
    if (!isNaN(d)) filters.discount = d
  }

  const rating = params.get("rating")
  if (rating) {
    const r = Number(rating)
    if (!isNaN(r)) filters.rating = r
  }

  const sort = params.get("sort")
  if (sort) filters.sort = sort

  return filters
}

// ============================================================
// Filtering logic
// ============================================================

function applyFilters(products: Product[], filters: FilterState): Product[] {
  let result = products

  // Size (OR within)
  if (filters.sizes.length > 0) {
    result = result.filter((p) =>
      p.variants.some((v) => v.type === "size" && filters.sizes.includes(v.value))
    )
  }

  // Category / subcategory (OR within)
  if (filters.categories.length > 0) {
    result = result.filter((p) => {
      const sub = p.subcategory?.toLowerCase() ?? ""
      return filters.categories.some(
        (c) => c.toLowerCase() === sub || c.toLowerCase() === sub.replace(/\s+/g, "-")
      )
    })
  }

  // Price range
  if (filters.priceRange) {
    const [min, max] = filters.priceRange
    result = result.filter((p) => {
      const ep = effectivePrice(p)
      return ep >= min && ep <= max
    })
  }

  // Brand (OR within)
  if (filters.brands.length > 0) {
    result = result.filter((p) =>
      filters.brands.some((b) => b.toLowerCase() === p.brand.toLowerCase())
    )
  }

  // Colour (OR within)
  if (filters.colours.length > 0) {
    result = result.filter((p) =>
      p.variants.some(
        (v) => v.type === "color" && filters.colours.some((c) => c.toLowerCase() === v.name.toLowerCase())
      )
    )
  }

  // Discount (at least N%)
  if (filters.discount !== null) {
    result = result.filter((p) => discountPercent(p) >= filters.discount!)
  }

  // Rating (at least N stars)
  if (filters.rating !== null) {
    result = result.filter((p) => p.rating >= filters.rating!)
  }

  return result
}

function applySorting(products: Product[], sort: string): Product[] {
  return [...products].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return effectivePrice(a) - effectivePrice(b)
      case "price-desc":
        return effectivePrice(b) - effectivePrice(a)
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "rating":
        return b.rating - a.rating
      default: // popular
        return b.reviewCount - a.reviewCount
    }
  })
}

// ============================================================
// Facet computation
// ============================================================

function computeFacets(allProducts: Product[], currentFilters: FilterState): FacetCounts {
  // For each facet, compute counts by filtering on all OTHER facets
  // This gives accurate "what would change" counts

  function countWithout(exclude: keyof FilterState): Product[] {
    const filtersWithout = { ...currentFilters, [exclude]: emptyFilters[exclude] }
    return applyFilters(allProducts, filtersWithout)
  }

  // Sizes
  const productsForSizes = countWithout("sizes")
  const sizeMap = new Map<string, number>()
  productsForSizes.forEach((p) => {
    const seen = new Set<string>()
    p.variants.forEach((v) => {
      if (v.type === "size" && !seen.has(v.value)) {
        seen.add(v.value)
        sizeMap.set(v.value, (sizeMap.get(v.value) ?? 0) + 1)
      }
    })
  })
  const sizes: FacetOption[] = Array.from(sizeMap.entries())
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => {
      // Sort sizes: XS, S, M, L, XL, 2XL first, then numeric
      const sizeOrder = ["XS", "S", "M", "L", "XL", "2XL"]
      const aIdx = sizeOrder.indexOf(a.value)
      const bIdx = sizeOrder.indexOf(b.value)
      if (aIdx >= 0 && bIdx >= 0) return aIdx - bIdx
      if (aIdx >= 0) return -1
      if (bIdx >= 0) return 1
      return Number(a.value) - Number(b.value) || a.value.localeCompare(b.value)
    })

  // Categories (subcategories)
  const productsForCats = countWithout("categories")
  const catMap = new Map<string, number>()
  productsForCats.forEach((p) => {
    if (p.subcategory) {
      const key = p.subcategory
      catMap.set(key, (catMap.get(key) ?? 0) + 1)
    }
  })
  const categories: FacetOption[] = Array.from(catMap.entries())
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => b.count - a.count)

  // Brands
  const productsForBrands = countWithout("brands")
  const brandMap = new Map<string, number>()
  productsForBrands.forEach((p) => {
    brandMap.set(p.brand, (brandMap.get(p.brand) ?? 0) + 1)
  })
  const brands: FacetOption[] = Array.from(brandMap.entries())
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => b.count - a.count)

  // Colours
  const productsForColours = countWithout("colours")
  const colourMap = new Map<string, number>()
  productsForColours.forEach((p) => {
    const seen = new Set<string>()
    p.variants.forEach((v) => {
      if (v.type === "color" && !seen.has(v.name)) {
        seen.add(v.name)
        colourMap.set(v.name, (colourMap.get(v.name) ?? 0) + 1)
      }
    })
  })
  const colours: FacetOption[] = Array.from(colourMap.entries())
    .map(([value, count]) => ({
      value,
      label: value,
      count,
      hex: COLOUR_HEX_MAP[value] ?? "#808080",
    }))
    .sort((a, b) => b.count - a.count)

  // Discounts
  const productsForDiscounts = countWithout("discount")
  const discountThresholds = [10, 20, 30, 40, 50]
  const discounts: FacetOption[] = discountThresholds.map((d) => ({
    value: String(d),
    label: `${d}% and above`,
    count: productsForDiscounts.filter((p) => discountPercent(p) >= d).length,
  }))

  // Ratings
  const productsForRatings = countWithout("rating")
  const ratingThresholds = [4, 3, 2]
  const ratings: FacetOption[] = ratingThresholds.map((r) => ({
    value: String(r),
    label: `${r}\u2605 & above`,
    count: productsForRatings.filter((p) => p.rating >= r).length,
  }))

  // Price range (from all products, not filtered)
  const prices = allProducts.map(effectivePrice)
  const priceMin = Math.floor(Math.min(...prices))
  const priceMax = Math.ceil(Math.max(...prices))

  return { sizes, categories, brands, colours, discounts, ratings, priceMin, priceMax }
}

// ============================================================
// Active chip builder
// ============================================================

function buildChips(filters: FilterState): ActiveChip[] {
  const chips: ActiveChip[] = []
  filters.sizes.forEach((s) => chips.push({ type: "sizes", value: s, label: s }))
  filters.categories.forEach((c) => chips.push({ type: "categories", value: c, label: c }))
  if (filters.priceRange) {
    chips.push({
      type: "priceRange",
      value: `${filters.priceRange[0]}-${filters.priceRange[1]}`,
      label: `$${filters.priceRange[0]} - $${filters.priceRange[1]}`,
    })
  }
  filters.brands.forEach((b) => chips.push({ type: "brands", value: b, label: b }))
  filters.colours.forEach((c) => chips.push({ type: "colours", value: c, label: c }))
  if (filters.discount !== null) {
    chips.push({ type: "discount", value: String(filters.discount), label: `${filters.discount}%+ off` })
  }
  if (filters.rating !== null) {
    chips.push({ type: "rating", value: String(filters.rating), label: `${filters.rating}\u2605 & above` })
  }
  return chips
}

// ============================================================
// Hook
// ============================================================

export function useProductFilters(allProducts: Product[]) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Parse initial state from URL
  const filters = useMemo(() => paramsToFilters(searchParams), [searchParams])

  // Debounce ref for price range
  const priceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync filters to URL
  const setFilters = useCallback(
    (next: FilterState | ((prev: FilterState) => FilterState)) => {
      const resolved = typeof next === "function" ? next(paramsToFilters(searchParams)) : next
      const params = filtersToParams(resolved)
      const qs = params.toString()
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  // Toggle a multi-select value
  const toggleFilter = useCallback(
    (key: "sizes" | "categories" | "brands" | "colours", value: string) => {
      setFilters((prev) => {
        const arr = prev[key] as string[]
        const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
        return { ...prev, [key]: next }
      })
    },
    [setFilters]
  )

  // Set single-select value
  const setDiscount = useCallback(
    (value: number | null) => {
      setFilters((prev) => ({
        ...prev,
        discount: prev.discount === value ? null : value,
      }))
    },
    [setFilters]
  )

  const setRating = useCallback(
    (value: number | null) => {
      setFilters((prev) => ({
        ...prev,
        rating: prev.rating === value ? null : value,
      }))
    },
    [setFilters]
  )

  const setPriceRange = useCallback(
    (range: [number, number] | null) => {
      if (priceTimerRef.current) clearTimeout(priceTimerRef.current)
      priceTimerRef.current = setTimeout(() => {
        setFilters((prev) => ({ ...prev, priceRange: range }))
      }, 300)
    },
    [setFilters]
  )

  const setPriceRangeImmediate = useCallback(
    (range: [number, number] | null) => {
      setFilters((prev) => ({ ...prev, priceRange: range }))
    },
    [setFilters]
  )

  const setSort = useCallback(
    (sort: string) => {
      setFilters((prev) => ({ ...prev, sort }))
    },
    [setFilters]
  )

  const removeChip = useCallback(
    (chip: ActiveChip) => {
      setFilters((prev) => {
        const next = { ...prev }
        switch (chip.type) {
          case "sizes":
            next.sizes = prev.sizes.filter((v) => v !== chip.value)
            break
          case "categories":
            next.categories = prev.categories.filter((v) => v !== chip.value)
            break
          case "priceRange":
            next.priceRange = null
            break
          case "brands":
            next.brands = prev.brands.filter((v) => v !== chip.value)
            break
          case "colours":
            next.colours = prev.colours.filter((v) => v !== chip.value)
            break
          case "discount":
            next.discount = null
            break
          case "rating":
            next.rating = null
            break
        }
        return next
      })
    },
    [setFilters]
  )

  const clearAll = useCallback(() => {
    setFilters((prev) => ({ ...emptyFilters, sort: prev.sort }))
  }, [setFilters])

  // Computed
  const filtered = useMemo(() => applyFilters(allProducts, filters), [allProducts, filters])
  const sorted = useMemo(() => applySorting(filtered, filters.sort), [filtered, filters.sort])
  const facets = useMemo(() => computeFacets(allProducts, filters), [allProducts, filters])
  const chips = useMemo(() => buildChips(filters), [filters])

  const hasFilters = chips.length > 0
  const filterCount = chips.length

  return {
    filters,
    setFilters,
    toggleFilter,
    setDiscount,
    setRating,
    setPriceRange,
    setPriceRangeImmediate,
    setSort,
    removeChip,
    clearAll,
    filtered,
    sorted,
    facets,
    chips,
    hasFilters,
    filterCount,
  }
}

// Re-export the applyFilters for use outside hook (e.g., mobile sheet with pending state)
export { applyFilters, applySorting, computeFacets, buildChips }

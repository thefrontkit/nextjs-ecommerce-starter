"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import type { Product } from "@/types"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
  products: Product[]
}

export function SearchBar({ products }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(true)
  const blurTimeout = useRef<ReturnType<typeof setTimeout>>(null)

  const filtered = query.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
    : []

  const handleBlur = useCallback(() => {
    blurTimeout.current = setTimeout(() => {
      setDropdownOpen(false)
    }, 200)
  }, [])

  const handleFocus = useCallback(() => {
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current)
    }
    setDropdownOpen(true)
  }, [])

  return (
    <div
      className="relative w-full max-w-lg"
      onBlur={handleBlur}
      onFocus={handleFocus}
    >
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search products..."
        value={query}
        onChange={(e) => { setQuery(e.target.value); setDropdownOpen(true) }}
        className="pl-9"
        aria-label="Search products"
      />
      {query.trim() && dropdownOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-md">
          {filtered.length > 0 ? (
            <>
              <ul className="py-1">
                {filtered.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={() => setQuery("")}
                      className="flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <div className="size-8 shrink-0 overflow-hidden rounded-xl bg-muted">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{product.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{product.category}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => setQuery("")}
                className="flex items-center justify-center border-t border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                View all results
              </Link>
            </>
          ) : (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No products found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  )
}

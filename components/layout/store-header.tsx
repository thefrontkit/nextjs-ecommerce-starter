"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import {
  ShoppingBag,
  Search,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MiniCartDrawer } from "@/components/storefront/mini-cart-drawer"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { CurrencySelector } from "@/components/layout/currency-selector"
import { SearchBar } from "@/components/storefront/search-bar"
import { storeNavItems, categories, products } from "@/data/seed"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/cart-context"

export function StoreHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [miniCartOpen, setMiniCartOpen] = useState(false)
  const { count: cartCount } = useCart()

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Announcement bar */}
      {announcementVisible && (
        <div className="relative bg-foreground text-background text-center text-xs py-2.5 px-4">
          <span>
            Free storefront by thefrontkit. Checkout, accounts and admin are in the{" "}
            <a
              href="https://thefrontkit.com/apps/ecommerce-kit?utm_source=github&utm_medium=storefront-lite&utm_campaign=announcement"
              className="underline underline-offset-2 hover:opacity-80"
            >
              full kit
            </a>
          </span>
          <button
            onClick={() => setAnnouncementVisible(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
            aria-label="Dismiss announcement"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <header className={cn(
        "sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-all duration-200",
        scrolled && "shadow-sm"
      )}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={cn(
            "flex items-center gap-4 transition-all duration-200",
            scrolled ? "h-14" : "h-16"
          )}>
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="touch-target md:hidden"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 font-heading font-bold"
            >
              <ShoppingBag className={cn("text-primary transition-all", scrolled ? "h-5 w-5" : "h-6 w-6")} />
              <span className={cn("text-foreground transition-all tracking-tight", scrolled ? "text-base" : "text-lg")}>Ember</span>
            </Link>

            {/* Desktop navigation with mega menu */}
            <nav className="hidden md:flex md:items-center md:gap-1" aria-label="Main navigation">
              {storeNavItems.map((item) => {
                const category = categories.find(
                  (c) => item.href === `/categories/${c.slug}`
                )
                if (!category) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.title}
                    </Link>
                  )
                }
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setHoveredCategory(category.slug)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <Link
                      href={item.href}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.title}
                    </Link>
                    {hoveredCategory === category.slug && (
                      <div className="absolute left-0 top-full z-50 pt-2">
                        <div className="w-64 rounded-xl border border-border bg-card p-4 shadow-lg">
                          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {category.name}
                          </p>
                          <div className="flex flex-col gap-1">
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub.slug}
                                href={`/categories/${category.slug}?sub=${sub.slug}`}
                                className="rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                onClick={() => setHoveredCategory(null)}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                          <div className="mt-3 border-t border-border pt-3">
                            <Link
                              href={item.href}
                              className="text-xs font-medium text-primary hover:underline"
                              onClick={() => setHoveredCategory(null)}
                            >
                              View all {category.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Search bar (desktop) */}
            <div className="hidden flex-1 md:block md:max-w-sm lg:max-w-md">
              <SearchBar products={products} />
            </div>

            <div className="flex-1 md:hidden" />

            {/* Action icons */}
            <div className="flex items-center gap-0.5">
              {/* Mobile search toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="touch-target md:hidden"
                aria-label={searchOpen ? "Close search" : "Open search"}
                onClick={() => setSearchOpen(!searchOpen)}
              >
                {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </Button>

                            <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="touch-target relative"
                      aria-label={`Cart (${cartCount} items)`}
                      onClick={() => setMiniCartOpen(true)}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {cartCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 flex size-[18px] items-center justify-center rounded-full p-0 text-[10px]">
                          {cartCount}
                        </Badge>
                      )}
                    </Button>
                  }
                />
                <TooltipContent>Cart</TooltipContent>
              </Tooltip>

              

              <CurrencySelector />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile search bar */}
          {searchOpen && (
            <div className="border-t border-border py-3 md:hidden">
              <SearchBar products={products} />
            </div>
          )}
        </div>

        {/* Mobile navigation sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b border-border px-4 py-4">
              <SheetTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Ember
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-4" aria-label="Mobile navigation">
              {storeNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
              <div className="my-2 border-t border-border" />
              <a
                href="https://thefrontkit.com/apps/ecommerce-kit?utm_source=github&utm_medium=storefront-lite&utm_campaign=mobile-menu"
                className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get the full kit (checkout, accounts, admin)
              </a>
            </nav>
          </SheetContent>
        </Sheet>

        <MiniCartDrawer open={miniCartOpen} onOpenChange={setMiniCartOpen} />
      </header>
    </>
  )
}

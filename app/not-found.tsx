import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home, Search, ShoppingBag } from "lucide-react"
import { products } from "@/data/seed"
import { ProductCard } from "@/components/storefront/product-card"
import { CartProvider } from "@/context/cart-context"
import { WishlistProvider } from "@/context/wishlist-context"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function NotFound() {
  return (
    <CartProvider>
      <WishlistProvider>
        <TooltipProvider>
          <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="flex flex-col items-center gap-6 text-center max-w-lg">
              {/* Illustration / icon */}
              <div className="relative animate-float">
                <div className="flex size-32 items-center justify-center rounded-full bg-muted">
                  <ShoppingBag className="size-16 text-muted-foreground/50" />
                </div>
                <div className="absolute -bottom-2 -right-2 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
                  ?
                </div>
              </div>

              <div>
                <p className="text-7xl font-bold text-primary md:text-8xl">404</p>
                <h1 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">Page not found</h1>
                <p className="mt-2 text-muted-foreground">
                  Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or
                  no longer exists.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-9"
                  aria-label="Search products"
                />
              </div>

              <div className="flex gap-3">
                <Button render={<Link href="/" />}>
                  <Home className="mr-2 size-4" />
                  Back to Home
                </Button>
                <Button variant="outline" render={<Link href="/products" />}>
                  Browse Products
                </Button>
              </div>

              {/* Popular Products */}
              <div className="mt-12 w-full max-w-4xl">
                <h2 className="mb-6 text-lg font-semibold text-foreground">Popular Products</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {products
                    .filter((p) => p.status === "active")
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 4)
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </WishlistProvider>
    </CartProvider>
  )
}

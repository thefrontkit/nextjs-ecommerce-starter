import { TooltipProvider } from "@/components/ui/tooltip"
import { StoreHeader } from "@/components/layout/store-header"
import { StoreFooter } from "@/components/layout/store-footer"
import { BackToTop } from "@/components/layout/back-to-top"
import { CartProvider } from "@/context/cart-context"
import { WishlistProvider } from "@/context/wishlist-context"
import { RecentlyViewedProvider } from "@/context/recently-viewed-context"

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <WishlistProvider>
        <RecentlyViewedProvider>
          <TooltipProvider>
            <div className="flex min-h-screen flex-col bg-background">
              <StoreHeader />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <StoreFooter />
              <BackToTop />
            </div>
          </TooltipProvider>
        </RecentlyViewedProvider>
      </WishlistProvider>
    </CartProvider>
  )
}

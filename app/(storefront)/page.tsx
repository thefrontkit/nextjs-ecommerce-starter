import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroBanner } from "@/components/storefront/hero-banner"
import { CategoryGrid } from "@/components/storefront/category-grid"
import { DealsCountdown } from "@/components/storefront/deals-countdown"
import { BrandStrip } from "@/components/storefront/brand-strip"
import { UGCGrid } from "@/components/storefront/ugc-grid"
import { ProductCard } from "@/components/storefront/product-card"
import { RecentlyViewed } from "@/components/storefront/recently-viewed"
import { products, categories } from "@/data/seed"
import { ArrowRight } from "lucide-react"

function SectionHeader({ title, action }: { title: string; action?: { label: string; href: string } }) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">{title}</h2>
      {action && (
        <Link
          href={action.href}
          className="flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          {action.label}
          <ArrowRight className="size-3" />
        </Link>
      )}
    </div>
  )
}

export default function HomePage() {
  const activeProducts = products.filter((p) => p.status === "active")
  const dealProducts = activeProducts.filter((p) => p.salePrice).slice(0, 4)
  const trendingProducts = activeProducts
    .filter((p) => !p.salePrice)
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 6)

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <HeroBanner />

      {/* Categories */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <SectionHeader title="Shop by Category" action={{ label: "View All", href: "/products" }} />
        <CategoryGrid categories={categories} />
      </section>

      {/* Deals with Countdown */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
        <SectionHeader title="Today's Deals" action={{ label: "View All", href: "/products" }} />
        <DealsCountdown products={dealProducts} />
      </section>

      {/* Full-width editorial banner */}
      <section className="relative h-[320px] overflow-hidden sm:h-[400px]">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=600&fit=crop&auto=format&q=80"
          alt="Fashion editorial"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative flex h-full items-center justify-center text-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">Limited Time</p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-white tracking-tight sm:text-4xl md:text-5xl">
              Up to 40% Off
            </h2>
            <p className="mt-2 text-sm text-white/60">Selected styles. While stocks last.</p>
            <Button size="lg" className="mt-6 rounded-none bg-white text-black px-8 hover:bg-neutral-200" render={<Link href="/products" />}>
              Shop the Sale
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Strip */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <BrandStrip />
      </section>

      {/* Trending */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
        <SectionHeader title="Trending Now" action={{ label: "View All", href: "/products" }} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* UGC / Style Gallery */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
        <SectionHeader title="#EmberStyle" />
        <UGCGrid />
      </section>

      {/* Recently Viewed */}
      <RecentlyViewed />
    </div>
  )
}

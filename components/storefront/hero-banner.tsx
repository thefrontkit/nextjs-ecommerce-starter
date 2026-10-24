import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroBanner() {
  return (
    <section className="relative">
      {/* Full-width hero image with overlay */}
      <div className="relative h-[70vh] min-h-[480px] max-h-[720px] overflow-hidden bg-foreground">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop&auto=format&q=80"
          alt="Fashion store"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60 sm:text-sm">New Season 2026</p>
            <h1 className="mt-4 font-heading text-5xl font-bold text-white leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Define Your Style
            </h1>
            <p className="mt-5 max-w-sm text-sm text-white/60 leading-relaxed sm:text-base">
              Curated fashion for every occasion. Discover pieces that move with you.
            </p>
            <div className="mt-8 flex gap-4">
              <Button size="lg" className="rounded-none bg-white text-black px-8 hover:bg-neutral-200" render={<Link href="/products" />}>
                Shop Now
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button size="lg" variant="ghost" className="rounded-none border border-white text-white px-8 hover:bg-white hover:text-black" render={<Link href="/categories/women" />}>
                Explore
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip below hero */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 overflow-x-auto px-4 py-3 text-xs text-muted-foreground sm:px-6 sm:text-sm lg:px-8">
          <span className="shrink-0">Free Shipping Over $100</span>
          <span className="hidden h-3 w-px bg-border sm:block" />
          <span className="shrink-0">Secure Payment</span>
          <span className="hidden h-3 w-px bg-border sm:block" />
          <span className="shrink-0">30-Day Returns</span>
          <span className="hidden h-3 w-px bg-border sm:block" />
          <span className="shrink-0">24/7 Support</span>
        </div>
      </div>
    </section>
  )
}

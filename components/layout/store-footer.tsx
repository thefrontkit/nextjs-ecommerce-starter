"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const shopLinks = [
  { title: "All Products", href: "/products" },
  { title: "Men", href: "/categories/men" },
  { title: "Women", href: "/categories/women" },
  { title: "Footwear", href: "/categories/footwear" },
  { title: "Accessories", href: "/categories/accessories" },
]

const utm = "utm_source=github&utm_medium=storefront-lite&utm_campaign=footer"

const fullKitLinks = [
  { title: "Full E-commerce Kit (56 screens)", href: `https://thefrontkit.com/apps/ecommerce-kit?${utm}` },
  { title: "Full-Stack Kit (Supabase + Stripe)", href: `https://thefrontkit.com/apps/ecommerce-fullstack-kit?${utm}` },
  { title: "Live demo of the full kit", href: "https://ecommerce-kit-code.vercel.app" },
]

const resourceLinks = [
  { title: "Next.js e-commerce templates compared", href: `https://thefrontkit.com/blogs/nextjs-ecommerce-template-guide-2026?${utm}` },
  { title: "Built by thefrontkit", href: `https://thefrontkit.com?${utm}` },
]

export function StoreFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Shop</h3>
            <ul className="mt-4 space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground">Get the Full Kit</h3>
            <ul className="mt-4 space-y-3">
              {fullKitLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground">Resources</h3>
            <ul className="mt-4 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground">Newsletter</h3>
            <p className="mt-4 text-base text-muted-foreground">
              Subscribe to get special offers, free giveaways, and new arrivals.
            </p>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="email"
                placeholder="you@example.com"
                className="h-9 flex-1"
                aria-label="Email address for newsletter"
                required
              />
              <Button type="submit" size="sm" className="h-9 shrink-0">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Ember. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

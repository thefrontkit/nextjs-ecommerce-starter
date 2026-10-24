import Link from "next/link"

const brands = [
  "Maison Lune",
  "Henwick & Co",
  "Stride Republic",
  "Noma Studio",
  "Ember Essentials",
  "Alto Leather",
  "Thread & Bone",
  "Solace",
]

export function BrandStrip() {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        Shop by Brand
      </h2>
      <div className="flex items-center gap-3 overflow-x-auto py-2">
        {brands.map((brand) => (
          <Link
            key={brand}
            href={`/products?brand=${encodeURIComponent(brand)}`}
            className="shrink-0 rounded-full border border-border px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-foreground/70 transition-colors hover:border-foreground hover:text-foreground"
          >
            {brand}
          </Link>
        ))}
      </div>
    </div>
  )
}

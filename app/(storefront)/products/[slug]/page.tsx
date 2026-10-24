import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ProductGallery } from "@/components/storefront/product-gallery"
import { ProductTabs } from "@/components/storefront/product-tabs"
import { ProductCard } from "@/components/storefront/product-card"
import { ShareButton } from "@/components/storefront/share-button"
import { PdpRecentlyViewed } from "@/components/storefront/pdp-recently-viewed"
import { FrequentlyBoughtTogether } from "@/components/storefront/frequently-bought-together"
import { PdpClient } from "@/components/storefront/pdp-client"
import { ReviewSnapshot } from "@/components/storefront/review-snapshot"
import { Star, StarHalf } from "lucide-react"
import { products, reviews, productBundles, productQuestions } from "@/data/seed"

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  return { title: product?.name ?? "Product" }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) notFound()

  const productReviews = reviews.filter((r) => r.productId === product.id)

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id && p.status === "active")
    .slice(0, 4)

  const bundle = productBundles.find((b) => b.productId === product.id)
  const companionProducts = bundle
    ? bundle.companionIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is (typeof products)[number] => p != null && p.status === "active")
    : []

  const fullStars = Math.floor(product.rating)
  const hasHalf = product.rating - fullStars >= 0.25 && product.rating - fullStars < 0.75

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href="/products" className="hover:text-foreground transition-colors">Products</Link></li>
          <li>/</li>
          <li><Link href={`/categories/${product.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`} className="hover:text-foreground transition-colors">{product.category}</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery images={product.images} />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-bold text-foreground mb-1">{product.brand}</p>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">{product.name}</h1>
              <ShareButton title={product.name} />
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center" aria-label={`${product.rating} out of 5 stars`}>
              {Array.from({ length: fullStars }, (_, i) => (
                <Star key={`full-${i}`} className="size-4 fill-warning text-warning" />
              ))}
              {hasHalf && <StarHalf className="size-4 fill-warning text-warning" />}
              {Array.from({ length: 5 - fullStars - (hasHalf ? 1 : 0) }, (_, i) => (
                <Star key={`empty-${i}`} className="size-4 fill-muted text-muted" />
              ))}
            </div>
            <Link href="#reviews" className="text-sm text-muted-foreground hover:underline">
              {product.reviewCount.toLocaleString()} reviews
            </Link>
          </div>

          <PdpClient product={product} />
        </div>
      </div>

      <div className="mt-8 sm:mt-12" id="reviews">
        <ReviewSnapshot product={product} reviews={productReviews} />
      </div>

      <div className="mt-12 sm:mt-16" id="product-tabs">
        <ProductTabs product={product} specs={product.specs} reviews={productReviews} questions={productQuestions} />
      </div>

      {companionProducts.length > 0 && (
        <div className="mt-12 sm:mt-16">
          <FrequentlyBoughtTogether mainProduct={product} companions={companionProducts} />
        </div>
      )}

      {relatedProducts.length > 0 && (
        <div className="mt-12 sm:mt-16">
          <h2 className="mb-6 text-xl font-bold text-foreground sm:text-2xl">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <PdpRecentlyViewed product={product} />

      {product.stock > 0 && <div className="h-20 md:hidden" />}
    </div>
  )
}

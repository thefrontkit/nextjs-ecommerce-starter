"use client"

import type { Product, Review } from "@/types"
import { Star, StarHalf, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ReviewSnapshotProps {
  product: Product
  reviews?: Review[]
}

function SnapshotStarDisplay({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }, (_, i) => (
        <Star key={`full-${i}`} className="size-4 fill-warning text-warning" />
      ))}
      {hasHalf && <StarHalf className="size-4 fill-warning text-warning" />}
      {Array.from({ length: 5 - fullStars - (hasHalf ? 1 : 0) }, (_, i) => (
        <Star key={`empty-${i}`} className="size-4 fill-muted text-muted" />
      ))}
    </div>
  )
}

export function ReviewSnapshot({ product, reviews = [] }: ReviewSnapshotProps) {
  const total = product.reviewCount
  const avg = product.rating

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    if (reviews.length > 0) {
      const count = reviews.filter((r) => Math.floor(r.rating) === star).length
      return { star, count, pct: reviews.length > 0 ? (count / reviews.length) * 100 : 0 }
    }
    const dist: Record<number, number[]> = {
      5: [55, 25, 12, 5, 3],
      4: [35, 35, 18, 8, 4],
      3: [15, 25, 30, 20, 10],
    }
    const pcts = dist[Math.round(avg)] ?? dist[4]!
    return { star, count: Math.round(total * (pcts[5 - star]! / 100)), pct: pcts[5 - star]! }
  })

  const previewReviews = reviews.slice(0, 5)

  function findReviewsTab(container: HTMLElement): HTMLButtonElement | null {
    const triggers = container.querySelectorAll<HTMLButtonElement>('[data-slot="tabs-trigger"]')
    for (const trigger of triggers) {
      if (trigger.textContent?.toLowerCase().includes("reviews")) {
        return trigger
      }
    }
    return null
  }

  function handleShowAllReviews() {
    // Scroll to the product-tabs section and activate the reviews tab
    const tabsSection = document.getElementById("product-tabs")
    if (tabsSection) {
      const reviewsTab = findReviewsTab(tabsSection)
      if (reviewsTab) {
        reviewsTab.click()
      }
      tabsSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="rounded-xl border border-border p-6 sm:p-8">
      <h3 className="mb-6 text-lg font-semibold text-foreground sm:text-xl">Customer Reviews</h3>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* Left column: rating summary + histogram */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <span className="text-5xl font-bold tracking-tight text-foreground">{avg.toFixed(1)}</span>
            <SnapshotStarDisplay rating={avg} />
            <span className="text-sm text-muted-foreground">Based on {total.toLocaleString()} reviews</span>
          </div>

          <div className="flex flex-col gap-2">
            {distribution.map(({ star, count, pct }) => (
              <button
                key={star}
                className="group flex items-center gap-2 rounded-md px-1 py-0.5 transition-colors hover:bg-muted/50"
                onClick={() => {
                  // Scroll to tabs and filter by this star rating
                  const tabsSection = document.getElementById("product-tabs")
                  if (tabsSection) {
                    const reviewsTab = findReviewsTab(tabsSection)
                    if (reviewsTab) reviewsTab.click()
                    tabsSection.scrollIntoView({ behavior: "smooth", block: "start" })
                    // Dispatch a custom event for the star filter
                    window.dispatchEvent(new CustomEvent("filter-reviews-by-star", { detail: { star } }))
                  }
                }}
                aria-label={`Filter by ${star} star reviews`}
              >
                <span className="w-3 text-right text-xs text-muted-foreground">{star}</span>
                <Star className="size-3 fill-warning text-warning" />
                <Progress value={pct} className="h-2 flex-1" />
                <span className="w-8 text-right text-xs text-muted-foreground">{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right column: preview reviews */}
        <div className="flex flex-col gap-4">
          {previewReviews.length > 0 ? (
            <>
              {previewReviews.map((review) => (
                <div key={review.id} className="flex flex-col gap-1.5 border-b border-border pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`size-3 ${i < review.rating ? "fill-warning text-warning" : "fill-muted text-muted"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-foreground">{review.author}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="gap-1 text-[10px] px-1.5 py-0">
                          <CheckCircle className="size-2.5" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <time dateTime={review.date} className="text-xs text-muted-foreground">
                      {new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </time>
                  </div>
                  {review.title && (
                    <h4 className="text-sm font-medium text-foreground">{review.title}</h4>
                  )}
                  <p className="line-clamp-2 text-sm text-muted-foreground">{review.body}</p>
                </div>
              ))}

              {reviews.length > 5 && (
                <Button variant="outline" className="self-start" onClick={handleShowAllReviews}>
                  Show all {reviews.length} reviews
                </Button>
              )}
              {reviews.length <= 5 && reviews.length > 0 && (
                <Button variant="outline" className="self-start" onClick={handleShowAllReviews}>
                  See all reviews
                </Button>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No reviews yet for this product.</p>
          )}
        </div>
      </div>
    </div>
  )
}

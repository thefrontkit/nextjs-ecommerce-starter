"use client"

import { useState, useEffect, useCallback } from "react"
import type { Product, Review, ProductQuestion } from "@/types"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Star, StarHalf, CheckCircle, ThumbsUp, Pencil, MessageCircle, HelpCircle, ArrowUpDown, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ProductTabsProps {
  product: Product
  specs: Record<string, string>
  reviews: Review[]
  questions?: ProductQuestion[]
}

type SortOption = "recent" | "helpful" | "highest" | "lowest"

function StarDisplay({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }, (_, i) => (
        <Star key={`full-${i}`} className="size-3.5 fill-warning text-warning" />
      ))}
      {hasHalf && <StarHalf className="size-3.5 fill-warning text-warning" />}
      {Array.from({ length: 5 - fullStars - (hasHalf ? 1 : 0) }, (_, i) => (
        <Star key={`empty-${i}`} className="size-3.5 fill-muted text-muted" />
      ))}
    </div>
  )
}

function ReviewBreakdown({
  reviews,
  rating,
  reviewCount,
  starFilter,
  onStarFilter,
}: {
  reviews: Review[]
  rating: number
  reviewCount: number
  starFilter: number | null
  onStarFilter: (star: number | null) => void
}) {
  const total = reviews.length
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.floor(r.rating) === star).length,
  }))

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
      <div className="flex flex-col items-center gap-1">
        <span className="text-5xl font-bold text-foreground">{rating.toFixed(1)}</span>
        <StarDisplay rating={rating} />
        <span className="text-sm text-muted-foreground">{reviewCount.toLocaleString()} reviews</span>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {counts.map(({ star, count }) => (
          <button
            key={star}
            className={cn(
              "flex items-center gap-2 rounded-md px-1 py-0.5 transition-colors",
              starFilter === star
                ? "bg-primary/10 ring-1 ring-primary/30"
                : "hover:bg-muted/50"
            )}
            onClick={() => onStarFilter(starFilter === star ? null : star)}
            aria-label={`Filter by ${star} star reviews`}
            aria-pressed={starFilter === star}
          >
            <span className="w-8 text-right text-sm text-muted-foreground">{star}</span>
            <Star className="size-3.5 fill-warning text-warning" />
            <Progress value={total > 0 ? (count / total) * 100 : 0} className="h-2 flex-1" />
            <span className="w-8 text-sm text-muted-foreground">{count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="transition-all duration-200 hover:shadow-sm">
      <CardContent className="flex flex-col gap-3 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={review.avatar} alt={review.author} />
              <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{review.author}</span>
                {review.verified && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <CheckCircle className="size-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <time dateTime={review.date} className="text-xs text-muted-foreground">
                {new Date(review.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </time>
            </div>
          </div>
          <StarDisplay rating={review.rating} />
        </div>
        <h4 className="font-medium text-foreground">{review.title}</h4>
        <p className="text-base leading-relaxed text-muted-foreground">{review.body}</p>
        <div className="flex items-center gap-3 pt-1">
          <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
            <ThumbsUp className="mr-1.5 size-3" />
            Helpful{review.helpful ? ` (${review.helpful})` : ""}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function WriteReviewForm() {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-6">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Pencil className="size-4" />
          Write a Review
        </h4>
        <div className="flex flex-col gap-2">
          <Label>Your Rating</Label>
          <div className="flex gap-1" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-0.5"
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                role="radio"
                aria-checked={rating === star}
              >
                <Star
                  className={cn(
                    "size-6 transition-colors",
                    (hoveredRating || rating) >= star
                      ? "fill-warning text-warning"
                      : "fill-muted text-muted"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="review-title">Review Title</Label>
          <Input id="review-title" placeholder="Summarize your experience" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="review-body">Your Review</Label>
          <Textarea id="review-body" placeholder="What did you like or dislike? What did you use this product for?" rows={4} />
        </div>
        <Button className="self-start">Submit Review</Button>
      </CardContent>
    </Card>
  )
}

function QuestionCard({ question }: { question: ProductQuestion }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 pt-6">
        <div className="flex items-start gap-3">
          <Avatar className="size-8">
            <AvatarImage src={question.avatar} alt={question.author} />
            <AvatarFallback>{question.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{question.author}</span>
              <time dateTime={question.date} className="text-xs text-muted-foreground">
                {new Date(question.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </time>
            </div>
            <p className="mt-1 text-sm text-foreground">{question.question}</p>
          </div>
        </div>
        {question.answer && (
          <div className="ml-11 rounded-lg bg-muted/50 p-3">
            <div className="mb-1 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Ember Support</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{question.answer}</p>
          </div>
        )}
        <div className="flex items-center gap-3 ml-11">
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
            <ThumbsUp className="mr-1 size-3" />
            Helpful ({question.helpful})
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function AskQuestionForm() {
  const [questionText, setQuestionText] = useState("")
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setQuestionText("")
    toast.success("Question submitted", {
      description: "We'll notify you when your question is answered.",
    })
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-6">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <HelpCircle className="size-4" />
          Ask a Question
        </h4>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Textarea
            placeholder="What would you like to know about this product?"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={3}
            required
          />
          <Button type="submit" className="self-start">Submit Question</Button>
        </form>
      </CardContent>
    </Card>
  )
}

const SORT_LABELS: Record<SortOption, string> = {
  recent: "Most recent",
  helpful: "Most helpful",
  highest: "Highest rated",
  lowest: "Lowest rated",
}

function sortReviews(reviews: Review[], sort: SortOption): Review[] {
  const sorted = [...reviews]
  switch (sort) {
    case "recent":
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    case "helpful":
      return sorted.sort((a, b) => (b.helpful ?? 0) - (a.helpful ?? 0))
    case "highest":
      return sorted.sort((a, b) => b.rating - a.rating)
    case "lowest":
      return sorted.sort((a, b) => a.rating - b.rating)
    default:
      return sorted
  }
}

export function ProductTabs({ product, specs, reviews, questions }: ProductTabsProps) {
  const specEntries = Object.entries(specs)
  const [sortBy, setSortBy] = useState<SortOption>("recent")
  const [starFilter, setStarFilter] = useState<number | null>(null)

  // Listen for custom event from ReviewSnapshot histogram clicks
  const handleStarFilterEvent = useCallback((e: Event) => {
    const detail = (e as CustomEvent<{ star: number }>).detail
    if (detail?.star) {
      setStarFilter((prev) => (prev === detail.star ? null : detail.star))
    }
  }, [])

  useEffect(() => {
    window.addEventListener("filter-reviews-by-star", handleStarFilterEvent)
    return () => window.removeEventListener("filter-reviews-by-star", handleStarFilterEvent)
  }, [handleStarFilterEvent])

  // Apply filtering and sorting
  const filteredReviews = starFilter
    ? reviews.filter((r) => Math.floor(r.rating) === starFilter)
    : reviews
  const sortedReviews = sortReviews(filteredReviews, sortBy)

  return (
    <Tabs defaultValue="description">
      <TabsList>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specs">Specifications</TabsTrigger>
        <TabsTrigger value="reviews">Reviews ({product.reviewCount.toLocaleString()})</TabsTrigger>
        {questions && questions.length > 0 && (
          <TabsTrigger value="qa">Q&A ({questions.length})</TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="description" className="mt-4">
        {product.longDescription ? (
          <div className="flex flex-col gap-4">
            {product.longDescription.split("\n\n").map((para, i) => (
              <p key={i} className="leading-relaxed text-muted-foreground">{para}</p>
            ))}
            {product.features && product.features.length > 0 && (
              <div className="mt-2">
                <h4 className="mb-2 text-sm font-semibold text-foreground">Features</h4>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {product.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="leading-relaxed text-muted-foreground">{product.description}</p>
        )}
      </TabsContent>

      <TabsContent value="specs" className="mt-4">
        <div className="overflow-hidden rounded-xl border border-border">
          {specEntries.map(([key, value], index) => (
            <div
              key={key}
              className={cn(
                "flex items-center px-4 py-3 text-sm",
                index % 2 === 0 ? "bg-muted/50" : "bg-card",
                index < specEntries.length - 1 && "border-b border-border"
              )}
            >
              <span className="w-1/3 font-medium text-foreground">{key}</span>
              <span className="flex-1 text-muted-foreground">{value}</span>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-4">
        <div className="flex flex-col gap-6">
          <ReviewBreakdown
            reviews={reviews}
            rating={product.rating}
            reviewCount={product.reviewCount}
            starFilter={starFilter}
            onStarFilter={setStarFilter}
          />

          {/* Sort + filter controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <div className="flex gap-1">
                {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                  <Button
                    key={option}
                    variant={sortBy === option ? "default" : "ghost"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setSortBy(option)}
                  >
                    {SORT_LABELS[option]}
                  </Button>
                ))}
              </div>
            </div>
            {starFilter !== null && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={() => setStarFilter(null)}
              >
                <X className="size-3" />
                Clear {starFilter}-star filter
              </Button>
            )}
          </div>

          {sortedReviews.length > 0 ? (
            <div className="flex flex-col gap-4">
              {sortedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No {starFilter}-star reviews found.
            </p>
          )}

          <WriteReviewForm />
        </div>
      </TabsContent>

      {questions && questions.length > 0 && (
        <TabsContent value="qa" className="mt-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageCircle className="size-4" />
              <span>{questions.length} questions about this product</span>
            </div>
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
            <AskQuestionForm />
          </div>
        </TabsContent>
      )}
    </Tabs>
  )
}

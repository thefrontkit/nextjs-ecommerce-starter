"use client"

import { useState, useCallback } from "react"
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const goNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <div className="relative h-full w-full">
          {images.map((image, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                selectedIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
            >
              <Zoom zoomMargin={40}>
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="h-full w-full object-cover cursor-zoom-in"
                  width={800}
                  height={800}
                />
              </Zoom>
            </div>
          ))}
        </div>

        {/* Left/right navigation arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 shadow-md size-9"
              onClick={goPrev}
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 shadow-md size-9"
              onClick={goNext}
              aria-label="Next image"
            >
              <ChevronRight className="size-5" />
            </Button>

            {/* Dot indicators for mobile */}
            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 md:hidden">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "size-2 rounded-full transition-all",
                    selectedIndex === index ? "bg-primary w-4" : "bg-background/70"
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="hidden md:block overflow-x-auto">
          <div className="flex gap-2 p-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "relative size-16 shrink-0 rounded-xl bg-muted transition-all sm:size-20",
                  selectedIndex === index
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "opacity-60 hover:opacity-100 ring-1 ring-foreground/10"
                )}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={images[index]}
                  alt={`Product thumbnail ${index + 1}`}
                  className="h-full w-full rounded-xl object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

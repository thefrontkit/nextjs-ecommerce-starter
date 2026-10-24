"use client"

import { useRef, useState, useEffect } from "react"
import type { Product } from "@/types"
import { StickyCartBar } from "@/components/storefront/sticky-cart-bar"
import { PdpActions } from "@/components/storefront/pdp-actions"
import { MobileStickyCart } from "@/components/storefront/pdp-actions"

interface PdpStickyWrapperProps {
  product: Product
  selectedSizeLabel?: string | null
  sizeSelectorId?: string
}

export function PdpStickyWrapper({ product, selectedSizeLabel, sizeSelectorId }: PdpStickyWrapperProps) {
  const ctaRef = useRef<HTMLDivElement>(null)
  const [mobileBarVisible, setMobileBarVisible] = useState(false)

  useEffect(() => {
    const target = ctaRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show the mobile bar only when the inline CTA is NOT visible
        setMobileBarVisible(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <StickyCartBar product={product} targetRef={ctaRef} />
      <div ref={ctaRef}>
        <PdpActions product={product} selectedSizeLabel={selectedSizeLabel} sizeSelectorId={sizeSelectorId} />
      </div>
      <MobileStickyCart
        product={product}
        visible={mobileBarVisible}
        selectedSizeLabel={selectedSizeLabel}
        sizeSelectorId={sizeSelectorId}
      />
    </>
  )
}

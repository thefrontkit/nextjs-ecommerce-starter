import { ProductGridSkeleton, ProductFiltersSkeleton } from "@/components/storefront/skeletons"

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="h-10 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-5 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex gap-8">
        <aside className="hidden w-[260px] shrink-0 lg:block">
          <ProductFiltersSkeleton />
        </aside>
        <div className="flex-1">
          <ProductGridSkeleton />
        </div>
      </div>
    </div>
  )
}

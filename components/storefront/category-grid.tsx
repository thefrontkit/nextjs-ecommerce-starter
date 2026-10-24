import Link from "next/link"
import type { Category } from "@/types"

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="group relative block aspect-[3/4] overflow-hidden"
        >
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3">
            <h3 className="text-sm font-semibold text-white sm:text-base">
              {category.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  )
}

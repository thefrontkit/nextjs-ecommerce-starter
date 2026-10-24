import Link from "next/link"
import { notFound } from "next/navigation"
import { categories, products } from "@/data/seed"
import { CategoryClient } from "./category-client"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = categories.find((c) => c.slug === slug)
  return { title: category?.name ?? "Category" }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  const categoryProducts = products.filter(
    (p) => p.category.toLowerCase() === category.name.toLowerCase() && p.status === "active"
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">Home</Link></li>
          <li>/</li>
          <li><Link href="/products" className="hover:text-foreground">Products</Link></li>
          <li>/</li>
          <li className="text-foreground">{category.name}</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">{category.name}</h1>
        <p className="mt-1 text-base text-muted-foreground">{category.description}</p>
        {category.subcategories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {category.subcategories.map((sub) => (
              <Link
                key={sub.slug}
                href={`/categories/${slug}?sub=${sub.slug}`}
                className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {categoryProducts.length > 0 ? (
        <CategoryClient category={category} products={categoryProducts} />
      ) : (
        <div className="py-16 text-center">
          <p className="text-lg text-muted-foreground">No products found in this category.</p>
        </div>
      )}
    </div>
  )
}

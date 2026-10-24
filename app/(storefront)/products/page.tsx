import type { Metadata } from "next"
import { ProductsPageClient } from "./products-client"

export const metadata: Metadata = { title: "All Products" }

export default function ProductsPage() {
  return <ProductsPageClient />
}

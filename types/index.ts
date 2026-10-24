// ============================================================
// Core Domain Types
// ============================================================

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  brand: string
  longDescription?: string
  features?: string[]
  price: number
  salePrice?: number
  category: string
  subcategory?: string
  tags: string[]
  status: "active" | "draft" | "archived"
  stock: number
  sku: string
  image: string
  images: string[]
  variants: ProductVariant[]
  specs: Record<string, string>
  rating: number
  reviewCount: number
  createdAt: string
}

export interface ProductVariant {
  id: string
  name: string
  type: "size" | "color"
  value: string
  stock: number
  priceAdjustment: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  subcategories: { name: string; slug: string }[]
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedVariants: { type: string; value: string }[]
}

export interface Order {
  id: string
  customer: string
  customerId: string
  email: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "paid" | "pending" | "refunded" | "failed"
  total: number
  subtotal: number
  shipping: number
  tax: number
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  trackingNumber?: string
  notes: OrderNote[]
  date: string
  estimatedDelivery?: string
}

export interface OrderItem {
  id: string
  productId: string
  name: string
  image: string
  variant: string
  quantity: number
  price: number
}

export interface OrderNote {
  id: string
  message: string
  author: string
  date: string
}

export interface Customer {
  id: string
  name: string
  email: string
  avatar: string
  phone?: string
  totalOrders: number
  totalSpent: number
  joinedAt: string
  addresses: Address[]
  notes?: string
}

export interface Address {
  id: string
  label: string
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

export interface DiscountCode {
  id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  minOrderAmount: number
  usageLimit: number
  usageCount: number
  applicableCategories: string[]
  expiresAt: string
  status: "active" | "expired" | "disabled"
  createdAt: string
}

export interface Review {
  id: string
  productId?: string
  author: string
  avatar: string
  rating: number
  title: string
  body: string
  date: string
  verified: boolean
  helpful?: number
}

export interface Testimonial {
  id: string
  author: string
  role: string
  avatar: string
  content: string
  rating: number
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}

// ============================================================
// Dashboard / Analytics Types
// ============================================================

export interface WishlistItem {
  product: Product
  addedAt: string
  previousPrice?: number
}

export interface DashboardStat {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  sparkline?: number[]
}

export interface RevenueDataPoint {
  date: string
  revenue: number
  orders: number
}

export interface TopProduct {
  id: string
  name: string
  revenue: number
  unitsSold: number
  image: string
}

export interface ConversionStep {
  name: string
  value: number
  percentage: number
}

export interface CategoryRevenue {
  category: string
  revenue: number
  fill: string
}

// ============================================================
// Navigation Types
// ============================================================

export interface NavItem {
  title: string
  href: string
  icon?: string
  badge?: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

// ============================================================
// Extended Commerce Types
// ============================================================

export interface ProductBundle {
  productId: string
  companionIds: string[]
}

export interface ProductQuestion {
  id: string
  author: string
  avatar: string
  question: string
  date: string
  answer?: string
  helpful: number
}

export interface PaymentMethod {
  id: string
  type: "visa" | "mc" | "amex"
  last4: string
  expMonth: number
  expYear: number
  cardholderName: string
  isDefault: boolean
}

export interface ReturnRequest {
  id: string
  orderId: string
  customerName: string
  customerEmail: string
  items: { name: string; quantity: number; reason: string }[]
  status: "pending" | "approved" | "received" | "refunded" | "denied"
  refundMethod: "original" | "store_credit"
  refundAmount: number
  dates: { requested: string; approved?: string; received?: string; refunded?: string }
}

export interface UserReview extends Review {
  productId: string
  productName: string
  productImage: string
}

export interface AdminReview extends Review {
  productId: string
  productName: string
  status: "pending" | "approved" | "flagged" | "rejected"
  response?: string
}

export interface Collection {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productIds: string[]
}

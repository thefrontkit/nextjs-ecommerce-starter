import { Separator } from "@/components/ui/separator"

interface OrderSummaryProps {
  subtotal: number
  shipping: number
  tax: number
  total: number
  discount?: number
}

export function OrderSummary({ subtotal, shipping, tax, total, discount = 0 }: OrderSummaryProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">Order Summary</h3>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="text-foreground">${subtotal.toFixed(2)}</span>
      </div>
      {discount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-chart-3">Discount</span>
          <span className="text-chart-3">-${discount.toFixed(2)}</span>
        </div>
      )}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Shipping</span>
        <span className="text-foreground">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Tax</span>
        <span className="text-foreground">${tax.toFixed(2)}</span>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-foreground">Total</span>
        <span className="text-lg font-bold text-foreground">${total.toFixed(2)}</span>
      </div>
    </div>
  )
}

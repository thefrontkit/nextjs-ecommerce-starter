"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

interface NotifyMeFormProps {
  productName: string
}

export function NotifyMeForm({ productName }: NotifyMeFormProps) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    toast.success("You're on the list!", {
      description: `We'll notify you at ${email} when ${productName} is back in stock.`,
    })
  }

  return (
    <Card className="border-dashed">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Bell className="size-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Out of Stock</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get notified when this item is back in stock.
            </p>
          </div>
          {submitted ? (
            <p className="text-sm font-medium text-primary">
              We&apos;ll email you when it&apos;s available!
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email for stock notification"
              />
              <Button type="submit" className="shrink-0">
                <Bell className="mr-2 size-4" />
                Notify Me
              </Button>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

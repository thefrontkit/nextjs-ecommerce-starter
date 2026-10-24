"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const currencies = [
  { code: "USD" },
  { code: "EUR" },
  { code: "GBP" },
  { code: "INR" },
]

export function CurrencySelector() {
  const [selected, setSelected] = useState("USD")
  const [open, setOpen] = useState(false)
  const current = currencies.find((c) => c.code === selected)!

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={
        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs" />
      }>
        <span>{current.code}</span>
      </PopoverTrigger>
      <PopoverContent className="w-32 p-1" align="end">
        {currencies.map((currency) => (
          <button
            key={currency.code}
            onClick={() => { setSelected(currency.code); setOpen(false) }}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
          >
            <span>{currency.code}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const sizeData = [
  { size: "S", chest: "34-36", waist: "28-30", hip: "36-38" },
  { size: "M", chest: "38-40", waist: "32-34", hip: "40-42" },
  { size: "L", chest: "42-44", waist: "36-38", hip: "44-46" },
  { size: "XL", chest: "46-48", waist: "40-42", hip: "48-50" },
]

export function SizeGuideDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2" />
        }
      >
        Size Guide
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Size</TableHead>
                <TableHead>Chest (in)</TableHead>
                <TableHead>Waist (in)</TableHead>
                <TableHead>Hip (in)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sizeData.map((row) => (
                <TableRow key={row.size}>
                  <TableCell className="font-medium">{row.size}</TableCell>
                  <TableCell>{row.chest}</TableCell>
                  <TableCell>{row.waist}</TableCell>
                  <TableCell>{row.hip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium text-foreground mb-2">How to Measure</p>
            <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
              <li><strong>Chest:</strong> Measure around the fullest part of your chest</li>
              <li><strong>Waist:</strong> Measure around your natural waistline</li>
              <li><strong>Hip:</strong> Measure around the fullest part of your hips</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

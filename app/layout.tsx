import type { Metadata } from "next"
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import { SkipLink } from "@/components/layout/skip-link"
import "./globals.css"

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
})

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Ember — Fashion & Lifestyle",
    template: "%s | Ember",
  },
  description:
    "A complete Next.js e-commerce starter with storefront, checkout, customer accounts, and admin panel — 31 screens ready to customize.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bricolage.variable} ${figtree.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SkipLink />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

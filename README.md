# Next.js E-commerce Storefront (Free)

A free, open-source e-commerce storefront built with **Next.js 16**, **Tailwind CSS v4** and **shadcn/ui**. Clone it, swap in your products, and you've got a fast, accessible shop front to build on.

Made by [thefrontkit](https://thefrontkit.com?utm_source=github&utm_medium=storefront-lite&utm_campaign=readme).

## What's included

- **Home page**: hero, category grid, deals with a countdown, brand strip, trending products, customer photo grid
- **Product listing**: filters (category, brand, price, size, color, rating), sorting, grid and list views, pagination
- **Product page**: image gallery with zoom, size and color pickers, reviews, questions, "frequently bought together", recently viewed
- **Category pages and search**
- **Cart**: quantities, promo code field, save for later, order summary with shipping and tax
- **Light and dark mode**, with colors set as design tokens so a rebrand is one file
- **Accessibility built in**: skip link, keyboard navigation, visible focus states, labelled controls

Everything runs on local seed data in `data/seed.ts`, so it works the moment you install it.

## What's not included

This is the storefront only. There's no checkout, no customer accounts, no admin panel and no backend. Buttons that lead there point to the full kit.

| You need | Get |
|---|---|
| Checkout, customer accounts and an admin panel (56 screens, bring your own backend) | [E-commerce Kit](https://thefrontkit.com/apps/ecommerce-kit?utm_source=github&utm_medium=storefront-lite&utm_campaign=readme) · [live demo](https://ecommerce-kit-code.vercel.app) |
| All of that plus Supabase (database, auth, storage) and Stripe Checkout already wired | [Full-Stack E-commerce Kit](https://thefrontkit.com/apps/ecommerce-fullstack-kit?utm_source=github&utm_medium=storefront-lite&utm_campaign=readme) · [live demo](https://ecommerce-supabase-code.vercel.app) |

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # lint
```

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4 with OKLCH color tokens
- shadcn/ui (Base UI primitives), lucide-react icons
- next-themes for dark mode

## Customizing

- **Products and categories:** edit `data/seed.ts`, or replace it with calls to your own API.
- **Brand colors and fonts:** edit the tokens in `app/globals.css`.
- **Store name:** the demo store is called "Ember". Search for it in `components/layout` to rename.

## Images

Product images are loaded from [Unsplash](https://unsplash.com) and are covered by the [Unsplash License](https://unsplash.com/license). Replace them with your own product photos before you launch.

## License

MIT. Use it for personal and commercial projects, including client work.

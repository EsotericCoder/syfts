# Syfts 👟

A running shoe deals website built with Next.js, Tailwind CSS, and Vercel. Find price drops, clearance sales, and coupon codes on popular running shoes.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import your repo
3. Add environment variables from `.env.example`
4. Deploy — done

## Architecture

```
app/
  page.tsx          → Homepage with deal listings
  api/cron/route.ts → Price-checking cron job (runs every 6hrs)
components/
  DealsPage.tsx     → Main client component (search, filter, grid)
  DealCard.tsx      → Individual deal card
lib/
  types.ts          → TypeScript types
vercel.json         → Cron schedule config
```

## Next Steps

1. **Database**: Add Vercel Postgres (`npx vercel env pull`) to store deals
2. **Price tracking**: Wire up Keepa API or Amazon PA API in the cron route
3. **Affiliate links**: Sign up for Amazon Associates, CJ Affiliate (Nike), etc.
4. **Email alerts**: Add Resend or Mailchimp for the subscribe form
5. **SEO**: Add per-shoe pages with price history for organic traffic

## Cost

$0/month on Vercel free tier. Upgrade when revenue justifies it.

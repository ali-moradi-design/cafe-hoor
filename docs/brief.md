# Cafe site (Hoor Family): brief

Decisions from 2026-10-21. Demo 7 in notes/demos.md. Built in its own repo and
sessions; this file is the handoff.

## Decisions

- The cafe is real: Instagram page https://www.instagram.com/hoorfamily/ . The
  owner has given permission to use the brand, photos, menu and prices.
- Static site (roadmap phase 7 deploy). Repo `ali-moradi-design/cafe-hoor` (public,
  created by the user); subdomain `cafe-hoor.ali-moradi-develop.com`.
- Languages: English and Persian (Persian RTL; logical CSS; Vazirmatn; Persian
  digits in Persian, Latin digits in English).
- One menu for all tables: one QR code that opens `/menu` (no per-table QR,
  no ordering).
- Built from scratch (no third-party template).
- Stack: Next.js (App Router, static export) with Feature-Sliced Design,
  TypeScript, ESLint, Prettier and pnpm (changed from Astro on 2026-10-21 by the
  user). Explain each decision as it appears (static export limits, FSD layer
  boundaries), the same way the roadmap teaches CI/CD.

## Step 1: collect the content from Instagram

Instagram requires a login and blocks cloud IPs (checked 2026-10-21: `401`,
`require_login`). So this step runs on the user's own computer (Claude desktop,
local session), not in a cloud session.

- Tool: `gallery-dl` (or `instaloader`) with the user's browser cookies
  (`--cookies-from-browser`), slow rate (sleep between requests) to avoid
  rate limits. Download posts, carousels, reels covers, highlights, captions
  and post dates into `content-raw/` (NOT committed; add to `.gitignore`).
- Better quality: ask the owner for the original photo files too; prefer them
  over Instagram copies when both exist.
- Menu and prices: read them from captions and from menu photos/highlights
  (Claude reads the images). Use the newest post when a price appears more
  than once. Write the result to `content/menu/` as data (category, item,
  description, price, photo) and list every price with its source post and
  date in `docs/menu-sources.md`. Mark unclear prices; the user checks the
  final list with the owner before publishing.
- Also collect: logo, colors and mood of the page, address, opening hours,
  phone, map location, signature items.
- Currency: as on the page (probably toman), stored as an integer with a
  currency code and formatted with `Intl` in both languages.

## Pages

- Home: hero photo, short story, signature items, opening hours, link to menu.
- Menu (`/menu`, the QR page): fast on a phone, categories as sticky tabs,
  item photo, description, price; search; works offline after the first visit
  is a nice-to-have, not required.
- Gallery: Instagram photos in a grid with a lightbox.
- About and Contact: story, address, map, hours, phone, Instagram link.
- A printable QR page (one QR code to `/menu`) for the tables.

## Stack (confirmed 2026-10-21)

- Next.js App Router with `output: 'export'` (static HTML, deployed with the
  roadmap's phase 7 rsync pipeline; no Node server, no middleware, no API
  routes). Server Components by default; `'use client'` only where needed
  (menu search, sticky tabs, lightbox, map, language switch).
- TypeScript strict; pnpm.
- Feature-Sliced Design: `app` (Next.js routes and providers), `views` (page
  compositions; FSD's `pages` layer is renamed so it does not clash with the
  Next.js `pages` router), `widgets`, `features`, `entities`, `shared`. Imports
  only go downward, each slice exposes a public `index.ts`; enforced with
  `eslint-plugin-boundaries` (or Steiger).
- Menu, categories and site info as JSON files in `content/`, validated with
  Zod schemas at build time (English and Persian text per item).
- i18n: typed dictionaries in `src/shared/i18n` (no `next-intl`: two
  languages and a static site do not need it), locale segments (`/fa/...`,
  `/en/...`) with `generateStaticParams`; `/` and `/menu/` are static pages that
  redirect to the Persian site (the table QR code points to `/menu/`).
- Images: only the cafe's Instagram photos (the owner's permission covers them).
  `next/image` cannot optimize in a static export, so `scripts/build-photos.mjs`
  (sharp) writes AVIF/WebP/JPEG in 480/960/1600 px before every build; the
  selected originals (≤2000 px) live in `assets/photos/` and are listed in
  `content/photos.json`.
- Menu and prices: from the cafe's snapp-store digital menu (no hookah); the
  English site shows approximate dollar prices from `content/pricing.json`.
- Tailwind CSS v4; small motion with CSS or Motion.
- PhotoSwipe for the gallery, Leaflet + OpenStreetMap for the map, `qrcode` for the one QR.
- SEO: Metadata API, `CafeOrCoffeeShop` and `Menu` JSON-LD, `sitemap.ts`,
  OG image, `hreflang` alternates.
- Quality: ESLint + Prettier, Vitest for the data helpers, Playwright E2E
  (menu, language switch, RTL) + axe; Lighthouse in CI; GitHub Actions with a
  required check on `main`.

## UI

- The look follows the cafe's own brand and Instagram mood (colors, logo).
- Mockups first as images (HTML/CSS rendered to PNG with Playwright): home and
  menu on a phone, in English and Persian. No UI code before the user approves.

## How the build session starts

1. Check prerequisites: `git`, `node` (LTS), `pnpm`, `python` + `gallery-dl`;
   the folder is a clone of the repo, clean; GitHub access; Playwright runs;
   the user is logged in to Instagram in a local browser.
2. Copy this brief into the repo as `docs/brief.md`.
3. Step 1 (content collection), then review the menu and prices with the user.
4. Mockups for approval.
5. Build step by step in small PRs (branch → PR → CI → squash merge),
   explaining each decision as it appears.

Language rules: explain in Persian, every English term inside parentheses and
backticks, never start a line with an English word, repo files in English.

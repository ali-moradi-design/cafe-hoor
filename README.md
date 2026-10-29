# Hoor Cafe & Restaurant

Bilingual (Persian / English) static website for
[Hoor Cafe & Restaurant](https://www.instagram.com/hoorfamily/), Haft-e Tir, Tehran.
Live address (planned): `https://cafe-hoor.ali-moradi-develop.com`.

- Pages: home, menu (the page behind the table QR code), gallery, about, contact,
  and a printable QR page. Persian is right-to-left with Persian digits; English
  shows prices in approximate US dollars.
- Stack: Next.js 16 (App Router, `output: "export"`), TypeScript strict,
  Feature-Sliced Design, Tailwind CSS v4, Zod, PhotoSwipe, Leaflet.
- Background and decisions: [docs/brief.md](docs/brief.md). Where every menu item
  and price comes from: [docs/menu-sources.md](docs/menu-sources.md).

## Commands

```bash
pnpm install
pnpm dev            # photos + dev server on http://localhost:3000
pnpm build          # photos + Next.js standalone server in .next/standalone
pnpm preview        # run that server on http://127.0.0.1:4321, like production
pnpm lint           # ESLint, including the FSD layer rules
pnpm typecheck
pnpm test           # Vitest: helpers and content rules
pnpm test:e2e       # Playwright + axe on the built site (run `pnpm build` first)
pnpm format         # Prettier
```

## Project layout

```text
content/            menu, categories, prices (USD rate), cafe info, photo list (JSON, Zod-checked)
assets/photos/      selected Instagram photos (originals, at most 2000 px)
scripts/            photo import/build, menu import, standalone copy step, local server
src/app/            Next.js routes: [locale]/… (/ and /menu/ redirect in next.config.ts)
src/views/          one composition per page
src/widgets/        header, footer, menu board, gallery, map, visit info
src/features/       language switch, menu search
src/entities/       cafe, menu (data, formatting, cards)
src/shared/         i18n, photos, UI kit, helpers, config
e2e/                Playwright tests
```

Layers import only downward and slices on the same layer never import each other;
`eslint-plugin-boundaries` enforces it.

## Updating content

- **Prices or menu**: save the cafe's snapp-store menu page as
  `content-raw/snapp-menu/menu.html` (from an Iranian IP), extract
  `menu-clean.json` from its `__NEXT_DATA__`, then run
  `python scripts/import-menu.py .`. English names live in that script.
- **Dollar rate**: edit `content/pricing.json` (`tomanPerUsd` and `date`).
- **Photos**: add an entry to `content/photos.json` with the Instagram file name in
  `source`, put the file in `content-raw/images/`, run `pnpm photos:import`.

`content-raw/` (Instagram downloads, saved pages) is never committed.

## Deploying

The site runs as a Next.js `standalone` server in a container on the VPS
(https://cafe-hoor.ali-moradi-develop.com). The image holds only the build
output (`.next/standalone`, see `Dockerfile`). `.github/workflows/docker.yml`
builds it after CI passes on `main`, pushes `ghcr.io/ali-moradi-design/cafe-hoor-web:<sha>`
and deploys it with deploy-kit. Server files: `deploy/compose.yaml`
(`/srv/apps/cafe-hoor`, port 3103) and `deploy/nginx.conf`.

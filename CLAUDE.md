# Project instructions

Cafe site for Hoor Family (demo 7 of the portfolio roadmap). The full brief is
[docs/brief.md](docs/brief.md); read it at the start of every session.

## Workflow

- Stack: Next.js App Router with static export, Feature-Sliced Design,
  TypeScript strict, ESLint, Prettier, pnpm (details in the brief). Explain
  each decision as it appears.
- FSD layers: `app`, `views` (FSD `pages`, renamed), `widgets`, `features`,
  `entities`, `shared`. Imports only go downward through each slice's public
  `index.ts`.
- Build in small PRs: branch → PR → CI → squash merge into `main`.
- `content-raw/` holds raw Instagram downloads and saved pages; never commit it,
  never delete the original photo files in it.
- Photos come from the cafe's Instagram. A dish with no Instagram photo gets a
  free Pexels stock photo (`stock.url` in content/photos.json), shown with a
  "sample photo" label (decided 2026-10-22). Prices only from the snapp-store
  menu. No hookah anywhere on the site. English prices are in US dollars.
- Before calling work done: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`,
  `pnpm test`, `pnpm build`, `pnpm test:e2e`.

## Language

- Always explain in Persian (Farsi). Every English term goes inside parentheses
  and backticks; never start a line or bullet with an English word; put a
  RIGHT-TO-LEFT MARK (U+200F) at the start of every bullet and after every
  English term. The user's messages have typos; never copy their spelling.
- Files in this repo are written in English.

## graphify

Use graphify in this repo (decided 2026-10-21). The graph of `src/` is in
`graphify-out/` (not committed); read `graphify-out/GRAPH_REPORT.md` for
architecture questions and run `/graphify src --update` after larger changes.

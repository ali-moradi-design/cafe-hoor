# Graph Report - src  (2026-10-21)

## Corpus Check
- Corpus is ~6,996 words - fits in a single context window. You may not need a graph.

## Summary
- 217 nodes · 717 edges · 8 communities (7 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Menu Data & Tests
- Locale Page Routes
- Redirects & Sitemap
- Photos & Gallery
- Cafe Entity & SEO
- Shared UI & Locale Switch
- Icons, Digits & Search
- Location Map

## God Nodes (most connected - your core abstractions)
1. `getDictionary()` - 28 edges
2. `Locale` - 24 edges
3. `isLocale()` - 23 edges
4. `Container()` - 19 edges
5. `HomeView()` - 18 edges
6. `localePath()` - 17 edges
7. `pageMetadata()` - 15 edges
8. `getCafe()` - 14 edges
9. `cn()` - 14 edges
10. `Photo()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Page()` --calls--> `AboutView()`  [EXTRACTED]
  app/[locale]/about/page.tsx → views/about/ui/about-view.tsx
- `Page()` --calls--> `GalleryView()`  [EXTRACTED]
  app/[locale]/gallery/page.tsx → views/gallery/ui/gallery-view.tsx
- `LocaleLayout()` --calls--> `SiteFooter()`  [EXTRACTED]
  app/[locale]/layout.tsx → widgets/site-footer/ui/site-footer.tsx
- `LocaleLayout()` --calls--> `SiteHeader()`  [EXTRACTED]
  app/[locale]/layout.tsx → widgets/site-header/ui/site-header.tsx
- `Page()` --calls--> `MenuView()`  [EXTRACTED]
  app/[locale]/menu/page.tsx → views/menu/ui/menu-view.tsx

## Import Cycles
- None detected.

## Communities (8 total, 1 thin omitted)

### Community 0 - "Menu Data & Tests"
Cohesion: 0.09
Nodes (30): categories, categoryIds, getMenu(), getPricing(), getSignatureItems(), items, pricing, formatPrice() (+22 more)

### Community 1 - "Locale Page Routes"
Cohesion: 0.16
Nodes (22): generateMetadata(), Page(), generateMetadata(), Page(), generateMetadata(), Page(), dynamicParams, generateMetadata() (+14 more)

### Community 2 - "Redirects & Sitemap"
Cohesion: 0.15
Nodes (17): MenuRedirectPage(), RootPage(), RedirectTo(), dynamic, paths, sitemap(), defaultLocale, intlLocale (+9 more)

### Community 3 - "Photos & Gallery"
Cohesion: 0.17
Nodes (13): byId, getGalleryPhotos(), Photo, PHOTO_WIDTHS, photoLargest(), photos, photoSchema, photoSrcSet() (+5 more)

### Community 4 - "Cafe Entity & SEO"
Cohesion: 0.14
Nodes (10): dynamic, cafe, Cafe, cafeSchema, localized, time, CafeJsonLd(), siteUrl (+2 more)

### Community 5 - "Shared UI & Locale Switch"
Cohesion: 0.15
Nodes (10): LocaleSwitch(), cn(), ButtonLink(), Variant, variants, Container(), SectionHeading(), AboutView() (+2 more)

### Community 6 - "Icons, Digits & Search"
Cohesion: 0.29
Nodes (14): formatHours(), MenuSearch(), localizeDigits(), ClockIcon(), CupIcon(), IconProps, InstagramIcon(), LeafIcon() (+6 more)

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDictionary()` connect `Locale Page Routes` to `Menu Data & Tests`, `Redirects & Sitemap`, `Photos & Gallery`, `Cafe Entity & SEO`, `Shared UI & Locale Switch`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `Menu Data & Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.09071117561683599 - nodes in this community are weakly interconnected._
- **Why does `Locale` connect `Redirects & Sitemap` to `Menu Data & Tests`, `Locale Page Routes`, `Photos & Gallery`, `Cafe Entity & SEO`, `Shared UI & Locale Switch`, `Icons, Digits & Search`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `Cafe Entity & SEO` be split into smaller, more focused modules?**
  _Cohesion score 0.14492753623188406 - nodes in this community are weakly interconnected._
- **Why does `localePath()` connect `Redirects & Sitemap` to `Menu Data & Tests`, `Locale Page Routes`, `Shared UI & Locale Switch`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
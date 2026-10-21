"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { MenuItemCard, type MenuCategory, type MenuItem, type Pricing } from "@/entities/menu";
import { filterMenuItems, MenuSearch } from "@/features/search-menu";
import type { Locale } from "@/shared/i18n";
import { cn } from "@/shared/lib";

type Labels = {
  search: string;
  noResults: string;
  priceSoon: string;
  signature: string;
  categories: string;
};

/**
 * The QR menu as a printed menu card: a framed sheet with centred section titles and
 * two columns of items. A small sticky box at the top names the section on screen
 * and opens a list of all sections; search filters every section at once.
 */
export function MenuBoard({
  categories,
  items,
  locale,
  pricing,
  labels,
  logo,
}: {
  categories: MenuCategory[];
  items: MenuItem[];
  locale: Locale;
  pricing: Pricing;
  labels: Labels;
  logo: { src: string; alt: string };
}) {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(categories[0]?.id);
  const [open, setOpen] = useState(false);
  const jumpRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => {
    const visible = filterMenuItems(items, query, locale);
    return categories
      .map((category) => ({
        category,
        items: visible.filter((item) => item.category === category.id),
      }))
      .filter((group) => group.items.length > 0);
  }, [categories, items, query, locale]);

  // Name the section at the top of the screen in the sticky box.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries.find((entry) => entry.isIntersecting);
        if (top) setActiveId(top.target.id.replace(/^cat-/, ""));
      },
      { rootMargin: "-120px 0px -65% 0px" },
    );
    for (const group of groups) {
      const section = document.getElementById(`cat-${group.category.id}`);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [groups]);

  // Close the section list on a click outside it.
  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!jumpRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  const active = categories.find((category) => category.id === activeId) ?? categories[0];

  return (
    <div>
      <div className="sticky top-20 z-30 mb-8 flex flex-wrap items-start gap-3 lg:top-28">
        <div ref={jumpRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-sections"
            className="flex min-h-11 min-w-44 items-center gap-2 border border-pine bg-mint-soft px-4 font-display text-lg text-pine"
          >
            <span aria-hidden className={cn("text-xs transition-transform", open && "rotate-90")}>
              ▶
            </span>
            <span className="sr-only">{labels.categories}: </span>
            {active?.title[locale]}
          </button>
          <nav
            id="menu-sections"
            aria-label={labels.categories}
            hidden={!open}
            className="absolute start-0 top-full mt-1 max-h-[60svh] w-60 overflow-y-auto border border-pine bg-white shadow-lg"
          >
            <ul>
              {groups.map(({ category }) => (
                <li key={category.id}>
                  <a
                    href={`#cat-${category.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={category.id === activeId ? "true" : undefined}
                    className={cn(
                      "block px-4 py-2.5 font-display text-lg hover:bg-mint-soft",
                      category.id === activeId ? "text-red-deep" : "text-pine",
                    )}
                  >
                    {category.title[locale]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="min-w-56 flex-1 sm:max-w-sm">
          <MenuSearch value={query} onChange={setQuery} label={labels.search} />
        </div>
      </div>

      <div className="border border-pine/80 px-4 py-10 sm:px-10 lg:px-16">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized logo */}
        <img
          src={logo.src}
          alt={logo.alt}
          width={96}
          height={96}
          className="mx-auto mb-4 size-24 rounded-full"
        />

        {groups.length === 0 ? (
          <p className="py-16 text-center text-lg text-pine" role="status">
            {labels.noResults}
          </p>
        ) : (
          groups.map(({ category, items: groupItems }) => (
            <section
              key={category.id}
              id={`cat-${category.id}`}
              aria-labelledby={`cat-title-${category.id}`}
              className="scroll-mt-40 pt-10"
            >
              <h2
                id={`cat-title-${category.id}`}
                className="mb-6 text-center font-display text-3xl text-pine uppercase"
              >
                {category.title[locale]}
              </h2>
              <div className="grid gap-x-12 gap-y-5 md:grid-cols-2">
                {groupItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    locale={locale}
                    pricing={pricing}
                    labels={labels}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

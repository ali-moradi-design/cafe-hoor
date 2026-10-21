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

/** The QR menu: search, sticky category tabs that follow the scroll, items per category. */
export function MenuBoard({
  categories,
  items,
  locale,
  pricing,
  labels,
}: {
  categories: MenuCategory[];
  items: MenuItem[];
  locale: Locale;
  pricing: Pricing;
  labels: Labels;
}) {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(categories[0]?.id);
  const tabsRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => {
    const visible = filterMenuItems(items, query, locale);
    return categories
      .map((category) => ({
        category,
        items: visible.filter((item) => item.category === category.id),
      }))
      .filter((group) => group.items.length > 0);
  }, [categories, items, query, locale]);

  // Highlight the tab of the section at the top of the screen.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries.find((entry) => entry.isIntersecting);
        if (top) setActiveId(top.target.id.replace(/^cat-/, ""));
      },
      { rootMargin: "-140px 0px -60% 0px" },
    );
    for (const group of groups) {
      const section = document.getElementById(`cat-${group.category.id}`);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [groups]);

  // Keep the active tab visible in the horizontal tab bar. Scroll only the bar:
  // `scrollIntoView` would also move the page.
  useEffect(() => {
    const bar = tabsRef.current;
    const tab = bar?.querySelector<HTMLElement>(`[data-tab="${activeId}"]`);
    if (!bar || !tab) return;
    const barBox = bar.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();
    const offset = tabBox.left - barBox.left - (barBox.width - tabBox.width) / 2;
    if (Math.abs(offset) > 4) bar.scrollBy({ left: offset, behavior: "smooth" });
  }, [activeId]);

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-4 border-b border-sand bg-cream/95 px-4 pt-3 pb-2 backdrop-blur sm:-mx-6 sm:px-6">
        <MenuSearch value={query} onChange={setQuery} label={labels.search} />
        <nav aria-label={labels.categories} className="mt-3">
          <div ref={tabsRef} className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {groups.map(({ category }) => (
              <a
                key={category.id}
                href={`#cat-${category.id}`}
                data-tab={category.id}
                aria-current={activeId === category.id ? "true" : undefined}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-sm font-bold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-gold",
                  activeId === category.id
                    ? "bg-forest text-cream"
                    : "border border-forest/25 bg-white text-forest hover:border-forest",
                )}
              >
                {category.title[locale]}
              </a>
            ))}
          </div>
        </nav>
      </div>

      {groups.length === 0 ? (
        <p className="py-16 text-center text-ink/60" role="status">
          {labels.noResults}
        </p>
      ) : (
        groups.map(({ category, items: groupItems }) => (
          <section
            key={category.id}
            id={`cat-${category.id}`}
            aria-labelledby={`cat-title-${category.id}`}
            className="scroll-mt-36 pt-8"
          >
            <h2
              id={`cat-title-${category.id}`}
              className="mb-4 text-2xl font-extrabold text-forest"
            >
              {category.title[locale]}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
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
  );
}

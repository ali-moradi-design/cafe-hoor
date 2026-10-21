"use client";

import { Fragment, useEffect, useMemo, useState } from "react";

import {
  MenuItemLines,
  menuSymbol,
  type MenuCategory,
  type MenuItem,
  type Pricing,
} from "@/entities/menu";
import { filterMenuItems, MenuSearch } from "@/features/search-menu";
import type { Locale } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { RepelField } from "@/shared/ui";

type Labels = {
  search: string;
  noResults: string;
  priceSoon: string;
  signature: string;
  categories: string;
};

/**
 * The full QR menu: each section under a ruled title, its dishes in up to three
 * even columns (with their photos where there are some). A search bar with the
 * section links stays at the top and marks the section on screen.
 */
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

  const groups = useMemo(() => {
    const visible = filterMenuItems(items, query, locale);
    return categories
      .map((category) => ({
        category,
        items: visible.filter((item) => item.category === category.id),
      }))
      .filter((group) => group.items.length > 0);
  }, [categories, items, query, locale]);

  // The section under the bar is marked in the bar and scrolled into its view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries.find((entry) => entry.isIntersecting);
        if (!top) return;
        const id = top.target.id.replace(/^cat-/, "");
        setActiveId(id);
        document
          .querySelector(`[data-section-link="${id}"]`)
          ?.scrollIntoView({ block: "nearest", inline: "center" });
      },
      { rootMargin: "-140px 0px -60% 0px" },
    );
    for (const group of groups) {
      const section = document.getElementById(`cat-${group.category.id}`);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [groups]);

  return (
    <div>
      <div className="sticky top-0 z-20 bg-night pt-3 pb-3 shadow-[0_0_0_100vmax_var(--color-night)] [clip-path:inset(0_-100vmax)]">
        <div className="mx-auto max-w-md">
          <MenuSearch value={query} onChange={setQuery} label={labels.search} />
        </div>
        <nav
          aria-label={labels.categories}
          className="mt-3 no-scrollbar overflow-x-auto [mask-image:linear-gradient(to_right,transparent,#000_2rem,#000_calc(100%-2rem),transparent)]"
        >
          <ul className="mx-auto flex w-max items-center gap-1 px-8 text-[12px] whitespace-nowrap rtl:font-display rtl:text-[15px]">
            {groups.map(({ category }) => {
              const active = category.id === activeId;
              return (
                <li key={category.id}>
                  <a
                    href={`#cat-${category.id}`}
                    data-section-link={category.id}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "inline-flex min-h-9 items-center rounded-full border px-3.5 uppercase transition-colors rtl:leading-[2.4]",
                      active
                        ? "border-white bg-white text-night"
                        : "border-white/25 hover:border-white",
                    )}
                  >
                    {category.title[locale]}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {groups.length === 0 ? (
        <p className="py-24 text-center text-[14px]" role="status">
          {labels.noResults}
        </p>
      ) : (
        <RepelField key={query}>
          {groups.map(({ category, items: groupItems }) => {
            return (
              <Fragment key={category.id}>
                <section
                  id={`cat-${category.id}`}
                  aria-labelledby={`cat-title-${category.id}`}
                  className="scroll-mt-36 pt-20"
                >
                  <h2
                    id={`cat-title-${category.id}`}
                    className="mx-auto mb-10 flex max-w-[900px] items-center gap-5 text-[12px] tracking-[0.14em] uppercase rtl:font-display rtl:text-2xl rtl:leading-[2.3] rtl:tracking-normal"
                  >
                    <span aria-hidden className="h-px flex-1 bg-white/25" />
                    <span>
                      <span aria-hidden className="me-2 text-dim">
                        {menuSymbol(category.id)}
                      </span>
                      {category.title[locale]}
                    </span>
                    <span aria-hidden className="h-px flex-1 bg-white/25" />
                  </h2>
                  <div className="mx-auto grid max-w-[900px] gap-x-14 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
                    {groupItems.map((item) => (
                      <MenuItemLines
                        key={item.id}
                        item={item}
                        locale={locale}
                        pricing={pricing}
                        labels={labels}
                        className="border-t border-white/15 pt-4"
                      />
                    ))}
                  </div>
                </section>
              </Fragment>
            );
          })}
        </RepelField>
      )}
    </div>
  );
}

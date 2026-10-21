"use client";

import { Fragment, useMemo, useState } from "react";

import {
  MenuItemLines,
  menuSymbol,
  type MenuCategory,
  type MenuItem,
  type Pricing,
} from "@/entities/menu";
import { filterMenuItems, MenuSearch } from "@/features/search-menu";
import type { Locale } from "@/shared/i18n";
import type { Photo as PhotoData } from "@/shared/photos";
import { Parallax, Photo, RepelField } from "@/shared/ui";

type Labels = {
  search: string;
  noResults: string;
  priceSoon: string;
  signature: string;
  categories: string;
};

/**
 * The full QR menu in the home page's style: each section a staggered field of
 * dishes written as ingredient lists, with a photo drifting in between some
 * sections. A search bar with the section links stays at the top.
 */
export function MenuBoard({
  categories,
  items,
  locale,
  pricing,
  labels,
  photos,
}: {
  categories: MenuCategory[];
  items: MenuItem[];
  locale: Locale;
  pricing: Pricing;
  labels: Labels;
  /** A photo shown after the section with that id. */
  photos: Record<string, PhotoData>;
}) {
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const visible = filterMenuItems(items, query, locale);
    return categories
      .map((category) => ({
        category,
        items: visible.filter((item) => item.category === category.id),
      }))
      .filter((group) => group.items.length > 0);
  }, [categories, items, query, locale]);

  return (
    <div>
      <div className="sticky top-0 z-20 bg-night pt-3 pb-4 shadow-[0_0_0_100vmax_var(--color-night)] [clip-path:inset(0_-100vmax)]">
        <div className="mx-auto max-w-md">
          <MenuSearch value={query} onChange={setQuery} label={labels.search} />
        </div>
        <nav aria-label={labels.categories} className="mt-3 no-scrollbar overflow-x-auto">
          <ul className="mx-auto flex w-max items-center text-[11px] whitespace-nowrap uppercase">
            {groups.map(({ category }, index) => (
              <li key={category.id} className="flex items-center">
                {index > 0 ? (
                  <span aria-hidden className="px-2.5 text-dim">
                    |
                  </span>
                ) : null}
                <a
                  href={`#cat-${category.id}`}
                  className="inline-flex min-h-6 items-center underline-offset-4 hover:underline"
                >
                  {category.title[locale]}
                </a>
              </li>
            ))}
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
            const photo = query ? undefined : photos[category.id];
            return (
              <Fragment key={category.id}>
                <section
                  id={`cat-${category.id}`}
                  aria-labelledby={`cat-title-${category.id}`}
                  className="scroll-mt-32 pt-24"
                >
                  <h2
                    id={`cat-title-${category.id}`}
                    data-repel
                    className="mx-auto mb-12 w-fit text-[12px] tracking-[0.12em] uppercase rtl:font-display rtl:text-xl rtl:leading-[2.2] rtl:tracking-normal"
                  >
                    <span aria-hidden className="me-2">
                      {menuSymbol(category.id)}
                    </span>
                    {category.title[locale]}
                  </h2>
                  <div className="mx-auto grid max-w-[780px] grid-cols-2 justify-items-center gap-x-4 gap-y-16 sm:grid-cols-3 md:grid-cols-4 md:gap-x-10">
                    {groupItems.map((item, index) => (
                      <MenuItemLines
                        key={item.id}
                        item={item}
                        locale={locale}
                        pricing={pricing}
                        labels={labels}
                        className={index % 2 === 1 ? "mt-12" : undefined}
                      />
                    ))}
                  </div>
                </section>
                {photo ? (
                  <Parallax className="mx-auto mt-28 aspect-[2/3] w-[min(70vw,300px)]">
                    <Photo photo={photo} locale={locale} sizes="300px" className="h-full" />
                  </Parallax>
                ) : null}
              </Fragment>
            );
          })}
        </RepelField>
      )}
    </div>
  );
}

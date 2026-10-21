import { formatHours, getCafe } from "@/entities/cafe";
import { getMenu, getPricing, menuSymbol } from "@/entities/menu";
import { getDictionary, type Locale } from "@/shared/i18n";
import { formatNumber, localizeDigits } from "@/shared/lib";
import { getPhoto } from "@/shared/photos";
import { Container, Letters, Parallax, Photo } from "@/shared/ui";
import { MenuBoard } from "@/widgets/menu-board";

/**
 * The table-QR page. Its top is a small spread: the title, hours and legend on one
 * side, a tall photo in the middle, an index of every section with its dish count
 * on the other. Below, the whole menu with search.
 */
export function MenuView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const cafe = getCafe();
  const { categories, items } = getMenu();
  const pricing = getPricing();
  const date = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(pricing.usd.date));
  const priceNote = dict.menu.priceNote
    .replace("{rate}", formatNumber(pricing.usd.tomanPerUsd, locale))
    .replace("{date}", date)
    .replace("{vat}", localizeDigits(String(pricing.vatPercent), locale));
  const legend = dict.home.legend;
  const index = categories
    .map((category) => ({
      category,
      count: items.filter((item) => item.category === category.id).length,
    }))
    .filter(({ count }) => count > 0);

  return (
    <Container className="max-w-6xl px-11 pt-24 pb-32 sm:px-20">
      <header className="grid items-center gap-14 pb-16 md:grid-cols-[1fr_auto_1fr] md:gap-12">
        <div className="text-[14px] leading-[1.8]">
          <h1 className="text-2xl tracking-[0.45em] uppercase rtl:font-display rtl:text-6xl rtl:leading-[1.9] rtl:tracking-normal">
            <Letters text={dict.menu.title} />
          </h1>
          <p className="mt-5 max-w-[16rem]">{dict.menu.lead}</p>
          <p className="mt-6 rtl:font-display rtl:text-lg rtl:leading-[2.2]">
            {dict.home.services}
          </p>
          <p className="mt-1">
            {dict.common.everyDay}
            {dict.common.comma}
            {formatHours(cafe.hours, locale)}
          </p>
          <p className="mt-6 text-[12px] text-dim">
            ◊ {legend.breakfast} · ∆ {legend.food} · ○ {legend.cafe} ·{" "}
            <span className="text-mint">★</span> {legend.favourite}
          </p>
          <p className="mt-2 max-w-[18rem] text-[11px] text-dim">{priceNote}</p>
        </div>

        <Parallax className="mx-auto aspect-[2/3] w-[min(70vw,290px)] max-md:order-first">
          <Photo
            photo={getPhoto("breakfast-by-pool")}
            locale={locale}
            sizes="290px"
            priority
            className="h-full"
          />
        </Parallax>

        <nav aria-label={dict.menu.categories} className="md:justify-self-end">
          <ol className="w-full text-[13px] md:w-64">
            {index.map(({ category, count }) => (
              <li key={category.id}>
                <a
                  href={`#cat-${category.id}`}
                  className="group flex items-baseline gap-2 py-1 hover:text-mint"
                >
                  <span aria-hidden className="w-3 shrink-0 text-[11px] text-dim">
                    {menuSymbol(category.id)}
                  </span>
                  <span className="rtl:font-display rtl:text-[15px] rtl:leading-[2.2]">
                    {category.title[locale]}
                  </span>
                  <span
                    aria-hidden
                    className="mx-1 flex-1 border-b border-dotted border-white/30 group-hover:border-mint"
                  />
                  <span className="text-dim">{formatNumber(count, locale)}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </header>

      <MenuBoard
        categories={categories}
        items={items}
        locale={locale}
        pricing={pricing}
        labels={dict.menu}
      />
    </Container>
  );
}

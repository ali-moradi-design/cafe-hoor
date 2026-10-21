import { getCafe } from "@/entities/cafe";
import { getMenu, getPricing } from "@/entities/menu";
import { getDictionary, type Locale } from "@/shared/i18n";
import { formatNumber, localizeDigits } from "@/shared/lib";
import { Container } from "@/shared/ui";
import { MenuBoard } from "@/widgets/menu-board";

/** The table-QR page: the whole page is the mint "menu" panel. */
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

  return (
    <div className="min-h-full bg-mint-soft">
      <Container className="max-w-5xl pt-10 pb-24">
        <h1 className="text-center font-display text-5xl text-red-deep uppercase sm:text-7xl">
          {dict.menu.title}
        </h1>
        <p className="mt-3 text-center text-lg text-pine">{dict.menu.lead}</p>
        <p className="mx-auto mt-2 mb-10 max-w-2xl text-center text-sm text-pine">{priceNote}</p>
        <MenuBoard
          categories={categories}
          items={items}
          locale={locale}
          pricing={pricing}
          labels={dict.menu}
          logo={{ src: "/brand/logo-128.webp", alt: cafe.name[locale] }}
        />
      </Container>
    </div>
  );
}

import { getMenu, getPricing } from "@/entities/menu";
import { getDictionary, type Locale } from "@/shared/i18n";
import { formatNumber, localizeDigits } from "@/shared/lib";
import { getPhoto } from "@/shared/photos";
import { Container, Letters } from "@/shared/ui";
import { MenuBoard } from "@/widgets/menu-board";

/** Photos that drift in after these sections. */
const sectionPhotos: Record<string, string> = {
  breakfast: "english-breakfast",
  starters: "kashk-bademjan",
  iranian: "chelo-kabab",
  pizza: "pepperoni",
  "burgers-sandwiches": "special-burger",
  mocktails: "yaghout",
  sharbat: "sekanjabin",
  "cold-drinks": "iced-drink",
};

/** The table-QR page: the whole menu, written in the home page's style. */
export function MenuView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
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
  const photos = Object.fromEntries(
    Object.entries(sectionPhotos).map(([category, id]) => [category, getPhoto(id)]),
  );

  return (
    <Container className="max-w-5xl px-11 pt-24 pb-32 sm:px-20">
      <header className="mb-10 text-center">
        <h1 className="text-[13px] tracking-[0.3em] uppercase rtl:font-display rtl:text-3xl rtl:leading-[2] rtl:tracking-normal">
          <Letters text={dict.menu.title} />
        </h1>
        <p className="mt-6 text-[14px]">{dict.menu.lead}</p>
        <p className="mx-auto mt-2 max-w-md text-[11px] text-dim">{priceNote}</p>
      </header>
      <MenuBoard
        categories={categories}
        items={items}
        locale={locale}
        pricing={pricing}
        labels={dict.menu}
        photos={photos}
      />
    </Container>
  );
}

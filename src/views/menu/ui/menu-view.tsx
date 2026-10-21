import { getMenu, getPricing } from "@/entities/menu";
import { getDictionary, type Locale } from "@/shared/i18n";
import { formatNumber, localizeDigits } from "@/shared/lib";
import { Container } from "@/shared/ui";
import { MenuBoard } from "@/widgets/menu-board";

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

  return (
    <Container className="pt-8 pb-16">
      <h1 className="text-4xl font-black text-forest">{dict.menu.title}</h1>
      <p className="mt-2 text-ink/70">{dict.menu.lead}</p>
      <p className="mt-4 rounded-xl bg-gold/15 px-4 py-3 text-sm font-medium text-gold-deep">
        {priceNote}
      </p>
      <div className="mt-4">
        <MenuBoard
          categories={categories}
          items={items}
          locale={locale}
          pricing={pricing}
          labels={dict.menu}
        />
      </div>
    </Container>
  );
}

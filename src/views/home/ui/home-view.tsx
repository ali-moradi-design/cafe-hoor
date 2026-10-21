import { CafeJsonLd, getCafe } from "@/entities/cafe";
import { getMenu, getPricing, type MenuItem } from "@/entities/menu";
import { getDictionary, type Locale } from "@/shared/i18n";
import { getPhoto } from "@/shared/photos";
import { ScrollDots } from "@/shared/ui";
import { InfoPanel } from "@/widgets/info-panel";
import { MenuSpread } from "@/widgets/menu-spread";
import { NameMark, NameStar } from "@/widgets/name-star";
import { PhotoStack } from "@/widgets/photo-stack";

const journalPhotos = [
  "breakfast-by-pool",
  "hummus",
  "brick-arches",
  "yaghout",
  "chelo-joojeh",
  "garden-tables",
  "pepperoni",
  "sekanjabin",
];

/** One dish per section of the menu: its favourite if it has one, else the first. */
function homeDishes(): MenuItem[] {
  const { categories, items } = getMenu();
  return categories.flatMap((category) => {
    const inCategory = items.filter((item) => item.category === category.id);
    const pick = inCategory.find((item) => item.signature) ?? inCategory[0];
    return pick ? [pick] : [];
  });
}

/**
 * Home, after destroyer.la: an empty landing with the name, the menu spread, the
 * info block, the journal stack and the star the name lands in.
 */
export function HomeView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const cafe = getCafe();

  return (
    <>
      <CafeJsonLd cafe={cafe} locale={locale} />

      <section className="relative h-svh">
        <h1 className="sr-only">{cafe.name[locale]}</h1>
        <NameMark />
        <ScrollDots className="absolute bottom-6 left-1/2 -translate-x-1/2" />
      </section>

      <section id="menu" className="pt-24">
        <MenuSpread
          items={homeDishes()}
          locale={locale}
          pricing={getPricing()}
          dict={dict}
          cafe={cafe}
          photos={{ top: getPhoto("english-breakfast"), bottom: getPhoto("kabab-platter") }}
        />
      </section>

      <section id="info" className="scroll-mt-0 pt-48 md:min-h-[900px]">
        <InfoPanel locale={locale} dict={dict} cafe={cafe} photo={getPhoto("courtyard-pool")} />
      </section>

      <section id="journal" aria-labelledby="journal-title" className="pt-48">
        <h2 id="journal-title" className="sr-only">
          {dict.home.journalTitle}
        </h2>
        <PhotoStack
          photos={journalPhotos.map(getPhoto)}
          locale={locale}
          labels={{ ...dict.common, photos: dict.home.journalTitle }}
        />
      </section>

      <section className="pt-32">
        <NameStar locale={locale} labels={dict.common} />
      </section>
    </>
  );
}

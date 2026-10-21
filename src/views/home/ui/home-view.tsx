import { CafeJsonLd, getCafe } from "@/entities/cafe";
import { getDictionary, type Locale } from "@/shared/i18n";
import { getPhoto } from "@/shared/photos";
import { ScrollDots } from "@/shared/ui";
import { InfoPanel } from "@/widgets/info-panel";
import { HeroScatter } from "@/widgets/hero-scatter";
import { HouseSpread } from "@/widgets/house-spread";
import { NameMark, NameStar } from "@/widgets/name-star";
import { PhotoStack } from "@/widgets/photo-stack";

const journalPhotos = [
  "breakfast-by-pool",
  "hummus",
  "kashk-bademjan",
  "yaghout",
  "chelo-joojeh",
  "caesar-salad",
  "pepperoni",
  "sekanjabin",
];

const heroPhotos = [
  "yaghout",
  "brick-hall",
  "chelo-kabab",
  "kabab-platter",
  "special-burger",
  "old-bicycle",
  "caesar-salad",
];

const housePhotos = [
  "brick-arches",
  "wall-lamp",
  "corner-table",
  "arched-window",
  "mirror-room",
  "old-bicycle",
  "chandelier-room",
  "garden-tables",
];

/**
 * Home, after destroyer.la: a landing with the name among scattered photos, the house spread, the
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
        <HeroScatter photos={heroPhotos.map(getPhoto)} locale={locale} />
        <NameMark />
        <ScrollDots className="absolute bottom-6 left-1/2 -translate-x-1/2" />
      </section>

      <section id="house" className="pt-24">
        <HouseSpread
          locale={locale}
          dict={dict}
          cafe={cafe}
          photos={{
            top: getPhoto("fountain"),
            bottom: getPhoto("dining-room"),
            moments: housePhotos.map(getPhoto),
          }}
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

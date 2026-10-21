import { CafeJsonLd, getCafe } from "@/entities/cafe";
import { getPricing, getSignatureItems, MenuItemCard } from "@/entities/menu";
import { getDictionary, localePath, type Locale } from "@/shared/i18n";
import { getPhoto } from "@/shared/photos";
import { ButtonLink, Container, SectionHeading, WordReveal } from "@/shared/ui";
import { BookingCard } from "@/widgets/booking-card";
import { HeroSlider } from "@/widgets/hero-slider";
import { PhotoCarousel } from "@/widgets/photo-carousel";
import { VisitInfo } from "@/widgets/visit-info";

const heroPhotos = [
  "fountain",
  "english-breakfast",
  "courtyard-pool",
  "kabab-platter",
  "brick-hall",
  "pepperoni",
];
const housePhotos = ["brick-arches", "wall-lamp", "corner-table", "arched-window", "dining-room"];

export function HomeView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const cafe = getCafe();
  const signature = getSignatureItems();
  const pricing = getPricing();

  return (
    <>
      <CafeJsonLd cafe={cafe} locale={locale} />
      <h1 className="sr-only">{cafe.name[locale]}</h1>

      <HeroSlider photos={heroPhotos.map(getPhoto)} locale={locale} labels={dict.common} />

      <section className="py-24 sm:py-32">
        <Container className="max-w-4xl">
          <SectionHeading title={dict.home.storyTitle} center />
          <WordReveal text={dict.home.storyText} />
        </Container>
      </section>

      <section className="pb-24 sm:pb-32">
        <Container className="grid items-center gap-14 md:grid-cols-2">
          <div data-reveal>
            <PhotoCarousel
              photos={housePhotos.map(getPhoto)}
              locale={locale}
              labels={dict.common}
            />
          </div>
          <WordReveal text={dict.home.welcome} />
        </Container>
      </section>

      <section className="bg-mint-soft py-20 sm:py-28">
        <Container className="max-w-5xl">
          <SectionHeading title={dict.home.menuTitle} lead={dict.home.menuLead} center />
          <div className="grid gap-x-12 gap-y-6 md:grid-cols-2" data-reveal>
            {signature.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                locale={locale}
                pricing={pricing}
                labels={dict.menu}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <ButtonLink href={localePath(locale, "menu")}>{dict.home.fullMenu}</ButtonLink>
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container>
          <BookingCard locale={locale} dict={dict} cafe={cafe} photo={getPhoto("chelo-joojeh")} />
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <SectionHeading title={dict.home.visitTitle} />
          <VisitInfo locale={locale} dict={dict} cafe={cafe} />
        </Container>
      </section>
    </>
  );
}

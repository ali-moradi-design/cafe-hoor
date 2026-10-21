import Link from "next/link";

import { CafeJsonLd, formatHours, getCafe } from "@/entities/cafe";
import { getPricing, getSignatureItems, MenuItemCard } from "@/entities/menu";
import { getDictionary, localePath, type Locale } from "@/shared/i18n";
import { getPhoto } from "@/shared/photos";
import { ButtonLink, Container, Photo, SectionHeading } from "@/shared/ui";
import { VisitInfo } from "@/widgets/visit-info";

const moments = ["courtyard-pool", "wall-lamp", "breakfast-by-pool", "arched-window"];

export function HomeView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const cafe = getCafe();
  const signature = getSignatureItems();
  const pricing = getPricing();

  return (
    <>
      <CafeJsonLd cafe={cafe} locale={locale} />

      <section className="relative overflow-hidden bg-forest text-cream">
        <div aria-hidden className="absolute inset-0 tile-pattern opacity-15" />
        <Container className="relative grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div>
            <p className="font-bold text-gold">
              {dict.common.everyDay}
              {dict.common.comma}
              {formatHours(cafe.hours, locale)}
            </p>
            <h1 className="mt-3 text-4xl leading-tight font-black sm:text-5xl">
              {dict.home.title}
            </h1>
            <p className="mt-5 max-w-lg text-lg text-cream/85">{dict.home.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={localePath(locale, "menu")} variant="light">
                {dict.common.viewMenu}
              </ButtonLink>
              <a
                href={`tel:${cafe.phone}`}
                className="inline-flex min-h-11 items-center rounded-full border-2 border-cream/50 px-6 py-2.5 font-bold transition-colors hover:bg-cream hover:text-forest"
              >
                {dict.common.call}
              </a>
            </div>
          </div>
          <div className="aspect-4/5 w-full max-w-md justify-self-center overflow-hidden rounded-t-full border-4 border-gold/60 bg-forest-deep md:justify-self-end">
            <Photo
              photo={getPhoto("fountain")}
              locale={locale}
              sizes="(min-width: 768px) 448px, 90vw"
              priority
            />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading title={dict.home.signatureTitle} />
          <div className="grid gap-3 md:grid-cols-2">
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
          <ButtonLink href={localePath(locale, "menu")} variant="outline" className="mt-8">
            {dict.common.viewMenu}
          </ButtonLink>
        </Container>
      </section>

      <section className="bg-sand/50 py-16">
        <Container className="grid items-center gap-10 md:grid-cols-2">
          <div className="aspect-4/5 overflow-hidden rounded-3xl bg-sand md:aspect-4/3">
            <Photo
              photo={getPhoto("brick-arches")}
              locale={locale}
              sizes="(min-width: 768px) 540px, 92vw"
            />
          </div>
          <div>
            <SectionHeading title={dict.home.storyTitle} />
            <p className="text-lg leading-loose text-ink/80">{dict.home.storyText}</p>
            <ButtonLink href={localePath(locale, "about")} variant="outline" className="mt-6">
              {dict.home.readMore}
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading title={dict.gallery.title} lead={dict.gallery.lead} />
          <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            {moments.map((id) => (
              <li key={id} className="aspect-4/5 overflow-hidden rounded-2xl bg-sand">
                <Link href={localePath(locale, "gallery")} className="block h-full">
                  <Photo
                    photo={getPhoto(id)}
                    locale={locale}
                    sizes="(min-width: 1024px) 280px, 46vw"
                    className="transition-transform duration-500 hover:scale-105 motion-reduce:transition-none"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <SectionHeading title={dict.home.visitTitle} />
          <VisitInfo locale={locale} dict={dict} cafe={cafe} />
        </Container>
      </section>
    </>
  );
}

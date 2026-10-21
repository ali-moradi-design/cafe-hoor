import { getDictionary, localePath, type Locale } from "@/shared/i18n";
import { getPhoto } from "@/shared/photos";
import { ButtonLink, Container, SectionHeading, WordReveal } from "@/shared/ui";
import { PhotoCarousel } from "@/widgets/photo-carousel";

const photos = ["brick-hall", "mirror-room", "chandelier-room", "sideboard", "arched-hall"];

export function AboutView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [first, ...rest] = dict.about.paragraphs;
  return (
    <>
      <section className="py-20 sm:py-28">
        <Container className="max-w-4xl">
          <SectionHeading as="h1" title={dict.about.title} center />
          <WordReveal text={first} />
        </Container>
      </section>
      <section className="pb-24 sm:pb-32">
        <Container className="grid items-center gap-14 md:grid-cols-2">
          <div data-reveal>
            <PhotoCarousel photos={photos.map(getPhoto)} locale={locale} labels={dict.common} />
          </div>
          <div>
            {rest.map((paragraph) => (
              <WordReveal key={paragraph} text={paragraph} />
            ))}
            <ButtonLink href={localePath(locale, "menu")} className="mt-10">
              {dict.common.viewMenu}
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}

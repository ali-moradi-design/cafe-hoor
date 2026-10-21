import { getDictionary, localePath, type Locale } from "@/shared/i18n";
import { getPhoto } from "@/shared/photos";
import { ButtonLink, Container, Photo, SectionHeading } from "@/shared/ui";

export function AboutView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <Container className="grid gap-10 py-12 md:grid-cols-2 md:items-center">
      <div>
        <SectionHeading as="h1" title={dict.about.title} />
        {dict.about.paragraphs.map((paragraph) => (
          <p key={paragraph} className="mt-5 text-lg leading-loose text-ink/80 first:mt-0">
            {paragraph}
          </p>
        ))}
        <ButtonLink href={localePath(locale, "menu")} className="mt-8">
          {dict.common.viewMenu}
        </ButtonLink>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="aspect-3/4 overflow-hidden rounded-t-full bg-sand">
          <Photo
            photo={getPhoto("brick-hall")}
            locale={locale}
            sizes="(min-width: 768px) 270px, 46vw"
          />
        </div>
        <div className="mt-10 aspect-3/4 overflow-hidden rounded-t-full bg-sand">
          <Photo
            photo={getPhoto("mirror-room")}
            locale={locale}
            sizes="(min-width: 768px) 270px, 46vw"
          />
        </div>
      </div>
    </Container>
  );
}

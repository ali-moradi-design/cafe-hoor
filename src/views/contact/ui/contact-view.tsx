import { getCafe } from "@/entities/cafe";
import { getDictionary, type Locale } from "@/shared/i18n";
import { Container, SectionHeading } from "@/shared/ui";
import { LocationMap } from "@/widgets/location-map";
import { VisitInfo } from "@/widgets/visit-info";

export function ContactView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const cafe = getCafe();
  return (
    <Container className="py-12">
      <SectionHeading as="h1" title={dict.contact.title} />
      <VisitInfo locale={locale} dict={dict} cafe={cafe} headingLevel="h2" />
      <div className="mt-8">
        <LocationMap lat={cafe.geo.lat} lng={cafe.geo.lng} label={dict.contact.map} />
        <a
          href={cafe.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block font-bold text-forest underline decoration-gold decoration-2 underline-offset-4"
        >
          {dict.common.openMap}
        </a>
      </div>
    </Container>
  );
}

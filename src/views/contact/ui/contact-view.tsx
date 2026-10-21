import { getCafe } from "@/entities/cafe";
import { getDictionary, type Locale } from "@/shared/i18n";
import { getPhoto } from "@/shared/photos";
import { Container, SectionHeading } from "@/shared/ui";
import { BookingCard } from "@/widgets/booking-card";
import { LocationMap } from "@/widgets/location-map";
import { VisitInfo } from "@/widgets/visit-info";

export function ContactView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const cafe = getCafe();
  return (
    <Container className="py-14 sm:py-20">
      <SectionHeading as="h1" title={dict.contact.title} center />
      <BookingCard locale={locale} dict={dict} cafe={cafe} photo={getPhoto("courtyard-pool")} />
      <div className="mt-24">
        <VisitInfo locale={locale} dict={dict} cafe={cafe} headingLevel="h2" />
      </div>
      <div className="mt-16" data-reveal>
        <LocationMap lat={cafe.geo.lat} lng={cafe.geo.lng} label={dict.contact.map} />
      </div>
    </Container>
  );
}

import { getCafe } from "@/entities/cafe";
import { getDictionary, type Locale } from "@/shared/i18n";
import { getPhoto } from "@/shared/photos";
import { Container, Letters } from "@/shared/ui";
import { InfoPanel } from "@/widgets/info-panel";
import { LocationMap } from "@/widgets/location-map";

export function ContactView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const cafe = getCafe();
  return (
    <Container className="max-w-5xl px-11 pt-24 pb-32 sm:px-20">
      <h1 className="mb-20 text-center text-[13px] tracking-[0.3em] uppercase rtl:font-display rtl:text-3xl rtl:leading-[2] rtl:tracking-normal">
        <Letters text={dict.contact.title} />
      </h1>
      <div className="md:min-h-[760px]">
        <InfoPanel
          locale={locale}
          dict={dict}
          cafe={cafe}
          photo={getPhoto("brick-arches")}
          headingLevel="h2"
        />
      </div>
      <div className="mx-auto mt-32 max-w-[780px]">
        <LocationMap lat={cafe.geo.lat} lng={cafe.geo.lng} label={dict.contact.map} />
      </div>
    </Container>
  );
}

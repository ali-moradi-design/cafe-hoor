import { siteUrl } from "@/shared/config";
import type { Locale } from "@/shared/i18n";

import type { Cafe } from "../model/schema";

/** `CafeOrCoffeeShop` structured data for search engines. */
export function CafeJsonLd({ cafe, locale }: { cafe: Cafe; locale: Locale }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: cafe.name[locale],
    url: `${siteUrl}/${locale}/`,
    telephone: cafe.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: cafe.address[locale],
      addressLocality: locale === "fa" ? "تهران" : "Tehran",
      addressCountry: "IR",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: cafe.hours.opens,
      closes: cafe.hours.closes,
    },
    geo: { "@type": "GeoCoordinates", latitude: cafe.geo.lat, longitude: cafe.geo.lng },
    image: `${siteUrl}/og.jpg`,
    servesCuisine: ["Iranian", "Italian", "Cafe"],
    hasMenu: `${siteUrl}/${locale}/menu/`,
    sameAs: [cafe.instagram],
  };
  return (
    <script
      type="application/ld+json"
      // Static data from our own content file, serialized by us.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}

import type { Metadata } from "next";

import { siteUrl } from "../config";
import { localePath, locales, type Locale } from "../i18n";

/** Title, description, canonical URL and `hreflang` alternates for one page. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title?: string;
  description: string;
}): Metadata {
  const languages = Object.fromEntries(locales.map((l) => [l, localePath(l, path)]));
  return {
    metadataBase: new URL(siteUrl),
    // Without a title the layout's default (the cafe's name) applies.
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: localePath(locale, path), languages },
    openGraph: {
      type: "website",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      description,
      images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    },
  };
}

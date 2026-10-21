import type { MetadataRoute } from "next";

import { siteUrl } from "@/shared/config";
import { localePath, locales } from "@/shared/i18n";

export const dynamic = "force-static";

const paths = ["/", "/menu", "/gallery", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}${localePath(locale, path)}`,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}${localePath(l, path)}`])),
      },
    })),
  );
}

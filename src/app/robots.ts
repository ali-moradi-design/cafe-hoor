import type { MetadataRoute } from "next";

import { siteUrl } from "@/shared/config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/fa/qr/", "/en/qr/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

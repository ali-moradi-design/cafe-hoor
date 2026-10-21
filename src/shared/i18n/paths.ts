import type { Locale } from "./config";

/** `localePath("fa", "/menu")` → `/fa/menu/` (the site uses trailing slashes). */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}

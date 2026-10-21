import { defaultLocale, localePath } from "@/shared/i18n";

import { RedirectTo } from "./redirect-to";

export default function RootPage() {
  return <RedirectTo href={localePath(defaultLocale)} />;
}

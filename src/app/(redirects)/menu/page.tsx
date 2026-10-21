import { defaultLocale, localePath } from "@/shared/i18n";

import { RedirectTo } from "../redirect-to";

/** The table QR code points here, so the printed code never has to change. */
export default function MenuRedirectPage() {
  return <RedirectTo href={localePath(defaultLocale, "menu")} />;
}

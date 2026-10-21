import QRCode from "qrcode";

import { getCafe } from "@/entities/cafe";
import { siteUrl } from "@/shared/config";
import { getDictionary, type Locale } from "@/shared/i18n";
import { Container } from "@/shared/ui";

import { PrintButton } from "./print-button";

/** The one QR code for every table. It opens `/menu/`, which sends guests to the Persian menu. */
export async function QrView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const cafe = getCafe();
  const menuUrl = `${siteUrl}/menu/`;
  const svg = await QRCode.toString(menuUrl, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#343f26", light: "#ffffff" },
  });

  return (
    <Container className="py-12">
      <div className="print:hidden">
        <h1 className="text-4xl font-black text-forest">{dict.qr.title}</h1>
        <p className="mt-3 max-w-xl text-ink/70">{dict.qr.lead}</p>
        <div className="mt-6">
          <PrintButton label={dict.qr.print} />
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-sm rounded-3xl border-4 border-forest bg-white p-8 text-center print:mt-0 print:border-2">
        <p className="text-2xl font-black text-forest">{cafe.name.fa}</p>
        <p className="text-sm font-bold text-ink/60" lang="en">
          {cafe.name.en}
        </p>
        <div
          className="mx-auto mt-6 w-56 [&_svg]:h-auto [&_svg]:w-full"
          role="img"
          aria-label={menuUrl}
          // SVG markup generated at build time by the `qrcode` package.
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <p className="mt-5 font-bold text-forest">{dict.qr.scan}</p>
        <p className="mt-1 text-xs text-ink/50" dir="ltr">
          {menuUrl.replace(/^https:\/\//, "")}
        </p>
      </div>
    </Container>
  );
}

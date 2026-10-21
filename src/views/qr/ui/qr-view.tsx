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
    color: { dark: "#232323", light: "#ffffff" },
  });

  return (
    <Container className="max-w-5xl px-11 pt-24 pb-32 sm:px-20">
      <div className="print:hidden">
        <h1 className="text-[13px] tracking-[0.3em] uppercase rtl:font-display rtl:text-3xl rtl:leading-[2] rtl:tracking-normal">
          {dict.qr.title}
        </h1>
        <p className="mt-6 max-w-md text-[14px]">{dict.qr.lead}</p>
        <div className="mt-6">
          <PrintButton label={dict.qr.print} />
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-sm bg-white p-8 text-center text-night print:mt-0 print:border-2 print:border-black">
        <p className="text-xl font-bold">{cafe.name.fa}</p>
        <p className="text-sm" lang="en">
          {cafe.name.en}
        </p>
        <div
          className="mx-auto mt-6 w-56 [&_svg]:h-auto [&_svg]:w-full"
          role="img"
          aria-label={menuUrl}
          // SVG markup generated at build time by the `qrcode` package.
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <p className="mt-5 font-bold">{dict.qr.scan}</p>
        <p className="mt-1 text-xs text-neutral-600" dir="ltr">
          {menuUrl.replace(/^https:\/\//, "")}
        </p>
      </div>
    </Container>
  );
}

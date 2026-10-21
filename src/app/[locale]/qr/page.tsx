import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale } from "@/shared/i18n";
import { pageMetadata } from "@/shared/lib";
import { QrView } from "@/views/qr";

export async function generateMetadata({ params }: PageProps<"/[locale]/qr">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({ locale, path: "/qr", title: dict.qr.title, description: dict.qr.lead });
}

export default async function Page({ params }: PageProps<"/[locale]/qr">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <QrView locale={locale} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale } from "@/shared/i18n";
import { pageMetadata } from "@/shared/lib";
import { MenuView } from "@/views/menu";

export async function generateMetadata({ params }: PageProps<"/[locale]/menu">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: "/menu",
    title: dict.menu.title,
    description: dict.menu.lead,
  });
}

export default async function Page({ params }: PageProps<"/[locale]/menu">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <MenuView locale={locale} />;
}

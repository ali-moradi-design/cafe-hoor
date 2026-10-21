import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale } from "@/shared/i18n";
import { pageMetadata } from "@/shared/lib";
import { GalleryView } from "@/views/gallery";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/gallery">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: "/gallery",
    title: dict.gallery.title,
    description: dict.gallery.lead,
  });
}

export default async function Page({ params }: PageProps<"/[locale]/gallery">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <GalleryView locale={locale} />;
}

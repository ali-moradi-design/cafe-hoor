import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCafe } from "@/entities/cafe";
import { getDictionary, isLocale } from "@/shared/i18n";
import { pageMetadata } from "@/shared/lib";
import { ContactView } from "@/views/contact";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: "/contact",
    title: dict.contact.title,
    description: getCafe().address[locale],
  });
}

export default async function Page({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ContactView locale={locale} />;
}

import Link from "next/link";

import { getDictionary, localePath, type Locale } from "@/shared/i18n";
import { getPhoto } from "@/shared/photos";
import { Container, Letters, RepelField } from "@/shared/ui";
import { PhotoStack } from "@/widgets/photo-stack";

const photos = ["brick-hall", "mirror-room", "chandelier-room", "sideboard", "arched-hall"];

/** A few lines about the house in a narrow column, then the house in photos. */
export function AboutView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <Container className="max-w-5xl px-11 pt-24 pb-32 sm:px-20">
      <h1 className="mb-16 text-center text-[13px] tracking-[0.3em] uppercase rtl:font-display rtl:text-3xl rtl:leading-[2] rtl:tracking-normal">
        <Letters text={dict.about.title} />
      </h1>
      <RepelField className="mx-auto max-w-[22rem] text-[14px] leading-[1.75]">
        <p data-repel>{dict.home.storyText}</p>
        {dict.about.paragraphs.map((paragraph) => (
          <p key={paragraph} data-repel className="mt-6">
            {paragraph}
          </p>
        ))}
        <p data-repel className="mt-8 w-fit uppercase">
          <Link href={localePath(locale, "menu")} className="underline underline-offset-4">
            <Letters text={dict.common.viewMenu} />
          </Link>
        </p>
      </RepelField>
      <div className="mt-32">
        <PhotoStack
          photos={photos.map(getPhoto)}
          locale={locale}
          labels={{ ...dict.common, photos: dict.about.title }}
        />
      </div>
    </Container>
  );
}

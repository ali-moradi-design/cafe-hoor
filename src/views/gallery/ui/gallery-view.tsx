import { getDictionary, type Locale } from "@/shared/i18n";
import { getGalleryPhotos } from "@/shared/photos";
import { Container, Letters } from "@/shared/ui";
import { GalleryGrid } from "@/widgets/gallery-grid";
import { PhotoStack } from "@/widgets/photo-stack";

/** The journal stack up top, then every photo drifting in, each opening full size. */
export function GalleryView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const photos = getGalleryPhotos();
  return (
    <Container className="max-w-5xl px-11 pt-24 pb-32 sm:px-20">
      <header className="mb-16 text-center">
        <h1 className="text-[13px] tracking-[0.3em] uppercase rtl:font-display rtl:text-3xl rtl:leading-[2] rtl:tracking-normal">
          <Letters text={dict.gallery.title} />
        </h1>
        <p className="mt-6 text-[14px]">{dict.gallery.lead}</p>
      </header>
      <PhotoStack
        photos={photos.slice(0, 8)}
        locale={locale}
        labels={{ ...dict.common, photos: dict.gallery.title }}
        size="lg"
      />
      <div className="mt-40">
        <GalleryGrid photos={photos} locale={locale} labels={dict.gallery} />
      </div>
    </Container>
  );
}

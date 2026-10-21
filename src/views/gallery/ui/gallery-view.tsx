import { getDictionary, type Locale } from "@/shared/i18n";
import { getGalleryPhotos } from "@/shared/photos";
import { Container, SectionHeading } from "@/shared/ui";
import { GalleryGrid } from "@/widgets/gallery-grid";

/** The gallery is the pastel-green panel. */
export function GalleryView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <div className="min-h-full bg-sage-soft">
      <Container className="py-14 sm:py-20">
        <SectionHeading as="h1" title={dict.gallery.title} lead={dict.gallery.lead} center />
        <GalleryGrid photos={getGalleryPhotos()} locale={locale} labels={dict.gallery} />
      </Container>
    </div>
  );
}

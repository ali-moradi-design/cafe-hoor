import { getDictionary, type Locale } from "@/shared/i18n";
import { getGalleryPhotos } from "@/shared/photos";
import { Container, SectionHeading } from "@/shared/ui";
import { GalleryGrid } from "@/widgets/gallery-grid";

export function GalleryView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <Container className="py-12">
      <SectionHeading as="h1" title={dict.gallery.title} lead={dict.gallery.lead} />
      <GalleryGrid photos={getGalleryPhotos()} locale={locale} labels={dict.gallery} />
    </Container>
  );
}

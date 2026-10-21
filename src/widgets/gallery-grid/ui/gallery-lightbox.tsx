"use client";

import "photoswipe/style.css";

import { useEffect, useRef, type ReactNode } from "react";

/** Opens the links inside `children` in PhotoSwipe; without JavaScript they open the image. */
export function GalleryLightbox({
  children,
  labels,
}: {
  children: ReactNode;
  labels: { close: string; next: string; prev: string };
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let destroyed = false;
    let lightbox: { destroy(): void } | undefined;
    void import("photoswipe/lightbox").then(({ default: PhotoSwipeLightbox }) => {
      if (destroyed || !ref.current) return;
      const instance = new PhotoSwipeLightbox({
        gallery: ref.current,
        children: "a",
        pswpModule: () => import("photoswipe"),
        closeTitle: labels.close,
        arrowNextTitle: labels.next,
        arrowPrevTitle: labels.prev,
        bgOpacity: 0.92,
      });
      instance.init();
      lightbox = instance;
      ref.current.dataset.lightbox = "ready";
    });
    return () => {
      destroyed = true;
      lightbox?.destroy();
    };
  }, [labels.close, labels.next, labels.prev]);

  return <div ref={ref}>{children}</div>;
}

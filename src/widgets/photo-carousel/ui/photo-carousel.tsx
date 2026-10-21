"use client";

import { useState } from "react";

import type { Locale } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import type { Photo as PhotoData } from "@/shared/photos";
import { Photo } from "@/shared/ui";

function Arrow({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 40"
      width="20"
      height="40"
      aria-hidden
      className={cn("rtl:-scale-x-100", flip && "-scale-x-100 rtl:scale-x-100")}
    >
      <path d="M2 2 18 20 2 38Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** One round photo at a time with a pastel ring, outline arrows and small dots. */
export function PhotoCarousel({
  photos,
  locale,
  labels,
}: {
  photos: PhotoData[];
  locale: Locale;
  labels: { prev: string; next: string; slide: string };
}) {
  const [current, setCurrent] = useState(0);
  const go = (step: number) =>
    setCurrent((index) => (index + step + photos.length) % photos.length);

  return (
    <div aria-roledescription="carousel" className="mx-auto w-full max-w-md">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={labels.prev}
          className="shrink-0 p-2 text-pastel hover:text-red"
        >
          <Arrow flip />
        </button>
        <div className="relative aspect-square flex-1 overflow-hidden rounded-full bg-mint-soft shadow-[12px_8px_0_0_var(--color-sage-soft)]">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              aria-hidden={index !== current}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none",
                index === current ? "opacity-100" : "opacity-0",
              )}
            >
              <Photo photo={photo} locale={locale} sizes="(min-width: 768px) 400px, 75vw" />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label={labels.next}
          className="shrink-0 p-2 text-pastel hover:text-red"
        >
          <Arrow />
        </button>
      </div>
      <div className="mt-6 flex justify-center gap-1">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={labels.slide.replace("{n}", String(index + 1))}
            aria-current={index === current ? "true" : undefined}
            className="grid size-6 place-items-center"
          >
            <span
              className={cn(
                "block rounded-full",
                index === current ? "size-3 border border-red" : "size-1.5 bg-pastel",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

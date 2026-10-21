"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

import type { Locale } from "@/shared/i18n";
import { cn, localizeDigits } from "@/shared/lib";
import type { Photo as PhotoData } from "@/shared/photos";
import { Photo } from "@/shared/ui";

/** Card place in the stack: front, then each card further back. -1 is the one just left. */
function cardStyle(place: number) {
  if (place === -1) return { zIndex: 6, top: -40, transform: "scale(1.1)", opacity: 0 };
  if (place > 3) return { zIndex: 0, top: 120, transform: "scale(0.7)", opacity: 0 };
  return {
    zIndex: 5 - place,
    top: place * 40,
    transform: `scale(${1 - place * 0.1})`,
    opacity: 1 - place * 0.2,
  };
}

/**
 * The reference's journal slider: a stack of photo cards, each one behind 40px
 * lower, 10% smaller and fainter. Arrows on both sides, the keyboard arrows (while
 * the stack is on screen) and a swipe move it; the front card leaves upward.
 */
export function PhotoStack({
  photos,
  locale,
  labels,
  size = "md",
}: {
  photos: PhotoData[];
  locale: Locale;
  labels: { prev: string; next: string; slide: string; photos: string };
  size?: "md" | "lg";
}) {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const swipe = useRef<number | null>(null);
  const count = photos.length;
  const move = (step: number) => setIndex((value) => (value + step + count) % count);
  const rtl = locale === "fa";

  useEffect(() => {
    const stack = ref.current;
    if (!stack) return;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    observer.observe(stack);
    const onKey = (event: KeyboardEvent) => {
      if (!visible || event.defaultPrevented) return;
      const forward = rtl ? "ArrowLeft" : "ArrowRight";
      const back = rtl ? "ArrowRight" : "ArrowLeft";
      if (event.key === forward) setIndex((value) => (value + 1) % count);
      if (event.key === back) setIndex((value) => (value - 1 + count) % count);
    };
    window.addEventListener("keyup", onKey);
    return () => {
      observer.disconnect();
      window.removeEventListener("keyup", onKey);
    };
  }, [count, rtl]);

  const onPointerDown = (event: PointerEvent) => {
    swipe.current = event.clientX;
  };
  const onPointerUp = (event: PointerEvent) => {
    if (swipe.current === null) return;
    const distance = event.clientX - swipe.current;
    swipe.current = null;
    if (Math.abs(distance) > 40) move(distance < 0 !== rtl ? 1 : -1);
  };

  const card = size === "lg" ? "w-[min(68vw,22rem)]" : "w-[min(62vw,17rem)]";
  const arrow =
    "absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center text-sm transition-opacity hover:opacity-60";

  return (
    <div
      ref={ref}
      role="region"
      data-no-shimmer=""
      aria-roledescription="carousel"
      aria-label={labels.photos}
      className="relative mx-auto max-w-[580px]"
    >
      <ul
        className={cn("relative mx-auto aspect-[2/3] touch-pan-y select-none", card)}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {photos.map((photo, photoIndex) => {
          const place = (photoIndex - index + count) % count;
          const style = cardStyle(place === count - 1 && count > 2 ? -1 : place);
          return (
            <li
              key={photo.id}
              aria-hidden={place !== 0}
              className="absolute inset-x-0 aspect-[2/3] transition-all duration-[600ms] ease-out motion-reduce:transition-none"
              style={style}
            >
              <Photo
                photo={photo}
                locale={locale}
                sizes={size === "lg" ? "352px" : "272px"}
                priority={place === 0 && photoIndex === 0}
                className="h-full"
              />
            </li>
          );
        })}
      </ul>
      <div className="h-[120px]" aria-hidden />
      <button
        type="button"
        onClick={() => move(-1)}
        aria-label={labels.prev}
        className={cn(arrow, "start-0 sm:-start-2")}
      >
        <span aria-hidden>{rtl ? "→" : "←"}</span>
      </button>
      <button
        type="button"
        onClick={() => move(1)}
        aria-label={labels.next}
        className={cn(arrow, "end-0 sm:-end-2")}
      >
        <span aria-hidden>{rtl ? "←" : "→"}</span>
      </button>
      <p className="sr-only" aria-live="polite">
        {labels.slide.replace("{n}", localizeDigits(String(index + 1), locale))}
      </p>
    </div>
  );
}

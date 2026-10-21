"use client";

import { useEffect, useRef } from "react";

import type { Locale } from "@/shared/i18n";
import { cn, hasFullMotion, onSmoothScroll } from "@/shared/lib";
import type { Photo as PhotoData } from "@/shared/photos";
import { Photo } from "@/shared/ui";

/**
 * Where each photo sits on the landing (percent of its box), how wide it is
 * (vw on wide screens / on phones), how it moves with the scroll (`depth`: share
 * of the scroll added to its rise; negative ones lag behind), how much it grows
 * or shrinks by the time the landing has scrolled away, and its tilt.
 */
const slots = [
  { x: 5, y: 12, w: 13, m: 30, depth: 0.35, grow: 0.3, tilt: -3 },
  { x: 25, y: 60, w: 10, m: 24, depth: -0.3, grow: -0.35, tilt: 2 },
  { x: 63, y: 7, w: 11, m: 26, depth: 0.55, grow: -0.25, tilt: 3 },
  { x: 79, y: 38, w: 14, m: 30, depth: 0.2, grow: 0.4, tilt: -2 },
  { x: 66, y: 70, w: 9, m: 22, depth: 0.8, grow: 0.2, tilt: 4 },
  { x: 4, y: 68, w: 9, m: 20, depth: -0.45, grow: -0.3, tilt: -4 },
  { x: 31, y: 16, w: 8, m: 18, depth: 0.95, grow: 0.45, tilt: 2 },
] as const;

/**
 * Photos scattered around the name on the landing. They develop in one by one like
 * prints (a wipe from the bottom, grey to colour); on scroll each drifts at its own
 * speed, grows or shrinks, tilts further and fades; with a fine pointer they also
 * lean a little toward their depth as the pointer moves.
 */
export function HeroScatter({ photos, locale }: { photos: PhotoData[]; locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    const cards = Array.from(box.querySelectorAll<HTMLElement>("[data-card]"));
    // Let the first paint happen, then develop the prints.
    const ready = window.setTimeout(() => box.setAttribute("data-ready", ""), 60);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => window.clearTimeout(ready);
    }

    const pointer = { x: 0, y: 0 };
    const lean = { x: 0, y: 0 };
    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth - 0.5;
      pointer.y = event.clientY / window.innerHeight - 0.5;
    };
    const leans = hasFullMotion();
    if (leans) window.addEventListener("pointermove", onMove, { passive: true });

    const stop = onSmoothScroll((y) => {
      const height = window.innerHeight;
      const progress = Math.max(0, y / height);
      if (progress > 1.6 && !leans) return;
      lean.x += (pointer.x - lean.x) * 0.06;
      lean.y += (pointer.y - lean.y) * 0.06;
      cards.forEach((card, index) => {
        const slot = slots[index % slots.length];
        const rise = -y * slot.depth;
        const scale = Math.max(0.3, 1 + progress * slot.grow);
        const tilt = slot.tilt * (1 + progress * 2);
        const dx = lean.x * slot.depth * 40;
        const dy = lean.y * slot.depth * 30;
        card.style.transform = `translate3d(${dx.toFixed(1)}px, ${(rise + dy).toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        card.style.opacity = String(Math.max(0, Math.min(1, 1.6 - progress * 1.4)));
      });
    });

    return () => {
      window.clearTimeout(ready);
      stop();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="group/scatter pointer-events-none absolute inset-0"
      dir="ltr"
    >
      {photos.slice(0, slots.length).map((photo, index) => {
        const slot = slots[index];
        return (
          <div
            key={photo.id}
            data-card=""
            className="absolute left-(--xm) w-[calc(var(--m)*1vw)] will-change-transform md:left-(--x) md:w-[calc(var(--w)*1vw)]"
            style={
              {
                // Phones: squeezed between the side navigation on either edge.
                "--xm": `min(${12 + slot.x * 0.76}%, calc(88% - ${slot.m}vw))`,
                "--x": `${slot.x}%`,
                top: `${slot.y}%`,
                transform: `rotate(${slot.tilt}deg)`,
                "--w": slot.w,
                "--m": slot.m,
              } as React.CSSProperties
            }
          >
            <div
              className={cn(
                "aspect-[4/5] overflow-hidden shadow-[0_18px_40px_-12px_rgb(0_0_0/0.7)]",
                "brightness-50 grayscale transition-[clip-path,filter] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] [clip-path:inset(100%_0_0_0)]",
                "group-data-ready/scatter:brightness-90 group-data-ready/scatter:grayscale-[0.25] group-data-ready/scatter:[clip-path:inset(0_0_0_0)]",
                "motion-reduce:transition-none",
              )}
              style={{ transitionDelay: `${300 + index * 140}ms` }}
            >
              <Photo
                photo={photo}
                locale={locale}
                sizes="(min-width: 768px) 14vw, 30vw"
                priority={index < 3}
                className="h-full"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

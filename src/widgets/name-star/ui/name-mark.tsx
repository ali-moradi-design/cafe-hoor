"use client";

import { useEffect, useRef } from "react";

import type { Locale } from "@/shared/i18n";
import { clamp, cn, hasFullMotion, onSmoothScroll } from "@/shared/lib";

import { CORE, letterFractions, NAMES } from "../model/geometry";

/**
 * The name as a vertical column in the middle of the screen. With full motion it
 * stays fixed while the page scrolls, its letters drifting apart; when the star at
 * the end of the page arrives, the column lands in the star as its upright ray and
 * the star lights up (`data-burst`). Otherwise it simply sits in the landing.
 */
export function NameMark({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const name = NAMES[locale];
  const LETTER = name.size;

  useEffect(() => {
    const mark = ref.current;
    const star = document.querySelector<HTMLElement>("[data-star]");
    if (!mark || !star || !hasFullMotion()) return;

    const letters = Array.from(mark.children) as HTMLElement[];
    const fractions = letterFractions(letters.length);
    const last = letters.length - 1;
    let starTop = 0;
    let length = 0;
    let viewport = 0;
    let burst = false;

    const measure = () => {
      const box = star.getBoundingClientRect();
      starTop = box.top + window.scrollY;
      length = box.width / 2 - CORE;
      viewport = window.innerHeight;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);

    const stop = onSmoothScroll((y) => {
      const landing = Math.max(1, starTop - viewport / 2 + length / 2);
      const progress = clamp(y / landing, 0, 1);
      const spread = (length - LETTER) * progress;
      const height = last * LETTER * (1 - progress) + spread + LETTER;
      const centred = viewport / 2 - height / 2;
      const top = Math.min(centred, starTop - y);
      // The class's `translate` keeps it centred horizontally; this adds the height.
      mark.style.transform = `translate3d(0, ${top.toFixed(1)}px, 0)`;
      letters.forEach((letter, index) => {
        const offset = index * LETTER * (1 - progress) + spread * fractions[index];
        letter.style.transform = `translate3d(0, ${(offset - index * LETTER).toFixed(1)}px, 0)`;
      });
      const landed = progress >= 1 && starTop - y <= centred + 0.5;
      if (landed !== burst) {
        burst = landed;
        star.toggleAttribute("data-burst", landed);
      }
    });

    return () => {
      stop();
      observer.disconnect();
    };
  }, [LETTER]);

  return (
    <div
      ref={ref}
      aria-hidden
      lang={locale}
      className={cn(
        "pointer-events-none absolute top-1/2 left-1/2 z-30 w-[28px] -translate-x-1/2 -translate-y-1/2 text-center [html[data-motion]_&]:fixed [html[data-motion]_&]:top-0 [html[data-motion]_&]:translate-y-0",
        name.className,
      )}
    >
      {name.letters.map((letter, index) => (
        <span
          key={index}
          data-letter=""
          className="block will-change-transform"
          style={{ height: LETTER }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}

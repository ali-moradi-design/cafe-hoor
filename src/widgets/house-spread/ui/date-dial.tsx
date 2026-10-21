"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

import type { Locale } from "@/shared/i18n";
import { cn, localizeDigits } from "@/shared/lib";

const DAY = 86_400_000;
const noop = () => () => {};

/** Today in Tehran as `YYYY-MM-DD`; `null` while rendering on the server. */
function useTodayKey(): string | null {
  return useSyncExternalStore(
    noop,
    () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran" }).format(new Date()),
    () => null,
  );
}

function parts(date: Date, locale: Locale) {
  const format = new Intl.DateTimeFormat(
    locale === "fa" ? "fa-IR-u-ca-persian-nu-latn" : "en-US-u-nu-latn",
    { timeZone: "Asia/Tehran", year: "numeric", month: "numeric", day: "numeric" },
  );
  const get = (type: string) =>
    Number(format.formatToParts(date).find((part) => part.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

/**
 * Today's date on two wheels, as on the reference site: months on the outer wheel,
 * days on the inner one, today in an upright column with the year under it. The
 * wheels wind in once the dial comes into view. Persian uses the Persian calendar.
 */
export function DateDial({ locale, className }: { locale: Locale; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const today = useTodayKey();

  useEffect(() => {
    const dial = ref.current;
    if (!dial || !today) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dial.dataset.in = "";
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          dial.dataset.in = "";
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(dial);
    return () => observer.disconnect();
  }, [today]);

  const box = cn("size-[245px] shrink-0", className);
  if (!today) return <div aria-hidden className={box} />;

  // Noon in Tehran on that day, so whole days can be added without time-zone slips.
  const now = new Date(`${today}T12:00:00+03:30`);
  const current = parts(now, locale);
  const days = Array.from({ length: 18 }, (_, index) => {
    const offset = index - 8;
    return { offset, value: parts(new Date(now.getTime() + offset * DAY), locale).day };
  });
  const months = Array.from({ length: 12 }, (_, index) => {
    const offset = index - 5;
    return { offset, value: ((current.month - 1 + offset + 120) % 12) + 1 };
  });
  const digits = (value: number) => localizeDigits(String(value), locale);

  const wheel = (
    items: { offset: number; value: number }[],
    radius: number,
    step: number,
    top: number,
    classes: string,
  ) => (
    <div
      className={cn(
        "absolute size-0 opacity-0 transition-[opacity,rotate] ease-out [[data-in]_&]:rotate-0 [[data-in]_&]:opacity-100",
        classes,
      )}
      style={{ left: `${170 - radius}px`, top: `${top}px` }}
    >
      {items.map(({ offset, value }) => (
        <span
          key={offset}
          className="absolute top-0 left-0 block w-8 origin-left text-[13px] leading-none"
          style={{
            transform: `rotate(${offset * step}deg) translateX(${radius}px) translateY(-50%)`,
            opacity: offset === 0 ? 1 : Math.max(0.08, 0.45 - Math.abs(offset) * 0.05),
          }}
        >
          {digits(value)}
        </span>
      ))}
    </div>
  );

  return (
    // The outer box is placed in the page's direction; the dial inside is always drawn left to right.
    <div ref={ref} aria-hidden className={box}>
      <div className="relative size-full" dir="ltr">
        {wheel(months, 110, 13, 66, "-rotate-[160deg] duration-[1300ms]")}
        {wheel(days, 80, 15, 120, "-rotate-[140deg] delay-200 duration-[1100ms]")}
        <span className="absolute top-[86px] left-[175px] text-[13px] opacity-0 transition-opacity delay-[800ms] duration-[400ms] [[data-in]_&]:opacity-100">
          ·
        </span>
        <span className="absolute top-[140px] left-[175px] text-[13px] opacity-0 transition-opacity delay-[1000ms] duration-[400ms] [[data-in]_&]:opacity-100">
          ·
        </span>
        <span className="absolute top-[162px] left-[172px] flex w-3 flex-col items-center text-[13px] leading-[15px] opacity-0 transition-opacity delay-[1200ms] duration-[800ms] [[data-in]_&]:opacity-100">
          {Array.from(digits(current.year)).map((digit, index) => (
            <span key={index}>{digit}</span>
          ))}
        </span>
      </div>
    </div>
  );
}

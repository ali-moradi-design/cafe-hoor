"use client";

import { useEffect, useState } from "react";

import { intlLocale, type Locale } from "@/shared/i18n";

/** The time in Tehran, so guests abroad see whether the cafe is open. Client-only. */
export function TehranClock({ locale, label }: { locale: Locale; label: string }) {
  const [time, setTime] = useState<string>();

  useEffect(() => {
    const format = new Intl.DateTimeFormat(intlLocale[locale], {
      timeZone: "Asia/Tehran",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [locale]);

  if (!time) return null;
  return (
    <p
      className="bg-white px-2 font-display text-4xl leading-tight text-red shadow-sm"
      title={label}
    >
      <span className="sr-only">{label}: </span>
      <time dir="ltr">{time}</time>
    </p>
  );
}

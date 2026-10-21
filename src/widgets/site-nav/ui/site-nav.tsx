"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

import { LocaleSwitch } from "@/features/switch-locale";
import { localePath, type Dictionary, type Locale } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { Letters } from "@/shared/ui";

/** Scrolls to an anchor on the same page in one second, eased in and out. */
function glideTo(target: HTMLElement) {
  const from = window.scrollY;
  const to = target.getBoundingClientRect().top + from + 80;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, to);
    return;
  }
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / 1000);
    const eased = 0.5 - Math.cos(t * Math.PI) / 2;
    window.scrollTo(0, from + (to - from) * eased);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/**
 * The reference site's navigation: page names written top to bottom on the start
 * edge, one letter per line, vertically centred. The language switch sits in the
 * top corner; away from home a small name links back.
 */
export function SiteNav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const home = localePath(locale);
  const isHome = pathname === home;
  const links = [
    { href: localePath(locale, "menu"), label: dict.nav.menu },
    { href: `${home}#info`, label: dict.nav.info, anchor: "info" },
    { href: localePath(locale, "gallery"), label: dict.nav.gallery },
  ];

  const onAnchor = (event: MouseEvent, anchor?: string) => {
    if (!anchor || !isHome) return;
    const target = document.getElementById(anchor);
    if (!target) return;
    event.preventDefault();
    history.replaceState(null, "", `#${anchor}`);
    glideTo(target);
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] bg-white px-4 py-2 text-night focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      >
        {dict.common.skipToContent}
      </a>
      <nav
        aria-label={dict.common.sections}
        className="no-print fixed start-1.5 top-1/2 z-40 -translate-y-1/2 sm:start-5"
      >
        <ul className="flex flex-col items-center gap-7 text-xs leading-[1.7] uppercase">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={(event) => onAnchor(event, link.anchor)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block px-1 py-1 transition-opacity hover:opacity-100 sm:px-2 rtl:font-display rtl:text-[14px] sm:rtl:text-[17px]",
                    active ? "opacity-100" : "opacity-90",
                  )}
                >
                  <Letters text={link.label} vertical />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="no-print absolute end-4 top-4 z-40 sm:end-6 sm:top-5">
        <LocaleSwitch locale={locale} label={dict.common.otherLanguage} />
      </div>
      {isHome ? null : (
        <Link
          href={home}
          className="no-print absolute start-1/2 top-5 z-40 -translate-x-1/2 text-xs tracking-[0.5em] rtl:translate-x-1/2"
          lang="en"
        >
          <span className="sr-only">{dict.nav.home}</span>
          <span aria-hidden>HOOR</span>
        </Link>
      )}
    </>
  );
}

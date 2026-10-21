"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Page-wide motion, mounted once in the layout:
 * - `<html data-scrolling>` while the page scrolls (cleared 250ms after it stops);
 *   CSS pauses every shimmer then.
 * - Shimmer: every 1.2s, about one `[data-letter]` in four switches its slow
 *   1 ↔ 0.4 opacity pulse on or off.
 */
export function MotionDriver() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    let timer = 0;
    const onScroll = () => {
      html.setAttribute("data-scrolling", "");
      // Hides the landing's "scroll down" dots for good.
      if (window.scrollY > 10) html.setAttribute("data-scrolled", "");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => html.removeAttribute("data-scrolling"), 250);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
      html.removeAttribute("data-scrolling");
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = Array.from(document.querySelectorAll<HTMLElement>("[data-letter]"));
    const interval = window.setInterval(() => {
      if (document.documentElement.hasAttribute("data-scrolling")) return;
      for (const letter of letters) {
        if (Math.random() < 0.25) letter.toggleAttribute("data-shimmer");
      }
    }, 1200);
    return () => window.clearInterval(interval);
  }, [pathname]);

  return null;
}

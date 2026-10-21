"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fades `[data-reveal]` elements in as they scroll into view. One observer for the
 * whole page; re-scans after client navigation. Without JavaScript nothing is hidden.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-shown", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document
      .querySelectorAll("[data-reveal]:not([data-shown])")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib";

export type SideTab = { href: string; label: string; tone: "white" | "mint" | "sage" };

const tones: Record<SideTab["tone"], string> = {
  white: "bg-white",
  mint: "bg-mint-soft",
  sage: "bg-sage-soft",
};

/**
 * Wide screens: three tall strips on the page edge, one per page, each in that
 * page's background colour. Labels run vertically; the open page's label is red.
 */
export function SideTabs({ tabs, label }: { tabs: SideTab[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className="no-print fixed inset-y-0 end-0 z-50 hidden lg:flex">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex w-9 items-start justify-center border-s pt-28 shadow-[-3px_0_6px_-4px_rgb(0_0_0/0.25)] transition-[width] duration-300 hover:w-11 motion-reduce:transition-none",
              tones[tab.tone],
              active ? "border-red" : "border-mint",
            )}
          >
            <span
              className={cn(
                "font-display text-lg uppercase [writing-mode:vertical-rl] ltr:tracking-[0.3em]",
                active ? "text-red-deep" : "text-ink group-hover:text-red-deep",
              )}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

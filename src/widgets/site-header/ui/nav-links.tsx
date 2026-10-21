"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib";

export function NavLinks({ links }: { links: Array<{ href: string; label: string }> }) {
  const pathname = usePathname();
  return (
    <ul className="-mx-4 no-scrollbar flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "block rounded-full px-3.5 py-1.5 font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-gold",
                active
                  ? "bg-cream text-forest"
                  : "text-cream/85 hover:bg-white/10 hover:text-cream",
              )}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

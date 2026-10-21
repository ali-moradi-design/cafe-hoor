"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/shared/lib";
import { CloseIcon, MenuIcon } from "@/shared/ui";

/** Phone and tablet menu: a full-width mint panel under the header. */
export function MobileNav({
  links,
  labels,
}: {
  links: Array<{ href: string; label: string }>;
  labels: { open: string; close: string };
}) {
  const pathname = usePathname();
  // Remember which page the panel was opened on: it closes by itself after navigating.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpenOn(open ? null : pathname)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? labels.close : labels.open}
        className="grid size-11 place-items-center text-2xl text-red"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>
      <nav
        id="mobile-nav"
        aria-label="Pages"
        hidden={!open}
        className="absolute inset-x-0 top-full border-t border-mint bg-mint-soft shadow-md"
      >
        <ul className="mx-auto max-w-7xl px-4 py-4 sm:px-8">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={cn(
                  "block py-3 font-display text-3xl",
                  pathname === link.href ? "text-red-deep" : "text-pine",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

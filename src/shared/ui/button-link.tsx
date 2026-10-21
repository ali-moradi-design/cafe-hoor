import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "../lib";

type Variant = "outline" | "solid";

const variants: Record<Variant, string> = {
  // Thin red frame with a flat mint shadow, as on printed menus.
  outline: "border border-red bg-white text-red offset-mint hover:bg-red hover:text-white",
  solid: "bg-red text-white hover:bg-red-deep",
};

export const buttonClass = (variant: Variant = "outline", className?: string) =>
  cn(
    "inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2 font-display text-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-4",
    variants[variant],
    className,
  );

export function ButtonLink({
  variant = "outline",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}

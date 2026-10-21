import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "../lib";

type Variant = "primary" | "outline" | "light";

const variants: Record<Variant, string> = {
  primary: "bg-forest text-cream hover:bg-forest-deep",
  outline: "border-forest text-forest border-2 hover:bg-forest hover:text-cream",
  light: "bg-cream text-forest hover:bg-sand",
};

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2.5 font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

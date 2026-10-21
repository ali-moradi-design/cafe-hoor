import type { ReactNode } from "react";

import { cn } from "../lib";

/** Big red condensed title with a pastel echo; `center` for story sections. */
export function SectionHeading({
  title,
  lead,
  as: Tag = "h2",
  center = false,
  className,
}: {
  title: ReactNode;
  lead?: ReactNode;
  as?: "h1" | "h2";
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mb-10", center ? "mx-auto text-center" : "max-w-2xl", className)}>
      <Tag
        className={cn(
          "font-display text-red uppercase title-echo",
          Tag === "h1" ? "text-5xl sm:text-7xl" : "text-4xl sm:text-6xl",
        )}
      >
        {title}
      </Tag>
      {lead ? (
        <p className={cn("mt-4 text-lg text-ink/80", center && "mx-auto max-w-2xl")}>{lead}</p>
      ) : null}
    </div>
  );
}

import type { ReactNode } from "react";

export function SectionHeading({
  title,
  lead,
  as: Tag = "h2",
}: {
  title: ReactNode;
  lead?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-8 max-w-2xl">
      <Tag
        className={
          Tag === "h1"
            ? "text-4xl font-black text-forest sm:text-5xl"
            : "text-3xl font-extrabold text-forest sm:text-4xl"
        }
      >
        {title}
      </Tag>
      <span aria-hidden className="mt-3 block h-1 w-14 rounded-full bg-gold" />
      {lead ? <p className="mt-4 text-lg text-ink/75">{lead}</p> : null}
    </div>
  );
}

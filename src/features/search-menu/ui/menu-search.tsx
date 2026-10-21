"use client";

import { SearchIcon } from "@/shared/ui";

export function MenuSearch({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <SearchIcon className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-xl text-ink/45" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        enterKeyHint="search"
        className="w-full rounded-full border border-sand bg-white py-3 ps-12 pe-4 text-base outline-none focus:border-forest focus:ring-4 focus:ring-forest/20"
      />
    </label>
  );
}

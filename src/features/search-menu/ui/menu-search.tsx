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
      <SearchIcon className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-xl text-pine" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        enterKeyHint="search"
        className="min-h-11 w-full border border-pine bg-white py-2 ps-10 pe-3 text-base text-ink outline-none placeholder:text-ink/60 focus:ring-2 focus:ring-red"
      />
    </label>
  );
}

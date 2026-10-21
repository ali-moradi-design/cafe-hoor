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
      <SearchIcon className="pointer-events-none absolute start-0 top-1/2 -translate-y-1/2 text-base" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        enterKeyHint="search"
        className="min-h-11 w-full border-b border-white/60 bg-transparent py-2 ps-7 pe-1 text-[14px] text-white outline-none placeholder:text-dim focus:border-mint"
      />
    </label>
  );
}

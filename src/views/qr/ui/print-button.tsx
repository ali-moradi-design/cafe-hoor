"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="min-h-11 border border-white px-6 text-[13px] tracking-[0.1em] uppercase transition-colors hover:bg-white hover:text-night print:hidden"
    >
      {label}
    </button>
  );
}

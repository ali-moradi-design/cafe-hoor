"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="min-h-11 border border-red bg-white px-6 font-display text-lg text-red offset-mint hover:bg-red hover:text-white print:hidden"
    >
      {label}
    </button>
  );
}

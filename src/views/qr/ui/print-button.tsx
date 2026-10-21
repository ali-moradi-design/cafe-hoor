"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="min-h-11 rounded-full bg-forest px-6 font-bold text-cream hover:bg-forest-deep print:hidden"
    >
      {label}
    </button>
  );
}

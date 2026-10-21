import type { ReactNode } from "react";

/** Bare root layout for the two redirect pages (`/` and `/menu/`); real pages live under `[locale]`. */
export default function RedirectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>{children}</body>
    </html>
  );
}

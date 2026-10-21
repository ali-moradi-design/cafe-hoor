import type { Cafe } from "@/entities/cafe";
import type { Dictionary, Locale } from "@/shared/i18n";
import { InstagramIcon } from "@/shared/ui";

import { TehranClock } from "./tehran-clock";

/** Bottom corner: Tehran time, a round black "book a table" button and Instagram. */
export function FloatingActions({
  locale,
  dict,
  cafe,
}: {
  locale: Locale;
  dict: Dictionary;
  cafe: Cafe;
}) {
  return (
    <div className="no-print fixed end-4 bottom-4 z-40 flex flex-col items-end gap-3 lg:end-32 lg:bottom-8">
      <div className="hidden sm:block">
        <TehranClock locale={locale} label={dict.common.tehranTime} />
      </div>
      <a
        href={`tel:${cafe.phone}`}
        className="grid size-[4.5rem] place-items-center rounded-full bg-black px-2 text-center font-display text-base leading-tight text-white shadow-lg transition-transform hover:scale-105 motion-reduce:transition-none"
      >
        {dict.common.book}
      </a>
      <a
        href={cafe.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={dict.common.instagram}
        className="hidden size-10 place-items-center self-center text-2xl text-black sm:grid"
      >
        <InstagramIcon />
      </a>
    </div>
  );
}

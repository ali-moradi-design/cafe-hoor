import { formatHours, type Cafe } from "@/entities/cafe";
import type { Dictionary, Locale } from "@/shared/i18n";
import { localizeDigits } from "@/shared/lib";
import { ClockIcon, InstagramIcon, PhoneIcon, PinIcon } from "@/shared/ui";

/** Address, phone, hours and Instagram as cards; used on Home and Contact. */
export function VisitInfo({
  locale,
  dict,
  cafe,
  headingLevel: Heading = "h3",
}: {
  locale: Locale;
  dict: Dictionary;
  cafe: Cafe;
  /** `h2` when the page has no section heading above the cards. */
  headingLevel?: "h2" | "h3";
}) {
  const cards = [
    {
      icon: <PinIcon />,
      title: dict.contact.address,
      body: cafe.address[locale],
      action: { href: cafe.mapUrl, label: dict.common.openMap, external: true },
    },
    {
      icon: <ClockIcon />,
      title: dict.contact.hours,
      body: `${dict.common.everyDay}${dict.common.comma}${formatHours(cafe.hours, locale)}`,
    },
    {
      icon: <PhoneIcon />,
      title: dict.contact.phone,
      body: <span dir="ltr">{localizeDigits(cafe.phoneDisplay, locale)}</span>,
      action: { href: `tel:${cafe.phone}`, label: dict.common.call, external: false },
    },
    {
      icon: <InstagramIcon />,
      title: dict.contact.follow,
      body: <span dir="ltr">@hoorfamily</span>,
      action: { href: cafe.instagram, label: dict.common.instagram, external: true },
    },
  ];

  return (
    <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <li key={card.title} className="flex flex-col border-t border-red pt-5" data-reveal>
          <span className="text-2xl text-red">{card.icon}</span>
          <Heading className="mt-3 font-display text-2xl text-red">{card.title}</Heading>
          <p className="mt-1 flex-1 text-lg text-ink">{card.body}</p>
          {card.action ? (
            <a
              href={card.action.href}
              {...(card.action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="mt-4 self-start border border-red px-4 py-1.5 font-display text-lg text-red offset-mint transition-colors hover:bg-red hover:text-white"
            >
              {card.action.label}
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

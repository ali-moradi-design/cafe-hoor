# Redesign after thisisamber.co.uk (pink → pastel green)

Applied on 2026-10-21; tokens live in `src/app/globals.css`.

Reference, section by section:

- First-visit splash: line-art logo centred on white, fades out.
- Header: white/transparent, fixed, 100px; logo at the start; centred thin (Roboto 300, 18px) red links.
- Desktop edge strips (end side): vertical condensed labels; About (white), Menu (mint #d8f3ea), Gallery (pastel #e9f6ef).
  Active strip: red label + thin border; each strip opens its page with that page background.
- Hero: full-width photo slider, crossfade, thin white timeline line with red dots, active dot = ring.
- Floating, fixed bottom-end: black round "Book a table" (tel), red condensed clock (Tehran time) on white, Instagram icon.
- "Our story": huge red condensed heading with pastel echo shadow; 38px light paragraph, words turn from
  faded pastel (#5e9f80) to red as you scroll.
- Second block: round photo carousel with pastel ring, outline triangle arrows, small dots; text beside it.
- Booking: red light text on the start side; card on a pastel square with red offset shadow, photo, red button.
- Menu page: mint background; framed "printed menu" (1px pine border); logo centred; centred condensed
  caps section titles; two columns, centred bold name + description + price; sticky "▶ category" dropdown.
- Buttons: 1px red border, red condensed text, 6px 6px 0 mint offset shadow. Photos: mint offset shadow.
- Sections fade up on scroll (only with JS; respect reduced motion).
- Contrast: red #d8241f on white (5.0), #c9211d on mint (4.8); faded words only at 24px+ (3.1).
- Fonts: Oswald + Roboto (en), Lalezar + Vazirmatn (fa).

# Redesign after destroyer.la

Reference studied on 2026-10-21 (`destroyer.js`, computed styles, screenshots).
We copy the structure and the motion, not their files: no images, fonts or code
from the reference are used.

## Look

- Dark grainy background (`#232323` plus fine noise), white text, one monospace
  face at 12–16px. Lots of empty space; content sits in narrow columns.
- Vertical navigation on the start edge: one letter per line (`M E N U`,
  `I N F O`, `J O U R N A L`), 12px.
- Footer: one row of tiny uppercase links split by `|`.

## Home, top to bottom

1. **Landing**: a full screen of grain. The name stands in the middle as a
   vertical column of letters. Four small dots pulse one after another at the
   bottom ("scroll down"); they fade out on the first scroll.
2. **Menu**: a tall photo in the middle, hours and links in the start column,
   a round date dial (month and day on wheels, today in a column) beside the
   photo. Dishes are written as lists of ingredients, one per line, each line
   pushed in by a random amount (seeded by today's date, so it is stable for a
   day). Items sit in two staggered sub-columns per side. A second photo closes
   the section.
3. **Info**: a round clock (hour numbers revealed up to the current hour, dots
   for hour, minute and second), hours, email and phone; a photo in the middle;
   the address at the far end.
4. **Journal**: a stack of photo cards. The front card is full size; each card
   behind is 40px lower, 10% smaller and 20% fainter. Arrows on both sides and
   the keyboard arrows move the stack (0.6s).
5. **The end**: a star made of 36 copies of the vertical name, rotated 10° each.
   The fixed name in the middle of the screen lands in the star's centre; then
   the rays light up letter by letter. Tiny Roman numerals and "press spacebar"
   start a small shooter game against the star's letters.

## Motion

- Native scrolling. One animation loop keeps a smoothed scroll value:
  `smooth += (scrollY - smooth) * 0.2` per frame; every effect reads it.
- Fixed name: centred in the viewport. As the page scrolls, the gap after each
  letter grows; the first letter's gap grows most, the last letter's least.
- Photos: over the first third of a screen after they enter, opacity goes from
  0.3 to 1 and they rise 100px; past that they fade slightly again.
- Shimmer: every 1.2s, about one letter in four (navigation, star) toggles a
  slow 1 ↔ 0.4 opacity pulse. All pulses pause while the page scrolls and
  resume 250ms after it stops.
- Repulsion: while the page is still and the pointer is over the menu or info
  text, each line is pushed away from the pointer and springs back home.
- Date dial and clock wind in once when they come into view.
- Phones and touch screens: no repulsion, no parallax; the name fades out after
  the landing.

## Our version

- Background: `public/textures/grain.jpg`, made by `scripts/make-grain.mjs` to
  the reference's measured numbers (mean luminance, grain, unevenness, specks).
- Landing: seven photos scattered around the name develop in like prints; on
  scroll each drifts at its own speed, grows or shrinks, tilts and fades; with
  a fine pointer they lean with it.
- The side navigation starts with Home on every page.

- Name: `HOORFAMILY` (the Instagram name) as the vertical column.
- Persian: same layout mirrored; labels that are words run with
  `writing-mode: vertical-rl` so Persian letters stay joined. The dial uses the
  Persian calendar, the clock Tehran time.
- Pages: home as above, but its menu block shows the house (photos with
  captions) instead of dishes; `/menu` is the full menu in even columns with
  dish photos beside their dishes and
  search; `/gallery` is the photo stack plus a grid that opens the lightbox.
- Fonts: IBM Plex Mono (English); Vazirmatn for Persian text and Noto Nastaliq
  Urdu for Persian titles, dish names and the side navigation.
- Reduced motion: no smoothing, shimmer, repulsion or game; everything shows at
  its final state.

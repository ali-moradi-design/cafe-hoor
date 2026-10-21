import { cn } from "../lib";

const latin = /^[\u0000-ɏ\s]+$/;

/**
 * Text split into letters that `MotionDriver` can make shimmer. `vertical` stacks
 * Latin letters one per line; Persian words are kept whole (so their letters stay
 * joined) and run top to bottom with `writing-mode`. Screen readers get the plain
 * text once, unless the parent already names it (`decorative`).
 */
export function Letters({
  text,
  vertical = false,
  decorative = false,
  className,
}: {
  text: string;
  vertical?: boolean;
  decorative?: boolean;
  className?: string;
}) {
  const isLatin = latin.test(text);
  const pieces = isLatin ? Array.from(text) : text.split(/(\s+)/).filter(Boolean);

  return (
    <>
      {decorative ? null : <span className="sr-only">{text}</span>}
      <span
        aria-hidden
        className={cn(
          vertical && isLatin && "flex flex-col items-center",
          vertical && !isLatin && "inline-block [writing-mode:vertical-rl]",
          className,
        )}
      >
        {pieces.map((piece, index) =>
          piece.trim() === "" ? (
            <span key={index} className={vertical && isLatin ? "block h-[0.7em]" : undefined}>
              {vertical ? null : " "}
            </span>
          ) : (
            <span key={index} data-letter="" className={vertical && isLatin ? "block" : undefined}>
              {piece}
            </span>
          ),
        )}
      </span>
    </>
  );
}

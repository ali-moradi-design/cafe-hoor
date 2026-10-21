"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "../lib";

/**
 * Large story text whose words turn from pastel green to red as the reader scrolls
 * through it. The full text is always in the DOM; only the colour changes.
 */
export function WordReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(/\s+/);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    // Reduced motion: show the text fully coloured, no scroll effect.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = ref.current?.getBoundingClientRect();
      if (!box) return;
      const view = window.innerHeight;
      const progress = still ? 1 : (view * 0.85 - box.top) / (box.height + view * 0.25);
      setLit(Math.round(Math.min(1, Math.max(0, progress)) * words.length));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    if (still) return () => cancelAnimationFrame(frame);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [words.length]);

  return (
    <p ref={ref} className={cn("text-2xl leading-[1.45] font-light sm:text-[2.4rem]", className)}>
      {words.map((word, index) => (
        <span
          key={index}
          className={cn("transition-colors duration-300", index < lit ? "text-red" : "text-pastel")}
        >
          {word}{" "}
        </span>
      ))}
    </p>
  );
}

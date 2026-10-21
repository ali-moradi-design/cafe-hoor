"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn, hasFullMotion, mapRange, onSmoothScroll } from "../lib";

/**
 * Photo entrance from the reference site: over the first third of a screen after
 * the block comes into view, its content goes from 30% to full opacity and rises
 * 100px; afterwards it keeps drifting up and slowly fades again. Static without
 * full motion.
 */
export function Parallax({
  children,
  className,
  extra = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Pixels added to the effect's length (longer, slower entrance). */
  extra?: number;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = outer.current;
    const content = inner.current;
    if (!box || !content || !hasFullMotion()) return;

    let start = 0;
    let end = 1;
    const measure = () => {
      const top = box.getBoundingClientRect().top + window.scrollY;
      start = top - window.innerHeight;
      end = start + window.innerHeight / 3 + extra;
    };
    measure();
    window.addEventListener("resize", measure);

    const stop = onSmoothScroll((y) => {
      let opacity = mapRange(y, start, end, 0.3, 1);
      if (opacity > 1) opacity = 1 - Math.abs(1 - opacity) * 0.4;
      opacity = Math.max(0.3, Math.min(1, opacity));
      const shift = Math.max(-240, mapRange(y, start, end, 100, 0));
      content.style.opacity = opacity.toFixed(3);
      content.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    });

    return () => {
      stop();
      window.removeEventListener("resize", measure);
    };
  }, [extra]);

  return (
    <div ref={outer} className={className}>
      <div ref={inner} className="h-full will-change-transform">
        {children}
      </div>
    </div>
  );
}

/** Four dots pulsing one after another: "scroll down". Fades out on the first scroll. */
export function ScrollDots({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "scroll-dots flex flex-col items-center gap-2.5 transition-opacity duration-700",
        className,
      )}
    >
      {[0, 1, 2, 3].map((index) => (
        <span
          key={index}
          className="block size-1.5 rounded-full bg-white"
          style={{ animationDelay: `${index * 0.4}s` }}
        />
      ))}
    </div>
  );
}

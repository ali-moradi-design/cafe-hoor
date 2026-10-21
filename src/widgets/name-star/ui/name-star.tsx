"use client";

import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/shared/i18n";
import { cn, hasFullMotion, localizeDigits } from "@/shared/lib";

import { CORE, groupFractions, NAMES, RAYS, restLength } from "../model/geometry";
const numerals = [["I"], ["II", "III"], ["IV", "V", "VI"], ["VII", "VIII", "IX"]];

/**
 * The end of the home page: a star of 36 copies of the vertical name. The upright
 * ray is where `NameMark` lands (with full motion it is drawn by the mark itself);
 * the rays then light up from the centre out. At the very bottom, the space bar
 * starts a small shooter game against the star's letters.
 */
export function NameStar({
  locale,
  labels,
}: {
  locale: Locale;
  labels: { pressSpace: string; score: string };
}) {
  const shipRef = useRef<HTMLDivElement>(null);
  // The star always spells the English name; only the landing name is localised.
  const name = NAMES.en;
  const markLands = NAMES[locale].lands;
  const count = name.letters.length;
  const fractions = groupFractions(name.groups);
  const [atBottom, setAtBottom] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);

  // "press spacebar" appears once the page is scrolled to the very end.
  useEffect(() => {
    if (!hasFullMotion()) return;
    const onScroll = () => {
      const end = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      if (end) setAtBottom(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The game: arrows move the ship, the space bar fires. A hit letter disappears.
  useEffect(() => {
    const ship = shipRef.current;
    if (!atBottom || !ship) return;

    let started = false;
    let targets: { element: HTMLElement; x: number; y: number; hit: boolean }[] = [];
    let direction = 0;
    let position = 50;
    let frame = 0;
    const missiles = new Set<{ element: HTMLElement; x: number; y: number }>();

    const loop = () => {
      if (direction) {
        position = Math.min(100, Math.max(0, position + direction * 0.8));
        ship.style.left = `${position}%`;
      }
      for (const missile of missiles) {
        missile.y -= 9;
        missile.element.style.transform = `translate3d(${missile.x}px, ${missile.y}px, 0)`;
        const hit = targets.find(
          (target) => !target.hit && Math.hypot(target.x - missile.x, target.y - missile.y) < 24,
        );
        if (hit || missile.y < -20) {
          missile.element.remove();
          missiles.delete(missile);
        }
        if (hit) {
          hit.hit = true;
          hit.element.style.visibility = "hidden";
          const blast = document.createElement("div");
          blast.className = "star-blast";
          blast.style.transform = `translate3d(${hit.x - 12}px, ${hit.y - 12}px, 0)`;
          document.body.append(blast);
          window.setTimeout(() => blast.remove(), 600);
          setScore((value) => value + 10);
        }
      }
      frame = requestAnimationFrame(loop);
    };

    const fire = () => {
      const box = ship.getBoundingClientRect();
      const element = document.createElement("div");
      element.className = "star-missile";
      document.body.append(element);
      missiles.add({ element, x: box.left + box.width / 2, y: box.top });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (!started) {
          started = true;
          targets = Array.from(document.querySelectorAll<HTMLElement>("[data-star-letter]"))
            .filter((element) => element.offsetParent && getComputedStyle(element).opacity !== "0")
            .map((element) => {
              const box = element.getBoundingClientRect();
              return {
                element,
                x: box.left + box.width / 2,
                y: box.top + box.height / 2,
                hit: false,
              };
            });
          setPlaying(true);
          frame = requestAnimationFrame(loop);
        }
        fire();
      } else if (started && event.code === "ArrowRight") {
        event.preventDefault();
        direction = 1;
      } else if (started && event.code === "ArrowLeft") {
        event.preventDefault();
        direction = -1;
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "ArrowRight" || event.code === "ArrowLeft") direction = 0;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      for (const missile of missiles) missile.element.remove();
    };
  }, [atBottom]);

  const digits = String(score).padStart(5, " ");

  return (
    <div className="relative pt-16" dir="ltr" data-no-shimmer="">
      <div
        data-star=""
        aria-hidden
        className="group/star relative mx-auto aspect-square w-[min(86vw,760px)]"
      >
        {Array.from({ length: RAYS }, (_, ray) => (
          <div
            key={ray}
            className={
              ray === 0
                ? cn(
                    "absolute top-0 left-1/2 -ml-[15px] h-1/2 w-[30px] origin-bottom",
                    markLands && "[html[data-motion]_&]:invisible",
                  )
                : "absolute top-0 left-1/2 -ml-[15px] h-1/2 w-[30px] origin-bottom"
            }
            style={{ transform: `rotate(${ray * 10}deg)` }}
          >
            <div className="relative" style={{ height: `calc(100% - ${CORE}px)` }}>
              {name.letters.map((letter, index) => (
                <span
                  key={index}
                  data-star-letter=""
                  className={cn(
                    "absolute inset-x-0 block text-center transition-opacity duration-300 ease-out [html[data-motion]_&]:opacity-0 [html[data-motion]_&]:group-data-burst/star:opacity-100",
                    name.className,
                  )}
                  style={{
                    top: `calc(${index * name.size + name.groups[index] * name.wordGap}px + (100% - ${restLength(name)}px) * ${fractions[index]})`,
                    height: name.size,
                    transitionDelay: `${(count - 1 - index) * 50}ms`,
                  }}
                >
                  <span data-letter="" className="inline-block">
                    {letter}
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div aria-hidden className="mt-24 flex flex-col items-center text-[10px] leading-[1.3]">
        {numerals.map((row) => (
          <span key={row[0]} className="flex gap-1.5">
            {row.map((numeral) => (
              <span key={numeral}>{numeral}</span>
            ))}
          </span>
        ))}
      </div>

      <div aria-hidden className="relative mt-10 h-16">
        <p
          className={
            atBottom && !playing
              ? "animate-pulse text-center text-sm font-bold tracking-[0.06em] opacity-70 transition-opacity"
              : "pointer-events-none text-center text-sm font-bold opacity-0"
          }
          lang={locale}
        >
          {labels.pressSpace}
        </p>
        <p className={playing ? "text-center text-xs tracking-[0.2em] whitespace-pre" : "hidden"}>
          <span lang={locale}>{labels.score}</span> {localizeDigits(digits, locale)}
        </p>
        <div
          ref={shipRef}
          className={
            playing
              ? "absolute bottom-0 left-1/2 h-4 w-6 -translate-x-1/2 bg-white [clip-path:polygon(50%_0,100%_100%,0_100%)]"
              : "hidden"
          }
        />
      </div>
    </div>
  );
}

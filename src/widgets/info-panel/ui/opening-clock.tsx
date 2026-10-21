"use client";

import { useEffect, useId, useRef } from "react";

import type { Locale } from "@/shared/i18n";
import { localizeDigits } from "@/shared/lib";

const SIZE = 240;
const C = SIZE / 2;
const RING = 70;
const NUMBERS = 100;
const DOTTED = 2 * Math.PI * RING;

function tehranNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tehran",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return { hour: get("hour"), minute: get("minute"), second: get("second") };
}

/** Polar point on the dial; 0° is twelve o'clock, clockwise. */
function point(angle: number, radius: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: C + radius * Math.cos(rad), y: C + radius * Math.sin(rad) };
}

/**
 * Round clock in Tehran time, as on the reference site: the hour numbers since the
 * cafe opened are shown, a dotted arc covers that part of the day, and three dots
 * mark the hour, the minute and the second. The hands wind in when it comes into view.
 */
export function OpeningClock({ locale, opens }: { locale: Locale; opens: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const hour = svg.querySelector<SVGGElement>("[data-hand=hour]")!;
    const minute = svg.querySelector<SVGGElement>("[data-hand=minute]")!;
    const second = svg.querySelector<SVGGElement>("[data-hand=second]")!;
    const arc = svg.querySelector<SVGCircleElement>("[data-arc]")!;
    const numbers = Array.from(svg.querySelectorAll<SVGTextElement>("[data-hour]"));
    const openHour = Number(opens.split(":")[0]);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = 0;
    let started = false;

    const draw = (intro: boolean) => {
      const now = tehranNow();
      const hours = now.hour + now.minute / 60;
      const open = Math.min(12, Math.max(0, hours - openHour));
      const transition = intro && !still ? "transform 1.8s cubic-bezier(0.22, 1, 0.36, 1)" : "none";
      for (const [hand, angle] of [
        [hour, (hours % 12) * 30],
        [minute, now.minute * 6],
        [second, now.second * 6],
      ] as const) {
        hand.style.transition = transition;
        hand.style.transform = `rotate(${angle}deg)`;
      }
      arc.style.transition = intro && !still ? "stroke-dashoffset 1.8s ease-out" : "none";
      arc.style.strokeDashoffset = String(DOTTED - (DOTTED / 12) * open);
      numbers.forEach((number) => {
        const value = Number(number.dataset.hour);
        const since = (((value - openHour) % 12) + 12) % 12;
        number.style.opacity = open >= 12 || since <= open ? "1" : "0";
      });
    };

    const start = () => {
      if (started) return;
      started = true;
      draw(true);
      timer = window.setInterval(() => draw(false), 1000);
    };
    const observer = new IntersectionObserver(([entry]) => entry?.isIntersecting && start(), {
      threshold: 0.4,
    });
    observer.observe(svg);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [opens]);

  const openAngle = Number(opens.split(":")[0]) * 30;
  const arcStart = point(openAngle, RING);
  const maskId = `clock-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={SIZE}
      height={SIZE}
      aria-hidden
      className="block overflow-visible"
      fill="none"
      stroke="currentColor"
    >
      <circle cx={C} cy={C} r={RING} strokeOpacity={0.35} />
      <circle cx={C} cy={C} r={40} strokeOpacity={0.18} />
      {/* Dotted ring, shown only along the part of the day since opening (the mask). */}
      <mask id={maskId}>
        <circle
          data-arc=""
          cx={C}
          cy={C}
          r={RING}
          stroke="#fff"
          strokeWidth={8}
          strokeDasharray={DOTTED}
          strokeDashoffset={DOTTED}
          transform={`rotate(${openAngle - 90} ${C} ${C})`}
        />
      </mask>
      <circle
        cx={C}
        cy={C}
        r={RING}
        mask={`url(#${maskId})`}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray="0.5 5"
      />
      <circle cx={arcStart.x} cy={arcStart.y} r={3} fill="currentColor" stroke="none" />
      {Array.from({ length: 12 }, (_, index) => {
        const value = index + 1;
        const at = point(value * 30, NUMBERS);
        return (
          <text
            key={value}
            data-hour={value}
            x={at.x}
            y={at.y}
            fill="currentColor"
            stroke="none"
            fontSize={10}
            textAnchor="middle"
            dominantBaseline="central"
            style={{ opacity: 0, transition: "opacity 0.6s" }}
          >
            {localizeDigits(String(value), locale)}
          </text>
        );
      })}
      <g data-hand="hour" style={{ transformOrigin: "center", transformBox: "view-box" }}>
        <circle cx={C} cy={C - NUMBERS + 18} r={5} fill="currentColor" stroke="none" />
      </g>
      <g data-hand="minute" style={{ transformOrigin: "center", transformBox: "view-box" }}>
        <circle cx={C} cy={C - 40} r={2.5} fill="currentColor" stroke="none" />
      </g>
      <g data-hand="second" style={{ transformOrigin: "center", transformBox: "view-box" }}>
        <circle cx={C} cy={C - RING} r={3.5} fill="var(--color-night)" />
      </g>
    </svg>
  );
}

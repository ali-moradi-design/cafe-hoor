"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { hasFullMotion, isScrolling, onSmoothScroll } from "../lib";

/** Pixels per frame each line moves toward the pointer, and the spring back home. */
const PULL = 0.5;
const SPRING = 0.1;

/**
 * While the page is still, every `[data-repel]` line inside leans a few pixels
 * toward the pointer and springs back when it leaves, as on the reference site.
 * Only with a fine pointer and full motion.
 */
export function RepelField({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = ref.current;
    if (!field || !hasFullMotion()) return;

    type Atom = { element: HTMLElement; ox: number; oy: number; x: number; y: number };
    let atoms: Atom[] = [];
    let pointer: { x: number; y: number } | null = null;

    const measure = () => {
      for (const atom of atoms) atom.element.style.transform = "";
      const box = field.getBoundingClientRect();
      atoms = Array.from(field.querySelectorAll<HTMLElement>("[data-repel]")).map((element) => {
        const rect = element.getBoundingClientRect();
        const ox = rect.left - box.left + rect.width / 2;
        const oy = rect.top - box.top + rect.height / 2;
        return { element, ox, oy, x: ox, y: oy };
      });
    };

    const onMove = (event: PointerEvent) => {
      const box = field.getBoundingClientRect();
      pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
    };
    const onLeave = () => {
      pointer = null;
    };

    measure();
    field.addEventListener("pointermove", onMove);
    field.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", measure);

    const stop = onSmoothScroll(() => {
      if (isScrolling()) return;
      for (const atom of atoms) {
        let vx = (atom.ox - atom.x) * SPRING;
        let vy = (atom.oy - atom.y) * SPRING;
        if (pointer) {
          const angle = Math.atan2(atom.y - pointer.y, atom.x - pointer.x);
          vx -= PULL * Math.cos(angle);
          vy -= PULL * Math.sin(angle);
        }
        if (Math.abs(vx) < 0.01 && Math.abs(vy) < 0.01) continue;
        atom.x += vx;
        atom.y += vy;
        atom.element.style.transform = `translate(${(atom.x - atom.ox).toFixed(2)}px, ${(atom.y - atom.oy).toFixed(2)}px)`;
      }
    });

    return () => {
      stop();
      field.removeEventListener("pointermove", onMove);
      field.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

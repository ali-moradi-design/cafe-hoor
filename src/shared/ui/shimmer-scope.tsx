"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Arabic-script runs stay whole words, so their letters keep joining. */
const arabic = /[؀-ۿﭐ-﷿ﹰ-﻿]/;
const skip = "[data-letter], [data-no-shimmer], .sr-only, svg, script, style, [aria-live]";

/**
 * Lets every piece of text inside shimmer like the reference site's letters: once
 * mounted, it splits the static text into `[data-letter]` spans (Latin letter by
 * letter, Persian word by word) for `MotionDriver` to pulse. Parts that React
 * re-renders must be marked `data-no-shimmer`. Nothing happens with reduced motion.
 */
export function ShimmerScope({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) =>
        node.nodeValue?.trim() && !node.parentElement?.closest(skip)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT,
    });
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);

    for (const node of nodes) {
      const fragment = document.createDocumentFragment();
      for (const word of (node.nodeValue ?? "").split(/(\s+)/)) {
        if (!word) continue;
        if (!word.trim()) {
          fragment.append(word);
        } else if (arabic.test(word)) {
          const span = document.createElement("span");
          span.dataset.letter = "";
          span.textContent = word;
          fragment.append(span);
        } else {
          // Keep a Latin word on one line while its letters are separate spans.
          const holder = document.createElement("span");
          holder.className = "whitespace-nowrap";
          for (const char of word) {
            const span = document.createElement("span");
            span.dataset.letter = "";
            span.textContent = char;
            holder.append(span);
          }
          fragment.append(holder);
        }
      }
      node.replaceWith(fragment);
    }
  }, []);

  return <div ref={ref}>{children}</div>;
}

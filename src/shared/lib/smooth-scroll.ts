/**
 * One animation loop for every scroll effect on the page. It follows `scrollY`
 * with easing (`smooth += (scrollY - smooth) * 0.2` per frame), so effects glide
 * a little behind the page. With reduced motion the value is `scrollY` itself.
 * The loop runs only while something listens.
 */
type Listener = (smoothY: number) => void;

const listeners = new Set<Listener>();
let smoothY = 0;
let frame = 0;
let still = false;

function tick() {
  const target = window.scrollY;
  smoothY = still || Math.abs(target - smoothY) < 0.1 ? target : smoothY + (target - smoothY) * 0.2;
  for (const listener of listeners) listener(smoothY);
  frame = requestAnimationFrame(tick);
}

export function onSmoothScroll(listener: Listener): () => void {
  if (listeners.size === 0) {
    still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    smoothY = window.scrollY;
    frame = requestAnimationFrame(tick);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) cancelAnimationFrame(frame);
  };
}

/** True while the page is scrolling (set by `MotionDriver`). */
export function isScrolling(): boolean {
  return document.documentElement.hasAttribute("data-scrolling");
}

/**
 * Full motion: a fine pointer, a wide screen and no reduced-motion wish. Set on
 * `<html data-motion>` by the inline script in the layout before the first paint.
 */
export function hasFullMotion(): boolean {
  return document.documentElement.hasAttribute("data-motion");
}

import { useEffect, useRef } from "react";

/** Pointer-driven flourishes are for mouse users only — never touch, never reduced motion. */
function pointerEffectsWanted() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const clamp = (v: number, limit: number) => Math.max(-limit, Math.min(limit, v));

/**
 * Element drifts a few pixels toward the cursor while it's over it, then
 * springs back. Give it a `magnetic` class for the return transition.
 */
export function useMagnetic<T extends HTMLElement>(pull = 0.3, maxPx = 7) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !pointerEffectsWanted()) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = node.getBoundingClientRect();
        const x = clamp((e.clientX - (r.left + r.width / 2)) * pull, maxPx);
        const y = clamp((e.clientY - (r.top + r.height / 2)) * pull, maxPx);
        node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      node.style.transform = "";
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [pull, maxPx]);

  return ref;
}

/**
 * Card tips slightly toward the cursor in 3D. Keep `maxDeg` small — past a few
 * degrees a menu card starts to look like a video game.
 */
export function useTilt<T extends HTMLElement>(maxDeg = 5) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !pointerEffectsWanted()) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = node.getBoundingClientRect();
        // -1 … 1 across each axis, measured from the middle of the card.
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        node.style.transform = `perspective(1000px) rotateX(${(-py * maxDeg).toFixed(2)}deg) rotateY(${(px * maxDeg).toFixed(2)}deg) translate3d(0, -4px, 0)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      node.style.transform = "";
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [maxDeg]);

  return ref;
}

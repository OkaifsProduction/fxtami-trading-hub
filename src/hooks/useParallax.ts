import { useEffect, useRef } from "react";

/**
 * Subtle scroll-linked parallax: the element drifts vertically by up to
 * `strength` px as it passes through the viewport. Purely decorative —
 * no-ops under prefers-reduced-motion or when IntersectionObserver-driven
 * visibility isn't needed (it only listens while the element is on screen).
 */
export function useParallax<T extends HTMLElement>(strength = 40) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    let inView = false;

    function update() {
      ticking = false;
      if (!inView || !node) return;
      const rect = node.getBoundingClientRect();
      const viewportH = window.innerHeight;
      // progress: -1 (element bottom at viewport top) .. 1 (element top at viewport bottom)
      const progress = (rect.top + rect.height / 2 - viewportH / 2) / (viewportH / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      node.style.transform = `translate3d(0, ${(clamped * strength).toFixed(1)}px, 0)`;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) onScroll();
      },
      { threshold: 0 },
    );
    observer.observe(node);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [strength]);

  return ref;
}

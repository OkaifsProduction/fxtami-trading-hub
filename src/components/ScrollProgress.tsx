import { useEffect } from "react";

/** Thin gradient bar at the very top of the viewport tracking scroll progress. */
export function ScrollProgress() {
  useEffect(() => {
    let ticking = false;
    const root = document.documentElement;

    function update() {
      ticking = false;
      const scrollable = root.scrollHeight - window.innerHeight;
      const fraction = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      root.style.setProperty("--scroll-progress", fraction.toFixed(4));
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div className="scroll-progress" aria-hidden="true" />;
}

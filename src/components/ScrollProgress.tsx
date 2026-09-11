import { useEffect } from "react";

/** Thin gradient bar at the very top of the viewport tracking scroll progress. */
export function ScrollProgress() {
  useEffect(() => {
    let ticking = false;

    function update() {
      ticking = false;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      document.documentElement.style.setProperty("--scroll-progress", `${pct}%`);
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

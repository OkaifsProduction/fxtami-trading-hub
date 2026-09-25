import type { CSSProperties, ReactNode } from "react";
import { Container } from "./Container";
import { Word } from "./Word";
import { useReveal, useStaggerReveal, useWordReveal } from "../hooks/useReveal";
import { useParallax } from "../hooks/useParallax";
import { useCountUp } from "../hooks/useCountUp";
import { images } from "../data/images";
import { menuCategories } from "../data/menu";
import { restaurant } from "../data/restaurant";

const LINE_1 = "Een Italiaans restaurant en pizzeria in het hart van Beverst.".split(" ");
const LINE_2 =
  "Klassieke recepten, eerlijke ingrediënten en een kaart met voor elk wat wils — elke avond vers bereid.".split(" ");

const countIn = (id: string) => menuCategories.find((c) => c.id === id)?.items.length ?? 0;

// Every figure is derived from the real menu and opening hours, so it stays
// true when either changes.
const STATS = [
  { value: countIn("pizza"), label: "Pizza's op de kaart" },
  { value: countIn("pasta"), label: "Pastagerechten" },
  { value: menuCategories.reduce((n, c) => n + c.items.length, 0), label: "Gerechten & dranken" },
  { value: restaurant.schedule.filter(Boolean).length, label: "Avonden per week open" },
];

/**
 * Space nodes must be direct siblings of each <Word>, not nested inside it —
 * trailing whitespace inside an inline-block (which .word-reveal is) gets
 * trimmed at render time even though it's present in the DOM.
 */
function headingNodes(): ReactNode[] {
  const nodes: ReactNode[] = [];
  LINE_1.forEach((w, i) => {
    nodes.push(
      <Word key={`w1-${i}`} index={i}>
        {w}
      </Word>,
      " ",
    );
  });
  LINE_2.forEach((w, i) => {
    nodes.push(
      <Word key={`w2-${i}`} index={LINE_1.length + i}>
        <span className="text-paper/35">{w}</span>
      </Word>,
    );
    if (i < LINE_2.length - 1) nodes.push(" ");
  });
  return nodes;
}

function Stat({ value, label, index }: { value: number; label: string; index: number }) {
  const [ref, current] = useCountUp<HTMLDivElement>(value);
  return (
    <div className="reveal-stagger-item border-t border-paper/15 pt-6" style={{ "--stagger": index } as CSSProperties}>
      <div ref={ref} className="font-serif text-[clamp(3rem,3vw+1.5rem,4.5rem)] leading-none tabular-nums text-paper">
        {current}
      </div>
      <div className="mt-3 text-[14px] text-paper/50">{label}</div>
    </div>
  );
}

export function OurStory() {
  const kickerRef = useReveal<HTMLSpanElement>();
  const headingRef = useWordReveal<HTMLHeadingElement>();
  const imgWrapRef = useReveal<HTMLDivElement>();
  const imgRef = useParallax<HTMLImageElement>(40);
  const statsRef = useStaggerReveal<HTMLDivElement>();

  return (
    <section id="story" className="grain relative bg-ink py-28 md:py-44">
      <Container>
        <span ref={kickerRef} className="reveal kicker text-paper/60">
          Ons Verhaal
        </span>
        <h2
          ref={headingRef}
          className="display mt-8 max-w-5xl text-[clamp(2.25rem,3.4vw+1rem,4.75rem)] leading-[1.04] text-paper"
        >
          {headingNodes()}
        </h2>
      </Container>

      <div className="mt-16 px-3 md:mt-24 md:px-6">
        <div
          ref={imgWrapRef}
          className="reveal-clip relative mx-auto aspect-[4/5] w-full max-w-[1600px] overflow-hidden rounded-4xl bg-graphite sm:aspect-[21/9]"
        >
          <img
            ref={imgRef}
            src={images.cheesePull}
            alt="Een pizzapunt met draden gesmolten kaas"
            loading="lazy"
            className="absolute -top-[12%] left-0 h-[124%] w-full object-cover will-change-transform"
          />
        </div>
      </div>

      <Container>
        <div ref={statsRef} className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-24 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Stat key={s.label} value={s.value} label={s.label} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

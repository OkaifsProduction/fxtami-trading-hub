import type { ReactNode } from "react";
import { Container } from "./Container";
import { Word } from "./Word";
import { useReveal, useWordReveal } from "../hooks/useReveal";
import { useParallax } from "../hooks/useParallax";
import { useCountUp } from "../hooks/useCountUp";
import { images } from "../data/images";

const LINE_1 = "Elk deeg rijst minstens 48 uur.".split(" ");
const LINE_2 =
  "Elke saus wordt langzaam ingekookt. Elke pizza gaat de oven in zoals onze grootouders het ons leerden.".split(
    " ",
  );

/**
 * Space nodes must be direct siblings of each <Word>, not nested inside it —
 * trailing whitespace *inside* an inline-block (which .word-reveal is) gets
 * trimmed at render time even though it's present in the DOM.
 */
function headingNodes(): ReactNode[] {
  const nodes: ReactNode[] = [];
  LINE_1.forEach((w, i) => {
    nodes.push(
      <Word key={`w1-${i}`} index={i}>
        {w}
      </Word>,
    );
    nodes.push(" ");
  });
  LINE_2.forEach((w, i) => {
    nodes.push(
      <Word key={`w2-${i}`} index={LINE_1.length + i}>
        <span className="text-paper/40">{w}</span>
      </Word>,
    );
    if (i < LINE_2.length - 1) nodes.push(" ");
  });
  return nodes;
}

function Stat({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const [ref, value] = useCountUp<HTMLDivElement>(target);
  return (
    <div>
      <div ref={ref} className="text-3xl font-bold tracking-tight text-paper">
        {value}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-paper/40">{label}</div>
    </div>
  );
}

export function OurStory() {
  const headingRef = useWordReveal<HTMLHeadingElement>();
  const imgWrapRef = useReveal<HTMLDivElement>();
  const imgRef = useParallax<HTMLImageElement>(24);

  return (
    <section id="story" className="bg-ink py-28 md:py-40">
      <Container>
        <h2
          ref={headingRef}
          className="mx-auto max-w-4xl text-center text-4xl font-semibold leading-[1.15] tracking-tightest text-paper md:text-6xl"
        >
          {headingNodes()}
        </h2>

        <div ref={imgWrapRef} className="reveal-scale mt-16 md:mt-24">
          <div className="relative mx-auto aspect-[21/9] w-full max-w-wide overflow-hidden rounded-4xl bg-graphite">
            <img
              ref={imgRef}
              src={images.doughHands}
              alt="Handen die vers pizzadeeg uitrekken, een Italiaanse familietraditie"
              loading="lazy"
              className="absolute -top-[12%] left-0 h-[124%] w-full object-cover will-change-transform"
            />
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-8 text-center sm:grid-cols-4">
          <Stat target={25} suffix="+" label="Jaar ervaring" />
          <Stat target={48} suffix="u" label="Rijstijd voor het deeg" />
          <Stat target={450} suffix="°C" label="Steenoven" />
          <Stat target={100} suffix="%" label="Italiaanse ingrediënten" />
        </div>
      </Container>
    </section>
  );
}

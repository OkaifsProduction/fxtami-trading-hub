import { Container } from "./Container";
import { useReveal } from "../hooks/useReveal";
import { images } from "../data/images";

export function OurStory() {
  const headingRef = useReveal<HTMLHeadingElement>();
  const imgRef = useReveal<HTMLDivElement>();

  return (
    <section id="story" className="bg-ink py-28 md:py-40">
      <Container>
        <h2
          ref={headingRef}
          className="reveal mx-auto max-w-4xl text-center text-4xl font-semibold leading-[1.15] tracking-tightest text-paper md:text-6xl"
        >
          Every dough is proofed for 48 hours.
          <span className="text-paper/40"> Every sauce is simmered slow. Every pizza is baked the
          way our grandparents taught us.</span>
        </h2>

        <div ref={imgRef} className="reveal-scale mt-16 md:mt-24">
          <div className="relative mx-auto aspect-[21/9] w-full max-w-wide overflow-hidden rounded-4xl bg-graphite">
            <img
              src={images.doughHands}
              alt="Hands hand-stretching fresh pizza dough, an Italian family tradition"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-8 text-center sm:grid-cols-4">
          <div>
            <div className="text-3xl font-bold tracking-tight text-paper">25+</div>
            <div className="mt-1 text-sm text-paper/40">Years of craft</div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-paper">48h</div>
            <div className="mt-1 text-sm text-paper/40">Dough proof time</div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-paper">900°F</div>
            <div className="mt-1 text-sm text-paper/40">Wood-fired oven</div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-paper">100%</div>
            <div className="mt-1 text-sm text-paper/40">Italian ingredients</div>
          </div>
        </div>
      </Container>
    </section>
  );
}

import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { useReveal } from "../hooks/useReveal";
import { images } from "../data/images";

export function OurStory() {
  const imgRef = useReveal<HTMLDivElement>();
  const textRef = useReveal<HTMLDivElement>();

  return (
    <section id="story" className="bg-white py-24 md:py-32">
      <Container className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div ref={imgRef} className="reveal order-2 lg:order-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-card">
            <img
              src={images.doughHands}
              alt="Hands hand-stretching fresh pizza dough, an Italian family tradition"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div ref={textRef} className="reveal order-1 lg:order-2">
          <SectionHeading
            eyebrow="Our Story"
            title={
              <>
                Tradition, family
                <br />& a love for <em>Italy</em>
              </>
            }
          />
          <div className="mt-7 space-y-5 max-w-lg text-base md:text-lg leading-relaxed text-stone">
            <p>
              Da Vinci began with a simple idea: bring the honest flavors of Italy to our
              neighborhood, one hand-stretched pizza at a time. What started as a small family
              kitchen has grown into a gathering place — but the recipes haven't changed.
            </p>
            <p>
              Every dough is proofed for 48 hours, every sauce is simmered slowly, and every pizza
              is baked in our wood-fired oven the way our grandparents taught us. It's not just
              cooking — it's passion, patience, and a table always set for family.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <span className="font-serif italic text-2xl text-burgundy">Buon Appetito</span>
            <span className="h-px flex-1 max-w-24 bg-ink/15" />
          </div>
        </div>
      </Container>
    </section>
  );
}

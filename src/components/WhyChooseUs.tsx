import type { CSSProperties } from "react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { features } from "../data/features";
import { useStaggerReveal } from "../hooks/useReveal";

export function WhyChooseUs() {
  const listRef = useStaggerReveal<HTMLOListElement>();

  return (
    <section className="grain relative bg-ink py-28 md:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              light
              align="left"
              kicker="Waarom Da Vinci"
              title={
                <>
                  Op z'n <em>Italiaans</em> bereid
                </>
              }
              description="Geen poespas — gewoon goede Italiaanse gerechten, met zorg klaargemaakt."
            />
          </div>

          <ol ref={listRef} className="border-t border-paper/15">
            {features.map((feature, i) => (
              <li
                key={feature.title}
                style={{ "--stagger": i } as CSSProperties}
                className="reveal-stagger-item group grid grid-cols-[3.5rem_1fr] gap-x-4 border-b border-paper/15 py-9 md:grid-cols-[5rem_1fr] md:py-11"
              >
                <span className="font-serif text-[40px] italic leading-none text-gold md:text-[52px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-serif text-[30px] leading-tight text-paper transition-transform duration-700 ease-expo group-hover:translate-x-2 md:text-[38px]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[16px] leading-relaxed text-paper/55">{feature.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

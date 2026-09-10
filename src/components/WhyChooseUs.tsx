import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { features } from "../data/features";

export function WhyChooseUs() {
  return (
    <section className="bg-ink py-28 md:py-36">
      <Container>
        <SectionHeading
          light
          kicker="Waarom Wij"
          title="Op z'n Italiaans bereid"
          description="Vier eenvoudige principes staan aan de basis van alles wat onze keuken verlaat."
        />

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-4xl bg-paper/10 sm:grid-cols-2">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group bg-ink p-9 transition-colors duration-500 hover:bg-graphite md:p-12"
            >
              <span className="text-sm font-semibold text-paper/30">0{i + 1}</span>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-paper">{feature.title}</h3>
              <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-paper/50">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

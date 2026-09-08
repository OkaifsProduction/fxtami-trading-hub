import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { features } from "../data/features";

const icons = [
  <path key="a" d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-5Z" />,
  <path key="b" d="M4 12h16M4 12a8 8 0 0 1 16 0M4 12a8 8 0 0 0 16 0" />,
  <path key="c" d="M4 19.5V6a2 2 0 0 1 2-2h9l5 5v10.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5Z" />,
  <path key="d" d="M12 2c2 3 6 5 6 10a6 6 0 0 1-12 0c0-5 4-7 6-10Z" />,
];

export function WhyChooseUs() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Why Choose Us"
          title="Crafted the Italian Way"
          description="Four simple principles guide everything that leaves our kitchen."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group rounded-[1.75rem] bg-white p-8 shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-burgundy-light text-burgundy transition-colors duration-300 group-hover:bg-burgundy group-hover:text-cream">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {icons[i % icons.length]}
                </svg>
              </div>
              <h3 className="mt-6 font-serif italic text-xl text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

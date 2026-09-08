import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { ContactForm } from "./ContactForm";
import { restaurant } from "../data/restaurant";

export function Location() {
  return (
    <section id="contact" className="bg-white py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow="Visit Us" title="Find Your Table" />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-burgundy">Address</h3>
                <p className="mt-2 font-serif italic text-xl text-ink">
                  {restaurant.address.line1}
                  <br />
                  {restaurant.address.line2}
                </p>
                <a
                  href={restaurant.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-ink underline decoration-ink/30 underline-offset-4 hover:text-burgundy hover:decoration-burgundy"
                >
                  Get Directions
                </a>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-burgundy">Contact</h3>
                <a href={restaurant.phoneHref} className="mt-2 block font-serif italic text-xl text-ink hover:text-burgundy">
                  {restaurant.phone}
                </a>
                <a
                  href={`mailto:${restaurant.email}`}
                  className="mt-1 block text-sm text-stone hover:text-burgundy"
                >
                  {restaurant.email}
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-burgundy">Opening Hours</h3>
              <dl className="mt-3 space-y-2">
                {restaurant.hours.map((h) => (
                  <div key={h.days} className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-2 text-sm">
                    <dt className="text-stone">{h.days}</dt>
                    <dd className="font-semibold text-ink">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-burgundy">Send a Message</h3>
              <ContactForm />
            </div>
          </div>

          <div className="min-h-[420px] overflow-hidden rounded-[2rem] shadow-card lg:min-h-full">
            <iframe
              src={restaurant.mapEmbedUrl}
              title={`Map showing ${restaurant.name} location`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-full min-h-[420px] w-full grayscale-[0.3] contrast-[1.05]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

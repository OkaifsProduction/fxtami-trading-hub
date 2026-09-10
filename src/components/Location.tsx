import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { ContactForm } from "./ContactForm";
import { restaurant } from "../data/restaurant";

export function Location() {
  return (
    <section id="contact" className="bg-paper py-28 md:py-36">
      <Container>
        <SectionHeading align="left" kicker="Bezoek Ons" title="Vind uw tafel" />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-stone-light">
                  Adres
                </h3>
                <p className="mt-2 text-lg font-medium text-ink">
                  {restaurant.address.line1}
                  <br />
                  {restaurant.address.line2}
                </p>
                <a href={restaurant.directionsUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block">
                  <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
                    Routebeschrijving
                  </span>
                </a>
              </div>

              <div>
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-stone-light">
                  Contact
                </h3>
                <a href={restaurant.phoneHref} className="mt-2 block text-lg font-medium text-ink hover:text-stone">
                  {restaurant.phone}
                </a>
                <a href={restaurant.mobileHref} className="mt-1 block text-[15px] text-stone hover:text-ink">
                  Gsm: {restaurant.mobile}
                </a>
                <a
                  href={`mailto:${restaurant.email}`}
                  className="mt-1 block text-[15px] text-stone hover:text-ink"
                >
                  {restaurant.email}
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-stone-light">
                Openingsuren
              </h3>
              <dl className="mt-3 space-y-2">
                {restaurant.hours.map((h) => (
                  <div
                    key={h.days}
                    className="flex items-baseline justify-between gap-4 border-b border-ink/[0.08] py-2.5 text-[15px]"
                  >
                    <dt className="text-stone">{h.days}</dt>
                    <dd className="font-semibold text-ink">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h3 className="mb-5 text-[13px] font-semibold uppercase tracking-[0.1em] text-stone-light">
                Stuur een Bericht
              </h3>
              <ContactForm />
            </div>
          </div>

          <div className="min-h-[420px] overflow-hidden rounded-4xl lg:min-h-full">
            <iframe
              src={restaurant.mapEmbedUrl}
              title={`Kaart met de locatie van ${restaurant.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-full min-h-[420px] w-full grayscale contrast-[1.05]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

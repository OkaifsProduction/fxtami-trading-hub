import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { ContactForm } from "./ContactForm";
import { MapEmbed } from "./MapEmbed";
import { useReveal } from "../hooks/useReveal";
import { restaurant } from "../data/restaurant";
import { todayWeekday } from "../lib/hours";

function Label({ children }: { children: string }) {
  return <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-light">{children}</h3>;
}

export function Location() {
  const infoRef = useReveal<HTMLDivElement>();
  const mapRef = useReveal<HTMLDivElement>();
  const formRef = useReveal<HTMLDivElement>();
  const today = todayWeekday();

  return (
    <section id="contact" className="bg-paper pb-28 pt-8 md:pb-40 md:pt-12">
      <Container>
        <SectionHeading
          align="left"
          kicker="Bezoek Ons"
          title={
            <>
              Vind uw <em>tafel</em>
            </>
          }
        />

        <div className="mt-14 grid grid-cols-1 gap-12 md:mt-20 lg:grid-cols-2 lg:gap-16">
          <div ref={infoRef} className="reveal space-y-12">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
              <div>
                <Label>Adres</Label>
                <p className="mt-4 font-serif text-[26px] leading-tight text-ink">
                  {restaurant.address.line1}
                  <br />
                  {restaurant.address.line2}
                </p>
                <a
                  href={restaurant.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="link-draw mt-4 inline-block pb-0.5 text-[14px] font-medium text-ink"
                >
                  Routebeschrijving ↗
                </a>
              </div>

              <div>
                <Label>Contact</Label>
                <a href={restaurant.phoneHref} className="mt-4 block font-serif text-[26px] leading-tight text-ink hover:text-burgundy">
                  {restaurant.phone}
                </a>
                <a href={restaurant.mobileHref} className="mt-2 block text-[15px] text-stone hover:text-ink">
                  Gsm {restaurant.mobile}
                </a>
                <a href={`mailto:${restaurant.email}`} className="mt-1 block break-all text-[15px] text-stone hover:text-ink">
                  {restaurant.email}
                </a>
              </div>
            </div>

            <div>
              <Label>Openingsuren</Label>
              <dl className="mt-4 border-t border-ink/[0.08]">
                {restaurant.hours.map((h) => {
                  const isToday = h.weekdays.includes(today);
                  return (
                    <div
                      key={h.days}
                      className={`flex items-baseline justify-between gap-4 border-b border-ink/[0.08] py-4 text-[15px] ${
                        isToday ? "text-ink" : "text-stone"
                      }`}
                    >
                      <dt className="flex items-center gap-2.5">
                        {h.days}
                        {isToday && (
                          <span className="rounded-full bg-burgundy-light px-2.5 py-0.5 text-[11px] font-semibold text-burgundy">
                            Vandaag
                          </span>
                        )}
                      </dt>
                      <dd className={`tabular-nums ${isToday ? "font-semibold" : "font-medium text-ink"}`}>{h.time}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>

          <div
            ref={mapRef}
            style={{ transitionDelay: "150ms" }}
            className="reveal-scale min-h-[420px] overflow-hidden rounded-4xl"
          >
            <MapEmbed />
          </div>
        </div>

        <div
          ref={formRef}
          className="reveal mt-20 grid grid-cols-1 gap-10 border-t border-ink/[0.08] pt-16 md:mt-28 md:pt-20 lg:grid-cols-2 lg:gap-16"
        >
          <div>
            <span className="kicker text-stone">Contact</span>
            <p className="display mt-5 text-[clamp(2.25rem,2vw+1.25rem,3.25rem)] text-ink">
              Een vraag of <em className="italic text-burgundy">speciale wens</em>?
            </p>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-stone">
              Stuur ons een bericht — voor een groep, een feestje of een allergie. Voor iets dringends belt u ons het
              best op <a href={restaurant.phoneHref} className="font-medium text-ink underline decoration-ink/20 underline-offset-4">{restaurant.phone}</a>.
            </p>
          </div>
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}

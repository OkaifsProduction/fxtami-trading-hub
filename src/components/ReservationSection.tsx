import { useMemo, useState, type FormEvent } from "react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { OpenStatusPill } from "./OpenStatusPill";
import { SubmitArrow } from "./SubmitArrow";
import { inputClass, labelClass, submitClass } from "./formStyles";
import { honeypotProps, submitForm } from "../lib/submit";
import { closedReason, timeSlotsFor, todayIso, validateReservationSlot } from "../lib/hours";
import { restaurant } from "../data/restaurant";
import { useReveal } from "../hooks/useReveal";

type Status = "idle" | "loading" | "success" | "error";

const MAX_ONLINE_PARTY = 10;

export function ReservationSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const infoRef = useReveal<HTMLDivElement>();
  const formWrapRef = useReveal<HTMLDivElement>();

  const minDate = todayIso();
  const slots = useMemo(() => (date ? timeSlotsFor(date) : []), [date]);
  const dateProblem = date ? closedReason(date) : null;

  function onDateChange(value: string) {
    setDate(value);
    if (!timeSlotsFor(value).includes(time)) setTime("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const slotError = validateReservationSlot(date, time);
    if (slotError) {
      setStatus("error");
      setErrorMessage(slotError);
      return;
    }

    const form = new FormData(e.currentTarget);
    setStatus("loading");
    setErrorMessage("");

    const error = await submitForm({
      type: "reservation",
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      party_size: form.get("party_size"),
      reservation_date: date,
      reservation_time: time,
      notes: form.get("notes"),
      company: form.get("company"),
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error);
      return;
    }
    setStatus("success");
  }

  return (
    <section id="reserve" className="bg-mist py-28 md:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              align="left"
              kicker="Reserveren"
              title={
                <>
                  Reserveer uw <em>tafel</em>
                </>
              }
              description="Kies een dag en uur binnen onze openingsuren. We bevestigen uw aanvraag zo snel mogelijk per telefoon of e-mail."
            />

            <div ref={infoRef} className="reveal mt-10 space-y-6" style={{ transitionDelay: "150ms" }}>
              <OpenStatusPill />
              <div className="rounded-3xl bg-paper p-7">
                <p className="text-[13px] text-stone">Liever bellen, of met meer dan {MAX_ONLINE_PARTY} personen?</p>
                <a href={restaurant.phoneHref} className="mt-2 block font-serif text-[34px] leading-none text-ink hover:text-burgundy">
                  {restaurant.phone}
                </a>
                <dl className="mt-6 space-y-2 border-t border-ink/[0.07] pt-5 text-[14px]">
                  {restaurant.hours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-4">
                      <dt className="text-stone">{h.days}</dt>
                      <dd className="font-medium tabular-nums text-ink">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          <div ref={formWrapRef} className="reveal" style={{ transitionDelay: "100ms" }}>
            {status === "success" ? (
              <div role="status" className="rounded-4xl bg-paper p-10 md:p-14">
                <span className="kicker text-stone">Aanvraag ontvangen</span>
                <p className="display mt-5 text-[clamp(2.5rem,3vw+1rem,4rem)] text-ink">
                  Grazie<em className="italic text-burgundy">!</em>
                </p>
                <p className="mt-5 max-w-md text-[16px] leading-relaxed text-stone">
                  We hebben uw reservatie-aanvraag ontvangen en bevestigen binnenkort telefonisch of per e-mail. Voor
                  iets dringends belt u ons op{" "}
                  <a href={restaurant.phoneHref} className="font-medium text-ink underline decoration-ink/20 underline-offset-4">
                    {restaurant.phone}
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="relative space-y-9 rounded-4xl bg-paper p-7 shadow-[0_30px_80px_-40px_rgba(10,10,10,0.25)] sm:p-10 md:p-14"
              >
                <input {...honeypotProps} />

                <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                  <div>
                    <label htmlFor="res-date" className={labelClass}>
                      Datum
                    </label>
                    <input
                      id="res-date"
                      name="date"
                      type="date"
                      required
                      min={minDate}
                      value={date}
                      onChange={(e) => onDateChange(e.target.value)}
                      aria-describedby={dateProblem ? "res-date-problem" : undefined}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="res-time" className={labelClass}>
                      Tijd
                    </label>
                    <select
                      id="res-time"
                      name="time"
                      required
                      value={time}
                      disabled={!date || slots.length === 0}
                      onChange={(e) => setTime(e.target.value)}
                      className={`${inputClass} disabled:cursor-not-allowed disabled:text-stone-light`}
                    >
                      <option value="" disabled>
                        {!date ? "Kies eerst een datum" : slots.length === 0 ? "Geen tijden beschikbaar" : "Kies een tijd"}
                      </option>
                      {slots.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  {dateProblem && (
                    <p id="res-date-problem" className="-mt-5 text-[13px] text-burgundy sm:col-span-2">
                      {dateProblem}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                  <div>
                    <label htmlFor="res-party" className={labelClass}>
                      Aantal personen
                    </label>
                    <select id="res-party" name="party_size" required defaultValue="2" className={inputClass}>
                      {Array.from({ length: MAX_ONLINE_PARTY }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "persoon" : "personen"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="res-name" className={labelClass}>
                      Naam
                    </label>
                    <input id="res-name" name="name" type="text" required autoComplete="name" className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                  <div>
                    <label htmlFor="res-email" className={labelClass}>
                      E-mail
                    </label>
                    <input id="res-email" name="email" type="email" required autoComplete="email" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="res-phone" className={labelClass}>
                      Telefoon
                    </label>
                    <input id="res-phone" name="phone" type="tel" required autoComplete="tel" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="res-notes" className={labelClass}>
                    Speciale verzoeken <span className="normal-case tracking-normal">(optioneel)</span>
                  </label>
                  <textarea
                    id="res-notes"
                    name="notes"
                    rows={2}
                    placeholder="Verjaardag, kinderstoel, allergieën…"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {status === "error" && (
                  <p role="alert" className="rounded-2xl bg-burgundy-light px-5 py-4 text-[14px] leading-relaxed text-burgundy-dark">
                    {errorMessage}
                  </p>
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button type="submit" disabled={status === "loading"} className={submitClass}>
                    {status === "loading" ? "Versturen…" : "Reservatie aanvragen"}
                    <SubmitArrow />
                  </button>
                  <p className="text-[12px] text-stone-light">Uw reservatie is pas definitief na onze bevestiging.</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

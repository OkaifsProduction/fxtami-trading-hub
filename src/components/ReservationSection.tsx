import { useState, type FormEvent } from "react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { restaurant } from "../data/restaurant";

type Status = "idle" | "loading" | "success" | "error";

const today = new Date().toISOString().slice(0, 10);

export function ReservationSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!supabase) {
      setStatus("error");
      setErrorMessage("Online reservations aren't connected yet — please call us instead.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const record = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      party_size: Number(form.get("party_size")),
      reservation_date: String(form.get("date") || ""),
      reservation_time: String(form.get("time") || ""),
      notes: String(form.get("notes") || "") || null,
    };

    setStatus("loading");
    setErrorMessage("");

    const { error } = await supabase.from("reservations").insert(record);

    if (error) {
      setStatus("error");
      setErrorMessage("Something went wrong saving your reservation. Please call us to confirm.");
      return;
    }

    setStatus("success");

    // Best-effort notification email — the reservation is already saved
    // either way, so a failure here shouldn't change what the guest sees.
    fetch("/.netlify/functions/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "reservation", record }),
    }).catch(() => {});
  }

  return (
    <section id="reserve" className="bg-mist py-28 md:py-36">
      <Container>
        <SectionHeading
          align="left"
          kicker="Reservations"
          title="Reserve your table"
          description="Prefer to book online? Fill in your details and we'll confirm shortly."
        />

        <div className="mt-12 max-w-xl">
          {status === "success" ? (
            <div className="rounded-3xl bg-paper p-8">
              <p className="text-xl font-semibold tracking-tight text-ink">Grazie — request received!</p>
              <p className="mt-2 text-[15px] leading-relaxed text-stone">
                We've saved your reservation request and will confirm by phone or email shortly. For
                anything urgent, call us at{" "}
                <a href={restaurant.phoneHref} className="underline">
                  {restaurant.phone}
                </a>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-paper p-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="res-name" className="mb-1.5 block text-[13px] font-medium text-stone">
                    Name
                  </label>
                  <input
                    id="res-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="w-full border-0 border-b border-ink/15 bg-transparent px-0 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-ink"
                  />
                </div>
                <div>
                  <label htmlFor="res-party" className="mb-1.5 block text-[13px] font-medium text-stone">
                    Party size
                  </label>
                  <select
                    id="res-party"
                    name="party_size"
                    required
                    defaultValue="2"
                    className="w-full border-0 border-b border-ink/15 bg-transparent px-0 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-ink"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="res-date" className="mb-1.5 block text-[13px] font-medium text-stone">
                    Date
                  </label>
                  <input
                    id="res-date"
                    name="date"
                    type="date"
                    required
                    min={today}
                    className="w-full border-0 border-b border-ink/15 bg-transparent px-0 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-ink"
                  />
                </div>
                <div>
                  <label htmlFor="res-time" className="mb-1.5 block text-[13px] font-medium text-stone">
                    Time
                  </label>
                  <input
                    id="res-time"
                    name="time"
                    type="time"
                    required
                    className="w-full border-0 border-b border-ink/15 bg-transparent px-0 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="res-email" className="mb-1.5 block text-[13px] font-medium text-stone">
                    Email
                  </label>
                  <input
                    id="res-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full border-0 border-b border-ink/15 bg-transparent px-0 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-ink"
                  />
                </div>
                <div>
                  <label htmlFor="res-phone" className="mb-1.5 block text-[13px] font-medium text-stone">
                    Phone
                  </label>
                  <input
                    id="res-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    className="w-full border-0 border-b border-ink/15 bg-transparent px-0 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-ink"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="res-notes" className="mb-1.5 block text-[13px] font-medium text-stone">
                  Special requests (optional)
                </label>
                <textarea
                  id="res-notes"
                  name="notes"
                  rows={2}
                  className="w-full resize-none border-0 border-b border-ink/15 bg-transparent px-0 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-ink"
                />
              </div>

              {status === "error" && (
                <p className="rounded-xl bg-burgundy-light px-4 py-3 text-[14px] text-burgundy-dark">
                  {errorMessage}
                </p>
              )}

              {!isSupabaseConfigured && (
                <p className="rounded-xl bg-mist px-4 py-3 text-[13px] text-stone">
                  Heads up: online reservations need Supabase configured (see DEPLOYMENT.md) before this
                  form can save requests.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center rounded-full bg-ink px-8 py-3.5 text-[15px] font-medium text-paper transition-all hover:bg-graphite hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {status === "loading" ? "Sending…" : "Request Reservation"}
              </button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}

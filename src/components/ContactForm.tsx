import { useState, type FormEvent } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { restaurant } from "../data/restaurant";
import { inputClass, labelClass, showSetupHints, submitClass } from "./formStyles";
import { SubmitArrow } from "./SubmitArrow";

type Status = "idle" | "loading" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!supabase) {
      setStatus("error");
      return;
    }

    const form = new FormData(e.currentTarget);
    const record = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      message: String(form.get("message") || ""),
    };

    setStatus("loading");
    const { error } = await supabase.from("contact_messages").insert(record);

    if (error) {
      setStatus("error");
      return;
    }

    setStatus("sent");
    fetch("/.netlify/functions/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "contact", record }),
    }).catch(() => {});
  }

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col justify-center rounded-4xl bg-mist p-10">
        <p className="display text-[40px] text-ink">
          Grazie<em className="italic text-burgundy">!</em>
        </p>
        <p className="mt-3 text-[16px] leading-relaxed text-stone">
          Bedankt voor uw bericht — we nemen snel contact met u op.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Naam
          </label>
          <input id="contact-name" name="name" type="text" required autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            E-mail
          </label>
          <input id="contact-email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Bericht
        </label>
        <textarea id="contact-message" name="message" rows={4} required className={`${inputClass} resize-none`} />
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-2xl bg-burgundy-light px-5 py-4 text-[14px] leading-relaxed text-burgundy-dark">
          Er ging iets mis bij het versturen. Probeer het opnieuw, of bel ons op{" "}
          <a href={restaurant.phoneHref} className="font-semibold underline">
            {restaurant.phone}
          </a>
          .
        </p>
      )}
      {showSetupHints && !isSupabaseConfigured && (
        <p className="rounded-2xl bg-mist px-5 py-4 text-[13px] text-stone">
          Dev-melding: dit formulier heeft een Supabase-configuratie nodig (zie DEPLOYMENT.md).
        </p>
      )}

      <button type="submit" disabled={status === "loading"} className={submitClass}>
        {status === "loading" ? "Versturen…" : "Verstuur bericht"}
        <SubmitArrow />
      </button>
    </form>
  );
}

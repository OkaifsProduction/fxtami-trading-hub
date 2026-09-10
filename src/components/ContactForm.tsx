import { useState, type FormEvent } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

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
      <div className="rounded-3xl bg-mist p-8 text-center">
        <p className="text-xl font-semibold tracking-tight text-ink">Grazie!</p>
        <p className="mt-2 text-[15px] text-stone">Bedankt voor uw bericht — we nemen snel contact met u op.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-[13px] font-medium text-stone">
            Naam
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full border-0 border-b border-ink/15 bg-transparent px-0 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-ink"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-stone">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full border-0 border-b border-ink/15 bg-transparent px-0 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-ink"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-[13px] font-medium text-stone">
          Bericht
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          required
          className="w-full resize-none border-0 border-b border-ink/15 bg-transparent px-0 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-ink"
        />
      </div>

      {status === "error" && (
        <p className="rounded-xl bg-burgundy-light px-4 py-3 text-[14px] text-burgundy-dark">
          Er ging iets mis bij het versturen. Probeer het opnieuw, of bel ons rechtstreeks.
        </p>
      )}
      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-mist px-4 py-3 text-[13px] text-stone">
          Let op: dit formulier heeft een Supabase-configuratie nodig (zie DEPLOYMENT.md) voordat berichten kunnen worden opgeslagen.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3 text-[15px] font-medium text-paper transition-all hover:bg-graphite hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {status === "loading" ? "Versturen…" : "Verstuur Bericht"}
      </button>
    </form>
  );
}

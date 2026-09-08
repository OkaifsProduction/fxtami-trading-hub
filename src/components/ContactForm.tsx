import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Wire this up to your email/CRM provider of choice (e.g. Formspree, Resend).
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-burgundy/20 bg-burgundy-light p-8 text-center">
        <p className="font-serif italic text-2xl text-burgundy">Grazie!</p>
        <p className="mt-2 text-sm text-ink/70">
          Thanks for reaching out — we'll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-stone">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-burgundy"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-stone">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-burgundy"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-stone">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full resize-none rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-burgundy"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-burgundy px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-cream transition-all hover:bg-burgundy-dark hover:-translate-y-0.5 sm:w-auto"
      >
        Send Message
      </button>
    </form>
  );
}

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
      <div className="rounded-3xl bg-mist p-8 text-center">
        <p className="text-xl font-semibold tracking-tight text-ink">Grazie!</p>
        <p className="mt-2 text-[15px] text-stone">Thanks for reaching out — we'll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-[13px] font-medium text-stone">
            Name
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
            Email
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
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          required
          className="w-full resize-none border-0 border-b border-ink/15 bg-transparent px-0 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-ink"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3 text-[15px] font-medium text-paper transition-all hover:bg-graphite hover:-translate-y-0.5"
      >
        Send Message
      </button>
    </form>
  );
}

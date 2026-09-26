import { useState, type FormEvent } from "react";
import { honeypotProps, submitForm } from "../lib/submit";
import { inputClass, labelClass, submitClass } from "./formStyles";
import { SubmitArrow } from "./SubmitArrow";

type Status = "idle" | "loading" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    setStatus("loading");
    const error = await submitForm({
      type: "contact",
      name: form.get("name"),
      email: form.get("email"),
      message: form.get("message"),
      company: form.get("company"),
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error);
      return;
    }
    setStatus("sent");
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
    <form onSubmit={handleSubmit} className="relative space-y-8">
      <input {...honeypotProps} />

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Naam
          </label>
          <input id="contact-name" name="name" type="text" required maxLength={120} autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            E-mail
          </label>
          <input id="contact-email" name="email" type="email" required maxLength={200} autoComplete="email" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Bericht
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          maxLength={4000}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-2xl bg-burgundy-light px-5 py-4 text-[14px] leading-relaxed text-burgundy-dark">
          {errorMessage}
        </p>
      )}

      <button type="submit" disabled={status === "loading"} className={submitClass}>
        {status === "loading" ? "Versturen…" : "Verstuur bericht"}
        <SubmitArrow />
      </button>
    </form>
  );
}

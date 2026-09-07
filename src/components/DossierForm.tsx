import { useState } from "react";
import { dossierFormSchema, type DossierFormValues } from "@/lib/schema";
import type { DossierRow } from "@/lib/database.types";

type FieldErrors = Partial<Record<keyof DossierFormValues, string>>;

interface DossierFormProps {
  initial?: DossierRow;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: DossierFormValues) => void;
  onCancel?: () => void;
}

export function DossierForm({
  initial,
  submitLabel,
  submitting,
  onSubmit,
  onCancel,
}: DossierFormProps) {
  const [titel, setTitel] = useState(initial?.titel ?? "");
  const [omschrijving, setOmschrijving] = useState(initial?.omschrijving ?? "");
  const [status, setStatus] = useState(initial?.status ?? "open");
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = dossierFormSchema.safeParse({ titel, omschrijving, status });

    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof DossierFormValues;
        nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="field-label" htmlFor="titel">
          Titel
        </label>
        <input
          id="titel"
          className="input"
          value={titel}
          onChange={(e) => setTitel(e.target.value)}
          placeholder="Bv. Terugreis van Marokko"
        />
        {errors.titel && <span className="field-error">{errors.titel}</span>}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="omschrijving">
          Omschrijving
        </label>
        <textarea
          id="omschrijving"
          className="textarea"
          value={omschrijving}
          onChange={(e) => setOmschrijving(e.target.value)}
          placeholder="Vrij tekstveld"
        />
        {errors.omschrijving && <span className="field-error">{errors.omschrijving}</span>}
        <span className="field-hint">{omschrijving.length}/4000 tekens</span>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="dossierStatus">
          Status
        </label>
        <select
          id="dossierStatus"
          className="select"
          value={status}
          onChange={(e) => setStatus(e.target.value as DossierFormValues["status"])}
        >
          <option value="open">Open</option>
          <option value="afgehandeld">Afgehandeld</option>
        </select>
      </div>

      <div className="flex-between mt-24">
        {onCancel ? (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Annuleren
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Bezig met opslaan…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

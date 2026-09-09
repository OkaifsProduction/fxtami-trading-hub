import { useState } from "react";
import { dossierFormSchema, type DossierFormValues } from "@/lib/schema";
import type { DossierRow } from "@/lib/database.types";
import { useLocale } from "@/lib/i18n";

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
  const { t } = useLocale();
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
          {t("dossierForm.titel")}
        </label>
        <input
          id="titel"
          className="input"
          value={titel}
          onChange={(e) => setTitel(e.target.value)}
          placeholder={t("dossierForm.titelPlaceholder")}
        />
        {errors.titel && <span className="field-error">{errors.titel}</span>}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="omschrijving">
          {t("dossierForm.omschrijving")}
        </label>
        <textarea
          id="omschrijving"
          className="textarea"
          value={omschrijving}
          onChange={(e) => setOmschrijving(e.target.value)}
          placeholder={t("dossierForm.omschrijvingPlaceholder")}
        />
        {errors.omschrijving && <span className="field-error">{errors.omschrijving}</span>}
        <span className="field-hint">
          {omschrijving.length}/4000 {t("dossierForm.tekens")}
        </span>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="dossierStatus">
          {t("dossierForm.status")}
        </label>
        <select
          id="dossierStatus"
          className="select"
          value={status}
          onChange={(e) => setStatus(e.target.value as DossierFormValues["status"])}
        >
          <option value="open">{t("status.open")}</option>
          <option value="gesloten">{t("status.gesloten")}</option>
        </select>
      </div>

      <div className="flex-between mt-24">
        {onCancel ? (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            {t("common.annuleren")}
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? t("common.bezigMetOpslaan") : submitLabel}
        </button>
      </div>
    </form>
  );
}

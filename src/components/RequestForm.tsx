import { useState } from "react";
import { requestFormSchema, type RequestFormValues } from "@/lib/schema";
import type { RequestRow } from "@/lib/database.types";
import type { DossierOption } from "@/lib/queries";

type FieldErrors = Partial<Record<keyof RequestFormValues, string>>;

interface RequestFormProps {
  initial?: RequestRow;
  /** Dossiers to choose from. Not shown when `lockedDossier` is set. */
  dossierOptions?: DossierOption[];
  /** When creating an aanvraag from within a dossier, lock it instead of showing a picker. */
  lockedDossier?: { id: string; label: string };
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: RequestFormValues) => void;
  onCancel?: () => void;
}

export function RequestForm({
  initial,
  dossierOptions,
  lockedDossier,
  submitLabel,
  submitting,
  onSubmit,
  onCancel,
}: RequestFormProps) {
  const [dossierId, setDossierId] = useState(initial?.dossier_id ?? lockedDossier?.id ?? "");
  const [requestedAmount, setRequestedAmount] = useState(
    initial ? String(initial.requested_amount) : "",
  );
  const [grantedAmount, setGrantedAmount] = useState(
    initial?.granted_amount != null ? String(initial.granted_amount) : "",
  );
  const [status, setStatus] = useState(initial?.status ?? "open");
  const [extraInfo, setExtraInfo] = useState(initial?.extra_info ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsedRequested = Number.parseFloat(requestedAmount);
    const parsedGranted = grantedAmount.trim() === "" ? null : Number.parseFloat(grantedAmount);

    const result = requestFormSchema.safeParse({
      dossierId: dossierId || undefined,
      requestedAmount: parsedRequested,
      grantedAmount: parsedGranted,
      status,
      extraInfo,
    });

    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof RequestFormValues;
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
        <span className="field-label">Dossier</span>
        {lockedDossier ? (
          <div className="dossier-context-pill">{lockedDossier.label}</div>
        ) : (
          <>
            <select
              id="dossierId"
              className="select"
              value={dossierId}
              onChange={(e) => setDossierId(e.target.value)}
            >
              <option value="">Kies een dossier…</option>
              {(dossierOptions ?? []).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.klantNaam} — {d.titel}
                </option>
              ))}
            </select>
            {(dossierOptions ?? []).length === 0 && (
              <span className="field-hint">
                Nog geen dossiers. Maak eerst een klant en dossier aan.
              </span>
            )}
          </>
        )}
        {errors.dossierId && <span className="field-error">{errors.dossierId}</span>}
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="requestedAmount">
            Gevraagd bedrag
          </label>
          <input
            id="requestedAmount"
            className="input"
            inputMode="decimal"
            value={requestedAmount}
            onChange={(e) => setRequestedAmount(e.target.value)}
            placeholder="0,00"
          />
          {errors.requestedAmount && (
            <span className="field-error">{errors.requestedAmount}</span>
          )}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="grantedAmount">
            Toegekend bedrag
          </label>
          <input
            id="grantedAmount"
            className="input"
            inputMode="decimal"
            value={grantedAmount}
            onChange={(e) => setGrantedAmount(e.target.value)}
            placeholder="0,00"
          />
          {errors.grantedAmount && <span className="field-error">{errors.grantedAmount}</span>}
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          className="select"
          value={status}
          onChange={(e) => setStatus(e.target.value as RequestFormValues["status"])}
        >
          <option value="open">Open</option>
          <option value="in_behandeling">In behandeling</option>
          <option value="goedgekeurd">Goedgekeurd</option>
          <option value="geweigerd">Geweigerd</option>
          <option value="afgehandeld">Afgehandeld</option>
        </select>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="extraInfo">
          Extra informatie
        </label>
        <textarea
          id="extraInfo"
          className="textarea"
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
          placeholder="Alleen zichtbaar in het detailscherm"
        />
        {errors.extraInfo && <span className="field-error">{errors.extraInfo}</span>}
        <span className="field-hint">{extraInfo.length}/4000 tekens</span>
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

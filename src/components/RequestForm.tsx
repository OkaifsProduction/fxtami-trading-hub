import { useState } from "react";
import { requestFormSchema, type RequestFormValues } from "@/lib/schema";
import type { RequestRow } from "@/lib/database.types";

type FieldErrors = Partial<Record<keyof RequestFormValues, string>>;

interface RequestFormProps {
  initial?: RequestRow;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: RequestFormValues) => void;
  onCancel?: () => void;
}

export function RequestForm({ initial, submitLabel, submitting, onSubmit, onCancel }: RequestFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [purpose, setPurpose] = useState(initial?.purpose ?? "");
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
      name,
      purpose,
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
        <label className="field-label" htmlFor="name">
          Naam
        </label>
        <input
          id="name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Naam van de persoon"
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="purpose">
          Waarvoor
        </label>
        <input
          id="purpose"
          className="input"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Bv. hondenvoeding"
        />
        {errors.purpose && <span className="field-error">{errors.purpose}</span>}
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

import { useState } from "react";
import { klantFormSchema, type KlantFormValues } from "@/lib/schema";
import type { KlantRow } from "@/lib/database.types";

type FieldErrors = Partial<Record<keyof KlantFormValues, string>>;

interface KlantFormProps {
  initial?: KlantRow;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: KlantFormValues) => void;
  onCancel?: () => void;
}

export function KlantForm({ initial, submitLabel, submitting, onSubmit, onCancel }: KlantFormProps) {
  const [naam, setNaam] = useState(initial?.naam ?? "");
  const [bewindType, setBewindType] = useState(initial?.bewind_type ?? "");
  const [identificatienummer, setIdentificatienummer] = useState(
    initial?.identificatienummer ?? "",
  );
  const [email, setEmail] = useState(initial?.email ?? "");
  const [telefoon, setTelefoon] = useState(initial?.telefoon ?? "");
  const [adres, setAdres] = useState(initial?.adres ?? "");
  const [extraInfo, setExtraInfo] = useState(initial?.extra_info ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = klantFormSchema.safeParse({
      naam,
      bewindType,
      identificatienummer,
      email,
      telefoon,
      adres,
      extraInfo,
    });

    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof KlantFormValues;
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
        <label className="field-label" htmlFor="naam">
          Naam
        </label>
        <input
          id="naam"
          className="input"
          value={naam}
          onChange={(e) => setNaam(e.target.value)}
          placeholder="Naam van de klant"
        />
        {errors.naam && <span className="field-error">{errors.naam}</span>}
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="bewindType">
            Type bewind
          </label>
          <select
            id="bewindType"
            className="select"
            value={bewindType}
            onChange={(e) => setBewindType(e.target.value)}
          >
            <option value="">Onbekend</option>
            <option value="goederen">Goederen</option>
            <option value="persoon">Persoon</option>
            <option value="beide">Goederen &amp; Persoon</option>
          </select>
          {errors.bewindType && <span className="field-error">{errors.bewindType}</span>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="identificatienummer">
            Identificatienummer
          </label>
          <input
            id="identificatienummer"
            className="input"
            value={identificatienummer}
            onChange={(e) => setIdentificatienummer(e.target.value)}
            placeholder="Rijksregisternummer"
          />
          {errors.identificatienummer && (
            <span className="field-error">{errors.identificatienummer}</span>
          )}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="email">
            E-mailadres
          </label>
          <input
            id="email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="naam@voorbeeld.be"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="telefoon">
            Telefoon
          </label>
          <input
            id="telefoon"
            className="input"
            value={telefoon}
            onChange={(e) => setTelefoon(e.target.value)}
            placeholder="+32 4xx xx xx xx"
          />
          {errors.telefoon && <span className="field-error">{errors.telefoon}</span>}
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="adres">
          Adres
        </label>
        <input
          id="adres"
          className="input"
          value={adres}
          onChange={(e) => setAdres(e.target.value)}
          placeholder="Straat, nummer, postcode, gemeente"
        />
        {errors.adres && <span className="field-error">{errors.adres}</span>}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="klantExtraInfo">
          Extra informatie
        </label>
        <textarea
          id="klantExtraInfo"
          className="textarea"
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
          placeholder="Vrij tekstveld"
        />
        {errors.extraInfo && <span className="field-error">{errors.extraInfo}</span>}
        <span className="field-hint">{extraInfo.length}/2000 tekens</span>
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

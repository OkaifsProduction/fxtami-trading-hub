import { useState } from "react";
import { klantFormSchema, type KlantFormValues } from "@/lib/schema";
import type { KlantRow } from "@/lib/database.types";
import { useLocale } from "@/lib/i18n";

type FieldErrors = Partial<Record<keyof KlantFormValues, string>>;

interface KlantFormProps {
  initial?: KlantRow;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: KlantFormValues) => void;
  onCancel?: () => void;
}

export function KlantForm({ initial, submitLabel, submitting, onSubmit, onCancel }: KlantFormProps) {
  const { t } = useLocale();
  const [naam, setNaam] = useState(initial?.naam ?? "");
  const [bewindType, setBewindType] = useState(initial?.bewind_type ?? "");
  const [identificatienummer, setIdentificatienummer] = useState(
    initial?.identificatienummer ?? "",
  );
  const [rolnummer, setRolnummer] = useState(initial?.rolnummer ?? "");
  const [geboortedatum, setGeboortedatum] = useState(initial?.geboortedatum ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [telefoon, setTelefoon] = useState(initial?.telefoon ?? "");
  const [adres, setAdres] = useState(initial?.adres ?? "");
  const [vertrouwenspersoonNaam, setVertrouwenspersoonNaam] = useState(
    initial?.vertrouwenspersoon_naam ?? "",
  );
  const [vertrouwenspersoonTelefoon, setVertrouwenspersoonTelefoon] = useState(
    initial?.vertrouwenspersoon_telefoon ?? "",
  );
  const [familieleden, setFamilieleden] = useState(initial?.familieleden ?? "");
  const [extraInfo, setExtraInfo] = useState(initial?.extra_info ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = klantFormSchema.safeParse({
      naam,
      bewindType,
      identificatienummer,
      rolnummer,
      geboortedatum,
      email,
      telefoon,
      adres,
      vertrouwenspersoonNaam,
      vertrouwenspersoonTelefoon,
      familieleden,
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
          {t("klantForm.naam")}
        </label>
        <input
          id="naam"
          className="input"
          value={naam}
          onChange={(e) => setNaam(e.target.value)}
          placeholder={t("klantForm.naamPlaceholder")}
        />
        {errors.naam && <span className="field-error">{errors.naam}</span>}
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="rolnummer">
            {t("klantForm.rolnr")}
          </label>
          <input
            id="rolnummer"
            className="input"
            value={rolnummer}
            onChange={(e) => setRolnummer(e.target.value)}
            placeholder="B/…"
          />
          {errors.rolnummer && <span className="field-error">{errors.rolnummer}</span>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="geboortedatum">
            {t("klantForm.geboortedatum")}
          </label>
          <input
            id="geboortedatum"
            type="date"
            className="input"
            value={geboortedatum}
            onChange={(e) => setGeboortedatum(e.target.value)}
          />
          {errors.geboortedatum && <span className="field-error">{errors.geboortedatum}</span>}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="bewindType">
            {t("klantForm.typeBewind")}
          </label>
          <select
            id="bewindType"
            className="select"
            value={bewindType}
            onChange={(e) => setBewindType(e.target.value)}
          >
            <option value="">{t("klantForm.typeBewindOnbekend")}</option>
            <option value="goederen">{t("klantForm.goederen")}</option>
            <option value="persoon">{t("klantForm.persoon")}</option>
            <option value="beide">{t("klantForm.goederenEnPersoon")}</option>
          </select>
          {errors.bewindType && <span className="field-error">{errors.bewindType}</span>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="identificatienummer">
            {t("klantForm.identificatienummer")}
          </label>
          <input
            id="identificatienummer"
            className="input"
            value={identificatienummer}
            onChange={(e) => setIdentificatienummer(e.target.value)}
            placeholder={t("klantForm.rijksregisternummer")}
          />
          {errors.identificatienummer && (
            <span className="field-error">{errors.identificatienummer}</span>
          )}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="email">
            {t("klantForm.email")}
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
            {t("klantForm.telefoon")}
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
          {t("klantForm.adres")}
        </label>
        <input
          id="adres"
          className="input"
          value={adres}
          onChange={(e) => setAdres(e.target.value)}
          placeholder={t("klantForm.adresPlaceholder")}
        />
        {errors.adres && <span className="field-error">{errors.adres}</span>}
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="vertrouwenspersoonNaam">
            {t("klantForm.vertrouwenspersoonNaam")}
          </label>
          <input
            id="vertrouwenspersoonNaam"
            className="input"
            value={vertrouwenspersoonNaam}
            onChange={(e) => setVertrouwenspersoonNaam(e.target.value)}
            placeholder={t("klantForm.vertrouwenspersoonNaamPlaceholder")}
          />
          {errors.vertrouwenspersoonNaam && (
            <span className="field-error">{errors.vertrouwenspersoonNaam}</span>
          )}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="vertrouwenspersoonTelefoon">
            {t("klantForm.vertrouwenspersoonTelefoon")}
          </label>
          <input
            id="vertrouwenspersoonTelefoon"
            className="input"
            value={vertrouwenspersoonTelefoon}
            onChange={(e) => setVertrouwenspersoonTelefoon(e.target.value)}
            placeholder="+32 4xx xx xx xx"
          />
          {errors.vertrouwenspersoonTelefoon && (
            <span className="field-error">{errors.vertrouwenspersoonTelefoon}</span>
          )}
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="familieleden">
          {t("klantForm.familieleden")}
        </label>
        <textarea
          id="familieleden"
          className="textarea"
          value={familieleden}
          onChange={(e) => setFamilieleden(e.target.value)}
          placeholder={t("klantForm.familieledenPlaceholder")}
        />
        {errors.familieleden && <span className="field-error">{errors.familieleden}</span>}
        <span className="field-hint">
          {familieleden.length}/2000 {t("klantForm.tekens")}
        </span>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="klantExtraInfo">
          {t("klantForm.extraInformatie")}
        </label>
        <textarea
          id="klantExtraInfo"
          className="textarea"
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
          placeholder={t("klantForm.extraInformatiePlaceholder")}
        />
        {errors.extraInfo && <span className="field-error">{errors.extraInfo}</span>}
        <span className="field-hint">
          {extraInfo.length}/2000 {t("klantForm.tekens")}
        </span>
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

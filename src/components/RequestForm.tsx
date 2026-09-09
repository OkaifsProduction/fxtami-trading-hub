import { useState } from "react";
import { requestFieldsSchema, requestFormSchema, type RequestFieldsValues, type RequestFormValues } from "@/lib/schema";
import type { KlantRow, RequestRow } from "@/lib/database.types";
import type { DossierOption } from "@/lib/queries";
import { useLocale } from "@/lib/i18n";

type FieldErrors = Partial<Record<keyof RequestFormValues | "klantId", string>>;

const NIEUW_DOSSIER = "__nieuw__";

/** Resultaat van de "klant-eerst"-flow: het dossier bestaat al, of moet nog aangemaakt worden. */
export interface NieuweAanvraagMetKlant {
  klantId: string;
  dossierId: string | null;
  nieuweDossierTitel: string | null;
  fields: RequestFieldsValues;
}

interface RequestFormProps {
  initial?: RequestRow;
  /** Dossiers to choose from. Not shown when `lockedDossier` is set. */
  dossierOptions?: DossierOption[];
  /** When creating an aanvraag from within a dossier, lock it instead of showing a picker. */
  lockedDossier?: { id: string; label: string };
  /**
   * Alle klanten, om eerst een klant te kiezen en pas dan een (bestaand of
   * nieuw aan te maken) dossier van die klant. Actief wanneer noch
   * `initial` noch `lockedDossier` gezet is; `onSubmitMetKlant` wordt dan
   * gebruikt in plaats van `onSubmit`.
   */
  klantOptions?: KlantRow[];
  submitLabel: string;
  submitting: boolean;
  onSubmit?: (values: RequestFormValues) => void;
  onSubmitMetKlant?: (payload: NieuweAanvraagMetKlant) => void;
  onCancel?: () => void;
}

export function RequestForm({
  initial,
  dossierOptions,
  lockedDossier,
  klantOptions,
  submitLabel,
  submitting,
  onSubmit,
  onSubmitMetKlant,
  onCancel,
}: RequestFormProps) {
  const { t } = useLocale();
  const klantEerstModus = !initial && !lockedDossier && klantOptions !== undefined;

  const [dossierId, setDossierId] = useState(initial?.dossier_id ?? lockedDossier?.id ?? "");
  const [klantId, setKlantId] = useState("");
  const [nieuweDossierTitel, setNieuweDossierTitel] = useState("");
  const [requestedAmount, setRequestedAmount] = useState(
    initial ? String(initial.requested_amount) : "",
  );
  const [grantedAmount, setGrantedAmount] = useState(
    initial?.granted_amount != null ? String(initial.granted_amount) : "",
  );
  const [status, setStatus] = useState(initial?.status ?? "open");
  const [extraInfo, setExtraInfo] = useState(initial?.extra_info ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});

  const klantDossiers = (dossierOptions ?? []).filter((d) => d.klant_id === klantId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsedRequested = Number.parseFloat(requestedAmount);
    const parsedGranted = grantedAmount.trim() === "" ? null : Number.parseFloat(grantedAmount);

    if (klantEerstModus) {
      const nextErrors: FieldErrors = {};
      if (!klantId) nextErrors.klantId = t("aanvraagForm.klantVerplicht");
      if (!dossierId) nextErrors.dossierId = t("aanvraagForm.dossierVerplicht");
      if (dossierId === NIEUW_DOSSIER && !nieuweDossierTitel.trim()) {
        nextErrors.dossierId = t("aanvraagForm.titelNieuwDossierVerplicht");
      }

      const fieldsResult = requestFieldsSchema.safeParse({
        requestedAmount: parsedRequested,
        grantedAmount: parsedGranted,
        status,
        extraInfo,
      });
      if (!fieldsResult.success) {
        for (const issue of fieldsResult.error.issues) {
          const key = issue.path[0] as keyof RequestFieldsValues;
          nextErrors[key] = issue.message;
        }
      }

      if (Object.keys(nextErrors).length > 0 || !fieldsResult.success) {
        setErrors(nextErrors);
        return;
      }

      setErrors({});
      onSubmitMetKlant?.({
        klantId,
        dossierId: dossierId === NIEUW_DOSSIER ? null : dossierId,
        nieuweDossierTitel: dossierId === NIEUW_DOSSIER ? nieuweDossierTitel.trim() : null,
        fields: fieldsResult.data,
      });
      return;
    }

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
    onSubmit?.(result.data);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {lockedDossier ? (
        <div className="field">
          <span className="field-label">{t("aanvraagNieuw.dossier")}</span>
          <div className="dossier-context-pill">{lockedDossier.label}</div>
        </div>
      ) : klantEerstModus ? (
        <>
          <div className="field">
            <label className="field-label" htmlFor="klantId">
              {t("aanvraagNieuw.klant")}
            </label>
            <select
              id="klantId"
              className="select"
              value={klantId}
              onChange={(e) => {
                setKlantId(e.target.value);
                setDossierId("");
                setNieuweDossierTitel("");
              }}
            >
              <option value="">{t("aanvraagNieuw.kiesKlant")}</option>
              {(klantOptions ?? []).map((k) => (
                <option key={k.id} value={k.id}>
                  {k.naam}
                </option>
              ))}
            </select>
            {(klantOptions ?? []).length === 0 && (
              <span className="field-hint">{t("aanvraagNieuw.geenKlantenKort")}</span>
            )}
            {errors.klantId && <span className="field-error">{errors.klantId}</span>}
          </div>

          {klantId && (
            <div className="field">
              <label className="field-label" htmlFor="dossierId">
                {t("aanvraagNieuw.dossier")}
              </label>
              <select
                id="dossierId"
                className="select"
                value={dossierId}
                onChange={(e) => {
                  setDossierId(e.target.value);
                  if (e.target.value !== NIEUW_DOSSIER) setNieuweDossierTitel("");
                }}
              >
                <option value="">{t("aanvraagNieuw.kiesDossier")}</option>
                {klantDossiers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.titel}
                  </option>
                ))}
                <option value={NIEUW_DOSSIER}>{t("aanvraagNieuw.nieuwDossierAanmaken")}</option>
              </select>
              {errors.dossierId && <span className="field-error">{errors.dossierId}</span>}
            </div>
          )}

          {dossierId === NIEUW_DOSSIER && (
            <div className="field">
              <label className="field-label" htmlFor="nieuweDossierTitel">
                {t("aanvraagNieuw.titelNieuwDossier")}
              </label>
              <input
                id="nieuweDossierTitel"
                className="input"
                value={nieuweDossierTitel}
                onChange={(e) => setNieuweDossierTitel(e.target.value)}
                placeholder={t("aanvraagNieuw.titelNieuwDossierPlaceholder")}
              />
            </div>
          )}
        </>
      ) : (
        <div className="field">
          <span className="field-label">{t("aanvraagNieuw.dossier")}</span>
          <select
            id="dossierId"
            className="select"
            value={dossierId}
            onChange={(e) => setDossierId(e.target.value)}
          >
            <option value="">{t("aanvraagNieuw.kiesDossier")}</option>
            {(dossierOptions ?? []).map((d) => (
              <option key={d.id} value={d.id}>
                {d.klantNaam} — {d.titel}
              </option>
            ))}
          </select>
          {(dossierOptions ?? []).length === 0 && (
            <span className="field-hint">{t("aanvraagNieuw.geenDossiers")}</span>
          )}
          {errors.dossierId && <span className="field-error">{errors.dossierId}</span>}
        </div>
      )}

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="requestedAmount">
            {t("aanvraagForm.gevraagdBedrag")}
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
            {t("aanvraagForm.toegekendBedrag")}
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
          {t("aanvraagForm.status")}
        </label>
        <select
          id="status"
          className="select"
          value={status}
          onChange={(e) => setStatus(e.target.value as RequestFormValues["status"])}
        >
          <option value="open">{t("status.open")}</option>
          <option value="in_behandeling">{t("status.inBehandeling")}</option>
          <option value="goedgekeurd">{t("status.goedgekeurd")}</option>
          <option value="geweigerd">{t("status.geweigerd")}</option>
          <option value="afgehandeld">{t("status.afgehandeld")}</option>
        </select>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="extraInfo">
          {t("aanvraagForm.extraInformatie")}
        </label>
        <textarea
          id="extraInfo"
          className="textarea"
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
          placeholder={t("aanvraagForm.extraInformatieHint")}
        />
        {errors.extraInfo && <span className="field-error">{errors.extraInfo}</span>}
        <span className="field-hint">{extraInfo.length}/4000</span>
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

import { useMemo, useState } from "react";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useDossierOptions } from "@/lib/queries";
import { useCreateUitnodiging } from "@/lib/begeleidersBeheerQueries";
import { begeleiderUitnodigingSchema, type BegeleiderUitnodigingValues } from "@/lib/schema";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLocale } from "@/lib/i18n";

export const begeleiderNieuwRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/begeleiders/nieuw",
  component: NieuweBegeleiderPage,
});

type FieldErrors = Partial<Record<keyof BegeleiderUitnodigingValues, string>>;

function NieuweBegeleiderPage() {
  const { t } = useLocale();
  usePageTitle(t("begeleiderNieuw.title"));
  const navigate = useNavigate();
  const { data: dossierOptions, isLoading: dossiersLoading } = useDossierOptions();
  const createUitnodiging = useCreateUitnodiging();

  const [organisatie, setOrganisatie] = useState("");
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [dossierZoek, setDossierZoek] = useState("");
  const [geselecteerd, setGeselecteerd] = useState<string[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});

  const zichtbareDossiers = useMemo(() => {
    const term = dossierZoek.trim().toLowerCase();
    const alle = [...(dossierOptions ?? [])].sort((a, b) => a.klantNaam.localeCompare(b.klantNaam));
    if (term === "") return alle;
    return alle.filter((d) => `${d.klantNaam} ${d.titel}`.toLowerCase().includes(term));
  }, [dossierOptions, dossierZoek]);

  function toggleDossier(id: string) {
    setGeselecteerd((huidig) =>
      huidig.includes(id) ? huidig.filter((x) => x !== id) : [...huidig, id],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = begeleiderUitnodigingSchema.safeParse({
      organisatie,
      naam,
      email,
      dossierIds: geselecteerd,
    });

    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof BegeleiderUitnodigingValues;
        nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    createUitnodiging.mutate(result.data, {
      onSuccess: () => navigate({ to: "/begeleiders" }),
    });
  }

  // De partiële unique-index in de database laat maar één openstaande
  // uitnodiging per adres toe; die fout vertalen we naar een leesbare melding
  // in plaats van een ruwe Postgres-tekst.
  const isDubbeleUitnodiging =
    createUitnodiging.isError &&
    String((createUitnodiging.error as { code?: string } | null)?.code) === "23505";

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("begeleiderNieuw.title")}</h1>
          <p className="page-subtitle">{t("begeleiderNieuw.subtitle")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="card card-padded" style={{ maxWidth: 560 }}>
          <div className="field">
            <label className="field-label" htmlFor="organisatie">
              {t("begeleiders.organisatie")}
            </label>
            <input
              id="organisatie"
              className="input"
              value={organisatie}
              onChange={(e) => setOrganisatie(e.target.value)}
              placeholder={t("begeleiderNieuw.organisatiePlaceholder")}
            />
            {errors.organisatie && <span className="field-error">{errors.organisatie}</span>}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="contactpersoon">
              {t("begeleiders.contactpersoon")}
            </label>
            <input
              id="contactpersoon"
              className="input"
              value={naam}
              onChange={(e) => setNaam(e.target.value)}
              placeholder={t("begeleiderNieuw.contactpersoonPlaceholder")}
            />
            {errors.naam && <span className="field-error">{errors.naam}</span>}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="begeleiderEmail">
              {t("klantForm.email")}
            </label>
            <input
              id="begeleiderEmail"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("begeleiderNieuw.emailPlaceholder")}
              autoComplete="off"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
        </div>

        <div className="card card-padded mt-24">
          <div className="flex-between" style={{ marginBottom: 8 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>
              {t("begeleiderNieuw.dossiersToewijzen")}
            </h2>
            <span className="text-secondary" style={{ fontSize: 13 }}>
              {geselecteerd.length} {t("begeleiderNieuw.geselecteerd")}
            </span>
          </div>
          <p className="field-hint" style={{ marginBottom: 16 }}>
            {t("begeleiderNieuw.dossiersHint")}
          </p>

          <input
            type="text"
            className="input"
            style={{ marginBottom: 12 }}
            placeholder={t("begeleiderNieuw.zoekDossier")}
            value={dossierZoek}
            onChange={(e) => setDossierZoek(e.target.value)}
          />

          {dossiersLoading ? (
            <div className="empty-state">{t("common.laden")}</div>
          ) : zichtbareDossiers.length === 0 ? (
            <p className="text-secondary" style={{ fontSize: 14 }}>
              {t("begeleiderNieuw.geenDossiers")}
            </p>
          ) : (
            <div className="keuzelijst">
              {zichtbareDossiers.map((d) => (
                <label key={d.id} className="keuzelijst-optie">
                  <input
                    type="checkbox"
                    checked={geselecteerd.includes(d.id)}
                    onChange={() => toggleDossier(d.id)}
                  />
                  <span>
                    <span className="list-row-primary">{d.klantNaam}</span>
                    <br />
                    <span className="list-row-secondary">{d.titel}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex-between mt-24" style={{ maxWidth: 560 }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate({ to: "/begeleiders" })}
          >
            {t("common.annuleren")}
          </button>
          <button type="submit" className="btn btn-primary" disabled={createUitnodiging.isPending}>
            {createUitnodiging.isPending
              ? t("common.bezigMetOpslaan")
              : t("begeleiderNieuw.uitnodigen")}
          </button>
        </div>

        {createUitnodiging.isError && (
          <div className="form-error mt-24" style={{ maxWidth: 560 }}>
            {isDubbeleUitnodiging
              ? t("begeleiderNieuw.emailBestaatAl")
              : t("common.opslaanMislukt")}
          </div>
        )}
      </form>
    </div>
  );
}

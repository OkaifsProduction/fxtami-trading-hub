import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useCreateDossier, useCreateRequest, useDossierOptions, useKlanten } from "@/lib/queries";
import { RequestForm, type NieuweAanvraagMetKlant } from "@/components/RequestForm";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLocale } from "@/lib/i18n";

export const aanvragenNieuwRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/aanvragen/nieuw",
  component: NieuweAanvraagPage,
});

function NieuweAanvraagPage() {
  const { t } = useLocale();
  usePageTitle(t("aanvraagNieuw.title"));
  const navigate = useNavigate();
  const createRequest = useCreateRequest();
  const createDossier = useCreateDossier();
  const { data: klantOptions, isLoading: klantenLoading } = useKlanten();
  const { data: dossierOptions } = useDossierOptions();

  async function handleSubmitMetKlant(payload: NieuweAanvraagMetKlant) {
    let dossierId = payload.dossierId;
    if (!dossierId) {
      const dossier = await createDossier.mutateAsync({
        klantId: payload.klantId,
        values: { titel: payload.nieuweDossierTitel ?? "", omschrijving: "", status: "open" },
      });
      dossierId = dossier.id;
    }
    createRequest.mutate(
      { dossierId, ...payload.fields },
      { onSuccess: (row) => navigate({ to: "/aanvragen/$id", params: { id: row.id } }) },
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("aanvraagNieuw.title")}</h1>
          <p className="page-subtitle">{t("aanvraagNieuw.subtitle")}</p>
        </div>
      </div>

      <div className="card card-padded" style={{ maxWidth: 560 }}>
        {!klantenLoading && (klantOptions ?? []).length === 0 ? (
          <div className="stack">
            <p className="text-secondary">{t("aanvraagNieuw.geenKlanten")}</p>
            <Link to="/klanten/nieuw" className="btn btn-primary">
              <span className="btn-icon">+</span> {t("klanten.nieuweKlant")}
            </Link>
          </div>
        ) : (
          <RequestForm
            klantOptions={klantOptions}
            dossierOptions={dossierOptions}
            submitLabel={t("aanvraagNieuw.aanvraagOpslaan")}
            submitting={createRequest.isPending || createDossier.isPending}
            onCancel={() => navigate({ to: "/aanvragen" })}
            onSubmitMetKlant={handleSubmitMetKlant}
          />
        )}
        {(createRequest.isError || createDossier.isError) && (
          <div className="form-error mt-24">{t("common.opslaanMislukt")}</div>
        )}
      </div>
    </div>
  );
}

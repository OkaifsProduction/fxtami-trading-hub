import { createRoute, useNavigate } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useCreateRequest, useDossier, useKlant } from "@/lib/queries";
import { RequestForm } from "@/components/RequestForm";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLocale } from "@/lib/i18n";

export const dossierAanvraagNieuwRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/dossiers/$id/aanvragen/nieuw",
  component: NieuweAanvraagVoorDossierPage,
});

function NieuweAanvraagVoorDossierPage() {
  const { t } = useLocale();
  const { id } = dossierAanvraagNieuwRoute.useParams();
  const { data: dossier } = useDossier(id);
  const { data: klant } = useKlant(dossier?.klant_id ?? "");
  const navigate = useNavigate();
  const createRequest = useCreateRequest();
  usePageTitle(t("aanvraagNieuw.title"));

  const label = dossier
    ? `${klant ? klant.naam + " — " : ""}${dossier.titel}`
    : t("dossierNieuw.laden");

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("aanvraagNieuw.title")}</h1>
          <p className="page-subtitle">{t("aanvraagNieuw.subtitleDossier")}</p>
        </div>
      </div>

      <div className="card card-padded" style={{ maxWidth: 560 }}>
        <RequestForm
          lockedDossier={{ id, label }}
          submitLabel={t("aanvraagNieuw.aanvraagOpslaan")}
          submitting={createRequest.isPending}
          onCancel={() => navigate({ to: "/dossiers/$id", params: { id } })}
          onSubmit={(values) => {
            createRequest.mutate(values, {
              onSuccess: (row) => navigate({ to: "/aanvragen/$id", params: { id: row.id } }),
            });
          }}
        />
        {createRequest.isError && (
          <div className="form-error mt-24">{t("common.opslaanMislukt")}</div>
        )}
      </div>
    </div>
  );
}

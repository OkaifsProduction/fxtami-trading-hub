import { createRoute, useNavigate } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useCreateDossier, useKlant } from "@/lib/queries";
import { DossierForm } from "@/components/DossierForm";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLocale } from "@/lib/i18n";

export const dossierNieuwRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/klanten/$id/dossiers/nieuw",
  component: NieuwDossierPage,
});

function NieuwDossierPage() {
  const { t } = useLocale();
  const { id } = dossierNieuwRoute.useParams();
  const { data: klant } = useKlant(id);
  const navigate = useNavigate();
  const createDossier = useCreateDossier();
  usePageTitle(t("dossierNieuw.title"));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("dossierNieuw.title")}</h1>
          <p className="page-subtitle">
            {klant ? `${t("dossierNieuw.voor")} ${klant.naam}` : t("dossierNieuw.subtitle")}
          </p>
        </div>
      </div>

      <div className="card card-padded" style={{ maxWidth: 560 }}>
        <DossierForm
          submitLabel={t("dossierForm.opslaan")}
          submitting={createDossier.isPending}
          onCancel={() => navigate({ to: "/klanten/$id", params: { id } })}
          onSubmit={(values) => {
            createDossier.mutate(
              { klantId: id, values },
              { onSuccess: (row) => navigate({ to: "/dossiers/$id", params: { id: row.id } }) },
            );
          }}
        />
        {createDossier.isError && (
          <div className="form-error mt-24">{t("common.opslaanMislukt")}</div>
        )}
      </div>
    </div>
  );
}

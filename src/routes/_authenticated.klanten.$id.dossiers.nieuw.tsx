import { createRoute, useNavigate } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useCreateDossier, useKlant } from "@/lib/queries";
import { DossierForm } from "@/components/DossierForm";
import { usePageTitle } from "@/lib/usePageTitle";

export const dossierNieuwRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/klanten/$id/dossiers/nieuw",
  component: NieuwDossierPage,
});

function NieuwDossierPage() {
  const { id } = dossierNieuwRoute.useParams();
  const { data: klant } = useKlant(id);
  const navigate = useNavigate();
  const createDossier = useCreateDossier(id);
  usePageTitle("Nieuw dossier");

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Nieuw dossier</h1>
          <p className="page-subtitle">
            {klant ? `Voor ${klant.naam}` : "Voeg een nieuw dossier toe"}
          </p>
        </div>
      </div>

      <div className="card card-padded" style={{ maxWidth: 560 }}>
        <DossierForm
          submitLabel="Dossier opslaan"
          submitting={createDossier.isPending}
          onCancel={() => navigate({ to: "/klanten/$id", params: { id } })}
          onSubmit={(values) => {
            createDossier.mutate(values, {
              onSuccess: (row) => navigate({ to: "/dossiers/$id", params: { id: row.id } }),
            });
          }}
        />
        {createDossier.isError && (
          <div className="form-error mt-24">Opslaan mislukt. Probeer het opnieuw.</div>
        )}
      </div>
    </div>
  );
}

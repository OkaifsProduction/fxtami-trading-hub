import { createRoute, useNavigate } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useCreateRequest, useDossier, useKlant } from "@/lib/queries";
import { RequestForm } from "@/components/RequestForm";
import { usePageTitle } from "@/lib/usePageTitle";

export const dossierAanvraagNieuwRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/dossiers/$id/aanvragen/nieuw",
  component: NieuweAanvraagVoorDossierPage,
});

function NieuweAanvraagVoorDossierPage() {
  const { id } = dossierAanvraagNieuwRoute.useParams();
  const { data: dossier } = useDossier(id);
  const { data: klant } = useKlant(dossier?.klant_id ?? "");
  const navigate = useNavigate();
  const createRequest = useCreateRequest();
  usePageTitle("Nieuwe aanvraag");

  const label = dossier
    ? `${klant ? klant.naam + " — " : ""}${dossier.titel}`
    : "Dossier laden…";

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Nieuwe aanvraag</h1>
          <p className="page-subtitle">Registreer een aanvraag voor dit dossier</p>
        </div>
      </div>

      <div className="card card-padded" style={{ maxWidth: 560 }}>
        <RequestForm
          lockedDossier={{ id, label }}
          submitLabel="Aanvraag opslaan"
          submitting={createRequest.isPending}
          onCancel={() => navigate({ to: "/dossiers/$id", params: { id } })}
          onSubmit={(values) => {
            createRequest.mutate(values, {
              onSuccess: (row) => navigate({ to: "/aanvragen/$id", params: { id: row.id } }),
            });
          }}
        />
        {createRequest.isError && (
          <div className="form-error mt-24">Opslaan mislukt. Probeer het opnieuw.</div>
        )}
      </div>
    </div>
  );
}

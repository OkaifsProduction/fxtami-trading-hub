import { createRoute, useNavigate } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useCreateRequest } from "@/lib/queries";
import { RequestForm } from "@/components/RequestForm";
import { usePageTitle } from "@/lib/usePageTitle";

export const aanvragenNieuwRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/aanvragen/nieuw",
  component: NieuweAanvraagPage,
});

function NieuweAanvraagPage() {
  usePageTitle("Nieuwe aanvraag");
  const navigate = useNavigate();
  const createRequest = useCreateRequest();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Nieuwe aanvraag</h1>
          <p className="page-subtitle">Registreer een aanvraag die telefonisch of per mail binnenkwam</p>
        </div>
      </div>

      <div className="card card-padded" style={{ maxWidth: 560 }}>
        <RequestForm
          submitLabel="Aanvraag opslaan"
          submitting={createRequest.isPending}
          onCancel={() => navigate({ to: "/aanvragen" })}
          onSubmit={(values) => {
            createRequest.mutate(values, {
              onSuccess: (row) => navigate({ to: "/aanvragen/$id", params: { id: row.id } }),
            });
          }}
        />
        {createRequest.isError && (
          <div className="form-error mt-24">
            Opslaan mislukt. Probeer het opnieuw.
          </div>
        )}
      </div>
    </div>
  );
}

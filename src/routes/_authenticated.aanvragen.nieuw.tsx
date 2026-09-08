import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useCreateDossier, useCreateRequest, useDossierOptions, useKlanten } from "@/lib/queries";
import { RequestForm, type NieuweAanvraagMetKlant } from "@/components/RequestForm";
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
          <h1 className="page-title">Nieuwe aanvraag</h1>
          <p className="page-subtitle">Registreer een aanvraag die telefonisch of per mail binnenkwam</p>
        </div>
      </div>

      <div className="card card-padded" style={{ maxWidth: 560 }}>
        {!klantenLoading && (klantOptions ?? []).length === 0 ? (
          <div className="stack">
            <p className="text-secondary">
              Er zijn nog geen klanten. Maak eerst een klant aan voordat je een aanvraag
              registreert.
            </p>
            <Link to="/klanten/nieuw" className="btn btn-primary">
              <span className="btn-icon">+</span> Nieuwe klant
            </Link>
          </div>
        ) : (
          <RequestForm
            klantOptions={klantOptions}
            dossierOptions={dossierOptions}
            submitLabel="Aanvraag opslaan"
            submitting={createRequest.isPending || createDossier.isPending}
            onCancel={() => navigate({ to: "/aanvragen" })}
            onSubmitMetKlant={handleSubmitMetKlant}
          />
        )}
        {(createRequest.isError || createDossier.isError) && (
          <div className="form-error mt-24">
            Opslaan mislukt. Probeer het opnieuw.
          </div>
        )}
      </div>
    </div>
  );
}

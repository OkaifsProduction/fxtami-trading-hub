import { useState } from "react";
import { createRoute, Link } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useDossier, useUpdateDossier, useKlant, useRequestsByDossier } from "@/lib/queries";
import { DossierForm } from "@/components/DossierForm";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { formatAmount, formatDate } from "@/lib/format";
import { usePageTitle } from "@/lib/usePageTitle";

export const dossierDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/dossiers/$id",
  component: DossierDetailPage,
});

function DossierDetailPage() {
  const { id } = dossierDetailRoute.useParams();
  const { data: dossier, isLoading } = useDossier(id);
  const { data: klant } = useKlant(dossier?.klant_id ?? "");
  const { data: requests, isLoading: requestsLoading } = useRequestsByDossier(id);
  const updateDossier = useUpdateDossier(id);
  const [isEditing, setIsEditing] = useState(false);
  usePageTitle(dossier?.titel ?? "Dossier");

  if (isLoading) {
    return (
      <div className="page">
        <div className="empty-state">Laden…</div>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-title">Dossier niet gevonden</div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Dossier bewerken</h1>
        </div>
        <div className="card card-padded" style={{ maxWidth: 560 }}>
          <DossierForm
            initial={dossier}
            submitLabel="Wijzigingen opslaan"
            submitting={updateDossier.isPending}
            onCancel={() => setIsEditing(false)}
            onSubmit={(values) => {
              updateDossier.mutate(values, { onSuccess: () => setIsEditing(false) });
            }}
          />
          {updateDossier.isError && (
            <div className="form-error mt-24">Opslaan mislukt. Probeer het opnieuw.</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/klanten">Klanten</Link>
        <span>/</span>
        {klant ? (
          <Link to="/klanten/$id" params={{ id: klant.id }}>
            {klant.naam}
          </Link>
        ) : (
          <span>…</span>
        )}
        <span>/</span>
        <span>{dossier.titel}</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">{dossier.titel}</h1>
          <p className="page-subtitle">Aangemaakt op {formatDate(dossier.created_at)}</p>
        </div>
        <div className="flex-between" style={{ gap: 12 }}>
          <StatusBadge status={dossier.status} />
          <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
            Bewerken
          </button>
        </div>
      </div>

      {dossier.omschrijving && (
        <div className="card card-padded" style={{ marginBottom: 24 }}>
          <div className="detail-section-label">Omschrijving</div>
          <div className="detail-section-body">{dossier.omschrijving}</div>
        </div>
      )}

      <div className="card">
        <div className="card-padded flex-between">
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Aanvragen</h2>
          <Link
            to="/dossiers/$id/aanvragen/nieuw"
            params={{ id: dossier.id }}
            className="btn btn-primary btn-sm"
          >
            + Nieuwe aanvraag
          </Link>
        </div>
        {requestsLoading ? (
          <div className="empty-state">Laden…</div>
        ) : (requests ?? []).length === 0 ? (
          <EmptyState
            title="Nog geen aanvragen"
            description="Registreer een aanvraag voor dit dossier."
          />
        ) : (
          requests?.map((r) => (
            <Link
              key={r.id}
              to="/aanvragen/$id"
              params={{ id: r.id }}
              className="list-row card-interactive"
              style={{ gridTemplateColumns: "1fr 1fr 1fr auto" }}
            >
              <div className="list-row-secondary">{formatDate(r.created_at)}</div>
              <div className="amount">
                <span className="amount-label">Gevraagd</span>
                {formatAmount(r.requested_amount)}
              </div>
              <div className="amount">
                <span className="amount-label">Toegekend</span>
                {formatAmount(r.granted_amount)}
              </div>
              <StatusBadge status={r.status} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

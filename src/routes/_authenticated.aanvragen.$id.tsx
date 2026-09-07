import { useState } from "react";
import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import {
  useRequest,
  useUpdateRequest,
  useSetRequestStatus,
  useDeleteRequest,
  useDossier,
  useKlant,
  useDossierOptions,
} from "@/lib/queries";
import { RequestForm } from "@/components/RequestForm";
import { StatusBadge } from "@/components/StatusBadge";
import { formatAmount, formatDate } from "@/lib/format";
import { usePageTitle } from "@/lib/usePageTitle";
import type { AanvraagStatus } from "@/lib/database.types";

const STATUS_OPTIONS: { value: AanvraagStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in_behandeling", label: "In behandeling" },
  { value: "goedgekeurd", label: "Goedgekeurd" },
  { value: "geweigerd", label: "Geweigerd" },
  { value: "afgehandeld", label: "Afgehandeld" },
];

const BEVESTIGING_VEREIST: AanvraagStatus[] = ["geweigerd", "afgehandeld"];

export const aanvraagDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/aanvragen/$id",
  component: AanvraagDetailPage,
});

function AanvraagDetailPage() {
  const { id } = aanvraagDetailRoute.useParams();
  const navigate = useNavigate();
  const { data: request, isLoading } = useRequest(id);
  const { data: dossier } = useDossier(request?.dossier_id ?? "");
  const { data: klant } = useKlant(dossier?.klant_id ?? "");
  const { data: dossierOptions } = useDossierOptions();
  const updateRequest = useUpdateRequest(id);
  const setRequestStatus = useSetRequestStatus(id);
  const deleteRequest = useDeleteRequest();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<AanvraagStatus | null>(null);
  usePageTitle(klant?.naam ?? request?.name ?? "Aanvraag");

  function handleStatusChange(next: AanvraagStatus) {
    if (!request || next === request.status) return;
    if (BEVESTIGING_VEREIST.includes(next)) {
      setPendingStatus(next);
    } else {
      setRequestStatus.mutate(next);
    }
  }

  if (isLoading) {
    return (
      <div className="page">
        <div className="empty-state">Laden…</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-title">Aanvraag niet gevonden</div>
        </div>
      </div>
    );
  }

  const displayName = klant?.naam ?? request.name ?? "Onbekende klant";
  const displayPurpose = dossier?.titel ?? request.purpose ?? "Geen dossier gekoppeld";

  if (isEditing) {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Aanvraag bewerken</h1>
        </div>
        <div className="card card-padded" style={{ maxWidth: 560 }}>
          <RequestForm
            initial={request}
            dossierOptions={dossierOptions}
            submitLabel="Wijzigingen opslaan"
            submitting={updateRequest.isPending}
            onCancel={() => setIsEditing(false)}
            onSubmit={(values) => {
              updateRequest.mutate(values, {
                onSuccess: () => setIsEditing(false),
              });
            }}
          />
          {updateRequest.isError && (
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
          <span>{displayName}</span>
        )}
        <span>/</span>
        {dossier ? (
          <Link to="/dossiers/$id" params={{ id: dossier.id }}>
            {dossier.titel}
          </Link>
        ) : (
          <span>{displayPurpose}</span>
        )}
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">{displayName}</h1>
          <p className="page-subtitle">
            Aangemaakt op {formatDate(request.created_at)}
          </p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="detail-grid">
        <div className="card card-padded">
          <div className="detail-section-label">Dossier</div>
          <div className="detail-section-body">{displayPurpose}</div>

          <div className="detail-amounts">
            <div>
              <span className="amount-label">Gevraagd bedrag</span>
              <div className="stat-value">{formatAmount(request.requested_amount)}</div>
            </div>
            <div>
              <span className="amount-label">Toegekend bedrag</span>
              <div className="stat-value accent">{formatAmount(request.granted_amount)}</div>
            </div>
          </div>

          {request.extra_info && (
            <div className="detail-section">
              <div className="detail-section-label">Extra informatie</div>
              <div className="detail-section-body">{request.extra_info}</div>
            </div>
          )}
        </div>

        <div className="card card-padded stack">
          <div>
            <div className="field-label" style={{ marginBottom: 8 }}>
              Status wijzigen
            </div>
            <select
              className="select"
              value={pendingStatus ?? request.status}
              onChange={(e) => handleStatusChange(e.target.value as AanvraagStatus)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {pendingStatus && (
            <div className="stack">
              <p className="text-secondary" style={{ fontSize: 13 }}>
                Weet je zeker dat je deze aanvraag als "
                {STATUS_OPTIONS.find((o) => o.value === pendingStatus)?.label}" wil markeren?
              </p>
              <button
                className="btn btn-primary btn-block"
                disabled={setRequestStatus.isPending}
                onClick={() => {
                  setRequestStatus.mutate(pendingStatus, {
                    onSuccess: () => setPendingStatus(null),
                  });
                }}
              >
                {setRequestStatus.isPending ? "Bezig met opslaan…" : "Ja, bevestigen"}
              </button>
              <button className="btn btn-ghost btn-block" onClick={() => setPendingStatus(null)}>
                Annuleren
              </button>
            </div>
          )}
          {setRequestStatus.isError && !pendingStatus && (
            <div className="form-error">Status wijzigen mislukt. Probeer het opnieuw.</div>
          )}

          <button className="btn btn-secondary btn-block" onClick={() => setIsEditing(true)}>
            Bewerken
          </button>
          {confirmDelete ? (
            <div className="stack">
              <p className="text-secondary" style={{ fontSize: 13 }}>
                Weet je zeker dat je deze aanvraag wilt verwijderen? Dit kan niet ongedaan gemaakt
                worden.
              </p>
              <button
                className="btn btn-danger btn-block"
                disabled={deleteRequest.isPending}
                onClick={() => {
                  deleteRequest.mutate(id, {
                    onSuccess: () => navigate({ to: "/aanvragen" }),
                  });
                }}
              >
                {deleteRequest.isPending ? "Bezig met verwijderen…" : "Ja, verwijderen"}
              </button>
              <button className="btn btn-ghost btn-block" onClick={() => setConfirmDelete(false)}>
                Annuleren
              </button>
            </div>
          ) : (
            <button className="btn btn-ghost btn-block" onClick={() => setConfirmDelete(true)}>
              Verwijderen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useRequest, useUpdateRequest, useDeleteRequest } from "@/lib/queries";
import { RequestForm } from "@/components/RequestForm";
import { StatusBadge } from "@/components/StatusBadge";
import { formatAmount, formatDate } from "@/lib/format";
import { usePageTitle } from "@/lib/usePageTitle";

export const aanvraagDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/aanvragen/$id",
  component: AanvraagDetailPage,
});

function AanvraagDetailPage() {
  const { id } = aanvraagDetailRoute.useParams();
  const navigate = useNavigate();
  const { data: request, isLoading } = useRequest(id);
  const updateRequest = useUpdateRequest(id);
  const deleteRequest = useDeleteRequest();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  usePageTitle(request?.name ?? "Aanvraag");

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

  if (isEditing) {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Aanvraag bewerken</h1>
        </div>
        <div className="card card-padded" style={{ maxWidth: 560 }}>
          <RequestForm
            initial={request}
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
      <div className="page-header">
        <div>
          <h1 className="page-title">{request.name}</h1>
          <p className="page-subtitle">
            Aangemaakt op {formatDate(request.created_at)}
          </p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="detail-grid">
        <div className="card card-padded">
          <div className="detail-section-label">Waarvoor</div>
          <div className="detail-section-body">{request.purpose}</div>

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

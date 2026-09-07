import { createRoute, Link } from "@tanstack/react-router";
import { begeleiderRoute } from "./_begeleider";
import { useBegeleiderDossierDetail, useBegeleiderDossierAanvragen } from "@/lib/begeleiderQueries";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { formatAmount, formatDate } from "@/lib/format";
import { usePageTitle } from "@/lib/usePageTitle";

export const begeleiderDossierDetailRoute = createRoute({
  getParentRoute: () => begeleiderRoute,
  path: "/begeleider/dossiers/$id",
  component: BegeleiderDossierDetailPage,
});

function BegeleiderDossierDetailPage() {
  const { id } = begeleiderDossierDetailRoute.useParams();
  const { data: dossier, isLoading } = useBegeleiderDossierDetail(id);
  const { data: aanvragen, isLoading: aanvragenLoading } = useBegeleiderDossierAanvragen(id);
  usePageTitle(dossier?.dossier_titel ?? "Dossier");

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
          <p>Dit dossier bestaat niet (meer), of is niet aan jou toegewezen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/begeleider">Mijn dossiers</Link>
        <span>/</span>
        <span>{dossier.klant_naam}</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">{dossier.klant_naam}</h1>
          <p className="page-subtitle">{dossier.dossier_titel}</p>
        </div>
        <StatusBadge status={dossier.dossier_status} />
      </div>

      <div className="card">
        <div className="card-padded">
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Aanvragen</h2>
        </div>
        {aanvragenLoading ? (
          <div className="empty-state">Laden…</div>
        ) : (aanvragen ?? []).length === 0 ? (
          <EmptyState
            title="Nog geen aanvragen"
            description="Er zijn nog geen aanvragen geregistreerd in dit dossier."
          />
        ) : (
          aanvragen?.map((a) => (
            <div
              key={a.aanvraag_id}
              className="request-row"
              style={{ gridTemplateColumns: "1fr 1fr 1fr auto" }}
            >
              <div className="list-row-secondary">{formatDate(a.aangemaakt)}</div>
              <div className="amount">
                <span className="amount-label">Gevraagd</span>
                {formatAmount(a.requested_amount)}
              </div>
              <div className="amount">
                <span className="amount-label">Toegekend</span>
                {formatAmount(a.granted_amount)}
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

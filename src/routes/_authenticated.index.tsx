import { createRoute, Link } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useRequestsWithContext, computeStats } from "@/lib/queries";
import { StatTile } from "@/components/StatTile";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { formatAmount, formatDate } from "@/lib/format";
import { usePageTitle } from "@/lib/usePageTitle";

export const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/",
  component: DashboardPage,
});

function DashboardPage() {
  usePageTitle("Dashboard");
  const { data: requests, isLoading } = useRequestsWithContext();
  const stats = computeStats(requests ?? []);
  const recent = (requests ?? []).slice(0, 6);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overzicht van alle binnengekomen aanvragen</p>
        </div>
        <Link to="/aanvragen/nieuw" className="btn btn-primary">
          + Nieuwe aanvraag
        </Link>
      </div>

      <div className="stat-grid">
        <StatTile label="Open aanvragen" value={String(stats.openCount)} accent />
        <StatTile label="Afgehandeld" value={String(stats.handledCount)} />
        <StatTile label="Totaal gevraagd" value={formatAmount(stats.totalRequested)} />
        <StatTile label="Totaal toegekend" value={formatAmount(stats.totalGranted)} />
      </div>

      <div className="card">
        <div className="card-padded flex-between">
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Recentste aanvragen</h2>
          <Link to="/aanvragen" className="text-secondary">
            Alles bekijken →
          </Link>
        </div>
        {isLoading ? (
          <div className="empty-state">Laden…</div>
        ) : recent.length === 0 ? (
          <EmptyState
            title="Nog geen aanvragen"
            description="Nieuwe aanvragen die binnenkomen verschijnen hier."
          />
        ) : (
          recent.map((r) => (
            <Link
              key={r.id}
              to="/aanvragen/$id"
              params={{ id: r.id }}
              className="request-row card-interactive"
            >
              <div>
                <div className="request-name">{r.klantNaam ?? "Onbekende klant"}</div>
                <div className="request-purpose">{r.dossierTitel ?? "Geen dossier"}</div>
              </div>
              <div className="text-secondary">{formatDate(r.created_at)}</div>
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

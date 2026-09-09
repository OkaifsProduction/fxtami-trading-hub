import { createRoute, Link } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useRequestsWithContext, computeStats } from "@/lib/queries";
import { StatTile } from "@/components/StatTile";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { formatAmount, formatDate } from "@/lib/format";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLocale } from "@/lib/i18n";

export const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/",
  component: DashboardPage,
});

function DashboardPage() {
  const { t } = useLocale();
  usePageTitle(t("dashboard.title"));
  const { data: requests, isLoading } = useRequestsWithContext();
  const stats = computeStats(requests ?? []);
  const recent = (requests ?? []).slice(0, 6);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("dashboard.title")}</h1>
          <p className="page-subtitle">{t("dashboard.subtitle")}</p>
        </div>
        <Link to="/aanvragen/nieuw" className="btn btn-primary">
          <span className="btn-icon">+</span> {t("common.nieuweAanvraag")}
        </Link>
      </div>

      <div className="stat-grid">
        <StatTile
          label={t("dashboard.openAanvragen")}
          value={String(stats.openCount)}
          accent
          to="/aanvragen"
          search={{ status: "actief" }}
        />
        <StatTile label={t("dashboard.afgehandeld")} value={String(stats.handledCount)} />
      </div>

      <div className="card">
        <div className="card-padded flex-between">
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>{t("dashboard.recentsteAanvragen")}</h2>
          <Link to="/aanvragen" className="text-secondary">
            {t("dashboard.allesBekijken")}
          </Link>
        </div>
        {isLoading ? (
          <div className="empty-state">{t("common.laden")}</div>
        ) : recent.length === 0 ? (
          <EmptyState
            title={t("dashboard.geenAanvragenTitel")}
            description={t("dashboard.geenAanvragenBeschrijving")}
          />
        ) : (
          recent.map((r) => (
            <Link
              key={r.id}
              to="/aanvragen/$id"
              params={{ id: r.id }}
              className="request-row dashboard-row card-interactive"
            >
              <div>
                <div className="request-name">{r.klantNaam ?? "—"}</div>
                <div className="request-purpose">{r.dossierTitel ?? t("dashboard.geenDossier")}</div>
              </div>
              <div className="text-secondary">{formatDate(r.created_at)}</div>
              <div className="amount">
                <span className="amount-label">{t("aanvragen.gevraagd")}</span>
                {formatAmount(r.requested_amount)}
              </div>
              <div className="amount">
                <span className="amount-label">{t("aanvragen.toegekend")}</span>
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

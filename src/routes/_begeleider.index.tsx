import { createRoute, Link } from "@tanstack/react-router";
import { begeleiderRoute } from "./_begeleider";
import { useBegeleiderMijnDossiers } from "@/lib/begeleiderQueries";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { usePageTitle } from "@/lib/usePageTitle";

export const begeleiderDossiersListRoute = createRoute({
  getParentRoute: () => begeleiderRoute,
  path: "/begeleider",
  component: BegeleiderDossiersListPage,
});

function BegeleiderDossiersListPage() {
  usePageTitle("Mijn dossiers");
  const { data: dossiers, isLoading } = useBegeleiderMijnDossiers();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mijn dossiers</h1>
          <p className="page-subtitle">Dossiers die aan jou zijn toegewezen</p>
        </div>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="empty-state">Laden…</div>
        ) : (dossiers ?? []).length === 0 ? (
          <EmptyState
            title="Geen dossiers toegewezen"
            description="Zodra een dossier aan jou wordt toegewezen, verschijnt het hier."
          />
        ) : (
          dossiers?.map((d) => (
            <Link
              key={d.dossier_id}
              to="/begeleider/dossiers/$id"
              params={{ id: d.dossier_id }}
              className="list-row card-interactive"
              style={{ gridTemplateColumns: "2fr 1fr auto" }}
            >
              <div className="list-row-primary">{d.klant_naam}</div>
              <div className="list-row-secondary">{d.dossier_titel}</div>
              <StatusBadge status={d.dossier_status} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

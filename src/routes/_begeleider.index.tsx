import { createRoute, Link } from "@tanstack/react-router";
import { begeleiderRoute } from "./_begeleider";
import { useBegeleiderMijnDossiers } from "@/lib/begeleiderQueries";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLocale } from "@/lib/i18n";

export const begeleiderDossiersListRoute = createRoute({
  getParentRoute: () => begeleiderRoute,
  path: "/begeleider",
  component: BegeleiderDossiersListPage,
});

function BegeleiderDossiersListPage() {
  const { t } = useLocale();
  usePageTitle(t("nav.mijnDossiers"));
  const { data: dossiers, isLoading } = useBegeleiderMijnDossiers();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("nav.mijnDossiers")}</h1>
          <p className="page-subtitle">{t("begeleider.mijnDossiersSubtitle")}</p>
        </div>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="empty-state">{t("common.laden")}</div>
        ) : (dossiers ?? []).length === 0 ? (
          <EmptyState
            title={t("begeleider.geenDossiersTitel")}
            description={t("begeleider.geenDossiersBeschrijving")}
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

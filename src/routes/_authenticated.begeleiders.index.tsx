import { useMemo, useState } from "react";
import { createRoute, Link } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useBegeleidersOverzicht } from "@/lib/begeleidersBeheerQueries";
import { BegeleiderStatusBadge } from "@/components/BegeleiderStatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLocale } from "@/lib/i18n";

export const begeleidersListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/begeleiders",
  component: BegeleidersListPage,
});

function BegeleidersListPage() {
  const { t } = useLocale();
  usePageTitle(t("begeleiders.title"));
  const { data: rijen, isLoading } = useBegeleidersOverzicht();
  const [search, setSearch] = useState("");

  // De lijst komt al alfabetisch uit de query; hier enkel filteren, zodat de
  // volgorde niet per ongeluk omkeert.
  const gefilterd = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (term === "") return rijen ?? [];
    return (rijen ?? []).filter((r) =>
      `${r.organisatie ?? ""} ${r.naam} ${r.email ?? ""}`.toLowerCase().includes(term),
    );
  }, [rijen, search]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("begeleiders.title")}</h1>
          <p className="page-subtitle">
            {gefilterd.length} {t("aanvragen.van")} {rijen?.length ?? 0}
          </p>
        </div>
        <Link to="/begeleiders/nieuw" className="btn btn-primary">
          <span className="btn-icon">+</span> {t("begeleiders.nieuweBegeleider")}
        </Link>
      </div>

      <div className="list-toolbar">
        <input
          type="text"
          className="input"
          placeholder={t("begeleiders.zoekPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card">
        {isLoading ? (
          <div className="empty-state">{t("common.laden")}</div>
        ) : gefilterd.length === 0 ? (
          <EmptyState
            title={t("begeleiders.geenResultatenTitel")}
            description={t("begeleiders.geenResultatenBeschrijving")}
          />
        ) : (
          gefilterd.map((r) => (
            <Link
              key={r.key}
              to="/begeleiders/$id"
              params={{ id: r.id }}
              className="list-row card-interactive"
              style={{ gridTemplateColumns: "1.4fr 1.2fr 1.6fr 0.9fr auto" }}
            >
              <div className="list-row-primary">{r.organisatie || r.naam}</div>
              <div className="list-row-secondary">{r.organisatie ? r.naam : ""}</div>
              <div className="list-row-secondary">{r.email ?? ""}</div>
              <div className="list-row-secondary">
                {r.aantalDossiers}{" "}
                {r.aantalDossiers === 1 ? t("klanten.dossier") : t("klanten.dossiers")}
              </div>
              <BegeleiderStatusBadge status={r.status} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

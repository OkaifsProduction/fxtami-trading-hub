import { useMemo, useState } from "react";
import { createRoute, Link } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useKlantenWithDossierCount, type KlantWithDossierCount } from "@/lib/queries";
import { EmptyState } from "@/components/EmptyState";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLocale, type TranslationKey } from "@/lib/i18n";

export const klantenListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/klanten",
  component: KlantenListPage,
});

type SortOption = "naam" | "dossiers" | "nieuwste";

const BEWIND_TYPE_LABEL_KEYS: Record<string, TranslationKey> = {
  goederen: "klantForm.goederen",
  persoon: "klantForm.persoon",
  beide: "klantForm.goederenEnPersoon",
};

function sortKlanten(klanten: KlantWithDossierCount[], sort: SortOption) {
  const sorted = [...klanten];
  switch (sort) {
    case "dossiers":
      return sorted.sort((a, b) => b.dossierCount - a.dossierCount);
    case "nieuwste":
      return sorted.sort((a, b) => b.created_at.localeCompare(a.created_at));
    case "naam":
    default:
      return sorted.sort((a, b) => a.naam.localeCompare(b.naam));
  }
}

function KlantenListPage() {
  const { t } = useLocale();
  usePageTitle(t("klanten.title"));
  const { data: klanten, isLoading } = useKlantenWithDossierCount();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("naam");
  const [toonGearchiveerd, setToonGearchiveerd] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const base = (klanten ?? []).filter((k) => toonGearchiveerd || !k.gearchiveerd);
    const searched = term === "" ? base : base.filter((k) => k.naam.toLowerCase().includes(term));
    return sortKlanten(searched, sort);
  }, [klanten, search, sort, toonGearchiveerd]);

  const zichtbaarAantal = (klanten ?? []).filter((k) => toonGearchiveerd || !k.gearchiveerd).length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("klanten.title")}</h1>
          <p className="page-subtitle">
            {filtered.length} {t("aanvragen.van")} {zichtbaarAantal} {t("klanten.title").toLowerCase()}
          </p>
        </div>
        <Link to="/klanten/nieuw" className="btn btn-primary">
          <span className="btn-icon">+</span> {t("klanten.nieuweKlant")}
        </Link>
      </div>

      <div className="list-toolbar">
        <input
          type="text"
          className="input"
          placeholder={t("klanten.zoekPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select"
          style={{ maxWidth: 200 }}
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
        >
          <option value="naam">{t("klanten.sorteerNaam")}</option>
          <option value="dossiers">{t("klanten.sorteerDossiers")}</option>
          <option value="nieuwste">{t("klanten.sorteerNieuwste")}</option>
        </select>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={toonGearchiveerd}
            onChange={(e) => setToonGearchiveerd(e.target.checked)}
          />
          {t("klanten.toonGearchiveerd")}
        </label>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="empty-state">{t("common.laden")}</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={t("klanten.geenResultatenTitel")}
            description={t("klanten.geenResultatenBeschrijving")}
          />
        ) : (
          filtered.map((k) => (
            <Link
              key={k.id}
              to="/klanten/$id"
              params={{ id: k.id }}
              className="list-row card-interactive"
              style={{ gridTemplateColumns: "1.8fr 0.8fr 1fr 1.3fr 0.8fr" }}
            >
              <div className="list-row-primary">
                {k.naam}
                {k.gearchiveerd && (
                  <span className="badge badge-gearchiveerd">{t("klantDetail.gearchiveerd")}</span>
                )}
              </div>
              <div className="list-row-secondary">{k.rolnummer}</div>
              <div className="list-row-secondary">
                {k.bewind_type ? t(BEWIND_TYPE_LABEL_KEYS[k.bewind_type]) : ""}
              </div>
              <div className="list-row-secondary">{k.email || k.telefoon || ""}</div>
              <div className="list-row-secondary">
                {k.dossierCount} {k.dossierCount === 1 ? t("klanten.dossier") : t("klanten.dossiers")}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

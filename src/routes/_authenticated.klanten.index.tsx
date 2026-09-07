import { useMemo, useState } from "react";
import { createRoute, Link } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useKlantenWithDossierCount, type KlantWithDossierCount } from "@/lib/queries";
import { EmptyState } from "@/components/EmptyState";
import { usePageTitle } from "@/lib/usePageTitle";

export const klantenListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/klanten",
  component: KlantenListPage,
});

type SortOption = "naam" | "dossiers" | "nieuwste";

const KLANT_TYPE_LABELS: Record<string, string> = {
  natuurlijk_persoon: "Natuurlijk persoon",
  rechtspersoon: "Rechtspersoon",
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
  usePageTitle("Klanten");
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
          <h1 className="page-title">Klanten</h1>
          <p className="page-subtitle">
            {filtered.length} van {zichtbaarAantal} klanten
          </p>
        </div>
        <Link to="/klanten/nieuw" className="btn btn-primary">
          + Nieuwe klant
        </Link>
      </div>

      <div className="list-toolbar">
        <input
          type="text"
          className="input"
          placeholder="Zoek op naam…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select"
          style={{ maxWidth: 200 }}
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
        >
          <option value="naam">Sorteer: naam</option>
          <option value="dossiers">Sorteer: aantal dossiers</option>
          <option value="nieuwste">Sorteer: nieuwste eerst</option>
        </select>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={toonGearchiveerd}
            onChange={(e) => setToonGearchiveerd(e.target.checked)}
          />
          Toon gearchiveerde klanten
        </label>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="empty-state">Laden…</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Geen klanten gevonden"
            description="Voeg een nieuwe klant toe om te starten."
          />
        ) : (
          filtered.map((k) => (
            <Link
              key={k.id}
              to="/klanten/$id"
              params={{ id: k.id }}
              className="list-row card-interactive"
              style={{ gridTemplateColumns: "2fr 1.2fr 1.4fr 1fr" }}
            >
              <div className="list-row-primary">
                {k.naam}
                {k.gearchiveerd && <span className="badge badge-gearchiveerd">Gearchiveerd</span>}
              </div>
              <div className="list-row-secondary">
                {k.klant_type ? KLANT_TYPE_LABELS[k.klant_type] : "—"}
              </div>
              <div className="list-row-secondary">{k.email || k.telefoon || "—"}</div>
              <div className="list-row-secondary">
                {k.dossierCount} {k.dossierCount === 1 ? "dossier" : "dossiers"}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

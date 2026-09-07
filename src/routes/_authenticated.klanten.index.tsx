import { useMemo, useState } from "react";
import { createRoute, Link } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useKlantenWithDossierCount } from "@/lib/queries";
import { EmptyState } from "@/components/EmptyState";
import { usePageTitle } from "@/lib/usePageTitle";

export const klantenListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/klanten",
  component: KlantenListPage,
});

function KlantenListPage() {
  usePageTitle("Klanten");
  const { data: klanten, isLoading } = useKlantenWithDossierCount();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (term === "") return klanten ?? [];
    return (klanten ?? []).filter((k) => k.naam.toLowerCase().includes(term));
  }, [klanten, search]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Klanten</h1>
          <p className="page-subtitle">
            {filtered.length} van {klanten?.length ?? 0} klanten
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
              style={{ gridTemplateColumns: "2fr 1.4fr 1fr" }}
            >
              <div className="list-row-primary">{k.naam}</div>
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

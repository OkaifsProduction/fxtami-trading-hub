import { useMemo, useState } from "react";
import { createRoute, Link } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useRequestsWithContext } from "@/lib/queries";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { formatAmount } from "@/lib/format";
import { usePageTitle } from "@/lib/usePageTitle";
import type { RequestStatus } from "@/lib/database.types";

export const aanvragenListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/aanvragen",
  component: AanvragenListPage,
});

type StatusFilter = "alle" | RequestStatus;

function AanvragenListPage() {
  usePageTitle("Aanvragen");
  const { data: requests, isLoading } = useRequestsWithContext();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("alle");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (requests ?? []).filter((r) => {
      const haystack = `${r.klantNaam ?? ""} ${r.dossierTitel ?? ""}`.toLowerCase();
      const matchesSearch = term === "" || haystack.includes(term);
      const matchesStatus = statusFilter === "alle" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Aanvragen</h1>
          <p className="page-subtitle">{filtered.length} van {requests?.length ?? 0} aanvragen</p>
        </div>
        <Link to="/aanvragen/nieuw" className="btn btn-primary">
          + Nieuwe aanvraag
        </Link>
      </div>

      <div className="list-toolbar">
        <input
          type="text"
          className="input"
          placeholder="Zoek op klant of dossier…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-group">
          {(["alle", "open", "afgehandeld"] as const).map((option) => (
            <button
              key={option}
              className={`filter-chip${statusFilter === option ? " active" : ""}`}
              onClick={() => setStatusFilter(option)}
            >
              {option === "alle" ? "Alle" : option === "open" ? "Open" : "Afgehandeld"}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="empty-state">Laden…</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Geen aanvragen gevonden"
            description="Pas je zoekopdracht of filter aan."
          />
        ) : (
          filtered.map((r) => (
            <Link
              key={r.id}
              to="/aanvragen/$id"
              params={{ id: r.id }}
              className="request-row card-interactive"
            >
              <div>
                <div className="request-name">{r.klantNaam ?? "Onbekende klant"}</div>
              </div>
              <div className="request-purpose">{r.dossierTitel ?? "Geen dossier"}</div>
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

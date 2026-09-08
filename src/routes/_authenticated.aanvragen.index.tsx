import { useMemo, useState } from "react";
import { createRoute, Link } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useKlantenMetAanvragen, type KlantAanvraagRow } from "@/lib/queries";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { formatAmount, formatDate } from "@/lib/format";
import { usePageTitle } from "@/lib/usePageTitle";
import type { AanvraagStatus } from "@/lib/database.types";

export const aanvragenListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/aanvragen",
  component: AanvragenListPage,
});

type StatusFilter = "alle" | AanvraagStatus | "nvt";
type SortOption = "nieuwste" | "oudste" | "klant" | "gevraagd" | "toegekend";

const STATUS_FILTER_LABELS: Record<StatusFilter, string> = {
  alle: "Alle statussen",
  open: "Open",
  in_behandeling: "In behandeling",
  goedgekeurd: "Goedgekeurd",
  geweigerd: "Geweigerd",
  afgehandeld: "Afgehandeld",
  nvt: "N.v.t.",
};

function sortRequests(rows: KlantAanvraagRow[], sort: SortOption) {
  const sorted = [...rows];
  switch (sort) {
    case "oudste":
      return sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case "klant":
      return sorted.sort((a, b) => a.klantNaam.localeCompare(b.klantNaam));
    case "gevraagd":
      return sorted.sort((a, b) => (b.requestedAmount ?? -1) - (a.requestedAmount ?? -1));
    case "toegekend":
      return sorted.sort((a, b) => (b.grantedAmount ?? -1) - (a.grantedAmount ?? -1));
    case "nieuwste":
    default:
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

function AanvragenListPage() {
  usePageTitle("Aanvragen");
  const { data: rows, isLoading } = useKlantenMetAanvragen();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("alle");
  const [sort, setSort] = useState<SortOption>("nieuwste");
  const [vanDatum, setVanDatum] = useState("");
  const [totDatum, setTotDatum] = useState("");
  const [minBedrag, setMinBedrag] = useState("");
  const [maxBedrag, setMaxBedrag] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const min = minBedrag.trim() === "" ? null : Number.parseFloat(minBedrag);
    const max = maxBedrag.trim() === "" ? null : Number.parseFloat(maxBedrag);

    const result = (rows ?? []).filter((r) => {
      const haystack = `${r.klantNaam} ${r.dossierTitel ?? ""}`.toLowerCase();
      const matchesSearch = term === "" || haystack.includes(term);
      const matchesStatus = statusFilter === "alle" || r.status === statusFilter;
      const datum = r.createdAt.slice(0, 10);
      const matchesVan = vanDatum === "" || datum >= vanDatum;
      const matchesTot = totDatum === "" || datum <= totDatum;
      const matchesMin = min === null || Number.isNaN(min) || r.requestedAmount === null || r.requestedAmount >= min;
      const matchesMax = max === null || Number.isNaN(max) || r.requestedAmount === null || r.requestedAmount <= max;
      return matchesSearch && matchesStatus && matchesVan && matchesTot && matchesMin && matchesMax;
    });

    return sortRequests(result, sort);
  }, [rows, search, statusFilter, sort, vanDatum, totDatum, minBedrag, maxBedrag]);

  return (
    <div className="page">
      <div className="print-header">
        <strong>Ami Legal</strong> — Aanvragenoverzicht — {formatDate(new Date().toISOString())}
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">Aanvragen</h1>
          <p className="page-subtitle">{filtered.length} van {rows?.length ?? 0} klanten</p>
        </div>
        <div className="flex-gap-12">
          <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
            Afdrukken
          </button>
          <Link to="/aanvragen/nieuw" className="btn btn-primary">
            <span className="btn-icon">+</span> Nieuwe aanvraag
          </Link>
        </div>
      </div>

      <div className="list-toolbar">
        <input
          type="text"
          className="input"
          placeholder="Zoek op klant of dossier…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select"
          style={{ maxWidth: 200 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          {(Object.keys(STATUS_FILTER_LABELS) as StatusFilter[]).map((option) => (
            <option key={option} value={option}>
              {STATUS_FILTER_LABELS[option]}
            </option>
          ))}
        </select>
        <select
          className="select"
          style={{ maxWidth: 200 }}
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
        >
          <option value="nieuwste">Sorteer: nieuwste eerst</option>
          <option value="oudste">Sorteer: oudste eerst</option>
          <option value="klant">Sorteer: klant</option>
          <option value="gevraagd">Sorteer: gevraagd bedrag</option>
          <option value="toegekend">Sorteer: toegekend bedrag</option>
        </select>
      </div>

      <div className="list-toolbar">
        <label className="field-inline">
          Van
          <input
            type="date"
            className="input"
            value={vanDatum}
            onChange={(e) => setVanDatum(e.target.value)}
          />
        </label>
        <label className="field-inline">
          Tot
          <input
            type="date"
            className="input"
            value={totDatum}
            onChange={(e) => setTotDatum(e.target.value)}
          />
        </label>
        <label className="field-inline">
          Min. gevraagd
          <input
            type="text"
            inputMode="decimal"
            className="input"
            style={{ maxWidth: 120 }}
            placeholder="0"
            value={minBedrag}
            onChange={(e) => setMinBedrag(e.target.value)}
          />
        </label>
        <label className="field-inline">
          Max. gevraagd
          <input
            type="text"
            inputMode="decimal"
            className="input"
            style={{ maxWidth: 120 }}
            placeholder="—"
            value={maxBedrag}
            onChange={(e) => setMaxBedrag(e.target.value)}
          />
        </label>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="empty-state">Laden…</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Geen aanvragen gevonden"
            description="Pas je zoekopdracht of filters aan."
          />
        ) : (
          filtered.map((r) =>
            r.requestId ? (
              <Link
                key={r.key}
                to="/aanvragen/$id"
                params={{ id: r.requestId }}
                className="request-row card-interactive"
              >
                <div>
                  <div className="request-name">{r.klantNaam}</div>
                </div>
                <div className="amount">
                  <span className="amount-label">Gevraagd</span>
                  {formatAmount(r.requestedAmount)}
                </div>
                <div className="amount">
                  <span className="amount-label">Toegekend</span>
                  {formatAmount(r.grantedAmount)}
                </div>
                <StatusBadge status={r.status} />
              </Link>
            ) : (
              <Link
                key={r.key}
                to="/klanten/$id"
                params={{ id: r.klantId }}
                className="request-row card-interactive"
              >
                <div>
                  <div className="request-name">{r.klantNaam}</div>
                </div>
                <div className="amount">
                  <span className="amount-label">Gevraagd</span>
                  {formatAmount(null)}
                </div>
                <div className="amount">
                  <span className="amount-label">Toegekend</span>
                  {formatAmount(null)}
                </div>
                <StatusBadge status={r.status} />
              </Link>
            ),
          )
        )}
      </div>
    </div>
  );
}

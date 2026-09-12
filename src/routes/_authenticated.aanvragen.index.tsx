import { useMemo, useState } from "react";
import { createRoute, Link } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useKlantenMetAanvragen, type KlantAanvraagRow } from "@/lib/queries";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { PrintIcon } from "@/components/PrintIcon";
import { formatAmount, formatDate } from "@/lib/format";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLocale, type TranslationKey } from "@/lib/i18n";
import type { AanvraagStatus } from "@/lib/database.types";

type StatusFilter = "alle" | "actief" | AanvraagStatus | "nvt";

export const aanvragenListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/aanvragen",
  validateSearch: (search: Record<string, unknown>): { status?: StatusFilter } => ({
    status:
      typeof search.status === "string" && search.status in STATUS_FILTER_LABEL_KEYS
        ? (search.status as StatusFilter)
        : undefined,
  }),
  component: AanvragenListPage,
});

type SortOption = "nieuwste" | "oudste" | "klant" | "gevraagd" | "toegekend";

// "actief" = nog niet afgerond (open of in behandeling) — dezelfde groep als
// de "Open aanvragen"-tegel op het dashboard, vandaar rechtstreeks vanuit
// die tegel naar deze lijst met dit filter voorgeselecteerd.
const ACTIEVE_STATUSSEN: AanvraagStatus[] = ["open", "in_behandeling"];

const STATUS_FILTER_LABEL_KEYS: Record<StatusFilter, TranslationKey> = {
  alle: "aanvragen.alleStatussen",
  actief: "aanvragen.statusActief",
  open: "status.open",
  in_behandeling: "status.inBehandeling",
  goedgekeurd: "status.goedgekeurd",
  geweigerd: "status.geweigerd",
  afgehandeld: "status.afgehandeld",
  nvt: "status.nvt",
};

function sortRequests(rows: KlantAanvraagRow[], sort: SortOption) {
  const sorted = [...rows];
  switch (sort) {
    case "oudste":
      return sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case "nieuwste":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "gevraagd":
      return sorted.sort((a, b) => (b.requestedAmount ?? -1) - (a.requestedAmount ?? -1));
    case "toegekend":
      return sorted.sort((a, b) => (b.grantedAmount ?? -1) - (a.grantedAmount ?? -1));
    case "klant":
    default:
      return sorted.sort((a, b) => a.klantNaam.localeCompare(b.klantNaam));
  }
}

function AanvragenListPage() {
  const { t } = useLocale();
  usePageTitle(t("aanvragen.title"));
  const routeSearch = aanvragenListRoute.useSearch();
  const { data: rows, isLoading } = useKlantenMetAanvragen();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(routeSearch.status ?? "alle");
  const [sort, setSort] = useState<SortOption>("klant");
  const [vanDatum, setVanDatum] = useState("");
  const [totDatum, setTotDatum] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const result = (rows ?? []).filter((r) => {
      const haystack = `${r.klantNaam} ${r.dossierTitel ?? ""}`.toLowerCase();
      const matchesSearch = term === "" || haystack.includes(term);
      const matchesStatus =
        statusFilter === "alle" ||
        (statusFilter === "actief"
          ? ACTIEVE_STATUSSEN.includes(r.status as AanvraagStatus)
          : r.status === statusFilter);
      const datum = r.createdAt.slice(0, 10);
      const matchesVan = vanDatum === "" || datum >= vanDatum;
      const matchesTot = totDatum === "" || datum <= totDatum;
      return matchesSearch && matchesStatus && matchesVan && matchesTot;
    });

    return sortRequests(result, sort);
  }, [rows, search, statusFilter, sort, vanDatum, totDatum]);

  return (
    <div className="page">
      <div className="print-header">
        <strong>Ami Legal</strong> — {t("aanvragen.aanvragenoverzicht")} — {formatDate(new Date().toISOString())}
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">{t("aanvragen.title")}</h1>
          <p className="page-subtitle">
            {filtered.length} {t("aanvragen.van")} {rows?.length ?? 0} {t("aanvragen.klanten")}
          </p>
        </div>
        <div className="flex-gap-12">
          <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
            <PrintIcon /> {t("common.afdrukken")}
          </button>
          <Link to="/aanvragen/nieuw" className="btn btn-primary">
            <span className="btn-icon">+</span> {t("common.nieuweAanvraag")}
          </Link>
        </div>
      </div>

      <div className="list-toolbar">
        <input
          type="text"
          className="input"
          placeholder={t("aanvragen.zoekPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select"
          style={{ maxWidth: 200 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          {(Object.keys(STATUS_FILTER_LABEL_KEYS) as StatusFilter[]).map((option) => (
            <option key={option} value={option}>
              {t(STATUS_FILTER_LABEL_KEYS[option])}
            </option>
          ))}
        </select>
        <select
          className="select"
          style={{ maxWidth: 200 }}
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
        >
          <option value="klant">{t("aanvragen.sorteerKlant")}</option>
          <option value="nieuwste">{t("aanvragen.sorteerNieuwste")}</option>
          <option value="oudste">{t("aanvragen.sorteerOudste")}</option>
          <option value="gevraagd">{t("aanvragen.sorteerGevraagd")}</option>
          <option value="toegekend">{t("aanvragen.sorteerToegekend")}</option>
        </select>
      </div>

      <div className="list-toolbar">
        <label className="field-inline">
          {t("aanvragen.vanDatum")}
          <input
            type="date"
            className="input"
            value={vanDatum}
            onChange={(e) => setVanDatum(e.target.value)}
          />
        </label>
        <label className="field-inline">
          {t("aanvragen.totDatum")}
          <input
            type="date"
            className="input"
            value={totDatum}
            onChange={(e) => setTotDatum(e.target.value)}
          />
        </label>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="empty-state">{t("common.laden")}</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={t("aanvragen.geenResultatenTitel")}
            description={t("aanvragen.geenResultatenBeschrijving")}
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
                  <span className="amount-label">{t("aanvragen.gevraagd")}</span>
                  {formatAmount(r.requestedAmount)}
                </div>
                <div className="amount">
                  <span className="amount-label">{t("aanvragen.toegekend")}</span>
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
                  <span className="amount-label">{t("aanvragen.gevraagd")}</span>
                  {formatAmount(null)}
                </div>
                <div className="amount">
                  <span className="amount-label">{t("aanvragen.toegekend")}</span>
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

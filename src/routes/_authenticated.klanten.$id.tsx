import { useState } from "react";
import { createRoute, Link } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useKlant, useUpdateKlant, useSetKlantArchived, useDossiersByKlant } from "@/lib/queries";
import { KlantForm } from "@/components/KlantForm";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { formatDate } from "@/lib/format";
import { usePageTitle } from "@/lib/usePageTitle";

export const klantDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/klanten/$id",
  component: KlantDetailPage,
});

function KlantDetailPage() {
  const { id } = klantDetailRoute.useParams();
  const { data: klant, isLoading } = useKlant(id);
  const { data: dossiers, isLoading: dossiersLoading } = useDossiersByKlant(id);
  const updateKlant = useUpdateKlant(id);
  const setArchived = useSetKlantArchived(id);
  const [isEditing, setIsEditing] = useState(false);
  usePageTitle(klant?.naam ?? "Klant");

  if (isLoading) {
    return (
      <div className="page">
        <div className="empty-state">Laden…</div>
      </div>
    );
  }

  if (!klant) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-title">Klant niet gevonden</div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Klant bewerken</h1>
        </div>
        <div className="card card-padded" style={{ maxWidth: 560 }}>
          <KlantForm
            initial={klant}
            submitLabel="Wijzigingen opslaan"
            submitting={updateKlant.isPending}
            onCancel={() => setIsEditing(false)}
            onSubmit={(values) => {
              updateKlant.mutate(values, { onSuccess: () => setIsEditing(false) });
            }}
          />
          {updateKlant.isError && (
            <div className="form-error mt-24">Opslaan mislukt. Probeer het opnieuw.</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/klanten">Klanten</Link>
        <span>/</span>
        <span>{klant.naam}</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">
            {klant.naam}
            {klant.gearchiveerd && <span className="badge badge-gearchiveerd">Gearchiveerd</span>}
          </h1>
          <p className="page-subtitle">Klant sinds {formatDate(klant.created_at)}</p>
        </div>
        <div className="flex-between" style={{ gap: 12 }}>
          <button
            className="btn btn-ghost"
            disabled={setArchived.isPending}
            onClick={() => setArchived.mutate(!klant.gearchiveerd)}
          >
            {klant.gearchiveerd ? "Heractiveren" : "Archiveren"}
          </button>
          <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
            Bewerken
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="card card-padded">
          <div className="detail-section-label">Klantgegevens</div>
          <div className="detail-section-body">
            {klant.klant_type === "rechtspersoon"
              ? "Rechtspersoon"
              : klant.klant_type === "natuurlijk_persoon"
                ? "Natuurlijk persoon"
                : "Type onbekend"}
            {klant.identificatienummer && ` · ${klant.identificatienummer}`}
          </div>

          <div className="detail-section">
            <div className="detail-section-label">Contactgegevens</div>
            <div className="detail-section-body">
              {klant.email || "—"}
              <br />
              {klant.telefoon || "—"}
              <br />
              {klant.adres || "—"}
            </div>
          </div>

          {klant.extra_info && (
            <div className="detail-section">
              <div className="detail-section-label">Extra informatie</div>
              <div className="detail-section-body">{klant.extra_info}</div>
            </div>
          )}
        </div>

        <div className="card card-padded">
          <div className="detail-section-label">Dossiers</div>
          <p className="text-secondary" style={{ fontSize: 13, marginTop: 4 }}>
            {dossiers?.length ?? 0} dossier{(dossiers?.length ?? 0) === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="card mt-24">
        <div className="card-padded flex-between">
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Dossiers</h2>
          <Link to="/klanten/$id/dossiers/nieuw" params={{ id: klant.id }} className="btn btn-primary btn-sm">
            + Nieuw dossier
          </Link>
        </div>
        {dossiersLoading ? (
          <div className="empty-state">Laden…</div>
        ) : (dossiers ?? []).length === 0 ? (
          <EmptyState
            title="Nog geen dossiers"
            description="Maak een dossier aan om aanvragen voor deze klant te registreren."
          />
        ) : (
          dossiers?.map((d) => (
            <Link
              key={d.id}
              to="/dossiers/$id"
              params={{ id: d.id }}
              className="list-row card-interactive"
              style={{ gridTemplateColumns: "2fr 1fr auto" }}
            >
              <div className="list-row-primary">{d.titel}</div>
              <div className="list-row-secondary">{formatDate(d.created_at)}</div>
              <StatusBadge status={d.status} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

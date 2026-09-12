import { useState } from "react";
import { createRoute, Link } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import {
  useDossier,
  useUpdateDossier,
  useSetDossierStatus,
  useKlant,
  useRequestsByDossier,
} from "@/lib/queries";
import { DossierForm } from "@/components/DossierForm";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { formatAmount, formatDate } from "@/lib/format";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLocale } from "@/lib/i18n";

export const dossierDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/dossiers/$id",
  component: DossierDetailPage,
});

function DossierDetailPage() {
  const { t } = useLocale();
  const { id } = dossierDetailRoute.useParams();
  const { data: dossier, isLoading } = useDossier(id);
  const { data: klant } = useKlant(dossier?.klant_id ?? "");
  const { data: requests, isLoading: requestsLoading } = useRequestsByDossier(id);
  const updateDossier = useUpdateDossier(id);
  const setDossierStatus = useSetDossierStatus(id);
  const [isEditing, setIsEditing] = useState(false);
  usePageTitle(dossier?.titel ?? t("dossierDetail.nietGevondenTitel"));

  if (isLoading) {
    return (
      <div className="page">
        <div className="empty-state">{t("common.laden")}</div>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-title">{t("dossierDetail.nietGevondenTitel")}</div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">{t("dossierDetail.wijzigenTitel")}</h1>
        </div>
        <div className="card card-padded" style={{ maxWidth: 560 }}>
          <DossierForm
            initial={dossier}
            submitLabel={t("aanvraagDetail.wijzigingenOpslaan")}
            submitting={updateDossier.isPending}
            onCancel={() => setIsEditing(false)}
            onSubmit={(values) => {
              updateDossier.mutate(values, { onSuccess: () => setIsEditing(false) });
            }}
          />
          {updateDossier.isError && (
            <div className="form-error mt-24">{t("common.opslaanMislukt")}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/klanten">{t("klanten.title")}</Link>
        <span>/</span>
        {klant ? (
          <Link to="/klanten/$id" params={{ id: klant.id }}>
            {klant.naam}
          </Link>
        ) : (
          <span>…</span>
        )}
        <span>/</span>
        <span>{dossier.titel}</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">{dossier.titel}</h1>
          <p className="page-subtitle">
            {t("dossierDetail.aangemaaktOp")} {formatDate(dossier.created_at)}
          </p>
        </div>
        <div className="flex-between" style={{ gap: 12 }}>
          <StatusBadge status={dossier.status} />
          <button
            className="btn btn-ghost"
            disabled={setDossierStatus.isPending}
            onClick={() =>
              setDossierStatus.mutate(dossier.status === "open" ? "gesloten" : "open")
            }
          >
            {dossier.status === "open" ? t("dossierDetail.sluiten") : t("dossierDetail.heropenen")}
          </button>
          <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
            {t("common.bewerken")}
          </button>
        </div>
      </div>

      {dossier.omschrijving && (
        <div className="card card-padded" style={{ marginBottom: 24 }}>
          <div className="detail-section-label">{t("dossierDetail.omschrijving")}</div>
          <div className="detail-section-body">{dossier.omschrijving}</div>
        </div>
      )}

      <div className="card">
        <div className="card-padded flex-between">
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>{t("dossierDetail.aanvragen")}</h2>
          <Link
            to="/dossiers/$id/aanvragen/nieuw"
            params={{ id: dossier.id }}
            className="btn btn-primary btn-sm"
          >
            <span className="btn-icon">+</span> {t("dossierDetail.nieuweAanvraag")}
          </Link>
        </div>
        {requestsLoading ? (
          <div className="empty-state">{t("common.laden")}</div>
        ) : (requests ?? []).length === 0 ? (
          <EmptyState
            title={t("dossierDetail.geenAanvragenTitel")}
            description={t("dossierDetail.geenAanvragenBeschrijving")}
          />
        ) : (
          requests?.map((r) => (
            <Link
              key={r.id}
              to="/aanvragen/$id"
              params={{ id: r.id }}
              className="list-row card-interactive"
              style={{ gridTemplateColumns: "1fr 1fr 1fr auto" }}
            >
              <div className="list-row-secondary">{formatDate(r.created_at)}</div>
              <div className="amount">
                <span className="amount-label">{t("aanvragen.gevraagd")}</span>
                {formatAmount(r.requested_amount)}
              </div>
              <div className="amount">
                <span className="amount-label">{t("aanvragen.toegekend")}</span>
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

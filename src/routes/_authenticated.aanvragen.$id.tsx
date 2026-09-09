import { useState } from "react";
import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import {
  useRequest,
  useUpdateRequest,
  useSetRequestStatus,
  useDeleteRequest,
  useDossier,
  useKlant,
  useDossierOptions,
  useAanvragenByKlant,
} from "@/lib/queries";
import { RequestForm } from "@/components/RequestForm";
import { StatusBadge } from "@/components/StatusBadge";
import { PrintIcon } from "@/components/PrintIcon";
import { formatAmount, formatDate } from "@/lib/format";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLocale, type TranslationKey } from "@/lib/i18n";
import type { AanvraagStatus } from "@/lib/database.types";

const STATUS_OPTIONS: { value: AanvraagStatus; labelKey: TranslationKey }[] = [
  { value: "open", labelKey: "status.open" },
  { value: "in_behandeling", labelKey: "status.inBehandeling" },
  { value: "goedgekeurd", labelKey: "status.goedgekeurd" },
  { value: "geweigerd", labelKey: "status.geweigerd" },
  { value: "afgehandeld", labelKey: "status.afgehandeld" },
];

const BEVESTIGING_VEREIST: AanvraagStatus[] = ["geweigerd", "afgehandeld"];

export const aanvraagDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/aanvragen/$id",
  component: AanvraagDetailPage,
});

function AanvraagDetailPage() {
  const { t } = useLocale();
  const { id } = aanvraagDetailRoute.useParams();
  const navigate = useNavigate();
  const { data: request, isLoading } = useRequest(id);
  const { data: dossier } = useDossier(request?.dossier_id ?? "");
  const { data: klant } = useKlant(dossier?.klant_id ?? "");
  const { data: dossierOptions } = useDossierOptions();
  const { data: klantAanvragen } = useAanvragenByKlant(klant?.id ?? "");
  const overigeAanvragen = (klantAanvragen ?? []).filter((r) => r.id !== id);
  const updateRequest = useUpdateRequest(id);
  const setRequestStatus = useSetRequestStatus(id);
  const deleteRequest = useDeleteRequest();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<AanvraagStatus | null>(null);
  usePageTitle(klant?.naam ?? request?.name ?? t("aanvraagDetail.nietGevondenTitel"));

  function handleStatusChange(next: AanvraagStatus) {
    if (!request || next === request.status) return;
    if (BEVESTIGING_VEREIST.includes(next)) {
      setPendingStatus(next);
    } else {
      setRequestStatus.mutate(next);
    }
  }

  if (isLoading) {
    return (
      <div className="page">
        <div className="empty-state">{t("common.laden")}</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-title">{t("aanvraagDetail.nietGevondenTitel")}</div>
        </div>
      </div>
    );
  }

  const displayName = klant?.naam ?? request.name ?? t("aanvraagDetail.onbekendeKlant");
  const displayPurpose = dossier?.titel ?? request.purpose ?? t("aanvraagDetail.geenDossierGekoppeld");

  if (isEditing) {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">{t("aanvraagDetail.wijzigenTitel")}</h1>
        </div>
        <div className="card card-padded" style={{ maxWidth: 560 }}>
          <RequestForm
            initial={request}
            dossierOptions={dossierOptions}
            submitLabel={t("aanvraagDetail.wijzigingenOpslaan")}
            submitting={updateRequest.isPending}
            onCancel={() => setIsEditing(false)}
            onSubmit={(values) => {
              updateRequest.mutate(values, {
                onSuccess: () => setIsEditing(false),
              });
            }}
          />
          {updateRequest.isError && (
            <div className="form-error mt-24">{t("common.opslaanMislukt")}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="print-header">
        <strong>Ami Legal</strong> — {displayName} — {formatDate(new Date().toISOString())}
      </div>

      <div className="breadcrumb">
        <Link to="/klanten">{t("klanten.title")}</Link>
        <span>/</span>
        {klant ? (
          <Link to="/klanten/$id" params={{ id: klant.id }}>
            {klant.naam}
          </Link>
        ) : (
          <span>{displayName}</span>
        )}
        <span>/</span>
        {dossier ? (
          <Link to="/dossiers/$id" params={{ id: dossier.id }}>
            {dossier.titel}
          </Link>
        ) : (
          <span>{displayPurpose}</span>
        )}
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">{displayName}</h1>
          <p className="page-subtitle">
            {t("aanvraagDetail.aangemaaktOp")} {formatDate(request.created_at)}
          </p>
        </div>
        <div className="flex-gap-12">
          <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
            <PrintIcon /> {t("common.afdrukken")}
          </button>
          <StatusBadge status={request.status} />
        </div>
      </div>

      <div className="detail-grid">
        <div className="card card-padded">
          <div className="detail-section-label">{t("aanvraagDetail.dossier")}</div>
          <div className="detail-section-body">{displayPurpose}</div>

          <div className="detail-amounts">
            <div>
              <span className="amount-label">{t("aanvraagDetail.gevraagdBedrag")}</span>
              <div className="stat-value">{formatAmount(request.requested_amount)}</div>
            </div>
            <div>
              <span className="amount-label">{t("aanvraagDetail.toegekendBedrag")}</span>
              <div className="stat-value accent">{formatAmount(request.granted_amount)}</div>
            </div>
          </div>

          {request.extra_info && (
            <div className="detail-section">
              <div className="detail-section-label">{t("aanvraagDetail.extraInformatie")}</div>
              <div className="detail-section-body">{request.extra_info}</div>
            </div>
          )}
        </div>

        <div className="card card-padded stack no-print">
          <div>
            <div className="field-label" style={{ marginBottom: 8 }}>
              {t("aanvraagDetail.statusWijzigen")}
            </div>
            <select
              className="select"
              value={pendingStatus ?? request.status}
              onChange={(e) => handleStatusChange(e.target.value as AanvraagStatus)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </option>
              ))}
            </select>
          </div>

          {pendingStatus && (
            <div className="stack">
              <p className="text-secondary" style={{ fontSize: 13 }}>
                {t("aanvraagDetail.bevestigVraag")} "
                {t(STATUS_OPTIONS.find((o) => o.value === pendingStatus)?.labelKey ?? "status.nvt")}"{" "}
                {t("aanvraagDetail.wilMarkeren")}
              </p>
              <button
                className="btn btn-primary btn-block"
                disabled={setRequestStatus.isPending}
                onClick={() => {
                  setRequestStatus.mutate(pendingStatus, {
                    onSuccess: () => setPendingStatus(null),
                  });
                }}
              >
                {setRequestStatus.isPending ? t("common.bezigMetOpslaan") : t("common.jaBevestigen")}
              </button>
              <button className="btn btn-ghost btn-block" onClick={() => setPendingStatus(null)}>
                {t("common.annuleren")}
              </button>
            </div>
          )}
          {setRequestStatus.isError && !pendingStatus && (
            <div className="form-error">{t("common.opslaanMislukt")}</div>
          )}

          <button className="btn btn-secondary btn-block" onClick={() => setIsEditing(true)}>
            {t("common.bewerken")}
          </button>
          {confirmDelete ? (
            <div className="stack">
              <p className="text-secondary" style={{ fontSize: 13 }}>
                {t("aanvraagDetail.bevestigVerwijderen")}
              </p>
              <button
                className="btn btn-danger btn-block"
                disabled={deleteRequest.isPending}
                onClick={() => {
                  deleteRequest.mutate(id, {
                    onSuccess: () => navigate({ to: "/aanvragen" }),
                  });
                }}
              >
                {deleteRequest.isPending ? t("common.verwijderen") : t("common.jaVerwijderen")}
              </button>
              <button className="btn btn-ghost btn-block" onClick={() => setConfirmDelete(false)}>
                {t("common.annuleren")}
              </button>
            </div>
          ) : (
            <button className="btn btn-ghost btn-block" onClick={() => setConfirmDelete(true)}>
              {t("aanvraagDetail.verwijderenTitel")}
            </button>
          )}
        </div>
      </div>

      {overigeAanvragen.length > 0 && (
        <div className="card mt-24">
          <div className="card-padded">
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>
              {t("aanvraagDetail.overigeAanvragenVan")} {displayName}
            </h2>
          </div>
          {overigeAanvragen.map((r) => (
            <Link
              key={r.id}
              to="/aanvragen/$id"
              params={{ id: r.id }}
              className="request-row card-interactive"
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
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { createRoute, Link } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useKlant, useUpdateKlant, useSetKlantArchived, useDossiersByKlant } from "@/lib/queries";
import { KlantForm } from "@/components/KlantForm";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { formatDate } from "@/lib/format";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLocale } from "@/lib/i18n";

export const klantDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/klanten/$id",
  component: KlantDetailPage,
});

function KlantDetailPage() {
  const { t } = useLocale();
  const { id } = klantDetailRoute.useParams();
  const { data: klant, isLoading } = useKlant(id);
  const { data: dossiers, isLoading: dossiersLoading } = useDossiersByKlant(id);
  const updateKlant = useUpdateKlant(id);
  const setArchived = useSetKlantArchived(id);
  const [isEditing, setIsEditing] = useState(false);
  usePageTitle(klant?.naam ?? t("klanten.title"));

  if (isLoading) {
    return (
      <div className="page">
        <div className="empty-state">{t("common.laden")}</div>
      </div>
    );
  }

  if (!klant) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-title">{t("klantDetail.nietGevondenTitel")}</div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">{t("klantDetail.klantBewerken")}</h1>
        </div>
        <div className="card card-padded" style={{ maxWidth: 560 }}>
          <KlantForm
            initial={klant}
            submitLabel={t("common.opslaan")}
            submitting={updateKlant.isPending}
            onCancel={() => setIsEditing(false)}
            onSubmit={(values) => {
              updateKlant.mutate(values, { onSuccess: () => setIsEditing(false) });
            }}
          />
          {updateKlant.isError && (
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
        <span>{klant.naam}</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">
            {klant.naam}
            {klant.gearchiveerd && (
              <span className="badge badge-gearchiveerd">{t("klantDetail.gearchiveerd")}</span>
            )}
          </h1>
          <p className="page-subtitle">
            {t("klantDetail.inBewindSinds")} {formatDate(klant.created_at)}
          </p>
        </div>
        <div className="flex-between" style={{ gap: 12 }}>
          <button
            className="btn btn-ghost"
            disabled={setArchived.isPending}
            onClick={() => setArchived.mutate(!klant.gearchiveerd)}
          >
            {klant.gearchiveerd ? t("klantDetail.heractiveren") : t("klantDetail.archiveren")}
          </button>
          <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
            {t("common.bewerken")}
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="card card-padded">
          <div className="detail-section-label">{t("klantDetail.klantgegevens")}</div>
          <div className="detail-section-body">
            {klant.bewind_type === "beide"
              ? t("klantForm.goederenEnPersoon")
              : klant.bewind_type === "goederen"
                ? t("klantForm.goederen")
                : klant.bewind_type === "persoon"
                  ? t("klantForm.persoon")
                  : t("klantDetail.typeBewindOnbekend")}
          </div>

          <div className="detail-section">
            <div className="detail-section-label">{t("klantDetail.contactgegevens")}</div>
            <div className="detail-section-body">
              {klant.email && <div>{klant.email}</div>}
              {klant.adres && <div>{klant.adres}</div>}
            </div>
          </div>

          {(klant.vertrouwenspersoon_naam || klant.familieleden) && (
            <div className="detail-section">
              <div className="detail-section-label">{t("klantDetail.familieVertrouwenspersoon")}</div>
              <div className="detail-section-body">
                {klant.vertrouwenspersoon_naam && (
                  <>
                    {t("klantDetail.vertrouwenspersoon")}: {klant.vertrouwenspersoon_naam}
                    {klant.vertrouwenspersoon_telefoon &&
                      ` (${klant.vertrouwenspersoon_telefoon})`}
                    {klant.familieleden && <br />}
                  </>
                )}
                {klant.familieleden}
              </div>
            </div>
          )}

          {klant.extra_info && (
            <div className="detail-section">
              <div className="detail-section-label">{t("klantDetail.extraInformatie")}</div>
              <div className="detail-section-body">{klant.extra_info}</div>
            </div>
          )}
        </div>

        <div className="stack">
          <div className="card card-padded">
            <div className="detail-section-label">{t("klantDetail.identificatie")}</div>
            <div className="detail-section-body">
              {klant.rolnummer && <div>{t("klantDetail.rolnr")} {klant.rolnummer}</div>}
              {klant.geboortedatum && (
                <div>
                  {t("klantDetail.geboren")} {formatDate(klant.geboortedatum)}
                </div>
              )}
              {klant.telefoon && <div>{klant.telefoon}</div>}
              {klant.identificatienummer && <div>{klant.identificatienummer}</div>}
            </div>
          </div>

          <div className="card card-padded">
            <div className="detail-section-label">{t("klantDetail.dossiers")}</div>
            <p className="text-secondary" style={{ fontSize: 13, marginTop: 4 }}>
              {dossiers?.length ?? 0} {(dossiers?.length ?? 0) === 1 ? t("klanten.dossier") : t("klanten.dossiers")}
            </p>
          </div>
        </div>
      </div>

      <div className="card mt-24">
        <div className="card-padded flex-between">
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>{t("klantDetail.dossiers")}</h2>
          <Link to="/klanten/$id/dossiers/nieuw" params={{ id: klant.id }} className="btn btn-primary btn-sm">
            <span className="btn-icon">+</span> {t("klantDetail.nieuwDossier")}
          </Link>
        </div>
        {dossiersLoading ? (
          <div className="empty-state">{t("common.laden")}</div>
        ) : (dossiers ?? []).length === 0 ? (
          <EmptyState
            title={t("klantDetail.geenDossiersTitel")}
            description={t("klantDetail.geenDossiersBeschrijving")}
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

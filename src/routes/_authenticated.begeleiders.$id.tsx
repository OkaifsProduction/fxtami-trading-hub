import { useMemo, useState } from "react";
import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useDossierOptions } from "@/lib/queries";
import {
  afgeleideStatus,
  useBegeleiderProfiel,
  useBegeleiderToewijzingen,
  useIntrekkenToewijzing,
  useIntrekkenUitnodiging,
  useSetBegeleiderActief,
  useToewijzenDossier,
  useUitnodiging,
  useUitnodigingDossiers,
} from "@/lib/begeleidersBeheerQueries";
import { BegeleiderStatusBadge } from "@/components/BegeleiderStatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { formatDate } from "@/lib/format";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLocale } from "@/lib/i18n";

export const begeleiderDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/begeleiders/$id",
  component: BegeleiderDetailPage,
});

function BegeleiderDetailPage() {
  const { t } = useLocale();
  const { id } = begeleiderDetailRoute.useParams();
  const navigate = useNavigate();

  // De lijst linkt zowel bestaande profielen als openstaande uitnodigingen
  // naar deze route; welke van de twee het is, blijkt hier.
  const { data: profiel, isLoading: profielLoading } = useBegeleiderProfiel(id);
  const { data: uitnodiging, isLoading: uitnodigingLoading } = useUitnodiging(id);

  usePageTitle(profiel?.organisatie ?? profiel?.naam ?? t("begeleiders.title"));

  if (profielLoading || uitnodigingLoading) {
    return (
      <div className="page">
        <div className="empty-state">{t("common.laden")}</div>
      </div>
    );
  }

  if (profiel) return <ProfielWeergave profielId={profiel.id} />;
  if (uitnodiging) return <UitnodigingWeergave uitnodigingId={uitnodiging.id} />;

  return (
    <div className="page">
      <div className="empty-state">
        <div className="empty-state-title">{t("begeleiderDetail.nietGevondenTitel")}</div>
        <button className="btn btn-ghost mt-24" onClick={() => navigate({ to: "/begeleiders" })}>
          {t("begeleiders.title")}
        </button>
      </div>
    </div>
  );
}

function Kruimelpad({ naam }: { naam: string }) {
  const { t } = useLocale();
  return (
    <div className="breadcrumb">
      <Link to="/begeleiders">{t("begeleiders.title")}</Link>
      <span>/</span>
      <span>{naam}</span>
    </div>
  );
}

function ProfielWeergave({ profielId }: { profielId: string }) {
  const { t } = useLocale();
  const { data: profiel } = useBegeleiderProfiel(profielId);
  const { data: toewijzingen, isLoading } = useBegeleiderToewijzingen(profielId);
  const { data: dossierOptions } = useDossierOptions();
  const setActief = useSetBegeleiderActief(profielId);
  const toewijzen = useToewijzenDossier(profielId);
  const intrekken = useIntrekkenToewijzing();
  const [bevestigDeactiveren, setBevestigDeactiveren] = useState(false);
  const [teKoppelenDossier, setTeKoppelenDossier] = useState("");

  // Enkel dossiers aanbieden die deze begeleider nog niet actief heeft.
  const koppelbareDossiers = useMemo(() => {
    const actieveDossierIds = new Set(
      (toewijzingen ?? []).filter((tw) => tw.actief).map((tw) => tw.dossierId),
    );
    return [...(dossierOptions ?? [])]
      .filter((d) => !actieveDossierIds.has(d.id))
      .sort((a, b) => a.klantNaam.localeCompare(b.klantNaam));
  }, [dossierOptions, toewijzingen]);

  if (!profiel) return null;

  const weergavenaam = profiel.organisatie || profiel.naam;

  return (
    <div className="page">
      <Kruimelpad naam={weergavenaam} />

      <div className="page-header">
        <div>
          <h1 className="page-title">{weergavenaam}</h1>
          <p className="page-subtitle">{profiel.email ?? profiel.naam}</p>
        </div>
        <div className="flex-gap-12">
          <BegeleiderStatusBadge status={afgeleideStatus(profiel)} />
          {profiel.actief ? (
            <button
              className="btn btn-ghost"
              disabled={setActief.isPending}
              onClick={() => setBevestigDeactiveren(true)}
            >
              {t("begeleiderDetail.deactiveren")}
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              disabled={setActief.isPending}
              onClick={() => setActief.mutate(true)}
            >
              {t("begeleiderDetail.heractiveren")}
            </button>
          )}
        </div>
      </div>

      {bevestigDeactiveren && (
        <div className="card card-padded mt-24" style={{ maxWidth: 560, marginBottom: 24 }}>
          <p className="text-secondary" style={{ fontSize: 14, marginBottom: 16 }}>
            {t("begeleiderDetail.bevestigDeactiveren")}
          </p>
          <div className="flex-gap-12">
            <button
              className="btn btn-danger"
              disabled={setActief.isPending}
              onClick={() =>
                setActief.mutate(false, { onSuccess: () => setBevestigDeactiveren(false) })
              }
            >
              {setActief.isPending ? t("common.bezigMetOpslaan") : t("common.jaBevestigen")}
            </button>
            <button className="btn btn-ghost" onClick={() => setBevestigDeactiveren(false)}>
              {t("common.annuleren")}
            </button>
          </div>
        </div>
      )}

      <div className="card card-padded">
        <div className="detail-section-label">{t("begeleiderDetail.gegevens")}</div>
        <div className="detail-section-body">
          <div>
            {t("begeleiders.contactpersoon")}: {profiel.naam}
          </div>
          {profiel.email && <div>{profiel.email}</div>}
          {profiel.geactiveerd_at && (
            <div>
              {t("aanvraagDetail.aangemaaktOp")} {formatDate(profiel.geactiveerd_at)}
            </div>
          )}
        </div>
      </div>

      <div className="card mt-24">
        <div className="card-padded flex-between">
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>
            {t("begeleiderDetail.toegewezenDossiers")}
          </h2>
        </div>

        <div className="card-padded" style={{ paddingTop: 0 }}>
          <div className="list-toolbar" style={{ marginBottom: 0 }}>
            <select
              className="select"
              style={{ maxWidth: 320 }}
              value={teKoppelenDossier}
              onChange={(e) => setTeKoppelenDossier(e.target.value)}
            >
              <option value="">{t("aanvraagNieuw.kiesDossier")}</option>
              {koppelbareDossiers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.klantNaam} — {d.titel}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={!teKoppelenDossier || toewijzen.isPending}
              onClick={() =>
                toewijzen.mutate(teKoppelenDossier, {
                  onSuccess: () => setTeKoppelenDossier(""),
                })
              }
            >
              {t("begeleiderDetail.dossierToewijzen")}
            </button>
          </div>
          {(toewijzen.isError || intrekken.isError) && (
            <div className="form-error mt-24">{t("common.opslaanMislukt")}</div>
          )}
        </div>

        {isLoading ? (
          <div className="empty-state">{t("common.laden")}</div>
        ) : (toewijzingen ?? []).length === 0 ? (
          <EmptyState
            title={t("begeleiderDetail.geenToewijzingenTitel")}
            description={t("begeleiderDetail.geenToewijzingenBeschrijving")}
          />
        ) : (
          (toewijzingen ?? []).map((tw) => (
            <div
              key={tw.id}
              className="list-row"
              style={{ gridTemplateColumns: "1.4fr 1.6fr auto", opacity: tw.actief ? 1 : 0.55 }}
            >
              <div className="list-row-primary">{tw.klantNaam}</div>
              <div className="list-row-secondary">{tw.dossierTitel}</div>
              {tw.actief ? (
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={intrekken.isPending}
                  onClick={() => intrekken.mutate(tw.id)}
                >
                  {t("begeleiderDetail.intrekken")}
                </button>
              ) : (
                <span className="badge badge-inactief">{t("begeleiderDetail.ingetrokken")}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function UitnodigingWeergave({ uitnodigingId }: { uitnodigingId: string }) {
  const { t } = useLocale();
  const navigate = useNavigate();
  const { data: uitnodiging } = useUitnodiging(uitnodigingId);
  const { data: klaargezet, isLoading } = useUitnodigingDossiers(uitnodigingId);
  const { data: dossierOptions } = useDossierOptions();
  const intrekken = useIntrekkenUitnodiging();
  const [bevestig, setBevestig] = useState(false);

  const dossierById = useMemo(
    () => new Map((dossierOptions ?? []).map((d) => [d.id, d])),
    [dossierOptions],
  );

  if (!uitnodiging) return null;

  const weergavenaam = uitnodiging.organisatie || uitnodiging.naam;

  return (
    <div className="page">
      <Kruimelpad naam={weergavenaam} />

      <div className="page-header">
        <div>
          <h1 className="page-title">{weergavenaam}</h1>
          <p className="page-subtitle">{uitnodiging.email}</p>
        </div>
        <div className="flex-gap-12">
          <BegeleiderStatusBadge status="uitgenodigd" />
          <button className="btn btn-ghost" onClick={() => setBevestig(true)}>
            {t("begeleiderDetail.uitnodigingIntrekken")}
          </button>
        </div>
      </div>

      {bevestig && (
        <div className="card card-padded" style={{ maxWidth: 560, marginBottom: 24 }}>
          <p className="text-secondary" style={{ fontSize: 14, marginBottom: 16 }}>
            {t("begeleiderDetail.bevestigUitnodigingIntrekken")}
          </p>
          <div className="flex-gap-12">
            <button
              className="btn btn-danger"
              disabled={intrekken.isPending}
              onClick={() =>
                intrekken.mutate(uitnodigingId, {
                  onSuccess: () => navigate({ to: "/begeleiders" }),
                })
              }
            >
              {intrekken.isPending ? t("common.bezigMetOpslaan") : t("common.jaBevestigen")}
            </button>
            <button className="btn btn-ghost" onClick={() => setBevestig(false)}>
              {t("common.annuleren")}
            </button>
          </div>
        </div>
      )}

      <div className="card card-padded">
        <div className="detail-section-label">{t("begeleiderDetail.uitnodigingTitel")}</div>
        <div className="detail-section-body">
          {t("begeleiderDetail.uitnodigingBeschrijving")}
        </div>

        <div className="detail-section">
          <div className="detail-section-label">{t("begeleiderDetail.gegevens")}</div>
          <div className="detail-section-body">
            <div>
              {t("begeleiders.contactpersoon")}: {uitnodiging.naam}
            </div>
            <div>{uitnodiging.email}</div>
            <div>
              {t("begeleiderDetail.uitgenodigdOp")} {formatDate(uitnodiging.created_at)}
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-24">
        <div className="card-padded">
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>
            {t("begeleiderDetail.klaargezetteDossiers")}
          </h2>
        </div>
        {isLoading ? (
          <div className="empty-state">{t("common.laden")}</div>
        ) : (klaargezet ?? []).length === 0 ? (
          <EmptyState title={t("begeleiderDetail.geenToewijzingenTitel")} />
        ) : (
          (klaargezet ?? []).map((k) => {
            const dossier = dossierById.get(k.dossierId);
            return (
              <div
                key={k.dossierId}
                className="list-row"
                style={{ gridTemplateColumns: "1.4fr 1.6fr" }}
              >
                <div className="list-row-primary">{dossier?.klantNaam ?? ""}</div>
                <div className="list-row-secondary">{dossier?.titel ?? ""}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

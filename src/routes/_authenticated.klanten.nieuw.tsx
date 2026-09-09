import { createRoute, useNavigate } from "@tanstack/react-router";
import { authenticatedRoute } from "./_authenticated";
import { useCreateKlant } from "@/lib/queries";
import { KlantForm } from "@/components/KlantForm";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLocale } from "@/lib/i18n";

export const klantNieuwRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/klanten/nieuw",
  component: NieuweKlantPage,
});

function NieuweKlantPage() {
  const { t } = useLocale();
  usePageTitle(t("klanten.nieuweKlant"));
  const navigate = useNavigate();
  const createKlant = useCreateKlant();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("klanten.nieuweKlant")}</h1>
          <p className="page-subtitle">{t("klantNieuw.subtitle")}</p>
        </div>
      </div>

      <div className="card card-padded" style={{ maxWidth: 560 }}>
        <KlantForm
          submitLabel={t("klantNieuw.opslaan")}
          submitting={createKlant.isPending}
          onCancel={() => navigate({ to: "/klanten" })}
          onSubmit={(values) => {
            createKlant.mutate(values, {
              onSuccess: (row) => navigate({ to: "/klanten/$id", params: { id: row.id } }),
            });
          }}
        />
        {createKlant.isError && <div className="form-error mt-24">{t("common.opslaanMislukt")}</div>}
      </div>
    </div>
  );
}

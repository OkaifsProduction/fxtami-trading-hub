import { useLocale } from "@/lib/i18n";

/**
 * Tegenhanger van EmptyState voor een mislukte query. Zonder dit onderscheid
 * viel een netwerk- of rechtenfout terug op "geen resultaten gevonden", wat
 * precies het verkeerde signaal geeft: dan lijkt het alsof er geen gegevens
 * zíjn, terwijl ze alleen niet opgehaald konden worden.
 */
export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  const { t } = useLocale();
  return (
    <div className="empty-state">
      <div className="empty-state-title">{t("common.ladenMisluktTitel")}</div>
      <p>{t("common.ladenMisluktBeschrijving")}</p>
      {onRetry && (
        <button type="button" className="btn btn-secondary mt-24" onClick={onRetry}>
          {t("common.opnieuwProberen")}
        </button>
      )}
    </div>
  );
}

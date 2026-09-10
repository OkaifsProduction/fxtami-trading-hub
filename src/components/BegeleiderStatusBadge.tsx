import type { BegeleiderStatus } from "@/lib/database.types";
import { useLocale, type TranslationKey } from "@/lib/i18n";

// Bewust een aparte badge en niet StatusBadge uitbreiden: die dekt de
// aanvraag- en dossierworkflow, met een exhaustief getypeerde statuslijst.
// Begeleiderstatussen horen daar niet in thuis.
const LABEL_KEYS: Record<BegeleiderStatus, TranslationKey> = {
  actief: "begeleiders.statusActief",
  uitgenodigd: "begeleiders.statusUitgenodigd",
  inactief: "begeleiders.statusInactief",
};

export function BegeleiderStatusBadge({ status }: { status: BegeleiderStatus }) {
  const { t } = useLocale();
  return <span className={`badge badge-${status}`}>{t(LABEL_KEYS[status])}</span>;
}

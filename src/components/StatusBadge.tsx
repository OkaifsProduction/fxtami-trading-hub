import type { AanvraagStatus, DossierStatus } from "@/lib/database.types";
import { useLocale, type TranslationKey } from "@/lib/i18n";

type Status = AanvraagStatus | DossierStatus | "nvt";

const LABEL_KEYS: Record<Status, TranslationKey> = {
  open: "status.open",
  in_behandeling: "status.inBehandeling",
  goedgekeurd: "status.goedgekeurd",
  geweigerd: "status.geweigerd",
  afgehandeld: "status.afgehandeld",
  gesloten: "status.gesloten",
  nvt: "status.nvt",
};

export function StatusBadge({ status }: { status: Status }) {
  const { t } = useLocale();
  return <span className={`badge badge-${status}`}>{t(LABEL_KEYS[status])}</span>;
}

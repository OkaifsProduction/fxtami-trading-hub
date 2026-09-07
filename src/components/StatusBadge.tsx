import type { AanvraagStatus, DossierStatus } from "@/lib/database.types";

type Status = AanvraagStatus | DossierStatus;

const LABELS: Record<Status, string> = {
  open: "Open",
  in_behandeling: "In behandeling",
  goedgekeurd: "Goedgekeurd",
  geweigerd: "Geweigerd",
  afgehandeld: "Afgehandeld",
  gesloten: "Gesloten",
};

export function StatusBadge({ status }: { status: Status }) {
  return <span className={`badge badge-${status}`}>{LABELS[status]}</span>;
}

import type { RequestStatus } from "@/lib/database.types";

const LABELS: Record<RequestStatus, string> = {
  open: "Open",
  afgehandeld: "Afgehandeld",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return <span className={`badge badge-${status}`}>{LABELS[status]}</span>;
}

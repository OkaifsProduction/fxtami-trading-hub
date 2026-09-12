import { Link } from "@tanstack/react-router";

interface StatTileProps {
  label: string;
  value: string;
  accent?: boolean;
  to?: string;
  search?: Record<string, string>;
}

export function StatTile({ label, value, accent, to, search }: StatTileProps) {
  const content = (
    <>
      <span className="stat-label">{label}</span>
      <span className={`stat-value${accent ? " accent" : ""}`}>{value}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} search={search} className="stat-tile stat-tile-interactive">
        {content}
      </Link>
    );
  }

  return <div className="stat-tile">{content}</div>;
}

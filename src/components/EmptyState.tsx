export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="empty-state">
      <div className="empty-state-title">{title}</div>
      {description && <p>{description}</p>}
    </div>
  );
}

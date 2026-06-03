type StatPanelProps = {
  label: string;
  value: string;
  detail: string;
};

export function StatPanel({ label, value, detail }: StatPanelProps) {
  return (
    <article className="stat-panel">
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{detail}</em>
    </article>
  );
}

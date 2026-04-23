type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
};

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <div className="metric-card">
      <p className="eyebrow">{label}</p>
      <h2 style={{ margin: "0 0 8px", fontSize: "2rem" }}>{value}</h2>
      <p style={{ margin: 0, color: "var(--muted)" }}>{detail}</p>
    </div>
  );
}


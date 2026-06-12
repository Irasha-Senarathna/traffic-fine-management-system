export default function StatCard({
  title,
  value,
  color,
}) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body text-center">
        <h6 className="text-muted">{title}</h6>

        <h2
          style={{
            color: color || "#0d6efd",
          }}
        >
          {value}
        </h2>
      </div>
    </div>
  );
}
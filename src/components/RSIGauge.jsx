export default function RSIGauge({ value, theme }) {
  if (value == null) return <div style={{ color: theme.textSecondary, fontSize: 12 }}>Ładowanie RSI...</div>;
  const label = value > 70 ? "Wykupiony" : value < 30 ? "Wyprzedany" : "Neutralny";
  const color = value > 70 ? "#ef4444" : value < 30 ? "#22c55e" : "#ffd700";
  const pct = Math.min(Math.max(value / 100, 0), 1);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>RSI (14)</span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color }}>{value.toFixed(1)}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color }}>{label}</span>
        </div>
      </div>
      <div style={{ height: 8, background: theme.border, borderRadius: 6, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 6,
          width: `${pct * 100}%`, background: "linear-gradient(90deg, #22c55e, #eab308, #ef4444)",
          transition: "width 0.6s ease"
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: theme.textSecondary, marginTop: 3 }}>
        <span>Wyprzedany (0)</span><span>Neutralny (50)</span><span>Wykupiony (100)</span>
      </div>
    </div>
  );
}

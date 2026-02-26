export default function KeyMetricsTable({ metrics, theme }) {
  if (!metrics) return null;

  const rows = [
    { label: "P/E", value: metrics.pe, fmt: v => `${v.toFixed(1)}x` },
    { label: "P/B", value: metrics.pb, fmt: v => `${v.toFixed(2)}x` },
    { label: "EV/EBITDA", value: metrics.evEbitda, fmt: v => `${v.toFixed(1)}x` },
    { label: "Stopa dywidendy", value: metrics.divYield, fmt: v => `${v.toFixed(1)}%` },
    { label: "ROE", value: metrics.roe, fmt: v => `${v.toFixed(1)}%` },
    { label: "Dług/Kapitał", value: metrics.debtToEquity, fmt: v => `${v.toFixed(2)}x` },
    { label: "Kapitalizacja", value: metrics.marketCap, fmt: v => v },
  ].filter(r => r.value != null);

  return (
    <div style={{
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      overflow: "hidden",
    }}>
      <div style={{
        padding: "12px 16px",
        borderBottom: `1px solid ${theme.border}`,
        fontSize: 10,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: theme.textSecondary,
        fontFamily: "var(--font-ui)",
      }}>
        Kluczowe wskaźniki
      </div>
      {rows.map((row, i) => (
        <div key={row.label} style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          borderBottom: i < rows.length - 1 ? `1px solid ${theme.border}` : "none",
        }}>
          <span style={{ fontSize: 13, color: theme.textSecondary, fontFamily: "var(--font-ui)" }}>
            {row.label}
          </span>
          <span style={{
            fontSize: 13, fontWeight: 600, color: theme.textBright,
            fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums",
          }}>
            {row.fmt(row.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

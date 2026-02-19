export default function SectorDonut({ stocks, theme }) {
  const sectorCaps = {};
  for (const s of stocks) {
    sectorCaps[s.sector] = (sectorCaps[s.sector] || 0) + (s.cap || 0);
  }
  const sorted = Object.entries(sectorCaps).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((a, [, v]) => a + v, 0);
  if (!total) return null;

  const COLORS = ["#58a6ff", "#00c896", "#ff4d6d", "#ffd700", "#a371f7", "#f78166", "#3fb950", "#d2a8ff", "#79c0ff", "#f0883e", "#7ee787", "#ff7b72", "#d29922", "#56d364"];
  const cx = 50, cy = 50, r = 38, ir = 24;
  let angle = -90;
  const slices = sorted.map(([sector, cap], i) => {
    const frac = cap / total;
    const startAngle = angle;
    const sweep = frac * 360;
    angle += sweep;
    const endAngle = angle;
    const large = sweep > 180 ? 1 : 0;
    const s1 = (startAngle * Math.PI) / 180, e1 = (endAngle * Math.PI) / 180;
    const x1 = cx + r * Math.cos(s1), y1 = cy + r * Math.sin(s1);
    const x2 = cx + r * Math.cos(e1), y2 = cy + r * Math.sin(e1);
    const x3 = cx + ir * Math.cos(e1), y3 = cy + ir * Math.sin(e1);
    const x4 = cx + ir * Math.cos(s1), y4 = cy + ir * Math.sin(s1);
    const d = `M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${ir},${ir} 0 ${large} 0 ${x4},${y4} Z`;
    return { sector, cap, frac, d, color: COLORS[i % COLORS.length] };
  });

  return (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
      <div style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Dominacja sektorowa</div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <svg width="140" height="140" viewBox="0 0 100 100">
          {slices.map(s => <path key={s.sector} d={s.d} fill={s.color} opacity="0.85" stroke={theme.bgCard} strokeWidth="0.5" />)}
          <text x="50" y="47" textAnchor="middle" fill={theme.textBright} fontSize="7" fontWeight="800" fontFamily="'Inter',sans-serif">{(total / 1000).toFixed(0)}</text>
          <text x="50" y="56" textAnchor="middle" fill={theme.textSecondary} fontSize="3.5" fontFamily="'Inter',sans-serif">mld zł</text>
        </svg>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 8px" }}>
        {sorted.slice(0, 8).map(([sector, cap], i) => (
          <div key={sector} style={{ display: "flex", alignItems: "center", gap: 5, overflow: "hidden" }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: theme.textMuted ?? theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{sector}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: COLORS[i % COLORS.length], flexShrink: 0 }}>{(cap / total * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

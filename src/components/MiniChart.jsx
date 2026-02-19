export default function MiniChart({ data, color }) {
  if (!data || data.length < 2) return (
    <div style={{ color: "#8b949e", fontSize: 12, textAlign: "center", padding: "40px 0" }}>
      Ładowanie wykresu...
    </div>
  );
  const gradId = `cg-${color.replace("#", "")}`;
  const prices = data.map(d => d.close);
  const min = Math.min(...prices), max = Math.max(...prices);
  const w = 600, h = 160;
  const pts = prices.map((p, i) => `${(i / (prices.length - 1)) * w},${h - ((p - min) / (max - min + 0.01)) * (h - 20) - 10}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${gradId})`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

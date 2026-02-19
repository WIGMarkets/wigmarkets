export default function LargeChart({ data, color, theme }) {
  if (!data || data.length < 2) return (
    <div style={{ color: theme.textSecondary, fontSize: 12, textAlign: "center", padding: "60px 0" }}>
      Ładowanie wykresu...
    </div>
  );
  const gradId = `lg-${color.replace("#", "")}`;
  const prices = data.map(d => d.close);
  const min = Math.min(...prices), max = Math.max(...prices);
  const range = max - min || 1;
  const w = 800, h = 280, padTop = 20, padBot = 30, padLeft = 60, padRight = 20;
  const chartW = w - padLeft - padRight, chartH = h - padTop - padBot;

  const pts = prices.map((p, i) => {
    const x = padLeft + (i / (prices.length - 1)) * chartW;
    const y = padTop + chartH - ((p - min) / range) * chartH;
    return `${x},${y}`;
  }).join(" ");

  const gridLines = 5;
  const yLabels = Array.from({ length: gridLines + 1 }, (_, i) => {
    const val = min + (range * i) / gridLines;
    const y = padTop + chartH - (i / gridLines) * chartH;
    return { val, y };
  });

  const dateStep = Math.max(1, Math.floor(data.length / 6));
  const xLabels = data
    .filter((_, i) => i % dateStep === 0 || i === data.length - 1)
    .map(d => {
      const idx = data.indexOf(d);
      const x = padLeft + (idx / (data.length - 1)) * chartW;
      return { date: d.date, x };
    });

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {yLabels.map((l, i) => (
        <g key={i}>
          <line x1={padLeft} y1={l.y} x2={w - padRight} y2={l.y} stroke={theme.border} strokeWidth="0.5" strokeDasharray="4,3" />
          <text x={padLeft - 8} y={l.y + 3} textAnchor="end" fill={theme.textSecondary} fontSize="9" fontFamily="'Space Grotesk',sans-serif">{l.val.toFixed(2)}</text>
        </g>
      ))}
      {xLabels.map((l, i) => (
        <text key={i} x={l.x} y={h - 6} textAnchor="middle" fill={theme.textSecondary} fontSize="8" fontFamily="'Space Grotesk',sans-serif">
          {new Date(l.date).toLocaleDateString("pl-PL", { day: "numeric", month: "short" })}
        </text>
      ))}
      <polyline points={`${padLeft},${padTop + chartH} ${pts} ${w - padRight},${padTop + chartH}`} fill={`url(#${gradId})`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

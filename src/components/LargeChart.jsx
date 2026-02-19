function fmtY(v) {
  return v >= 1000 ? v.toFixed(0) : v >= 100 ? v.toFixed(1) : v.toFixed(2);
}

export default function LargeChart({ data, color, theme, type = "line", isIntraday = false }) {
  if (!data || data.length < 2) return (
    <div style={{ color: theme.textSecondary, fontSize: 12, textAlign: "center", padding: "60px 0" }}>
      Ładowanie wykresu...
    </div>
  );

  const gradId = `lg-${color.replace("#", "")}`;
  const w = 800, h = 280, padTop = 20, padBot = 30, padLeft = 60, padRight = 20;
  const chartW = w - padLeft - padRight;
  const chartH = h - padTop - padBot;

  const closes = data.map(d => d.close);
  const highs  = data.map(d => (d.high  != null && !isNaN(d.high))  ? d.high  : d.close);
  const lows   = data.map(d => (d.low   != null && !isNaN(d.low))   ? d.low   : d.close);

  const min = Math.min(...(type === "candle" ? lows  : closes));
  const max = Math.max(...(type === "candle" ? highs : closes));
  const priceRange = max - min || 1;

  const toY = v => padTop + chartH - ((v - min) / priceRange) * chartH;
  const toX = i => padLeft + (i / Math.max(data.length - 1, 1)) * chartW;

  // Y-axis grid labels
  const gridLines = 5;
  const yLabels = Array.from({ length: gridLines + 1 }, (_, i) => {
    const val = min + (priceRange * i) / gridLines;
    const y = padTop + chartH - (i / gridLines) * chartH;
    return { val, y };
  });

  // X-axis labels
  const dateStep = Math.max(1, Math.floor(data.length / 6));
  const xLabels = data
    .filter((_, i) => i % dateStep === 0 || i === data.length - 1)
    .map(d => {
      const idx = data.indexOf(d);
      const x = toX(idx);
      const label = isIntraday
        ? d.time
        : new Date(d.date).toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
      return { label, x };
    });

  if (type === "candle") {
    const rawCW = (chartW / data.length) * 0.72;
    const candleW = Math.min(22, Math.max(1.5, rawCW));

    return (
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
        {yLabels.map((l, i) => (
          <g key={i}>
            <line x1={padLeft} y1={l.y} x2={w - padRight} y2={l.y} stroke={theme.border} strokeWidth="0.5" strokeDasharray="4,3" />
            <text x={padLeft - 8} y={l.y + 3} textAnchor="end" fill={theme.textSecondary} fontSize="9" fontFamily="'Inter',sans-serif">{fmtY(l.val)}</text>
          </g>
        ))}
        {xLabels.map((l, i) => (
          <text key={i} x={l.x} y={h - 6} textAnchor="middle" fill={theme.textSecondary} fontSize="8" fontFamily="'Inter',sans-serif">{l.label}</text>
        ))}
        {data.map((d, i) => {
          const open  = d.open  != null && !isNaN(d.open)  ? d.open  : d.close;
          const high  = d.high  != null && !isNaN(d.high)  ? d.high  : d.close;
          const low   = d.low   != null && !isNaN(d.low)   ? d.low   : d.close;
          const close = d.close;
          const x = toX(i);
          const c = close >= open ? "#00c896" : "#ff4d6d";
          const bodyY1 = toY(Math.max(open, close));
          const bodyY2 = toY(Math.min(open, close));
          const bodyH  = Math.max(1, bodyY2 - bodyY1);
          return (
            <g key={i}>
              <line x1={x} y1={toY(high)} x2={x} y2={toY(low)} stroke={c} strokeWidth="1" />
              <rect x={x - candleW / 2} y={bodyY1} width={candleW} height={bodyH} fill={c} />
            </g>
          );
        })}
      </svg>
    );
  }

  // — line / area chart —
  const pts = closes.map((p, i) => `${toX(i)},${toY(p)}`).join(" ");
  const first = `${padLeft},${padTop + chartH}`;
  const last  = `${toX(data.length - 1)},${padTop + chartH}`;

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
          <text x={padLeft - 8} y={l.y + 3} textAnchor="end" fill={theme.textSecondary} fontSize="9" fontFamily="'Inter',sans-serif">{fmtY(l.val)}</text>
        </g>
      ))}
      {xLabels.map((l, i) => (
        <text key={i} x={l.x} y={h - 6} textAnchor="middle" fill={theme.textSecondary} fontSize="8" fontFamily="'Inter',sans-serif">{l.label}</text>
      ))}
      <polyline points={`${first} ${pts} ${last}`} fill={`url(#${gradId})`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

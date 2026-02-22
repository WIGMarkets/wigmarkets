const W = 600, H = 180;
const PAD_L = 46, PAD_R = 6, PAD_T = 12, PAD_B = 20;
const CW = W - PAD_L - PAD_R;
const CH = H - PAD_T - PAD_B;

function fmtP(v) {
  return v >= 1000 ? v.toFixed(0) : v >= 100 ? v.toFixed(1) : v.toFixed(2);
}

function YAxis({ min, max, theme }) {
  const steps = [0, 0.5, 1];
  return steps.map(t => {
    const v = min + (max - min) * t;
    const y = PAD_T + CH * (1 - t);
    return (
      <g key={t}>
        <line x1={PAD_L} y1={y} x2={PAD_L + CW} y2={y} stroke={theme.border} strokeWidth="1" strokeDasharray="3 3" />
        <text x={PAD_L - 4} y={y + 4} fill={theme.textSecondary} fontSize="9.5" textAnchor="end" fontFamily="monospace">{fmtP(v)}</text>
      </g>
    );
  });
}

function XLabels({ data, xOf, labelKey, theme }) {
  if (data.length < 2) return null;
  const step = Math.max(1, Math.floor(data.length / 5));
  return data
    .filter((_, i) => i === 0 || i === data.length - 1 || i % step === 0)
    .map((d, _, arr) => {
      const idx = data.indexOf(d);
      return (
        <text key={idx} x={xOf(idx)} y={H - 3} fill={theme.textSecondary} fontSize="9" textAnchor="middle" fontFamily="monospace">
          {d[labelKey]}
        </text>
      );
    });
}

export default function MiniChart({ data, color, type = "line", isIntraday = false, theme = {} }) {
  const t = { border: theme.border || "#30363d", textSecondary: theme.textSecondary || "#8b949e" };
  if (!data || data.length < 2) return (
    <div style={{ color: t.textSecondary, fontSize: 12, textAlign: "center", padding: "40px 0" }}>
      Ładowanie wykresu...
    </div>
  );

  const labelKey = isIntraday ? "time" : "date";
  const closes = data.map(d => d.close);
  const highs  = data.map(d => (d.high  != null && !isNaN(d.high))  ? d.high  : d.close);
  const lows   = data.map(d => (d.low   != null && !isNaN(d.low))   ? d.low   : d.close);

  const min = Math.min(...(type === "candle" ? lows  : closes));
  const max = Math.max(...(type === "candle" ? highs : closes));
  const range = max - min || 0.01;

  const toY = v => PAD_T + CH - ((v - min) / range) * CH;
  const toX = i => PAD_L + (i / Math.max(data.length - 1, 1)) * CW;

  const gradId = `cg-${color.replace("#", "")}`;

  if (type === "candle") {
    const rawCW = (CW / data.length) * 0.72;
    const candleW = Math.min(20, Math.max(1.5, rawCW));

    return (
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <YAxis min={min} max={max} theme={t} />
        <XLabels data={data} xOf={toX} labelKey={labelKey} theme={t} />
        {data.map((d, i) => {
          const open  = d.open  != null && !isNaN(d.open)  ? d.open  : d.close;
          const high  = d.high  != null && !isNaN(d.high)  ? d.high  : d.close;
          const low   = d.low   != null && !isNaN(d.low)   ? d.low   : d.close;
          const close = d.close;
          const x = toX(i);
          const up = close >= open;
          const c  = up ? "#22c55e" : "#ef4444";
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
  const areaFirst = `${toX(0)},${PAD_T + CH}`;
  const areaLast  = `${toX(closes.length - 1)},${PAD_T + CH}`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <YAxis min={min} max={max} theme={t} />
      <XLabels data={data} xOf={toX} labelKey={labelKey} theme={t} />
      <polyline points={`${areaFirst} ${pts} ${areaLast}`} fill={`url(#${gradId})`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

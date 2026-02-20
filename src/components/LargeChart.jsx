import { useRef, useState, useCallback } from "react";

function fmtY(v) {
  return v >= 1000 ? v.toFixed(0) : v >= 100 ? v.toFixed(1) : v.toFixed(2);
}

function fmtLabel(d, isIntraday) {
  if (isIntraday) return d.time || "";
  if (!d.date) return "";
  return new Date(d.date).toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" });
}

export default function LargeChart({ data, color, theme, type = "line", isIntraday = false, unit = "zł" }) {
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null);

  const handleMouseMove = useCallback((e) => {
    if (!svgRef.current || !data?.length) return;
    const rect  = svgRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const idx   = Math.round(ratio * (data.length - 1));
    setHover({ index: idx, ratio });
  }, [data]);

  const handleMouseLeave = useCallback(() => setHover(null), []);

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

  // Crosshair + tooltip rendered when hover is active
  const crosshair = hover && (
    <>
      <line
        x1={toX(hover.index)} y1={padTop}
        x2={toX(hover.index)} y2={padTop + chartH}
        stroke={theme.textSecondary} strokeWidth="1"
        strokeDasharray="4 3" opacity="0.5"
      />
      <circle
        cx={toX(hover.index)} cy={toY(data[hover.index].close)}
        r="4" fill={color}
        stroke={theme.bgCard || "#0d1117"} strokeWidth="2"
      />
    </>
  );

  const tooltip = hover && (() => {
    const d = data[hover.index];
    const open  = d.open  != null && !isNaN(d.open)  ? d.open  : d.close;
    const high  = d.high  != null && !isNaN(d.high)  ? d.high  : d.close;
    const low   = d.low   != null && !isNaN(d.low)   ? d.low   : d.close;
    return (
      <div style={{
        position: "absolute",
        left: `clamp(0px, calc(${(hover.ratio * 100).toFixed(1)}% - 65px), calc(100% - 145px))`,
        top: 4,
        background: theme.bgCard,
        border: `1px solid ${theme.border}`,
        borderRadius: 8,
        padding: "7px 12px",
        pointerEvents: "none",
        zIndex: 10,
        minWidth: 140,
        boxShadow: "0 4px 16px rgba(0,0,0,0.22)",
      }}>
        <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 3 }}>
          {fmtLabel(d, isIntraday)}
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color, lineHeight: 1 }}>
          {fmtY(d.close)} {unit}
        </div>
        {type === "candle" && (
          <div style={{ fontSize: 10, color: theme.textSecondary, marginTop: 4, lineHeight: 1.6 }}>
            O: {fmtY(open)}{"  "}H: {fmtY(high)}{"  "}L: {fmtY(low)}
          </div>
        )}
      </div>
    );
  })();

  if (type === "candle") {
    const rawCW = (chartW / data.length) * 0.72;
    const candleW = Math.min(22, Math.max(1.5, rawCW));

    return (
      <div style={{ position: "relative" }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <svg ref={svgRef} width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block", cursor: "crosshair" }}>
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
          {crosshair}
        </svg>
        {tooltip}
      </div>
    );
  }

  // — line / area chart —
  const pts = closes.map((p, i) => `${toX(i)},${toY(p)}`).join(" ");
  const first = `${padLeft},${padTop + chartH}`;
  const last  = `${toX(data.length - 1)},${padTop + chartH}`;

  return (
    <div style={{ position: "relative" }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <svg ref={svgRef} width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block", cursor: "crosshair" }}>
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
        {crosshair}
      </svg>
      {tooltip}
    </div>
  );
}

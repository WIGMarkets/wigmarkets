import { memo, useRef, useState, useCallback, useMemo } from "react";

function fmtY(v) {
  return v >= 1000 ? v.toFixed(0) : v >= 100 ? v.toFixed(1) : v.toFixed(2);
}

function fmtVol(v) {
  if (!v) return "—";
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
  return `${v}`;
}

function fmtLabel(d, isIntraday) {
  if (isIntraday) return d.time || "";
  if (!d.date) return "";
  return new Date(d.date).toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" });
}

export default memo(function LargeChart({ data, color, theme, type = "line", isIntraday = false, unit = "zł" }) {
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null);

  const hasVolume = useMemo(() => data?.some(d => d.volume > 0), [data]);

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
  const w = 800;
  const volH = hasVolume ? 80 : 0;
  const volGap = hasVolume ? 10 : 0;
  const h = 280 + volH + volGap;
  const padTop = 20, padBot = 30, padLeft = 60, padRight = 20;
  const chartW = w - padLeft - padRight;
  const chartH = 280 - padTop - padBot;

  const closes = data.map(d => d.close);
  const highs  = data.map(d => (d.high  != null && !isNaN(d.high))  ? d.high  : d.close);
  const lows   = data.map(d => (d.low   != null && !isNaN(d.low))   ? d.low   : d.close);

  const min = Math.min(...(type === "candle" ? lows  : closes));
  const max = Math.max(...(type === "candle" ? highs : closes));
  const priceRange = max - min || 1;

  const toY = v => padTop + chartH - ((v - min) / priceRange) * chartH;
  const toX = i => padLeft + (i / Math.max(data.length - 1, 1)) * chartW;

  // Volume
  const volumes = hasVolume ? data.map(d => d.volume || 0) : [];
  const maxVol = hasVolume ? Math.max(...volumes, 1) : 1;
  const volTop = 280 + volGap;
  const volBottom = volTop + volH - 6;

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

  // Crosshair
  const crosshairEndY = hasVolume ? volBottom : padTop + chartH;
  const crosshair = hover && (
    <>
      <line
        x1={toX(hover.index)} y1={padTop}
        x2={toX(hover.index)} y2={crosshairEndY}
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
        left: `clamp(0px, calc(${(hover.ratio * 100).toFixed(1)}% - 75px), calc(100% - 165px))`,
        top: 4,
        background: theme.bgCard,
        border: `1px solid ${theme.border}`,
        borderRadius: 8,
        padding: "7px 12px",
        pointerEvents: "none",
        zIndex: 10,
        minWidth: 150,
        boxShadow: "0 4px 16px rgba(0,0,0,0.22)",
      }}>
        <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 3 }}>
          {fmtLabel(d, isIntraday)}
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color, lineHeight: 1 }}>
          {fmtY(d.close)} {unit}
        </div>
        <div style={{ fontSize: 10, color: theme.textSecondary, marginTop: 4, lineHeight: 1.6 }}>
          O: {fmtY(open)}{"  "}H: {fmtY(high)}{"  "}L: {fmtY(low)}
        </div>
        {d.volume > 0 && (
          <div style={{ fontSize: 10, color: theme.textSecondary, lineHeight: 1.6 }}>
            Vol: {fmtVol(d.volume)}
          </div>
        )}
      </div>
    );
  })();

  // Volume bars renderer
  const volumeBars = hasVolume && data.map((d, i) => {
    const vol = d.volume || 0;
    const barH = Math.max(1, (vol / maxVol) * (volBottom - volTop));
    const open = d.open != null && !isNaN(d.open) ? d.open : d.close;
    const barColor = d.close >= open ? "rgba(34,197,94,0.55)" : "rgba(239,68,68,0.55)";
    const barW = Math.max(1, (chartW / data.length) * 0.65);
    return (
      <rect key={i} x={toX(i) - barW / 2} y={volBottom - barH} width={barW} height={barH} fill={barColor} rx="0.5" />
    );
  });

  if (type === "candle") {
    const rawCW = (chartW / data.length) * 0.72;
    const candleW = Math.min(22, Math.max(1.5, rawCW));

    return (
      <div style={{ position: "relative" }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <svg ref={svgRef} width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block", cursor: "crosshair" }}>
          {yLabels.map((l, i) => (
            <g key={i}>
              <line x1={padLeft} y1={l.y} x2={w - padRight} y2={l.y} stroke={theme.border} strokeWidth="0.5" strokeDasharray="4,3" />
              <text x={padLeft - 8} y={l.y + 3} textAnchor="end" fill={theme.textSecondary} fontSize="9" fontFamily="'IBM Plex Mono',monospace">{fmtY(l.val)}</text>
            </g>
          ))}
          {xLabels.map((l, i) => (
            <text key={i} x={l.x} y={280 - 6} textAnchor="middle" fill={theme.textSecondary} fontSize="8" fontFamily="'IBM Plex Mono',monospace">{l.label}</text>
          ))}
          {data.map((d, i) => {
            const open  = d.open  != null && !isNaN(d.open)  ? d.open  : d.close;
            const high  = d.high  != null && !isNaN(d.high)  ? d.high  : d.close;
            const low   = d.low   != null && !isNaN(d.low)   ? d.low   : d.close;
            const close = d.close;
            const x = toX(i);
            const c = close >= open ? "#22c55e" : "#ef4444";
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
          {hasVolume && (
            <>
              <line x1={padLeft} y1={volTop - 2} x2={w - padRight} y2={volTop - 2} stroke={theme.border} strokeWidth="0.5" />
              <text x={padLeft - 8} y={volTop + 10} textAnchor="end" fill={theme.textSecondary} fontSize="7" fontFamily="'IBM Plex Mono',monospace">Vol</text>
              {volumeBars}
            </>
          )}
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
            <text x={padLeft - 8} y={l.y + 3} textAnchor="end" fill={theme.textSecondary} fontSize="9" fontFamily="'IBM Plex Mono',monospace">{fmtY(l.val)}</text>
          </g>
        ))}
        {xLabels.map((l, i) => (
          <text key={i} x={l.x} y={280 - 6} textAnchor="middle" fill={theme.textSecondary} fontSize="8" fontFamily="'IBM Plex Mono',monospace">{l.label}</text>
        ))}
        <polyline points={`${first} ${pts} ${last}`} fill={`url(#${gradId})`} stroke="none" />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {hasVolume && (
          <>
            <line x1={padLeft} y1={volTop - 2} x2={w - padRight} y2={volTop - 2} stroke={theme.border} strokeWidth="0.5" />
            <text x={padLeft - 8} y={volTop + 10} textAnchor="end" fill={theme.textSecondary} fontSize="7" fontFamily="'IBM Plex Mono',monospace">Vol</text>
            {volumeBars}
          </>
        )}
        {crosshair}
      </svg>
      {tooltip}
    </div>
  );
})

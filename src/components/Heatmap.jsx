import { memo, useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { fmt, fmtVolume, fmtCap } from "../lib/formatters.js";

// Gradient color scale: smooth interpolation based on % change
function heatColor(pct) {
  const v = Math.max(-5, Math.min(5, pct));
  if (Math.abs(v) < 0.15) return "#1a1a2e";
  if (v > 0) {
    const t = v / 5;
    if (t <= 0.2) return lerpColor("#1a1a2e", "#0d4a2b", t / 0.2);
    if (t <= 0.6) return lerpColor("#0d4a2b", "#15803d", (t - 0.2) / 0.4);
    return lerpColor("#15803d", "#22c55e", (t - 0.6) / 0.4);
  } else {
    const t = Math.abs(v) / 5;
    if (t <= 0.2) return lerpColor("#1a1a2e", "#4a0d0d", t / 0.2);
    if (t <= 0.6) return lerpColor("#4a0d0d", "#991b1b", (t - 0.2) / 0.4);
    return lerpColor("#991b1b", "#dc2626", (t - 0.6) / 0.4);
  }
}

function lerpColor(a, b, t) {
  const parse = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${bl})`;
}

function textAlpha(pct) {
  return Math.abs(pct) < 0.5 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.95)";
}

// Squarified treemap layout — fills entire rectangle with zero gaps in coverage
function squarify(items, x, y, w, h) {
  if (!items.length) return [];
  const rects = [];
  let remaining = [...items];
  let cx = x, cy = y, cw = w, ch = h;

  while (remaining.length) {
    const total = remaining.reduce((a, s) => a + s.cap, 0);
    if (total <= 0) break;
    const isWide = cw >= ch;
    const side = isWide ? ch : cw;
    let row = [remaining[0]];
    let rowSum = remaining[0].cap;

    for (let i = 1; i < remaining.length; i++) {
      const nextSum = rowSum + remaining[i].cap;
      const rowFrac = rowSum / total;
      const nextFrac = nextSum / total;
      const rowThick = rowFrac * (isWide ? cw : ch);
      const nextThick = nextFrac * (isWide ? cw : ch);
      const worstCur = row.reduce((worst, s) => {
        const len = (s.cap / rowSum) * side;
        return Math.max(worst, Math.max(rowThick / len, len / rowThick));
      }, 0);
      const worstNext = [...row, remaining[i]].reduce((worst, s) => {
        const len = (s.cap / nextSum) * side;
        return Math.max(worst, Math.max(nextThick / len, len / nextThick));
      }, 0);
      if (worstNext <= worstCur) { row.push(remaining[i]); rowSum = nextSum; } else break;
    }

    const thick = (rowSum / total) * (isWide ? cw : ch);
    let offset = 0;
    for (const s of row) {
      const len = (s.cap / rowSum) * side;
      rects.push({
        ...s,
        rx: isWide ? cx : cx + offset,
        ry: isWide ? cy + offset : cy,
        rw: isWide ? thick : len,
        rh: isWide ? len : thick,
      });
      offset += len;
    }
    remaining = remaining.slice(row.length);
    if (isWide) { cx += thick; cw -= thick; } else { cy += thick; ch -= thick; }
  }
  return rects;
}

const GAP = 1;

const HeatmapTile = memo(function HeatmapTile({ r, onClick, onShowTooltip, onMoveTooltip, onHideTooltip }) {
  const bg = heatColor(r.c24h);
  const tColor = textAlpha(r.c24h);
  const px = r.rx + GAP / 2;
  const py = r.ry + GAP / 2;
  const pw = r.rw - GAP;
  const ph = r.rh - GAP;
  if (pw <= 0 || ph <= 0) return null;

  const showTicker = pw >= 28 && ph >= 16;
  const showPct = pw >= 44 && ph >= 34;
  const minDim = Math.min(pw, ph);
  const tickerSize = Math.max(9, Math.min(16, Math.floor(minDim * 0.28)));
  const pctSize = Math.max(8, tickerSize - 2);

  return (
    <div
      onClick={() => onClick(r)}
      onMouseEnter={(e) => onShowTooltip(r, e)}
      onMouseMove={onMoveTooltip}
      onMouseLeave={onHideTooltip}
      style={{
        position: "absolute",
        left: px, top: py, width: pw, height: ph,
        background: bg, borderRadius: 2, cursor: "pointer",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        transition: "filter 0.15s, outline-color 0.15s",
        outline: "1px solid transparent",
        willChange: "filter",
      }}
      onMouseOver={(e) => { e.currentTarget.style.filter = "brightness(1.2)"; e.currentTarget.style.outlineColor = "rgba(255,255,255,0.3)"; }}
      onMouseOut={(e) => { e.currentTarget.style.filter = ""; e.currentTarget.style.outlineColor = "transparent"; }}
    >
      {showTicker && (
        <span style={{
          fontWeight: 700, fontSize: tickerSize, color: tColor,
          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          lineHeight: 1.2, fontFamily: "var(--font-ui)", userSelect: "none",
        }}>{r.ticker}</span>
      )}
      {showPct && (
        <span style={{
          fontWeight: 500, fontSize: pctSize, color: tColor,
          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          lineHeight: 1.2, fontFamily: "var(--font-mono)",
          fontVariantNumeric: "tabular-nums", userSelect: "none", marginTop: 1,
        }}>{r.c24h > 0 ? "+" : ""}{r.c24h.toFixed(2)}%</span>
      )}
    </div>
  );
});

export default function Heatmap({ stocks, prices, changes, theme }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [tooltip, setTooltip] = useState(null);
  const tooltipTimer = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  // Observe container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setContainerSize({ w: rect.width, h: rect.height });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Prepare items: filter, sort, limit
  const maxItems = isMobile ? 30 : 100;
  const items = useMemo(() => {
    return stocks
      .map(s => ({
        ...s,
        cap: s.cap || 0,
        c24h: changes[s.ticker]?.change24h ?? 0,
        price: prices[s.ticker],
        volume: changes[s.ticker]?.volume ?? 0,
      }))
      .filter(s => s.price && s.cap > 0)
      .sort((a, b) => b.cap - a.cap)
      .slice(0, maxItems);
  }, [stocks, prices, changes, maxItems]);

  // Compute treemap layout — render ALL tiles (no min-size filtering) to fill 100%
  const rects = useMemo(() => {
    if (!containerSize.w || !containerSize.h || !items.length) return [];
    return squarify(items, 0, 0, containerSize.w, containerSize.h);
  }, [items, containerSize]);

  const handleClick = useCallback((r) => {
    navigate(`/spolka/${r.ticker}`);
  }, [navigate]);

  const showTooltip = useCallback((r, e) => {
    clearTimeout(tooltipTimer.current);
    mousePos.current = { x: e.clientX, y: e.clientY };
    tooltipTimer.current = setTimeout(() => {
      setTooltip({ ...r, x: mousePos.current.x, y: mousePos.current.y });
    }, 100);
  }, []);

  const moveTooltip = useCallback((e) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
    setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
  }, []);

  const hideTooltip = useCallback(() => {
    clearTimeout(tooltipTimer.current);
    setTooltip(null);
  }, []);

  if (!items.length) return null;

  const aspectPct = isMobile ? "66%" : "50%";

  return (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
      {/* Header + Legend */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: 2, fontFamily: "var(--font-ui)" }}>Heatmapa rynku</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: theme.textSecondary, fontFamily: "var(--font-ui)" }}>
          <span>Spadek</span>
          <div style={{
            width: 150, height: 8, borderRadius: 4, flexShrink: 0,
            background: "linear-gradient(to right, #dc2626, #991b1b, #4a0d0d, #1a1a2e, #0d4a2b, #15803d, #22c55e)",
          }} />
          <span>Wzrost</span>
        </div>
      </div>

      {/* Treemap container */}
      <div
        ref={containerRef}
        style={{ position: "relative", width: "100%", paddingBottom: aspectPct, overflow: "hidden", background: "#111113" }}
        onMouseLeave={hideTooltip}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          {rects.map(r => (
            <HeatmapTile
              key={r.ticker}
              r={r}
              onClick={handleClick}
              onShowTooltip={showTooltip}
              onMoveTooltip={moveTooltip}
              onHideTooltip={hideTooltip}
            />
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: "fixed",
          left: tooltip.x + 12,
          top: tooltip.y - 10,
          zIndex: 9999,
          background: "#1a1a1e",
          border: "1px solid #333",
          borderRadius: 8,
          padding: 12,
          pointerEvents: "none",
          minWidth: 180,
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
        }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#f4f4f5", marginBottom: 6, fontFamily: "var(--font-ui)" }}>{tooltip.name}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
              <span style={{ color: "#a1a1aa" }}>Kurs</span>
              <span style={{ color: "#f4f4f5", fontWeight: 600 }}>{fmt(tooltip.price)} {tooltip.unit || "zł"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
              <span style={{ color: "#a1a1aa" }}>Zmiana</span>
              <span style={{ color: tooltip.c24h >= 0 ? "#22c55e" : "#ef4444", fontWeight: 600 }}>{tooltip.c24h > 0 ? "+" : ""}{fmt(tooltip.c24h)}%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
              <span style={{ color: "#a1a1aa" }}>Kap.</span>
              <span style={{ color: "#f4f4f5" }}>{fmtCap(tooltip.cap)}</span>
            </div>
            {tooltip.volume > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                <span style={{ color: "#a1a1aa" }}>Obrót</span>
                <span style={{ color: "#f4f4f5" }}>{fmtVolume(tooltip.volume, tooltip.price)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

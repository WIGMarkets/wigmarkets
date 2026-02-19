import { changeColor } from "../utils.js";

export default function Heatmap({ stocks, prices, changes, theme, onSelect }) {
  const items = stocks
    .map(s => ({ ...s, cap: s.cap || 1, c24h: changes[s.ticker]?.change24h ?? 0, price: prices[s.ticker] }))
    .filter(s => s.price)
    .sort((a, b) => b.cap - a.cap);
  const totalCap = items.reduce((a, s) => a + s.cap, 0);
  if (!totalCap) return null;

  const layoutRows = (items, x, y, w, h) => {
    if (!items.length) return [];
    const rects = [];
    let remaining = [...items];
    let cx = x, cy = y, cw = w, ch = h;
    while (remaining.length) {
      const total = remaining.reduce((a, s) => a + s.cap, 0);
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
          const ar = Math.max(rowThick / len, len / rowThick);
          return Math.max(worst, ar);
        }, 0);
        const worstNext = [...row, remaining[i]].reduce((worst, s) => {
          const len = (s.cap / nextSum) * side;
          const ar = Math.max(nextThick / len, len / nextThick);
          return Math.max(worst, ar);
        }, 0);
        if (worstNext <= worstCur) { row.push(remaining[i]); rowSum = nextSum; } else break;
      }
      const rowFrac = rowSum / total;
      const thick = rowFrac * (isWide ? cw : ch);
      let offset = 0;
      for (const s of row) {
        const frac = s.cap / rowSum;
        const len = frac * side;
        rects.push({ ...s, rx: isWide ? cx : cx + offset, ry: isWide ? cy + offset : cy, rw: isWide ? thick : len, rh: isWide ? len : thick });
        offset += len;
      }
      remaining = remaining.slice(row.length);
      if (isWide) { cx += thick; cw -= thick; } else { cy += thick; ch -= thick; }
    }
    return rects;
  };

  const rects = layoutRows(items, 0, 0, 100, 100);
  const maxAbs = Math.max(...items.map(s => Math.abs(s.c24h)), 3);
  const heatColor = (v) => {
    const t = Math.min(Math.abs(v) / maxAbs, 1);
    if (v >= 0) return `rgba(0,200,150,${0.15 + t * 0.65})`;
    return `rgba(255,77,109,${0.15 + t * 0.65})`;
  };

  return (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.textBright, textTransform: "uppercase", letterSpacing: 1 }}>Heatmapa rynku</div>
        <div style={{ display: "flex", gap: 8, fontSize: 10, color: theme.textSecondary }}>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#ff4d6d" }} /> Spadek</span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#444" }} /> 0%</span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#00c896" }} /> Wzrost</span>
        </div>
      </div>
      <div style={{ position: "relative", width: "100%", paddingBottom: "50%", overflow: "hidden" }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {rects.map(r => (
            <g key={r.ticker} onClick={() => onSelect(r)} style={{ cursor: "pointer" }}>
              <rect x={r.rx} y={r.ry} width={Math.max(r.rw - 0.15, 0)} height={Math.max(r.rh - 0.15, 0)} rx="0.3"
                fill={heatColor(r.c24h)} stroke={theme.border} strokeWidth="0.15" />
              {r.rw > 6 && r.rh > 5 && (
                <>
                  <text x={r.rx + r.rw / 2} y={r.ry + r.rh / 2 - (r.rh > 10 ? 1.2 : 0)} textAnchor="middle" dominantBaseline="central"
                    fill={theme.textBright} fontSize={r.rw > 12 ? 2.2 : 1.6} fontWeight="800" fontFamily="'Space Grotesk',sans-serif">{r.ticker}</text>
                  {r.rh > 10 && (
                    <text x={r.rx + r.rw / 2} y={r.ry + r.rh / 2 + 2.2} textAnchor="middle" dominantBaseline="central"
                      fill={changeColor(r.c24h)} fontSize={1.5} fontWeight="700" fontFamily="'Space Grotesk',sans-serif">
                      {r.c24h > 0 ? "+" : ""}{r.c24h.toFixed(1)}%
                    </text>
                  )}
                </>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

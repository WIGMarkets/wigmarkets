import { useState, useEffect } from "react";
import { FEAR_COMPONENTS, FEAR_HISTORY } from "../data/constants.js";

export default function FearGauge({ value = 62, isMobile, theme }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 300); }, []);

  const getLabel = (v) => {
    if (v < 25) return "Skrajna panika";
    if (v < 45) return "Strach";
    if (v < 55) return "Neutralny";
    if (v < 75) return "Chciwość";
    return "Ekstremalna chciwość";
  };
  const getColor = (v) => {
    if (v < 25) return "#ef4444";
    if (v < 45) return "#f97316";
    if (v < 55) return "#eab308";
    if (v < 75) return "#22c55e";
    return "#16a34a";
  };

  const color = getColor(value);
  const angle = animated ? (value / 100) * 180 - 90 : -90;

  const arcD = (deg1, deg2, r = 70) => {
    const toRad = (d) => ((d - 180) * Math.PI) / 180;
    const cx = 100, cy = 88;
    const x1 = cx + r * Math.cos(toRad(deg1)), y1 = cy + r * Math.sin(toRad(deg1));
    const x2 = cx + r * Math.cos(toRad(deg2)), y2 = cy + r * Math.sin(toRad(deg2));
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${deg2 - deg1 >= 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  };
  const fillDeg = Math.min(Math.max((value / 100) * 180, 1), 179);

  const SW = 240, SH = 36;
  const vmin = 20, vmax = 90;
  const sparkPts = FEAR_HISTORY.map((v, i) => {
    const x = 2 + (i / (FEAR_HISTORY.length - 1)) * (SW - 4);
    const y = SH - 2 - ((v - vmin) / (vmax - vmin)) * (SH - 5);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const lastPt = FEAR_HISTORY[FEAR_HISTORY.length - 1];
  const lastX = (SW - 2).toFixed(1);
  const lastY = (SH - 2 - ((lastPt - vmin) / (vmax - vmin)) * (SH - 5)).toFixed(1);

  return (
    <div style={{ background: `linear-gradient(135deg, ${theme.bgCardAlt} 0%, ${theme.bgCard} 100%)`, border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 14, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <span style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--font-ui)" }}>Fear & Greed Index</span>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 32, fontWeight: 700, color, lineHeight: 1, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{value}</div>
          <div style={{ fontSize: 10, color, fontWeight: 600, marginTop: 3, fontFamily: "var(--font-ui)" }}>{getLabel(value)}</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg width={190} height={102} viewBox="0 0 200 102">
          <path d={arcD(0, 180)} fill="none" stroke={theme.bgCardAlt} strokeWidth="7" strokeLinecap="butt" />
          <path d={arcD(0, fillDeg)} fill="none" stroke={color} strokeWidth="7" strokeLinecap="butt"
            style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: animated ? undefined : "none" }} />
          <g transform={`rotate(${angle}, 100, 88)`}
            style={{ transition: "transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
            <line x1="100" y1="88" x2="100" y2="26" stroke={theme.textBright} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          </g>
          <circle cx="100" cy="88" r="4" fill={theme.bgCard} stroke={theme.border} strokeWidth="1.5" />
          <text x="16" y="102" fill={theme.textSecondary} fontSize="7.5" textAnchor="middle" opacity="0.6" fontFamily="'IBM Plex Sans',sans-serif">Panika</text>
          <text x="184" y="102" fill={theme.textSecondary} fontSize="7.5" textAnchor="middle" opacity="0.6" fontFamily="'IBM Plex Sans',sans-serif">Chciwość</text>
        </svg>
      </div>

      <div style={{ marginTop: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: theme.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--font-ui)" }}>30 dni</span>
          <span style={{ fontSize: 9, color: theme.textMuted, fontWeight: 600, fontFamily: "var(--font-ui)" }}>Historia</span>
        </div>
        <svg width="100%" height={SH + 2} viewBox={`0 0 ${SW} ${SH + 2}`} preserveAspectRatio="none" style={{ display: "block" }}>
          <defs>
            <linearGradient id="fgAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <polygon points={`2,${SH} ${sparkPts} ${SW - 2},${SH}`} fill="url(#fgAreaGrad)" />
          <polyline points={sparkPts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" opacity="0.65" />
          <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
        </svg>
      </div>

      {!isMobile && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${theme.border}` }}>
          {FEAR_COMPONENTS.map((f) => (
            <div key={f.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0" }}>
              <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: "var(--font-ui)" }}>{f.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 48, height: 3, background: theme.bgCardAlt, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${f.val}%`, height: "100%", background: getColor(f.val), borderRadius: 2, transition: "width 0.4s ease" }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: getColor(f.val), width: 22, textAlign: "right", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{f.val}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

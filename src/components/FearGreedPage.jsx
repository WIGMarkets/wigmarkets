import { useState, useEffect } from "react";
import { FEAR_COMPONENTS, FEAR_HISTORY } from "../data/constants.js";

const DESCS = {
  "Momentum rynku":             "Porównuje bieżące kursy WIG20 do średnich kroczących z 60 i 125 dni. Wzrost ponad średnią oznacza chciwość.",
  "Siła wolumenu":              "Stosunek wolumenu w dniach wzrostowych do dni spadkowych na GPW. Przewaga kupujących to sygnał chciwości.",
  "Szerokość rynku":            "Procent spółek WIG rosnących powyżej swojej 52-tygodniowej średniej. Im więcej spółek uczestniczy we wzrostach, tym wyższy wskaźnik.",
  "Zmienność (VIX GPW)":        "Implikowana zmienność opcji na WIG20. Wysoka zmienność towarzyszy panice; niska — spokojowi i chciwości.",
  "Put/Call ratio":             "Stosunek zakupionych opcji put do call. Wzrost świadczy o zabezpieczaniu portfeli i rosnącym strachu.",
  "Popyt na bezpieczne aktywa": "Napływy do obligacji skarbowych i złota kosztem akcji GPW. Im wyższy popyt na bezpieczne przystanie, tym niższy wskaźnik.",
};

function getLabel(v) {
  if (v < 25) return "Skrajna panika";
  if (v < 45) return "Strach";
  if (v < 55) return "Neutralny";
  if (v < 75) return "Chciwość";
  return "Ekstremalna chciwość";
}
function getColor(v) {
  if (v < 25) return "#dc2626";
  if (v < 45) return "#ea580c";
  if (v < 55) return "#ca8a04";
  if (v < 75) return "#16a34a";
  return "#15803d";
}

export default function FearGreedPage({ onBack, theme }) {
  const value = FEAR_HISTORY[FEAR_HISTORY.length - 1];
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 300); }, []);

  const isMobile = window.innerWidth < 768;
  const color = getColor(value);
  const label = getLabel(value);

  // Large gauge SVG
  const cx = 160, cy = 140, R = 110;
  const angle = animated ? (value / 100) * 180 - 90 : -90;
  const fillDeg = Math.min(Math.max((value / 100) * 180, 1), 179);
  const arcD = (deg1, deg2) => {
    const toRad = (d) => ((d - 180) * Math.PI) / 180;
    const x1 = cx + R * Math.cos(toRad(deg1)), y1 = cy + R * Math.sin(toRad(deg1));
    const x2 = cx + R * Math.cos(toRad(deg2)), y2 = cy + R * Math.sin(toRad(deg2));
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${deg2 - deg1 >= 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  };

  // History chart
  const weekAgo = FEAR_HISTORY[FEAR_HISTORY.length - 8];
  const monthAgo = FEAR_HISTORY[0];
  const min30 = Math.min(...FEAR_HISTORY);
  const max30 = Math.max(...FEAR_HISTORY);

  const CW = 600, CH = 120;
  const vmin = 15, vmax = 95;
  const toY = (v) => CH - 10 - ((v - vmin) / (vmax - vmin)) * (CH - 20);
  const chartPts = FEAR_HISTORY.map((v, i) => {
    const x = 10 + (i / (FEAR_HISTORY.length - 1)) * (CW - 20);
    return `${x.toFixed(1)},${toY(v).toFixed(1)}`;
  }).join(" ");
  const lastX = (CW - 10).toFixed(1);
  const lastY = toY(FEAR_HISTORY[FEAR_HISTORY.length - 1]).toFixed(1);
  const neutralY = toY(50).toFixed(1);

  // Zone labels for gauge
  const zones = [
    { deg: 9,   label: "0", small: true },
    { deg: 45,  label: "25" },
    { deg: 90,  label: "50" },
    { deg: 135, label: "75" },
    { deg: 171, label: "100", small: true },
  ];

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "inherit" }}>
      {/* Header */}
      <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}`, padding: "12px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: `1px solid ${theme.border}`, color: theme.text, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}
        >
          ← Powrót
        </button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: theme.textBright }}>GPW Fear & Greed Index</div>
          <div style={{ fontSize: 11, color: theme.textSecondary }}>Wskaźnik sentymentu rynku Giełdy Papierów Wartościowych</div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "20px 14px" : "36px 24px" }}>

        {/* Hero — large gauge */}
        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? "24px 16px" : "36px 32px", marginBottom: 20, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <svg width={isMobile ? 260 : 320} height={isMobile ? 135 : 165} viewBox="0 0 320 165">
              {/* Background arc */}
              <path d={arcD(0, 180)} fill="none" stroke={theme.bgCardAlt} strokeWidth="11" strokeLinecap="butt" />
              {/* Colored fill arc */}
              <path d={arcD(0, fillDeg)} fill="none" stroke={color} strokeWidth="11" strokeLinecap="butt" />
              {/* Needle */}
              <g transform={`rotate(${angle}, ${cx}, ${cy})`}
                style={{ transition: animated ? "transform 0.9s cubic-bezier(0.22,0.61,0.36,1)" : "none" }}>
                <line x1={cx} y1={cy} x2={cx} y2={cy - 95} stroke={theme.textBright} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              </g>
              <circle cx={cx} cy={cy} r="6" fill={theme.bgCard} stroke={theme.border} strokeWidth="2" />
              {/* Zone labels */}
              <text x="22" y="162" fill={theme.textSecondary} fontSize="9.5" textAnchor="middle" opacity="0.6" fontFamily="inherit">Panika</text>
              <text x="298" y="162" fill={theme.textSecondary} fontSize="9.5" textAnchor="middle" opacity="0.6" fontFamily="inherit">Chciwość</text>
              <text x={cx} y="16" fill={theme.textSecondary} fontSize="8.5" textAnchor="middle" opacity="0.5" fontFamily="inherit">50 — Neutralny</text>
            </svg>
          </div>

          <div style={{ marginTop: -8 }}>
            <div style={{ fontSize: isMobile ? 52 : 64, fontWeight: 800, color, lineHeight: 1, letterSpacing: -2 }}>{value}</div>
            <div style={{ fontSize: isMobile ? 16 : 20, color, fontWeight: 700, marginTop: 4 }}>{label}</div>
          </div>

          {/* Historical context row */}
          <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? 12 : 32, marginTop: 24, flexWrap: "wrap" }}>
            {[
              { label: "Tydzień temu", val: weekAgo },
              { label: "Miesiąc temu", val: monthAgo },
              { label: "Min 30d", val: min30 },
              { label: "Max 30d", val: max30 },
            ].map(({ label: lbl, val }) => (
              <div key={lbl} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 2 }}>{lbl}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: getColor(val) }}>{val}</div>
                <div style={{ fontSize: 10, color: getColor(val), fontWeight: 600 }}>{getLabel(val)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 30-day history chart */}
        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? "16px 12px" : "24px 24px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: theme.textBright }}>Historia 30 dni</span>
            <span style={{ fontSize: 11, color: theme.textSecondary }}>Ostatni punkt: {value}</span>
          </div>
          <div style={{ position: "relative" }}>
            <svg width="100%" height={130} viewBox={`0 0 ${CW} ${CH + 10}`} preserveAspectRatio="none" style={{ display: "block" }}>
              <defs>
                <linearGradient id="fgPageGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                </linearGradient>
              </defs>
              {/* Horizontal gridlines */}
              {[25, 50, 75].map(gv => {
                const gy = toY(gv).toFixed(1);
                return (
                  <g key={gv}>
                    <line x1="10" y1={gy} x2={CW - 10} y2={gy} stroke={theme.border} strokeWidth="0.8" strokeDasharray="4 4" opacity="0.5" />
                    <text x="4" y={Number(gy) + 3} fill={theme.textSecondary} fontSize="8" textAnchor="end" fontFamily="inherit" opacity="0.7">{gv}</text>
                  </g>
                );
              })}
              {/* Neutral reference line */}
              <line x1="10" y1={neutralY} x2={CW - 10} y2={neutralY} stroke={theme.textSecondary} strokeWidth="1" strokeDasharray="6 3" opacity="0.3" />
              {/* Area fill */}
              <polygon points={`10,${CH - 10} ${chartPts} ${CW - 10},${CH - 10}`} fill="url(#fgPageGrad)" />
              {/* Line */}
              <polyline points={chartPts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
              {/* Last point dot */}
              <circle cx={lastX} cy={lastY} r="4" fill={color} />
            </svg>
            {/* Axis labels overlaid */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: theme.textSecondary, marginTop: 4, paddingLeft: 6, paddingRight: 6 }}>
              <span>30 dni temu</span>
              <span>dziś</span>
            </div>
          </div>
        </div>

        {/* Component breakdown */}
        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? "16px 12px" : "24px 24px", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.textBright, marginBottom: 16 }}>Składowe indeksu</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            {FEAR_COMPONENTS.map((f) => {
              const fc = getColor(f.val);
              const fl = getLabel(f.val);
              const desc = DESCS[f.label] ?? "";
              return (
                <div key={f.label} style={{ background: theme.bgCardAlt ?? theme.bg, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: theme.textBright, lineHeight: 1.3 }}>{f.label}</div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: fc, lineHeight: 1 }}>{f.val}</div>
                      <div style={{ fontSize: 10, color: fc, fontWeight: 600 }}>{fl}</div>
                    </div>
                  </div>
                  <div style={{ background: theme.border, borderRadius: 4, height: 8, marginBottom: 8, overflow: "hidden" }}>
                    <div style={{ width: `${f.val}%`, height: "100%", background: fc, borderRadius: 4, transition: "width 0.8s ease" }} />
                  </div>
                  <div style={{ fontSize: 11, color: theme.textSecondary, lineHeight: 1.5 }}>{desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Methodology note */}
        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? "16px 12px" : "20px 24px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.textBright, marginBottom: 8 }}>Metodologia</div>
          <p style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.7, margin: 0 }}>
            GPW Fear & Greed Index to syntetyczny wskaźnik sentymentu inwestorów na Giełdzie Papierów Wartościowych w Warszawie.
            Obliczany jest jako ważona średnia sześciu składowych: momentum rynku, siły wolumenu, szerokości rynku,
            zmienności implikowanej, wskaźnika put/call oraz popytu na bezpieczne aktywa.
            Wartości w przedziale 0–24 oznaczają skrajną panikę, 25–44 strach, 45–54 neutralność,
            55–74 chciwość, a 75–100 ekstremalną chciwość. Dane są aktualizowane raz dziennie.
          </p>
        </div>

      </div>
    </div>
  );
}

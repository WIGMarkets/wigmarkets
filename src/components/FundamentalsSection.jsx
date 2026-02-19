import { SECTOR_AVERAGES } from "../data/constants.js";
import FinancialBarChart from "./FinancialBarChart.jsx";

export default function FundamentalsSection({ stock, fundamentals, loading, currentPrice, theme, isMobile }) {
  const sectorAvg = SECTOR_AVERAGES[stock.sector] || SECTOR_AVERAGES["default"];

  const fmtBig = (v) => {
    if (v === null || v === undefined) return "—";
    const abs = Math.abs(v);
    if (abs >= 1000) return `${(v / 1000).toFixed(1)} mld`;
    if (abs >= 1) return `${v.toFixed(0)} mln`;
    return `${v.toFixed(2)}`;
  };
  const fmtSmall = (v, decimals = 2) => v !== null && v !== undefined ? v.toFixed(decimals) : "—";

  const cur = fundamentals?.current || {};
  const bvps = cur.bookValue ?? null;
  const pb = (bvps && bvps > 0 && currentPrice) ? parseFloat((currentPrice / bvps).toFixed(2)) : null;

  const ebitdaVal = cur.ebitda ?? null;
  const netDebtVal = cur.netDebt ?? null;
  const evEbitda = (() => {
    if (!ebitdaVal || ebitdaVal <= 0 || !stock.cap) return null;
    const ev = stock.cap + (netDebtVal ?? 0);
    const ratio = parseFloat((ev / ebitdaVal).toFixed(1));
    return (ratio > 0 && ratio < 200) ? ratio : null;
  })();

  const pe = stock.pe > 0 ? stock.pe : null;
  const div = stock.div > 0 ? stock.div : null;

  const valStatus = (value, sectorVal, higherIsBad) => {
    if (!value || !sectorVal) return null;
    const r = value / sectorVal;
    if (higherIsBad) {
      if (r < 0.8) return { label: "Tania", color: "#00c896" };
      if (r > 1.2) return { label: "Droga", color: "#ff4d6d" };
      return { label: "Neutralna", color: "#ffd700" };
    } else {
      if (r > 1.2) return { label: "Wysoka", color: "#00c896" };
      if (r < 0.8) return { label: "Niska", color: "#ff4d6d" };
      return { label: "Średnia", color: "#ffd700" };
    }
  };

  const metricCards = [
    { abbr: "P",   label: "Przychody (TTM)",      value: fmtBig(cur.revenue),   color: "#58a6ff" },
    { abbr: "ZN",  label: "Zysk netto (TTM)",      value: fmtBig(cur.netIncome), color: cur.netIncome >= 0 ? "#00c896" : "#ff4d6d" },
    { abbr: "EB",  label: "EBITDA",                value: fmtBig(cur.ebitda),    color: "#a371f7" },
    { abbr: "EPS", label: "EPS",                   value: cur.eps !== null ? `${fmtSmall(cur.eps)} PLN` : "—", color: "#ffd700" },
    { abbr: "WK",  label: "Wart. księgowa/akcję",  value: bvps !== null ? `${fmtSmall(bvps)} PLN` : "—", color: "#58a6ff" },
    { abbr: "DN",  label: "Zadłużenie netto",      value: fmtBig(cur.netDebt),  color: "#ff4d6d" },
  ];

  const valuations = [
    { label: "C/Z (P/E)",       value: pe,       unit: "x",  sectorVal: sectorAvg.pe,       higherIsBad: true,  desc: `Śr. sektor: ${sectorAvg.pe ?? "—"}x` },
    { label: "C/WK (P/B)",      value: pb,       unit: "x",  sectorVal: sectorAvg.pb,       higherIsBad: true,  desc: `Śr. sektor: ${sectorAvg.pb ?? "—"}x` },
    { label: "EV/EBITDA",       value: evEbitda, unit: "x",  sectorVal: sectorAvg.evEbitda, higherIsBad: true,  desc: sectorAvg.evEbitda ? `Śr. sektor: ${sectorAvg.evEbitda}x` : "Brak danych sektora" },
    { label: "Stopa dywidendy", value: div,      unit: "%",  sectorVal: sectorAvg.div,      higherIsBad: false, desc: `Śr. sektor: ${sectorAvg.div ?? 0}%` },
  ];

  if (loading) {
    return (
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? 16 : 24, marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>Dane fundamentalne</div>
        <div style={{ color: theme.textSecondary, fontSize: 12, padding: "24px 0", textAlign: "center" }}>Ładowanie danych fundamentalnych...</div>
      </div>
    );
  }

  const hasAnnual = (fundamentals?.annual || []).some(d => d.revenue !== null || d.netIncome !== null);
  const hasCurrentData = Object.values(cur).some(v => v !== null);

  return (
    <>
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? 16 : 24, marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>Dane fundamentalne</div>
        {!hasCurrentData ? (
          <div style={{ color: theme.textSecondary, fontSize: 12, textAlign: "center", padding: "16px 0" }}>
            Brak danych fundamentalnych dla tej spółki w Yahoo Finance
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 12 }}>
            {metricCards.map(({ abbr, label, value, color }) => (
              <div key={label} style={{ background: theme.bgCardAlt, borderRadius: 12, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: `${color}18`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color, letterSpacing: -0.5 }}>{abbr}</div>
                <div>
                  <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: theme.textBright }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {hasAnnual && (
        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? 16 : 24, marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4, fontWeight: 600 }}>Przychody i zysk netto — ostatnie lata</div>
          <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 16 }}>Wartości w mln PLN (M) lub mld PLN (B)</div>
          <div style={{ background: theme.bgPage, borderRadius: 12, padding: "12px 8px" }}>
            <FinancialBarChart annual={fundamentals.annual} theme={theme} />
          </div>
        </div>
      )}

      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? 16 : 24, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, flexWrap: "wrap", gap: 6 }}>
          <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>Wskaźniki wyceny vs sektor</div>
          <div style={{ fontSize: 11, background: `${theme.accent}18`, color: theme.accent, borderRadius: 6, padding: "3px 10px", fontWeight: 600 }}>{stock.sector}</div>
        </div>
        <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 20 }}>Porównanie do średniej sektorowej GPW</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
          {valuations.map(({ label, value, unit, sectorVal, higherIsBad, desc }) => {
            const status = valStatus(value, sectorVal, higherIsBad);
            const pct = (value && sectorVal) ? Math.min(Math.max((value / sectorVal) * 50, 5), 95) : 50;
            return (
              <div key={label} style={{ background: theme.bgCardAlt, borderRadius: 12, padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, color: theme.textSecondary, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: theme.textBright, marginTop: 2 }}>
                      {value !== null ? `${typeof value === "number" ? (Number.isInteger(value) ? value : value.toFixed(1)) : value}${unit}` : "—"}
                    </div>
                  </div>
                  {status && (
                    <div style={{ background: `${status.color}20`, color: status.color, borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700 }}>
                      {status.label}
                    </div>
                  )}
                </div>
                <div style={{ position: "relative", height: 6, background: theme.border, borderRadius: 4, marginBottom: 8 }}>
                  <div style={{ position: "absolute", left: "50%", top: -3, width: 2, height: 12, background: theme.textSecondary, borderRadius: 2, transform: "translateX(-50%)" }} />
                  {value !== null && sectorVal !== null && (
                    <div style={{ position: "absolute", left: `${pct}%`, top: "50%", width: 10, height: 10, borderRadius: "50%", background: status?.color || theme.accent, border: `2px solid ${theme.bgCard}`, transform: "translate(-50%, -50%)", boxShadow: `0 0 6px ${status?.color || theme.accent}88` }} />
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: theme.textSecondary }}>
                  <span>Tani</span>
                  <span>{desc}</span>
                  <span>Drogi</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

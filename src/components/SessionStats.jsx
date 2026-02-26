import { useMemo } from "react";
import { fmt, fmtVolume } from "../lib/formatters.js";
import CompanyMonogram from "./CompanyMonogram.jsx";

export default function SessionStats({ liveStocks, prices, changes, theme, onSelect }) {
  const stats = useMemo(() => {
    let rising = 0, falling = 0, unchanged = 0;
    for (const s of liveStocks) {
      if (!changes[s.ticker]) continue; // skip companies without real data
      const c = changes[s.ticker].change24h ?? 0;
      if (c > 0) rising++;
      else if (c < 0) falling++;
      else unchanged++;
    }
    const total = rising + falling + unchanged;
    const totalCapMln = liveStocks.reduce((a, s) => a + (s.cap || 0), 0);
    const totalTurnover = liveStocks.reduce((a, s) => {
      const vol = changes[s.ticker]?.volume ?? 0;
      const price = prices[s.ticker] ?? 0;
      return a + vol * price;
    }, 0);
    const mostActive = [...liveStocks]
      .map(s => ({ ...s, turnover: (changes[s.ticker]?.volume ?? 0) * (prices[s.ticker] ?? 0) }))
      .sort((a, b) => b.turnover - a.turnover)
      .slice(0, 3);

    return { rising, falling, unchanged, total, totalCapMln, totalTurnover, mostActive };
  }, [liveStocks, changes, prices]);

  const { rising, falling, unchanged, total, totalCapMln, totalTurnover, mostActive } = stats;
  const risingPct = total > 0 ? ((rising / total) * 100) : 0;
  const fallingPct = total > 0 ? ((falling / total) * 100) : 0;

  function fmtTurnover(v) {
    if (v >= 1e9) return `${(v / 1e9).toFixed(2)} mld zł`;
    if (v >= 1e6) return `${(v / 1e6).toFixed(1)} mln zł`;
    if (v >= 1e3) return `${(v / 1e3).toFixed(0)} tys zł`;
    return "—";
  }

  function fmtTurnoverShort(v) {
    if (v >= 1e9) return `${(v / 1e9).toFixed(1)} mld`;
    if (v >= 1e6) return `${(v / 1e6).toFixed(1)} mln`;
    if (v >= 1e3) return `${(v / 1e3).toFixed(0)} tys`;
    return "—";
  }

  const statRow = (label, value, color) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0" }}>
      <span style={{ fontSize: 12, color: theme.textSecondary, fontFamily: "var(--font-ui)" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: color || theme.textBright, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );

  return (
    <div style={{
      background: `linear-gradient(135deg, ${theme.bgCardAlt} 0%, ${theme.bgCard} 100%)`,
      border: `1px solid rgba(255,255,255,0.06)`,
      borderRadius: 14,
      padding: 20,
    }}>
      <div style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16, fontWeight: 600, fontFamily: "var(--font-ui)" }}>
        Statystyki sesji
      </div>

      {/* Progress bar header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: "var(--font-ui)" }}>Spółki rosnące / spadające</span>
        <span style={{ fontSize: 12, color: theme.textBright, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{rising} / {total}</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 8, borderRadius: 4, background: theme.bgElevated, overflow: "hidden", display: "flex", marginBottom: 14 }}>
        {risingPct > 0 && (
          <div style={{ width: `${risingPct}%`, background: "#22c55e", borderRadius: risingPct >= 100 ? 4 : "4px 0 0 4px", transition: "width 0.3s" }} />
        )}
        {fallingPct > 0 && (
          <div style={{ width: `${fallingPct}%`, background: "#ef4444", marginLeft: "auto", borderRadius: fallingPct >= 100 ? 4 : "0 4px 4px 0", transition: "width 0.3s" }} />
        )}
      </div>

      {/* Breakdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
        {[
          { label: "Wzrosty", count: rising, pct: total > 0 ? (rising / total * 100).toFixed(1) : "0", color: "#22c55e" },
          { label: "Spadki", count: falling, pct: total > 0 ? (falling / total * 100).toFixed(1) : "0", color: "#ef4444" },
          { label: "Bez zmian", count: unchanged, pct: total > 0 ? (unchanged / total * 100).toFixed(1) : "0", color: theme.textMuted },
        ].map(row => (
          <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: row.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: theme.textSecondary, fontFamily: "var(--font-ui)", flex: 1 }}>{row.label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: theme.textBright, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", minWidth: 28, textAlign: "right" }}>{row.count}</span>
            <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", minWidth: 44, textAlign: "right" }}>{row.pct}%</span>
          </div>
        ))}
      </div>

      {/* Separator */}
      <div style={{ borderTop: `1px solid ${theme.border}`, marginBottom: 10 }} />

      {/* Market metrics */}
      {totalTurnover > 0 && statRow("Obrót rynku", fmtTurnover(totalTurnover))}
      {statRow("Kap. łączna", `${fmt(totalCapMln / 1000, 1)} mld zł`, "#3b82f6")}

      {/* Separator */}
      {mostActive.length > 0 && mostActive[0].turnover > 0 && (
        <>
          <div style={{ borderTop: `1px solid ${theme.border}`, margin: "10px 0" }} />
          <div style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600, fontFamily: "var(--font-ui)" }}>
            Najbardziej aktywne (obrót)
          </div>
          {mostActive.map((s, i) => (
            <div
              key={s.ticker}
              onClick={() => onSelect?.(s)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < mostActive.length - 1 ? `1px solid ${theme.border}` : "none", cursor: "pointer", transition: "background 0.15s", borderRadius: 4, margin: "0 -4px", paddingLeft: 4, paddingRight: 4 }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontSize: 10, color: theme.textMuted, fontFamily: "var(--font-mono)", width: 14, textAlign: "right", flexShrink: 0 }}>{i + 1}.</span>
              <CompanyMonogram ticker={s.ticker} sector={s.sector} size={22} />
              <span style={{ fontSize: 12, fontWeight: 600, color: theme.textBright, fontFamily: "var(--font-ui)", flex: 1 }}>{s.ticker}</span>
              <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{fmtTurnoverShort(s.turnover)}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

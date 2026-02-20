import { fmt, changeColor, changeFmt } from "../utils.js";

export default function MarqueeTicker({ stocks, prices, changes, theme, onSelect }) {
  const items = stocks.filter(s => prices[s.ticker]).sort((a, b) => (b.cap || 0) - (a.cap || 0)).slice(0, 40);
  if (!items.length) return null;
  const row = items.map((s, i) => {
    const c = changes[s.ticker]?.change24h ?? 0;
    return (
      <span key={s.ticker} style={{ display: "inline-flex", alignItems: "center", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
        <span onClick={() => onSelect(s)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "0 18px" }}>
          <span style={{ fontWeight: 600, fontSize: 12, color: theme.textBright, fontFamily: "var(--font-ui)", letterSpacing: "0.01em" }}>{s.ticker}</span>
          <span style={{ fontSize: 12, color: theme.text, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{fmt(prices[s.ticker])}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: changeColor(c), fontFamily: "var(--font-mono)" }}>{changeFmt(c)}</span>
        </span>
        <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
      </span>
    );
  });
  return (
    <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}`, overflow: "hidden", position: "relative", height: 36, display: "flex", alignItems: "center" }}>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      <div style={{ display: "flex", animation: "marquee 80s linear infinite", width: "max-content" }}>
        {row}{row}
      </div>
    </div>
  );
}

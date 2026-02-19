import { fmt, changeColor, changeFmt } from "../utils.js";

export default function MarqueeTicker({ stocks, prices, changes, theme, onSelect }) {
  const items = stocks.filter(s => prices[s.ticker]);
  if (!items.length) return null;
  const row = items.map(s => {
    const c = changes[s.ticker]?.change24h ?? 0;
    return (
      <span key={s.ticker} onClick={() => onSelect(s)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "0 18px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
        <span style={{ fontWeight: 700, fontSize: 11, color: theme.textBright }}>{s.ticker}</span>
        <span style={{ fontSize: 11, color: theme.text }}>{fmt(prices[s.ticker])}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: changeColor(c) }}>{changeFmt(c)}</span>
      </span>
    );
  });
  return (
    <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}`, overflow: "hidden", position: "relative", height: 32, display: "flex", alignItems: "center" }}>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      <div style={{ display: "flex", animation: "marquee 120s linear infinite", width: "max-content" }}>
        {row}{row}
      </div>
    </div>
  );
}

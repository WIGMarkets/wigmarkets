import { fmt, changeColor, changeFmt } from "../utils.js";

export default function MarqueeTicker({ stocks, prices, changes, theme, onSelect }) {
  const items = stocks.filter(s => prices[s.ticker]).sort((a, b) => (b.cap || 0) - (a.cap || 0)).slice(0, 40);
  if (!items.length) return null;

  const row = items.map((s) => {
    const c = changes[s.ticker]?.change24h ?? 0;
    return (
      <span key={s.ticker} style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
        <span
          onClick={() => onSelect(s)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "0 22px", cursor: "pointer",
            transition: "opacity 0.15s",
          }}
        >
          <span style={{
            fontWeight: 700, fontSize: 13, color: theme.textBright,
            fontFamily: "var(--font-ui)", letterSpacing: "0.02em",
          }}>{s.ticker}</span>
          <span style={{
            fontSize: 13, color: theme.text,
            fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums",
          }}>{fmt(prices[s.ticker])}</span>
          <span style={{
            fontSize: 12, fontWeight: 600, color: changeColor(c),
            fontFamily: "var(--font-mono)",
            padding: "1px 6px", borderRadius: 4,
            background: c > 0 ? "rgba(34,197,94,0.1)" : c < 0 ? "rgba(239,68,68,0.1)" : "transparent",
          }}>{changeFmt(c)}</span>
        </span>
        <span style={{ width: 1, height: 16, background: theme.border, flexShrink: 0 }} />
      </span>
    );
  });

  return (
    <div
      style={{
        background: theme.bgCard, borderBottom: `1px solid ${theme.border}`,
        overflow: "hidden", position: "relative",
        height: 40, display: "flex", alignItems: "center",
      }}
    >
      <style>{`
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .marquee-track:hover{animation-play-state:paused}
        .marquee-track span:hover{opacity:0.7}
      `}</style>
      <div
        className="marquee-track"
        style={{
          display: "flex",
          animation: "marquee 90s linear infinite",
          width: "max-content",
        }}
      >
        {row}{row}
      </div>
    </div>
  );
}

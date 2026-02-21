import { usePriceFlash } from "../../hooks/usePriceFlash.js";
import Sparkline from "../Sparkline.jsx";
import WatchStar from "../WatchStar.jsx";
import StockLogo from "../StockLogo.jsx";
import { fmt, changeFmt, changeColor, fmtVolume, fmtCap } from "../../lib/formatters.js";

export default function StockTableRow({ s, i, rank, isMobile, tab, theme, prices, changes, watchlist, toggleWatch, navigateToStock, setSelected, setCalcStock, isKeyboardActive, onHover, showPE, showDiv }) {
  const currentPrice = prices[s.ticker];
  const c24h     = changes[s.ticker]?.change24h ?? 0;
  const c7d      = changes[s.ticker]?.change7d  ?? 0;
  const volume   = changes[s.ticker]?.volume    ?? 0;
  const sparkline = changes[s.ticker]?.sparkline ?? null;
  const priceColor = c24h > 0 ? "#22c55e" : c24h < 0 ? "#ef4444" : theme.textBright;
  const flashCls = usePriceFlash(currentPrice);
  const PAD = isMobile ? "16px" : "18px";
  return (
    <tr
      key={s.id}
      className={flashCls}
      onClick={() => isMobile ? setSelected(s) : navigateToStock(s)}
      onMouseEnter={e => { e.currentTarget.style.background = theme.bgCardAlt; e.currentTarget.style.borderLeftColor = theme.accent; onHover?.(); }}
      onMouseLeave={e => { if (!isKeyboardActive) { e.currentTarget.style.background = ""; e.currentTarget.style.borderLeftColor = "transparent"; } }}
      style={{ borderBottom: `1px solid ${theme.border}`, borderLeft: `3px solid ${isKeyboardActive ? theme.accent : "transparent"}`, cursor: "pointer", transition: "background 0.15s, border-color 0.15s", background: isKeyboardActive ? theme.bgCardAlt : "", animationDelay: `${i * 20}ms` }}
    >
      <td style={{ padding: `${PAD} 10px`, textAlign: "center", width: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <WatchStar active={watchlist.has(s.ticker)} onClick={() => toggleWatch(s.ticker)} theme={theme} />
          {!isMobile && <span style={{ fontSize: 10, color: theme.textMuted, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{rank}</span>}
        </div>
      </td>
      <td style={{ padding: `${PAD} ${isMobile ? "10px" : "16px"}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StockLogo ticker={s.ticker} size={isMobile ? 28 : 32} borderRadius={6} sector={s.sector} />
          <div>
            <div style={{ fontWeight: 600, color: theme.textBright, fontSize: isMobile ? 12 : 14, fontFamily: "var(--font-ui)", letterSpacing: "0.01em" }}>{s.ticker}</div>
            <div style={{ fontSize: 11, color: theme.textMuted, maxWidth: isMobile ? 120 : 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: `${PAD} ${isMobile ? "8px" : "16px"}`, textAlign: "right", fontWeight: 600, color: priceColor, fontSize: isMobile ? 13 : 14, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)" }}>{fmt(currentPrice)} {s.unit || "zł"}</td>
      <td style={{ padding: `${PAD} ${isMobile ? "8px" : "16px"}`, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
        <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, fontSize: isMobile ? 11 : 12, fontWeight: 600, background: c24h > 0 ? "rgba(34,197,94,0.12)" : c24h < 0 ? "rgba(239,68,68,0.12)" : "rgba(148,163,184,0.08)", color: changeColor(c24h), whiteSpace: "nowrap", fontFamily: "var(--font-mono)" }}>{changeFmt(c24h)}</span>
      </td>
      {!isMobile && <td style={{ padding: `${PAD} 16px`, textAlign: "right", color: changeColor(c7d), fontSize: 12, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)" }}>{changeFmt(c7d)}</td>}
      {!isMobile && (tab === "akcje" || tab === "screener") && <td style={{ padding: `${PAD} 16px`, textAlign: "right", color: theme.textSecondary, fontSize: 12, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)" }}>{fmtCap(s.cap)}</td>}
      {!isMobile && tab !== "screener" && <td style={{ padding: `${PAD} 16px`, textAlign: "right", color: theme.textSecondary, fontSize: 12, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)" }}>{fmtVolume(volume, currentPrice)}</td>}
      {!isMobile && tab === "akcje" && showPE  && <td style={{ padding: `${PAD} 16px`, textAlign: "right", color: theme.textSecondary, fontSize: 12, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)" }}>{s.pe ? fmt(s.pe) : "—"}</td>}
      {!isMobile && tab === "akcje" && showDiv && <td style={{ padding: `${PAD} 16px`, textAlign: "right", color: s.div > 0 ? "#22c55e" : theme.textSecondary, fontSize: 12, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)" }}>{s.div ? `${fmt(s.div)}%` : "—"}</td>}
      {!isMobile && <td style={{ padding: `${PAD} 16px`, textAlign: "right" }}><Sparkline prices={sparkline} trend={c7d} /></td>}
      {!isMobile && (
        <td style={{ padding: `${PAD} 16px`, textAlign: "right" }}>
          <button
            onClick={e => { e.stopPropagation(); setCalcStock(s); }}
            style={{ padding: "5px 11px", borderRadius: 6, border: `1px solid ${theme.borderInput}`, background: "transparent", color: theme.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "var(--font-ui)", whiteSpace: "nowrap", lineHeight: 1.2, transition: "all 0.15s" }}
            title="Kalkulator zysku/straty"
          >
            P/L
          </button>
        </td>
      )}
    </tr>
  );
}

import { useState, useEffect, useMemo } from "react";
import { fetchHistory } from "../api.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { fmt, changeFmt, getYahooSymbol } from "../utils.js";
import MiniChart from "./MiniChart.jsx";

export default function StockModal({ stock, price, change24h, change7d, onClose, theme }) {
  const [history, setHistory] = useState(null);
  const [range, setRange] = useState("1M");
  const isMobile = useIsMobile();
  const [news, setNews] = useState(null);
  const color = change24h >= 0 ? "#00c896" : "#ff4d6d";

  useEffect(() => {
    fetchHistory(stock.stooq || stock.ticker.toLowerCase()).then(d => setHistory(d?.prices || null));
    fetch(`/api/news?q=${encodeURIComponent(stock.name)}`)
      .then(r => r.json())
      .then(d => setNews(d?.items || []))
      .catch(() => setNews([]));
  }, [stock.ticker, stock.name]);

  const filteredHistory = useMemo(() => {
    if (!history) return [];
    const days = { "1W": 7, "1M": 30, "3M": 90, "1R": 365 };
    return history.slice(-(days[range] || 30));
  }, [history, range]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 8 : 24 }} onClick={onClose}>
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderInput}`, borderRadius: 20, padding: isMobile ? 20 : 32, width: "100%", maxWidth: 720, maxHeight: "95vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg, #1f6feb22, #58a6ff33)", border: "1px solid #58a6ff44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: theme.accent }}>{stock.ticker.slice(0, 2)}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: isMobile ? 16 : 20, color: theme.textBright }}>{stock.ticker}</div>
              <div style={{ fontSize: 11, color: theme.textSecondary }}>{stock.name} · {stock.sector}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: theme.bgCardAlt, border: "none", borderRadius: 8, color: theme.textSecondary, width: 32, height: 32, fontSize: 18, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: theme.textBright }}>{fmt(price)} {stock.unit || "zł"}</div>
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            <span style={{ padding: "4px 12px", borderRadius: 6, background: `${color}20`, color, fontWeight: 700, fontSize: 13 }}>24h: {changeFmt(change24h)}</span>
            <span style={{ padding: "4px 12px", borderRadius: 6, background: `${color}20`, color, fontWeight: 700, fontSize: 13 }}>7d: {changeFmt(change7d)}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {["1W", "1M", "3M", "1R"].map(r => (
            <button key={r} onClick={() => setRange(r)} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid", borderColor: range === r ? theme.accent : theme.borderInput, background: range === r ? "#1f6feb22" : "transparent", color: range === r ? theme.accent : theme.textSecondary, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{r}</button>
          ))}
        </div>
        <div style={{ background: theme.bgPage, borderRadius: 12, padding: "12px 8px", marginBottom: 20 }}>
          <MiniChart data={filteredHistory} color={color} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            ["Kapitalizacja", stock.cap ? `${fmt(stock.cap, 0)} mln zł` : "—"],
            ["C/Z (P/E)", stock.pe > 0 ? fmt(stock.pe) : "—"],
            ["Dywidenda", stock.div > 0 ? `${fmt(stock.div)}%` : "Brak"],
            ["Sektor", stock.sector],
          ].map(([label, val]) => (
            <div key={label} style={{ background: theme.bgCardAlt, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: theme.textBright }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Najnowsze wiadomości</div>
          {news === null && <div style={{ color: theme.textSecondary, fontSize: 12, padding: "12px 0" }}>Ładowanie wiadomości...</div>}
          {news !== null && news.length === 0 && <div style={{ color: theme.textSecondary, fontSize: 12, padding: "12px 0" }}>Brak wiadomości.</div>}
          {news !== null && news.map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noreferrer"
              style={{ display: "block", textDecoration: "none", padding: "10px 0", borderBottom: `1px solid ${theme.border}` }}>
              <div style={{ fontSize: 13, color: theme.textBright, lineHeight: 1.4, marginBottom: 4 }}>{item.title}</div>
              <div style={{ display: "flex", gap: 12, fontSize: 11, color: theme.textSecondary }}>
                {item.source && <span>{item.source}</span>}
                {item.pubDate && <span>{new Date(item.pubDate).toLocaleDateString("pl-PL")}</span>}
              </div>
            </a>
          ))}
        </div>
        <a href={`https://finance.yahoo.com/quote/${getYahooSymbol(stock.stooq || stock.ticker)}`} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", color: theme.accent, fontSize: 12, textDecoration: "none" }}>
          Zobacz pełne dane na Yahoo Finance →
        </a>
      </div>
    </div>
  );
}

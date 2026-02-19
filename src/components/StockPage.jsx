import { useState, useEffect, useMemo } from "react";
import { fetchHistory, fetchFundamentals, fetchIntraday } from "../api.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { fmt, changeFmt, changeColor, calculateRSI, getYahooSymbol, isForex, isCommodity } from "../utils.js";
import LargeChart from "./LargeChart.jsx";
import FundamentalsSection from "./FundamentalsSection.jsx";
import RSIGauge from "./RSIGauge.jsx";
import StockLogo from "./StockLogo.jsx";

export default function StockPage({ stock, prices, changes, onBack, theme }) {
  const [history, setHistory] = useState(null);
  const [intraday, setIntraday] = useState(null);
  const [range, setRange] = useState("3M");
  const [chartType, setChartType] = useState("line");
  const [news, setNews] = useState(null);
  const [fundamentals, setFundamentals] = useState(null);
  const [fundLoading, setFundLoading] = useState(true);
  const isMobile = useIsMobile();

  const currentPrice = prices[stock.ticker];
  const c24h = changes[stock.ticker]?.change24h ?? 0;
  const c7d = changes[stock.ticker]?.change7d ?? 0;
  const color = c24h >= 0 ? "#00c896" : "#ff4d6d";

  const sym = stock.stooq || stock.ticker.toLowerCase();

  useEffect(() => {
    fetchHistory(sym).then(d => setHistory(d?.prices || null));
    fetch(`/api/news?q=${encodeURIComponent(stock.name)}`)
      .then(r => r.json())
      .then(d => setNews(d?.items || []))
      .catch(() => setNews([]));
    setFundLoading(true);
    if (isStock) {
      fetchFundamentals(sym)
        .then(d => { setFundamentals(d); setFundLoading(false); })
        .catch(() => { setFundamentals(null); setFundLoading(false); });
    } else {
      setFundLoading(false);
    }
  }, [stock.ticker, stock.name, stock.stooq]);

  useEffect(() => {
    if (range !== "1D") return;
    setIntraday(null);
    fetchIntraday(sym).then(d => setIntraday(d?.prices || []));
  }, [range, sym]);

  const isStock = !isForex(stock) && !isCommodity(stock);

  useEffect(() => {
    const kind = isForex(stock) ? "kurs walutowy" : isCommodity(stock) ? "notowania" : "kurs akcji";
    document.title = `${stock.name} (${stock.ticker}) — ${kind}, wykres | WIGmarkets`;
    let meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", `Aktualny ${kind} ${stock.name} (${stock.ticker}). Wykres, zmiana 24h/7d. Dane na żywo.`);
  }, [stock.ticker, stock.name]);

  const filteredHistory = useMemo(() => {
    if (!history) return [];
    const days = { "1W": 7, "1M": 30, "3M": 90, "1R": 365 };
    return history.slice(-(days[range] || 90));
  }, [history, range]);

  const chartData  = range === "1D" ? (intraday ?? []) : filteredHistory;
  const isIntraday = range === "1D";

  const rsi = useMemo(() => calculateRSI(history), [history]);

  return (
    <div style={{ minHeight: "100vh", background: theme.bgPage, color: theme.text, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}`, padding: "0 16px" }}>
        <div style={{ display: "flex", gap: 16, padding: "10px 0", alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: theme.bgCardAlt, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.textSecondary, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
            ← Wstecz
          </button>
          <div style={{ fontWeight: 800, fontSize: 16, color: theme.textBright, whiteSpace: "nowrap", cursor: "pointer" }} onClick={onBack}>
            WIG<span style={{ color: theme.accent }}>markets</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "20px 12px" : "32px 24px" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
          <StockLogo ticker={stock.ticker} size={56} borderRadius={14} sector={stock.sector} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: theme.textBright }}>{stock.ticker}</div>
            <div style={{ fontSize: 13, color: theme.textSecondary }}>{stock.name} · {stock.sector}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: theme.textBright }}>{fmt(currentPrice)} {stock.unit || "zł"}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <span style={{ padding: "4px 14px", borderRadius: 8, background: `${changeColor(c24h)}20`, color: changeColor(c24h), fontWeight: 700, fontSize: 13 }}>24h: {changeFmt(c24h)}</span>
              <span style={{ padding: "4px 14px", borderRadius: 8, background: `${changeColor(c7d)}20`, color: changeColor(c7d), fontWeight: 700, fontSize: 13 }}>7d: {changeFmt(c7d)}</span>
            </div>
          </div>
        </div>

        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? 16 : 24, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>Wykres</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["1D", "1W", "1M", "3M", "1R"].map(r => (
                  <button key={r} onClick={() => setRange(r)} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid", borderColor: range === r ? theme.accent : theme.borderInput, background: range === r ? "#1f6feb22" : "transparent", color: range === r ? theme.accent : theme.textSecondary, fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: range === r ? 700 : 400 }}>{r}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 4, marginLeft: 4 }}>
                {[{ key: "line", label: "Linia" }, { key: "candle", label: "Świece" }].map(({ key, label }) => (
                  <button key={key} onClick={() => setChartType(key)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid", borderColor: chartType === key ? theme.accent : theme.borderInput, background: chartType === key ? "#1f6feb22" : "transparent", color: chartType === key ? theme.accent : theme.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: chartType === key ? 700 : 400 }}>{label}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ background: theme.bgPage, borderRadius: 12, padding: "16px 8px" }}>
            <LargeChart data={chartData} color={color} theme={theme} type={chartType} isIntraday={isIntraday} />
          </div>
        </div>

        {isStock && <FundamentalsSection stock={stock} fundamentals={fundamentals} loading={fundLoading} currentPrice={currentPrice} theme={theme} isMobile={isMobile} />}

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24, marginBottom: 24 }}>
          <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? 16 : 24 }}>
            <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>
              {isForex(stock) ? "Dane waluty" : isCommodity(stock) ? "Dane surowca" : "Dane spółki"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                ["Kurs", currentPrice ? `${fmt(currentPrice)} ${stock.unit || "zł"}` : "—"],
                ["Zmiana 24h", changeFmt(c24h)],
                ["Zmiana 7d", changeFmt(c7d)],
                ...(isStock ? [
                  ["Kapitalizacja", stock.cap ? `${fmt(stock.cap, 0)} mln zł` : "—"],
                  ["C/Z (P/E)", stock.pe > 0 ? fmt(stock.pe) : "—"],
                  ["Dywidenda", stock.div > 0 ? `${fmt(stock.div)}%` : "Brak"],
                ] : [
                  ["Sektor", stock.sector],
                ]),
              ].map(([label, val]) => (
                <div key={label} style={{ background: theme.bgCardAlt, borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: label.includes("Zmiana") ? changeColor(label.includes("24h") ? c24h : c7d) : theme.textBright }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? 16 : 24 }}>
              <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>Wskaźnik techniczny</div>
              <RSIGauge value={rsi} theme={theme} />
            </div>
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? 16 : 24 }}>
              <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>Informacje</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["Sektor", stock.sector],
                  ["Yahoo Finance", getYahooSymbol(stock.stooq || stock.ticker)],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${theme.bgCardAlt}`, fontSize: 12 }}>
                    <span style={{ color: theme.textSecondary }}>{label}</span>
                    <span style={{ fontWeight: 600, color: theme.textBright }}>{val}</span>
                  </div>
                ))}
              </div>
              <a href={`https://finance.yahoo.com/quote/${getYahooSymbol(stock.stooq || stock.ticker)}`} target="_blank" rel="noreferrer"
                style={{ display: "block", textAlign: "center", color: theme.accent, fontSize: 12, textDecoration: "none", marginTop: 14, fontWeight: 600 }}>
                Zobacz pełne dane na Yahoo Finance →
              </a>
            </div>
          </div>
        </div>

        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? 16 : 24, marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>Najnowsze wiadomości</div>
          {news === null && <div style={{ color: theme.textSecondary, fontSize: 12, padding: "16px 0" }}>Ładowanie wiadomości...</div>}
          {news !== null && news.length === 0 && <div style={{ color: theme.textSecondary, fontSize: 12, padding: "16px 0" }}>Brak wiadomości dla {stock.name}.</div>}
          {news !== null && news.map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noreferrer"
              style={{ display: "block", textDecoration: "none", padding: "14px 0", borderBottom: i < news.length - 1 ? `1px solid ${theme.border}` : "none" }}>
              <div style={{ fontSize: 14, color: theme.textBright, lineHeight: 1.5, marginBottom: 6, fontWeight: 500 }}>{item.title}</div>
              <div style={{ display: "flex", gap: 12, fontSize: 11, color: theme.textSecondary }}>
                {item.source && <span style={{ fontWeight: 600 }}>{item.source}</span>}
                {item.pubDate && <span>{new Date(item.pubDate).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}</span>}
              </div>
            </a>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "24px", fontSize: 10, color: theme.textSecondary }}>
        WIGmarkets © 2026 · Dane z GPW via Yahoo Finance · Nie stanowią rekomendacji inwestycyjnej
      </div>
    </div>
  );
}

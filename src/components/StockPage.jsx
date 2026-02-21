import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHistory, fetchHourly, fetchFundamentals, fetchIntraday } from "../lib/api.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { fmt, changeFmt, changeColor, calculateRSI, calculateSMA, calculateMACD, getYahooSymbol, isForex, isCommodity } from "../lib/formatters.js";
import { DIVIDENDS } from "../data/dividends.js";
import { getByTicker } from "../data/gpw-companies.js";
import LargeChart from "./LargeChart.jsx";
import FundamentalsSection from "./FundamentalsSection.jsx";
import RSIGauge from "./RSIGauge.jsx";
import StockLogo from "./StockLogo.jsx";
import CompanyMonogram from "./CompanyMonogram.jsx";
import WatchStar from "./WatchStar.jsx";
import Icon from "./edukacja/Icon.jsx";

function fmtVolume(v) {
  if (!v) return "—";
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)} mld`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)} mln`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)} tys`;
  return `${Math.round(v)}`;
}

export default function StockPage({ stock, prices, changes, theme, watchlist, toggleWatch, liveStocks }) {
  const navigate = useNavigate();
  const [history, setHistory] = useState(null);
  const [hourly, setHourly] = useState(null);
  const [intraday, setIntraday] = useState(null);
  const [range, setRange] = useState("3M");
  const [chartType, setChartType] = useState("line");
  const [fundamentals, setFundamentals] = useState(null);
  const [fundLoading, setFundLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const isMobile = useIsMobile();

  const currentPrice = prices[stock.ticker];
  const c24h = changes[stock.ticker]?.change24h ?? 0;
  const c7d = changes[stock.ticker]?.change7d ?? 0;
  const volume = changes[stock.ticker]?.volume ?? 0;
  const color = c24h >= 0 ? "#22c55e" : "#ef4444";

  const sym = stock.stooq || stock.ticker.toLowerCase();
  const isStock = !isForex(stock) && !isCommodity(stock);
  const gpwInfo = isStock ? getByTicker(stock.ticker) : null;
  const yahooSymbol = getYahooSymbol(sym);

  useEffect(() => {
    fetchHistory(sym).then(d => setHistory(d?.prices || null));
    setFundLoading(true);
    if (isStock) {
      fetchFundamentals(sym)
        .then(d => { setFundamentals(d); setFundLoading(false); })
        .catch(() => { setFundamentals(null); setFundLoading(false); });
    } else {
      setFundLoading(false);
    }
  }, [stock.ticker, stock.stooq]);

  useEffect(() => {
    if (range !== "1W") return;
    setHourly(null);
    fetchHourly(sym).then(d => setHourly(d?.prices || []));
  }, [range, sym]);

  useEffect(() => {
    if (range !== "1D") return;
    setIntraday(null);
    fetchIntraday(sym).then(d => setIntraday(d?.prices || []));
  }, [range, sym]);

  useEffect(() => {
    const kind = isForex(stock) ? "kurs walutowy" : isCommodity(stock) ? "notowania" : "kurs akcji";
    document.title = `${stock.name} (${stock.ticker}) — ${kind}, wykres | WIGmarkets`;
    let meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", `Aktualny ${kind} ${stock.name} (${stock.ticker}). Wykres, zmiana 24h/7d. Dane na żywo.`);
  }, [stock.ticker, stock.name]);

  const filteredHistory = useMemo(() => {
    if (!history) return [];
    const now = new Date();
    const days = { "1W": 7, "1M": 30, "3M": 90, "1R": 365, "MAX": 9999 };
    if (range === "YTD") {
      const yearStart = `${now.getFullYear()}-01-01`;
      return history.filter(d => d.date >= yearStart);
    }
    return history.slice(-(days[range] || 90));
  }, [history, range]);

  const chartData  = range === "1D" ? (intraday ?? [])
                   : range === "1W" ? (hourly ?? filteredHistory)
                   : filteredHistory;
  const isIntraday = range === "1D" || range === "1W";

  // Technical indicators
  const rsi = useMemo(() => calculateRSI(history), [history]);
  const closes = useMemo(() => history ? history.map(p => p.close) : [], [history]);
  const sma50 = useMemo(() => calculateSMA(closes, 50), [closes]);
  const sma200 = useMemo(() => calculateSMA(closes, 200), [closes]);
  const macd = useMemo(() => calculateMACD(history), [history]);

  // Calculated stats from history
  const stats52w = useMemo(() => {
    if (!history || history.length < 10) return { high: null, low: null };
    const allCloses = history.map(p => p.close).filter(v => v != null);
    return { high: Math.max(...allCloses), low: Math.min(...allCloses) };
  }, [history]);

  const avgVolume30d = useMemo(() => {
    if (!history || history.length < 5) return null;
    const recent = history.slice(-30).filter(d => d.volume > 0);
    if (recent.length === 0) return null;
    return Math.round(recent.reduce((a, d) => a + d.volume, 0) / recent.length);
  }, [history]);

  const todayOpen = useMemo(() => {
    if (!history || history.length === 0) return null;
    const last = history[history.length - 1];
    return last?.open ?? null;
  }, [history]);

  const todayHighLow = useMemo(() => {
    if (!history || history.length === 0) return { high: null, low: null };
    const last = history[history.length - 1];
    return { high: last?.high ?? null, low: last?.low ?? null };
  }, [history]);

  // 1M and YTD changes
  const change1M = useMemo(() => {
    if (!history || history.length < 22 || !currentPrice) return null;
    const old = history[history.length - 22]?.close;
    return old ? parseFloat(((currentPrice - old) / old * 100).toFixed(2)) : null;
  }, [history, currentPrice]);

  const changeYTD = useMemo(() => {
    if (!history || !currentPrice) return null;
    const yearStart = `${new Date().getFullYear()}-01-01`;
    const first = history.find(d => d.date >= yearStart);
    return first?.close ? parseFloat(((currentPrice - first.close) / first.close * 100).toFixed(2)) : null;
  }, [history, currentPrice]);

  // Overall technical signal
  const signal = useMemo(() => {
    let buy = 0, sell = 0;
    if (rsi != null) { if (rsi < 30) buy++; else if (rsi > 70) sell++; else buy += 0.5, sell += 0.5; }
    if (sma50 != null && currentPrice) { currentPrice > sma50 ? buy++ : sell++; }
    if (sma200 != null && currentPrice) { currentPrice > sma200 ? buy++ : sell++; }
    if (macd) { macd.histogram > 0 ? buy++ : sell++; }
    const total = buy + sell;
    if (total === 0) return null;
    if (buy > sell) return { label: "KUPUJ", color: "#22c55e", buy: Math.round(buy), sell: Math.round(sell) };
    if (sell > buy) return { label: "SPRZEDAJ", color: "#ef4444", buy: Math.round(buy), sell: Math.round(sell) };
    return { label: "NEUTRALNY", color: "#ffd700", buy: Math.round(buy), sell: Math.round(sell) };
  }, [rsi, sma50, sma200, macd, currentPrice]);

  // Dividends for this stock
  const stockDividends = useMemo(() => {
    if (!isStock) return [];
    return DIVIDENDS.filter(d => d.ticker === stock.ticker).sort((a, b) => b.year - a.year);
  }, [stock.ticker, isStock]);

  const latestDiv = stockDividends[0] || null;

  // Similar companies (same sector, excluding self)
  const similarStocks = useMemo(() => {
    if (!isStock || !liveStocks) return [];
    return liveStocks
      .filter(s => s.sector === stock.sector && s.ticker !== stock.ticker)
      .sort((a, b) => (b.cap || 0) - (a.cap || 0))
      .slice(0, 4);
  }, [stock.ticker, stock.sector, liveStocks, isStock]);

  const handleNavigatePortfolio = useCallback(() => {
    navigate("/portfolio");
  }, [navigate]);

  // Card style helper
  const card = (children, style = {}) => (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? 16 : 24, ...style }}>
      {children}
    </div>
  );

  const sectionTitle = (text) => (
    <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, fontWeight: 600, fontFamily: "var(--font-ui)" }}>{text}</div>
  );

  const dataRow = (label, value, valueColor = theme.textBright) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${theme.bgCardAlt}`, fontSize: 12 }}>
      <span style={{ color: theme.textSecondary, fontFamily: "var(--font-ui)" }}>{label}</span>
      <span style={{ fontWeight: 600, color: valueColor, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );

  // ─── RENDER ───────────────────────────────────────────────────

  const chartSection = (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? 16 : 24, ...(fullscreen ? { position: "fixed", inset: 0, zIndex: 5000, borderRadius: 0, overflow: "auto" } : {}) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>Wykres</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {["1D", "1W", "1M", "3M", "1R", "YTD", "MAX"].map(r => (
              <button key={r} onClick={() => setRange(r)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid", borderColor: range === r ? theme.accent : theme.borderInput, background: range === r ? "#3b82f622" : "transparent", color: range === r ? theme.accent : theme.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: range === r ? 700 : 400 }}>{r}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[{ key: "line", label: "Linia" }, { key: "candle", label: "Świece" }].map(({ key, label }) => (
              <button key={key} onClick={() => setChartType(key)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid", borderColor: chartType === key ? theme.accent : theme.borderInput, background: chartType === key ? "#3b82f622" : "transparent", color: chartType === key ? theme.accent : theme.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: chartType === key ? 700 : 400 }}>{label}</button>
            ))}
          </div>
          <button onClick={() => setFullscreen(f => !f)} title={fullscreen ? "Zamknij pełny ekran" : "Pełny ekran"} style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${theme.borderInput}`, background: "transparent", color: theme.textSecondary, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            {fullscreen
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>}
          </button>
        </div>
      </div>
      <div style={{ background: theme.bgPage, borderRadius: 12, padding: "8px 8px 4px" }}>
        <LargeChart data={chartData} color={color} theme={theme} type={chartType} isIntraday={isIntraday} unit={stock.unit || "zł"} />
      </div>
      {fullscreen && (
        <button onClick={() => setFullscreen(false)} style={{ position: "fixed", top: 16, right: 16, zIndex: 5001, padding: "8px 16px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bgCard, color: theme.textBright, fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
          Zamknij
        </button>
      )}
    </div>
  );

  // Quote data from fundamentals API (Yahoo summaryDetail)
  const quoteData = fundamentals?.quote || {};
  const apiMarketCap = quoteData.marketCap;
  const api52wLow = quoteData.fiftyTwoWeekLow;
  const api52wHigh = quoteData.fiftyTwoWeekHigh;
  const apiAvgVol = quoteData.averageVolume3M || quoteData.averageVolume;
  const apiPE = quoteData.trailingPE ?? (stock.pe > 0 ? stock.pe : null);
  const apiPB = quoteData.priceToBook ?? (() => {
    const bvps = fundamentals?.current?.bookValue;
    return (bvps && bvps > 0 && currentPrice) ? parseFloat((currentPrice / bvps).toFixed(2)) : null;
  })();

  // Turnover today (volume × price)
  const turnoverToday = (volume && currentPrice) ? volume * currentPrice : null;

  // Effective 52-week range: prefer API, fallback to computed from history
  const w52Low = api52wLow ?? stats52w.low;
  const w52High = api52wHigh ?? stats52w.high;

  // Effective market cap
  const effectiveCap = apiMarketCap ? Math.round(apiMarketCap / 1e6) : (stock.cap || null);

  // Effective avg volume
  const effectiveAvgVol = apiAvgVol || avgVolume30d;

  const summarySection = card(
    <>
      {sectionTitle("Podsumowanie")}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {dataRow("Kurs", currentPrice ? `${fmt(currentPrice)} ${stock.unit || "zł"}` : "—")}
        {dataRow("Otwarcie", todayOpen ? `${fmt(todayOpen)} ${stock.unit || "zł"}` : "—")}
        {dataRow("Zmiana 24h", changeFmt(c24h), changeColor(c24h))}
        {dataRow("Zmiana 7d", changeFmt(c7d), changeColor(c7d))}
        {dataRow("Min/Max dziś", todayHighLow.low != null ? `${fmt(todayHighLow.low)} / ${fmt(todayHighLow.high)}` : "—")}
        {dataRow("Min/Max 52 tyg.", w52Low != null ? `${fmt(w52Low)} / ${fmt(w52High)}` : "—")}
        {dataRow("Wolumen", fmtVolume(volume))}
        {dataRow("Śr. wolumen (30d)", effectiveAvgVol ? fmtVolume(effectiveAvgVol) : "—")}
        {isStock && dataRow("Kapitalizacja", effectiveCap ? `${effectiveCap >= 1000 ? `${fmt(effectiveCap / 1000, 1)} mld zł` : `${fmt(effectiveCap, 0)} mln zł`}` : "—")}
        {dataRow("Obrót dziś", turnoverToday ? fmtVolume(turnoverToday) : "—")}
        {isStock && dataRow("C/Z (P/E)", apiPE != null ? fmt(apiPE) : "—")}
        {isStock && dataRow("C/WK (P/BV)", apiPB != null ? fmt(apiPB) : "—")}
        {dataRow("Sektor", stock.sector, theme.textSecondary)}
      </div>
    </>
  );

  const technicalSection = card(
    <>
      {sectionTitle("Wskaźniki techniczne")}
      <RSIGauge value={rsi} theme={theme} />
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 0 }}>
        {sma50 != null && (() => {
          const above = currentPrice > sma50;
          return dataRow("SMA 50", `${fmt(sma50)} ${above ? "▲" : "▼"}`, above ? "#22c55e" : "#ef4444");
        })()}
        {sma200 != null && (() => {
          const above = currentPrice > sma200;
          return dataRow("SMA 200", `${fmt(sma200)} ${above ? "▲" : "▼"}`, above ? "#22c55e" : "#ef4444");
        })()}
        {macd && (
          <>
            {dataRow("MACD", fmt(macd.macd), macd.histogram > 0 ? "#22c55e" : "#ef4444")}
            {dataRow("Signal", fmt(macd.signal))}
          </>
        )}
      </div>
      {signal && (
        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: theme.textSecondary, fontWeight: 600 }}>Sygnał ogólny</span>
          <span style={{ padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 800, background: `${signal.color}20`, color: signal.color, letterSpacing: 1 }}>
            {signal.label}
          </span>
        </div>
      )}
      {signal && (
        <div style={{ fontSize: 10, color: theme.textSecondary, marginTop: 6, textAlign: "right" }}>
          {signal.buy} kupuj / {signal.sell} sprzedaj
        </div>
      )}
      {!sma50 && !macd && (
        <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 12, fontStyle: "italic" }}>
          Więcej wskaźników wymaga dłuższej historii danych.
        </div>
      )}
    </>
  );

  const profileSection = isStock && card(
    <>
      {sectionTitle("Profil spółki")}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {dataRow("Nazwa pełna", stock.name)}
        {dataRow("Ticker", stock.ticker)}
        {dataRow("Rynek", "GPW Główny")}
        {dataRow("Sektor", stock.sector)}
        {gpwInfo?.index && dataRow("Indeks", gpwInfo.index)}
      </div>
      <a href={`https://finance.yahoo.com/quote/${yahooSymbol}`} target="_blank" rel="noreferrer"
        style={{ display: "block", textAlign: "center", color: theme.accent, fontSize: 12, textDecoration: "none", marginTop: 14, fontWeight: 600 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          {yahooSymbol} na Yahoo Finance <Icon name="external-link" size={12} />
        </span>
      </a>
    </>
  );

  const dividendsSection = isStock && card(
    <>
      {sectionTitle("Dywidendy")}
      {stockDividends.length === 0 ? (
        <div style={{ fontSize: 12, color: theme.textSecondary, padding: "8px 0" }}>
          Ta spółka nie wypłacała dywidend w ostatnich 5 latach.
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={{ background: theme.bgCardAlt, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Ostatnia dywidenda</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: theme.textBright }}>{latestDiv.divPerShare > 0 ? `${fmt(latestDiv.divPerShare)} zł` : "—"}</div>
            </div>
            <div style={{ background: theme.bgCardAlt, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Stopa dywidendy</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: latestDiv.divYield > 0 ? "#22c55e" : theme.textBright }}>{latestDiv.divYield > 0 ? `${fmt(latestDiv.divYield)}%` : "—"}</div>
            </div>
          </div>
          {latestDiv.history && latestDiv.history.length > 0 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 0, fontSize: 10, fontWeight: 600, color: theme.textSecondary, textTransform: "uppercase", padding: "8px 0", borderBottom: `1px solid ${theme.border}` }}>
                <span>Rok</span><span style={{ textAlign: "right" }}>Kwota</span><span style={{ textAlign: "right" }}>Stopa</span><span style={{ textAlign: "right" }}>Status</span>
              </div>
              {latestDiv.history.slice(0, 5).map((h, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 0, fontSize: 12, padding: "8px 0", borderBottom: `1px solid ${theme.bgCardAlt}`, color: theme.text }}>
                  <span style={{ fontFamily: "var(--font-mono)" }}>{h.year}</span>
                  <span style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{h.amount > 0 ? `${fmt(h.amount)} zł` : "—"}</span>
                  <span style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{h.yield > 0 ? `${fmt(h.yield)}%` : "—"}</span>
                  <span style={{ textAlign: "right", color: h.amount > 0 ? "#22c55e" : theme.textSecondary, fontSize: 11 }}>{h.amount > 0 ? "Wypłacona" : "Brak"}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <div
        onClick={() => navigate("/dywidendy")}
        style={{ display: "block", textAlign: "center", color: theme.accent, fontSize: 12, textDecoration: "none", marginTop: 14, fontWeight: 600, cursor: "pointer" }}>
        Zobacz pełny kalendarz dywidend →
      </div>
    </>
  );

  const similarSection = isStock && similarStocks.length > 0 && card(
    <>
      {sectionTitle(`Podobne spółki — ${stock.sector}`)}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : `repeat(${Math.min(similarStocks.length, 4)}, 1fr)`, gap: 12 }}>
        {similarStocks.map(s => {
          const p = prices[s.ticker];
          const ch = changes[s.ticker]?.change24h ?? 0;
          return (
            <div key={s.ticker} onClick={() => navigate(`/spolka/${s.ticker}`)}
              style={{ background: theme.bgCardAlt, borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "border-color 0.2s, transform 0.15s", border: `1px solid ${theme.border}` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "none"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <CompanyMonogram ticker={s.ticker} sector={s.sector} size={28} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: theme.textBright, fontFamily: "var(--font-ui)" }}>{s.ticker}</div>
                  <div style={{ fontSize: 10, color: theme.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 100 }}>{s.name}</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, fontSize: 12, color: theme.textBright, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{p ? `${fmt(p)} zł` : "—"}</span>
                <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${changeColor(ch)}18`, color: changeColor(ch), fontFamily: "var(--font-mono)" }}>{changeFmt(ch)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>,
    { marginBottom: 24 }
  );

  return (
    <div style={{ minHeight: "100vh", background: theme.bgPage, color: theme.text, fontFamily: "var(--font-ui)" }}>
      {/* Top bar */}
      <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}`, padding: "0 16px" }}>
        <div style={{ display: "flex", gap: 16, padding: "10px 0", alignItems: "center", maxWidth: 1200, margin: "0 auto" }}>
          <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 6, background: theme.bgCardAlt, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.textSecondary, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
            <Icon name="arrow-left" size={14} /> Wstecz
          </button>
          <div style={{ fontWeight: 800, fontSize: 16, color: theme.textBright, whiteSpace: "nowrap", cursor: "pointer" }} onClick={() => navigate("/")}>
            WIG<span style={{ color: theme.accent }}>markets</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "20px 12px" : "32px 24px" }}>
        {/* ─── HERO (compact) ─── */}
        <div style={{ marginBottom: 20 }}>
          {/* Line 1: Logo + ticker + name + sector + price + 24h badge */}
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 14, flexWrap: "wrap" }}>
            <StockLogo ticker={stock.ticker} size={isMobile ? 36 : 44} sector={stock.sector} />
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: theme.textBright, flexShrink: 0 }}>{stock.ticker}</span>
              <span style={{ fontSize: 13, color: theme.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{stock.name} · {stock.sector}</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexShrink: 0 }}>
              <span style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: theme.textBright, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{fmt(currentPrice)} {stock.unit || "zł"}</span>
              <span style={{ padding: "3px 10px", borderRadius: 6, background: `${changeColor(c24h)}18`, color: changeColor(c24h), fontWeight: 700, fontSize: 13, fontFamily: "var(--font-mono)" }}>{changeFmt(c24h)}</span>
            </div>
          </div>
          {/* Line 2: Buttons + change badges */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {watchlist && toggleWatch && (
              <button onClick={() => toggleWatch(stock.ticker)} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 7, border: `1px solid ${watchlist.has(stock.ticker) ? "#ffd700" : theme.borderInput}`, background: watchlist.has(stock.ticker) ? "#ffd70018" : "transparent", color: watchlist.has(stock.ticker) ? "#ffd700" : theme.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                <WatchStar active={watchlist.has(stock.ticker)} theme={theme} /> {watchlist.has(stock.ticker) ? "Obserwujesz" : "Obserwuj"}
              </button>
            )}
            <button onClick={handleNavigatePortfolio} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 7, border: `1px solid ${theme.borderInput}`, background: "transparent", color: theme.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
              <Icon name="plus" size={13} /> Portfolio
            </button>
            <div style={{ marginLeft: "auto", display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: theme.textSecondary, fontFamily: "var(--font-mono)", fontWeight: 500 }}>7d: <span style={{ color: changeColor(c7d), fontWeight: 700 }}>{changeFmt(c7d)}</span></span>
              {change1M != null && <span style={{ fontSize: 11, color: theme.textSecondary, fontFamily: "var(--font-mono)", fontWeight: 500 }}>1M: <span style={{ color: changeColor(change1M), fontWeight: 700 }}>{changeFmt(change1M)}</span></span>}
              {changeYTD != null && <span style={{ fontSize: 11, color: theme.textSecondary, fontFamily: "var(--font-mono)", fontWeight: 500 }}>YTD: <span style={{ color: changeColor(changeYTD), fontWeight: 700 }}>{changeFmt(changeYTD)}</span></span>}
            </div>
          </div>
        </div>

        {/* ─── 2-COLUMN LAYOUT: Chart | Sidebar ─── */}
        <div style={{ display: isMobile ? "flex" : "grid", flexDirection: "column", gridTemplateColumns: "3fr 2fr", gap: 24, marginBottom: 24 }}>
          {/* Left: Chart */}
          {chartSection}

          {/* Right: Podsumowanie + Wskaźniki */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {summarySection}
            {technicalSection}
          </div>
        </div>

        {/* ─── FUNDAMENTALS ─── */}
        {isStock && <FundamentalsSection stock={stock} fundamentals={fundamentals} loading={fundLoading} currentPrice={currentPrice} theme={theme} isMobile={isMobile} />}

        {/* ─── PROFILE & DIVIDENDS ─── */}
        {isStock && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24, marginBottom: 24 }}>
            {profileSection}
            {dividendsSection}
          </div>
        )}

        {/* ─── SIMILAR COMPANIES ─── */}
        {similarSection}

        {/* ─── PRICE HISTORY TABLE ─── */}
        {history && history.length > 0 && card(
          <>
            {sectionTitle("Historia cen — ostatnie 10 sesji")}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "var(--font-mono)" }}>
                <thead>
                  <tr>
                    {["Data", "Otwarcie", "Najwyższy", "Najniższy", "Zamknięcie", "Wolumen", "Zmiana"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: h === "Data" ? "left" : "right", fontSize: 10, color: theme.textSecondary, borderBottom: `2px solid ${theme.border}`, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "var(--font-ui)", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.slice(-10).reverse().map((d, i, arr) => {
                    const prevClose = i < arr.length - 1 ? arr[i + 1]?.close : null;
                    const dayChange = prevClose ? ((d.close - prevClose) / prevClose * 100) : null;
                    return (
                      <tr key={d.date} style={{ borderBottom: `1px solid ${theme.bgCardAlt}` }}>
                        <td style={{ padding: "8px 10px", color: theme.textBright, fontFamily: "var(--font-ui)", fontWeight: 500, whiteSpace: "nowrap" }}>{new Date(d.date).toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: theme.text }}>{d.open != null ? fmt(d.open) : "—"}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: theme.text }}>{d.high != null ? fmt(d.high) : "—"}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: theme.text }}>{d.low != null ? fmt(d.low) : "—"}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: theme.textBright, fontWeight: 600 }}>{fmt(d.close)}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: theme.textSecondary }}>{d.volume ? fmtVolume(d.volume) : "—"}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: dayChange != null ? changeColor(dayChange) : theme.textSecondary, fontWeight: 600 }}>{dayChange != null ? changeFmt(dayChange) : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>,
          { marginBottom: 32 }
        )}
      </div>

      <div style={{ textAlign: "center", padding: "24px", fontSize: 10, color: theme.textSecondary }}>
        WIGmarkets © 2026 · Dane z GPW via Yahoo Finance · Nie stanowią rekomendacji inwestycyjnej
      </div>
    </div>
  );
}

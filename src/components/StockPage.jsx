import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHistory, fetchHourly, fetchFundamentals, fetchIntraday } from "../api.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { fmt, changeFmt, changeColor, calculateRSI, calculateSMA, calculateMACD, getYahooSymbol, isForex, isCommodity } from "../utils.js";
import { DIVIDENDS } from "../data/dividends.js";
import { getByTicker } from "../../gpw-companies.js";
import LargeChart from "./LargeChart.jsx";
import FundamentalsSection from "./FundamentalsSection.jsx";
import RSIGauge from "./RSIGauge.jsx";
import StockLogo from "./StockLogo.jsx";
import CompanyMonogram from "./CompanyMonogram.jsx";
import WatchStar from "./WatchStar.jsx";
import Icon from "./edukacja/Icon.jsx";

function fmtVolume(v) {
  if (!v) return "\u2014";
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)} mld`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)} mln`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)} tys`;
  return `${Math.round(v)}`;
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min temu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} godz. temu`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "wczoraj";
  return `${days} dni temu`;
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
  const [news, setNews] = useState(null);
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

  // Fetch company-specific news
  useEffect(() => {
    const query = encodeURIComponent(`${stock.name} ${stock.ticker}`);
    fetch(`/api/news?q=${query}&limit=5`)
      .then(r => r.json())
      .then(d => setNews(d?.items || []))
      .catch(() => setNews([]));
  }, [stock.ticker, stock.name]);

  useEffect(() => {
    const kind = isForex(stock) ? "kurs walutowy" : isCommodity(stock) ? "notowania" : "kurs akcji";
    document.title = `${stock.name} (${stock.ticker}) \u2014 ${kind}, wykres | WIGmarkets`;
    let meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", `Aktualny ${kind} ${stock.name} (${stock.ticker}). Wykres, zmiana 24h/7d. Dane na \u017cywo.`);
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

  // Turnover today (volume * price)
  const turnoverToday = (volume && currentPrice) ? volume * currentPrice : null;

  // Effective 52-week range: prefer API, fallback to computed from history
  const w52Low = api52wLow ?? stats52w.low;
  const w52High = api52wHigh ?? stats52w.high;

  // Effective market cap
  const effectiveCap = apiMarketCap ? Math.round(apiMarketCap / 1e6) : (stock.cap || null);

  // Effective avg volume
  const effectiveAvgVol = apiAvgVol || avgVolume30d;

  // 52-week range position (0-100)
  const w52Position = useMemo(() => {
    if (w52Low == null || w52High == null || !currentPrice) return null;
    const range52 = w52High - w52Low;
    if (range52 <= 0) return 50;
    return Math.min(100, Math.max(0, ((currentPrice - w52Low) / range52) * 100));
  }, [w52Low, w52High, currentPrice]);

  // Performance data for pills
  const perfPills = useMemo(() => {
    const pills = [
      { label: "24h", value: c24h },
      { label: "7d", value: c7d },
    ];
    if (change1M != null) pills.push({ label: "1M", value: change1M });
    if (changeYTD != null) pills.push({ label: "YTD", value: changeYTD });
    return pills;
  }, [c24h, c7d, change1M, changeYTD]);

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
            {[{ key: "line", label: "Linia" }, { key: "candle", label: "\u015awiece" }].map(({ key, label }) => (
              <button key={key} onClick={() => setChartType(key)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid", borderColor: chartType === key ? theme.accent : theme.borderInput, background: chartType === key ? "#3b82f622" : "transparent", color: chartType === key ? theme.accent : theme.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: chartType === key ? 700 : 400 }}>{label}</button>
            ))}
          </div>
          <button onClick={() => setFullscreen(f => !f)} title={fullscreen ? "Zamknij pe\u0142ny ekran" : "Pe\u0142ny ekran"} style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${theme.borderInput}`, background: "transparent", color: theme.textSecondary, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            {fullscreen
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>}
          </button>
        </div>
      </div>
      <div style={{ background: theme.bgPage, borderRadius: 12, padding: "8px 8px 4px" }}>
        <LargeChart data={chartData} color={color} theme={theme} type={chartType} isIntraday={isIntraday} unit={stock.unit || "z\u0142"} />
      </div>
      {fullscreen && (
        <button onClick={() => setFullscreen(false)} style={{ position: "fixed", top: 16, right: 16, zIndex: 5001, padding: "8px 16px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bgCard, color: theme.textBright, fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
          Zamknij
        </button>
      )}
    </div>
  );

  // ─── 52-WEEK RANGE BAR ───
  const rangeBar52w = w52Position != null && (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: theme.textSecondary, marginBottom: 4 }}>
        <span>Min 52 tyg. {fmt(w52Low)}</span>
        <span>Max 52 tyg. {fmt(w52High)}</span>
      </div>
      <div style={{ position: "relative", height: 6, background: theme.border, borderRadius: 4 }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 4,
          width: `${w52Position}%`,
          background: `linear-gradient(90deg, ${theme.red}88, ${theme.accent}88, ${theme.green}88)`,
        }} />
        <div style={{
          position: "absolute", left: `${w52Position}%`, top: "50%",
          width: 10, height: 10, borderRadius: "50%",
          background: theme.accent, border: `2px solid ${theme.bgCard}`,
          transform: "translate(-50%, -50%)",
          boxShadow: `0 0 6px ${theme.accent}66`,
        }} />
      </div>
    </div>
  );

  const summarySection = card(
    <>
      {sectionTitle("Podsumowanie")}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {dataRow("Kurs", currentPrice ? `${fmt(currentPrice)} ${stock.unit || "z\u0142"}` : "\u2014")}
        {dataRow("Otwarcie", todayOpen ? `${fmt(todayOpen)} ${stock.unit || "z\u0142"}` : "\u2014")}
        {dataRow("Zmiana 24h", changeFmt(c24h), changeColor(c24h))}
        {dataRow("Zmiana 7d", changeFmt(c7d), changeColor(c7d))}
        {dataRow("Min/Max dzi\u015b", todayHighLow.low != null ? `${fmt(todayHighLow.low)} / ${fmt(todayHighLow.high)}` : "\u2014")}
        {dataRow("Min/Max 52 tyg.", w52Low != null ? `${fmt(w52Low)} / ${fmt(w52High)}` : "\u2014")}
        {dataRow("Wolumen", fmtVolume(volume))}
        {dataRow("\u015ar. wolumen (30d)", effectiveAvgVol ? fmtVolume(effectiveAvgVol) : "\u2014")}
        {isStock && dataRow("Kapitalizacja", effectiveCap ? `${effectiveCap >= 1000 ? `${fmt(effectiveCap / 1000, 1)} mld z\u0142` : `${fmt(effectiveCap, 0)} mln z\u0142`}` : "\u2014")}
        {dataRow("Obr\u00f3t dzi\u015b", turnoverToday ? fmtVolume(turnoverToday) : "\u2014")}
        {isStock && dataRow("C/Z (P/E)", apiPE != null ? fmt(apiPE) : "\u2014")}
        {isStock && dataRow("C/WK (P/BV)", apiPB != null ? fmt(apiPB) : "\u2014")}
        {dataRow("Sektor", stock.sector, theme.textSecondary)}
      </div>
      {rangeBar52w}
    </>
  );

  const technicalSection = card(
    <>
      {sectionTitle("Wska\u017aniki techniczne")}
      <RSIGauge value={rsi} theme={theme} />
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 0 }}>
        {sma50 != null && (() => {
          const above = currentPrice > sma50;
          return dataRow("SMA 50", `${fmt(sma50)} ${above ? "\u25b2" : "\u25bc"}`, above ? "#22c55e" : "#ef4444");
        })()}
        {sma200 != null && (() => {
          const above = currentPrice > sma200;
          return dataRow("SMA 200", `${fmt(sma200)} ${above ? "\u25b2" : "\u25bc"}`, above ? "#22c55e" : "#ef4444");
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
          <span style={{ fontSize: 11, color: theme.textSecondary, fontWeight: 600 }}>Sygna\u0142 og\u00f3lny</span>
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
          Wi\u0119cej wska\u017anik\u00f3w wymaga d\u0142u\u017cszej historii danych.
        </div>
      )}
    </>
  );

  const profileSection = isStock && card(
    <>
      {sectionTitle("Profil sp\u00f3\u0142ki")}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {dataRow("Nazwa pe\u0142na", stock.name)}
        {dataRow("Ticker", stock.ticker)}
        {dataRow("Rynek", "GPW G\u0142\u00f3wny")}
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
          Ta sp\u00f3\u0142ka nie wyp\u0142aca\u0142a dywidend w ostatnich 5 latach.
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={{ background: theme.bgCardAlt, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Ostatnia dywidenda</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: theme.textBright }}>{latestDiv.divPerShare > 0 ? `${fmt(latestDiv.divPerShare)} z\u0142` : "\u2014"}</div>
            </div>
            <div style={{ background: theme.bgCardAlt, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Stopa dywidendy</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: latestDiv.divYield > 0 ? "#22c55e" : theme.textBright }}>{latestDiv.divYield > 0 ? `${fmt(latestDiv.divYield)}%` : "\u2014"}</div>
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
                  <span style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{h.amount > 0 ? `${fmt(h.amount)} z\u0142` : "\u2014"}</span>
                  <span style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{h.yield > 0 ? `${fmt(h.yield)}%` : "\u2014"}</span>
                  <span style={{ textAlign: "right", color: h.amount > 0 ? "#22c55e" : theme.textSecondary, fontSize: 11 }}>{h.amount > 0 ? "Wyp\u0142acona" : "Brak"}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <div
        onClick={() => navigate("/dywidendy")}
        style={{ display: "block", textAlign: "center", color: theme.accent, fontSize: 12, textDecoration: "none", marginTop: 14, fontWeight: 600, cursor: "pointer" }}>
        Zobacz pe\u0142ny kalendarz dywidend \u2192
      </div>
    </>
  );

  const similarSection = isStock && similarStocks.length > 0 && card(
    <>
      {sectionTitle(`Podobne sp\u00f3\u0142ki \u2014 ${stock.sector}`)}
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
                <span style={{ fontWeight: 600, fontSize: 12, color: theme.textBright, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{p ? `${fmt(p)} z\u0142` : "\u2014"}</span>
                <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${changeColor(ch)}18`, color: changeColor(ch), fontFamily: "var(--font-mono)" }}>{changeFmt(ch)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>,
    { marginBottom: 24 }
  );

  // ─── NEWS SECTION ───
  const newsSection = news && news.length > 0 && card(
    <>
      {sectionTitle(`Wiadomo\u015bci \u2014 ${stock.name}`)}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {news.map((item, i) => (
          <a key={i} href={item.link} target="_blank" rel="noreferrer"
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12,
              padding: "12px 4px", borderBottom: i < news.length - 1 ? `1px solid ${theme.bgCardAlt}` : "none",
              textDecoration: "none", color: "inherit",
              transition: "background 0.15s", borderRadius: 4,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = theme.bgHover; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.textBright, lineHeight: 1.4, marginBottom: 4 }}>{item.title}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, color: theme.textMuted }}>
                {item.source && <span style={{ fontWeight: 600 }}>{item.source}</span>}
                <span>{timeAgo(item.pubDate)}</span>
              </div>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 4, color: theme.textMuted }}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        ))}
      </div>
      <div
        onClick={() => navigate("/wiadomosci")}
        style={{ display: "block", textAlign: "center", color: theme.accent, fontSize: 12, textDecoration: "none", marginTop: 14, fontWeight: 600, cursor: "pointer" }}>
        Wszystkie wiadomo\u015bci \u2192
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
          {/* Breadcrumb */}
          {!isMobile && (
            <div style={{ fontSize: 11, color: theme.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Dashboard</span>
              <span style={{ opacity: 0.5 }}>/</span>
              <span style={{ color: theme.textSecondary }}>{stock.ticker}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "20px 12px" : "32px 24px" }}>
        {/* ─── HERO ─── */}
        <div style={{ marginBottom: 24 }}>
          {/* Line 1: Logo + ticker + name + sector + price + 24h badge */}
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 14, flexWrap: "wrap" }}>
            <StockLogo ticker={stock.ticker} size={isMobile ? 36 : 48} sector={stock.sector} />
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: theme.textBright, flexShrink: 0 }}>{stock.ticker}</span>
              <span style={{ fontSize: 13, color: theme.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{stock.name}</span>
              {gpwInfo?.index && !isMobile && (
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: `${theme.accent}15`, color: theme.accent, fontWeight: 600, flexShrink: 0 }}>{gpwInfo.index}</span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexShrink: 0 }}>
              <span style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: theme.textBright, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{fmt(currentPrice)} {stock.unit || "z\u0142"}</span>
              <span style={{ padding: "4px 12px", borderRadius: 8, background: `${changeColor(c24h)}18`, color: changeColor(c24h), fontWeight: 700, fontSize: 14, fontFamily: "var(--font-mono)" }}>{changeFmt(c24h)}</span>
            </div>
          </div>

          {/* Line 2: Buttons + performance pills */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {watchlist && toggleWatch && (
              <button onClick={() => toggleWatch(stock.ticker)} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 7, border: `1px solid ${watchlist.has(stock.ticker) ? "#ffd700" : theme.borderInput}`, background: watchlist.has(stock.ticker) ? "#ffd70018" : "transparent", color: watchlist.has(stock.ticker) ? "#ffd700" : theme.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                <WatchStar active={watchlist.has(stock.ticker)} theme={theme} /> {watchlist.has(stock.ticker) ? "Obserwujesz" : "Obserwuj"}
              </button>
            )}
            <button onClick={handleNavigatePortfolio} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 7, border: `1px solid ${theme.borderInput}`, background: "transparent", color: theme.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
              <Icon name="plus" size={13} /> Portfolio
            </button>

            {/* Performance pills */}
            <div style={{ marginLeft: "auto", display: "flex", gap: 6, flexWrap: "wrap" }}>
              {perfPills.map(({ label, value }) => (
                <span key={label} style={{
                  fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 600,
                  padding: "3px 10px", borderRadius: 6,
                  background: `${changeColor(value)}10`,
                  color: changeColor(value),
                  border: `1px solid ${changeColor(value)}25`,
                }}>
                  {label}: {changeFmt(value)}
                </span>
              ))}
            </div>
          </div>

          {/* Quick stats row */}
          {!isMobile && (
            <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
              {[
                { label: "Otwarcie", value: todayOpen ? fmt(todayOpen) : "\u2014" },
                { label: "Min/Max", value: todayHighLow.low != null ? `${fmt(todayHighLow.low)} / ${fmt(todayHighLow.high)}` : "\u2014" },
                { label: "Wolumen", value: fmtVolume(volume) },
                isStock && effectiveCap ? { label: "Kap.", value: effectiveCap >= 1000 ? `${fmt(effectiveCap / 1000, 1)} mld` : `${fmt(effectiveCap, 0)} mln` } : null,
                { label: "Sektor", value: stock.sector },
              ].filter(Boolean).map(({ label, value }) => (
                <div key={label} style={{ fontSize: 11, color: theme.textSecondary }}>
                  <span style={{ fontWeight: 400 }}>{label}: </span>
                  <span style={{ fontWeight: 600, color: theme.text, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
                </div>
              ))}
            </div>
          )}
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

        {/* ─── NEWS ─── */}
        {newsSection}

        {/* ─── SIMILAR COMPANIES ─── */}
        {similarSection}

        {/* ─── PRICE HISTORY TABLE ─── */}
        {history && history.length > 0 && card(
          <>
            {sectionTitle("Historia cen \u2014 ostatnie 10 sesji")}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "var(--font-mono)" }}>
                <thead>
                  <tr>
                    {["Data", "Otwarcie", "Najwy\u017cszy", "Najni\u017cszy", "Zamkni\u0119cie", "Wolumen", "Zmiana"].map(h => (
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
                        <td style={{ padding: "8px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: theme.text }}>{d.open != null ? fmt(d.open) : "\u2014"}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: theme.text }}>{d.high != null ? fmt(d.high) : "\u2014"}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: theme.text }}>{d.low != null ? fmt(d.low) : "\u2014"}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: theme.textBright, fontWeight: 600 }}>{fmt(d.close)}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: theme.textSecondary }}>{d.volume ? fmtVolume(d.volume) : "\u2014"}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: dayChange != null ? changeColor(dayChange) : theme.textSecondary, fontWeight: 600 }}>{dayChange != null ? changeFmt(dayChange) : "\u2014"}</td>
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
        WIGmarkets &copy; 2026 &middot; Dane z GPW via Yahoo Finance &middot; Nie stanowi\u0105 rekomendacji inwestycyjnej
      </div>
    </div>
  );
}

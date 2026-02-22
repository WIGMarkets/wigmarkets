import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHistory, fetchHourly, fetchFundamentals, fetchIntraday } from "../lib/api.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { fmt, changeFmt, changeColor, calculateRSI, calculateSMA, calculateMACD, isForex, isCommodity } from "../lib/formatters.js";
import { SECTOR_AVERAGES } from "../data/constants.js";
import { DIVIDENDS } from "../data/dividends.js";
import { getByTicker } from "../data/gpw-companies.js";
import COMPANY_DESCRIPTIONS from "../data/company-descriptions.json";
import LargeChart from "./LargeChart.jsx";
import FinancialBarChart from "./FinancialBarChart.jsx";
import StockLogo from "./StockLogo.jsx";
import CompanyMonogram from "./CompanyMonogram.jsx";
import WatchStar from "./WatchStar.jsx";
import ProfitCalculatorModal from "./ProfitCalculatorModal.jsx";
import Icon from "./edukacja/Icon.jsx";

function fmtVol(v) {
  if (!v) return "b.d.";
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)} mld`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)} mln`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)} tys`;
  return `${Math.round(v)}`;
}

/* ─── Semi-circular Signal Gauge (SVG) ────────────────── */
function SignalGauge({ score, label, color, theme }) {
  const s = Math.max(0, Math.min(1, score));
  const cx = 100, cy = 88, r = 68;
  const needleAngle = Math.PI * (1 - s);
  const nl = r - 14;
  const nx = cx + nl * Math.cos(needleAngle);
  const ny = cy - nl * Math.sin(needleAngle);
  const ax1 = cx + r * Math.cos(Math.PI);
  const ay1 = cy - r * Math.sin(Math.PI);
  const ax2 = cx + r * Math.cos(0);
  const ay2 = cy - r * Math.sin(0);
  return (
    <div style={{ textAlign: "center", padding: "4px 0" }}>
      <svg width="200" height="112" viewBox="0 0 200 112">
        <defs>
          <linearGradient id="sGaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#eab308" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path d={`M ${ax1} ${ay1} A ${r} ${r} 0 0 1 ${ax2} ${ay2}`} fill="none" stroke="url(#sGaugeGrad)" strokeWidth="14" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={theme.textBright} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="5" fill={color} stroke={theme.bgCard} strokeWidth="2.5" />
        <text x="16" y="106" fill={theme.textMuted} fontSize="9" fontFamily="var(--font-ui)">Negatywny</text>
        <text x="100" y="20" fill={theme.textMuted} fontSize="9" fontFamily="var(--font-ui)" textAnchor="middle">Neutralny</text>
        <text x="184" y="106" fill={theme.textMuted} fontSize="9" fontFamily="var(--font-ui)" textAnchor="end">Pozytywny</text>
      </svg>
      <div style={{ marginTop: -2, fontSize: 16, fontWeight: 800, color, letterSpacing: "0.02em", fontFamily: "var(--font-ui)" }}>{label}</div>
    </div>
  );
}

/* ─── Inline mini-sparkline for similar stocks ────────── */
function MiniSparkline({ data, color, width = 60, height = 24 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 2) - 1}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────── */
/* ─── MAIN COMPONENT ─────────────────────────────────── */
/* ─────────────────────────────────────────────────────── */

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
  const [historyOpen, setHistoryOpen] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const isMobile = useIsMobile();

  const currentPrice = prices[stock.ticker];
  const c24h = changes[stock.ticker]?.change24h ?? 0;
  const c7d = changes[stock.ticker]?.change7d ?? 0;
  const volume = changes[stock.ticker]?.volume ?? 0;
  const color = c24h >= 0 ? "#22c55e" : "#ef4444";

  const sym = stock.stooq || stock.ticker.toLowerCase();
  const isStock = !isForex(stock) && !isCommodity(stock);
  const gpwInfo = isStock ? getByTicker(stock.ticker) : null;

  // ─── Data fetching ───────────────────────────────────
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
    const kind = isForex(stock) ? "kurs walutowy" : isCommodity(stock) ? "notowania" : "kurs akcji GPW";
    document.title = `${stock.name} (${stock.ticker}) — ${kind} — WIGmarkets.pl`;

    const descData = COMPANY_DESCRIPTIONS[stock.ticker];
    const rawDesc = descData?.description ||
      `Aktualny ${kind} ${stock.name} (${stock.ticker}). Wykres, analiza techniczna i fundamentalna. Dane na żywo GPW.`;
    const shortDesc = rawDesc.length > 155
      ? rawDesc.slice(0, rawDesc.lastIndexOf(" ", 153) || 152) + "…"
      : rawDesc;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", shortDesc);

    // Schema.org Organization structured data for stock pages
    const prev = document.getElementById("schema-org-stock");
    if (prev) prev.remove();
    if (isStock) {
      const script = document.createElement("script");
      script.id = "schema-org-stock";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": stock.name,
        "description": shortDesc,
        "url": `https://wigmarkets.pl/spolka/${stock.ticker}`,
      });
      document.head.appendChild(script);
    }

    return () => {
      const s = document.getElementById("schema-org-stock");
      if (s) s.remove();
    };
  }, [stock.ticker, stock.name, isStock]);

  // ─── Chart data ──────────────────────────────────────
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

  const chartData = range === "1D" ? (intraday ?? []) : range === "1W" ? (hourly ?? filteredHistory) : filteredHistory;
  const isIntraday = range === "1D" || range === "1W";

  // ─── Technical indicators ────────────────────────────
  const rsi = useMemo(() => calculateRSI(history), [history]);
  const closes = useMemo(() => history ? history.map(p => p.close) : [], [history]);
  const sma50 = useMemo(() => calculateSMA(closes, 50), [closes]);
  const sma200 = useMemo(() => calculateSMA(closes, 200), [closes]);
  const macd = useMemo(() => calculateMACD(history), [history]);

  // ─── Computed stats ──────────────────────────────────
  const stats52w = useMemo(() => {
    if (!history || history.length < 10) return { high: null, low: null };
    const all = history.map(p => p.close).filter(v => v != null);
    return { high: Math.max(...all), low: Math.min(...all) };
  }, [history]);

  const avgVolume30d = useMemo(() => {
    if (!history || history.length < 5) return null;
    const recent = history.slice(-30).filter(d => d.volume > 0);
    if (recent.length === 0) return null;
    return Math.round(recent.reduce((a, d) => a + d.volume, 0) / recent.length);
  }, [history]);

  const todayOpen = useMemo(() => {
    if (!history || history.length === 0) return null;
    return history[history.length - 1]?.open ?? null;
  }, [history]);

  const todayHighLow = useMemo(() => {
    if (!history || history.length === 0) return { high: null, low: null };
    const last = history[history.length - 1];
    return { high: last?.high ?? null, low: last?.low ?? null };
  }, [history]);

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

  // ─── Technical signal ────────────────────────────────
  const signal = useMemo(() => {
    let buy = 0, sell = 0;
    if (rsi != null) { if (rsi < 30) buy++; else if (rsi > 70) sell++; else { buy += 0.5; sell += 0.5; } }
    if (sma50 != null && currentPrice) { currentPrice > sma50 ? buy++ : sell++; }
    if (sma200 != null && currentPrice) { currentPrice > sma200 ? buy++ : sell++; }
    if (macd) { macd.histogram > 0 ? buy++ : sell++; }
    const total = buy + sell;
    if (total === 0) return null;
    const score = buy / total;
    if (score > 0.6) return { label: "Pozytywny", color: "#22c55e", score, buy: Math.round(buy), sell: Math.round(sell) };
    if (score < 0.4) return { label: "Negatywny", color: "#ef4444", score, buy: Math.round(buy), sell: Math.round(sell) };
    return { label: "Neutralny", color: "#eab308", score, buy: Math.round(buy), sell: Math.round(sell) };
  }, [rsi, sma50, sma200, macd, currentPrice]);

  // ─── Dividends ───────────────────────────────────────
  const stockDividends = useMemo(() => {
    if (!isStock) return [];
    return DIVIDENDS.filter(d => d.ticker === stock.ticker).sort((a, b) => b.year - a.year);
  }, [stock.ticker, isStock]);

  const latestDiv = stockDividends[0] || null;

  // ─── Similar companies ───────────────────────────────
  const similarStocks = useMemo(() => {
    if (!isStock || !liveStocks) return [];
    return liveStocks
      .filter(s => s.sector === stock.sector && s.ticker !== stock.ticker)
      .sort((a, b) => (b.cap || 0) - (a.cap || 0))
      .slice(0, 4);
  }, [stock.ticker, stock.sector, liveStocks, isStock]);

  // ─── Quote data from fundamentals API ────────────────
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
  const turnoverToday = (volume && currentPrice) ? volume * currentPrice : null;
  const w52Low = api52wLow ?? stats52w.low;
  const w52High = api52wHigh ?? stats52w.high;
  const effectiveCap = apiMarketCap ? Math.round(apiMarketCap / 1e6) : (stock.cap || null);
  const effectiveAvgVol = apiAvgVol || avgVolume30d;

  // ─── Valuation vs sector ─────────────────────────────
  const sectorAvg = SECTOR_AVERAGES[stock.sector] || SECTOR_AVERAGES["default"];
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
  const divYield = stock.div > 0 ? stock.div : null;

  const valStatus = (value, sectorVal, higherIsBad) => {
    if (!value || !sectorVal) return null;
    const r = value / sectorVal;
    if (higherIsBad) {
      if (r < 0.8) return { label: "Tania", color: "#22c55e" };
      if (r > 1.2) return { label: "Droga", color: "#ef4444" };
      return { label: "Neutralna", color: "#eab308" };
    }
    if (r > 1.2) return { label: "Wysoka", color: "#22c55e" };
    if (r < 0.8) return { label: "Niska", color: "#ef4444" };
    return { label: "Średnia", color: "#eab308" };
  };

  const valuations = [
    { label: "C/Z (P/E)", value: pe, unit: "x", sectorVal: sectorAvg.pe, higherIsBad: true, desc: `Śr. sektor: ${sectorAvg.pe ?? "b.d."}x` },
    { label: "C/WK (P/B)", value: pb, unit: "x", sectorVal: sectorAvg.pb, higherIsBad: true, desc: `Śr. sektor: ${sectorAvg.pb ?? "b.d."}x` },
    { label: "EV/EBITDA", value: evEbitda, unit: "x", sectorVal: sectorAvg.evEbitda, higherIsBad: true, desc: sectorAvg.evEbitda ? `Śr. sektor: ${sectorAvg.evEbitda}x` : "Brak danych sektora" },
    { label: "Stopa dywidendy", value: divYield, unit: "%", sectorVal: sectorAvg.div, higherIsBad: false, desc: `Śr. sektor: ${sectorAvg.div ?? 0}%` },
  ];

  const handleNavigatePortfolio = useCallback(() => { navigate("/portfolio"); }, [navigate]);

  // ─── HELPER RENDER FUNCTIONS ─────────────────────────

  const card = (children, extraStyle = {}) => (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: isMobile ? 18 : 24, transition: "border-color 0.2s", ...extraStyle }}>
      {children}
    </div>
  );

  const sectionTitle = (text, rightElement = null) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
      <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--font-ui)" }}>{text}</div>
      {rightElement}
    </div>
  );

  const dataRow = (label, value, valueColor = theme.textBright) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${theme.bgCardAlt}`, fontSize: 13 }}>
      <span style={{ color: theme.textSecondary, fontFamily: "var(--font-ui)" }}>{label}</span>
      <span style={{ fontWeight: 600, color: valueColor, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );

  const changePill = (label, value) => {
    if (value == null) return null;
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: `${changeColor(value)}14`, color: changeColor(value), fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
        <span style={{ fontSize: 10, color: theme.textMuted, fontFamily: "var(--font-ui)", fontWeight: 500 }}>{label}</span> {changeFmt(value)}
      </span>
    );
  };

  // ─── RENDER ──────────────────────────────────────────

  return (
    <div style={{ color: theme.text, fontFamily: "var(--font-ui)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "24px 12px 16px" : "36px 24px 24px" }}>

        {/* ═══ SECTION 2: Hero ═══ */}
        <div style={{ marginBottom: isMobile ? 24 : 32 }}>
          {/* Row 1: Logo + Ticker + Name */}
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 16, marginBottom: 12 }}>
            <StockLogo ticker={stock.ticker} size={isMobile ? 40 : 48} sector={stock.sector} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: theme.textBright, letterSpacing: "-0.02em" }}>{stock.ticker}</span>
                <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${theme.accent}14`, color: theme.accent, whiteSpace: "nowrap" }}>{stock.sector}</span>
                {gpwInfo?.index && (
                  <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500, background: theme.bgCardAlt, color: theme.textSecondary, whiteSpace: "nowrap" }}>{gpwInfo.index}</span>
                )}
              </div>
              <div style={{ fontSize: 14, color: theme.textSecondary, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{stock.name}</div>
            </div>
          </div>

          {/* Row 2: Price + Change badges + Signal */}
          <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "baseline", gap: isMobile ? 12 : 20, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: isMobile ? 36 : 48, fontWeight: 800, color: theme.textBright, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", lineHeight: 1 }}>
                {currentPrice ? fmt(currentPrice) : "b.d."}
              </span>
              <span style={{ fontSize: isMobile ? 14 : 16, color: theme.textMuted, fontWeight: 500 }}>{stock.unit || "zł"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {changePill("24h", c24h)}
              {changePill("7d", c7d)}
              {!isMobile && changePill("1M", change1M)}
              {!isMobile && changePill("YTD", changeYTD)}
            </div>
            {signal && !isMobile && (
              <span style={{ marginLeft: "auto", padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: `${signal.color}18`, color: signal.color, letterSpacing: "0.03em", whiteSpace: "nowrap" }}>
                {signal.label} ({signal.buy}/{signal.buy + signal.sell})
              </span>
            )}
          </div>

          {/* Row 3: Action buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            {watchlist && toggleWatch && (
              <button onClick={() => toggleWatch(stock.ticker)} style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8,
                border: `1px solid ${watchlist.has(stock.ticker) ? "#eab308" : theme.border}`,
                background: watchlist.has(stock.ticker) ? "#eab30812" : "transparent",
                color: watchlist.has(stock.ticker) ? "#eab308" : theme.textSecondary,
                fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s",
              }}>
                <WatchStar active={watchlist.has(stock.ticker)} theme={theme} />
                {watchlist.has(stock.ticker) ? "Obserwujesz" : "Obserwuj"}
              </button>
            )}
            <button onClick={handleNavigatePortfolio} style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8,
              border: `1px solid ${theme.border}`, background: "transparent",
              color: theme.textSecondary, fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s",
            }}>
              <Icon name="briefcase" size={13} /> Portfolio
            </button>
            <button onClick={() => setShowCalc(true)} style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8,
              border: `1px solid ${theme.border}`, background: "transparent",
              color: theme.textSecondary, fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s",
            }}>
              <Icon name="calculator" size={13} /> Kalkulator P/L
            </button>
          </div>
        </div>

        {/* ═══ SECTION 3: Chart ═══ */}
        {card(
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              {sectionTitle("Wykres", null)}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: 18 }}>
                <div style={{ display: "flex", gap: 3, background: theme.bgCardAlt, borderRadius: 8, padding: 3 }}>
                  {["1D", "1W", "1M", "3M", "1R", "YTD", "MAX"].map(r => (
                    <button key={r} onClick={() => setRange(r)} style={{
                      padding: "5px 10px", borderRadius: 6, border: "none",
                      background: range === r ? theme.accent : "transparent",
                      color: range === r ? "#fff" : theme.textSecondary,
                      fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: range === r ? 700 : 500, transition: "all 0.15s",
                    }}>{r}</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 3, background: theme.bgCardAlt, borderRadius: 8, padding: 3 }}>
                  {[{ key: "line", label: "Linia" }, { key: "candle", label: "Świece" }].map(({ key, label }) => (
                    <button key={key} onClick={() => setChartType(key)} style={{
                      padding: "5px 10px", borderRadius: 6, border: "none",
                      background: chartType === key ? theme.accent : "transparent",
                      color: chartType === key ? "#fff" : theme.textSecondary,
                      fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: chartType === key ? 700 : 500, transition: "all 0.15s",
                    }}>{label}</button>
                  ))}
                </div>
                <button onClick={() => setFullscreen(f => !f)} title={fullscreen ? "Zamknij pełny ekran" : "Pełny ekran"} style={{
                  padding: "5px 10px", borderRadius: 6, border: `1px solid ${theme.border}`, background: "transparent",
                  color: theme.textSecondary, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                }}>
                  <Icon name={fullscreen ? "x" : "grid"} size={14} />
                </button>
              </div>
            </div>
            <div style={{ background: theme.bgPage, borderRadius: 12, padding: "8px 8px 4px" }}>
              <LargeChart data={chartData} color={color} theme={theme} type={chartType} isIntraday={isIntraday} unit={stock.unit || "zł"} />
            </div>
          </>,
          fullscreen ? { position: "fixed", inset: 0, zIndex: 5000, borderRadius: 0, overflow: "auto", marginBottom: 0 } : { marginBottom: isMobile ? 20 : 28 }
        )}
        {fullscreen && (
          <button onClick={() => setFullscreen(false)} style={{ position: "fixed", top: 16, right: 16, zIndex: 5001, padding: "8px 16px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bgCard, color: theme.textBright, fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
            Zamknij
          </button>
        )}

        {/* ═══ SECTION 4: Key Metrics Strip ═══ */}
        <div style={{ display: "flex", gap: isMobile ? 10 : 14, overflowX: "auto", paddingBottom: 4, marginBottom: isMobile ? 20 : 28, WebkitOverflowScrolling: "touch" }}>
          {[
            isStock && effectiveCap && { label: "Kapitalizacja", value: effectiveCap >= 1000 ? `${fmt(effectiveCap / 1000, 1)} mld zł` : `${fmt(effectiveCap, 0)} mln zł` },
            isStock && apiPE != null && { label: "C/Z (P/E)", value: `${fmt(apiPE)}x` },
            isStock && apiPB != null && { label: "C/WK (P/B)", value: `${fmt(apiPB)}x` },
            isStock && cur.eps != null && { label: "EPS", value: `${fmt(cur.eps)} PLN` },
            isStock && divYield != null && { label: "Stopa dyw.", value: `${fmt(divYield)}%`, color: "#22c55e" },
            { label: "Wolumen", value: fmtVol(volume) },
            { label: "Obrót", value: turnoverToday ? fmtVol(turnoverToday) : "b.d." },
            { label: "Otwarcie", value: todayOpen ? `${fmt(todayOpen)}` : "b.d." },
            w52Low != null && { label: "52 tyg. min/max", value: `${fmt(w52Low)} / ${fmt(w52High)}` },
          ].filter(Boolean).map(({ label, value, color: metricColor }) => (
            <div key={label} style={{
              flexShrink: 0, background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 10,
              padding: isMobile ? "12px 14px" : "14px 18px", minWidth: isMobile ? 110 : 130,
            }}>
              <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4, whiteSpace: "nowrap" }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: metricColor || theme.textBright, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* ═══ SECTION 4b: O spółce ═══ */}
        {isStock && (() => {
          const desc = COMPANY_DESCRIPTIONS[stock.ticker];
          if (!desc) return null;
          return (
            <div style={{
              background: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: 14,
              padding: isMobile ? 18 : 24,
              marginBottom: isMobile ? 20 : 28,
            }}>
              <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--font-ui)", marginBottom: 14 }}>
                O spółce
              </div>
              <p style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.7, margin: 0, marginBottom: 14, fontFamily: "var(--font-ui)" }}>
                {desc.description}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, color: theme.textMuted, fontFamily: "var(--font-ui)" }}>
                  {[
                    desc.sector && `Sektor: ${desc.sector}`,
                    desc.founded && `Założona: ${desc.founded}`,
                    desc.headquarters && desc.headquarters,
                  ].filter(Boolean).join(" · ")}
                </span>
                {desc.indices && desc.indices.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {desc.indices.map(idx => (
                      <span key={idx} style={{
                        fontSize: 11, fontWeight: 600, color: theme.textSecondary,
                        background: theme.bgCardAlt, border: `1px solid ${theme.border}`,
                        borderRadius: 4, padding: "2px 8px", fontFamily: "var(--font-ui)",
                      }}>
                        {idx}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ═══ SECTION 5 + 6: Technical Analysis | Valuation vs Sector ═══ */}
        {isStock && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 20 : 24, marginBottom: isMobile ? 20 : 28 }}>

            {/* ─── Technical Analysis ─── */}
            {card(
              <>
                {sectionTitle("Analiza techniczna")}

                {signal ? (
                  <SignalGauge score={signal.score} label={signal.label} color={signal.color} theme={theme} />
                ) : (
                  <div style={{ textAlign: "center", padding: "24px 0", color: theme.textMuted, fontSize: 12, fontStyle: "italic" }}>
                    Oczekiwanie na dane...
                  </div>
                )}
                {signal && (
                  <div style={{ textAlign: "center", fontSize: 11, color: theme.textMuted, marginBottom: 16 }}>
                    {signal.buy} pozytywnych / {signal.sell} negatywnych wskaźników
                  </div>
                )}

                {rsi != null && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 600 }}>RSI (14)</span>
                      <span style={{ fontSize: 18, fontWeight: 800, color: rsi > 70 ? "#ef4444" : rsi < 30 ? "#22c55e" : "#eab308", fontFamily: "var(--font-mono)" }}>{rsi.toFixed(1)}</span>
                    </div>
                    <div style={{ height: 6, background: theme.bgElevated, borderRadius: 4, position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 4, width: `${Math.min(Math.max(rsi, 0), 100)}%`, background: "linear-gradient(90deg, #22c55e, #eab308, #ef4444)", transition: "width 0.6s ease" }} />
                    </div>
                    <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 6, fontStyle: "italic" }}>
                      {rsi > 70 ? "Wykupiony — potencjalne ryzyko korekty" : rsi < 30 ? "Wyprzedany — potencjalna okazja" : "Strefa neutralna — brak wyraźnego sygnału"}
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {sma50 != null && (() => {
                    const above = currentPrice > sma50;
                    return (
                      <div style={{ padding: "10px 0", borderBottom: `1px solid ${theme.bgCardAlt}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                          <span style={{ color: theme.textSecondary }}>SMA 50</span>
                          <span style={{ fontWeight: 600, color: above ? "#22c55e" : "#ef4444", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{fmt(sma50)} {above ? "▲" : "▼"}</span>
                        </div>
                        <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 3, fontStyle: "italic" }}>
                          {above ? "Cena powyżej — krótkoterminowy trend wzrostowy" : "Cena poniżej — krótkoterminowy trend spadkowy"}
                        </div>
                      </div>
                    );
                  })()}
                  {sma200 != null && (() => {
                    const above = currentPrice > sma200;
                    return (
                      <div style={{ padding: "10px 0", borderBottom: `1px solid ${theme.bgCardAlt}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                          <span style={{ color: theme.textSecondary }}>SMA 200</span>
                          <span style={{ fontWeight: 600, color: above ? "#22c55e" : "#ef4444", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{fmt(sma200)} {above ? "▲" : "▼"}</span>
                        </div>
                        <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 3, fontStyle: "italic" }}>
                          {above ? "Cena powyżej — długoterminowy trend wzrostowy" : "Cena poniżej — długoterminowy trend spadkowy"}
                        </div>
                      </div>
                    );
                  })()}
                  {macd && (
                    <div style={{ padding: "10px 0", borderBottom: `1px solid ${theme.bgCardAlt}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                        <span style={{ color: theme.textSecondary }}>MACD</span>
                        <span style={{ fontWeight: 600, color: macd.histogram > 0 ? "#22c55e" : "#ef4444", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{fmt(macd.macd)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, marginTop: 4 }}>
                        <span style={{ color: theme.textMuted }}>Signal: {fmt(macd.signal)}</span>
                        <span style={{ color: theme.textMuted }}>Histogram: <span style={{ color: macd.histogram > 0 ? "#22c55e" : "#ef4444", fontWeight: 600 }}>{fmt(macd.histogram)}</span></span>
                      </div>
                      <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 3, fontStyle: "italic" }}>
                        {macd.histogram > 0 ? "Momentum wzrostowe — MACD powyżej linii sygnału" : "Momentum spadkowe — MACD poniżej linii sygnału"}
                      </div>
                    </div>
                  )}
                </div>

                {!sma50 && !macd && !rsi && (
                  <div style={{ fontSize: 12, color: theme.textMuted, textAlign: "center", padding: "16px 0", fontStyle: "italic" }}>
                    Więcej wskaźników wymaga dłuższej historii danych.
                  </div>
                )}

                <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 14, paddingTop: 10, borderTop: `1px solid ${theme.bgCardAlt}` }}>
                  Analiza techniczna nie stanowi rekomendacji inwestycyjnej.
                </div>
              </>
            )}

            {/* ─── Valuation vs Sector ─── */}
            {card(
              <>
                {sectionTitle("Wycena vs sektor",
                  <span style={{ fontSize: 11, background: `${theme.accent}14`, color: theme.accent, borderRadius: 6, padding: "3px 10px", fontWeight: 600 }}>{stock.sector}</span>
                )}
                <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 20, marginTop: -10 }}>
                  Porównanie do średniej sektorowej GPW
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {valuations.map(({ label, value, unit, sectorVal, higherIsBad, desc }) => {
                    const status = valStatus(value, sectorVal, higherIsBad);
                    const pct = (value && sectorVal) ? Math.min(Math.max((value / sectorVal) * 50, 5), 95) : 50;
                    return (
                      <div key={label} style={{ background: theme.bgCardAlt, borderRadius: 10, padding: "14px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                          <div>
                            <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: theme.textBright, marginTop: 2, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>
                              {value !== null ? `${typeof value === "number" ? (Number.isInteger(value) ? value : value.toFixed(1)) : value}${unit}` : "b.d."}
                            </div>
                          </div>
                          {status && (
                            <div style={{ background: `${status.color}18`, color: status.color, borderRadius: 6, padding: "3px 8px", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                              {status.label}
                            </div>
                          )}
                        </div>
                        <div style={{ position: "relative", height: 5, background: theme.border, borderRadius: 3, marginBottom: 6 }}>
                          <div style={{ position: "absolute", left: "50%", top: -2, width: 1.5, height: 9, background: theme.textMuted, borderRadius: 1, transform: "translateX(-50%)" }} />
                          {value !== null && sectorVal !== null && (
                            <div style={{ position: "absolute", left: `${pct}%`, top: "50%", width: 9, height: 9, borderRadius: "50%", background: status?.color || theme.accent, border: `2px solid ${theme.bgCard}`, transform: "translate(-50%, -50%)", boxShadow: `0 0 6px ${status?.color || theme.accent}66` }} />
                          )}
                        </div>
                        <div style={{ fontSize: 9, color: theme.textMuted, textAlign: "center" }}>{desc}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══ SECTION 7: Fundamentals ═══ */}
        {isStock && (() => {
          const hasCurData = Object.values(cur).some(v => v !== null);
          const hasAnnual = (fundamentals?.annual || []).some(d => d.revenue !== null || d.netIncome !== null);

          if (fundLoading) {
            return card(
              <>
                {sectionTitle("Dane fundamentalne")}
                <div style={{ color: theme.textMuted, fontSize: 12, padding: "32px 0", textAlign: "center" }}>Ładowanie danych fundamentalnych...</div>
              </>,
              { marginBottom: isMobile ? 20 : 28 }
            );
          }

          return (
            <>
              {card(
                <>
                  {sectionTitle("Dane fundamentalne")}
                  {!hasCurData ? (
                    <div style={{ color: theme.textMuted, fontSize: 12, textAlign: "center", padding: "20px 0" }}>
                      Brak danych fundamentalnych dla tej spółki
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 12 }}>
                      {[
                        { label: "Przychody (TTM)", value: cur.revenue, fmtFn: v => { const abs = Math.abs(v); return abs >= 1000 ? `${(v / 1000).toFixed(1)} mld` : `${v.toFixed(0)} mln`; } },
                        { label: "Zysk netto (TTM)", value: cur.netIncome, fmtFn: v => { const abs = Math.abs(v); return abs >= 1000 ? `${(v / 1000).toFixed(1)} mld` : `${v.toFixed(0)} mln`; }, colorFn: v => v >= 0 ? "#22c55e" : "#ef4444" },
                        { label: "EBITDA", value: cur.ebitda, fmtFn: v => { const abs = Math.abs(v); return abs >= 1000 ? `${(v / 1000).toFixed(1)} mld` : `${v.toFixed(0)} mln`; } },
                        { label: "EPS", value: cur.eps, fmtFn: v => `${v.toFixed(2)} PLN` },
                        { label: "Wart. księgowa/akcję", value: bvps, fmtFn: v => `${v.toFixed(2)} PLN` },
                        { label: "Zadłużenie netto", value: cur.netDebt, fmtFn: v => { const abs = Math.abs(v); return abs >= 1000 ? `${(v / 1000).toFixed(1)} mld` : `${v.toFixed(0)} mln`; } },
                      ].map(({ label, value, fmtFn, colorFn }) => (
                        <div key={label} style={{ background: theme.bgCardAlt, borderRadius: 10, padding: "14px 16px" }}>
                          <div style={{ fontSize: 10, color: theme.textMuted, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
                          <div style={{
                            fontSize: 17, fontWeight: 700, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums",
                            color: value != null ? (colorFn ? colorFn(value) : theme.textBright) : theme.textMuted,
                          }}>
                            {value != null ? fmtFn(value) : "b.d."}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>,
                { marginBottom: isMobile ? 16 : 20 }
              )}

              {hasAnnual && card(
                <>
                  {sectionTitle("Przychody i zysk netto")}
                  <div style={{ fontSize: 10, color: theme.textMuted, marginBottom: 16, marginTop: -10 }}>Wartości w mln PLN (M) lub mld PLN (B)</div>
                  <div style={{ background: theme.bgPage, borderRadius: 10, padding: "12px 8px" }}>
                    <FinancialBarChart annual={fundamentals.annual} theme={theme} />
                  </div>
                </>,
                { marginBottom: isMobile ? 20 : 28 }
              )}
            </>
          );
        })()}

        {/* ═══ SECTION 8 + 9: Dividends | Company Profile ═══ */}
        {isStock && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 20 : 24, marginBottom: isMobile ? 20 : 28 }}>

            {/* ─── Dividends ─── */}
            {card(
              <>
                {sectionTitle("Dywidendy")}
                {stockDividends.length === 0 ? (
                  <div style={{ fontSize: 12, color: theme.textMuted, padding: "12px 0" }}>
                    Ta spółka nie wypłacała dywidend w ostatnich 5 latach.
                  </div>
                ) : (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                      <div style={{ background: theme.bgCardAlt, borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ fontSize: 10, color: theme.textMuted, marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Kwota</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: theme.textBright, fontFamily: "var(--font-mono)" }}>
                          {latestDiv.divPerShare > 0 ? `${fmt(latestDiv.divPerShare)} zł` : "b.d."}
                        </div>
                      </div>
                      <div style={{ background: theme.bgCardAlt, borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ fontSize: 10, color: theme.textMuted, marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Stopa</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: latestDiv.divYield > 0 ? "#22c55e" : theme.textBright, fontFamily: "var(--font-mono)" }}>
                          {latestDiv.divYield > 0 ? `${fmt(latestDiv.divYield)}%` : "b.d."}
                        </div>
                      </div>
                      <div style={{ background: theme.bgCardAlt, borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ fontSize: 10, color: theme.textMuted, marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Streak</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: theme.textBright, fontFamily: "var(--font-mono)" }}>
                          {latestDiv.streak ? `${latestDiv.streak} lat` : "b.d."}
                        </div>
                      </div>
                    </div>
                    {latestDiv.history && latestDiv.history.length > 0 && (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", fontSize: 10, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", padding: "8px 0", borderBottom: `1px solid ${theme.border}`, letterSpacing: "0.04em" }}>
                          <span>Rok</span><span style={{ textAlign: "right" }}>Kwota</span><span style={{ textAlign: "right" }}>Stopa</span><span style={{ textAlign: "right" }}>Status</span>
                        </div>
                        {latestDiv.history.slice(0, 5).map((h, i) => (
                          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", fontSize: 12, padding: "8px 0", borderBottom: `1px solid ${theme.bgCardAlt}`, color: theme.text }}>
                            <span style={{ fontFamily: "var(--font-mono)" }}>{h.year}</span>
                            <span style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{h.amount > 0 ? `${fmt(h.amount)} zł` : "b.d."}</span>
                            <span style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{h.yield > 0 ? `${fmt(h.yield)}%` : "b.d."}</span>
                            <span style={{ textAlign: "right", color: h.amount > 0 ? "#22c55e" : theme.textMuted, fontSize: 11 }}>{h.amount > 0 ? "Wypłacona" : "Brak"}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
                <div onClick={() => navigate("/dywidendy")} style={{ display: "block", textAlign: "center", color: theme.accent, fontSize: 12, textDecoration: "none", marginTop: 16, fontWeight: 600, cursor: "pointer" }}>
                  Zobacz pełny kalendarz dywidend <Icon name="arrow-right" size={12} />
                </div>
              </>
            )}

            {/* ─── Company Profile ─── */}
            {card(
              <>
                {sectionTitle("Profil spółki")}
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {dataRow("Nazwa pełna", stock.name)}
                  {dataRow("Ticker", stock.ticker)}
                  {dataRow("Rynek", "GPW Główny")}
                  {dataRow("Sektor", stock.sector)}
                  {gpwInfo?.index && dataRow("Indeks", gpwInfo.index)}
                </div>

                <div style={{ marginTop: 18, padding: "14px 16px", background: theme.bgCardAlt, borderRadius: 10 }}>
                  <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Podsumowanie sesji</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 10, color: theme.textMuted }}>Otwarcie</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: theme.textBright, fontFamily: "var(--font-mono)" }}>{todayOpen ? fmt(todayOpen) : "b.d."}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: theme.textMuted }}>Wolumen</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: theme.textBright, fontFamily: "var(--font-mono)" }}>{fmtVol(volume)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: theme.textMuted }}>Min/Max dziś</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: theme.textBright, fontFamily: "var(--font-mono)" }}>
                        {todayHighLow.low != null ? `${fmt(todayHighLow.low)} / ${fmt(todayHighLow.high)}` : "b.d."}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: theme.textMuted }}>Śr. wolumen 30d</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: theme.textBright, fontFamily: "var(--font-mono)" }}>{effectiveAvgVol ? fmtVol(effectiveAvgVol) : "b.d."}</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Non-stock summary (forex/commodities) */}
        {!isStock && card(
          <>
            {sectionTitle("Podsumowanie")}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {dataRow("Kurs", currentPrice ? `${fmt(currentPrice)} ${stock.unit || ""}` : "b.d.")}
              {dataRow("Otwarcie", todayOpen ? fmt(todayOpen) : "b.d.")}
              {dataRow("Zmiana 24h", changeFmt(c24h), changeColor(c24h))}
              {dataRow("Zmiana 7d", changeFmt(c7d), changeColor(c7d))}
              {dataRow("Min/Max dziś", todayHighLow.low != null ? `${fmt(todayHighLow.low)} / ${fmt(todayHighLow.high)}` : "b.d.")}
              {dataRow("Min/Max 52 tyg.", w52Low != null ? `${fmt(w52Low)} / ${fmt(w52High)}` : "b.d.")}
              {dataRow("Wolumen", fmtVol(volume))}
              {effectiveAvgVol && dataRow("Śr. wolumen (30d)", fmtVol(effectiveAvgVol))}
              {dataRow("Sektor", stock.sector, theme.textSecondary)}
            </div>
          </>,
          { marginBottom: isMobile ? 20 : 28 }
        )}

        {/* Non-stock technical indicators */}
        {!isStock && (rsi != null || sma50 != null || macd) && card(
          <>
            {sectionTitle("Wskaźniki techniczne")}
            {signal && <SignalGauge score={signal.score} label={signal.label} color={signal.color} theme={theme} />}
            {rsi != null && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 600 }}>RSI (14)</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: rsi > 70 ? "#ef4444" : rsi < 30 ? "#22c55e" : "#eab308", fontFamily: "var(--font-mono)" }}>{rsi.toFixed(1)}</span>
                </div>
                <div style={{ height: 6, background: theme.bgElevated, borderRadius: 4, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 4, width: `${Math.min(Math.max(rsi, 0), 100)}%`, background: "linear-gradient(90deg, #22c55e, #eab308, #ef4444)", transition: "width 0.6s ease" }} />
                </div>
              </div>
            )}
            {sma50 != null && dataRow("SMA 50", `${fmt(sma50)} ${currentPrice > sma50 ? "▲" : "▼"}`, currentPrice > sma50 ? "#22c55e" : "#ef4444")}
            {sma200 != null && dataRow("SMA 200", `${fmt(sma200)} ${currentPrice > sma200 ? "▲" : "▼"}`, currentPrice > sma200 ? "#22c55e" : "#ef4444")}
            {macd && dataRow("MACD", fmt(macd.macd), macd.histogram > 0 ? "#22c55e" : "#ef4444")}
            <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${theme.bgCardAlt}` }}>
              Analiza techniczna nie stanowi rekomendacji inwestycyjnej.
            </div>
          </>,
          { marginBottom: isMobile ? 20 : 28 }
        )}

        {/* ═══ SECTION 10: Similar Stocks ═══ */}
        {isStock && similarStocks.length > 0 && card(
          <>
            {sectionTitle(`Podobne spółki — ${stock.sector}`)}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : `repeat(${Math.min(similarStocks.length, 4)}, 1fr)`, gap: 12 }}>
              {similarStocks.map(s => {
                const p = prices[s.ticker];
                const ch = changes[s.ticker]?.change24h ?? 0;
                const spark = changes[s.ticker]?.sparkline ?? null;
                return (
                  <div key={s.ticker} onClick={() => navigate(`/spolka/${s.ticker}`)}
                    style={{ background: theme.bgCardAlt, borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "border-color 0.2s, transform 0.15s", border: `1px solid ${theme.border}` }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "none"; }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <CompanyMonogram ticker={s.ticker} sector={s.sector} size={28} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: theme.textBright }}>{s.ticker}</div>
                        <div style={{ fontSize: 10, color: theme.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: theme.textBright, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{p ? `${fmt(p)} zł` : "b.d."}</div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: changeColor(ch), fontFamily: "var(--font-mono)" }}>{changeFmt(ch)}</span>
                      </div>
                      <MiniSparkline data={spark} color={changeColor(ch)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>,
          { marginBottom: isMobile ? 20 : 28 }
        )}

        {/* ═══ SECTION 11: Price History (Collapsible) ═══ */}
        {history && history.length > 0 && card(
          <>
            <div
              onClick={() => setHistoryOpen(o => !o)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", userSelect: "none" }}>
              <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--font-ui)" }}>
                Historia cen — ostatnie 10 sesji
              </div>
              <Icon name={historyOpen ? "chevron-up" : "chevron-down"} size={16} color={theme.textSecondary} />
            </div>
            {historyOpen && (
              <div style={{ overflowX: "auto", marginTop: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "var(--font-mono)" }}>
                  <thead>
                    <tr>
                      {["Data", "Otwarcie", "Najwyższy", "Najniższy", "Zamknięcie", "Wolumen", "Zmiana"].map(h => (
                        <th key={h} style={{ padding: "8px 10px", textAlign: h === "Data" ? "left" : "right", fontSize: 10, color: theme.textMuted, borderBottom: `2px solid ${theme.border}`, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "var(--font-ui)", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(-10).reverse().map((d, i, arr) => {
                      const prevClose = i < arr.length - 1 ? arr[i + 1]?.close : null;
                      const dayChange = prevClose ? ((d.close - prevClose) / prevClose * 100) : null;
                      return (
                        <tr key={d.date} style={{ borderBottom: `1px solid ${theme.bgCardAlt}` }}
                          onMouseEnter={e => { e.currentTarget.style.background = theme.bgCardAlt; }}
                          onMouseLeave={e => { e.currentTarget.style.background = ""; }}>
                          <td style={{ padding: "10px 10px", color: theme.textBright, fontFamily: "var(--font-ui)", fontWeight: 500, whiteSpace: "nowrap" }}>{new Date(d.date).toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" })}</td>
                          <td style={{ padding: "10px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: theme.text }}>{d.open != null ? fmt(d.open) : "b.d."}</td>
                          <td style={{ padding: "10px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: theme.text }}>{d.high != null ? fmt(d.high) : "b.d."}</td>
                          <td style={{ padding: "10px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: theme.text }}>{d.low != null ? fmt(d.low) : "b.d."}</td>
                          <td style={{ padding: "10px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: theme.textBright, fontWeight: 700 }}>{fmt(d.close)}</td>
                          <td style={{ padding: "10px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: theme.textSecondary }}>{d.volume ? fmtVol(d.volume) : "b.d."}</td>
                          <td style={{ padding: "10px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: dayChange != null ? changeColor(dayChange) : theme.textMuted, fontWeight: 600 }}>{dayChange != null ? changeFmt(dayChange) : "b.d."}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>,
          { marginBottom: 32 }
        )}
      </div>

      {/* ═══ SECTION 12: Footer ═══ */}
      <div style={{ borderTop: `1px solid ${theme.border}`, padding: "24px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: theme.textBright, marginBottom: 6, letterSpacing: "-0.01em" }}>
            WIG<span style={{ color: theme.accent }}>markets</span>
          </div>
          <div style={{ fontSize: 10, color: theme.textMuted, lineHeight: 1.6 }}>
            Dane z GPW. Opóźnienie do 15 minut. Nie stanowią rekomendacji inwestycyjnej.
          </div>
          <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 4 }}>
            &copy; 2026 WIGmarkets.pl
          </div>
        </div>
      </div>

      {showCalc && (
        <ProfitCalculatorModal stock={stock} currentPrice={currentPrice} onClose={() => setShowCalc(false)} theme={theme} />
      )}
    </div>
  );
}

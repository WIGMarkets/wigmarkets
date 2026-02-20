import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import ReactDOM from "react-dom/client";
import { DARK_THEME, LIGHT_THEME } from "./themes.js";
import { fetchBulk, fetchIndices, fetchRedditTrends, fetchHistory, fetchDynamicList } from "./api.js";
import { STOCKS, COMMODITIES, FOREX } from "./data/stocks.js";
import { FEAR_HISTORY_YEAR } from "./data/constants.js";
import { fmt, changeFmt, changeColor } from "./utils.js";
import { useIsMobile } from "./hooks/useIsMobile.js";
import { usePriceFlash } from "./hooks/usePriceFlash.js";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts.js";
import Sparkline from "./components/Sparkline.jsx";
import MarqueeTicker from "./components/MarqueeTicker.jsx";
import Heatmap from "./components/Heatmap.jsx";
import SectorDonut from "./components/SectorDonut.jsx";
import WatchStar from "./components/WatchStar.jsx";
import FearGauge from "./components/FearGauge.jsx";
import ProfitCalculatorModal from "./components/ProfitCalculatorModal.jsx";
import StockModal from "./components/StockModal.jsx";
import StockLogo from "./components/StockLogo.jsx";
import CompanyMonogram from "./components/CompanyMonogram.jsx";
import MarketOverviewCards from "./components/MarketOverviewCards.jsx";
import StockPage from "./components/StockPage.jsx";
import FearGreedPage from "./components/FearGreedPage.jsx";
import NewsPage from "./components/NewsPage.jsx";
import ScreenerView from "./components/ScreenerView.jsx";
import PortfolioPage from "./components/PortfolioPage.jsx";
import EdukacjaHome from "./components/edukacja/EdukacjaHome.jsx";
import CategoryPage from "./components/edukacja/CategoryPage.jsx";
import ArticlePage from "./components/edukacja/ArticlePage.jsx";
import SkeletonRow from "./components/SkeletonRow.jsx";
import ToastContainer, { toast } from "./components/ToastContainer.jsx";
import AlertsModal from "./components/AlertsModal.jsx";
import Icon from "./components/edukacja/Icon.jsx";
import { loadAlerts, usePriceAlerts } from "./hooks/usePriceAlerts.js";

const ALL_INSTRUMENTS = [...STOCKS, ...COMMODITIES, ...FOREX];

function fmtVolume(v, price) {
  if (!v) return "—";
  // Show PLN turnover (volume × price) for better readability
  const pln = price ? v * price : 0;
  if (pln >= 1e9) return `${(pln / 1e9).toFixed(2)} mld`;
  if (pln >= 1e6) return `${(pln / 1e6).toFixed(1)} mln`;
  if (pln >= 1e3) return `${(pln / 1e3).toFixed(0)} tys`;
  if (pln > 0) return `${Math.round(pln)}`;
  // Fallback: show share count if no price
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M szt`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K szt`;
  return `${v} szt`;
}

function fmtCap(cap) {
  if (!cap) return "—";
  if (cap >= 1000) return `${(cap / 1000).toFixed(1)} mld`;
  return `${Math.round(cap)} mln`;
}

function TableRow({ s, i, rank, isMobile, tab, theme, prices, changes, watchlist, toggleWatch, navigateToStock, setSelected, setCalcStock, isKeyboardActive, onHover, showPE, showDiv }) {
  const currentPrice = prices[s.ticker];
  const c24h     = changes[s.ticker]?.change24h ?? 0;
  const c7d      = changes[s.ticker]?.change7d  ?? 0;
  const volume   = changes[s.ticker]?.volume    ?? 0;
  const sparkline = changes[s.ticker]?.sparkline ?? null;
  const priceColor = c24h > 0 ? "#22c55e" : c24h < 0 ? "#ef4444" : theme.textBright;
  const flashCls = usePriceFlash(currentPrice);
  return (
    <tr
      key={s.id}
      className={flashCls}
      onClick={() => isMobile ? setSelected(s) : navigateToStock(s)}
      onMouseEnter={e => { e.currentTarget.style.background = theme.bgCardAlt; e.currentTarget.style.borderLeftColor = theme.accent; onHover?.(); }}
      onMouseLeave={e => { if (!isKeyboardActive) { e.currentTarget.style.background = ""; e.currentTarget.style.borderLeftColor = "transparent"; } }}
      style={{ borderBottom: `1px solid ${theme.border}`, borderLeft: `2px solid ${isKeyboardActive ? theme.accent : "transparent"}`, cursor: "pointer", transition: "background 0.15s, border-color 0.15s", background: isKeyboardActive ? theme.bgCardAlt : "", animationDelay: `${i * 20}ms` }}
    >
      <td style={{ padding: isMobile ? "14px 4px" : "14px 8px", textAlign: "center" }}>
        <WatchStar active={watchlist.has(s.ticker)} onClick={() => toggleWatch(s.ticker)} theme={theme} />
      </td>
      {!isMobile && <td style={{ padding: "14px 16px", color: theme.textMuted, fontSize: 11, fontFamily: "var(--font-mono)" }}>{rank}</td>}
      <td style={{ padding: isMobile ? "14px 10px" : "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StockLogo ticker={s.ticker} size={28} borderRadius={6} sector={s.sector} />
          <div>
            <div style={{ fontWeight: 600, color: theme.textBright, fontSize: isMobile ? 12 : 13, fontFamily: "var(--font-ui)", letterSpacing: "0.01em" }}>{s.ticker}</div>
            <div style={{ fontSize: 10, color: theme.textMuted, maxWidth: isMobile ? 120 : undefined, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: isMobile ? "14px 8px" : "14px 16px", textAlign: "right", fontWeight: 600, color: priceColor, fontSize: isMobile ? 12 : 13, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)" }}>{fmt(currentPrice)} {s.unit || "zł"}</td>
      <td style={{ padding: isMobile ? "14px 8px" : "14px 16px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
        <span style={{ display: "inline-block", padding: "3px 8px", borderRadius: 6, fontSize: isMobile ? 11 : 12, fontWeight: 600, background: c24h > 0 ? "rgba(34,197,94,0.12)" : c24h < 0 ? "rgba(239,68,68,0.12)" : "rgba(148,163,184,0.08)", color: changeColor(c24h), whiteSpace: "nowrap", fontFamily: "var(--font-mono)" }}>{changeFmt(c24h)}</span>
      </td>
      {!isMobile && <td style={{ padding: "14px 16px", textAlign: "right", color: changeColor(c7d), fontSize: 12, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)" }}>{changeFmt(c7d)}</td>}
      {!isMobile && (tab === "akcje" || tab === "screener") && <td style={{ padding: "14px 16px", textAlign: "right", color: theme.textSecondary, fontSize: 12, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)" }}>{fmtCap(s.cap)}</td>}
      {!isMobile && tab !== "screener" && <td style={{ padding: "14px 16px", textAlign: "right", color: theme.textSecondary, fontSize: 12, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)" }}>{fmtVolume(volume, currentPrice)}</td>}
      {!isMobile && tab === "akcje" && showPE  && <td style={{ padding: "14px 16px", textAlign: "right", color: theme.textSecondary, fontSize: 12, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)" }}>{s.pe ? fmt(s.pe) : "—"}</td>}
      {!isMobile && tab === "akcje" && showDiv && <td style={{ padding: "14px 16px", textAlign: "right", color: s.div > 0 ? "#22c55e" : theme.textSecondary, fontSize: 12, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)" }}>{s.div ? `${fmt(s.div)}%` : "—"}</td>}
      {!isMobile && <td style={{ padding: "14px 16px", textAlign: "right" }}><Sparkline prices={sparkline} trend={c7d} /></td>}
      {!isMobile && (
        <td style={{ padding: "14px 16px", textAlign: "right" }}>
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

const EDUKACJA_CATEGORIES = ["podstawy", "analiza", "strategia"];

function getRouteFromPath(pathname) {
  if (pathname === "/indeks") return { page: "feargreed" };
  if (pathname === "/wiadomosci") return { page: "news" };
  if (pathname === "/portfolio") return { page: "portfolio" };
  if (pathname === "/edukacja") return { page: "edukacja" };
  const catMatch = pathname.match(/^\/edukacja\/(podstawy|analiza|strategia)$/);
  if (catMatch) return { page: "edukacja-category", category: catMatch[1] };
  const slugMatch = pathname.match(/^\/edukacja\/([a-z0-9-]+)$/);
  if (slugMatch) return { page: "edukacja-article", slug: slugMatch[1] };
  const match = pathname.match(/^\/spolka\/([A-Z0-9]+)$/i);
  if (match) {
    const ticker = match[1].toUpperCase();
    const stock = ALL_INSTRUMENTS.find(s => s.ticker === ticker);
    if (stock) return { page: "stock", stock };
  }
  return { page: "home", stock: null };
}

export default function WigMarkets() {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState("akcje");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("cap");
  const [sortDir, setSortDir] = useState("desc");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [prices, setPrices] = useState({});
  const [changes, setChanges] = useState({});
  const [redditData, setRedditData] = useState({ ranked: [], postsScanned: 0, loading: false });
  const [selected, setSelected] = useState(null);
  const [calcStock, setCalcStock] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") !== "light");
  const [indices, setIndices] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [watchlist, setWatchlist] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("watchlist") || "[]")); } catch { return new Set(); }
  });
  const [watchFilter, setWatchFilter] = useState(false);
  const [route, setRoute] = useState(() => getRouteFromPath(window.location.pathname));
  const [hoveredRow, setHoveredRow] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState(loadAlerts);
  const [showPE, setShowPE] = useState(false);
  const [showDiv, setShowDiv] = useState(false);
  // Dynamic stock list loaded from Vercel KV (populated by daily cron).
  // Falls back to the hardcoded STOCKS array when KV is unavailable.
  const [liveStocks, setLiveStocks] = useState(STOCKS);
  const allInstruments = useMemo(() => [...liveStocks, ...COMMODITIES, ...FOREX], [liveStocks]);
  const searchRef = useRef(null);
  const PER_PAGE = 20;
  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  usePriceAlerts(prices, setAlerts);

  // SPA routing
  useEffect(() => {
    const onPopState = () => setRoute(getRouteFromPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigateToStock = useCallback((stock) => {
    window.history.pushState(null, "", `/spolka/${stock.ticker}`);
    setRoute({ page: "stock", stock });
  }, []);

  const navigateToFearGreed = useCallback(() => {
    window.history.pushState(null, "", "/indeks");
    setRoute({ page: "feargreed" });
  }, []);

  const navigateToNews = useCallback(() => {
    window.history.pushState(null, "", "/wiadomosci");
    setRoute({ page: "news" });
  }, []);

  const navigateToPortfolio = useCallback(() => {
    window.history.pushState(null, "", "/portfolio");
    setRoute({ page: "portfolio" });
  }, []);

  const navigateHome = useCallback(() => {
    window.history.pushState(null, "", "/");
    setRoute({ page: "home", stock: null });
    document.title = "WIGmarkets - Notowania GPW";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Notowania GPW w czasie rzeczywistym");
  }, []);

  const navigateToEdukacja = useCallback(() => {
    window.history.pushState(null, "", "/edukacja");
    setRoute({ page: "edukacja" });
  }, []);

  const navigateToEdukacjaCategory = useCallback((category) => {
    window.history.pushState(null, "", `/edukacja/${category}`);
    setRoute({ page: "edukacja-category", category });
  }, []);

  const navigateToEdukacjaArticle = useCallback((slug) => {
    window.history.pushState(null, "", `/edukacja/${slug}`);
    setRoute({ page: "edukacja-article", slug });
  }, []);

  const bgGradient = darkMode
    ? "linear-gradient(180deg, #0b0d14 0%, #0f1117 100%)"
    : "linear-gradient(180deg, #eef2f7 0%, #f6f8fa 100%)";

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.style.background = bgGradient;
    document.body.style.backgroundAttachment = "fixed";
  }, [darkMode, bgGradient]);

  const toggleWatch = (ticker) => {
    setWatchlist(prev => {
      const next = new Set(prev);
      next.has(ticker) ? next.delete(ticker) : next.add(ticker);
      localStorage.setItem("watchlist", JSON.stringify([...next]));
      return next;
    });
  };

  // Load dynamic stock list from /api/gpw-screener on mount (~300 GPW stocks).
  // Also seeds initial quote prices so the table isn't blank on first render.
  useEffect(() => {
    fetchDynamicList().then(data => {
      if (!data) return;
      setLiveStocks(data.stocks);
      const newPrices = {}, newChanges = {};
      for (const [ticker, q] of Object.entries(data.quotes || {})) {
        if (q?.close) {
          newPrices[ticker] = q.close;
          newChanges[ticker] = { change24h: q.change24h ?? 0, change7d: q.change7d ?? 0, volume: q.volume ?? 0, sparkline: q.sparkline ?? null };
        }
      }
      if (Object.keys(newPrices).length) {
        setPrices(prev => ({ ...prev, ...newPrices }));
        setChanges(prev => ({ ...prev, ...newChanges }));
      }
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      const data = await fetchIndices();
      if (data.length) setIndices(data);
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const activeData = tab === "watchlist" ? allInstruments : tab === "forex" ? FOREX : (tab === "akcje" || tab === "screener" || tab === "popularne") ? liveStocks : COMMODITIES;
    const symbols = activeData.map(item => item.stooq || item.ticker.toLowerCase());
    const fetchAll = async () => {
      const bulk = await fetchBulk(symbols);
      const newPrices = {};
      const newChanges = {};
      for (const item of activeData) {
        const sym = item.stooq || item.ticker.toLowerCase();
        const data = bulk[sym];
        if (data?.close) {
          newPrices[item.ticker] = data.close;
          newChanges[item.ticker] = { change24h: data.change24h ?? 0, change7d: data.change7d ?? 0, volume: data.volume ?? 0, sparkline: data.sparkline ?? null };
        }
      }
      if (Object.keys(newPrices).length) {
        setPrices(prev => ({ ...prev, ...newPrices }));
        setChanges(prev => ({ ...prev, ...newChanges }));
      }
    };
    fetchAll();
    const interval = setInterval(fetchAll, 60000);
    return () => clearInterval(interval);
  }, [tab, liveStocks]);

  const [wig20History, setWig20History] = useState([]);
  useEffect(() => {
    fetchHistory("wig20").then(d => setWig20History((d?.prices || []).slice(-7)));
  }, []);

  useEffect(() => {
    if (tab !== "popularne") return;
    const tickers = liveStocks.map(s => s.ticker);
    const load = () =>
      fetchRedditTrends(tickers).then(data =>
        setRedditData({ ...data, loading: false })
      );
    setRedditData(d => ({ ...d, loading: true }));
    load();
    const interval = setInterval(load, 300_000);
    return () => clearInterval(interval);
  }, [tab]);

  const activeData = tab === "forex" ? FOREX : (tab === "akcje" || tab === "screener" || tab === "popularne") ? liveStocks : COMMODITIES;
  const sectors = useMemo(() => ["all", ...Array.from(new Set(activeData.map(s => s.sector)))], [activeData]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return activeData
      .filter(s => (tab !== "watchlist" && !watchFilter) || watchlist.has(s.ticker))
      .filter(s => filter === "all" || s.sector === filter)
      .filter(s => s.name.toLowerCase().includes(q) || s.ticker.toLowerCase().includes(q))
      .sort((a, b) => {
        let av = a[sortBy] ?? 0, bv = b[sortBy] ?? 0;
        if (sortBy === "price")    { av = prices[a.ticker] || 0; bv = prices[b.ticker] || 0; }
        if (sortBy === "change24h") { av = changes[a.ticker]?.change24h ?? 0; bv = changes[b.ticker]?.change24h ?? 0; }
        if (sortBy === "change7d")  { av = changes[a.ticker]?.change7d  ?? 0; bv = changes[b.ticker]?.change7d  ?? 0; }
        if (sortBy === "volume")    { av = changes[a.ticker]?.volume    ?? 0; bv = changes[b.ticker]?.volume    ?? 0; }
        if (sortBy === "pe")        { av = a.pe ?? 0; bv = b.pe ?? 0; }
        if (sortBy === "div")       { av = a.div ?? 0; bv = b.div ?? 0; }
        return sortDir === "desc" ? bv - av : av - bv;
      });
  }, [activeData, filter, search, sortBy, sortDir, prices, changes, watchFilter, watchlist]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Keyboard shortcuts (must be after visible is defined)
  useKeyboardShortcuts({
    enabled: route.page === "home",
    onSlash: () => searchRef.current?.focus(),
    onEsc: () => {
      if (selected)  { setSelected(null); return; }
      if (calcStock) { setCalcStock(null); return; }
      if (search)    { setSearch(""); return; }
      searchRef.current?.blur();
    },
    onDown: () => setHoveredRow(r => Math.min(r + 1, visible.length - 1)),
    onUp:   () => setHoveredRow(r => Math.max(r - 1, 0)),
    onEnter: () => { const s = visible[hoveredRow]; if (s) navigateToStock(s); },
    onHelp: () => setShowShortcuts(s => !s),
  });
  const handleSort = (col) => { if (sortBy === col) setSortDir(d => d === "desc" ? "asc" : "desc"); else { setSortBy(col); setSortDir("desc"); } };
  const col = (label, key, right = true) => (
    <th onClick={() => handleSort(key)} style={{ padding: isMobile ? "10px 8px" : "12px 16px", textAlign: right ? "right" : "left", fontSize: 10, color: sortBy === key ? theme.accent : theme.textMuted, cursor: "pointer", whiteSpace: "nowrap", userSelect: "none", borderBottom: `2px solid ${sortBy === key ? theme.accent : theme.border}`, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-ui)", transition: "color 0.15s, border-color 0.15s" }}>
      {label}{" "}
      {sortBy === key
        ? (sortDir === "desc" ? <Icon name="chevron-down" size={12} /> : <Icon name="chevron-up" size={12} />)
        : <Icon name="chevrons-up-down" size={10} style={{ opacity: 0.3 }} />}
    </th>
  );
  const exportCSV = () => {
    const headers = ["Ticker", "Nazwa", "Sektor", "Kurs", "24h%", "7d%", "Wolumen", "Kap. (mln PLN)", "P/E", "Dyw%"];
    const rows = filtered.map(s => [
      s.ticker,
      s.name,
      s.sector || "",
      prices[s.ticker] ?? "",
      changes[s.ticker]?.change24h ?? "",
      changes[s.ticker]?.change7d  ?? "",
      changes[s.ticker]?.volume    ?? "",
      s.cap ?? "",
      s.pe  ?? "",
      s.div ?? "",
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), { href: url, download: `wigmarkets_${tab}_${new Date().toISOString().slice(0,10)}.csv` });
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const fmtIdx = (v) => v != null ? v.toLocaleString("pl-PL", { maximumFractionDigits: 2 }) : "—";
  const fmtIdxChange = (v) => v != null ? `${v >= 0 ? "+" : ""}${v.toFixed(2)}%` : "—";

  const topGainers = useMemo(() =>
    [...liveStocks].sort((a, b) => (changes[b.ticker]?.change24h ?? 0) - (changes[a.ticker]?.change24h ?? 0)).slice(0, 5),
    [changes, liveStocks]
  );
  const topLosers = useMemo(() =>
    [...liveStocks].sort((a, b) => (changes[a.ticker]?.change24h ?? 0) - (changes[b.ticker]?.change24h ?? 0)).slice(0, 5),
    [changes, liveStocks]
  );
  const popularStocks = useMemo(() =>
    redditData.ranked
      .map(({ ticker, mentions }) => {
        const stock = liveStocks.find(s => s.ticker === ticker);
        return stock ? { ...stock, mentions } : null;
      })
      .filter(Boolean),
    [redditData.ranked, liveStocks]
  );
  const topMovers = useMemo(() =>
    [...liveStocks]
      .filter(s => (changes[s.ticker]?.change24h ?? 0) !== 0)
      .sort((a, b) => Math.abs(changes[b.ticker]?.change24h ?? 0) - Math.abs(changes[a.ticker]?.change24h ?? 0))
      .slice(0, 12)
      .map(s => ({ ...s, mentions: null })),
    [changes, liveStocks]
  );
  const marketStats = useMemo(() => [
    ["Spółki rosnące", `${liveStocks.filter(s => (changes[s.ticker]?.change24h ?? 0) > 0).length}/${liveStocks.length}`, "#22c55e"],
    ["Kap. łączna (mld zł)", fmt(liveStocks.reduce((a, s) => a + (s.cap || 0), 0) / 1000, 1), "#3b82f6"],
    ["Śr. zmiana 24h", changeFmt(liveStocks.reduce((a, s) => a + (changes[s.ticker]?.change24h ?? 0), 0) / liveStocks.length), "#ffd700"],
  ], [changes, liveStocks]);

  const fgValue = FEAR_HISTORY_YEAR[FEAR_HISTORY_YEAR.length - 1];
  const fgLabel = fgValue < 25 ? "Skrajna panika" : fgValue < 45 ? "Strach" : fgValue < 55 ? "Neutralny" : fgValue < 75 ? "Chciwość" : "Ekstremalna chciwość";
  const fgColor = fgValue < 25 ? "#dc2626" : fgValue < 45 ? "#ea580c" : fgValue < 55 ? "#ca8a04" : fgValue < 75 ? "#16a34a" : "#15803d";

  function MiniSpark({ data, color }) {
    if (!data || data.length < 2) return <div style={{ width: 60, height: 24 }} />;
    const vals = data.map(d => d.close);
    const mn = Math.min(...vals), mx = Math.max(...vals), rng = mx - mn || 1;
    const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * 60},${24 - ((v - mn) / rng) * 22}`).join(" ");
    return <svg width="60" height="24" style={{ display: "block" }}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" /></svg>;
  }

  // Route: Edukacja pages
  if (route.page === "edukacja") {
    return <EdukacjaHome theme={theme} onBack={navigateHome} onNavigateCategory={navigateToEdukacjaCategory} onNavigateArticle={navigateToEdukacjaArticle} />;
  }
  if (route.page === "edukacja-category") {
    return <CategoryPage theme={theme} category={route.category} onBack={navigateToEdukacja} onNavigateArticle={navigateToEdukacjaArticle} onNavigateHome={navigateHome} />;
  }
  if (route.page === "edukacja-article") {
    return <ArticlePage theme={theme} slug={route.slug} onBack={navigateToEdukacja} onNavigateCategory={navigateToEdukacjaCategory} onNavigateArticle={navigateToEdukacjaArticle} onNavigateHome={navigateHome} />;
  }

  // Route: Fear & Greed index page
  if (route.page === "feargreed") {
    return <FearGreedPage onBack={navigateHome} theme={theme} />;
  }

  // Route: News page
  if (route.page === "news") {
    return <NewsPage onBack={navigateHome} theme={theme} onSelectStock={navigateToStock} />;
  }

  // Route: Portfolio
  if (route.page === "portfolio") {
    return <PortfolioPage onBack={navigateHome} theme={theme} prices={prices} allInstruments={ALL_INSTRUMENTS} />;
  }

  // Route: dedicated stock page
  if (route.page === "stock" && route.stock) {
    return (
      <>
        {calcStock && <ProfitCalculatorModal stock={calcStock} currentPrice={prices[calcStock.ticker]} onClose={() => setCalcStock(null)} theme={theme} />}
        <StockPage stock={route.stock} prices={prices} changes={changes} onBack={navigateHome} theme={theme} />
      </>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: bgGradient, color: theme.text, fontFamily: "var(--font-ui)" }}>

      {selected && <StockModal stock={selected} price={prices[selected.ticker]} change24h={changes[selected.ticker]?.change24h ?? 0} change7d={changes[selected.ticker]?.change7d ?? 0} onClose={() => setSelected(null)} onCalc={() => { setCalcStock(selected); }} theme={theme} />}
      {calcStock && <ProfitCalculatorModal stock={calcStock} currentPrice={prices[calcStock.ticker]} onClose={() => setCalcStock(null)} theme={theme} />}

      {/* Alerts modal */}
      {showAlerts && <AlertsModal onClose={() => setShowAlerts(false)} theme={theme} prices={prices} allInstruments={ALL_INSTRUMENTS} alerts={alerts} setAlerts={setAlerts} />}

      {/* Shortcuts help modal */}
      {showShortcuts && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowShortcuts(false)}>
          <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 28, minWidth: 300 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 800, fontSize: 15, color: theme.textBright, marginBottom: 18 }}>Skróty klawiszowe</div>
            {[
              ["/  lub  f", "Fokus na wyszukiwarkę"],
              ["Esc", "Zamknij / wyczyść"],
              ["j  /  Down", "Następny wiersz"],
              ["k  /  Up", "Poprzedni wiersz"],
              ["Enter", "Otwórz podświetlony instrument"],
              ["?", "Pokaż / ukryj ten panel"],
            ].map(([key, desc]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${theme.bgCardAlt}`, fontSize: 13 }}>
                <kbd style={{ background: theme.bgCardAlt, border: `1px solid ${theme.border}`, borderRadius: 5, padding: "2px 8px", fontFamily: "monospace", fontSize: 12, color: theme.textBright }}>{key}</kbd>
                <span style={{ color: theme.textSecondary }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top bar */}
      <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}`, padding: "0 16px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: isMobile ? 16 : 32, padding: "10px 0", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: theme.textBright, whiteSpace: "nowrap", fontFamily: "var(--font-ui)", letterSpacing: "-0.02em" }}>WIG<span style={{ color: theme.accent }}>markets</span></div>
          {!isMobile && indices.map(idx => (
            <div key={idx.name} style={{ display: "flex", gap: 8, alignItems: "baseline", whiteSpace: "nowrap" }}>
              <span style={{ color: theme.accent, fontWeight: 600, fontSize: 11, fontFamily: "var(--font-ui)" }}>{idx.name}</span>
              <span style={{ fontSize: 12, color: theme.textBright, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{fmtIdx(idx.value)}</span>
              <span style={{ fontSize: 11, color: idx.change24h >= 0 ? "#22c55e" : "#ef4444", fontFamily: "var(--font-mono)", fontWeight: 600 }}>{fmtIdxChange(idx.change24h)}</span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 6, flexShrink: 0 }}>
            <button onClick={() => setShowAlerts(s => !s)} title="Alerty cenowe" style={{ position: "relative", background: theme.bgCardAlt, border: `1px solid ${theme.border}`, borderRadius: 6, color: theme.textSecondary, padding: "4px 10px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              <Icon name="bell" size={16} />{alerts.some(a => a.triggered) && <span style={{ position: "absolute", top: 2, right: 2, width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "block" }} />}
            </button>
            {!isMobile && (
              <button onClick={() => setShowShortcuts(s => !s)} title="Skróty klawiszowe (?)" style={{ background: theme.bgCardAlt, border: `1px solid ${theme.border}`, borderRadius: 6, color: theme.textSecondary, padding: "4px 10px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>?</button>
            )}
            <button onClick={() => setDarkMode(d => !d)} style={{ background: theme.bgCardAlt, border: `1px solid ${theme.border}`, borderRadius: 6, color: theme.textSecondary, padding: "4px 10px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              {darkMode ? "Jasny" : "Ciemny"}
            </button>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(o => !o)} style={{ background: theme.bgCardAlt, border: `1px solid ${theme.border}`, borderRadius: 6, color: theme.textSecondary, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
              {sidebarOpen ? <Icon name="x" size={14} /> : "Wykres"}
            </button>
          )}
        </div>
      </div>

      {/* Marquee ticker */}
      <MarqueeTicker stocks={[...liveStocks, ...COMMODITIES, ...FOREX]} prices={prices} changes={changes} theme={theme} onSelect={navigateToStock} />

      {/* Market Overview Dashboard */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: isMobile ? "10px 12px 0" : "16px 24px 0" }}>
        <MarketOverviewCards
          indices={indices}
          topGainers={topGainers}
          topLosers={topLosers}
          changes={changes}
          prices={prices}
          navigateToStock={navigateToStock}
          navigateToFearGreed={navigateToFearGreed}
          theme={theme}
          isMobile={isMobile}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div style={{ padding: "16px", background: theme.bgCard, borderBottom: `1px solid ${theme.border}` }}>
          <FearGauge value={62} isMobile={true} theme={theme} />
        </div>
      )}

      <div style={{ padding: isMobile ? "16px 12px 0" : "24px 24px 0", maxWidth: 1400, margin: "0 auto" }}>
        {/* Tabs + View toggle */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "nowrap", alignItems: "center", overflowX: "auto", WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none", paddingBottom: 2 }}>
          {[["akcje", "Akcje GPW"], ["popularne", "Popularne"], ["surowce", "Surowce"], ["forex", "Forex"], ["screener", "Screener"], ["watchlist", `Obserwowane${watchlist.size ? ` (${watchlist.size})` : ""}`]].map(([key, label]) => (
            <button key={key} onClick={() => { setTab(key); setPage(1); setFilter("all"); setWatchFilter(false); }} style={{ padding: isMobile ? "8px 14px" : "8px 20px", borderRadius: 8, border: "none", borderBottom: tab === key ? `2px solid ${theme.accent}` : "2px solid transparent", background: tab === key ? `${theme.accent}18` : "transparent", color: tab === key ? theme.accent : theme.textMuted, fontSize: isMobile ? 12 : 13, fontWeight: tab === key ? 600 : 400, cursor: "pointer", fontFamily: "var(--font-ui)", flexShrink: 0, transition: "all 0.2s ease", letterSpacing: "0.01em" }}>{label}</button>
          ))}
          <button onClick={navigateToNews} style={{ padding: isMobile ? "8px 14px" : "8px 20px", borderRadius: 8, border: "none", borderBottom: "2px solid transparent", background: "transparent", color: theme.textMuted, fontSize: isMobile ? 12 : 13, fontWeight: 400, cursor: "pointer", fontFamily: "var(--font-ui)", flexShrink: 0, transition: "all 0.2s ease" }}>Wiadomości</button>
          <button onClick={navigateToPortfolio} style={{ padding: isMobile ? "8px 14px" : "8px 20px", borderRadius: 8, border: "none", borderBottom: "2px solid transparent", background: "transparent", color: theme.textMuted, fontSize: isMobile ? 12 : 13, fontWeight: 400, cursor: "pointer", fontFamily: "var(--font-ui)", flexShrink: 0, transition: "all 0.2s ease" }}>Portfolio</button>
          <button onClick={navigateToEdukacja} style={{ padding: isMobile ? "8px 14px" : "8px 20px", borderRadius: 8, border: "none", borderBottom: `2px solid ${theme.accent}40`, background: `${theme.accent}10`, color: theme.accent, fontSize: isMobile ? 12 : 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-ui)", flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.2s ease" }}><Icon name="book-open" size={14} /> Edukacja</button>
          {tab !== "screener" && tab !== "popularne" && tab !== "watchlist" && (
          <div style={{ marginLeft: "auto", display: "flex", gap: 4, flexShrink: 0 }}>
            <button onClick={() => setWatchFilter(f => !f)} style={{ padding: isMobile ? "6px 10px" : "8px 14px", borderRadius: 8, border: "1px solid", borderColor: watchFilter ? "#ffd700" : theme.borderInput, background: watchFilter ? "#ffd70022" : "transparent", color: watchFilter ? "#ffd700" : theme.textSecondary, fontSize: isMobile ? 11 : 12, cursor: "pointer", fontFamily: "inherit", fontWeight: watchFilter ? 700 : 400, flexShrink: 0 }}>
              Obserwowane{watchlist.size > 0 ? ` (${watchlist.size})` : ""}
            </button>
            {tab === "akcje" && !isMobile && (
              <div style={{ display: "flex", borderRadius: 8, border: `1px solid ${theme.borderInput}`, overflow: "hidden" }}>
                {[["table", "Tabela"], ["heatmap", "Heatmapa"]].map(([key, label]) => (
                  <button key={key} onClick={() => setViewMode(key)} style={{ padding: "8px 14px", border: "none", background: viewMode === key ? `${theme.accent}18` : "transparent", color: viewMode === key ? theme.accent : theme.textSecondary, fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: viewMode === key ? 700 : 400 }}>{label}</button>
                ))}
              </div>
            )}
          </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", display: isMobile ? "block" : "grid", gridTemplateColumns: (tab === "screener" || tab === "forex") ? "1fr" : "1fr 280px", gap: 24, padding: isMobile ? "0 12px" : "0 24px" }}>
        {tab === "screener" ? (
          <ScreenerView stocks={liveStocks} prices={prices} changes={changes} theme={theme} onSelect={navigateToStock} />
        ) : (<>
        <div>
          {/* Popularne tab */}
          {tab === "popularne" && (() => {
            const isReddit = popularStocks.length > 0;
            const displayStocks = isReddit ? popularStocks : topMovers;
            return (
            <div>
              <div style={{ marginBottom: 16, fontSize: 12, color: theme.textSecondary }}>
                {isReddit
                  ? `Trendy z Reddit (r/inwestowanie, r/gielda) · ${redditData.postsScanned} postów`
                  : "Najbardziej aktywne spółki dziś" + (redditData.loading ? " · sprawdzam Reddit..." : " · brak wzmianek na Reddit")}
              </div>
              {displayStocks.length === 0 && (
                <div style={{ textAlign: "center", padding: 48, color: theme.textSecondary }}>Ładowanie danych...</div>
              )}
              {displayStocks.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: isMobile ? 10 : 16 }}>
                  {displayStocks.map((s, i) => {
                    const price = prices[s.ticker];
                    const c24h = changes[s.ticker]?.change24h ?? 0;
                    const borderColor = c24h > 0 ? "rgba(34,197,94,0.2)" : c24h < 0 ? "rgba(239,68,68,0.2)" : theme.border;
                    return (
                      <div key={s.ticker} onClick={() => navigateToStock(s)}
                        style={{ background: `linear-gradient(135deg, ${theme.bgCardAlt} 0%, ${theme.bgCard} 100%)`, border: `1px solid ${borderColor}`, borderRadius: 14, padding: isMobile ? 12 : 16, cursor: "pointer", position: "relative", transition: "border-color 0.2s, transform 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.transform = "none"; }}
                      >
                        <div style={{ position: "absolute", top: 10, right: 10, fontSize: 10, color: theme.textMuted, fontWeight: 600, fontFamily: "var(--font-mono)" }}>#{i + 1}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <StockLogo ticker={s.ticker} size={32} borderRadius={8} sector={s.sector} />
                          <div>
                            <div style={{ fontWeight: 600, color: theme.textBright, fontSize: 14, fontFamily: "var(--font-ui)" }}>{s.ticker}</div>
                            <div style={{ fontSize: 10, color: theme.textMuted }}>{s.sector}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: isMobile ? 11 : 12, color: theme.text, marginBottom: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontWeight: 600, color: c24h > 0 ? "#22c55e" : c24h < 0 ? "#ef4444" : theme.text, fontSize: 13, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{fmt(price)} zł</div>
                          <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: c24h > 0 ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", color: changeColor(c24h), fontFamily: "var(--font-mono)" }}>{changeFmt(c24h)}</span>
                        </div>
                        <div style={{ marginTop: 8, fontSize: 10, fontWeight: 600, color: s.mentions !== null ? "#ff6314" : theme.textSecondary }}>
                          {s.mentions !== null
                            ? `${s.mentions} ${s.mentions === 1 ? "wzmianka" : s.mentions < 5 ? "wzmianki" : "wzmianek"} na Reddit`
                            : `zmiana 24h: ${changeFmt(c24h)}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            );
          })()}

          {/* Heatmap view */}
          {viewMode === "heatmap" && tab === "akcje" && !isMobile && (
            <Heatmap stocks={liveStocks} prices={prices} changes={changes} theme={theme} onSelect={navigateToStock} />
          )}

          {tab === "watchlist" && watchlist.size === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: theme.textSecondary }}>
              <div style={{ marginBottom: 14, color: "#ffd700" }}><Icon name="star" size={36} /></div>
              <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 8 }}>Lista obserwowanych jest pusta</div>
              <div style={{ fontSize: 13 }}>Kliknij gwiazdkę przy instrumencie w zakładce Akcje, Surowce lub Forex</div>
            </div>
          )}
          {tab !== "popularne" && (tab !== "watchlist" || watchlist.size > 0) && (<>
          {/* Controls */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <input ref={searchRef} value={search} onChange={e => { setSearch(e.target.value); setPage(1); setHoveredRow(0); }} placeholder="Szukaj... (/ aby otworzyć)"
              onFocus={e => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px ${theme.accent}18`; }}
              onBlur={e => { e.target.style.borderColor = theme.borderInput; e.target.style.boxShadow = "none"; }}
              style={{ flex: 1, minWidth: 140, height: 40, background: theme.bgCard, border: `1px solid ${theme.borderInput}`, borderRadius: 10, padding: "0 14px", color: theme.text, fontSize: 13, outline: "none", fontFamily: "var(--font-ui)", transition: "border-color 0.2s, box-shadow 0.2s" }} />
            <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}
              style={{ height: 40, background: theme.bgCard, border: `1px solid ${theme.borderInput}`, borderRadius: 8, padding: "0 12px", color: theme.text, fontSize: 12, cursor: "pointer", fontFamily: "var(--font-ui)", outline: "none", transition: "border-color 0.15s" }}>
              {sectors.map(s => <option key={s} value={s}>{s === "all" ? "Wszystkie sektory" : s}</option>)}
            </select>
            {!isMobile && tab === "akcje" && (
              <>
                <button onClick={() => setShowPE(v => !v)} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${showPE ? theme.accent : theme.borderInput}`, background: showPE ? `${theme.accent}18` : "transparent", color: showPE ? theme.accent : theme.textSecondary, fontSize: 12, cursor: "pointer", fontFamily: "var(--font-ui)", whiteSpace: "nowrap", transition: "all 0.15s" }}>P/E</button>
                <button onClick={() => setShowDiv(v => !v)} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${showDiv ? theme.accent : theme.borderInput}`, background: showDiv ? `${theme.accent}18` : "transparent", color: showDiv ? theme.accent : theme.textSecondary, fontSize: 12, cursor: "pointer", fontFamily: "var(--font-ui)", whiteSpace: "nowrap", transition: "all 0.15s" }}>Dyw %</button>
              </>
            )}
            {!isMobile && (
              <button onClick={exportCSV} title="Pobierz tabelę jako CSV" style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${theme.borderInput}`, background: "transparent", color: theme.textSecondary, fontSize: 12, cursor: "pointer", fontFamily: "var(--font-ui)", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}><Icon name="download" size={13} /> CSV</button>
            )}
          </div>

          {/* Table */}
          <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 12 : 13, minWidth: isMobile ? "auto" : 600 }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 2, background: theme.bgCard }}>
                  <tr>
                    <th style={{ padding: isMobile ? "10px 4px" : "12px 8px", borderBottom: `2px solid ${theme.border}`, width: 28, background: theme.bgCard }}></th>
                    {!isMobile && col("#", "id", false)}
                    <th style={{ padding: isMobile ? "10px 10px" : "12px 16px", textAlign: "left", fontSize: 10, color: theme.textMuted, borderBottom: `2px solid ${theme.border}`, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-ui)" }}>Instrument</th>
                    {col("Kurs", "price")}
                    {col("24h %", "change24h")}
                    {!isMobile && col("7d %", "change7d")}
                    {!isMobile && (tab === "akcje" || tab === "screener") && col("Kapitalizacja", "cap")}
                    {!isMobile && tab !== "screener" && col("Obrót", "volume")}
                    {!isMobile && (tab === "akcje") && showPE && col("P/E", "pe")}
                    {!isMobile && (tab === "akcje") && showDiv && col("Dyw %", "div")}
                    {!isMobile && <th style={{ padding: "12px 16px", textAlign: "right", fontSize: 10, color: theme.textMuted, borderBottom: `2px solid ${theme.border}`, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-ui)" }}>7D</th>}
                    {!isMobile && <th style={{ padding: "12px 16px", borderBottom: `2px solid ${theme.border}` }}></th>}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(prices).length === 0
                    ? Array.from({ length: Math.min(visible.length || 10, 10) }, (_, i) => (
                        <SkeletonRow key={i} theme={theme} isMobile={isMobile} tab={tab} />
                      ))
                    : visible.map((s, i) => (
                        <TableRow key={s.id} s={s} i={i} rank={(page - 1) * PER_PAGE + i + 1}
                          isMobile={isMobile} tab={tab} theme={theme}
                          prices={prices} changes={changes}
                          watchlist={watchlist} toggleWatch={toggleWatch}
                          navigateToStock={navigateToStock} setSelected={setSelected} setCalcStock={setCalcStock}
                          isKeyboardActive={i === hoveredRow} onHover={() => setHoveredRow(i)}
                          showPE={showPE} showDiv={showDiv}
                        />
                      ))
                  }
                </tbody>
              </table>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${theme.border}`, flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "var(--font-ui)" }}>{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} z {filtered.length}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid", borderColor: p === page ? theme.accent : theme.borderInput, background: p === page ? `${theme.accent}18` : "transparent", color: p === page ? theme.accent : theme.textMuted, fontSize: 11, cursor: "pointer", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", transition: "all 0.15s" }}>{p}</button>
                ))}
              </div>
            </div>
          </div>
          </>)}
        </div>

        {/* Desktop sidebar */}
        {!isMobile && tab !== "forex" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div onClick={navigateToFearGreed} style={{ cursor: "pointer", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              <FearGauge value={62} isMobile={false} theme={theme} />
            </div>
            {tab === "akcje" && <SectorDonut stocks={liveStocks} theme={theme} />}
            <div style={{ background: `linear-gradient(135deg, ${theme.bgCardAlt} 0%, ${theme.bgCard} 100%)`, border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600, fontFamily: "var(--font-ui)" }}>Top wzrosty 24h</div>
              {topGainers.map(s => (
                <div key={s.ticker} onClick={() => navigateToStock(s)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: `1px solid ${theme.border}`, cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <CompanyMonogram ticker={s.ticker} sector={s.sector} size={24} />
                    <div style={{ minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 12, color: theme.textBright, fontFamily: "var(--font-ui)" }}>{s.ticker}</div><div style={{ fontSize: 10, color: theme.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.sector}</div></div>
                  </div>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "rgba(34,197,94,0.12)", color: "#22c55e", fontFamily: "var(--font-mono)", flexShrink: 0 }}>{changeFmt(changes[s.ticker]?.change24h ?? 0)}</span>
                </div>
              ))}
            </div>
            <div style={{ background: `linear-gradient(135deg, ${theme.bgCardAlt} 0%, ${theme.bgCard} 100%)`, border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600, fontFamily: "var(--font-ui)" }}>Top spadki 24h</div>
              {topLosers.map(s => (
                <div key={s.ticker} onClick={() => navigateToStock(s)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: `1px solid ${theme.border}`, cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <CompanyMonogram ticker={s.ticker} sector={s.sector} size={24} />
                    <div style={{ minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 12, color: theme.textBright, fontFamily: "var(--font-ui)" }}>{s.ticker}</div><div style={{ fontSize: 10, color: theme.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.sector}</div></div>
                  </div>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "rgba(239,68,68,0.12)", color: "#ef4444", fontFamily: "var(--font-mono)", flexShrink: 0 }}>{changeFmt(changes[s.ticker]?.change24h ?? 0)}</span>
                </div>
              ))}
            </div>
            <div style={{ background: `linear-gradient(135deg, ${theme.bgCardAlt} 0%, ${theme.bgCard} 100%)`, border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600, fontFamily: "var(--font-ui)" }}>Statystyki rynku</div>
              {marketStats.map(([label, val, color]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${theme.border}`, fontSize: 11 }}>
                  <span style={{ color: theme.textSecondary, fontFamily: "var(--font-ui)" }}>{label}</span>
                  <span style={{ fontWeight: 600, color, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        </>)}
      </div>

      {/* Market stats bottom bar */}
      <div style={{ background: theme.bgCard, borderTop: `1px solid ${theme.border}`, overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
        <div style={{ display: "flex", gap: 0, minWidth: "max-content" }}>
          {[
            { label: "Spółki rosnące", value: `${liveStocks.filter(s => (changes[s.ticker]?.change24h ?? 0) > 0).length} / ${liveStocks.length}`, color: "#22c55e" },
            { label: "Spółki spadające", value: `${liveStocks.filter(s => (changes[s.ticker]?.change24h ?? 0) < 0).length} / ${liveStocks.length}`, color: "#ef4444" },
            { label: "Śr. zmiana 24h", value: changeFmt(liveStocks.reduce((a, s) => a + (changes[s.ticker]?.change24h ?? 0), 0) / liveStocks.length || 0), color: changeColor(liveStocks.reduce((a, s) => a + (changes[s.ticker]?.change24h ?? 0), 0)) },
            { label: "Kap. łączna", value: `${fmt(liveStocks.reduce((a, s) => a + (s.cap || 0), 0) / 1000, 1)} mld zł`, color: "#3b82f6" },
            { label: "Złoto (XAU)", value: prices["XAU"] ? `${fmt(prices["XAU"])} USD` : "—", color: "#ffd700" },
            { label: "Ropa WTI", value: prices["CL"] ? `${fmt(prices["CL"])} USD` : "—", color: "#f0883e" },
            { label: "EUR/PLN", value: prices["EURPLN"] ? fmt(prices["EURPLN"]) : "—", color: theme.textSecondary },
            { label: "USD/PLN", value: prices["USDPLN"] ? fmt(prices["USDPLN"]) : "—", color: theme.textSecondary },
          ].map(({ label, value, color }, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRight: `1px solid ${theme.border}`, whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 10, color: theme.textSecondary, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "16px 24px", fontSize: 10, color: theme.textSecondary }}>
        WIGmarkets © 2026 · Dane z GPW via Yahoo Finance · Nie stanowią rekomendacji inwestycyjnej
      </div>

      <ToastContainer theme={theme} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<WigMarkets />);

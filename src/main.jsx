import { useState, useEffect, useMemo, useCallback } from "react";
import ReactDOM from "react-dom/client";
import { DARK_THEME, LIGHT_THEME } from "./themes.js";
import { fetchBulk, fetchIndices, fetchRedditTrends } from "./api.js";
import { STOCKS, COMMODITIES } from "./data/stocks.js";
import { fmt, changeFmt, changeColor } from "./utils.js";
import { useIsMobile } from "./hooks/useIsMobile.js";
import Sparkline from "./components/Sparkline.jsx";
import MarqueeTicker from "./components/MarqueeTicker.jsx";
import Heatmap from "./components/Heatmap.jsx";
import SectorDonut from "./components/SectorDonut.jsx";
import WatchStar from "./components/WatchStar.jsx";
import FearGauge from "./components/FearGauge.jsx";
import ProfitCalculatorModal from "./components/ProfitCalculatorModal.jsx";
import StockModal from "./components/StockModal.jsx";
import StockLogo from "./components/StockLogo.jsx";
import StockPage from "./components/StockPage.jsx";
import FearGreedPage from "./components/FearGreedPage.jsx";
import NewsPage from "./components/NewsPage.jsx";
import ScreenerView from "./components/ScreenerView.jsx";

const ALL_INSTRUMENTS = [...STOCKS, ...COMMODITIES];

function getRouteFromPath(pathname) {
  if (pathname === "/indeks") return { page: "feargreed" };
  if (pathname === "/wiadomosci") return { page: "news" };
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
  const PER_PAGE = 20;
  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

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

  const navigateHome = useCallback(() => {
    window.history.pushState(null, "", "/");
    setRoute({ page: "home", stock: null });
    document.title = "WIGmarkets - Notowania GPW";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Notowania GPW w czasie rzeczywistym");
  }, []);

  const bgGradient = darkMode
    ? "linear-gradient(180deg, #0a0a0f 0%, #0d1117 100%)"
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
    const activeData = (tab === "akcje" || tab === "screener" || tab === "popularne") ? STOCKS : COMMODITIES;
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
          newChanges[item.ticker] = { change24h: data.change24h ?? 0, change7d: data.change7d ?? 0 };
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
  }, [tab]);

  useEffect(() => {
    if (tab !== "popularne") return;
    const tickers = STOCKS.map(s => s.ticker);
    const load = () =>
      fetchRedditTrends(tickers).then(data =>
        setRedditData({ ...data, loading: false })
      );
    setRedditData(d => ({ ...d, loading: true }));
    load();
    const interval = setInterval(load, 300_000);
    return () => clearInterval(interval);
  }, [tab]);

  const activeData = (tab === "akcje" || tab === "screener" || tab === "popularne") ? STOCKS : COMMODITIES;
  const sectors = useMemo(() => ["all", ...Array.from(new Set(activeData.map(s => s.sector)))], [activeData]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return activeData
      .filter(s => !watchFilter || watchlist.has(s.ticker))
      .filter(s => filter === "all" || s.sector === filter)
      .filter(s => s.name.toLowerCase().includes(q) || s.ticker.toLowerCase().includes(q))
      .sort((a, b) => {
        let av = a[sortBy] ?? 0, bv = b[sortBy] ?? 0;
        if (sortBy === "price") { av = prices[a.ticker] || 0; bv = prices[b.ticker] || 0; }
        if (sortBy === "change24h") { av = changes[a.ticker]?.change24h ?? 0; bv = changes[b.ticker]?.change24h ?? 0; }
        if (sortBy === "change7d") { av = changes[a.ticker]?.change7d ?? 0; bv = changes[b.ticker]?.change7d ?? 0; }
        return sortDir === "desc" ? bv - av : av - bv;
      });
  }, [activeData, filter, search, sortBy, sortDir, prices, changes, watchFilter, watchlist]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const handleSort = (col) => { if (sortBy === col) setSortDir(d => d === "desc" ? "asc" : "desc"); else { setSortBy(col); setSortDir("desc"); } };
  const col = (label, key, right = true) => (
    <th onClick={() => handleSort(key)} style={{ padding: isMobile ? "8px 8px" : "10px 16px", textAlign: right ? "right" : "left", fontSize: 10, color: sortBy === key ? theme.accent : theme.textSecondary, cursor: "pointer", whiteSpace: "nowrap", userSelect: "none", borderBottom: `1px solid ${theme.border}`, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
      {label} {sortBy === key ? (sortDir === "desc" ? "↓" : "↑") : ""}
    </th>
  );
  const fmtIdx = (v) => v != null ? v.toLocaleString("pl-PL", { maximumFractionDigits: 2 }) : "—";
  const fmtIdxChange = (v) => v != null ? `${v >= 0 ? "+" : ""}${v.toFixed(2)}%` : "—";

  const topGainers = useMemo(() =>
    [...STOCKS].sort((a, b) => (changes[b.ticker]?.change24h ?? 0) - (changes[a.ticker]?.change24h ?? 0)).slice(0, 5),
    [changes]
  );
  const topLosers = useMemo(() =>
    [...STOCKS].sort((a, b) => (changes[a.ticker]?.change24h ?? 0) - (changes[b.ticker]?.change24h ?? 0)).slice(0, 5),
    [changes]
  );
  const popularStocks = useMemo(() =>
    redditData.ranked
      .map(({ ticker, mentions }) => {
        const stock = STOCKS.find(s => s.ticker === ticker);
        return stock ? { ...stock, mentions } : null;
      })
      .filter(Boolean),
    [redditData.ranked]
  );
  const topMovers = useMemo(() =>
    [...STOCKS]
      .filter(s => (changes[s.ticker]?.change24h ?? 0) !== 0)
      .sort((a, b) => Math.abs(changes[b.ticker]?.change24h ?? 0) - Math.abs(changes[a.ticker]?.change24h ?? 0))
      .slice(0, 12)
      .map(s => ({ ...s, mentions: null })),
    [changes]
  );
  const marketStats = useMemo(() => [
    ["Spółki rosnące", `${STOCKS.filter(s => (changes[s.ticker]?.change24h ?? 0) > 0).length}/${STOCKS.length}`, "#00c896"],
    ["Kap. łączna (mld zł)", fmt(STOCKS.reduce((a, s) => a + s.cap, 0) / 1000, 1), "#58a6ff"],
    ["Śr. zmiana 24h", changeFmt(STOCKS.reduce((a, s) => a + (changes[s.ticker]?.change24h ?? 0), 0) / STOCKS.length), "#ffd700"],
  ], [changes]);

  // Route: Fear & Greed index page
  if (route.page === "feargreed") {
    return <FearGreedPage onBack={navigateHome} theme={theme} />;
  }

  // Route: News page
  if (route.page === "news") {
    return <NewsPage onBack={navigateHome} theme={theme} onSelectStock={navigateToStock} />;
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
    <div style={{ minHeight: "100vh", background: bgGradient, color: theme.text, fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>

      {selected && <StockModal stock={selected} price={prices[selected.ticker]} change24h={changes[selected.ticker]?.change24h ?? 0} change7d={changes[selected.ticker]?.change7d ?? 0} onClose={() => setSelected(null)} onCalc={() => { setCalcStock(selected); }} theme={theme} />}
      {calcStock && <ProfitCalculatorModal stock={calcStock} currentPrice={prices[calcStock.ticker]} onClose={() => setCalcStock(null)} theme={theme} />}

      {/* Top bar */}
      <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}`, padding: "0 16px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: isMobile ? 16 : 32, padding: "10px 0", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: theme.textBright, whiteSpace: "nowrap" }}>WIG<span style={{ color: theme.accent }}>markets</span></div>
          {!isMobile && indices.map(idx => (
            <div key={idx.name} style={{ display: "flex", gap: 8, alignItems: "baseline", whiteSpace: "nowrap" }}>
              <span style={{ color: theme.accent, fontWeight: 700, fontSize: 11 }}>{idx.name}</span>
              <span style={{ fontSize: 12, color: theme.textBright }}>{fmtIdx(idx.value)}</span>
              <span style={{ fontSize: 11, color: idx.change24h >= 0 ? "#00c896" : "#ff4d6d" }}>{fmtIdxChange(idx.change24h)}</span>
            </div>
          ))}
          {isMobile && indices.slice(0, 2).map(idx => (
            <div key={idx.name} style={{ display: "flex", gap: 6, alignItems: "baseline", whiteSpace: "nowrap" }}>
              <span style={{ color: theme.accent, fontWeight: 700, fontSize: 10 }}>{idx.name}</span>
              <span style={{ fontSize: 11, color: idx.change24h >= 0 ? "#00c896" : "#ff4d6d" }}>{fmtIdxChange(idx.change24h)}</span>
            </div>
          ))}
          <button onClick={() => setDarkMode(d => !d)} style={{ marginLeft: "auto", background: theme.bgCardAlt, border: `1px solid ${theme.border}`, borderRadius: 6, color: theme.textSecondary, padding: "4px 10px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
            {darkMode ? "Jasny" : "Ciemny"}
          </button>
          {isMobile && (
            <button onClick={() => setSidebarOpen(o => !o)} style={{ background: theme.bgCardAlt, border: `1px solid ${theme.border}`, borderRadius: 6, color: theme.textSecondary, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
              {sidebarOpen ? "✕" : "Wykres"}
            </button>
          )}
        </div>
      </div>

      {/* Marquee ticker */}
      <MarqueeTicker stocks={[...STOCKS, ...COMMODITIES]} prices={prices} changes={changes} theme={theme} onSelect={navigateToStock} />

      {/* Market stat cards */}
      {(() => {
        const growing = STOCKS.filter(s => (changes[s.ticker]?.change24h ?? 0) > 0).length;
        const totalCap = STOCKS.reduce((a, s) => a + s.cap, 0) / 1000;
        const avgChg = STOCKS.reduce((a, s) => a + (changes[s.ticker]?.change24h ?? 0), 0) / STOCKS.length;
        const cards = [
          { label: "Kapitalizacja GPW", value: `${fmt(totalCap, 1)} mld zł`, sub: "łączna wartość rynkowa", color: "#58a6ff", glow: "#1f6feb" },
          { label: "Spółki rosnące", value: `${growing} / ${STOCKS.length}`, sub: "dziś na plusie", color: growing >= STOCKS.length / 2 ? "#00c896" : "#ff4d6d", glow: growing >= STOCKS.length / 2 ? "#00c896" : "#ff4d6d" },
          { label: "Śr. zmiana WIG20", value: changeFmt(avgChg), sub: "średnia 24h GPW", color: avgChg >= 0 ? "#00c896" : "#ff4d6d", glow: avgChg >= 0 ? "#00c896" : "#ff4d6d" },
        ];
        return (
          <div style={{ maxWidth: 1400, margin: "0 auto", padding: isMobile ? "12px 12px 0" : "20px 24px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: isMobile ? 8 : 16 }}>
              {cards.map(({ label, value, sub, color, glow }) => (
                <div key={label} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: isMobile ? 12 : 18, padding: isMobile ? "14px 12px" : "24px 28px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: glow + "18", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${glow}00, ${glow}55, ${glow}00)`, pointerEvents: "none" }} />
                  <div style={{ fontSize: isMobile ? 8 : 10, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: isMobile ? 1 : 1.5, fontWeight: 700, marginBottom: isMobile ? 4 : 8 }}>{label}</div>
                  <div style={{ fontSize: isMobile ? 20 : 34, fontWeight: 800, color, lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif", marginBottom: isMobile ? 3 : 6 }}>{value}</div>
                  <div style={{ fontSize: isMobile ? 9 : 11, color: theme.textSecondary }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div style={{ padding: "16px", background: theme.bgCard, borderBottom: `1px solid ${theme.border}` }}>
          <FearGauge value={62} isMobile={true} theme={theme} />
        </div>
      )}

      <div style={{ padding: isMobile ? "16px 12px 0" : "24px 24px 0", maxWidth: 1400, margin: "0 auto" }}>
        {/* Tabs + View toggle */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "nowrap", alignItems: "center", overflowX: "auto", WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none", paddingBottom: 2 }}>
          {[["akcje", "Akcje GPW"], ["popularne", "Popularne"], ["surowce", "Surowce"], ["screener", "Screener"]].map(([key, label]) => (
            <button key={key} onClick={() => { setTab(key); setPage(1); setFilter("all"); setWatchFilter(false); }} style={{ padding: isMobile ? "6px 14px" : "8px 20px", borderRadius: 8, border: "1px solid", borderColor: tab === key ? theme.accent : theme.borderInput, background: tab === key ? "#1f6feb22" : "transparent", color: tab === key ? theme.accent : theme.textSecondary, fontSize: isMobile ? 12 : 13, fontWeight: tab === key ? 700 : 400, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>{label}</button>
          ))}
          <button onClick={navigateToNews} style={{ padding: isMobile ? "6px 14px" : "8px 20px", borderRadius: 8, border: "1px solid", borderColor: theme.borderInput, background: "transparent", color: theme.textSecondary, fontSize: isMobile ? 12 : 13, fontWeight: 400, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>Wiadomości</button>
          {tab !== "screener" && tab !== "popularne" && (
          <div style={{ marginLeft: "auto", display: "flex", gap: 4, flexShrink: 0 }}>
            <button onClick={() => setWatchFilter(f => !f)} style={{ padding: isMobile ? "6px 10px" : "8px 14px", borderRadius: 8, border: "1px solid", borderColor: watchFilter ? "#ffd700" : theme.borderInput, background: watchFilter ? "#ffd70022" : "transparent", color: watchFilter ? "#ffd700" : theme.textSecondary, fontSize: isMobile ? 11 : 12, cursor: "pointer", fontFamily: "inherit", fontWeight: watchFilter ? 700 : 400, flexShrink: 0 }}>
              Obserwowane{watchlist.size > 0 ? ` (${watchlist.size})` : ""}
            </button>
            {tab === "akcje" && !isMobile && (
              <div style={{ display: "flex", borderRadius: 8, border: `1px solid ${theme.borderInput}`, overflow: "hidden" }}>
                {[["table", "Tabela"], ["heatmap", "Heatmapa"]].map(([key, label]) => (
                  <button key={key} onClick={() => setViewMode(key)} style={{ padding: "8px 14px", border: "none", background: viewMode === key ? "#1f6feb22" : "transparent", color: viewMode === key ? theme.accent : theme.textSecondary, fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: viewMode === key ? 700 : 400 }}>{label}</button>
                ))}
              </div>
            )}
          </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", display: isMobile ? "block" : "grid", gridTemplateColumns: tab === "screener" ? "1fr" : "1fr 280px", gap: 24, padding: isMobile ? "0 12px" : "0 24px" }}>
        {tab === "screener" ? (
          <ScreenerView prices={prices} changes={changes} theme={theme} onSelect={navigateToStock} />
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
                    const borderColor = c24h > 0 ? "#00c89640" : c24h < 0 ? "#ff4d6d40" : theme.border;
                    return (
                      <div key={s.ticker} onClick={() => navigateToStock(s)}
                        style={{ background: theme.bgCard, border: `1px solid ${borderColor}`, borderRadius: 12, padding: isMobile ? 12 : 16, cursor: "pointer", position: "relative" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = theme.accent}
                        onMouseLeave={e => e.currentTarget.style.borderColor = borderColor}
                      >
                        <div style={{ position: "absolute", top: 10, right: 10, fontSize: 10, color: theme.textSecondary, fontWeight: 700 }}>#{i + 1}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <StockLogo ticker={s.ticker} size={32} borderRadius={8} sector={s.sector} />
                          <div>
                            <div style={{ fontWeight: 700, color: theme.textBright, fontSize: 14 }}>{s.ticker}</div>
                            <div style={{ fontSize: 10, color: theme.textSecondary }}>{s.sector}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: isMobile ? 11 : 12, color: theme.text, marginBottom: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontWeight: 700, color: c24h > 0 ? "#00c896" : c24h < 0 ? "#ff4d6d" : theme.text, fontSize: 13 }}>{fmt(price)} zł</div>
                          <span style={{ padding: "2px 7px", borderRadius: 5, fontSize: 11, fontWeight: 700, background: c24h > 0 ? "#00c89620" : "#ff4d6d20", color: changeColor(c24h) }}>{changeFmt(c24h)}</span>
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
            <Heatmap stocks={STOCKS} prices={prices} changes={changes} theme={theme} onSelect={navigateToStock} />
          )}

          {tab !== "popularne" && (<>
          {/* Controls */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Szukaj..."
              style={{ flex: 1, minWidth: 140, background: theme.bgCard, border: `1px solid ${theme.borderInput}`, borderRadius: 8, padding: "7px 12px", color: theme.text, fontSize: 12, outline: "none", fontFamily: "inherit" }} />
            <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}
              style={{ background: theme.bgCard, border: `1px solid ${theme.borderInput}`, borderRadius: 8, padding: "7px 10px", color: theme.text, fontSize: 11, cursor: "pointer", fontFamily: "inherit", outline: "none" }}>
              {sectors.map(s => <option key={s} value={s}>{s === "all" ? "Wszystkie sektory" : s}</option>)}
            </select>
          </div>

          {/* Table */}
          <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 12 : 13, minWidth: isMobile ? "auto" : 600 }}>
                <thead>
                  <tr>
                    <th style={{ padding: isMobile ? "8px 4px" : "10px 8px", borderBottom: `1px solid ${theme.border}`, width: 28 }}></th>
                    {!isMobile && col("#", "id", false)}
                    <th style={{ padding: isMobile ? "8px 10px" : "10px 16px", textAlign: "left", fontSize: 10, color: theme.textSecondary, borderBottom: `1px solid ${theme.border}`, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Instrument</th>
                    {col("Kurs", "price")}
                    {col("24h %", "change24h")}
                    {!isMobile && col("7d %", "change7d")}
                    {!isMobile && tab === "akcje" && col("Kap.", "cap")}
                    {!isMobile && <th style={{ padding: "10px 16px", textAlign: "right", fontSize: 10, color: theme.textSecondary, borderBottom: `1px solid ${theme.border}`, fontWeight: 600 }}>7D</th>}
                    {!isMobile && <th style={{ padding: "10px 16px", borderBottom: `1px solid ${theme.border}` }}></th>}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((s, i) => {
                    const currentPrice = prices[s.ticker];
                    const c24h = changes[s.ticker]?.change24h ?? 0;
                    const c7d = changes[s.ticker]?.change7d ?? 0;
                    const priceColor = c24h > 0 ? "#00c896" : c24h < 0 ? "#ff4d6d" : "#c9d1d9";
                    return (
                      <tr key={s.id} onClick={() => isMobile ? setSelected(s) : navigateToStock(s)} style={{ borderBottom: `1px solid ${theme.bgCardAlt}`, cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = theme.bgCardAlt}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: isMobile ? "10px 4px" : "10px 8px", textAlign: "center" }}>
                          <WatchStar active={watchlist.has(s.ticker)} onClick={() => toggleWatch(s.ticker)} theme={theme} />
                        </td>
                        {!isMobile && <td style={{ padding: "10px 16px", color: theme.textSecondary, fontSize: 11 }}>{(page - 1) * PER_PAGE + i + 1}</td>}
                        <td style={{ padding: isMobile ? "10px 10px" : "10px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <StockLogo ticker={s.ticker} size={28} borderRadius={6} sector={s.sector} />
                            <div>
                              <div style={{ fontWeight: 700, color: theme.textBright, fontSize: isMobile ? 12 : 13 }}>{s.ticker}</div>
                              {!isMobile && <div style={{ fontSize: 10, color: theme.textSecondary }}>{s.name}</div>}
                              {isMobile && <div style={{ fontSize: 10, color: theme.textSecondary, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: isMobile ? "10px 8px" : "10px 16px", textAlign: "right", fontWeight: 700, color: priceColor, fontSize: isMobile ? 12 : 13, whiteSpace: "nowrap" }}>{fmt(currentPrice)} {s.unit || "zł"}</td>
                        <td style={{ padding: isMobile ? "10px 8px" : "10px 16px", textAlign: "right" }}>
                          <span style={{ padding: "2px 6px", borderRadius: 5, fontSize: isMobile ? 11 : 12, fontWeight: 700, background: c24h > 0 ? "#00c89620" : "#ff4d6d20", color: changeColor(c24h), whiteSpace: "nowrap" }}>{changeFmt(c24h)}</span>
                        </td>
                        {!isMobile && <td style={{ padding: "10px 16px", textAlign: "right", color: changeColor(c7d), fontSize: 12 }}>{changeFmt(c7d)}</td>}
                        {!isMobile && tab === "akcje" && <td style={{ padding: "10px 16px", textAlign: "right", color: theme.textSecondary, fontSize: 12 }}>{fmt(s.cap, 0)}</td>}
                        {!isMobile && <td style={{ padding: "10px 16px", textAlign: "right" }}><Sparkline trend={c7d} /></td>}
                        {!isMobile && (
                          <td style={{ padding: "10px 16px", textAlign: "right" }}>
                            <button
                              onClick={e => { e.stopPropagation(); setCalcStock(s); }}
                              style={{ padding: "5px 11px", borderRadius: 6, border: `1px solid ${theme.borderInput}`, background: "transparent", color: theme.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", lineHeight: 1.2 }}
                              title="Kalkulator zysku/straty"
                            >
                              Kalkulator
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${theme.border}`, flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: 11, color: theme.textSecondary }}>{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} z {filtered.length}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{ width: 26, height: 26, borderRadius: 5, border: "1px solid", borderColor: p === page ? theme.accent : theme.borderInput, background: p === page ? "#1f6feb22" : "transparent", color: p === page ? theme.accent : theme.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{p}</button>
                ))}
              </div>
            </div>
          </div>
          </>)}
        </div>

        {/* Desktop sidebar */}
        {!isMobile && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div onClick={navigateToFearGreed} style={{ cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.82"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              <FearGauge value={62} isMobile={false} theme={theme} />
            </div>
            {tab === "akcje" && <SectorDonut stocks={STOCKS} theme={theme} />}
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Top wzrosty 24h</div>
              {topGainers.map(s => (
                <div key={s.ticker} onClick={() => navigateToStock(s)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${theme.bgCardAlt}`, cursor: "pointer" }}>
                  <div><div style={{ fontWeight: 700, fontSize: 12, color: theme.textBright }}>{s.ticker}</div><div style={{ fontSize: 10, color: theme.textSecondary }}>{s.sector}</div></div>
                  <span style={{ padding: "2px 7px", borderRadius: 5, fontSize: 11, fontWeight: 700, background: "#00c89620", color: "#00c896" }}>{changeFmt(changes[s.ticker]?.change24h ?? 0)}</span>
                </div>
              ))}
            </div>
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Top spadki 24h</div>
              {topLosers.map(s => (
                <div key={s.ticker} onClick={() => navigateToStock(s)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${theme.bgCardAlt}`, cursor: "pointer" }}>
                  <div><div style={{ fontWeight: 700, fontSize: 12, color: theme.textBright }}>{s.ticker}</div><div style={{ fontSize: 10, color: theme.textSecondary }}>{s.sector}</div></div>
                  <span style={{ padding: "2px 7px", borderRadius: 5, fontSize: 11, fontWeight: 700, background: "#ff4d6d20", color: "#ff4d6d" }}>{changeFmt(changes[s.ticker]?.change24h ?? 0)}</span>
                </div>
              ))}
            </div>
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Statystyki rynku</div>
              {marketStats.map(([label, val, color]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${theme.bgCardAlt}`, fontSize: 11 }}>
                  <span style={{ color: theme.textSecondary }}>{label}</span>
                  <span style={{ fontWeight: 700, color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        </>)}
      </div>

      <div style={{ textAlign: "center", padding: "24px", fontSize: 10, color: theme.textSecondary }}>
        WIGmarkets © 2026 · Dane z GPW via Yahoo Finance · Nie stanowią rekomendacji inwestycyjnej
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<WigMarkets />);

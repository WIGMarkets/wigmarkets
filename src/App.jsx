import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { DARK_THEME, LIGHT_THEME } from "./lib/themes.js";
import { fetchBulk, fetchIndices, fetchDynamicList } from "./lib/api.js";
import { STOCKS, COMMODITIES, FOREX } from "./data/stocks.js";
import { loadAlerts, usePriceAlerts } from "./hooks/usePriceAlerts.js";
import HomePage from "./pages/HomePage.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Breadcrumbs from "./components/layout/Breadcrumbs.jsx";
import MarqueeTicker from "./components/MarqueeTicker.jsx";

// ── Lazy-loaded pages (code splitting) ──────────────────────────────────────

const LazyStockPageRoute = lazy(() =>
  import("./pages/StockDetailPage.jsx").then(m => ({ default: m.StockPageRoute }))
);
const LazyEdukacjaSlugRoute = lazy(() =>
  import("./pages/StockDetailPage.jsx").then(m => ({ default: m.EdukacjaSlugRoute }))
);
const LazyDividendPage = lazy(() => import("./components/DividendPage.jsx"));
const LazyFearGreedPage = lazy(() => import("./components/FearGreedPage.jsx"));
const LazyNewsPage = lazy(() => import("./components/NewsPage.jsx"));
const LazyPortfolioPage = lazy(() => import("./components/PortfolioPage.jsx"));
const LazyEdukacjaHome = lazy(() => import("./components/edukacja/EdukacjaHome.jsx"));
const LazyGlossaryList = lazy(() => import("./pages/GlossaryList.jsx"));
const LazyGlossaryTerm = lazy(() => import("./pages/GlossaryTerm.jsx"));
const LazyRankingsPage = lazy(() => import("./pages/RankingsPage.jsx"));
const LazyRankingDetailPage = lazy(() => import("./pages/RankingDetailPage.jsx"));
const LazyHeatmapPage = lazy(() => import("./pages/HeatmapPage.jsx"));
const LazyIndeksyPage = lazy(() => import("./pages/IndeksyPage.jsx"));
const LazyIndexDetailPage = lazy(() => import("./pages/IndexDetailPage.jsx"));

function PageFallback() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300, opacity: 0.5 }}>
      <div style={{
        width: 28, height: 28, border: "3px solid rgba(255,255,255,0.1)",
        borderTopColor: "#3b82f6", borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }} />
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") !== "light");
  const [prices, setPrices] = useState({});
  const [changes, setChanges] = useState({});
  const [indices, setIndices] = useState(() => {
    try {
      const raw = localStorage.getItem("wm_cache_indices");
      if (!raw) return [];
      const { data } = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  });
  const [worldIndices, setWorldIndices] = useState([]);
  const [watchlist, setWatchlist] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("watchlist") || "[]")); } catch { return new Set(); }
  });
  const [alerts, setAlerts] = useState(loadAlerts);
  const [liveStocks, setLiveStocks] = useState(STOCKS);
  const allInstruments = useMemo(() => [...liveStocks, ...COMMODITIES, ...FOREX], [liveStocks]);

  // Lifted from HomePage so Navbar can share them
  const [tab, setTab] = useState("akcje");
  const [viewMode, setViewMode] = useState("table");

  const theme = darkMode ? DARK_THEME : LIGHT_THEME;
  const bgGradient = darkMode
    ? "linear-gradient(180deg, #080810 0%, #0a0a0f 100%)"
    : "linear-gradient(180deg, #eef2f7 0%, #f6f8fa 100%)";

  usePriceAlerts(prices, setAlerts);

  // Theme persistence
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

  // Load dynamic stock list from /api/gpw-screener on mount + auto-refresh every 2 min
  const applyScreenerData = useCallback((data) => {
    if (!data) return;
    setLiveStocks(data.stocks);
    const newPrices = {};
    const screenerQuotes = {};
    for (const [ticker, q] of Object.entries(data.quotes || {})) {
      if (q?.close) {
        newPrices[ticker] = q.close;
        screenerQuotes[ticker] = q;
      }
    }
    if (Object.keys(newPrices).length) {
      setPrices(prev => ({ ...prev, ...newPrices }));
      setChanges(prev => {
        const merged = { ...prev };
        for (const [ticker, q] of Object.entries(screenerQuotes)) {
          merged[ticker] = {
            ...(prev[ticker] || {}),
            change24h: q.change24h ?? 0,
            volume: q.volume ?? 0,
            sparkline: q.sparkline ?? prev[ticker]?.sparkline ?? null,
            change7d: q.change7d || prev[ticker]?.change7d || 0,
          };
        }
        return merged;
      });
    }
  }, []);

  useEffect(() => {
    fetchDynamicList().then(applyScreenerData);
    const interval = setInterval(() => {
      fetchDynamicList().then(applyScreenerData);
    }, 120_000); // 2 minutes
    return () => clearInterval(interval);
  }, [applyScreenerData]);

  // Refresh GPW indices — uses dedicated /api/indices endpoint
  // with retry logic and host failover (query1 → query2)
  const [indicesLoaded, setIndicesLoaded] = useState(false);
  useEffect(() => {
    const load = async () => {
      const data = await fetchIndices();
      if (data.length > 0) {
        // Always set indices even if all values are null,
        // so we can distinguish "loading" from "failed".
        setIndices(data);
        setIndicesLoaded(true);
      }
    };
    load();
    const interval = setInterval(load, 60000);
    // Timeout: if indices haven't loaded after 15s, mark as loaded (failed)
    const timeout = setTimeout(() => {
      setIndicesLoaded(prev => {
        if (!prev) {
          setIndices([
            { name: "WIG20", value: null, change24h: null, sparkline: [] },
            { name: "WIG", value: null, change24h: null, sparkline: [] },
            { name: "mWIG40", value: null, change24h: null, sparkline: [] },
            { name: "sWIG80", value: null, change24h: null, sparkline: [] },
          ]);
        }
        return true;
      });
    }, 15000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  // World indices
  useEffect(() => {
    const worldDefs = [
      { name: "S&P 500",    stooq: "sp500"  },
      { name: "NASDAQ",     stooq: "nasdaq" },
      { name: "Dow Jones",  stooq: "djia"   },
      { name: "DAX",        stooq: "dax"    },
      { name: "FTSE 100",   stooq: "ftse"   },
      { name: "CAC 40",     stooq: "cac40"  },
      { name: "Nikkei 225", stooq: "nikkei" },
      { name: "Hang Seng",  stooq: "hsi"    },
    ];
    const loadWorld = async () => {
      const symbols = worldDefs.map(d => d.stooq);
      const bulk = await fetchBulk(symbols);
      const built = worldDefs.map(({ name, stooq }) => {
        const d = bulk[stooq];
        if (!d?.close) return { name, value: null, change24h: null, sparkline: [] };
        return {
          name,
          value:     d.close,
          change24h: d.change24h ?? null,
          sparkline: (d.sparkline || []).map(c => ({ close: c })),
        };
      });
      if (built.some(i => i.value !== null)) setWorldIndices(built);
    };
    loadWorld();
    const worldInterval = setInterval(loadWorld, 60000);
    return () => clearInterval(worldInterval);
  }, []);

  const navigateToStock = useCallback((stock) => {
    navigate(`/spolka/${stock.ticker}`);
  }, [navigate]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar
        theme={theme} darkMode={darkMode} setDarkMode={setDarkMode}
        watchlist={watchlist} alerts={alerts} setAlerts={setAlerts}
        tab={tab} setTab={setTab} setViewMode={setViewMode}
        prices={prices} allInstruments={allInstruments}
      />
      <MarqueeTicker
        stocks={[...liveStocks, ...COMMODITIES, ...FOREX]}
        prices={prices} changes={changes} theme={theme}
        onSelect={navigateToStock}
      />
      <Breadcrumbs theme={theme} allInstruments={allInstruments} />
      <div style={{ flex: 1 }}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/spolka/:ticker" element={
              <LazyStockPageRoute prices={prices} changes={changes} theme={theme}
                watchlist={watchlist} toggleWatch={toggleWatch}
                liveStocks={liveStocks} allInstruments={allInstruments} />
            } />
            <Route path="/dywidendy" element={<LazyDividendPage theme={theme} />} />
            <Route path="/fear-greed" element={<ErrorBoundary><LazyFearGreedPage theme={theme} /></ErrorBoundary>} />
            <Route path="/indeksy" element={<LazyIndeksyPage theme={theme} indices={indices} worldIndices={worldIndices} />} />
            <Route path="/indeksy/:slug" element={<LazyIndexDetailPage theme={theme} liveStocks={liveStocks} prices={prices} changes={changes} />} />
            <Route path="/indeks" element={<Navigate to="/fear-greed" replace />} />
            <Route path="/wiadomosci" element={<LazyNewsPage theme={theme} />} />
            <Route path="/portfolio" element={<LazyPortfolioPage theme={theme} prices={prices} allInstruments={allInstruments} />} />
            <Route path="/rankingi" element={<LazyRankingsPage theme={theme} liveStocks={liveStocks} prices={prices} changes={changes} />} />
            <Route path="/rankingi/:slug" element={<LazyRankingDetailPage theme={theme} liveStocks={liveStocks} prices={prices} changes={changes} />} />
            <Route path="/heatmapa" element={<LazyHeatmapPage theme={theme} liveStocks={liveStocks} prices={prices} changes={changes} setPrices={setPrices} setChanges={setChanges} />} />
            <Route path="/edukacja" element={<LazyEdukacjaHome theme={theme} />} />
            <Route path="/edukacja/slowniczek" element={<LazyGlossaryList theme={theme} />} />
            <Route path="/edukacja/slowniczek/:slug" element={<LazyGlossaryTerm theme={theme} />} />
            <Route path="/edukacja/:slug" element={<LazyEdukacjaSlugRoute theme={theme} />} />
            <Route path="/" element={
              <HomePage
                theme={theme} darkMode={darkMode} setDarkMode={setDarkMode} bgGradient={bgGradient}
                prices={prices} setPrices={setPrices} changes={changes} setChanges={setChanges}
                watchlist={watchlist} toggleWatch={toggleWatch}
                liveStocks={liveStocks} allInstruments={allInstruments}
                indices={indices} worldIndices={worldIndices}
                alerts={alerts} setAlerts={setAlerts}
                tab={tab} setTab={setTab} viewMode={viewMode} setViewMode={setViewMode}
              />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
      <Footer theme={theme} />
    </div>
  );
}

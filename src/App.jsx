import { useState, useEffect, useMemo, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { DARK_THEME, LIGHT_THEME } from "./lib/themes.js";
import { fetchBulk, fetchIndices, fetchDynamicList } from "./lib/api.js";
import { STOCKS, COMMODITIES, FOREX } from "./data/stocks.js";
import { loadAlerts, usePriceAlerts } from "./hooks/usePriceAlerts.js";
import HomePage from "./pages/HomePage.jsx";
import { StockPageRoute, EdukacjaSlugRoute } from "./pages/StockDetailPage.jsx";
import DividendPage from "./components/DividendPage.jsx";
import FearGreedPage from "./components/FearGreedPage.jsx";
import NewsPage from "./components/NewsPage.jsx";
import PortfolioPage from "./components/PortfolioPage.jsx";
import EdukacjaHome from "./components/edukacja/EdukacjaHome.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Breadcrumbs from "./components/layout/Breadcrumbs.jsx";
import MarqueeTicker from "./components/MarqueeTicker.jsx";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") !== "light");
  const [prices, setPrices] = useState({});
  const [changes, setChanges] = useState({});
  const [indices, setIndices] = useState([]);
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

  // Load dynamic stock list from /api/gpw-screener on mount
  useEffect(() => {
    fetchDynamicList().then(data => {
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
        // Screener v7/quote API doesn't have 7d change (always 0).
        // Preserve any existing non-zero change7d from prior bulk fetches.
        setChanges(prev => {
          const merged = { ...prev };
          for (const [ticker, q] of Object.entries(screenerQuotes)) {
            merged[ticker] = {
              ...(prev[ticker] || {}),
              change24h: q.change24h ?? 0,
              volume: q.volume ?? 0,
              sparkline: q.sparkline ?? prev[ticker]?.sparkline ?? null,
              // Keep existing change7d if screener returns 0
              change7d: q.change7d || prev[ticker]?.change7d || 0,
            };
          }
          return merged;
        });
      }
    });
  }, []);

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
        <Routes>
          <Route path="/spolka/:ticker" element={
            <StockPageRoute prices={prices} changes={changes} theme={theme}
              watchlist={watchlist} toggleWatch={toggleWatch}
              liveStocks={liveStocks} allInstruments={allInstruments} />
          } />
          <Route path="/dywidendy" element={<DividendPage theme={theme} />} />
          <Route path="/fear-greed" element={<ErrorBoundary><FearGreedPage theme={theme} /></ErrorBoundary>} />
          <Route path="/indeks" element={<Navigate to="/fear-greed" replace />} />
          <Route path="/wiadomosci" element={<NewsPage theme={theme} />} />
          <Route path="/portfolio" element={<PortfolioPage theme={theme} prices={prices} allInstruments={allInstruments} />} />
          <Route path="/edukacja" element={<EdukacjaHome theme={theme} />} />
          <Route path="/edukacja/:slug" element={<EdukacjaSlugRoute theme={theme} />} />
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
      </div>
      <Footer theme={theme} />
    </div>
  );
}

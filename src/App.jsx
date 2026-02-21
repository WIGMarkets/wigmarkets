import { useState, useEffect, useMemo } from "react";
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

  // Refresh GPW indices — uses dedicated /api/indices endpoint
  // with retry logic and host failover (query1 → query2)
  useEffect(() => {
    const load = async () => {
      const data = await fetchIndices();
      if (data.length > 0 && data.some(i => i.value !== null)) {
        setIndices(data);
      }
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
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

  return (
    <Routes>
      <Route path="/spolka/:ticker" element={
        <StockPageRoute prices={prices} changes={changes} theme={theme}
          watchlist={watchlist} toggleWatch={toggleWatch}
          liveStocks={liveStocks} allInstruments={allInstruments} />
      } />
      <Route path="/dywidendy" element={<DividendPage theme={theme} />} />
      <Route path="/indeks" element={<FearGreedPage theme={theme} />} />
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
        />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

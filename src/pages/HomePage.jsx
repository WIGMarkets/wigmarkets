import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts.js";
import { fmt, changeFmt, changeColor } from "../lib/formatters.js";
import { fetchBulk, fetchRedditTrends, fetchHistory, fetchFearGreed } from "../lib/api.js";
import { STOCKS, COMMODITIES, FOREX } from "../data/stocks.js";
import { FEAR_HISTORY_YEAR, FEAR_COMPONENTS } from "../data/constants.js";
import StockTableRow from "../components/market/StockTableRow.jsx";
import MarqueeTicker from "../components/MarqueeTicker.jsx";
import Heatmap from "../components/Heatmap.jsx";
import SectorDonut from "../components/SectorDonut.jsx";
import FearGauge from "../components/FearGauge.jsx";
import ProfitCalculatorModal from "../components/ProfitCalculatorModal.jsx";
import StockModal from "../components/StockModal.jsx";
import StockLogo from "../components/StockLogo.jsx";
import CompanyMonogram from "../components/CompanyMonogram.jsx";
import MarketOverviewCards from "../components/MarketOverviewCards.jsx";
import IndeksyView from "../components/IndeksyView.jsx";
import WorldIndicesView from "../components/WorldIndicesView.jsx";
import WIGMarketsLogo from "../components/WIGMarketsLogo.jsx";
import ScreenerView from "../components/ScreenerView.jsx";
import SkeletonRow from "../components/SkeletonRow.jsx";
import ToastContainer from "../components/ToastContainer.jsx";
import AlertsModal from "../components/AlertsModal.jsx";
import Icon from "../components/edukacja/Icon.jsx";
import MobileDrawer from "../components/MobileDrawer.jsx";
import DesktopNavMenu from "../components/DesktopNavMenu.jsx";

const ALL_INSTRUMENTS = [...STOCKS, ...COMMODITIES, ...FOREX];

export default function HomePage({
  theme, darkMode, setDarkMode, bgGradient,
  prices, setPrices, changes, setChanges,
  watchlist, toggleWatch,
  liveStocks, allInstruments,
  indices, worldIndices,
  alerts, setAlerts,
}) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [tab, setTab] = useState("akcje");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("cap");
  const [sortDir, setSortDir] = useState("desc");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [redditData, setRedditData] = useState({ ranked: [], postsScanned: 0, loading: false });
  const [selected, setSelected] = useState(null);
  const [calcStock, setCalcStock] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [watchFilter, setWatchFilter] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showPE, setShowPE] = useState(false);
  const [showDiv, setShowDiv] = useState(false);
  const [fgData, setFgData] = useState(null);
  const searchRef = useRef(null);
  const PER_PAGE = 20;

  const navigateToStock = useCallback((stock) => {
    navigate(`/spolka/${stock.ticker}`);
  }, [navigate]);

  // Set home page title/meta
  useEffect(() => {
    document.title = "WIGmarkets - Notowania GPW";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Notowania GPW w czasie rzeczywistym");
  }, []);

  // Fetch Fear & Greed data
  useEffect(() => {
    fetchFearGreed().then(data => { if (data) setFgData(data); });
  }, []);

  // Refresh active data based on tab
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

  // Reddit trends
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

  // Keyboard shortcuts
  useKeyboardShortcuts({
    enabled: true,
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

  const fgValue = fgData?.current?.value ?? FEAR_HISTORY_YEAR[FEAR_HISTORY_YEAR.length - 1];
  const fgHistory = fgData?.history?.slice(-30).map(h => h.value) ?? null;
  const fgComponents = fgData?.current?.indicators ?? null;
  const fgLabel = fgValue < 25 ? "Skrajna panika" : fgValue < 45 ? "Strach" : fgValue < 55 ? "Neutralny" : fgValue < 75 ? "Chciwość" : "Ekstremalna chciwość";
  const fgColor = fgValue < 25 ? "#dc2626" : fgValue < 45 ? "#ea580c" : fgValue < 55 ? "#ca8a04" : fgValue < 75 ? "#16a34a" : "#15803d";

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

      {/* Top bar — logo + navigation */}
      <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}`, padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", minHeight: 58, maxWidth: 1400, margin: "0 auto" }}>
          {/* Mobile: hamburger */}
          {isMobile && (
            <button onClick={() => setDrawerOpen(true)} style={{ background: "transparent", border: "none", color: theme.textBright, cursor: "pointer", padding: "6px 8px 6px 0", lineHeight: 1, fontFamily: "inherit", display: "inline-flex", alignItems: "center" }}>
              <Icon name="menu" size={22} />
            </button>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <WIGMarketsLogo size={isMobile ? "small" : "default"} theme={theme} />
            {!isMobile && <span style={{ fontSize: 10, color: theme.textMuted, fontFamily: "var(--font-ui)", marginTop: -2, letterSpacing: "0.02em" }}>Notowania GPW w czasie rzeczywistym</span>}
          </div>

          {/* Desktop: mega menu nav */}
          {!isMobile && (
            <DesktopNavMenu
              theme={theme} darkMode={darkMode} setDarkMode={setDarkMode}
              tab={tab} setTab={(t) => { setTab(t); setPage(1); setFilter("all"); setWatchFilter(t === "watchlist"); }}
              navigate={navigate} watchlistSize={watchlist.size}
              showAlerts={showAlerts} setShowAlerts={setShowAlerts} alerts={alerts}
              setViewMode={setViewMode}
            />
          )}

          {/* Mobile: right-side controls */}
          {isMobile && (
            <div style={{ marginLeft: "auto", display: "flex", gap: 6, flexShrink: 0 }}>
              <button onClick={() => setShowAlerts(s => !s)} title="Alerty cenowe" style={{ position: "relative", background: theme.bgCardAlt, border: `1px solid ${theme.border}`, borderRadius: 6, color: theme.textSecondary, padding: "6px 10px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center" }}>
                <Icon name="bell" size={16} />{alerts.some(a => a.triggered) && <span style={{ position: "absolute", top: 3, right: 3, width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "block" }} />}
              </button>
              <button onClick={() => setSidebarOpen(o => !o)} style={{ background: theme.bgCardAlt, border: `1px solid ${theme.border}`, borderRadius: 6, color: theme.textSecondary, padding: "6px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center" }}>
                {sidebarOpen ? <Icon name="x" size={14} /> : <Icon name="chart-bar" size={14} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobile && (
        <MobileDrawer
          open={drawerOpen} onClose={() => setDrawerOpen(false)}
          theme={theme} darkMode={darkMode} setDarkMode={setDarkMode}
          tab={tab} setTab={(t) => { setTab(t); setPage(1); setFilter("all"); setWatchFilter(t === "watchlist"); }}
          navigate={navigate} watchlistSize={watchlist.size}
          setViewMode={setViewMode}
        />
      )}

      {/* Marquee ticker */}
      <MarqueeTicker stocks={[...liveStocks, ...COMMODITIES, ...FOREX]} prices={prices} changes={changes} theme={theme} onSelect={navigateToStock} />

      {/* Market Overview Dashboard */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: isMobile ? "12px 12px 0" : "24px 24px 0" }}>
        <MarketOverviewCards
          indices={indices}
          topGainers={topGainers}
          topLosers={topLosers}
          changes={changes}
          prices={prices}
          navigateToStock={navigateToStock}
          navigateToFearGreed={() => setTab("indeksy")}
          theme={theme}
          isMobile={isMobile}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div style={{ padding: "16px", background: theme.bgCard, borderBottom: `1px solid ${theme.border}` }}>
          <FearGauge value={fgValue} history={fgHistory} components={fgComponents} isMobile={true} theme={theme} />
        </div>
      )}

      <div style={{ padding: isMobile ? "14px 12px 0" : "28px 24px 0", maxWidth: 1400, margin: "0 auto" }}>
        {/* Quick access pills + view toggles */}
        <div style={{
          display: "flex", gap: 6, marginBottom: 18, flexWrap: "nowrap",
          alignItems: "center", overflowX: "auto", WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none", scrollbarWidth: "none", paddingBottom: 2,
          padding: "10px 14px", background: theme.bgCard,
          border: `1px solid ${theme.border}`, borderRadius: 12,
        }}>
          {/* Pill buttons for quick view switching */}
          {[
            ["akcje", "building", "Akcje GPW"],
            ["popularne", "flame", "Popularne"],
            ["screener", "search", "Screener"],
            ["watchlist", "star", `Obserwowane${watchlist.size ? ` (${watchlist.size})` : ""}`],
          ].map(([key, iconName, label]) => (
            <button key={key} onClick={() => { setTab(key); setPage(1); setFilter("all"); setWatchFilter(key === "watchlist"); }}
              style={{
                padding: "8px 16px", borderRadius: 8,
                border: "none",
                background: tab === key ? `${theme.accent}18` : "transparent",
                color: tab === key ? theme.accent : theme.textSecondary,
                fontSize: 13, fontWeight: tab === key ? 600 : 400,
                cursor: "pointer", fontFamily: "var(--font-ui)",
                flexShrink: 0, transition: "all 0.15s ease",
                whiteSpace: "nowrap",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}
            ><Icon name={iconName} size={15} /> {label}</button>
          ))}

          {/* View mode toggle (table/heatmap) */}
          {(tab === "akcje" || tab === "watchlist") && !isMobile && (
            <div style={{
              marginLeft: "auto", display: "flex", borderRadius: 8,
              background: theme.bgCardAlt, overflow: "hidden", flexShrink: 0,
              border: `1px solid ${theme.border}`,
            }}>
              {[["table", "list", "Tabela"], ["heatmap", "grid", "Heatmapa"]].map(([key, iconName, label]) => (
                <button key={key} onClick={() => setViewMode(key)} style={{
                  padding: "8px 16px", border: "none",
                  background: viewMode === key ? `${theme.accent}18` : "transparent",
                  color: viewMode === key ? theme.accent : theme.textSecondary,
                  fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                  fontWeight: viewMode === key ? 700 : 400, whiteSpace: "nowrap",
                  display: "inline-flex", alignItems: "center", gap: 5,
                }}><Icon name={iconName} size={14} /> {label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", display: isMobile ? "block" : "grid", gridTemplateColumns: (tab === "screener" || tab === "forex" || tab === "indeksy" || tab === "swiatowe") ? "1fr" : "1fr 280px", gap: 24, padding: isMobile ? "0 12px" : "0 24px", marginBottom: 32 }}>
        {tab === "screener" ? (
          <ScreenerView stocks={liveStocks} prices={prices} changes={changes} theme={theme} onSelect={navigateToStock} />
        ) : tab === "indeksy" ? (
          <IndeksyView indices={indices} theme={theme} isMobile={isMobile} />
        ) : tab === "swiatowe" ? (
          <WorldIndicesView worldIndices={worldIndices} gpwIndices={indices} theme={theme} isMobile={isMobile} />
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
                    <th style={{ padding: isMobile ? "12px 4px" : "14px 10px", borderBottom: `2px solid ${theme.border}`, width: 40, background: theme.bgCard }}></th>
                    <th style={{ padding: isMobile ? "12px 10px" : "14px 16px", textAlign: "left", fontSize: 10, color: theme.textMuted, borderBottom: `2px solid ${theme.border}`, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-ui)" }}>Instrument</th>
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
                        <StockTableRow key={s.id} s={s} i={i} rank={(page - 1) * PER_PAGE + i + 1}
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
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div onClick={() => navigate("/indeks")} style={{ cursor: "pointer", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              <FearGauge value={fgValue} history={fgHistory} components={fgComponents} isMobile={false} theme={theme} />
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

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "20px 24px", borderTop: `1px solid ${theme.border}` }}>
        <WIGMarketsLogo size="large" theme={theme} />
        <div style={{ fontSize: 10, color: theme.textSecondary, textAlign: "center" }}>
          © 2026 · Dane z GPW via Yahoo Finance · Nie stanowią rekomendacji inwestycyjnej
        </div>
      </div>

      <ToastContainer theme={theme} />
    </div>
  );
}

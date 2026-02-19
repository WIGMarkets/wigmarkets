import { useState, useEffect, useMemo } from "react";
import { STOCKS } from "../data/stocks.js";
import { fmt, changeFmt, changeColor, calculateRSI } from "../utils.js";
import { fetchHistory } from "../api.js";
import { useIsMobile } from "../hooks/useIsMobile.js";

export default function ScreenerView({ prices, changes, theme, onSelect }) {
  const isMobile = useIsMobile();
  const [peMin, setPeMin] = useState("");
  const [peMax, setPeMax] = useState("");
  const [divMin, setDivMin] = useState("");
  const [capSize, setCapSize] = useState("all");
  const [changeDir, setChangeDir] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [rsiFilter, setRsiFilter] = useState("all");
  const [sortBy, setSortBy] = useState("cap");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [rsiData, setRsiData] = useState({});
  const PER_PAGE = 20;

  useEffect(() => {
    let cancelled = false;
    const loadRSI = async () => {
      const batch = {};
      const batchSize = 10;
      for (let i = 0; i < STOCKS.length; i += batchSize) {
        const chunk = STOCKS.slice(i, i + batchSize);
        const results = await Promise.all(
          chunk.map(s => fetchHistory(s.stooq || s.ticker.toLowerCase()).then(d => ({ ticker: s.ticker, prices: d?.prices })))
        );
        if (cancelled) return;
        for (const r of results) {
          const val = calculateRSI(r.prices);
          if (val != null) batch[r.ticker] = val;
        }
        setRsiData(prev => ({ ...prev, ...batch }));
      }
    };
    loadRSI();
    return () => { cancelled = true; };
  }, []);

  const sectors = useMemo(() => ["all", ...Array.from(new Set(STOCKS.map(s => s.sector))).sort()], []);

  const resetFilters = () => {
    setPeMin(""); setPeMax(""); setDivMin(""); setCapSize("all");
    setChangeDir("all"); setSectorFilter("all"); setRsiFilter("all");
    setPage(1);
  };

  const filtered = useMemo(() => {
    return STOCKS.filter(s => {
      const peMinN = parseFloat(peMin), peMaxN = parseFloat(peMax);
      if (!isNaN(peMinN) && (s.pe <= 0 || s.pe < peMinN)) return false;
      if (!isNaN(peMaxN) && (s.pe <= 0 || s.pe > peMaxN)) return false;
      const divMinN = parseFloat(divMin);
      if (!isNaN(divMinN) && s.div < divMinN) return false;
      if (capSize === "small" && s.cap >= 1000) return false;
      if (capSize === "medium" && (s.cap < 1000 || s.cap >= 5000)) return false;
      if (capSize === "large" && s.cap < 5000) return false;
      const c24h = changes[s.ticker]?.change24h ?? 0;
      if (changeDir === "up" && c24h <= 0) return false;
      if (changeDir === "down" && c24h >= 0) return false;
      if (sectorFilter !== "all" && s.sector !== sectorFilter) return false;
      const rsi = rsiData[s.ticker];
      if (rsiFilter === "overbought" && (rsi == null || rsi <= 70)) return false;
      if (rsiFilter === "oversold" && (rsi == null || rsi >= 30)) return false;
      if (rsiFilter === "neutral" && (rsi == null || rsi > 70 || rsi < 30)) return false;
      return true;
    }).sort((a, b) => {
      let av = a[sortBy] ?? 0, bv = b[sortBy] ?? 0;
      if (sortBy === "price") { av = prices[a.ticker] || 0; bv = prices[b.ticker] || 0; }
      if (sortBy === "change24h") { av = changes[a.ticker]?.change24h ?? 0; bv = changes[b.ticker]?.change24h ?? 0; }
      if (sortBy === "change7d") { av = changes[a.ticker]?.change7d ?? 0; bv = changes[b.ticker]?.change7d ?? 0; }
      if (sortBy === "rsi") { av = rsiData[a.ticker] ?? -1; bv = rsiData[b.ticker] ?? -1; }
      return sortDir === "desc" ? bv - av : av - bv;
    });
  }, [peMin, peMax, divMin, capSize, changeDir, sectorFilter, rsiFilter, sortBy, sortDir, prices, changes, rsiData]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const hasActiveFilters = peMin || peMax || divMin || capSize !== "all" || changeDir !== "all" || sectorFilter !== "all" || rsiFilter !== "all";

  const colHead = (label, key, right = true) => (
    <th onClick={() => handleSort(key)} style={{ padding: isMobile ? "8px 6px" : "10px 14px", textAlign: right ? "right" : "left", fontSize: 10, color: sortBy === key ? theme.accent : theme.textSecondary, cursor: "pointer", whiteSpace: "nowrap", userSelect: "none", borderBottom: `1px solid ${theme.border}`, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
      {label} {sortBy === key ? (sortDir === "desc" ? "↓" : "↑") : ""}
    </th>
  );

  const inputStyle = { background: theme.bgPage, border: `1px solid ${theme.borderInput}`, borderRadius: 8, padding: "7px 10px", color: theme.text, fontSize: 12, fontFamily: "inherit", outline: "none", width: "100%" };
  const selectStyle = { background: theme.bgCard, border: `1px solid ${theme.borderInput}`, borderRadius: 8, padding: "7px 10px", color: theme.text, fontSize: 11, cursor: "pointer", fontFamily: "inherit", outline: "none", width: "100%" };

  return (
    <div>
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 14 : 20, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>Filtry screenera</div>
          {hasActiveFilters && (
            <button onClick={resetFilters} style={{ padding: "5px 14px", borderRadius: 8, border: `1px solid ${theme.borderInput}`, background: "transparent", color: theme.accent, fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
              Resetuj filtry
            </button>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? 10 : 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 4, fontWeight: 600, letterSpacing: 0.5 }}>C/Z (P/E) min</label>
            <input type="number" value={peMin} onChange={e => { setPeMin(e.target.value); setPage(1); }} placeholder="np. 5" min="0" step="0.1" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 4, fontWeight: 600, letterSpacing: 0.5 }}>C/Z (P/E) max</label>
            <input type="number" value={peMax} onChange={e => { setPeMax(e.target.value); setPage(1); }} placeholder="np. 20" min="0" step="0.1" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 4, fontWeight: 600, letterSpacing: 0.5 }}>Min. dywidenda %</label>
            <input type="number" value={divMin} onChange={e => { setDivMin(e.target.value); setPage(1); }} placeholder="np. 3" min="0" step="0.1" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 4, fontWeight: 600, letterSpacing: 0.5 }}>Kapitalizacja</label>
            <select value={capSize} onChange={e => { setCapSize(e.target.value); setPage(1); }} style={selectStyle}>
              <option value="all">Wszystkie</option>
              <option value="small">Mała (&lt;1 mld)</option>
              <option value="medium">Średnia (1-5 mld)</option>
              <option value="large">Duża (&gt;5 mld)</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 4, fontWeight: 600, letterSpacing: 0.5 }}>Zmiana 24h</label>
            <select value={changeDir} onChange={e => { setChangeDir(e.target.value); setPage(1); }} style={selectStyle}>
              <option value="all">Wszystkie</option>
              <option value="up">Tylko rosnące</option>
              <option value="down">Tylko spadające</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 4, fontWeight: 600, letterSpacing: 0.5 }}>Sektor</label>
            <select value={sectorFilter} onChange={e => { setSectorFilter(e.target.value); setPage(1); }} style={selectStyle}>
              {sectors.map(s => <option key={s} value={s}>{s === "all" ? "Wszystkie sektory" : s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 4, fontWeight: 600, letterSpacing: 0.5 }}>RSI (14)</label>
            <select value={rsiFilter} onChange={e => { setRsiFilter(e.target.value); setPage(1); }} style={selectStyle}>
              <option value="all">Wszystkie</option>
              <option value="overbought">Wykupiony (&gt;70)</option>
              <option value="oversold">Wyprzedany (&lt;30)</option>
              <option value="neutral">Neutralny (30-70)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: theme.textSecondary }}>
          Znaleziono <span style={{ fontWeight: 700, color: theme.accent }}>{filtered.length}</span> spółek
        </div>
        {Object.keys(rsiData).length < STOCKS.length && (
          <div style={{ fontSize: 10, color: theme.textSecondary }}>RSI: {Object.keys(rsiData).length}/{STOCKS.length}</div>
        )}
      </div>

      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 12 : 13, minWidth: isMobile ? "auto" : 700 }}>
            <thead>
              <tr>
                {!isMobile && colHead("#", "id", false)}
                <th style={{ padding: isMobile ? "8px 10px" : "10px 14px", textAlign: "left", fontSize: 10, color: theme.textSecondary, borderBottom: `1px solid ${theme.border}`, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Spółka</th>
                {colHead("Kurs", "price")}
                {colHead("24h %", "change24h")}
                {!isMobile && colHead("7d %", "change7d")}
                {colHead("Kap.", "cap")}
                {!isMobile && colHead("C/Z", "pe")}
                {!isMobile && colHead("Dyw. %", "div")}
                {colHead("RSI", "rsi")}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr><td colSpan={isMobile ? 6 : 9} style={{ textAlign: "center", padding: "32px 0", color: theme.textSecondary, fontSize: 13 }}>Brak spółek spełniających kryteria</td></tr>
              )}
              {visible.map((s, i) => {
                const currentPrice = prices[s.ticker];
                const c24h = changes[s.ticker]?.change24h ?? 0;
                const c7d = changes[s.ticker]?.change7d ?? 0;
                const rsi = rsiData[s.ticker];
                const rsiColor = rsi > 70 ? "#ff4d6d" : rsi < 30 ? "#00c896" : "#ffd700";
                return (
                  <tr key={s.id} onClick={() => onSelect(s)} style={{ borderBottom: `1px solid ${theme.bgCardAlt}`, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = theme.bgCardAlt}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    {!isMobile && <td style={{ padding: "10px 14px", color: theme.textSecondary, fontSize: 11 }}>{(page - 1) * PER_PAGE + i + 1}</td>}
                    <td style={{ padding: isMobile ? "10px 10px" : "10px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: "linear-gradient(135deg, #1f6feb22, #58a6ff33)", border: "1px solid #58a6ff44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#58a6ff", flexShrink: 0 }}>{s.ticker.slice(0, 2)}</div>
                        <div>
                          <div style={{ fontWeight: 700, color: theme.textBright, fontSize: isMobile ? 12 : 13 }}>{s.ticker}</div>
                          <div style={{ fontSize: 10, color: theme.textSecondary, maxWidth: isMobile ? 100 : 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: isMobile ? "10px 6px" : "10px 14px", textAlign: "right", fontWeight: 700, color: c24h > 0 ? "#00c896" : c24h < 0 ? "#ff4d6d" : "#c9d1d9", fontSize: isMobile ? 11 : 13, whiteSpace: "nowrap" }}>{fmt(currentPrice)} zł</td>
                    <td style={{ padding: isMobile ? "10px 6px" : "10px 14px", textAlign: "right" }}>
                      <span style={{ padding: "2px 6px", borderRadius: 5, fontSize: isMobile ? 11 : 12, fontWeight: 700, background: c24h > 0 ? "#00c89620" : "#ff4d6d20", color: changeColor(c24h), whiteSpace: "nowrap" }}>{changeFmt(c24h)}</span>
                    </td>
                    {!isMobile && <td style={{ padding: "10px 14px", textAlign: "right", color: changeColor(c7d), fontSize: 12 }}>{changeFmt(c7d)}</td>}
                    <td style={{ padding: isMobile ? "10px 6px" : "10px 14px", textAlign: "right", color: theme.textSecondary, fontSize: 12, whiteSpace: "nowrap" }}>{fmt(s.cap, 0)}</td>
                    {!isMobile && <td style={{ padding: "10px 14px", textAlign: "right", color: theme.textSecondary, fontSize: 12 }}>{s.pe > 0 ? fmt(s.pe) : "—"}</td>}
                    {!isMobile && <td style={{ padding: "10px 14px", textAlign: "right", color: s.div > 0 ? "#00c896" : theme.textSecondary, fontSize: 12, fontWeight: s.div > 0 ? 600 : 400 }}>{s.div > 0 ? `${fmt(s.div)}%` : "—"}</td>}
                    <td style={{ padding: isMobile ? "10px 6px" : "10px 14px", textAlign: "right" }}>
                      {rsi != null ? (
                        <span style={{ padding: "2px 8px", borderRadius: 5, fontSize: 11, fontWeight: 700, background: `${rsiColor}20`, color: rsiColor }}>{rsi.toFixed(0)}</span>
                      ) : (
                        <span style={{ fontSize: 10, color: theme.textSecondary }}>...</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div style={{ padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${theme.border}`, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontSize: 11, color: theme.textSecondary }}>{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} z {filtered.length}</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} style={{ width: 26, height: 26, borderRadius: 5, border: "1px solid", borderColor: p === page ? theme.accent : theme.borderInput, background: p === page ? "#1f6feb22" : "transparent", color: p === page ? theme.accent : theme.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import { fmt, changeFmt, changeColor } from "../lib/formatters.js";
import { fetchRSIBulk } from "../lib/api.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import Icon from "./edukacja/Icon.jsx";
import StockLogo from "./StockLogo.jsx";
import FilterDropdown from "./ui/FilterDropdown.jsx";
import Pagination from "./ui/Pagination.jsx";

function fmtCap(cap) {
  if (!cap) return "—";
  if (cap >= 1000) return `${(cap / 1000).toFixed(1)} mld`;
  return `${Math.round(cap)} mln`;
}

const CAP_OPTIONS = [
  { id: "all", label: "Wszystkie" },
  { id: "small", label: "Small cap (< 1 mld)" },
  { id: "medium", label: "Mid cap (1–5 mld)" },
  { id: "large", label: "Large cap (> 5 mld)" },
];

const CHANGE_OPTIONS = [
  { id: "all", label: "Wszystkie" },
  { id: "up", label: "Tylko rosnące" },
  { id: "down", label: "Tylko spadające" },
];

const RSI_OPTIONS = [
  { id: "all", label: "Wszystkie" },
  { id: "overbought", label: "Wykupiony (> 70)" },
  { id: "oversold", label: "Wyprzedany (< 30)" },
  { id: "neutral", label: "Neutralny (30–70)" },
];

export default function ScreenerView({ stocks, prices, changes, theme, onSelect }) {
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
    fetchRSIBulk().then(data => {
      if (!cancelled && data?.rsi) setRsiData(data.rsi);
    });
    return () => { cancelled = true; };
  }, []);

  const sectorOptions = useMemo(() => {
    const counts = {};
    for (const s of stocks) { counts[s.sector] = (counts[s.sector] || 0) + 1; }
    const sorted = Object.keys(counts).sort();
    return [
      { id: "all", label: "Wszystkie sektory", count: null },
      ...sorted.map(s => ({ id: s, label: s, count: counts[s] })),
    ];
  }, [stocks]);

  const resetFilters = () => {
    setPeMin(""); setPeMax(""); setDivMin(""); setCapSize("all");
    setChangeDir("all"); setSectorFilter("all"); setRsiFilter("all");
    setPage(1);
  };

  const filtered = useMemo(() => {
    return stocks.filter(s => {
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
      // Stocks without price data always go to the end
      const aHasData = prices[a.ticker] != null && prices[a.ticker] > 0;
      const bHasData = prices[b.ticker] != null && prices[b.ticker] > 0;
      if (aHasData && !bHasData) return -1;
      if (!aHasData && bHasData) return 1;

      let av = a[sortBy] ?? 0, bv = b[sortBy] ?? 0;
      if (sortBy === "price") { av = prices[a.ticker] || 0; bv = prices[b.ticker] || 0; }
      if (sortBy === "change24h") { av = changes[a.ticker]?.change24h ?? 0; bv = changes[b.ticker]?.change24h ?? 0; }
      if (sortBy === "change7d") { av = changes[a.ticker]?.change7d ?? 0; bv = changes[b.ticker]?.change7d ?? 0; }
      if (sortBy === "rsi") { av = rsiData[a.ticker] ?? -1; bv = rsiData[b.ticker] ?? -1; }
      return sortDir === "desc" ? bv - av : av - bv;
    });
  }, [peMin, peMax, divMin, capSize, changeDir, sectorFilter, rsiFilter, sortBy, sortDir, prices, changes, rsiData]);

  const noDataCount = useMemo(() =>
    filtered.filter(s => prices[s.ticker] == null || prices[s.ticker] <= 0).length,
    [filtered, prices]
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const hasActiveFilters = peMin || peMax || divMin || capSize !== "all" || changeDir !== "all" || sectorFilter !== "all" || rsiFilter !== "all";

  const colHead = (label, key, right = true) => (
    <th onClick={() => handleSort(key)} style={{ padding: isMobile ? "10px 8px" : "12px 16px", textAlign: right ? "right" : "left", fontSize: 10, color: sortBy === key ? theme.accent : theme.textMuted, cursor: "pointer", whiteSpace: "nowrap", userSelect: "none", borderBottom: `2px solid ${sortBy === key ? theme.accent : theme.border}`, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-ui)", transition: "color 0.15s, border-color 0.15s" }}>
      {label}{" "}
      {sortBy === key
        ? (sortDir === "desc" ? <Icon name="chevron-down" size={12} /> : <Icon name="chevron-up" size={12} />)
        : <Icon name="chevrons-up-down" size={10} style={{ opacity: 0.3 }} />}
    </th>
  );

  const inputStyle = {
    background: theme.bgCardAlt,
    border: `1px solid ${theme.borderInput}`,
    borderRadius: 8,
    padding: "8px 12px",
    color: theme.text,
    fontSize: 13,
    fontFamily: "var(--font-mono)",
    fontVariantNumeric: "tabular-nums",
    outline: "none",
    width: "100%",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const PAD = isMobile ? "14px" : "16px";

  return (
    <div>
      {/* Filter panel */}
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 14 : 20, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--font-ui)" }}>Filtry screenera</div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "5px 14px", borderRadius: 8, border: "none",
                background: "transparent", color: theme.textMuted,
                fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = theme.textBright}
              onMouseLeave={e => e.currentTarget.style.color = theme.textMuted}
            >
              <Icon name="x" size={14} /> Wyczyść filtry
            </button>
          )}
        </div>

        {/* Row 1: Numeric inputs */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: isMobile ? 10 : 14, marginBottom: isMobile ? 10 : 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 5, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "var(--font-ui)" }}>C/Z (P/E)</label>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="number" value={peMin} onChange={e => { setPeMin(e.target.value); setPage(1); }}
                placeholder="min" min="0" step="0.1" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 2px ${theme.accent}18`; }}
                onBlur={e => { e.target.style.borderColor = theme.borderInput; e.target.style.boxShadow = "none"; }}
              />
              <span style={{ color: theme.textMuted, fontSize: 12, flexShrink: 0 }}>—</span>
              <input
                type="number" value={peMax} onChange={e => { setPeMax(e.target.value); setPage(1); }}
                placeholder="max" min="0" step="0.1" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 2px ${theme.accent}18`; }}
                onBlur={e => { e.target.style.borderColor = theme.borderInput; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 5, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "var(--font-ui)" }}>Min. dywidenda</label>
            <div style={{ position: "relative" }}>
              <input
                type="number" value={divMin} onChange={e => { setDivMin(e.target.value); setPage(1); }}
                placeholder="np. 3" min="0" step="0.1"
                style={{ ...inputStyle, paddingRight: 28 }}
                onFocus={e => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 2px ${theme.accent}18`; }}
                onBlur={e => { e.target.style.borderColor = theme.borderInput; e.target.style.boxShadow = "none"; }}
              />
              <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: theme.textMuted, fontSize: 12, pointerEvents: "none" }}>%</span>
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 5, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "var(--font-ui)" }}>Kapitalizacja</label>
            <FilterDropdown options={CAP_OPTIONS} value={capSize} onChange={v => { setCapSize(v); setPage(1); }} theme={theme} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 5, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "var(--font-ui)" }}>RSI (14)</label>
            <FilterDropdown options={RSI_OPTIONS} value={rsiFilter} onChange={v => { setRsiFilter(v); setPage(1); }} theme={theme} />
          </div>
        </div>

        {/* Row 2: Dropdowns */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: isMobile ? 10 : 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 5, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "var(--font-ui)" }}>Sektor</label>
            <FilterDropdown options={sectorOptions} value={sectorFilter} onChange={v => { setSectorFilter(v); setPage(1); }} theme={theme} minWidth={220} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 5, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "var(--font-ui)" }}>Zmiana 24h</label>
            <FilterDropdown options={CHANGE_OPTIONS} value={changeDir} onChange={v => { setChangeDir(v); setPage(1); }} theme={theme} />
          </div>
        </div>
      </div>

      {/* Results bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 2px" }}>
        <div style={{ fontSize: 12, color: theme.textSecondary, fontFamily: "var(--font-ui)" }}>
          {hasActiveFilters
            ? <>Znaleziono <span style={{ fontWeight: 700, color: theme.textBright }}>{filtered.length}</span> spółek</>
            : <>Wszystkie spółki <span style={{ color: theme.textMuted }}>({stocks.length})</span></>
          }
        </div>
        {Object.keys(rsiData).length < stocks.length && (
          <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "var(--font-ui)" }}>
            RSI dostępne dla {Object.keys(rsiData).length} z {stocks.length} spółek
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 12 : 13, minWidth: isMobile ? "auto" : 700 }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 2, background: theme.bgCard }}>
              <tr>
                {!isMobile && colHead("#", "id", false)}
                <th style={{ padding: isMobile ? "12px 10px" : "14px 16px", textAlign: "left", fontSize: 10, color: theme.textMuted, borderBottom: `2px solid ${theme.border}`, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-ui)" }}>Spółka</th>
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
                <tr><td colSpan={isMobile ? 5 : 9} style={{ textAlign: "center", padding: "40px 0", color: theme.textSecondary, fontSize: 13 }}>Brak spółek spełniających kryteria</td></tr>
              )}
              {visible.map((s, i) => {
                const currentPrice = prices[s.ticker];
                const hasData = currentPrice != null && currentPrice > 0;
                const c24h = changes[s.ticker]?.change24h ?? 0;
                const c7d = changes[s.ticker]?.change7d ?? 0;
                const rsi = rsiData[s.ticker];
                const rsiColor = rsi > 70 ? "#ef4444" : rsi < 30 ? "#22c55e" : theme.textSecondary;
                const rsiBg = rsi > 70 ? "rgba(239,68,68,0.12)" : rsi < 30 ? "rgba(34,197,94,0.12)" : "transparent";
                const priceColor = hasData ? (c24h > 0 ? "#22c55e" : c24h < 0 ? "#ef4444" : theme.textBright) : theme.textMuted;
                const rowOpacity = hasData ? 1 : 0.35;
                return (
                  <tr key={s.id} onClick={() => onSelect(s)}
                    style={{ borderBottom: `1px solid ${theme.border}`, cursor: "pointer", transition: "background 0.15s, opacity 0.2s", opacity: rowOpacity }}
                    onMouseEnter={e => e.currentTarget.style.background = theme.bgCardAlt}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {!isMobile && <td style={{ padding: `${PAD} 16px`, color: theme.textMuted, fontSize: 10, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{(page - 1) * PER_PAGE + i + 1}</td>}
                    <td style={{ padding: `${PAD} ${isMobile ? "10px" : "16px"}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <StockLogo ticker={s.ticker} size={isMobile ? 28 : 32} borderRadius={6} sector={s.sector} />
                        <div>
                          <div style={{ fontWeight: 600, color: hasData ? theme.textBright : theme.textMuted, fontSize: isMobile ? 12 : 14, fontFamily: "var(--font-ui)", letterSpacing: "0.01em" }}>{s.ticker}</div>
                          <div style={{ fontSize: 11, color: theme.textMuted, maxWidth: isMobile ? 100 : 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: `${PAD} ${isMobile ? "8px" : "16px"}`, textAlign: "right", fontWeight: 600, color: priceColor, fontSize: hasData ? (isMobile ? 12 : 13) : 12, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)" }}>
                      {hasData ? <>{fmt(currentPrice)} zł</> : <span style={{ color: theme.textMuted, fontWeight: 400 }}>Brak danych</span>}
                    </td>
                    <td style={{ padding: `${PAD} ${isMobile ? "8px" : "16px"}`, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {hasData ? (
                        <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, fontSize: isMobile ? 11 : 12, fontWeight: 600, background: c24h > 0 ? "rgba(34,197,94,0.12)" : c24h < 0 ? "rgba(239,68,68,0.12)" : "rgba(148,163,184,0.08)", color: changeColor(c24h), whiteSpace: "nowrap", fontFamily: "var(--font-mono)" }}>{changeFmt(c24h)}</span>
                      ) : (
                        <span style={{ color: theme.textMuted, fontSize: 12 }}>—</span>
                      )}
                    </td>
                    {!isMobile && <td style={{ padding: `${PAD} 16px`, textAlign: "right", color: hasData ? changeColor(c7d) : theme.textMuted, fontSize: 12, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)" }}>{hasData ? changeFmt(c7d) : "—"}</td>}
                    <td style={{ padding: `${PAD} ${isMobile ? "8px" : "16px"}`, textAlign: "right", color: theme.textSecondary, fontSize: 12, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)" }}>{fmtCap(s.cap)}</td>
                    {!isMobile && <td style={{ padding: `${PAD} 16px`, textAlign: "right", color: theme.textSecondary, fontSize: 12, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)" }}>{s.pe > 0 ? fmt(s.pe) : <span style={{ color: theme.textMuted }}>—</span>}</td>}
                    {!isMobile && <td style={{ padding: `${PAD} 16px`, textAlign: "right", fontSize: 12, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)", color: s.div > 0 ? "#22c55e" : theme.textMuted, fontWeight: s.div > 0 ? 600 : 400 }}>{s.div > 0 ? `${fmt(s.div)}%` : "—"}</td>}
                    <td style={{ padding: `${PAD} ${isMobile ? "8px" : "16px"}`, textAlign: "right" }}>
                      {rsi != null ? (
                        <span style={{
                          display: "inline-block",
                          padding: rsi > 70 || rsi < 30 ? "3px 10px" : "3px 8px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          fontFamily: "var(--font-mono)",
                          fontVariantNumeric: "tabular-nums",
                          background: rsiBg,
                          color: rsiColor,
                        }}>{rsi.toFixed(0)}</span>
                      ) : (
                        <span style={{ fontSize: 10, color: theme.textMuted }}>...</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {(totalPages > 1 || noDataCount > 0) && (
          <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${theme.border}`, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "var(--font-ui)" }}>{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} z {filtered.length}</div>
              {noDataCount > 0 && (
                <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "var(--font-ui)", fontStyle: "italic", opacity: 0.7 }}>
                  {noDataCount} {noDataCount === 1 ? "spółka" : noDataCount < 5 ? "spółki" : "spółek"} bez dostępnych danych
                </div>
              )}
            </div>
            {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} theme={theme} />}
          </div>
        )}
      </div>
    </div>
  );
}

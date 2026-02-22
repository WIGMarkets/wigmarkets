import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { fmt, fmtVolume, fmtCap, changeFmt, changeColor } from "../lib/formatters.js";
import { fetchBulk } from "../lib/api.js";
import Icon from "../components/edukacja/Icon.jsx";
import FilterDropdown from "../components/ui/FilterDropdown.jsx";

// ─── Color helpers (same as Heatmap.jsx) ──────────────────────────────────────

function heatColor(pct) {
  const v = Math.max(-5, Math.min(5, pct));
  if (Math.abs(v) < 0.15) return "#1a1a2e";
  if (v > 0) {
    const t = v / 5;
    if (t <= 0.2) return lerpColor("#1a1a2e", "#0d4a2b", t / 0.2);
    if (t <= 0.6) return lerpColor("#0d4a2b", "#15803d", (t - 0.2) / 0.4);
    return lerpColor("#15803d", "#22c55e", (t - 0.6) / 0.4);
  } else {
    const t = Math.abs(v) / 5;
    if (t <= 0.2) return lerpColor("#1a1a2e", "#4a0d0d", t / 0.2);
    if (t <= 0.6) return lerpColor("#4a0d0d", "#991b1b", (t - 0.2) / 0.4);
    return lerpColor("#991b1b", "#dc2626", (t - 0.6) / 0.4);
  }
}

function lerpColor(a, b, t) {
  const parse = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${bl})`;
}

function textAlpha(pct) {
  return Math.abs(pct) < 0.5 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.95)";
}

// ─── Squarified treemap layout ────────────────────────────────────────────────

function squarify(items, x, y, w, h) {
  if (!items.length) return [];
  const rects = [];
  let remaining = [...items];
  let cx = x, cy = y, cw = w, ch = h;

  while (remaining.length) {
    const total = remaining.reduce((a, s) => a + s.weight, 0);
    if (total <= 0) break;
    const isWide = cw >= ch;
    const side = isWide ? ch : cw;
    let row = [remaining[0]];
    let rowSum = remaining[0].weight;

    for (let i = 1; i < remaining.length; i++) {
      const nextSum = rowSum + remaining[i].weight;
      const rowFrac = rowSum / total;
      const nextFrac = nextSum / total;
      const rowThick = rowFrac * (isWide ? cw : ch);
      const nextThick = nextFrac * (isWide ? cw : ch);
      const worstCur = row.reduce((worst, s) => {
        const len = (s.weight / rowSum) * side;
        return Math.max(worst, Math.max(rowThick / len, len / rowThick));
      }, 0);
      const worstNext = [...row, remaining[i]].reduce((worst, s) => {
        const len = (s.weight / nextSum) * side;
        return Math.max(worst, Math.max(nextThick / len, len / nextThick));
      }, 0);
      if (worstNext <= worstCur) { row.push(remaining[i]); rowSum = nextSum; } else break;
    }

    const thick = (rowSum / total) * (isWide ? cw : ch);
    let offset = 0;
    for (const s of row) {
      const len = (s.weight / rowSum) * side;
      rects.push({
        ...s,
        rx: isWide ? cx : cx + offset,
        ry: isWide ? cy + offset : cy,
        rw: isWide ? thick : len,
        rh: isWide ? len : thick,
      });
      offset += len;
    }
    remaining = remaining.slice(row.length);
    if (isWide) { cx += thick; cw -= thick; } else { cy += thick; ch -= thick; }
  }
  return rects;
}

const GAP = 1;

// ─── Group options ────────────────────────────────────────────────────────────

const GROUP_OPTIONS = [
  { id: "cap", label: "Kapitalizacja" },
  { id: "sector", label: "Sektor" },
  { id: "index", label: "Indeks" },
];

const COLOR_OPTIONS = [
  { id: "change24h", label: "Zmiana 24H" },
  { id: "change7d", label: "Zmiana 7D" },
];

// ─── Main component ──────────────────────────────────────────────────────────

export default function HeatmapPage({ theme, liveStocks, prices, changes, setPrices, setChanges }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [tooltip, setTooltip] = useState(null);
  const tooltipTimer = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  const [groupBy, setGroupBy] = useState("cap");
  const [colorBy, setColorBy] = useState("change24h");
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);

  // Page title & meta
  useEffect(() => {
    document.title = "Heatmapa GPW — Mapa rynku w czasie rzeczywistym — WIGmarkets.pl";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Interaktywna heatmapa Giełdy Papierów Wartościowych w Warszawie. Zobacz które spółki rosną a które spadają. Mapa rynku GPW.");
  }, []);

  // Fetch fresh data for all GPW stocks
  useEffect(() => {
    const symbols = liveStocks.map(s => s.stooq || s.ticker.toLowerCase());
    const load = async () => {
      const bulk = await fetchBulk(symbols);
      const newPrices = {};
      const newChanges = {};
      for (const s of liveStocks) {
        const sym = s.stooq || s.ticker.toLowerCase();
        const data = bulk[sym];
        if (data?.close) {
          newPrices[s.ticker] = data.close;
          newChanges[s.ticker] = {
            change24h: data.change24h ?? 0,
            change7d: data.change7d ?? 0,
            volume: data.volume ?? 0,
            sparkline: data.sparkline ?? null,
          };
        }
      }
      if (Object.keys(newPrices).length) {
        setPrices(prev => ({ ...prev, ...newPrices }));
        setChanges(prev => ({ ...prev, ...newChanges }));
      }
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [liveStocks]);

  // Observe container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setContainerSize({ w: rect.width, h: rect.height });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Prepare all items with data
  const allItems = useMemo(() => {
    return liveStocks
      .map(s => ({
        ...s,
        weight: s.cap || 0,
        c24h: changes[s.ticker]?.change24h ?? 0,
        c7d: changes[s.ticker]?.change7d ?? 0,
        price: prices[s.ticker],
        volume: changes[s.ticker]?.volume ?? 0,
      }))
      .filter(s => s.price && s.weight > 0)
      .sort((a, b) => b.weight - a.weight);
  }, [liveStocks, prices, changes]);

  // Compute color value based on selected mode
  const getColorValue = useCallback((item) => {
    if (colorBy === "change7d") return item.c7d;
    return item.c24h;
  }, [colorBy]);

  // Treemap layout
  const rects = useMemo(() => {
    if (!containerSize.w || !containerSize.h || !allItems.length) return [];

    if (groupBy === "cap") {
      return squarify(allItems, 0, 0, containerSize.w, containerSize.h);
    }

    // Grouped mode: divide space proportionally per group, then squarify within each group
    const groupKey = groupBy === "sector" ? "sector" : "index";
    const groups = {};
    for (const item of allItems) {
      const key = item[groupKey] || "Inne";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }

    // Sort groups by total weight
    const sortedGroups = Object.entries(groups)
      .map(([name, items]) => ({ name, items, total: items.reduce((a, b) => a + b.weight, 0) }))
      .sort((a, b) => b.total - a.total);

    const totalWeight = sortedGroups.reduce((a, g) => a + g.total, 0);
    if (totalWeight <= 0) return [];

    // Lay out groups as horizontal slices, then squarify within each
    const result = [];
    let yOffset = 0;
    for (const group of sortedGroups) {
      const groupHeight = (group.total / totalWeight) * containerSize.h;
      if (groupHeight < 1) continue;
      const groupRects = squarify(group.items, 0, yOffset, containerSize.w, groupHeight);
      for (const r of groupRects) {
        result.push({ ...r, group: group.name });
      }
      yOffset += groupHeight;
    }
    return result;
  }, [allItems, containerSize, groupBy]);

  // Search matching
  const searchLower = search.toLowerCase().trim();
  const hasSearch = searchLower.length > 0;
  const matchTicker = useCallback((ticker) => {
    if (!hasSearch) return true;
    return ticker.toLowerCase().includes(searchLower);
  }, [hasSearch, searchLower]);

  // Click handler
  const handleClick = useCallback((r) => {
    navigate(`/spolka/${r.ticker}`);
  }, [navigate]);

  // Tooltip handlers
  const showTooltip = useCallback((r, e) => {
    clearTimeout(tooltipTimer.current);
    mousePos.current = { x: e.clientX, y: e.clientY };
    tooltipTimer.current = setTimeout(() => {
      setTooltip({ ...r, x: mousePos.current.x, y: mousePos.current.y });
    }, 80);
  }, []);

  const moveTooltip = useCallback((e) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
    setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
  }, []);

  const hideTooltip = useCallback(() => {
    clearTimeout(tooltipTimer.current);
    setTooltip(null);
  }, []);

  // Last update time
  const now = new Date();
  const updateTime = now.toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" }) + ", " + now.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });

  const stockCount = allItems.length;

  return (
    <div style={{ color: theme.text, fontFamily: "var(--font-ui)", maxWidth: 1400, margin: "0 auto", padding: isMobile ? "16px 12px" : "24px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: theme.textBright, margin: 0, lineHeight: 1.3 }}>
          Heatmapa GPW
        </h1>
        <div style={{ fontSize: 14, color: theme.textMuted, marginTop: 4 }}>
          Mapa rynku w czasie rzeczywistym
        </div>
        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>
          Ostatnia aktualizacja: {updateTime}
        </div>
      </div>

      {/* Filters row */}
      <div style={{
        display: "flex", gap: isMobile ? 8 : 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: theme.textSecondary, whiteSpace: "nowrap" }}>Grupuj:</span>
          <div style={{ width: isMobile ? 140 : 160 }}>
            <FilterDropdown options={GROUP_OPTIONS} value={groupBy} onChange={setGroupBy} theme={theme} minWidth={160} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: theme.textSecondary, whiteSpace: "nowrap" }}>Kolor:</span>
          <div style={{ width: isMobile ? 140 : 160 }}>
            <FilterDropdown options={COLOR_OPTIONS} value={colorBy} onChange={setColorBy} theme={theme} minWidth={160} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: isMobile ? 0 : "auto" }}>
          <div style={{ position: "relative" }}>
            <Icon name="search" size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: theme.textMuted, pointerEvents: "none" }} />
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Szukaj ticker..."
              style={{
                width: isMobile ? 140 : 180,
                height: 36,
                background: theme.bgCard,
                border: `1px solid ${theme.borderInput}`,
                borderRadius: 8,
                padding: "0 12px 0 30px",
                color: theme.text,
                fontSize: 12,
                outline: "none",
                fontFamily: "var(--font-ui)",
                transition: "border-color 0.2s",
              }}
              onFocus={e => { e.target.style.borderColor = theme.accent; }}
              onBlur={e => { e.target.style.borderColor = theme.borderInput; }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
                  background: "transparent", border: "none", color: theme.textMuted,
                  cursor: "pointer", padding: 2, lineHeight: 1, display: "inline-flex",
                }}
              >
                <Icon name="x" size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Heatmap container */}
      <div style={{
        background: theme.bgCard,
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 16,
      }}>
        <div
          ref={containerRef}
          style={{
            position: "relative",
            width: "100%",
            height: isMobile ? "60vh" : "calc(100vh - 260px)",
            minHeight: 400,
            overflow: "hidden",
            background: "#111113",
          }}
          onMouseLeave={hideTooltip}
        >
          {rects.length === 0 && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 8 }}>Ładowanie danych rynkowych...</div>
                <div style={{
                  width: 32, height: 32, border: `3px solid ${theme.border}`,
                  borderTopColor: theme.accent, borderRadius: "50%",
                  animation: "spin 0.8s linear infinite", margin: "0 auto",
                }} />
              </div>
            </div>
          )}
          <div style={{ position: "absolute", inset: 0 }}>
            {rects.map(r => {
              const colorVal = getColorValue(r);
              const bg = heatColor(colorVal);
              const tColor = textAlpha(colorVal);
              const px = r.rx + GAP / 2;
              const py = r.ry + GAP / 2;
              const pw = r.rw - GAP;
              const ph = r.rh - GAP;
              if (pw <= 0 || ph <= 0) return null;

              const isMatch = matchTicker(r.ticker);
              const dimmed = hasSearch && !isMatch;

              const showTicker = pw >= 28 && ph >= 16;
              const showPct = pw >= 44 && ph >= 34;
              const showName = pw >= 80 && ph >= 50;
              const minDim = Math.min(pw, ph);
              const tickerSize = Math.max(9, Math.min(18, Math.floor(minDim * 0.26)));
              const pctSize = Math.max(8, tickerSize - 2);

              return (
                <div
                  key={r.ticker}
                  onClick={() => handleClick(r)}
                  onMouseEnter={(e) => showTooltip(r, e)}
                  onMouseMove={moveTooltip}
                  onMouseLeave={hideTooltip}
                  style={{
                    position: "absolute",
                    left: px,
                    top: py,
                    width: pw,
                    height: ph,
                    background: bg,
                    borderRadius: 2,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    transition: "filter 0.15s, outline-color 0.15s, opacity 0.2s",
                    outline: "1px solid transparent",
                    willChange: "filter",
                    opacity: dimmed ? 0.3 : 1,
                    animation: (hasSearch && isMatch) ? "pulse-highlight 1.5s ease-in-out infinite" : "none",
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.filter = "brightness(1.2)"; e.currentTarget.style.outlineColor = "rgba(255,255,255,0.3)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.filter = ""; e.currentTarget.style.outlineColor = "transparent"; }}
                >
                  {showTicker && (
                    <span style={{
                      fontWeight: 700,
                      fontSize: tickerSize,
                      color: tColor,
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                      lineHeight: 1.2,
                      fontFamily: "var(--font-ui)",
                      userSelect: "none",
                    }}>{r.ticker}</span>
                  )}
                  {showPct && (
                    <span style={{
                      fontWeight: 500,
                      fontSize: pctSize,
                      color: tColor,
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                      lineHeight: 1.2,
                      fontFamily: "var(--font-mono)",
                      fontVariantNumeric: "tabular-nums",
                      userSelect: "none",
                      marginTop: 1,
                    }}>{colorVal > 0 ? "+" : ""}{colorVal.toFixed(2)}%</span>
                  )}
                  {showName && (
                    <span style={{
                      fontSize: Math.max(8, tickerSize - 4),
                      color: `rgba(255,255,255,${Math.abs(colorVal) < 0.5 ? 0.3 : 0.6})`,
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                      lineHeight: 1.2,
                      fontFamily: "var(--font-ui)",
                      userSelect: "none",
                      marginTop: 2,
                      maxWidth: pw - 8,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}>{r.name}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12, marginBottom: isMobile ? 32 : 48,
        padding: "0 4px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: theme.textSecondary, fontFamily: "var(--font-ui)" }}>
          <span style={{ fontFamily: "var(--font-mono)" }}>-5%</span>
          <span>Spadek</span>
          <div style={{
            width: isMobile ? 150 : 240, height: 10, borderRadius: 5, flexShrink: 0,
            background: "linear-gradient(to right, #dc2626, #991b1b, #4a0d0d, #1a1a2e, #0d4a2b, #15803d, #22c55e)",
          }} />
          <span>Wzrost</span>
          <span style={{ fontFamily: "var(--font-mono)" }}>+5%</span>
        </div>
        <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>
          {stockCount} {stockCount === 1 ? "spółka" : stockCount < 5 ? "spółki" : "spółek"} GPW
        </div>
      </div>

      {/* SEO section */}
      <div style={{
        background: theme.bgCard,
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        padding: isMobile ? 20 : 24,
        maxWidth: 800,
        marginBottom: 48,
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: theme.textBright, margin: "0 0 16px 0" }}>
          Czym jest heatmapa giełdowa?
        </h2>
        <div style={{ fontSize: 15, color: theme.textSecondary, lineHeight: 1.7 }}>
          <p style={{ margin: "0 0 16px 0" }}>
            Heatmapa rynku to wizualna reprezentacja kondycji spółek notowanych na Giełdzie Papierów
            Wartościowych w Warszawie. Wielkość każdego kafelka odpowiada kapitalizacji rynkowej spółki,
            a kolor pokazuje zmianę kursu — zielony oznacza wzrost, czerwony spadek. Dzięki heatmapie
            w jednym spojrzeniu widzisz stan całego rynku.
          </p>
          <p style={{ margin: "0 0 16px 0" }}>
            Heatmapa GPW jest aktualizowana w czasie rzeczywistym i obejmuje wszystkie główne spółki
            notowane na warszawskim parkiecie — od blue chipów z indeksu WIG20, przez średnie spółki
            z mWIG40, aż po mniejsze firmy z sWIG80 i pozostałe.
          </p>
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: theme.textBright, margin: "0 0 12px 0" }}>
          Jak czytać heatmapę?
        </h3>
        <ul style={{ fontSize: 15, color: theme.textSecondary, lineHeight: 1.7, margin: "0 0 20px 0", paddingLeft: 20 }}>
          <li>Im większy kafelek, tym większa kapitalizacja spółki</li>
          <li>Ciemna zieleń = duży wzrost (powyżej 3%)</li>
          <li>Ciemna czerwień = duży spadek (powyżej 3%)</li>
          <li>Szary/neutralny = zmiana bliska 0%</li>
          <li>Kliknij na spółkę żeby zobaczyć szczegóły</li>
        </ul>

        {/* Related links */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: theme.textMuted, alignSelf: "center" }}>Powiązane:</span>
          {[
            { label: "Fear & Greed Index", href: "/fear-greed" },
            { label: "Rankingi", href: "/rankingi" },
            { label: "Screener", href: "/" },
          ].map(link => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                padding: "6px 14px", borderRadius: 8,
                background: `${theme.accent}12`,
                border: `1px solid ${theme.accent}30`,
                color: theme.accent,
                fontSize: 13, fontWeight: 500,
                textDecoration: "none",
                transition: "background 0.15s",
                fontFamily: "var(--font-ui)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${theme.accent}24`; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${theme.accent}12`; }}
            >
              {link.label} <Icon name="arrow-right" size={12} style={{ verticalAlign: "middle", marginLeft: 2 }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: "fixed",
          left: Math.min(tooltip.x + 12, (typeof window !== "undefined" ? window.innerWidth - 220 : tooltip.x + 12)),
          top: Math.min(tooltip.y - 10, (typeof window !== "undefined" ? window.innerHeight - 200 : tooltip.y - 10)),
          zIndex: 9999,
          background: "#1a1a1e",
          border: "1px solid #333",
          borderRadius: 8,
          padding: 12,
          pointerEvents: "none",
          minWidth: 200,
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
        }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#f4f4f5", marginBottom: 2, fontFamily: "var(--font-ui)" }}>{tooltip.name}</div>
          <div style={{ fontSize: 11, color: "#a1a1aa", marginBottom: 8, fontFamily: "var(--font-ui)" }}>{tooltip.ticker}{tooltip.sector ? ` · ${tooltip.sector}` : ""}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
              <span style={{ color: "#a1a1aa" }}>Kurs</span>
              <span style={{ color: "#f4f4f5", fontWeight: 600 }}>{fmt(tooltip.price)} zł</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
              <span style={{ color: "#a1a1aa" }}>Zmiana 24H</span>
              <span style={{ color: tooltip.c24h >= 0 ? "#22c55e" : "#ef4444", fontWeight: 600 }}>
                {tooltip.c24h > 0 ? "+" : ""}{fmt(tooltip.c24h)}%
                {tooltip.price ? ` (${tooltip.c24h > 0 ? "+" : ""}${fmt(tooltip.price * tooltip.c24h / 100)} zł)` : ""}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
              <span style={{ color: "#a1a1aa" }}>Zmiana 7D</span>
              <span style={{ color: tooltip.c7d >= 0 ? "#22c55e" : "#ef4444", fontWeight: 600 }}>{tooltip.c7d > 0 ? "+" : ""}{fmt(tooltip.c7d)}%</span>
            </div>
            {tooltip.volume > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                <span style={{ color: "#a1a1aa" }}>Obrót</span>
                <span style={{ color: "#f4f4f5" }}>{fmtVolume(tooltip.volume, tooltip.price)} zł</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
              <span style={{ color: "#a1a1aa" }}>Kapitalizacja</span>
              <span style={{ color: "#f4f4f5" }}>{fmtCap(tooltip.cap)} zł</span>
            </div>
          </div>
        </div>
      )}

      {/* Pulse animation for search highlight */}
      <style>{`
        @keyframes pulse-highlight {
          0%, 100% { outline-color: transparent; }
          50% { outline-color: rgba(59, 130, 246, 0.6); outline-width: 2px; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

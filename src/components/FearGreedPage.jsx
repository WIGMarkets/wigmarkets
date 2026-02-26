import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { fetchFearGreed } from "../lib/api.js";
import { FEAR_COMPONENTS, FEAR_HISTORY_YEAR } from "../data/constants.js";
import FearGreedGauge, { getLabel, getColor } from "./FearGreedGauge.jsx";
import Icon from "./edukacja/Icon.jsx";

const RANGES = [
  { key: "30d",  label: "30d",  days: 30 },
  { key: "90d",  label: "90d",  days: 90 },
  { key: "1r",   label: "1r",   days: 365 },
  { key: "max",  label: "Max",  days: 730 },
];

function formatDate(d) {
  if (typeof d === "string") {
    const [y, m, day] = d.split("-");
    return `${day}.${m}.${y}`;
  }
  return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatDateShort(d) {
  if (typeof d === "string") {
    const [, m, day] = d.split("-");
    const months = ["", "sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];
    return `${parseInt(day)} ${months[parseInt(m)]}`;
  }
  return "";
}

// SVG coordinate system for chart
const CW = 800, CH = 260;
const PAD = { t: 10, b: 28, l: 42, r: 12 };
function toX(i, len) { return PAD.l + (i / Math.max(len - 1, 1)) * (CW - PAD.l - PAD.r); }
function toY(v) { return PAD.t + (1 - v / 100) * (CH - PAD.t - PAD.b); }

// Build fallback data from hardcoded constants
function buildFallbackData() {
  const values = FEAR_HISTORY_YEAR;
  const value = values[values.length - 1];
  const today = new Date();
  return {
    current: {
      value,
      label: getLabel(value),
      color: getColor(value),
      indicators: FEAR_COMPONENTS.map(f => ({
        name: f.label,
        value: f.val,
        label: getLabel(f.val),
        description: "",
        weight: null,
        details: null,
      })),
      indicatorsUsed: FEAR_COMPONENTS.length,
      updatedAt: null,
    },
    historical: {
      yesterday: values[values.length - 2],
      weekAgo: values[values.length - 8],
      monthAgo: values[values.length - 31],
      yearAgo: values[values.length - 366],
    },
    history: values.map((v, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (values.length - 1 - i));
      return { date: d.toISOString().slice(0, 10), value: v };
    }),
    yearMin: Math.min(...values),
    yearMax: Math.max(...values),
    isFallback: true,
  };
}

// Indicator metadata (descriptions, weights, detail formatters)
const INDICATOR_META = {
  "Momentum rynku": {
    weight: "20%",
    description: "Porównuje bieżący kurs WIG20 do średniej 125-sesyjnej. Wzrost ponad średnią oznacza chciwość na rynku.",
    formatDetails: (d) => d ? `WIG20: ${d.wig20?.toFixed(2) ?? "b.d."} | SMA 125: ${d.sma125?.toFixed(2) ?? "b.d."} | Odchylenie: ${d.deviation != null ? (d.deviation > 0 ? "+" : "") + d.deviation.toFixed(2) + "%" : "b.d."}` : null,
  },
  "Szerokość rynku": {
    weight: "20%",
    description: "Procent spółek GPW notujących powyżej swojej 50-sesyjnej średniej. Im więcej spółek rośnie, tym silniejszy jest trend wzrostowy.",
    formatDetails: (d) => d ? `${d.above ?? "b.d."} z ${d.total ?? "b.d."} spółek (${d.pct != null ? d.pct.toFixed(1) + "%" : "b.d."}) powyżej SMA 50` : null,
  },
  "Zmienność rynku": {
    weight: "15%",
    description: "Zmienność WIG20 w ostatnich 20 sesjach porównana do średniej rocznej. Wysoka zmienność towarzyszy panice, niska — spokojowi na rynku.",
    formatDetails: (d) => d ? `Zmienność 20d: ${d.vol20d != null ? d.vol20d.toFixed(2) + "%" : "b.d."} | Średnia roczna: ${d.volYear != null ? d.volYear.toFixed(2) + "%" : "b.d."} | Ratio: ${d.ratio != null ? d.ratio.toFixed(2) : "b.d."}` : null,
  },
  "Nowe szczyty vs dołki": {
    weight: "15%",
    description: "Stosunek spółek blisko 52-tygodniowych maksimów do tych blisko minimów. Dominacja szczytów sygnalizuje optymizm inwestorów.",
    formatDetails: (d) => d ? `Blisko szczytów: ${d.highs ?? "b.d."} | Blisko dołków: ${d.lows ?? "b.d."}` : null,
  },
  "Siła wolumenu": {
    weight: "10%",
    description: "Stosunek wolumenu w dniach wzrostowych do spadkowych w ostatnich 30 sesjach. Przewaga kupujących to sygnał chciwości.",
    formatDetails: (d) => d ? `Wolumen wzrostowy: ${d.upVol != null ? (d.upVol / 1e9).toFixed(2) + " mld" : "b.d."} | Spadkowy: ${d.downVol != null ? (d.downVol / 1e9).toFixed(2) + " mld" : "b.d."} | Ratio: ${d.ratio != null ? d.ratio.toFixed(2) : "b.d."}` : null,
  },
  "Małe vs duże spółki": {
    weight: "10%",
    description: "Porównanie wyników sWIG80 do WIG20 w ostatnich 20 sesjach. Gdy małe spółki wygrywają, inwestorzy szukają ryzyka — to sygnał chciwości.",
    formatDetails: (d) => d ? `sWIG80 20d: ${d.swig != null ? d.swig.toFixed(2) + "%" : "b.d."} | WIG20 20d: ${d.wig20 != null ? d.wig20.toFixed(2) + "%" : "b.d."} | Różnica: ${d.diff != null ? d.diff.toFixed(2) + "pp" : "b.d."}` : null,
  },
  "Popyt na bezpieczne aktywa": {
    weight: "10%",
    description: "Relatywna siła obligacji i złota vs akcji GPW. Napływy do bezpiecznych przystani kosztem akcji sygnalizują strach na rynku.",
    formatDetails: (d) => d ? `WIG20 20d: ${d.wig20 != null ? d.wig20.toFixed(2) + "%" : "b.d."} | Obligacje/Złoto 20d: ${d.safe != null ? d.safe.toFixed(2) + "%" : "b.d."} | Różnica: ${d.diff != null ? d.diff.toFixed(2) + "pp" : "b.d."}` : null,
  },
};

// Zone bands for chart
const ZONE_BANDS = [
  { from: 75, to: 100, color: "rgba(16, 185, 129, 0.06)" },
  { from: 55, to: 75,  color: "rgba(34, 197, 94, 0.04)" },
  { from: 45, to: 55,  color: "rgba(234, 179, 8, 0.03)" },
  { from: 25, to: 45,  color: "rgba(249, 115, 22, 0.04)" },
  { from: 0,  to: 25,  color: "rgba(239, 68, 68, 0.06)" },
];

export default function FearGreedPage({ theme }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("1r");
  const [hover, setHover] = useState(null);
  const [methodOpen, setMethodOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copyToast, setCopyToast] = useState(false);
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const shareRef = useRef(null);

  useEffect(() => {
    fetchFearGreed()
      .then(apiData => {
        const d = apiData || buildFallbackData();
        if (!d?.current || typeof d.current.value !== "number") {
          setData(buildFallbackData());
        } else {
          setData(d);
        }
      })
      .catch(() => setData(buildFallbackData()))
      .finally(() => setLoading(false));
  }, []);

  // Chart data computation — must be before any conditional returns
  const allHistory = data ? (data.history || []).filter(h => h && typeof h.value === "number" && !isNaN(h.value)) : [];
  const sliceDays = RANGES.find(r => r.key === range)?.days ?? 365;
  const chartSlice = allHistory.slice(-sliceDays);
  const chartData = chartSlice.map(h => h.value);
  const chartDates = chartSlice.map(h => h.date || "");

  const handleMouseMove = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg || chartData.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const idx = Math.round(ratio * (chartData.length - 1));
    setHover({ index: idx, ratioX: ratio, value: chartData[idx], date: chartDates[idx] });
  }, [chartData, chartDates]);

  const handleMouseLeave = useCallback(() => setHover(null), []);

  // Close share dropdown on outside click
  useEffect(() => {
    if (!shareOpen) return;
    const handle = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) setShareOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [shareOpen]);

  if (loading) {
    return (
      <div style={{ minHeight: "50vh", color: theme.text, fontFamily: "var(--font-ui)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: `3px solid ${theme.border}`, borderTopColor: theme.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <div style={{ fontSize: 14, color: theme.textSecondary }}>Ładowanie Fear & Greed Index...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    );
  }

  if (!data || !data.current) {
    return (
      <div style={{ minHeight: "50vh", color: theme.text, fontFamily: "var(--font-ui)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 16 }}>Nie udało się załadować danych Fear & Greed Index</div>
          <button onClick={() => navigate("/")} style={{ background: "none", border: `1px solid ${theme.border}`, color: theme.text, borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
            Powrót do strony głównej
          </button>
        </div>
      </div>
    );
  }

  const value = data.current?.value ?? 50;
  const color = getColor(value);
  const indicators = data.current?.indicators || [];
  const isFallback = data.isFallback === true;

  const yesterday = data.historical?.yesterday;
  const weekAgo = data.historical?.weekAgo;
  const monthAgo = data.historical?.monthAgo;
  const yearAgo = data.historical?.yearAgo;

  // Chart SVG paths
  const pts = chartData.length > 1
    ? chartData.map((v, i) => `${toX(i, chartData.length).toFixed(1)},${toY(v).toFixed(1)}`).join(" ")
    : "";
  const firstX = chartData.length > 1 ? toX(0, chartData.length).toFixed(1) : "0";
  const lastXv = chartData.length > 1 ? toX(chartData.length - 1, chartData.length).toFixed(1) : "0";
  const bottomY = (CH - PAD.b).toFixed(1);

  const xLabelCount = isMobile ? 3 : 6;
  const xLabelIndices = chartData.length > 1
    ? Array.from({ length: xLabelCount }, (_, i) => Math.round(i * (chartData.length - 1) / (xLabelCount - 1)))
    : [];

  const getTooltipLeft = () => {
    if (!hover || !containerRef.current) return 0;
    const cw = containerRef.current.getBoundingClientRect().width;
    const raw = hover.ratioX * cw;
    return Math.min(Math.max(raw - 70, 0), cw - 150);
  };

  const updatedAt = data.current?.updatedAt;
  const updatedStr = (() => {
    if (!updatedAt) return null;
    const d = new Date(updatedAt);
    if (isNaN(d.getTime())) return null;
    const months = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];
    const day = d.getDate();
    const mon = months[d.getMonth()];
    const year = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${day} ${mon} ${year}, ${hh}:${mm}`;
  })();

  // Diff arrows for comparison cards
  function diffArrow(refVal) {
    if (refVal == null) return null;
    const diff = value - refVal;
    if (diff === 0) return <span style={{ fontSize: 11, color: theme.textMuted }}>—</span>;
    return (
      <span style={{ fontSize: 11, color: diff > 0 ? "#22c55e" : "#ef4444", fontFamily: "var(--font-mono)" }}>
        {diff > 0 ? "↑" : "↓"} {Math.abs(diff)}
      </span>
    );
  }

  const shareUrl = "https://wigmarkets.pl/fear-greed";
  const shareText = `GPW Fear & Greed Index: ${value} (${getLabel(value)}) — sprawdź sentyment rynku GPW`;

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopyToast(true);
    setShareOpen(false);
    setTimeout(() => setCopyToast(false), 2000);
  }

  // CSS animations
  const animCSS = `
    @keyframes fgFadeSlideUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fgFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .fg-animate { opacity: 0; animation: fgFadeSlideUp 0.5s ease-out forwards; }
    .fg-fade { opacity: 0; animation: fgFadeIn 0.4s ease-out forwards; }
  `;

  return (
    <div style={{ color: theme.text, fontFamily: "var(--font-ui)" }}>
      <style>{animCSS}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${theme.border}`, padding: isMobile ? "16px" : "20px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 700, color: theme.textBright, margin: "0 0 6px", lineHeight: 1.2 }}>
                GPW Fear & Greed Index
              </h1>
              {updatedStr && !isFallback && (
                <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 4 }}>
                  Ostatnia aktualizacja: {updatedStr}
                </div>
              )}
              <p style={{ fontSize: 14, color: theme.textSecondary, margin: 0, lineHeight: 1.5 }}>
                Wskaźnik sentymentu rynku Giełdy Papierów Wartościowych
              </p>
            </div>

            {/* Share button */}
            <div ref={shareRef} style={{ position: "relative", flexShrink: 0 }}>
              <button
                onClick={() => setShareOpen(v => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "none", border: `1px solid ${theme.border}`,
                  color: theme.textSecondary, borderRadius: 8,
                  padding: "7px 14px", cursor: "pointer",
                  fontSize: 13, fontFamily: "inherit",
                  transition: "border-color 0.15s, color 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = theme.textMuted; e.currentTarget.style.color = theme.textBright; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSecondary; }}
              >
                <Icon name="share-2" size={14} />
                {!isMobile && "Udostępnij"}
              </button>

              {/* Share dropdown */}
              {shareOpen && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 50,
                  background: theme.bgElevated, border: `1px solid ${theme.border}`,
                  borderRadius: 10, padding: "4px 0", minWidth: 220,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                }}>
                  {[
                    { label: "Kopiuj link", icon: "link", onClick: handleCopyLink },
                    { label: "Udostępnij na X", icon: "twitter", onClick: () => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank"); setShareOpen(false); } },
                    { label: "Udostępnij na Facebook", icon: "facebook", onClick: () => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank"); setShareOpen(false); } },
                    { label: "Udostępnij na LinkedIn", icon: "linkedin", onClick: () => { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank"); setShareOpen(false); } },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      style={{
                        display: "flex", alignItems: "center", gap: 10, width: "100%",
                        background: "none", border: "none", padding: "10px 16px",
                        color: theme.text, cursor: "pointer", fontSize: 13,
                        fontFamily: "inherit", textAlign: "left",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = theme.bgHover}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}
                    >
                      <Icon name={item.icon} size={15} style={{ color: theme.textMuted, flexShrink: 0 }} />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Copy toast */}
          {copyToast && (
            <div style={{
              position: "fixed", bottom: 24, right: 24, zIndex: 100,
              background: theme.bgElevated, border: `1px solid ${theme.border}`,
              borderRadius: 8, padding: "10px 18px",
              color: theme.textBright, fontSize: 13,
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              animation: "fgFadeSlideUp 0.3s ease-out",
            }}>
              Link skopiowany do schowka
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "20px 16px" : "32px 32px" }}>

        {/* HERO: Gauge + comparison cards */}
        <div className="fg-animate" style={{ animationDelay: "0ms", marginBottom: 32 }}>
          <div style={{
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            padding: isMobile ? "28px 16px" : "40px 48px",
            textAlign: "center",
          }}>
            {/* Gauge */}
            <FearGreedGauge value={value} size={isMobile ? 240 : 320} animate={true} theme={theme} />

            {data.current?.indicatorsUsed != null && data.current.indicatorsUsed < 7 && !isFallback && (
              <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 8 }}>
                Obliczono z {data.current.indicatorsUsed}/7 wskaźników
              </div>
            )}

            {/* Comparison cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
              gap: isMobile ? 10 : 16,
              marginTop: 32,
              maxWidth: 640,
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              {[
                { label: "Wczoraj", val: yesterday },
                { label: "Tydzień temu", val: weekAgo },
                { label: "Miesiąc temu", val: monthAgo },
                { label: "Rok temu", val: yearAgo },
              ].map((item, idx) => (
                <div
                  key={item.label}
                  className="fg-animate"
                  style={{
                    animationDelay: `${600 + idx * 100}ms`,
                    background: theme.bgCardAlt,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 12,
                    padding: isMobile ? "12px 10px" : "16px 20px",
                    textAlign: "center",
                    transition: "border-color 0.2s, transform 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = theme.textMuted; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ fontSize: 11, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, fontWeight: 600 }}>
                    {item.label}
                  </div>
                  {item.val != null ? (
                    <>
                      <div style={{ fontSize: 28, fontWeight: 700, color: getColor(item.val), lineHeight: 1, fontFamily: "var(--font-mono)" }}>
                        {item.val}
                      </div>
                      <div style={{ fontSize: 12, color: getColor(item.val), fontWeight: 500, marginTop: 4 }}>
                        {getLabel(item.val)}
                      </div>
                      <div style={{ marginTop: 6 }}>
                        {diffArrow(item.val)}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: 20, color: theme.textMuted, padding: "8px 0", fontFamily: "var(--font-mono)" }}>—</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HISTORY CHART */}
        <div className="fg-animate" style={{ animationDelay: "800ms", marginBottom: 32 }}>
          <div style={{
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            padding: isMobile ? "20px 12px" : "24px 28px",
          }}>
            {/* Chart header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 4 }}>
                  Historia indeksu
                </div>
                {hover ? (
                  <div style={{ fontSize: 13, color: theme.textSecondary }}>
                    {formatDate(hover.date)} — <span style={{ color: getColor(hover.value), fontWeight: 700 }}>{hover.value}</span>{" "}
                    <span style={{ color: getColor(hover.value) }}>{getLabel(hover.value)}</span>
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: theme.textMuted }}>Najedź na wykres, aby zobaczyć wartość</div>
                )}
              </div>
              {/* Period tabs */}
              <div style={{ display: "flex", gap: 2, background: theme.bgCardAlt, borderRadius: 8, padding: 3 }}>
                {RANGES.map(r => (
                  <button
                    key={r.key}
                    onClick={() => setRange(r.key)}
                    style={{
                      background: range === r.key ? theme.bgElevated : "transparent",
                      border: "none",
                      borderRadius: 6,
                      padding: "5px 14px",
                      fontSize: 12,
                      fontWeight: range === r.key ? 700 : 500,
                      color: range === r.key ? theme.textBright : theme.textMuted,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.15s",
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart SVG */}
            <div style={{ position: "relative", minHeight: isMobile ? 200 : 260 }}
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {chartData.length > 1 ? (
                <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="none" style={{ display: "block", cursor: "crosshair" }}>
                  <defs>
                    <linearGradient id="fgChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                      <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* Zone bands */}
                  {ZONE_BANDS.map(z => (
                    <rect key={z.from} x={PAD.l} y={toY(z.to)} width={CW - PAD.l - PAD.r} height={toY(z.from) - toY(z.to)} fill={z.color} />
                  ))}

                  {/* Gridlines */}
                  {[25, 50, 75].map(gv => (
                    <g key={gv}>
                      <line x1={PAD.l} y1={toY(gv)} x2={CW - PAD.r} y2={toY(gv)} stroke={theme.border} strokeWidth="0.8" strokeDasharray="4 4" opacity="0.5" />
                      <text x={PAD.l - 6} y={toY(gv) + 3.5} fill={theme.textSecondary} fontSize="10" textAnchor="end" fontFamily="inherit" opacity="0.6">{gv}</text>
                    </g>
                  ))}

                  {/* Area fill */}
                  <polygon points={`${firstX},${bottomY} ${pts} ${lastXv},${bottomY}`} fill="url(#fgChartGrad)" />

                  {/* Main line */}
                  <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />

                  {/* X-axis labels */}
                  {xLabelIndices.map(idx => {
                    const x = toX(idx, chartData.length).toFixed(1);
                    const dStr = chartDates[idx] ? formatDateShort(chartDates[idx]) : "";
                    return (
                      <text key={idx} x={x} y={CH - 4} fill={theme.textSecondary} fontSize="9" textAnchor="middle" fontFamily="inherit" opacity="0.6">
                        {dStr}
                      </text>
                    );
                  })}

                  {/* Hover line + dot */}
                  {hover && (
                    <>
                      <line x1={toX(hover.index, chartData.length)} y1={PAD.t} x2={toX(hover.index, chartData.length)} y2={CH - PAD.b} stroke={theme.textSecondary} strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
                      <circle cx={toX(hover.index, chartData.length)} cy={toY(hover.value)} r="5" fill={getColor(hover.value)} stroke={theme.bgCard} strokeWidth="2" />
                    </>
                  )}
                </svg>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: theme.textMuted, fontSize: 13, minHeight: 200 }}>
                  Za mało danych do wyświetlenia wykresu
                </div>
              )}

              {/* Tooltip */}
              {hover && (
                <div style={{
                  position: "absolute",
                  left: getTooltipLeft(),
                  top: 8,
                  background: theme.bgElevated,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 8,
                  padding: "8px 14px",
                  pointerEvents: "none",
                  zIndex: 10,
                  minWidth: 140,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                }}>
                  <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 4 }}>{formatDate(hover.date)}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: getColor(hover.value), lineHeight: 1, fontFamily: "var(--font-mono)" }}>{hover.value}</div>
                  <div style={{ fontSize: 11, color: getColor(hover.value), fontWeight: 600, marginTop: 3 }}>{getLabel(hover.value)}</div>
                </div>
              )}
            </div>

            {/* Zone legend + min/max */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", gap: isMobile ? 6 : 12, flexWrap: "wrap" }}>
                {[
                  { label: "Skr. panika", color: "#ef4444" },
                  { label: "Strach", color: "#f97316" },
                  { label: "Neutralny", color: "#eab308" },
                  { label: "Chciwość", color: "#22c55e" },
                  { label: "Skr. chciwość", color: "#10b981" },
                ].map(z => (
                  <div key={z.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: theme.textSecondary }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: z.color, flexShrink: 0 }} />
                    {z.label}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: theme.textMuted }}>
                {data.yearMin != null && (
                  <span>Min: <span style={{ color: getColor(data.yearMin), fontWeight: 600 }}>{data.yearMin}</span>{data.yearMinDate && ` (${formatDateShort(data.yearMinDate)})`}</span>
                )}
                {data.yearMax != null && (
                  <span style={{ marginLeft: 16 }}>Max: <span style={{ color: getColor(data.yearMax), fontWeight: 600 }}>{data.yearMax}</span>{data.yearMaxDate && ` (${formatDateShort(data.yearMaxDate)})`}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* COMPONENT CARDS */}
        <div className="fg-animate" style={{ animationDelay: "1000ms", marginBottom: 32 }}>
          <div style={{ fontSize: 10, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 16 }}>
            Składowe indeksu
            {!isFallback && data.current?.indicatorsUsed != null && (
              <span style={{ marginLeft: 12, fontWeight: 400, letterSpacing: 0, textTransform: "none" }}>
                {data.current.indicatorsUsed}/7 aktywnych wskaźników
              </span>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 16 }}>
            {indicators.filter(f => f && f.name).map((f, idx) => {
              const fv = typeof f.value === "number" ? f.value : 50;
              const fc = getColor(fv);
              const fl = getLabel(fv);
              const meta = INDICATOR_META[f.name] || {};
              const weight = meta.weight || (f.weight ? `${(f.weight * 100).toFixed(0)}%` : "");
              const desc = f.description || meta.description || "";
              const detailStr = meta.formatDetails ? meta.formatDetails(f.details) : null;

              // Mini sparkline from history (last 30 values for this indicator)
              // Not available from API per indicator, so skip

              return (
                <div
                  key={f.name}
                  className="fg-animate"
                  style={{
                    animationDelay: `${1000 + idx * 80}ms`,
                    background: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 12,
                    padding: isMobile ? "16px" : "20px 24px",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = theme.textMuted}
                  onMouseLeave={e => e.currentTarget.style.borderColor = theme.border}
                >
                  {/* Header: name + weight */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: theme.textBright, lineHeight: 1.3 }}>{f.name}</div>
                    {weight && <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "var(--font-mono)", flexShrink: 0, marginLeft: 8 }}>{weight}</div>}
                  </div>

                  {/* Value + label */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
                    <div style={{ fontSize: 32, fontWeight: 700, color: fc, lineHeight: 1, fontFamily: "var(--font-mono)" }}>{fv}</div>
                    <div style={{ fontSize: 13, color: fc, fontWeight: 500 }}>{fl}</div>
                  </div>

                  {/* Progress bar with marker dot */}
                  <div style={{ position: "relative", height: 6, background: theme.bgElevated, borderRadius: 3, marginBottom: 14, overflow: "visible" }}>
                    {/* Gradient bar */}
                    <div style={{
                      position: "absolute",
                      top: 0, left: 0, bottom: 0,
                      width: "100%",
                      borderRadius: 3,
                      background: "linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #10b981)",
                      opacity: 0.25,
                    }} />
                    {/* Marker dot */}
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: `${Math.min(100, Math.max(0, fv))}%`,
                      transform: "translate(-50%, -50%)",
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: fc,
                      boxShadow: `0 0 8px ${fc}`,
                      transition: "left 0.8s ease",
                    }} />
                  </div>

                  {/* Description */}
                  {desc && (
                    <div style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.55, marginBottom: detailStr ? 10 : 0 }}>
                      {desc}
                    </div>
                  )}

                  {/* Details */}
                  {detailStr && (
                    <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "var(--font-mono)", lineHeight: 1.5 }}>
                      {detailStr}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* METHODOLOGY (collapsible) */}
        <div className="fg-animate" style={{ animationDelay: "1200ms", marginBottom: 20 }}>
          <div style={{
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            overflow: "hidden",
          }}>
            <button
              onClick={() => setMethodOpen(v => !v)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: isMobile ? "16px" : "18px 24px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: theme.textBright,
              }}
            >
              <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, fontFamily: "var(--font-ui)" }}>Metodologia</span>
              <Icon name={methodOpen ? "chevron-up" : "chevron-down"} size={16} style={{ color: theme.textMuted }} />
            </button>
            <div style={{
              maxHeight: methodOpen ? 600 : 0,
              overflow: "hidden",
              transition: "max-height 0.3s ease",
            }}>
              <div style={{ padding: isMobile ? "0 16px 20px" : "0 24px 24px", maxWidth: 720 }}>
                <p style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.7, margin: "0 0 16px" }}>
                  GPW Fear & Greed Index to syntetyczny wskaźnik sentymentu inwestorów na Giełdzie Papierów Wartościowych w Warszawie.
                  Obliczany jest jako ważona średnia siedmiu składowych, normalizowana do zakresu 0-100.
                </p>

                {/* Weights table */}
                <div style={{ marginBottom: 16 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <th style={{ textAlign: "left", padding: "8px 0", color: theme.textMuted, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Wskaźnik</th>
                        <th style={{ textAlign: "right", padding: "8px 0", color: theme.textMuted, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Waga</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Momentum rynku", "20%"],
                        ["Szerokość rynku", "20%"],
                        ["Zmienność rynku", "15%"],
                        ["Nowe szczyty vs dołki", "15%"],
                        ["Siła wolumenu", "10%"],
                        ["Małe vs duże spółki", "10%"],
                        ["Popyt na bezpieczne aktywa", "10%"],
                      ].map(([name, weight]) => (
                        <tr key={name} style={{ borderBottom: `1px solid ${theme.border}` }}>
                          <td style={{ padding: "8px 0", color: theme.textSecondary }}>{name}</td>
                          <td style={{ padding: "8px 0", color: theme.textBright, textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600 }}>{weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Scale */}
                <div style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.7, marginBottom: 16 }}>
                  <strong style={{ color: theme.textBright }}>Skala:</strong> 0-24 Skrajna panika | 25-44 Strach | 45-55 Neutralny | 56-74 Chciwość | 75-100 Skrajna chciwość
                </div>

                <p style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.7, margin: 0 }}>
                  Dane rynkowe pobierane ze Stooq.pl. Obliczenia wykonywane codziennie po zamknięciu sesji GPW.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="fg-animate" style={{ animationDelay: "1300ms" }}>
          <div style={{
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            padding: isMobile ? "14px 16px" : "16px 24px",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}>
            <Icon name="alert-triangle" size={16} style={{ color: theme.textMuted, flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.6, margin: 0 }}>
              Fear & Greed Index jest wskaźnikiem eksperymentalnym opartym na publicznie dostępnych danych rynkowych.
              Nie stanowi rekomendacji inwestycyjnej. Metodologia i wagi poszczególnych składowych mogą ulec zmianie.
              Decyzje inwestycyjne podejmuj na podstawie własnej analizy.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

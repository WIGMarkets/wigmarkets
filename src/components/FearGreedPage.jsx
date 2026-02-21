import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { fetchFearGreed } from "../lib/api.js";
import { FEAR_COMPONENTS, FEAR_HISTORY_YEAR } from "../data/constants.js";
import Icon from "./edukacja/Icon.jsx";

function getLabel(v) {
  if (v < 25) return "Skrajna panika";
  if (v < 45) return "Strach";
  if (v < 55) return "Neutralny";
  if (v < 75) return "Chciwość";
  return "Ekstremalna chciwość";
}
function getColor(v) {
  if (v < 25) return "#dc2626";
  if (v < 45) return "#ea580c";
  if (v < 55) return "#ca8a04";
  if (v < 75) return "#16a34a";
  return "#15803d";
}

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

// SVG coordinate system
const CW = 800, CH = 200;
const PAD = { t: 10, b: 28, l: 42, r: 12 };
function toX(i, len) { return PAD.l + (i / (len - 1)) * (CW - PAD.l - PAD.r); }
function toY(v) { return PAD.t + (1 - v / 100) * (CH - PAD.t - PAD.b); }

// Build fallback data from hardcoded constants (used when API is unavailable)
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

export default function FearGreedPage({ theme }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animated, setAnimated] = useState(false);
  const [range, setRange] = useState("1r");
  const [hover, setHover] = useState(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchFearGreed()
      .then(apiData => {
        const d = apiData || buildFallbackData();
        // Validate that the data has the expected shape
        if (!d?.current || typeof d.current.value !== "number") {
          setData(buildFallbackData());
        } else {
          setData(d);
        }
      })
      .catch(() => {
        setData(buildFallbackData());
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (!loading) setTimeout(() => setAnimated(true), 300); }, [loading]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bgPage, color: theme.text, fontFamily: "var(--font-ui)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 14, color: theme.textSecondary }}>Ładowanie Fear & Greed Index...</div>
        </div>
      </div>
    );
  }

  if (error || !data || !data.current) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bgPage, color: theme.text, fontFamily: "var(--font-ui)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 16 }}>
            {error || "Nie udało się załadować danych Fear & Greed Index"}
          </div>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none", border: `1px solid ${theme.border}`,
              color: theme.text, borderRadius: 8, padding: "8px 18px",
              cursor: "pointer", fontSize: 13, fontFamily: "inherit",
            }}
          >
            Powrót do strony głównej
          </button>
        </div>
      </div>
    );
  }

  const value = data.current?.value ?? 50;
  const color = getColor(value);
  const label = getLabel(value);
  const indicators = data.current?.indicators || [];
  const isFallback = data.isFallback === true;

  // Historical reference points
  const yesterday = data.historical?.yesterday;
  const weekAgo = data.historical?.weekAgo;
  const monthAgo = data.historical?.monthAgo;
  const yearAgo = data.historical?.yearAgo;
  const minYear = data.yearMin ?? value;
  const maxYear = data.yearMax ?? value;

  // Chart data slice — filter out entries with invalid values
  const allHistory = (data.history || []).filter(h => h && typeof h.value === "number" && !isNaN(h.value));
  const sliceDays = RANGES.find(r => r.key === range)?.days ?? 365;
  const chartSlice = allHistory.slice(-sliceDays);
  const chartData = chartSlice.map(h => h.value);
  const chartDates = chartSlice.map(h => h.date || "");

  // Mouse interaction
  const handleMouseMove = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg || chartData.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const idx = Math.round(ratio * (chartData.length - 1));
    setHover({ index: idx, ratioX: ratio, value: chartData[idx], date: chartDates[idx] });
  }, [chartData, chartDates]);

  const handleMouseLeave = useCallback(() => setHover(null), []);

  // Build SVG path points
  const pts = chartData.length > 1
    ? chartData.map((v, i) => `${toX(i, chartData.length).toFixed(1)},${toY(v).toFixed(1)}`).join(" ")
    : "";
  const firstX = chartData.length > 1 ? toX(0, chartData.length).toFixed(1) : "0";
  const lastXv = chartData.length > 1 ? toX(chartData.length - 1, chartData.length).toFixed(1) : "0";
  const bottomY = (CH - PAD.b).toFixed(1);

  // X-axis date labels
  const xLabelCount = isMobile ? 3 : 5;
  const xLabelIndices = chartData.length > 1
    ? Array.from({ length: xLabelCount }, (_, i) => Math.round(i * (chartData.length - 1) / (xLabelCount - 1)))
    : [];

  // Gauge
  const cx = 130, cy = 115, R = 90;
  const angle = animated ? (value / 100) * 180 - 90 : -90;
  const fillDeg = Math.min(Math.max((value / 100) * 180, 1), 179);
  const arcD = (deg1, deg2) => {
    const toRad = (d) => ((d - 180) * Math.PI) / 180;
    const x1 = cx + R * Math.cos(toRad(deg1)), y1 = cy + R * Math.sin(toRad(deg1));
    const x2 = cx + R * Math.cos(toRad(deg2)), y2 = cy + R * Math.sin(toRad(deg2));
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${deg2 - deg1 >= 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  };

  // Zone bands for chart background
  const zoneBands = [
    { from: 75, to: 100, color: "#15803d18" },
    { from: 55, to: 75,  color: "#16a34a12" },
    { from: 45, to: 55,  color: "#ca8a0412" },
    { from: 25, to: 45,  color: "#ea580c12" },
    { from: 0,  to: 25,  color: "#dc262614" },
  ];

  // Tooltip x position clamping
  const getTooltipLeft = () => {
    if (!hover || !containerRef.current) return 0;
    const cw = containerRef.current.getBoundingClientRect().width;
    const raw = hover.ratioX * cw + 12;
    return Math.min(raw, cw - 148);
  };

  // Update timestamp
  const updatedAt = data.current?.updatedAt;
  const updatedStr = updatedAt
    ? new Date(updatedAt).toLocaleString("pl-PL", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div style={{ minHeight: "100vh", background: theme.bgPage, color: theme.text, fontFamily: "var(--font-ui)" }}>
      {/* Header */}
      <div style={{
        background: theme.bgCard,
        borderBottom: `1px solid ${theme.border}`,
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: `1px solid ${theme.border}`,
            color: theme.text,
            borderRadius: 8,
            padding: "6px 14px",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "inherit",
          }}
        >
          <Icon name="arrow-left" size={14} /> Powrót
        </button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: theme.textBright }}>GPW Fear & Greed Index</div>
          <div style={{ fontSize: 11, color: theme.textSecondary }}>
            Wskaźnik sentymentu rynku Giełdy Papierów Wartościowych
            {updatedStr && !isFallback && (
              <span style={{ marginLeft: 8, opacity: 0.7 }}>
                Aktualizacja: {updatedStr}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: isMobile ? "16px 14px" : "28px 32px" }}>

        {/* Hero row: gauge left + chart right */}
        <div style={{
          display: isMobile ? "block" : "flex",
          gap: 20,
          marginBottom: 20,
          alignItems: "stretch",
        }}>

          {/* LEFT: gauge + stats */}
          <div style={{
            width: isMobile ? "100%" : 290,
            flexShrink: 0,
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            padding: isMobile ? "20px 16px" : "24px 20px",
            marginBottom: isMobile ? 16 : 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
            {/* Gauge SVG */}
            <svg width={isMobile ? 220 : 260} height={isMobile ? 120 : 140} viewBox="0 0 260 140" style={{ display: "block" }}>
              <path d={arcD(0, 180)} fill="none" stroke={theme.bgCardAlt ?? theme.border} strokeWidth="10" strokeLinecap="butt" />
              <path d={arcD(0, fillDeg)} fill="none" stroke={color} strokeWidth="10" strokeLinecap="butt" />
              <g
                transform={`rotate(${angle}, ${cx}, ${cy})`}
                style={{ transition: animated ? "transform 0.9s cubic-bezier(0.22,0.61,0.36,1)" : "none" }}
              >
                <line x1={cx} y1={cy} x2={cx} y2={cy - 77} stroke={theme.textBright} strokeWidth="2" strokeLinecap="round" opacity="0.75" />
              </g>
              <circle cx={cx} cy={cy} r="5" fill={theme.bgCard} stroke={theme.border} strokeWidth="2" />
              <text x="14" y="136" fill={theme.textSecondary} fontSize="9" textAnchor="middle" opacity="0.6" fontFamily="inherit">Panika</text>
              <text x="246" y="136" fill={theme.textSecondary} fontSize="9" textAnchor="middle" opacity="0.6" fontFamily="inherit">Chciwość</text>
              <text x={cx} y="14" fill={theme.textSecondary} fontSize="8" textAnchor="middle" opacity="0.45" fontFamily="inherit">50 — Neutralny</text>
            </svg>

            {/* Current value */}
            <div style={{ textAlign: "center", marginTop: -4 }}>
              <div style={{ fontSize: 56, fontWeight: 800, color, lineHeight: 1, letterSpacing: -2 }}>{value}</div>
              <div style={{ fontSize: 17, color, fontWeight: 700, marginTop: 4 }}>{label}</div>
              {!isFallback && data.current?.indicatorsUsed != null && data.current.indicatorsUsed < 7 && (
                <div style={{ fontSize: 9, color: theme.textMuted, marginTop: 4 }}>
                  Obliczono z {data.current.indicatorsUsed}/7 wskaźników
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ width: "100%", borderTop: `1px solid ${theme.border}`, margin: "18px 0 14px" }} />

            {/* Historical values */}
            <div style={{ width: "100%", fontSize: 12 }}>
              <div style={{ fontWeight: 700, color: theme.textSecondary, fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 10 }}>
                Wartości historyczne
              </div>
              {[
                { lbl: "Wczoraj",     val: yesterday },
                { lbl: "Tydzień temu", val: weekAgo },
                { lbl: "Miesiąc temu", val: monthAgo },
                { lbl: "Rok temu",     val: yearAgo },
              ].map(({ lbl, val }) => (
                <div key={lbl} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: `1px solid ${theme.border}` }}>
                  <span style={{ color: theme.textSecondary }}>{lbl}</span>
                  {val != null ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, color: getColor(val), fontSize: 15 }}>{val}</span>
                      <span style={{ fontSize: 10, color: getColor(val), fontWeight: 600, minWidth: 90, textAlign: "right" }}>{getLabel(val)}</span>
                    </span>
                  ) : (
                    <span style={{ color: theme.textMuted, fontSize: 12 }}>b.d.</span>
                  )}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ width: "100%", borderTop: `1px solid ${theme.border}`, margin: "14px 0 10px" }} />

            {/* Yearly high/low */}
            <div style={{ width: "100%", fontSize: 12 }}>
              <div style={{ fontWeight: 700, color: theme.textSecondary, fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 10 }}>
                Minimum i maksimum roczne
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 3 }}>Min</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: getColor(minYear) }}>{minYear}</div>
                  <div style={{ fontSize: 10, color: getColor(minYear), fontWeight: 600 }}>{getLabel(minYear)}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 3 }}>Max</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: getColor(maxYear) }}>{maxYear}</div>
                  <div style={{ fontSize: 10, color: getColor(maxYear), fontWeight: 600 }}>{getLabel(maxYear)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: interactive chart */}
          <div style={{
            flex: 1,
            minWidth: 0,
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            padding: isMobile ? "16px 12px" : "20px 24px",
            display: "flex",
            flexDirection: "column",
          }}>
            {/* Chart header: title + period selector */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.textBright }}>Historia indeksu</div>
                {hover ? (
                  <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                    {formatDate(hover.date)} —{" "}
                    <span style={{ color: getColor(hover.value), fontWeight: 700 }}>{hover.value}</span>
                    {" "}
                    <span style={{ color: getColor(hover.value) }}>{getLabel(hover.value)}</span>
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                    Najedź na wykres, aby zobaczyć wartość
                  </div>
                )}
              </div>
              {/* Period tabs */}
              <div style={{ display: "flex", gap: 4, background: theme.bgCardAlt ?? theme.border, borderRadius: 8, padding: 3 }}>
                {RANGES.map(r => (
                  <button
                    key={r.key}
                    onClick={() => setRange(r.key)}
                    style={{
                      background: range === r.key ? theme.bgCard : "transparent",
                      border: "none",
                      borderRadius: 6,
                      padding: "5px 13px",
                      fontSize: 12,
                      fontWeight: range === r.key ? 700 : 500,
                      color: range === r.key ? theme.textBright : theme.textSecondary,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "background 0.15s",
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG chart with hover */}
            <div style={{ flex: 1, position: "relative", minHeight: isMobile ? 180 : 240 }}
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {chartData.length > 1 ? (
                <svg
                  ref={svgRef}
                  width="100%"
                  height="100%"
                  viewBox={`0 0 ${CW} ${CH}`}
                  preserveAspectRatio="none"
                  style={{ display: "block", cursor: "crosshair" }}
                >
                  <defs>
                    <linearGradient id="fgYearGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* Zone bands */}
                  {zoneBands.map(z => {
                    const y1 = toY(z.to).toFixed(1);
                    const y2 = toY(z.from).toFixed(1);
                    return (
                      <rect
                        key={z.from}
                        x={PAD.l}
                        y={y1}
                        width={CW - PAD.l - PAD.r}
                        height={Number(y2) - Number(y1)}
                        fill={z.color}
                      />
                    );
                  })}

                  {/* Horizontal gridlines + Y labels */}
                  {[25, 50, 75].map(gv => {
                    const gy = toY(gv).toFixed(1);
                    return (
                      <g key={gv}>
                        <line x1={PAD.l} y1={gy} x2={CW - PAD.r} y2={gy} stroke={theme.border} strokeWidth="0.8" strokeDasharray="4 4" opacity="0.6" />
                        <text x={PAD.l - 6} y={Number(gy) + 3.5} fill={theme.textSecondary} fontSize="10" textAnchor="end" fontFamily="inherit" opacity="0.7">{gv}</text>
                      </g>
                    );
                  })}

                  {/* Area fill */}
                  <polygon
                    points={`${firstX},${bottomY} ${pts} ${lastXv},${bottomY}`}
                    fill="url(#fgYearGrad)"
                  />

                  {/* Main line */}
                  <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />

                  {/* X-axis date labels */}
                  {xLabelIndices.map(idx => {
                    const x = toX(idx, chartData.length).toFixed(1);
                    const dStr = chartDates[idx] ? chartDates[idx].slice(8, 10) + "." + chartDates[idx].slice(5, 7) : "";
                    return (
                      <text
                        key={idx}
                        x={x}
                        y={CH - 4}
                        fill={theme.textSecondary}
                        fontSize="9"
                        textAnchor={idx === 0 ? "start" : idx === chartData.length - 1 ? "end" : "middle"}
                        fontFamily="inherit"
                        opacity="0.7"
                      >
                        {dStr}
                      </text>
                    );
                  })}

                  {/* Hover: vertical cursor line + dot */}
                  {hover && (
                    <>
                      <line
                        x1={toX(hover.index, chartData.length)}
                        y1={PAD.t}
                        x2={toX(hover.index, chartData.length)}
                        y2={CH - PAD.b}
                        stroke={theme.textSecondary}
                        strokeWidth="1"
                        strokeDasharray="4 3"
                        opacity="0.6"
                      />
                      <circle
                        cx={toX(hover.index, chartData.length)}
                        cy={toY(hover.value)}
                        r="4"
                        fill={getColor(hover.value)}
                        stroke={theme.bgCard}
                        strokeWidth="2"
                      />
                    </>
                  )}
                </svg>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: theme.textMuted, fontSize: 13 }}>
                  Za mało danych do wyświetlenia wykresu
                </div>
              )}

              {/* Hover tooltip */}
              {hover && (
                <div style={{
                  position: "absolute",
                  left: getTooltipLeft(),
                  top: 8,
                  background: theme.bgCard,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 8,
                  padding: "8px 12px",
                  pointerEvents: "none",
                  zIndex: 10,
                  minWidth: 136,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                }}>
                  <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 3 }}>
                    {formatDate(hover.date)}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: getColor(hover.value), lineHeight: 1 }}>
                    {hover.value}
                  </div>
                  <div style={{ fontSize: 11, color: getColor(hover.value), fontWeight: 600, marginTop: 2 }}>
                    {getLabel(hover.value)}
                  </div>
                </div>
              )}
            </div>

            {/* Zone legend */}
            <div style={{ display: "flex", gap: isMobile ? 8 : 14, marginTop: 14, flexWrap: "wrap", justifyContent: "center" }}>
              {[
                { label: "Skrajna panika", color: "#dc2626" },
                { label: "Strach",         color: "#ea580c" },
                { label: "Neutralny",      color: "#ca8a04" },
                { label: "Chciwość",       color: "#16a34a" },
                { label: "Ekstr. chciwość",color: "#15803d" },
              ].map(z => (
                <div key={z.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: theme.textSecondary }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: z.color, flexShrink: 0 }} />
                  {z.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Component breakdown */}
        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? "16px 12px" : "24px 24px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: theme.textBright }}>Składowe indeksu</div>
            {!isFallback && data.current?.indicatorsUsed != null && (
              <div style={{ fontSize: 10, color: theme.textMuted }}>
                {data.current.indicatorsUsed}/7 aktywnych wskaźników
              </div>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
            {indicators.filter(f => f && f.name).map((f) => {
              const fv = typeof f.value === "number" ? f.value : 50;
              const fc = getColor(fv);
              const fl = getLabel(fv);
              return (
                <div key={f.name} style={{ background: theme.bgCardAlt ?? theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: theme.textBright, lineHeight: 1.3 }}>{f.name}</div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: fc, lineHeight: 1 }}>{fv}</div>
                      <div style={{ fontSize: 10, color: fc, fontWeight: 600 }}>{fl}</div>
                    </div>
                  </div>
                  <div style={{ background: theme.border, borderRadius: 4, height: 6, marginBottom: 8, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, Math.max(0, fv))}%`, height: "100%", background: fc, borderRadius: 4, transition: "width 0.8s ease" }} />
                  </div>
                  {f.description && (
                    <div style={{ fontSize: 11, color: theme.textSecondary, lineHeight: 1.5 }}>{f.description}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Methodology */}
        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? "16px 12px" : "20px 24px", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.textBright, marginBottom: 8 }}>Metodologia</div>
          <p style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.7, margin: 0 }}>
            GPW Fear & Greed Index to syntetyczny wskaźnik sentymentu inwestorów na Giełdzie Papierów Wartościowych w Warszawie.
            Obliczany jest jako ważona średnia siedmiu składowych: momentum rynku (20%), szerokości rynku (20%),
            zmienności rynku (15%), nowych szczytów vs dołków (15%), siły wolumenu (10%),
            małe vs duże spółki (10%) oraz popytu na bezpieczne aktywa (10%).
            Wartości w przedziale 0–24 oznaczają skrajną panikę, 25–44 strach, 45–54 neutralność,
            55–74 chciwość, a 75–100 skrajną chciwość. Dane rynkowe pobierane z Yahoo Finance i Stooq.pl,
            obliczenia wykonywane codziennie po zamknięciu sesji GPW.
          </p>
        </div>

        {/* Disclaimer */}
        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? "14px 12px" : "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
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

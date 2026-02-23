import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchHistory, fetchIndices, fetchBulk, fetchStooq } from "../lib/api.js";
import { INDICES_BY_SLUG, INDEX_SLUGS_ORDERED, PL_INDEX_NAMES } from "../data/indices-meta.js";
import { GPW_COMPANIES } from "../data/gpw-companies.js";
import LargeChart from "../components/LargeChart.jsx";

// ── Formatters ─────────────────────────────────────────────────────

const fmtVal = v =>
  v != null
    ? v.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "—";

const fmtChange = v =>
  v != null ? `${v >= 0 ? "+" : ""}${v.toFixed(2)}%` : null;

const fmtPrice = v => v != null
  ? v.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " zł"
  : "b.d.";

const fmtLargeNum = v => {
  if (v == null) return "b.d.";
  if (v >= 1e9) return `${(v / 1e9).toLocaleString("pl-PL", { maximumFractionDigits: 1 })} mld`;
  if (v >= 1e6) return `${(v / 1e6).toLocaleString("pl-PL", { maximumFractionDigits: 1 })} mln`;
  if (v >= 1e3) return `${(v / 1e3).toLocaleString("pl-PL", { maximumFractionDigits: 0 })} tys.`;
  return v.toLocaleString("pl-PL");
};

// ── LIVE badge ─────────────────────────────────────────────────────

function LiveBadge() {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontSize: 10, fontWeight: 700, color: "#22c55e",
      background: "rgba(34,197,94,0.1)", padding: "2px 8px",
      borderRadius: 5, fontFamily: "var(--font-mono)",
      letterSpacing: "0.06em", textTransform: "uppercase",
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: "#22c55e", boxShadow: "0 0 6px #22c55e",
        animation: "livePulse 1.5s ease-in-out infinite",
      }} />
      LIVE
    </span>
  );
}

// ── Period buttons for chart ───────────────────────────────────────

const PERIODS = [
  { label: "1D", interval: "intraday", stooqInterval: undefined },
  { label: "5D", interval: "1h", stooqInterval: "1h" },
  { label: "1M", interval: "1d", range: 30 },
  { label: "3M", interval: "1d", range: 90 },
  { label: "6M", interval: "1d", range: 180 },
  { label: "1R", interval: "1d", range: 365 },
];

// ── Key data row ───────────────────────────────────────────────────

function DataRow({ label, value, theme }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 0", borderBottom: `1px solid ${theme.border}`,
    }}>
      <span style={{ fontSize: 13, color: theme.textSecondary, fontFamily: "var(--font-ui)" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: theme.textBright, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────

export default function IndexDetailPage({ theme, liveStocks, prices, changes }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const meta = INDICES_BY_SLUG[slug];

  const [indexData, setIndexData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [period, setPeriod] = useState("1R");
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Prev / Next navigation
  const currentIdx = INDEX_SLUGS_ORDERED.indexOf(slug);
  const prevSlug = currentIdx > 0 ? INDEX_SLUGS_ORDERED[currentIdx - 1] : null;
  const nextSlug = currentIdx < INDEX_SLUGS_ORDERED.length - 1 ? INDEX_SLUGS_ORDERED[currentIdx + 1] : null;
  const prevMeta = prevSlug ? INDICES_BY_SLUG[prevSlug] : null;
  const nextMeta = nextSlug ? INDICES_BY_SLUG[nextSlug] : null;

  // Polish index composition
  const isPL = meta && PL_INDEX_NAMES.includes(meta.name);
  const composition = useMemo(() => {
    if (!isPL || !meta) return [];
    return GPW_COMPANIES.filter(c => c.index === meta.name);
  }, [isPL, meta]);

  // Load current index price
  const loadCurrentData = useCallback(async () => {
    if (!meta) return;

    // For GPW indices, use /api/indices
    if (meta.region === "Polska") {
      const data = await fetchIndices();
      const found = data.find(d => d.name === meta.name);
      if (found) {
        setIndexData(found);
        setLastUpdate(new Date().toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" }));
      }
    } else {
      // For world indices, use /api/stooq
      const data = await fetchStooq(meta.stooq);
      if (data?.close) {
        setIndexData({
          name: meta.name, value: data.close,
          change24h: data.change24h, change7d: data.change7d,
          sparkline: [],
        });
        setLastUpdate(new Date().toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" }));
      }
    }
  }, [meta]);

  // Load chart data
  const loadChart = useCallback(async () => {
    if (!meta) return;
    setLoading(true);

    const p = PERIODS.find(p => p.label === period);
    let data;

    if (p.interval === "intraday") {
      // Use intraday endpoint
      try {
        const res = await fetch(`/api/intraday?symbol=${meta.stooq}`);
        const json = await res.json();
        data = json?.prices;
      } catch { data = null; }
    } else if (p.interval === "1h") {
      try {
        const res = await fetch(`/api/history?symbol=${meta.stooq}&interval=1h`);
        const json = await res.json();
        data = json?.prices;
      } catch { data = null; }
    } else {
      const result = await fetchHistory(meta.stooq);
      if (result?.prices && p.range) {
        data = result.prices.slice(-p.range);
      } else {
        data = result?.prices;
      }
    }

    setChartData(data || null);
    setLoading(false);
  }, [meta, period]);

  // On mount + auto-refresh
  useEffect(() => {
    loadCurrentData();
    const interval = setInterval(loadCurrentData, 60_000);
    return () => clearInterval(interval);
  }, [loadCurrentData]);

  useEffect(() => { loadChart(); }, [loadChart]);

  // SEO
  useEffect(() => {
    if (!meta) return;
    const isPLIndex = meta.region === "Polska";
    document.title = `${meta.name} — kurs, wykres${isPLIndex && meta.name !== "WIG" ? ", skład indeksu" : ""} — WIGmarkets.pl`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute("content",
        isPLIndex
          ? `Aktualny kurs indeksu ${meta.name}, wykres${meta.components ? `, skład ${meta.components} spółek GPW` : ""}. Śledź ${meta.name === "WIG20" ? "główny" : ""} indeks polskiej giełdy w czasie rzeczywistym.`
          : `Aktualny kurs indeksu ${meta.name}, wykres i zmiana. Śledź ${meta.fullName} w czasie rzeczywistym.`
      );
    }
  }, [meta]);

  if (!meta) {
    return (
      <div style={{ textAlign: "center", padding: 100, color: theme.textSecondary }}>
        Nie znaleziono indeksu. <Link to="/indeksy" style={{ color: theme.accent }}>Powrót do listy</Link>
      </div>
    );
  }

  const ch24 = indexData?.change24h;
  const c24 = ch24 == null ? theme.textSecondary : ch24 >= 0 ? "#22c55e" : "#ef4444";
  const chartColor = ch24 == null ? "#3b82f6" : ch24 >= 0 ? "#22c55e" : "#ef4444";

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "16px 12px 40px" : "24px 24px 64px" }}>
      <style>{`
        @keyframes livePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 16, fontFamily: "var(--font-ui)" }}>
        <Link to="/indeksy" style={{ color: theme.textSecondary, textDecoration: "none" }}
          onMouseEnter={e => e.currentTarget.style.color = theme.accent}
          onMouseLeave={e => e.currentTarget.style.color = theme.textSecondary}
        >Indeksy</Link>
        <span style={{ margin: "0 8px", opacity: 0.4 }}>/</span>
        <span style={{ color: theme.textBright, fontWeight: 600 }}>{meta.name}</span>
      </div>

      {/* Header + Chart + Sidebar */}
      <div style={{
        display: isMobile ? "block" : "grid",
        gridTemplateColumns: "1fr 300px",
        gap: 24, marginBottom: 32,
      }}>
        {/* Left: Header + Chart */}
        <div>
          {/* Name + value */}
          <div style={{
            background: theme.bgCard, border: `1px solid ${theme.border}`,
            borderRadius: 12, padding: isMobile ? "20px 16px" : "28px 32px",
            marginBottom: 24,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: meta.color, fontFamily: "var(--font-ui)" }}>
                {meta.fullName}
              </span>
              <LiveBadge />
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
              <div style={{
                fontSize: isMobile ? 28 : 36, fontWeight: 800,
                color: theme.textBright, fontFamily: "var(--font-mono)",
                fontVariantNumeric: "tabular-nums", lineHeight: 1.1,
              }}>
                {indexData ? fmtVal(indexData.value) : "—"}
              </div>
              {ch24 != null && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "4px 12px", borderRadius: 8,
                  fontSize: isMobile ? 14 : 16, fontWeight: 700,
                  background: ch24 >= 0 ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                  color: c24, fontFamily: "var(--font-mono)",
                }}>
                  {ch24 >= 0 ? "\u25B2" : "\u25BC"} {fmtChange(ch24)}
                </div>
              )}
            </div>
            {lastUpdate && (
              <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 8, fontFamily: "var(--font-ui)" }}>
                Ostatnia aktualizacja: {lastUpdate}
              </div>
            )}
          </div>

          {/* Chart */}
          <div style={{
            background: theme.bgCard, border: `1px solid ${theme.border}`,
            borderRadius: 12, padding: isMobile ? "16px 12px" : "24px 28px",
          }}>
            {/* Period buttons */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {PERIODS.map(p => (
                <button
                  key={p.label}
                  onClick={() => setPeriod(p.label)}
                  style={{
                    background: period === p.label ? `${meta.color}20` : "transparent",
                    border: `1px solid ${period === p.label ? meta.color : theme.border}`,
                    color: period === p.label ? meta.color : theme.textSecondary,
                    borderRadius: 6, padding: "5px 12px",
                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                    fontFamily: "var(--font-mono)", transition: "all 0.15s",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {loading || !chartData ? (
              <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: theme.textSecondary, fontSize: 13 }}>
                {loading ? "Ładowanie wykresu..." : "Brak danych dla wybranego okresu"}
              </div>
            ) : (
              <div style={{ minHeight: 300 }}>
                <LargeChart data={chartData} color={chartColor} theme={theme} type="line" unit="pkt" />
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar: Key data */}
        <div style={{
          background: theme.bgCard, border: `1px solid ${theme.border}`,
          borderRadius: 12, padding: isMobile ? "16px" : "24px",
          alignSelf: "start", marginTop: isMobile ? 24 : 0,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: theme.textSecondary,
            marginBottom: 14, fontFamily: "var(--font-ui)",
          }}>
            Kluczowe dane
          </div>

          {indexData?.change24h != null && <DataRow label="Zmiana 24h" value={fmtChange(indexData.change24h)} theme={theme} />}
          {indexData?.change7d != null && <DataRow label="Zmiana 7d" value={fmtChange(indexData.change7d)} theme={theme} />}
          {meta.components && <DataRow label="Liczba spółek" value={meta.components} theme={theme} />}
          <DataRow label="Kraj" value={meta.country === "PL" ? "Polska" : meta.country === "US" ? "USA" : meta.country === "DE" ? "Niemcy" : meta.country === "GB" ? "Wielka Brytania" : meta.country === "FR" ? "Francja" : meta.country === "JP" ? "Japonia" : meta.country === "HK" ? "Hongkong" : meta.country} theme={theme} />
          <DataRow label="Data bazowa" value={meta.baseDate} theme={theme} />
          <DataRow label="Wartość bazowa" value={meta.baseValue} theme={theme} />

          {/* Related indices */}
          {meta.relatedSlugs?.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", color: theme.textSecondary,
                marginBottom: 10, fontFamily: "var(--font-ui)",
              }}>
                Powiązane indeksy
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {meta.relatedSlugs.map(rs => {
                  const rm = INDICES_BY_SLUG[rs];
                  if (!rm) return null;
                  return (
                    <Link
                      key={rs} to={`/indeksy/${rs}`}
                      style={{
                        display: "inline-block", padding: "4px 12px", borderRadius: 6,
                        fontSize: 12, fontWeight: 600, color: theme.accent,
                        background: `${theme.accent}12`, textDecoration: "none",
                        border: `1px solid ${theme.accent}30`,
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = `${theme.accent}25`}
                      onMouseLeave={e => e.currentTarget.style.background = `${theme.accent}12`}
                    >
                      {rm.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Composition table (PL indices only) */}
      {isPL && composition.length > 0 && (
        <div style={{
          background: theme.bgCard, border: `1px solid ${theme.border}`,
          borderRadius: 12, padding: isMobile ? "16px 12px" : "24px 28px",
          marginBottom: 32,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: theme.textSecondary,
              fontFamily: "var(--font-ui)",
            }}>
              Skład indeksu
            </div>
            <span style={{ fontSize: 12, color: theme.textMuted, fontFamily: "var(--font-mono)" }}>
              {composition.length} spółek
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <th style={{ textAlign: "left", padding: "8px 8px 8px 0", fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-ui)" }}>#</th>
                  <th style={{ textAlign: "left", padding: 8, fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-ui)" }}>Spółka</th>
                  <th style={{ textAlign: "right", padding: 8, fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-ui)" }}>Kurs</th>
                  <th style={{ textAlign: "right", padding: "8px 0 8px 8px", fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-ui)" }}>Zmiana 24h</th>
                </tr>
              </thead>
              <tbody>
                {composition.map((comp, i) => {
                  const price = prices?.[comp.ticker];
                  const ch = changes?.[comp.ticker]?.change24h;
                  const chColor = ch == null ? theme.textMuted : ch >= 0 ? "#22c55e" : "#ef4444";

                  return (
                    <tr
                      key={comp.ticker}
                      onClick={() => navigate(`/spolka/${comp.ticker}`)}
                      style={{
                        borderBottom: `1px solid ${theme.border}`,
                        cursor: "pointer", transition: "background 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = theme.bgElevated || "rgba(255,255,255,0.03)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "12px 8px 12px 0", color: theme.textMuted, fontFamily: "var(--font-mono)", fontSize: 12 }}>{i + 1}</td>
                      <td style={{ padding: "12px 8px" }}>
                        <div style={{ fontWeight: 600, color: theme.textBright, fontFamily: "var(--font-ui)" }}>{comp.ticker}</div>
                        <div style={{ fontSize: 11, color: theme.textSecondary, fontFamily: "var(--font-ui)", marginTop: 1 }}>{comp.name}</div>
                      </td>
                      <td style={{ padding: "12px 8px", textAlign: "right", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", color: theme.textBright, fontWeight: 500 }}>
                        {price ? fmtPrice(price) : "b.d."}
                      </td>
                      <td style={{ padding: "12px 0 12px 8px", textAlign: "right", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", fontWeight: 600, color: chColor }}>
                        {ch != null ? `${ch >= 0 ? "+" : ""}${ch.toFixed(2)}%` : "b.d."}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* About section */}
      <div style={{
        background: theme.bgCard, border: `1px solid ${theme.border}`,
        borderRadius: 12, padding: isMobile ? "20px 16px" : "28px 32px",
        marginBottom: 32,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: theme.textSecondary,
          marginBottom: 16, fontFamily: "var(--font-ui)",
        }}>
          O indeksie {meta.name}
        </div>
        {meta.description.map((para, i) => (
          <p key={i} style={{
            fontSize: 14, lineHeight: 1.7, color: theme.textSecondary,
            fontFamily: "var(--font-ui)", marginBottom: i < meta.description.length - 1 ? 14 : 0,
          }}>
            {para}
          </p>
        ))}

        {meta.relatedSlugs?.length > 0 && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${theme.border}` }}>
            <span style={{ fontSize: 12, color: theme.textMuted, fontFamily: "var(--font-ui)", marginRight: 8 }}>Powiązane:</span>
            {meta.relatedSlugs.map((rs, i) => {
              const rm = INDICES_BY_SLUG[rs];
              if (!rm) return null;
              return (
                <span key={rs}>
                  <Link to={`/indeksy/${rs}`} style={{ fontSize: 13, color: theme.accent, textDecoration: "none", fontFamily: "var(--font-ui)", fontWeight: 500 }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                  >{rm.name}</Link>
                  {i < meta.relatedSlugs.length - 1 && <span style={{ color: theme.textMuted, margin: "0 8px" }}>·</span>}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Prev/Next navigation */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        gap: 16, flexWrap: "wrap",
      }}>
        {prevMeta ? (
          <Link to={`/indeksy/${prevSlug}`} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "12px 20px", borderRadius: 10,
            background: theme.bgCard, border: `1px solid ${theme.border}`,
            textDecoration: "none", transition: "border-color 0.15s",
            flex: 1, maxWidth: 280,
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = theme.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = theme.border}
          >
            <span style={{ fontSize: 18, color: theme.textMuted }}>&larr;</span>
            <div>
              <div style={{ fontSize: 10, color: theme.textMuted, fontFamily: "var(--font-ui)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Poprzedni</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: theme.textBright, fontFamily: "var(--font-ui)" }}>{prevMeta.name}</div>
            </div>
          </Link>
        ) : <div />}
        {nextMeta ? (
          <Link to={`/indeksy/${nextSlug}`} style={{
            display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8,
            padding: "12px 20px", borderRadius: 10,
            background: theme.bgCard, border: `1px solid ${theme.border}`,
            textDecoration: "none", transition: "border-color 0.15s",
            flex: 1, maxWidth: 280, textAlign: "right",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = theme.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = theme.border}
          >
            <div>
              <div style={{ fontSize: 10, color: theme.textMuted, fontFamily: "var(--font-ui)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Następny</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: theme.textBright, fontFamily: "var(--font-ui)" }}>{nextMeta.name}</div>
            </div>
            <span style={{ fontSize: 18, color: theme.textMuted }}>&rarr;</span>
          </Link>
        ) : <div />}
      </div>

      {/* Disclaimer */}
      <p style={{ fontSize: 11, color: theme.textMuted, fontFamily: "var(--font-ui)", marginTop: 32, textAlign: "center", fontStyle: "italic" }}>
        Dane mają charakter informacyjny. Nie stanowią rekomendacji inwestycyjnej.
      </p>

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            "name": meta.name,
            "description": meta.description[0],
            "url": `https://wigmarkets.pl/indeksy/${slug}`,
          }),
        }}
      />
    </div>
  );
}

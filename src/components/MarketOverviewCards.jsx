import { useState, useEffect, useMemo, useRef } from "react";
import { fetchHistory } from "../api.js";
import CompanyMonogram from "./CompanyMonogram.jsx";
import Icon from "./edukacja/Icon.jsx";

const fmtIdx = v =>
  v != null ? v.toLocaleString("pl-PL", { maximumFractionDigits: 2 }) : "—";

const fmtIdxChange = v =>
  v != null ? `${v >= 0 ? "+" : ""}${v.toFixed(2)}%` : "—";

const fmt2 = v =>
  v != null
    ? v.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "—";

// Mini sparkline z gradientem fill + animacją rysowania linii od lewej
function IndexSparkline({ prices, trend, height = 32, gradId }) {
  const pathRef = useRef(null);
  const color = (trend ?? 0) >= 0 ? "#22c55e" : "#ef4444";

  const { linePath, areaPath } = useMemo(() => {
    if (!prices || prices.length < 2) return { linePath: "", areaPath: "" };
    const vals = prices.slice(-30).map(p => p.close).filter(v => v != null && !isNaN(v));
    if (vals.length < 2) return { linePath: "", areaPath: "" };
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const n = vals.length;
    const pts = vals.map((v, i) => [
      (i / (n - 1)) * 100,
      95 - ((v - min) / range) * 85,
    ]);
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");
    const area = `${line} L100,100 L0,100 Z`;
    return { linePath: line, areaPath: area };
  }, [prices]);

  // Animacja stroke-dasharray — linia rysuje się od lewej do prawej
  useEffect(() => {
    const el = pathRef.current;
    if (!el || !linePath) return;
    const len = el.getTotalLength();
    el.style.transition = "none";
    el.style.strokeDasharray = `${len}`;
    el.style.strokeDashoffset = `${len}`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (el) {
          el.style.transition = "stroke-dashoffset 800ms ease-out";
          el.style.strokeDashoffset = "0";
        }
      });
    });
  }, [linePath]);

  return (
    <div style={{ height, marginTop: 8, width: "100%" }}>
      {linePath ? (
        <svg
          width="100%"
          height={height}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ display: "block" }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={color} stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradId})`} />
          <path
            ref={pathRef}
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity="0.9"
          />
        </svg>
      ) : null}
    </div>
  );
}

/**
 * MarketOverviewCards — rząd 4 kompaktowych kart Market Overview Dashboard.
 * Desktop: grid 4 kolumny (minmax(0, 1fr)). Mobile: 2×2.
 */
export default function MarketOverviewCards({
  indices, topGainers, topLosers,
  changes, prices,
  navigateToStock, navigateToFearGreed,
  theme, isMobile,
}) {
  const [wig20History, setWig20History] = useState(null);
  const [wigHistory,   setWigHistory]   = useState(null);

  useEffect(() => {
    fetchHistory("wig20").then(d => setWig20History(d?.prices || null));
    fetchHistory("wig").then(d => setWigHistory(d?.prices || null));
  }, []);

  const wig20 = indices.find(i => i.name === "WIG20") ?? null;
  const wig   = indices.find(i => i.name === "WIG")   ?? null;
  const topG  = topGainers[0] ?? null;
  const topL  = topLosers[0]  ?? null;

  // Bug 2 fix: minmax(0, 1fr) garantuje równe kolumny niezależnie od treści
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, minmax(0, 1fr))",
    gap: isMobile ? 8 : 12,
  };

  function card(accentColor) {
    return {
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderTop: `2px solid ${accentColor}`,
      borderRadius: 12,
      padding: isMobile ? "12px 14px" : "16px 20px",
      cursor: "pointer",
      transition: "border-color 150ms ease, background 150ms ease",
      animation: "ovCardIn 0.35s ease both",
      overflow: "hidden",    // Bug 2 fix: uniemożliwia rozszerzenie poza 1fr
      minWidth: 0,           // Bug 2 fix: dodatkowe zabezpieczenie w grid
    };
  }

  const hover = {
    onMouseEnter: e => {
      e.currentTarget.style.borderLeftColor   = "rgba(255,255,255,0.2)";
      e.currentTarget.style.borderRightColor  = "rgba(255,255,255,0.2)";
      e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.2)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderLeftColor   = theme.border;
      e.currentTarget.style.borderRightColor  = theme.border;
      e.currentTarget.style.borderBottomColor = theme.border;
    },
  };

  const labelStyle = {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: theme.textSecondary,
    fontWeight: 600,
    fontFamily: "var(--font-ui)",
    marginBottom: 5,
    display: "flex",
    alignItems: "center",
    gap: 4,
  };

  const idxValueStyle = {
    fontSize: isMobile ? 16 : 20,
    fontWeight: 700,
    color: theme.textBright,
    fontFamily: "var(--font-mono)",
    fontVariantNumeric: "tabular-nums",
    lineHeight: 1.1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  // Kolor akcentu dla borderu górnego
  const ACCENT_IDX  = "#3b82f6";  // niebieski dla indeksów
  const ACCENT_UP   = "#22c55e";  // zielony dla wzrostu
  const ACCENT_DOWN = "#ef4444";  // czerwony dla spadku

  return (
    <>
      <style>{`
        @keyframes ovCardIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={gridStyle}>

        {/* ── Karta 1: WIG20 ── */}
        <div
          style={{ ...card(ACCENT_IDX), animationDelay: "0ms" }}
          onClick={navigateToFearGreed}
          {...hover}
        >
          <div style={labelStyle}>WIG20</div>
          <div style={idxValueStyle}>{fmtIdx(wig20?.value)}</div>
          {/* Bug 1 fix: wyświetl zmianę tylko gdy jest wartość */}
          {wig20?.change24h != null && (
            <div style={{
              fontSize: 12, fontWeight: 500, marginTop: 2,
              color: wig20.change24h >= 0 ? "#22c55e" : "#ef4444",
              fontFamily: "var(--font-mono)",
            }}>
              {wig20.change24h >= 0 ? "▲" : "▼"} {fmtIdxChange(wig20.change24h)}
            </div>
          )}
          <IndexSparkline
            prices={wig20History}
            trend={wig20?.change24h ?? 0}
            height={isMobile ? 24 : 32}
            gradId="ovspWIG20"
          />
        </div>

        {/* ── Karta 2: WIG ── */}
        <div
          style={{ ...card(ACCENT_IDX), animationDelay: "50ms" }}
          onClick={navigateToFearGreed}
          {...hover}
        >
          <div style={labelStyle}>WIG</div>
          <div style={idxValueStyle}>{fmtIdx(wig?.value)}</div>
          {wig?.change24h != null && (
            <div style={{
              fontSize: 12, fontWeight: 500, marginTop: 2,
              color: wig.change24h >= 0 ? "#22c55e" : "#ef4444",
              fontFamily: "var(--font-mono)",
            }}>
              {wig.change24h >= 0 ? "▲" : "▼"} {fmtIdxChange(wig.change24h)}
            </div>
          )}
          <IndexSparkline
            prices={wigHistory}
            trend={wig?.change24h ?? 0}
            height={isMobile ? 24 : 32}
            gradId="ovspWIG"
          />
        </div>

        {/* ── Karta 3: Top Wzrost ── */}
        <div
          style={{ ...card(ACCENT_UP), animationDelay: "100ms" }}
          onClick={topG ? () => navigateToStock(topG) : undefined}
          {...hover}
        >
          <div style={labelStyle}>
            <Icon name="trending-up" size={11} /> Top wzrost
          </div>
          {topG ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, overflow: "hidden" }}>
                <CompanyMonogram ticker={topG.ticker} sector={topG.sector} size={28} />
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: isMobile ? 14 : 16, fontWeight: 700,
                    color: theme.textBright, fontFamily: "var(--font-ui)", lineHeight: 1.1,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{topG.ticker}</div>
                  <div style={{
                    fontSize: 9, color: theme.textSecondary,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{topG.name}</div>
                </div>
              </div>
              <div style={{
                fontSize: isMobile ? 18 : 22, fontWeight: 700,
                color: "#22c55e", fontFamily: "var(--font-mono)", lineHeight: 1,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                +{(changes[topG.ticker]?.change24h ?? 0).toFixed(2)}%
              </div>
              {/* Cena: mniejsza, przytłumiona — nie konkuruje z procentem */}
              <div style={{
                fontSize: 10, color: theme.textSecondary,
                fontFamily: "var(--font-mono)", marginTop: 3,
                fontVariantNumeric: "tabular-nums",
              }}>
                {fmt2(prices[topG.ticker])} {topG.unit || "zł"}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>Ładowanie…</div>
          )}
        </div>

        {/* ── Karta 4: Top Spadek ── */}
        <div
          style={{ ...card(ACCENT_DOWN), animationDelay: "150ms" }}
          onClick={topL ? () => navigateToStock(topL) : undefined}
          {...hover}
        >
          <div style={labelStyle}>
            <Icon name="trending-down" size={11} /> Top spadek
          </div>
          {topL ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, overflow: "hidden" }}>
                <CompanyMonogram ticker={topL.ticker} sector={topL.sector} size={28} />
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: isMobile ? 14 : 16, fontWeight: 700,
                    color: theme.textBright, fontFamily: "var(--font-ui)", lineHeight: 1.1,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{topL.ticker}</div>
                  <div style={{
                    fontSize: 9, color: theme.textSecondary,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{topL.name}</div>
                </div>
              </div>
              <div style={{
                fontSize: isMobile ? 18 : 22, fontWeight: 700,
                color: "#ef4444", fontFamily: "var(--font-mono)", lineHeight: 1,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {(changes[topL.ticker]?.change24h ?? 0).toFixed(2)}%
              </div>
              <div style={{
                fontSize: 10, color: theme.textSecondary,
                fontFamily: "var(--font-mono)", marginTop: 3,
                fontVariantNumeric: "tabular-nums",
              }}>
                {fmt2(prices[topL.ticker])} {topL.unit || "zł"}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>Ładowanie…</div>
          )}
        </div>

      </div>
    </>
  );
}

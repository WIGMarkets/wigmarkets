import { useMemo, useRef, useEffect } from "react";
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
    <div style={{ height, marginTop: 4, width: "100%" }}>
      {linePath ? (
        <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: "block" }}>
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

export default function MarketOverviewCards({
  indices, topGainers, topLosers,
  changes, prices,
  navigateToStock, navigateToFearGreed,
  theme, isMobile,
}) {
  const wig20 = indices.find(i => i.name === "WIG20") ?? null;
  const wig   = indices.find(i => i.name === "WIG")   ?? null;
  const top3G = topGainers.slice(0, 3);
  const top3L = topLosers.slice(0, 3);

  // Detect if changes data has actually loaded — when changes is empty,
  // topGainers/Losers all show change24h=0 and no prices (the "0.00% / — zł" bug).
  const changesLoaded = Object.keys(changes).length > 0
    && top3G.some(s => changes[s.ticker]?.change24h !== 0 || prices[s.ticker] != null);

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr",
    gap: isMobile ? 8 : 14,
  };

  const ACCENT_IDX  = "#3b82f6";
  const ACCENT_UP   = "#22c55e";
  const ACCENT_DOWN = "#ef4444";

  function card(accentColor, delay) {
    return {
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: 14,
      padding: isMobile ? "14px 14px" : "18px 22px",
      cursor: "pointer",
      transition: "border-color 200ms ease, box-shadow 200ms ease, transform 150ms ease",
      animation: "ovCardIn 0.35s ease both",
      animationDelay: `${delay}ms`,
      overflow: "hidden",
      minWidth: 0,
      position: "relative",
    };
  }

  function hover(accentColor) {
    return {
      onMouseEnter: e => {
        e.currentTarget.style.borderColor = accentColor + "66";
        e.currentTarget.style.boxShadow = `0 0 24px ${accentColor}15`;
        e.currentTarget.style.transform = "translateY(-2px)";
      },
      onMouseLeave: e => {
        e.currentTarget.style.borderColor = theme.border;
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
      },
    };
  }

  const labelStyle = {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: theme.textSecondary,
    fontWeight: 600,
    fontFamily: "var(--font-ui)",
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    gap: 5,
  };

  const idxValueStyle = {
    fontSize: isMobile ? 18 : 24,
    fontWeight: 700,
    color: theme.textBright,
    fontFamily: "var(--font-mono)",
    fontVariantNumeric: "tabular-nums",
    lineHeight: 1.1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const MoverRow = ({ s, i, isGainer }) => {
    const c24h = changes[s.ticker]?.change24h ?? 0;
    const color = isGainer ? ACCENT_UP : ACCENT_DOWN;
    return (
      <div
        onClick={e => { e.stopPropagation(); navigateToStock(s); }}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 0",
          borderBottom: i < 2 ? `1px solid ${theme.border}` : "none",
          cursor: "pointer",
          transition: "opacity 0.15s",
        }}
      >
        <span style={{
          fontSize: 10, fontWeight: 700, color: theme.textMuted,
          fontFamily: "var(--font-mono)", width: 16, textAlign: "center",
        }}>{i + 1}</span>
        <CompanyMonogram ticker={s.ticker} sector={s.sector} size={26} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 600, fontSize: 13, color: theme.textBright,
            fontFamily: "var(--font-ui)", lineHeight: 1.2,
          }}>{s.ticker}</div>
          <div style={{
            fontSize: 10, color: theme.textMuted,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{s.name}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color,
            fontFamily: "var(--font-mono)",
          }}>{isGainer ? "+" : ""}{c24h.toFixed(2)}%</div>
          <div style={{
            fontSize: 10, color: theme.textMuted,
            fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums",
          }}>{fmt2(prices[s.ticker])} zł</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes ovCardIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <div style={gridStyle}>

        {/* WIG20 + WIG combined card (wider) */}
        <div
          style={{
            ...card(ACCENT_IDX, 0),
            gridColumn: isMobile ? "1 / -1" : "auto",
          }}
          onClick={navigateToFearGreed}
          {...hover(ACCENT_IDX)}
        >
          {/* Subtle glow overlay */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, ${ACCENT_IDX}00, ${ACCENT_IDX}40, ${ACCENT_IDX}00)`,
            borderRadius: "14px 14px 0 0",
          }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 12 : 20 }}>
            {/* WIG20 */}
            <div>
              <div style={labelStyle}>WIG20</div>
              {wig20?.value != null ? (
                <>
                  <div style={idxValueStyle}>{fmtIdx(wig20.value)}</div>
                  {wig20.change24h != null && (
                    <div style={{
                      fontSize: 13, fontWeight: 600, marginTop: 4,
                      color: wig20.change24h >= 0 ? ACCENT_UP : ACCENT_DOWN,
                      fontFamily: "var(--font-mono)",
                      display: "flex", alignItems: "center", gap: 4,
                    }}>
                      <Icon name={wig20.change24h >= 0 ? "trending-up" : "trending-down"} size={14} />
                      {fmtIdxChange(wig20.change24h)}
                    </div>
                  )}
                  <IndexSparkline
                    prices={wig20.sparkline ?? null}
                    trend={wig20.change24h ?? 0}
                    height={isMobile ? 28 : 36}
                    gradId="ovspWIG20"
                  />
                </>
              ) : wig20 !== null ? (
                <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 8 }}>Dane chwilowo niedostępne</div>
              ) : (
                <>
                  <div style={{ height: isMobile ? 22 : 28, borderRadius: 6, background: theme.bgCardAlt, marginBottom: 4, animation: "pulse 1.8s ease-in-out infinite" }} />
                  <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 6 }}>Ładowanie danych...</div>
                </>
              )}
            </div>

            {/* WIG */}
            <div>
              <div style={labelStyle}>WIG</div>
              {wig?.value != null ? (
                <>
                  <div style={idxValueStyle}>{fmtIdx(wig.value)}</div>
                  {wig.change24h != null && (
                    <div style={{
                      fontSize: 13, fontWeight: 600, marginTop: 4,
                      color: wig.change24h >= 0 ? ACCENT_UP : ACCENT_DOWN,
                      fontFamily: "var(--font-mono)",
                      display: "flex", alignItems: "center", gap: 4,
                    }}>
                      <Icon name={wig.change24h >= 0 ? "trending-up" : "trending-down"} size={14} />
                      {fmtIdxChange(wig.change24h)}
                    </div>
                  )}
                  <IndexSparkline
                    prices={wig.sparkline ?? null}
                    trend={wig.change24h ?? 0}
                    height={isMobile ? 28 : 36}
                    gradId="ovspWIG"
                  />
                </>
              ) : wig !== null ? (
                <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 8 }}>Dane chwilowo niedostępne</div>
              ) : (
                <>
                  <div style={{ height: isMobile ? 22 : 28, borderRadius: 6, background: theme.bgCardAlt, marginBottom: 4, animation: "pulse 1.8s ease-in-out infinite" }} />
                  <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 6 }}>Ładowanie danych...</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Top Wzrost — top 3 */}
        <div style={card(ACCENT_UP, 80)} onClick={changesLoaded && top3G[0] ? () => navigateToStock(top3G[0]) : undefined} {...hover(ACCENT_UP)}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, ${ACCENT_UP}00, ${ACCENT_UP}40, ${ACCENT_UP}00)`,
            borderRadius: "14px 14px 0 0",
          }} />
          <div style={labelStyle}>
            <Icon name="trending-up" size={13} /> Top wzrost
          </div>
          {changesLoaded && top3G.length > 0 ? (
            top3G.map((s, i) => <MoverRow key={s.ticker} s={s} i={i} isGainer={true} />)
          ) : (
            [0, 1, 2].map(i => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? `1px solid ${theme.border}` : "none" }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: theme.bgCardAlt, animation: "pulse 1.8s ease-in-out infinite" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ width: 48, height: 12, borderRadius: 4, background: theme.bgCardAlt, marginBottom: 4, animation: "pulse 1.8s ease-in-out infinite" }} />
                  <div style={{ width: 80, height: 10, borderRadius: 4, background: theme.bgCardAlt, animation: "pulse 1.8s ease-in-out infinite", animationDelay: "0.2s" }} />
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ width: 52, height: 12, borderRadius: 4, background: theme.bgCardAlt, marginBottom: 4, marginLeft: "auto", animation: "pulse 1.8s ease-in-out infinite" }} />
                  <div style={{ width: 60, height: 10, borderRadius: 4, background: theme.bgCardAlt, marginLeft: "auto", animation: "pulse 1.8s ease-in-out infinite", animationDelay: "0.2s" }} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Top Spadek — top 3 */}
        <div style={card(ACCENT_DOWN, 140)} onClick={changesLoaded && top3L[0] ? () => navigateToStock(top3L[0]) : undefined} {...hover(ACCENT_DOWN)}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, ${ACCENT_DOWN}00, ${ACCENT_DOWN}40, ${ACCENT_DOWN}00)`,
            borderRadius: "14px 14px 0 0",
          }} />
          <div style={labelStyle}>
            <Icon name="trending-down" size={13} /> Top spadek
          </div>
          {changesLoaded && top3L.length > 0 ? (
            top3L.map((s, i) => <MoverRow key={s.ticker} s={s} i={i} isGainer={false} />)
          ) : (
            [0, 1, 2].map(i => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? `1px solid ${theme.border}` : "none" }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: theme.bgCardAlt, animation: "pulse 1.8s ease-in-out infinite" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ width: 48, height: 12, borderRadius: 4, background: theme.bgCardAlt, marginBottom: 4, animation: "pulse 1.8s ease-in-out infinite" }} />
                  <div style={{ width: 80, height: 10, borderRadius: 4, background: theme.bgCardAlt, animation: "pulse 1.8s ease-in-out infinite", animationDelay: "0.2s" }} />
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ width: 52, height: 12, borderRadius: 4, background: theme.bgCardAlt, marginBottom: 4, marginLeft: "auto", animation: "pulse 1.8s ease-in-out infinite" }} />
                  <div style={{ width: 60, height: 10, borderRadius: 4, background: theme.bgCardAlt, marginLeft: "auto", animation: "pulse 1.8s ease-in-out infinite", animationDelay: "0.2s" }} />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
}

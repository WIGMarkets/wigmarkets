import { useMemo } from "react";

const fmtVal = (v, decimals = 2) =>
  v != null
    ? v.toLocaleString("pl-PL", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : "—";

const fmtChange = v =>
  v != null ? `${v >= 0 ? "+" : ""}${v.toFixed(2)}%` : null;

function MiniSpark({ prices, trend, height = 72, id }) {
  const color = (trend ?? 0) >= 0 ? "#22c55e" : "#ef4444";

  const { linePath, areaPath } = useMemo(() => {
    if (!prices || prices.length < 2) return { linePath: "", areaPath: "" };
    const vals = prices.map(p => p.close).filter(v => v != null && !isNaN(v));
    if (vals.length < 2) return { linePath: "", areaPath: "" };
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const n = vals.length;
    const pts = vals.map((v, i) => [
      (i / (n - 1)) * 100,
      95 - ((v - min) / range) * 85,
    ]);
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
    return { linePath: line, areaPath: `${line} L100,100 L0,100 Z` };
  }, [prices]);

  if (!linePath) return <div style={{ height }} />;

  return (
    <svg
      width="100%" height={height} viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ display: "block", marginTop: 14 }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${id})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const WORLD_INDEX_META = {
  "S&P 500":  { flag: "US", region: "USA",    color: "#3b82f6" },
  "NASDAQ":   { flag: "US", region: "USA",    color: "#8b5cf6" },
  "Dow Jones":{ flag: "US", region: "USA",    color: "#0ea5e9" },
  "DAX":      { flag: "DE", region: "Europa", color: "#f59e0b" },
  "FTSE 100": { flag: "GB", region: "Europa", color: "#ef4444" },
  "CAC 40":   { flag: "FR", region: "Europa", color: "#06b6d4" },
  "Nikkei 225":{ flag: "JP", region: "Azja",  color: "#ec4899" },
  "Hang Seng":{ flag: "HK", region: "Azja",   color: "#f97316" },
  "WIG20":    { flag: "PL", region: "Polska", color: "#dc2626" },
  "mWIG40":   { flag: "PL", region: "Polska", color: "#dc2626" },
  "sWIG80":   { flag: "PL", region: "Polska", color: "#dc2626" },
};

const REGIONS = ["USA", "Europa", "Azja", "Polska"];

export default function WorldIndicesView({ worldIndices, gpwIndices, theme, isMobile }) {
  // Merge world indices with GPW indices (WIG20, mWIG40, sWIG80) from the
  // dedicated GPW fetch to avoid duplicate Yahoo Finance requests.
  const GPW_NAMES = new Set(["WIG20", "mWIG40", "sWIG80"]);
  const mergedIndices = useMemo(() => {
    const gpw = (gpwIndices || []).filter(i => GPW_NAMES.has(i.name));
    return [...(worldIndices || []), ...gpw];
  }, [worldIndices, gpwIndices]);

  const grouped = useMemo(() => {
    const groups = {};
    for (const region of REGIONS) groups[region] = [];
    for (const idx of mergedIndices) {
      const meta = WORLD_INDEX_META[idx.name];
      if (meta) groups[meta.region].push(idx);
    }
    return groups;
  }, [mergedIndices]);

  const allEmpty = !mergedIndices || mergedIndices.length === 0 || mergedIndices.every(i => i.value == null);

  return (
    <div style={{ padding: isMobile ? "8px 0 24px" : "0 0 32px" }}>
      <style>{`
        @keyframes wiCardIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ marginBottom: 20 }}>
        <h2 style={{
          fontSize: 17, fontWeight: 700, color: theme.textBright,
          margin: 0, fontFamily: "var(--font-ui)",
        }}>
          Indeksy światowe
        </h2>
        <p style={{
          fontSize: 12, color: theme.textSecondary,
          margin: "4px 0 0", fontFamily: "var(--font-ui)",
        }}>
          Główne indeksy giełdowe na świecie · aktualizacja co 60 s
        </p>
      </div>

      {allEmpty ? (
        <div style={{
          textAlign: "center", padding: 64,
          color: theme.textSecondary, fontFamily: "var(--font-ui)", fontSize: 14,
        }}>
          Ładowanie indeksów…
        </div>
      ) : (
        REGIONS.map(region => {
          const items = grouped[region];
          if (!items || items.length === 0) return null;
          return (
            <div key={region} style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 11, fontWeight: 600, color: theme.textSecondary,
                letterSpacing: "0.08em", textTransform: "uppercase",
                fontFamily: "var(--font-ui)", marginBottom: 10,
              }}>
                {region}
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : `repeat(${Math.min(items.length, 4)}, 1fr)`,
                gap: isMobile ? 10 : 16,
              }}>
                {items.map((idx, i) => {
                  const meta = WORLD_INDEX_META[idx.name] || { color: "#3b82f6" };
                  const ch24 = idx.change24h;
                  const c24  = ch24 == null ? theme.textSecondary : ch24 >= 0 ? "#22c55e" : "#ef4444";

                  return (
                    <div
                      key={idx.name}
                      style={{
                        background: theme.bgCard,
                        border: `1px solid ${theme.border}`,
                        borderTop: `3px solid ${meta.color}`,
                        borderRadius: 12,
                        padding: isMobile ? "14px 14px 12px" : "22px 24px 18px",
                        animation: "wiCardIn 0.35s ease both",
                        animationDelay: `${i * 70}ms`,
                        minWidth: 0,
                        overflow: "hidden",
                        transition: "border-color 0.2s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = meta.color}
                      onMouseLeave={e => e.currentTarget.style.borderColor = theme.border}
                    >
                      {/* Header */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", color: meta.color, background: `${meta.color}18`, borderRadius: 4, padding: "2px 5px", fontFamily: "var(--font-mono)" }}>{meta.flag}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                          textTransform: "uppercase", color: meta.color,
                          fontFamily: "var(--font-ui)",
                        }}>
                          {idx.name}
                        </span>
                      </div>

                      {idx.value != null ? (
                        <>
                          {/* Value */}
                          <div style={{
                            fontSize: isMobile ? 18 : 26, fontWeight: 800,
                            color: theme.textBright, fontFamily: "var(--font-mono)",
                            fontVariantNumeric: "tabular-nums", lineHeight: 1.15,
                            marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>
                            {fmtVal(idx.value)}
                          </div>

                          {/* Change */}
                          {ch24 != null && (
                            <div style={{ marginTop: 8 }}>
                              <span style={{
                                display: "inline-block",
                                padding: "3px 8px", borderRadius: 6,
                                fontSize: isMobile ? 11 : 13, fontWeight: 700,
                                background: ch24 >= 0 ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                                color: c24, fontFamily: "var(--font-mono)",
                              }}>
                                {ch24 >= 0 ? "▲" : "▼"} {fmtChange(ch24)}
                              </span>
                            </div>
                          )}

                          <MiniSpark
                            prices={idx.sparkline}
                            trend={ch24}
                            height={isMobile ? 48 : 72}
                            id={`wisp_${idx.name.replace(/\s+/g, "_")}`}
                          />
                        </>
                      ) : (
                        <div style={{
                          color: theme.textMuted, fontSize: 13,
                          marginTop: 12, fontFamily: "var(--font-ui)",
                        }}>
                          Brak danych
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

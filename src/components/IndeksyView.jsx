import { useMemo } from "react";

const fmtVal = v =>
  v != null
    ? v.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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

const INDEX_META = {
  WIG20:  { desc: "20 największych spółek GPW" },
  WIG:    { desc: "Wszystkie spółki notowane na GPW" },
  mWIG40: { desc: "40 średnich spółek GPW" },
  sWIG80: { desc: "80 małych spółek GPW" },
};

export default function IndeksyView({ indices, theme, isMobile }) {
  return (
    <div style={{ padding: isMobile ? "8px 0 24px" : "0 0 32px" }}>
      <style>{`
        @keyframes idxCardIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ marginBottom: 20 }}>
        <h2 style={{
          fontSize: 17, fontWeight: 700, color: theme.textBright,
          margin: 0, fontFamily: "var(--font-ui)",
        }}>
          Indeksy GPW
        </h2>
        <p style={{
          fontSize: 12, color: theme.textSecondary,
          margin: "4px 0 0", fontFamily: "var(--font-ui)",
        }}>
          Główne indeksy Giełdy Papierów Wartościowych w Warszawie · aktualizacja co 60 s
        </p>
      </div>

      {(!indices || indices.length === 0) ? (
        <div style={{
          textAlign: "center", padding: 64,
          color: theme.textSecondary, fontFamily: "var(--font-ui)", fontSize: 14,
        }}>
          Ładowanie indeksów…
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: isMobile ? 10 : 16,
        }}>
          {indices.map((idx, i) => {
            const ch24  = idx.change24h;
            const ch7d  = idx.change7d;
            const meta  = INDEX_META[idx.name] ?? {};
            const c24   = ch24 == null ? theme.textSecondary : ch24 >= 0 ? "#22c55e" : "#ef4444";
            const c7d   = ch7d == null ? theme.textSecondary : ch7d >= 0 ? "#22c55e" : "#ef4444";

            return (
              <div
                key={idx.name}
                style={{
                  background: theme.bgCard,
                  border: `1px solid ${theme.border}`,
                  borderTop: "3px solid #3b82f6",
                  borderRadius: 12,
                  padding: isMobile ? "14px 14px 12px" : "22px 24px 18px",
                  animation: "idxCardIn 0.35s ease both",
                  animationDelay: `${i * 70}ms`,
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                  textTransform: "uppercase", color: "#3b82f6",
                  fontFamily: "var(--font-ui)",
                }}>
                  {idx.name}
                </div>
                {!isMobile && meta.desc && (
                  <div style={{
                    fontSize: 10, color: theme.textMuted,
                    fontFamily: "var(--font-ui)", marginTop: 2, marginBottom: 4,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {meta.desc}
                  </div>
                )}

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

                    {/* Changes */}
                    <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
                      {ch24 != null && (
                        <div>
                          <div style={{
                            fontSize: 9, color: theme.textMuted,
                            fontFamily: "var(--font-ui)", marginBottom: 1,
                            textTransform: "uppercase", letterSpacing: "0.05em",
                          }}>24H</div>
                          <div style={{
                            fontSize: isMobile ? 12 : 14, fontWeight: 700,
                            color: c24, fontFamily: "var(--font-mono)",
                          }}>
                            {ch24 >= 0 ? "▲" : "▼"} {fmtChange(ch24)}
                          </div>
                        </div>
                      )}
                      {ch7d != null && (
                        <div>
                          <div style={{
                            fontSize: 9, color: theme.textMuted,
                            fontFamily: "var(--font-ui)", marginBottom: 1,
                            textTransform: "uppercase", letterSpacing: "0.05em",
                          }}>7D</div>
                          <div style={{
                            fontSize: isMobile ? 12 : 14, fontWeight: 700,
                            color: c7d, fontFamily: "var(--font-mono)",
                          }}>
                            {ch7d >= 0 ? "▲" : "▼"} {fmtChange(ch7d)}
                          </div>
                        </div>
                      )}
                    </div>

                    <MiniSpark
                      prices={idx.sparkline}
                      trend={ch24}
                      height={isMobile ? 48 : 80}
                      id={`idxsp_${idx.name}`}
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
      )}
    </div>
  );
}

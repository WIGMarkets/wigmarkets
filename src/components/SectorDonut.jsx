import { getSectorPalette } from "./CompanyMonogram.jsx";

export default function SectorDonut({ stocks, theme }) {
  const sectorCaps = {};
  for (const s of stocks) {
    sectorCaps[s.sector] = (sectorCaps[s.sector] || 0) + (s.cap || 0);
  }
  const sorted = Object.entries(sectorCaps).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((a, [, v]) => a + v, 0);
  if (!total) return null;

  const slices = sorted.map(([sector, cap]) => ({
    sector,
    cap,
    pct: (cap / total) * 100,
    color: getSectorPalette(sector).accent,
  }));

  return (
    <div style={{
      background: `linear-gradient(135deg, ${theme.bgCardAlt} 0%, ${theme.bgCard} 100%)`,
      border: `1px solid ${theme.border}`,
      borderRadius: 14, padding: 20,
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 14,
      }}>
        <span style={{
          fontSize: 11, color: theme.textSecondary, letterSpacing: "0.08em",
          textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--font-ui)",
        }}>Dominacja sektorowa</span>
        <span style={{
          fontSize: 12, fontWeight: 700, color: theme.textBright,
          fontFamily: "var(--font-mono)",
        }}>{(total / 1000).toFixed(0)} mld zł</span>
      </div>

      {/* Horizontal stacked bar */}
      <div style={{
        display: "flex", height: 10, borderRadius: 5, overflow: "hidden",
        marginBottom: 16,
        background: theme.bgCardAlt,
      }}>
        {slices.map(s => (
          <div
            key={s.sector}
            title={`${s.sector}: ${s.pct.toFixed(1)}%`}
            style={{
              width: `${s.pct}%`,
              background: s.color,
              opacity: 0.85,
              transition: "opacity 0.15s",
              minWidth: s.pct > 1 ? 2 : 0,
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {slices.slice(0, 8).map(s => (
          <div key={s.sector} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              width: 10, height: 10, borderRadius: 3,
              background: s.color, flexShrink: 0,
            }} />
            <span style={{
              fontSize: 12, color: theme.text,
              flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{s.sector}</span>
            {/* Mini bar */}
            <div style={{
              width: 60, height: 4, borderRadius: 2,
              background: theme.bgCardAlt, flexShrink: 0,
              overflow: "hidden",
            }}>
              <div style={{
                width: `${s.pct}%`, height: "100%",
                background: s.color, borderRadius: 2,
              }} />
            </div>
            <span style={{
              fontSize: 11, fontWeight: 600, color: s.color,
              flexShrink: 0, width: 36, textAlign: "right",
              fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums",
            }}>{s.pct.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

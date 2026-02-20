import { useIsMobile } from "../../../hooks/useIsMobile.js";

const PREVIEW_STOCKS = [
  { ticker: "CDR", name: "CD Projekt", sector: "IT", change24h: 2.1, pe: 28.5, div: 0.0 },
  { ticker: "DNP", name: "Dino Polska", sector: "Handel", change24h: -0.8, pe: 24.1, div: 0.0 },
  { ticker: "PKN", name: "PKN Orlen", sector: "Energetyka", change24h: 1.3, pe: 8.1, div: 6.8 },
  { ticker: "LPP", name: "LPP SA", sector: "Handel", change24h: 3.2, pe: 19.8, div: 1.2 },
  { ticker: "KGHM", name: "KGHM Polska Miedź", sector: "Surowce", change24h: -1.5, pe: 11.2, div: 5.1 },
];

function ScrollHint({ theme }) {
  return (
    <div style={{ fontSize: 11, color: theme.textSecondary, textAlign: "right", padding: "6px 12px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
      <span>Przewiń tabelę</span>
      <span style={{ fontSize: 14 }}>→</span>
    </div>
  );
}

export default function ScreenerPreview({ theme, onNavigate }) {
  const isMobile = useIsMobile();

  return (
    <div style={{
      background: theme.bgCardAlt,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      overflow: "hidden",
      margin: "24px 0",
    }}>
      <div style={{ padding: isMobile ? "12px 16px" : "16px 20px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.textBright }}>🔍 Screener GPW — podgląd</div>
          <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>Przykładowe dane · Filtruj spółki według własnych kryteriów</div>
        </div>
        <a
          href="/"
          onClick={e => { e.preventDefault(); onNavigate?.("/"); }}
          style={{ fontSize: 12, color: "#58a6ff", textDecoration: "none", fontWeight: 600, padding: "8px 14px", border: "1px solid #58a6ff40", borderRadius: 8, minHeight: 44, display: "inline-flex", alignItems: "center" }}
        >
          Pełny screener →
        </a>
      </div>
      {isMobile && <ScrollHint theme={theme} />}
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: isMobile ? 450 : "auto" }}>
          <thead>
            <tr style={{ background: theme.bgCard }}>
              {["Spółka", "Sektor", "Zmiana 24h", "P/E", "Dywidenda"].map(h => (
                <th key={h} style={{ padding: "9px 14px", textAlign: "left", color: theme.textSecondary, fontWeight: 600, fontSize: 11, borderBottom: `1px solid ${theme.border}`, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PREVIEW_STOCKS.map((s, i) => (
              <tr key={s.ticker} style={{ borderBottom: `1px solid ${theme.border}`, background: i % 2 === 1 ? theme.bgCard : "transparent" }}>
                <td style={{ padding: "9px 14px" }}>
                  <div style={{ fontWeight: 700, color: theme.textBright }}>{s.ticker}</div>
                  <div style={{ fontSize: 11, color: theme.textSecondary }}>{s.name}</div>
                </td>
                <td style={{ padding: "9px 14px", color: theme.textSecondary }}>{s.sector}</td>
                <td style={{ padding: "9px 14px" }}>
                  <span style={{
                    background: s.change24h >= 0 ? "#00c89620" : "#ff4d6d20",
                    color: s.change24h >= 0 ? "#00c896" : "#ff4d6d",
                    fontWeight: 700, padding: "2px 7px", borderRadius: 5, fontSize: 12,
                  }}>
                    {s.change24h >= 0 ? "▲" : "▼"} {Math.abs(s.change24h).toFixed(1)}%
                  </span>
                </td>
                <td style={{ padding: "9px 14px", color: theme.text }}>{s.pe}</td>
                <td style={{ padding: "9px 14px" }}>
                  {s.div > 0 ? <span style={{ color: "#00c896", fontWeight: 600 }}>{s.div.toFixed(1)}%</span> : <span style={{ color: theme.textSecondary }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: "12px 20px", textAlign: "center" }}>
        <a
          href="/"
          onClick={e => { e.preventDefault(); onNavigate?.("/"); }}
          style={{ fontSize: 13, color: "#58a6ff", fontWeight: 600, textDecoration: "none", display: "inline-block", padding: "8px 0", minHeight: 44, lineHeight: "28px" }}
        >
          Zobacz wszystkie spółki GPW z filtrami →
        </a>
      </div>
    </div>
  );
}

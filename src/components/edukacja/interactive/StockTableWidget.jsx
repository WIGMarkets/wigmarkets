import { useIsMobile } from "../../../hooks/useIsMobile.js";
import Icon from "../Icon.jsx";

const DATASETS = {
  fundamentals: [
    { ticker: "CDR", name: "CD Projekt", pe: 28.5, pb: 4.2, div: 0.0, cap: "8.1 mld", roe: "15.2%" },
    { ticker: "PKN", name: "PKN Orlen", pe: 8.1, pb: 0.9, div: 6.8, cap: "42 mld", roe: "11.4%" },
    { ticker: "KGHM", name: "KGHM Polska Miedź", pe: 11.2, pb: 1.3, div: 5.1, cap: "15 mld", roe: "12.8%" },
    { ticker: "DNP", name: "Dino Polska", pe: 24.1, pb: 6.8, div: 0.0, cap: "20 mld", roe: "28.5%" },
    { ticker: "LPP", name: "LPP SA", pe: 19.8, pb: 5.1, div: 1.2, cap: "14 mld", roe: "25.1%" },
    { ticker: "PZU", name: "PZU SA", pe: 9.5, pb: 1.8, div: 7.2, cap: "30 mld", roe: "19.3%" },
    { ticker: "ALE", name: "Allegro.eu", pe: 35.2, pb: 3.4, div: 0.0, cap: "18 mld", roe: "9.6%" },
    { ticker: "PKOBP", name: "PKO Bank Polski", pe: 9.8, pb: 1.4, div: 7.9, cap: "55 mld", roe: "14.8%" },
  ],
  wig20: [
    { ticker: "PKOBP", name: "PKO Bank Polski", pe: 9.8, pb: 1.4, div: 7.9, cap: "55 mld", roe: "14.8%" },
    { ticker: "PKN", name: "PKN Orlen", pe: 8.1, pb: 0.9, div: 6.8, cap: "42 mld", roe: "11.4%" },
    { ticker: "PZU", name: "PZU SA", pe: 9.5, pb: 1.8, div: 7.2, cap: "30 mld", roe: "19.3%" },
    { ticker: "DNP", name: "Dino Polska", pe: 24.1, pb: 6.8, div: 0.0, cap: "20 mld", roe: "28.5%" },
    { ticker: "ALE", name: "Allegro.eu", pe: 35.2, pb: 3.4, div: 0.0, cap: "18 mld", roe: "9.6%" },
    { ticker: "KGHM", name: "KGHM Polska Miedź", pe: 11.2, pb: 1.3, div: 5.1, cap: "15 mld", roe: "12.8%" },
    { ticker: "LPP", name: "LPP SA", pe: 19.8, pb: 5.1, div: 1.2, cap: "14 mld", roe: "25.1%" },
    { ticker: "CDR", name: "CD Projekt", pe: 28.5, pb: 4.2, div: 0.0, cap: "8.1 mld", roe: "15.2%" },
  ],
};

function ScrollHint({ theme }) {
  return (
    <div style={{ fontSize: 11, color: theme.textSecondary, textAlign: "right", padding: "6px 12px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
      <span>Przewiń tabelę</span>
      <Icon name="arrow-right" size={14} />
    </div>
  );
}

export default function StockTableWidget({ title = "Wskaźniki fundamentalne spółek GPW", data = "fundamentals", theme }) {
  const isMobile = useIsMobile();
  const rows = DATASETS[data] || DATASETS.fundamentals;

  return (
    <div style={{
      background: theme.bgCardAlt,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      overflow: "hidden",
      margin: "24px 0",
    }}>
      <div style={{ padding: isMobile ? "12px 16px" : "16px 20px", borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.textBright }}>{title}</div>
        <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>Dane poglądowe · Aktualne notowania na stronie głównej WIGmarkets</div>
      </div>
      {isMobile && <ScrollHint theme={theme} />}
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: isMobile ? 500 : "auto" }}>
          <thead>
            <tr style={{ background: theme.bgCard }}>
              {["Spółka", "P/E", "P/B", "Stopa dywidendy", "Kapitalizacja", "ROE"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: theme.textSecondary, fontWeight: 600, fontSize: 11, borderBottom: `1px solid ${theme.border}`, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.ticker} style={{ borderBottom: `1px solid ${theme.border}`, background: i % 2 === 1 ? theme.bgCard : "transparent" }}>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ fontWeight: 700, color: theme.textBright }}>{row.ticker}</div>
                  <div style={{ fontSize: 11, color: theme.textSecondary }}>{row.name}</div>
                </td>
                <td style={{ padding: "10px 14px", color: row.pe > 25 ? "#f0883e" : row.pe < 12 ? "#00c896" : theme.text }}>{row.pe}</td>
                <td style={{ padding: "10px 14px", color: theme.text }}>{row.pb}</td>
                <td style={{ padding: "10px 14px" }}>
                  {row.div > 0 ? (
                    <span style={{ color: "#00c896", fontWeight: 600 }}>{row.div.toFixed(1)}%</span>
                  ) : <span style={{ color: theme.textSecondary }}>—</span>}
                </td>
                <td style={{ padding: "10px 14px", color: theme.textSecondary }}>{row.cap}</td>
                <td style={{ padding: "10px 14px", color: theme.text }}>{row.roe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

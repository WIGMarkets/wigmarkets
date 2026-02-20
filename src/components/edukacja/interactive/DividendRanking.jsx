const DIVIDEND_DATA = [
  { ticker: "PKN", name: "PKN Orlen", sector: "Energetyka", divYield: 6.8, div: 5.5, pe: 8.1, payoutRatio: "55%", frequency: "Roczna" },
  { ticker: "PZU", name: "PZU SA", sector: "Finanse", divYield: 7.2, div: 3.1, pe: 9.5, payoutRatio: "70%", frequency: "Roczna" },
  { ticker: "KGHM", name: "KGHM Polska Miedź", sector: "Surowce", divYield: 5.1, div: 10.0, pe: 11.2, payoutRatio: "30%", frequency: "Roczna" },
  { ticker: "PGE", name: "PGE Polska Grupa Energetyczna", sector: "Energetyka", divYield: 4.8, div: 0.75, pe: 7.8, payoutRatio: "40%", frequency: "Roczna" },
  { ticker: "PEKAO", name: "Bank Pekao", sector: "Banki", divYield: 8.5, div: 12.3, pe: 10.1, payoutRatio: "75%", frequency: "Roczna" },
  { ticker: "PKOBP", name: "PKO Bank Polski", sector: "Banki", divYield: 7.9, div: 2.8, pe: 9.8, payoutRatio: "65%", frequency: "Roczna" },
  { ticker: "ASSECO", name: "Asseco Poland", sector: "IT", divYield: 3.2, div: 4.5, pe: 18.5, payoutRatio: "50%", frequency: "Roczna" },
  { ticker: "BENEFIT", name: "Benefit Systems", sector: "Usługi", divYield: 2.1, div: 30.0, pe: 28.4, payoutRatio: "45%", frequency: "Roczna" },
];

export default function DividendRanking({ theme }) {
  return (
    <div style={{
      background: theme.bgCardAlt,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      overflow: "hidden",
      margin: "24px 0",
    }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.textBright }}>🏆 Ranking spółek dywidendowych GPW 2026</div>
          <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>Dane szacunkowe · Dywidendy mogą ulec zmianie</div>
        </div>
        <span style={{ background: "#00c89620", color: "#00c896", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
          Posortowane wg stopy dywidendy
        </span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: theme.bgCard }}>
              {["#", "Spółka", "Sektor", "Stopa dywidendy", "Dywidenda (zł)", "P/E", "Payout ratio", "Częstotliwość"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "#8b949e", fontWeight: 600, fontSize: 11, whiteSpace: "nowrap", borderBottom: `1px solid ${theme.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DIVIDEND_DATA.sort((a, b) => b.divYield - a.divYield).map((row, i) => (
              <tr key={row.ticker} style={{ borderBottom: `1px solid ${theme.border}`, background: i % 2 === 1 ? theme.bgCard : "transparent" }}>
                <td style={{ padding: "10px 14px", color: "#8b949e", fontSize: 11 }}>{i + 1}</td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ fontWeight: 700, color: "#e6edf3" }}>{row.ticker}</div>
                  <div style={{ fontSize: 11, color: "#8b949e" }}>{row.name}</div>
                </td>
                <td style={{ padding: "10px 14px", color: "#c9d1d9", whiteSpace: "nowrap" }}>{row.sector}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ background: "#00c89620", color: "#00c896", fontWeight: 700, padding: "2px 8px", borderRadius: 5 }}>
                    {row.divYield.toFixed(1)}%
                  </span>
                </td>
                <td style={{ padding: "10px 14px", color: "#c9d1d9", fontWeight: 600 }}>{row.div.toFixed(2)} zł</td>
                <td style={{ padding: "10px 14px", color: "#c9d1d9" }}>{row.pe}</td>
                <td style={{ padding: "10px 14px", color: "#c9d1d9" }}>{row.payoutRatio}</td>
                <td style={{ padding: "10px 14px", color: "#c9d1d9" }}>{row.frequency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

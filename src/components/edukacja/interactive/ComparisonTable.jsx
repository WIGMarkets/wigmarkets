import { useIsMobile } from "../../../hooks/useIsMobile.js";

const BROKER_DATA = [
  { name: "XTB", minDeposit: "0 zł", commissionGPW: "0% (do 100k EUR/m-c)", commissionUS: "0% (do 100k EUR/m-c)", platform: "xStation 5", demo: "Tak", ikeIkze: "Nie", rating: "★★★★★" },
  { name: "mBank eMakler", minDeposit: "0 zł", commissionGPW: "0,19% (min. 3 zł)", commissionUS: "0,29% (min. 19 zł)", platform: "eMakler", demo: "Nie", ikeIkze: "Tak (IKE)", rating: "★★★★☆" },
  { name: "DM BOŚ", minDeposit: "0 zł", commissionGPW: "0,18% (min. 3 zł)", commissionUS: "0,29% (min. 19 zł)", platform: "BossaWeb", demo: "Tak", ikeIkze: "Tak (IKE+IKZE)", rating: "★★★★☆" },
  { name: "PKO BP BM", minDeposit: "0 zł", commissionGPW: "0,20% (min. 5 zł)", commissionUS: "0,30% (min. 19 zł)", platform: "iPKO Inwestycje", demo: "Nie", ikeIkze: "Tak (IKE+IKZE)", rating: "★★★☆☆" },
  { name: "Pekao BM", minDeposit: "0 zł", commissionGPW: "0,19% (min. 5 zł)", commissionUS: "0,30% (min. 19 zł)", platform: "Pekao24 Makler", demo: "Nie", ikeIkze: "Tak (IKE+IKZE)", rating: "★★★☆☆" },
  { name: "Santander BM", minDeposit: "0 zł", commissionGPW: "0,19% (min. 3 zł)", commissionUS: "0,29% (min. 19 zł)", platform: "Santander Makler", demo: "Nie", ikeIkze: "Tak (IKE)", rating: "★★★☆☆" },
];

const ETF_DATA = [
  { name: "Beta ETF WIG20TR", ticker: "BETAW20TR", index: "WIG20TR", ter: "0,50%", aum: "~200 mln PLN", dywidendy: "Akumulacja", provider: "AgioFunds TFI" },
  { name: "Beta ETF mWIG40TR", ticker: "BETAM40TR", index: "mWIG40TR", ter: "0,50%", aum: "~60 mln PLN", dywidendy: "Akumulacja", provider: "AgioFunds TFI" },
  { name: "Beta ETF S&P500 PLN", ticker: "BETASP500", index: "S&P 500", ter: "0,50%", aum: "~150 mln PLN", dywidendy: "Akumulacja", provider: "AgioFunds TFI" },
  { name: "Beta ETF Nasdaq-100", ticker: "BETANAS100", index: "Nasdaq-100", ter: "0,55%", aum: "~80 mln PLN", dywidendy: "Akumulacja", provider: "AgioFunds TFI" },
  { name: "Lyxor WIG20 UCITS", ticker: "LYX0YD", index: "WIG20", ter: "0,45%", aum: "~300 mln PLN", dywidendy: "Akumulacja", provider: "Lyxor/Amundi" },
  { name: "iShares Core MSCI World", ticker: "IWDA", index: "MSCI World", ter: "0,20%", aum: ">50 mld USD", dywidendy: "Akumulacja", provider: "BlackRock iShares" },
];

function ScrollHint({ theme }) {
  return (
    <div style={{ fontSize: 11, color: theme.textSecondary, textAlign: "right", padding: "6px 12px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
      <span>Przewiń tabelę</span>
      <span style={{ fontSize: 14 }}>→</span>
    </div>
  );
}

export default function ComparisonTable({ title = "Porównanie kont maklerskich 2026", data = "brokerComparison", theme }) {
  const isMobile = useIsMobile();
  const isBroker = data === "brokerComparison";
  const isETF = data === "etfComparison";
  const rows = isBroker ? BROKER_DATA : isETF ? ETF_DATA : BROKER_DATA;

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
        <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>Dane na luty 2026 · Zawsze sprawdzaj aktualne warunki u brokera</div>
      </div>
      {isMobile && <ScrollHint theme={theme} />}
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: isMobile ? 600 : "auto" }}>
          <thead>
            <tr style={{ background: theme.bgCard }}>
              {isBroker && ["Broker", "Min. depozyt", "Prowizja GPW", "Prowizja USA", "Platforma", "Demo", "IKE/IKZE", "Ocena"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: theme.textSecondary, fontWeight: 600, fontSize: 11, whiteSpace: "nowrap", borderBottom: `1px solid ${theme.border}` }}>{h}</th>
              ))}
              {isETF && ["ETF", "Ticker", "Indeks", "TER", "AUM", "Dywidendy", "Provider"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: theme.textSecondary, fontWeight: 600, fontSize: 11, whiteSpace: "nowrap", borderBottom: `1px solid ${theme.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${theme.border}`, background: i % 2 === 1 ? theme.bgCard : "transparent" }}>
                {isBroker && [row.name, row.minDeposit, row.commissionGPW, row.commissionUS, row.platform, row.demo, row.ikeIkze, row.rating].map((cell, j) => (
                  <td key={j} style={{ padding: "10px 14px", color: j === 0 ? theme.textBright : theme.text, fontWeight: j === 0 ? 700 : 400, whiteSpace: "nowrap" }}>{cell}</td>
                ))}
                {isETF && [row.name, row.ticker, row.index, row.ter, row.aum, row.dywidendy, row.provider].map((cell, j) => (
                  <td key={j} style={{ padding: "10px 14px", color: j === 0 ? theme.textBright : theme.text, fontWeight: j === 0 ? 700 : 400, whiteSpace: "nowrap" }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

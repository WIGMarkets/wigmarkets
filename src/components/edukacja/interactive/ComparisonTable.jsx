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

const IKE_IKZE_DATA = [
  { cecha: "Pełna nazwa", ike: "Indywidualne Konto Emerytalne", ikze: "Indywidualne Konto Zabezpieczenia Emerytalnego" },
  { cecha: "Limit wpłat 2026", ike: "~23 472 zł", ikze: "~9 388 zł (14 082 zł — samozatr.)" },
  { cecha: "Ulga przy wpłacie", ike: "Brak", ikze: "Odliczenie od dochodu (PIT)" },
  { cecha: "Podatek przy wypłacie", ike: "0% (po 60. r.ż.)", ikze: "10% ryczałt (po 65. r.ż.)" },
  { cecha: "Wcześniejsza wypłata", ike: "Możliwa (19% podatku)", ikze: "Możliwa (pełne opodatkowanie PIT)" },
  { cecha: "Dostępne instrumenty", ike: "Akcje, ETF, obligacje, fundusze", ikze: "Akcje, ETF, obligacje, fundusze" },
  { cecha: "Liczba kont", ike: "Jedno", ikze: "Jedno" },
  { cecha: "Transfer do innej instytucji", ike: "Tak (bezpłatnie)", ikze: "Tak (bezpłatnie)" },
  { cecha: "Dla kogo najlepsze", ike: "Oszczędzający długoterminowo", ikze: "Osoby z wyższym PIT (32%)" },
];

const OBLIGACJE_DATA = [
  { nazwa: "OTS (3-mies.)", okres: "3 miesiące", oproc: "~3,00% stałe", typ: "Stałe", minKwota: "100 zł", wykup: "Po 3 mies.", indeksacja: "Nie" },
  { nazwa: "ROR (1-roczne)", okres: "1 rok", oproc: "~6,00% (zm.)", typ: "Zmienne (WIBOR)", minKwota: "100 zł", wykup: "Po 1 roku", indeksacja: "Nie" },
  { nazwa: "DOR (2-letnie)", okres: "2 lata", oproc: "~6,10% (zm.)", typ: "Zmienne (WIBOR)", minKwota: "100 zł", wykup: "Po 2 latach", indeksacja: "Nie" },
  { nazwa: "TOS (3-letnie)", okres: "3 lata", oproc: "~6,20% (zm.)", typ: "Zmienne (WIBOR)", minKwota: "100 zł", wykup: "Po 3 latach", indeksacja: "Nie" },
  { nazwa: "COI (4-letnie)", okres: "4 lata", oproc: "~6,55% (1. rok), potem inflacja + marża", typ: "Indeks. inflacją", minKwota: "100 zł", wykup: "Po 4 latach", indeksacja: "Tak" },
  { nazwa: "EDO (10-letnie)", okres: "10 lat", oproc: "~6,80% (1. rok), potem inflacja + marża", typ: "Indeks. inflacją", minKwota: "100 zł", wykup: "Po 10 latach", indeksacja: "Tak" },
  { nazwa: "ROS (rodzinne 6-l.)", okres: "6 lat", oproc: "~6,75% (1. rok), potem inflacja + marża", typ: "Indeks. inflacją", minKwota: "100 zł", wykup: "Po 6 latach", indeksacja: "Tak" },
  { nazwa: "ROD (rodzinne 12-l.)", okres: "12 lat", oproc: "~7,05% (1. rok), potem inflacja + marża", typ: "Indeks. inflacją", minKwota: "100 zł", wykup: "Po 12 latach", indeksacja: "Tak" },
];

const APP_DATA = [
  { name: "XTB xStation", gpw: "Tak", rynkiZagr: "16 giełd", prowizje: "0% (do 100k EUR)", ui: "★★★★★", minWplata: "0 zł", demo: "Tak", rating: "★★★★★" },
  { name: "mBank eMakler", gpw: "Tak", rynkiZagr: "6 giełd", prowizje: "0,19% (min. 3 zł)", ui: "★★★★☆", minWplata: "0 zł", demo: "Nie", rating: "★★★★☆" },
  { name: "Bossa Mobile", gpw: "Tak", rynkiZagr: "8 giełd", prowizje: "0,18% (min. 3 zł)", ui: "★★★☆☆", minWplata: "0 zł", demo: "Tak", rating: "★★★★☆" },
  { name: "Revolut", gpw: "Nie", rynkiZagr: "USA, EU", prowizje: "0% (do limitu)", ui: "★★★★★", minWplata: "0 zł", demo: "Nie", rating: "★★★☆☆" },
  { name: "eToro", gpw: "Nie", rynkiZagr: "17 giełd", prowizje: "0% (akcje), spread (CFD)", ui: "★★★★☆", minWplata: "200 USD", demo: "Tak", rating: "★★★☆☆" },
];

const ZLECENIA_DATA = [
  { typ: "Z limitem ceny", opis: "Kupno/sprzedaż po określonej cenie lub lepszej", kiedy: "Gdy chcesz kontrolować cenę", ryzyko: "Niskie", realizacja: "Może nie być zrealizowane", szybkosc: "Wolna" },
  { typ: "PKC (Po Każdej Cenie)", opis: "Realizacja natychmiast po najlepszej dostępnej cenie", kiedy: "Gdy zależy ci na szybkości", ryzyko: "Średnie (slippage)", realizacja: "Natychmiastowa", szybkosc: "Bardzo szybka" },
  { typ: "PCR (Po Cenie Rynkowej)", opis: "Jak PKC, ale konwertuje się na limit po pierwszej transakcji", kiedy: "Kompromis między PKC a limitem", ryzyko: "Niskie-średnie", realizacja: "Szybka", szybkosc: "Szybka" },
  { typ: "Stop Loss", opis: "Automatyczna sprzedaż gdy cena spadnie do poziomu", kiedy: "Ochrona przed stratami", ryzyko: "Luki cenowe", realizacja: "Po aktywacji → PKC", szybkosc: "Warunkowa" },
  { typ: "Stop Limit", opis: "Jak stop loss, ale po aktywacji → zlecenie z limitem", kiedy: "Ochrona z kontrolą ceny", ryzyko: "Może nie być zrealizowane", realizacja: "Po aktywacji → limit", szybkosc: "Warunkowa" },
  { typ: "Take Profit", opis: "Automatyczna sprzedaż gdy cena wzrośnie do celu", kiedy: "Realizacja zysków", ryzyko: "Niskie", realizacja: "Po osiągnięciu celu", szybkosc: "Warunkowa" },
  { typ: "Trailing Stop", opis: "Stop loss podążający za ceną w górę", kiedy: "Ochrona rosnących zysków", ryzyko: "Luki cenowe", realizacja: "Dynamiczna", szybkosc: "Warunkowa" },
];

const TABLE_CONFIG = {
  brokerComparison: {
    headers: ["Broker", "Min. depozyt", "Prowizja GPW", "Prowizja USA", "Platforma", "Demo", "IKE/IKZE", "Ocena"],
    rows: BROKER_DATA,
    getRow: (row) => [row.name, row.minDeposit, row.commissionGPW, row.commissionUS, row.platform, row.demo, row.ikeIkze, row.rating],
    subtitle: "Dane na luty 2026 · Zawsze sprawdzaj aktualne warunki u brokera",
  },
  etfComparison: {
    headers: ["ETF", "Ticker", "Indeks", "TER", "AUM", "Dywidendy", "Provider"],
    rows: ETF_DATA,
    getRow: (row) => [row.name, row.ticker, row.index, row.ter, row.aum, row.dywidendy, row.provider],
    subtitle: "Dane na luty 2026 · Sprawdź aktualne parametry u emitenta",
  },
  ikeIkzeComparison: {
    headers: ["Cecha", "IKE", "IKZE"],
    rows: IKE_IKZE_DATA,
    getRow: (row) => [row.cecha, row.ike, row.ikze],
    subtitle: "Dane na 2026 rok · Limity wpłat aktualizowane corocznie",
  },
  obligacjeComparison: {
    headers: ["Obligacja", "Okres", "Oprocentowanie", "Typ", "Min. kwota", "Wykup", "Indeksacja"],
    rows: OBLIGACJE_DATA,
    getRow: (row) => [row.nazwa, row.okres, row.oproc, row.typ, row.minKwota, row.wykup, row.indeksacja],
    subtitle: "Dane orientacyjne na luty 2026 · Sprawdź aktualne warunki na obligacjeskarbowe.pl",
  },
  appComparison: {
    headers: ["Aplikacja", "GPW", "Rynki zagr.", "Prowizje", "UI/UX", "Min. wpłata", "Demo", "Ocena"],
    rows: APP_DATA,
    getRow: (row) => [row.name, row.gpw, row.rynkiZagr, row.prowizje, row.ui, row.minWplata, row.demo, row.rating],
    subtitle: "Dane na luty 2026 · Warunki mogą się zmieniać",
  },
  zleceniaComparison: {
    headers: ["Typ zlecenia", "Opis", "Kiedy używać", "Ryzyko", "Realizacja", "Szybkość"],
    rows: ZLECENIA_DATA,
    getRow: (row) => [row.typ, row.opis, row.kiedy, row.ryzyko, row.realizacja, row.szybkosc],
    subtitle: "Typy zleceń dostępne na GPW",
  },
};

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
  const config = TABLE_CONFIG[data] || TABLE_CONFIG.brokerComparison;
  const { headers, rows, getRow, subtitle } = config;

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
        <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>{subtitle}</div>
      </div>
      {isMobile && <ScrollHint theme={theme} />}
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: isMobile ? 600 : "auto" }}>
          <thead>
            <tr style={{ background: theme.bgCard }}>
              {headers.map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: theme.textSecondary, fontWeight: 600, fontSize: 11, whiteSpace: "nowrap", borderBottom: `1px solid ${theme.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${theme.border}`, background: i % 2 === 1 ? theme.bgCard : "transparent" }}>
                {getRow(row).map((cell, j) => (
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

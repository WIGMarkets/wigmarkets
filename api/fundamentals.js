const YAHOO_MAP = {
  "dia": "DIAG.WA",
  "xau":     "GC=F",
  "xag":     "SI=F",
  "cl.f":    "CL=F",
  "ng.f":    "NG=F",
  "hg.f":    "HG=F",
  "weat.us": "WEAT",
  "corn.us": "CORN",
  "soy.us":  "SOYB",
  "xpt":     "PL=F",
  "xpd":     "PA=F",
};

function toYahoo(stooq) {
  const s = stooq.toLowerCase();
  return YAHOO_MAP[s] || (s.toUpperCase() + ".WA");
}

const YF_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
};

export default async function handler(req, res) {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: "Symbol is required" });

  const yahooSymbol = toYahoo(symbol);
  const modules = "incomeStatementHistory,balanceSheetHistory,defaultKeyStatistics";
  const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(yahooSymbol)}?modules=${modules}`;

  try {
    const response = await fetch(url, { headers: YF_HEADERS });
    const json = await response.json();

    const summary = json?.quoteSummary?.result?.[0];
    if (!summary) return res.status(404).json({ error: "No data" });

    const income  = summary.incomeStatementHistory?.incomeStatementHistory || [];
    const balance = summary.balanceSheetHistory?.balanceSheetStatements   || [];
    const stats   = summary.defaultKeyStatistics || {};

    if (income.length === 0) return res.status(404).json({ error: "No financial data" });

    const years     = income.map(s => new Date(s.endDate.raw * 1000).getFullYear()).slice(0, 4);
    const revenue   = income.map(s => s.totalRevenue?.raw    ?? null).slice(0, 4);
    const netIncome = income.map(s => s.netIncome?.raw       ?? null).slice(0, 4);
    const ebitda    = income.map(s => s.ebitda?.raw          ?? null).slice(0, 4);
    const eps       = stats.trailingEps?.raw ?? null;

    const bookValue = balance.map(s => s.totalStockholderEquity?.raw ?? null).slice(0, 4);
    const netDebt   = balance.map(s => {
      const debt = (s.shortLongTermDebt?.raw ?? 0) + (s.longTermDebt?.raw ?? 0);
      const cash = s.cash?.raw ?? 0;
      return debt - cash;
    }).slice(0, 4);

    res.status(200).json({
      symbol: symbol.toLowerCase(),
      years,
      annual: years.map((year, i) => ({
        year,
        revenue:   revenue[i]   ?? null,
        netIncome: netIncome[i] ?? null,
        ebitda:    ebitda[i]    ?? null,
      })),
      current: {
        revenue:   revenue[0]   ?? null,
        netIncome: netIncome[0] ?? null,
        ebitda:    ebitda[0]    ?? null,
        eps,
        bookValue: bookValue[0] ?? null,
        netDebt:   netDebt[0]   ?? null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch", details: error.message });
  }
}

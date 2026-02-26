import { toYahoo } from "./_yahoo-map.js";
import { getYahooCrumb } from "./_yahoo-crumb.js";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";
const FETCH_TIMEOUT_MS = 8_000;

export default async function handler(req, res) {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: "Symbol is required" });

  const yahooSymbol = toYahoo(symbol);
  const modules = "incomeStatementHistory,balanceSheetHistory,defaultKeyStatistics,summaryDetail";

  try {
    const { crumb, cookieStr } = await getYahooCrumb();

    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(yahooSymbol)}?modules=${modules}&crumb=${encodeURIComponent(crumb)}`;
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    const response = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": UA,
        "Cookie": cookieStr,
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    clearTimeout(timeout);

    const json = await response.json();

    const summary = json?.quoteSummary?.result?.[0];
    if (!summary) return res.status(404).json({ error: "No data", raw: json?.quoteSummary?.error });

    const income  = summary.incomeStatementHistory?.incomeStatementHistory || [];
    const balance = summary.balanceSheetHistory?.balanceSheetStatements   || [];
    const stats   = summary.defaultKeyStatistics || {};
    const detail  = summary.summaryDetail || {};

    // Allow response even without income statements — quote data is still useful
    if (income.length === 0 && !Object.keys(detail).length) {
      return res.status(404).json({ error: "No financial data" });
    }

    const years     = income.map(s => new Date(s.endDate.raw * 1000).getFullYear()).slice(0, 4);
    const revenue   = income.map(s => s.totalRevenue?.raw    ?? null).slice(0, 4);
    const netIncome = income.map(s => s.netIncome?.raw       ?? null).slice(0, 4);
    const ebitda    = income.map(s => s.ebitda?.raw          ?? null).slice(0, 4);
    const eps       = stats.trailingEps?.raw ?? null;

    // bookValue per share comes from defaultKeyStatistics (already PLN/share)
    const bvps    = stats.bookValue?.raw ?? null;
    const netDebt = balance.map(s => {
      const debt = (s.shortLongTermDebt?.raw ?? 0) + (s.longTermDebt?.raw ?? 0);
      const cash = s.cash?.raw ?? 0;
      return debt - cash;
    }).slice(0, 4);

    // Divide financials by 1e6 so frontend fmtBig() displays values in millions
    const toMln = v => (v !== null && v !== undefined) ? v / 1e6 : null;

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");
    res.status(200).json({
      symbol: symbol.toLowerCase(),
      years,
      annual: years.map((year, i) => ({
        year,
        revenue:   toMln(revenue[i]),
        netIncome: toMln(netIncome[i]),
        ebitda:    toMln(ebitda[i]),
      })),
      current: {
        revenue:   toMln(revenue[0]),
        netIncome: toMln(netIncome[0]),
        ebitda:    toMln(ebitda[0]),
        eps,
        bookValue: bvps,
        netDebt:   toMln(netDebt[0]),
      },
      quote: {
        fiftyTwoWeekLow:  detail.fiftyTwoWeekLow?.raw  ?? null,
        fiftyTwoWeekHigh: detail.fiftyTwoWeekHigh?.raw ?? null,
        averageVolume:    detail.averageDailyVolume10Day?.raw ?? detail.averageVolume?.raw ?? null,
        averageVolume3M:  detail.averageVolume?.raw ?? null,
        marketCap:        detail.marketCap?.raw ?? null,
        trailingPE:       detail.trailingPE?.raw ?? null,
        priceToBook:      stats.priceToBook?.raw ?? null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch", details: error.message });
  }
}

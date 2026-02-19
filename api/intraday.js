import { toYahoo, YF_HEADERS } from "./yahoo-map.js";

export default async function handler(req, res) {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: "Symbol is required" });

  const yahooSymbol = toYahoo(symbol);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=5m&range=1d`;

  try {
    const response = await fetch(url, { headers: YF_HEADERS });
    const json = await response.json();

    const result = json?.chart?.result?.[0];
    if (!result) return res.status(404).json({ error: "No data" });

    const timestamps = result.timestamp || [];
    const quote = result.indicators?.quote?.[0] || {};
    const rawOpens  = quote.open  || [];
    const rawHighs  = quote.high  || [];
    const rawLows   = quote.low   || [];
    const rawCloses = quote.close || [];

    if (timestamps.length < 2) return res.status(404).json({ error: "No data" });

    const prices = timestamps
      .map((ts, i) => ({
        time:  new Date(ts * 1000).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" }),
        open:  rawOpens[i],
        high:  rawHighs[i],
        low:   rawLows[i],
        close: rawCloses[i],
      }))
      .filter(p => p.close !== null && !isNaN(p.close));

    res.status(200).json({ prices });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
}

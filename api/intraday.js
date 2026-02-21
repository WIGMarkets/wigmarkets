import { toYahoo, YF_HEADERS } from "./yahoo-map.js";

export default async function handler(req, res) {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: "Symbol is required" });

  const yahooSymbol = toYahoo(symbol);
  // Use range=5d to ensure we get data even outside market hours / on weekends.
  // We filter down to the last trading day's bars below.
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=5m&range=5d`;

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
    const rawVolumes = quote.volume || [];

    if (timestamps.length < 2) return res.status(404).json({ error: "No data" });

    // Build all bars with date info for grouping by day
    const allBars = timestamps
      .map((ts, i) => {
        const d = new Date(ts * 1000);
        return {
          dateKey: d.toLocaleDateString("pl-PL", { timeZone: "Europe/Warsaw" }),
          time: d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" }),
          open:  rawOpens[i],
          high:  rawHighs[i],
          low:   rawLows[i],
          close: rawCloses[i],
          volume: rawVolumes[i] ?? null,
        };
      })
      .filter(p => p.close !== null && !isNaN(p.close));

    if (!allBars.length) return res.status(404).json({ error: "No data" });

    // Get the last trading day's data
    const lastDate = allBars[allBars.length - 1].dateKey;
    const prices = allBars
      .filter(b => b.dateKey === lastDate)
      .map(({ dateKey, ...rest }) => rest);

    res.status(200).json({ prices });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
}

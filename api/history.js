import { toYahoo, YF_HEADERS } from "./_yahoo-map.js";

export default async function handler(req, res) {
  const { symbol, interval: reqInterval } = req.query;
  if (!symbol) return res.status(400).json({ error: "Symbol is required" });

  const interval = reqInterval === "1h" ? "1h" : "1d";
  const range = interval === "1h" ? "7d" : "1y";

  const yahooSymbol = toYahoo(symbol);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=${interval}&range=${range}`;

  try {
    const response = await fetch(url, { headers: YF_HEADERS });
    const json = await response.json();

    const result = json?.chart?.result?.[0];
    if (!result) return res.status(404).json({ error: "No data" });

    const timestamps = result.timestamp || [];
    const quote      = result.indicators?.quote?.[0] || {};
    const rawOpens   = quote.open  || [];
    const rawHighs   = quote.high  || [];
    const rawLows    = quote.low   || [];
    const rawCloses  = quote.close || [];
    const rawVolumes = quote.volume || [];

    if (timestamps.length < 2) return res.status(404).json({ error: "No data" });

    const prices = timestamps
      .map((ts, i) => {
        const d = new Date(ts * 1000);
        const bar = {
          date:  d.toISOString().slice(0, 10),
          open:  rawOpens[i],
          high:  rawHighs[i],
          low:   rawLows[i],
          close: rawCloses[i],
          volume: rawVolumes[i] ?? null,
        };
        if (interval === "1h") {
          bar.time = d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" });
        }
        return bar;
      })
      .filter(p => p.close !== null && !isNaN(p.close));

    res.status(200).json({ prices });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
}

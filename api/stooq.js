import { toYahoo, YF_HEADERS } from "./_yahoo-map.js";
import { fetchStooqQuote } from "./_stooq-fallback.js";

export default async function handler(req, res) {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: "symbol parameter required" });

  // ── Strategy 1: Yahoo Finance ──────────────────────────
  const yahooSymbol = toYahoo(symbol);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=10d`;

  try {
    const response = await fetch(url, { headers: YF_HEADERS });
    const json = await response.json();

    const result = json?.chart?.result?.[0];
    if (result) {
      const rawCloses = result.indicators?.quote?.[0]?.close || [];
      const closes = rawCloses.filter(c => c !== null && !isNaN(c));

      if (closes.length >= 1) {
        const today     = closes[closes.length - 1];
        const yesterday = closes.length >= 2 ? closes[closes.length - 2] : today;
        const weekAgo   = closes.length >= 6 ? closes[closes.length - 6] : yesterday;

        const rawVolumes = result.indicators?.quote?.[0]?.volume || [];
        const volume = rawVolumes[rawVolumes.length - 1] || 0;

        const change24h = yesterday ? ((today - yesterday) / yesterday) * 100 : 0;
        const change7d  = weekAgo   ? ((today - weekAgo)   / weekAgo)   * 100 : 0;

        return res.status(200).json({
          symbol,
          close: today,
          volume,
          change24h: parseFloat(change24h.toFixed(2)),
          change7d:  parseFloat(change7d.toFixed(2)),
        });
      }
    }
  } catch {
    // Yahoo failed, fall through to Stooq
  }

  // ── Strategy 2: Stooq.pl CSV fallback ──────────────────
  try {
    const stooqData = await fetchStooqQuote(symbol);
    if (stooqData) {
      return res.status(200).json({
        symbol,
        close: stooqData.close,
        volume: stooqData.volume,
        change24h: stooqData.change24h,
        change7d: stooqData.change7d,
      });
    }
  } catch {
    // Stooq also failed
  }

  res.status(404).json({ error: "No data" });
}

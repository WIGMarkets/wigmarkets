import { toYahoo, YF_HEADERS } from "./yahoo-map.js";

const BATCH_SIZE = 15;
const BATCH_DELAY_MS = 100;

async function fetchYahooSymbol(yahooSymbol, retries = 2) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=10d`;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, { headers: YF_HEADERS });
      if (response.status === 429 || response.status >= 500) {
        if (attempt < retries) { await new Promise(r => setTimeout(r, 500 * (attempt + 1))); continue; }
        return null;
      }
      const json = await response.json();

      const result = json?.chart?.result?.[0];
      if (!result) return null;

      const rawCloses = result.indicators?.quote?.[0]?.close || [];
      const closes = rawCloses.filter(c => c !== null && !isNaN(c));
      if (closes.length < 1) return null;

      const today = closes[closes.length - 1];
      const yesterday = closes.length >= 2 ? closes[closes.length - 2] : today;
      const weekAgo   = closes.length >= 6 ? closes[closes.length - 6] : yesterday;

      const rawVolumes = result.indicators?.quote?.[0]?.volume || [];
      const volume = rawVolumes[rawVolumes.length - 1] || 0;

      const change24h = yesterday ? ((today - yesterday) / yesterday) * 100 : 0;
      const change7d  = weekAgo   ? ((today - weekAgo)   / weekAgo)   * 100 : 0;

      return {
        close:     today,
        volume,
        change24h: parseFloat(change24h.toFixed(2)),
        change7d:  parseFloat(change7d.toFixed(2)),
      };
    } catch {
      if (attempt < retries) { await new Promise(r => setTimeout(r, 500 * (attempt + 1))); continue; }
      return null;
    }
  }
  return null;
}

export default async function handler(req, res) {
  const { symbols } = req.query;
  if (!symbols) return res.status(400).json({ error: "symbols parameter required (comma-separated)" });

  const list = symbols.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).slice(0, 300);
  const entries = list.map(s => ({ stooq: s, yahoo: toYahoo(s) }));
  const data = {};

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(({ yahoo }) => fetchYahooSymbol(yahoo))
    );
    for (let j = 0; j < batch.length; j++) {
      const r = results[j];
      if (r.status === "fulfilled" && r.value) {
        data[batch[j].stooq] = r.value;
      }
    }
    if (i + BATCH_SIZE < entries.length) {
      await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
  res.status(200).json(data);
}

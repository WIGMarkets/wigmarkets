import { toYahoo, YF_HEADERS } from "./_yahoo-map.js";

export default async function handler(req, res) {
  const { symbol, interval: reqInterval } = req.query;
  if (!symbol) return res.status(400).json({ error: "Symbol is required" });

  const interval = reqInterval === "1h" ? "1h" : "1d";
  const range = interval === "1h" ? "7d" : "1y";

  // ── Strategy 1: Yahoo Finance ──────────────────────────
  const yahooSymbol = toYahoo(symbol);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=${interval}&range=${range}`;

  try {
    const response = await fetch(url, { headers: YF_HEADERS });
    const json = await response.json();

    const result = json?.chart?.result?.[0];
    if (result) {
      const timestamps = result.timestamp || [];
      const quote      = result.indicators?.quote?.[0] || {};
      const rawOpens   = quote.open  || [];
      const rawHighs   = quote.high  || [];
      const rawLows    = quote.low   || [];
      const rawCloses  = quote.close || [];
      const rawVolumes = quote.volume || [];

      if (timestamps.length >= 2) {
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

        if (prices.length >= 2) {
          return res.status(200).json({ prices });
        }
      }
    }
  } catch {
    // Yahoo failed, fall through to Stooq
  }

  // ── Strategy 2: Stooq.pl CSV fallback (daily only) ─────
  if (interval === "1d") {
    try {
      const stooqPrices = await fetchStooqHistory(symbol, range === "1y" ? 400 : 14);
      if (stooqPrices && stooqPrices.length >= 2) {
        return res.status(200).json({ prices: stooqPrices });
      }
    } catch {
      // Stooq also failed
    }
  }

  res.status(404).json({ error: "No data" });
}

// ─── Stooq historical OHLCV ───────────────────────────────

async function fetchStooqHistory(stooqSymbol, days = 400) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days);

  const d1 = fmtDate(start);
  const d2 = fmtDate(end);
  const url = `https://stooq.pl/q/d/l/?s=${stooqSymbol.toLowerCase()}&d1=${d1}&d2=${d2}&i=d`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "text/csv, text/plain, */*",
    },
  });

  if (!res.ok) return null;

  const csv = await res.text();
  const lines = csv.trim().split("\n");
  if (lines.length < 3) return null;

  const prices = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 5) continue;

    const close = parseFloat(cols[4]);
    if (isNaN(close) || close <= 0) continue;

    prices.push({
      date: cols[0].trim(),
      open: parseFloat(cols[1]) || close,
      high: parseFloat(cols[2]) || close,
      low: parseFloat(cols[3]) || close,
      close,
      volume: parseInt(cols[5]) || 0,
    });
  }

  return prices.length >= 2 ? prices : null;
}

function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

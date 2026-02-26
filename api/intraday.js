import { createRequire } from "module";
import { toYahoo, YF_HEADERS } from "./_yahoo-map.js";

// Bundled daily cache for GPW indices fallback
const require2 = createRequire(import.meta.url);
let CACHE = { indices: [], history: {} };
try { CACHE = require2("../data/indices-cache.json"); } catch {}

const INDEX_STOOQ_SYMBOLS = new Set(["wig20", "wig", "mwig40", "swig80"]);
const FETCH_TIMEOUT_MS = 8_000;

export default async function handler(req, res) {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: "Symbol is required" });

  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");

  // ── Strategy 1: Stooq.pl 5-min bars (primary) ─────────
  try {
    const stooqPrices = await fetchStooqIntraday(symbol);
    if (stooqPrices && stooqPrices.length >= 2) {
      return res.status(200).json({ prices: stooqPrices });
    }
  } catch {
    // Stooq failed, fall through to Yahoo
  }

  // ── Strategy 2: Yahoo Finance (fallback) ───────────────
  try {
    const yahooSymbol = toYahoo(symbol);
    // Use range=5d to ensure we get data even outside market hours / on weekends.
    // We filter down to the last trading day's bars below.
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=5m&range=5d`;
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    const response = await fetch(url, { signal: ctrl.signal, headers: YF_HEADERS });
    clearTimeout(timeout);
    const json = await response.json();

    const result = json?.chart?.result?.[0];
    if (result) {
      const timestamps = result.timestamp || [];
      const quote = result.indicators?.quote?.[0] || {};
      const rawOpens  = quote.open  || [];
      const rawHighs  = quote.high  || [];
      const rawLows   = quote.low   || [];
      const rawCloses = quote.close || [];
      const rawVolumes = quote.volume || [];

      if (timestamps.length >= 2) {
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

        if (allBars.length) {
          // Get the last trading day's data
          const lastDate = allBars[allBars.length - 1].dateKey;
          const prices = allBars
            .filter(b => b.dateKey === lastDate)
            .map(({ dateKey, ...rest }) => rest);

          if (prices.length >= 2) {
            return res.status(200).json({ prices });
          }
        }
      }
    }
  } catch {
    // Yahoo also failed
  }

  // ── Strategy 3: Daily data fallback (GPW indices) ─────────
  // Stooq/Yahoo don't serve 5-min bars for GPW indices (^WIG, ^WIG20 etc.)
  // Fall back to recent daily bars so the chart shows *something* useful.
  if (INDEX_STOOQ_SYMBOLS.has(symbol.toLowerCase())) {
    try {
      const dailyPrices = await fetchStooqDaily(symbol);
      if (dailyPrices && dailyPrices.length >= 2) {
        return res.status(200).json({ prices: dailyPrices });
      }
    } catch {}

    // Bundled cache as last resort
    const cached = CACHE.history?.[symbol.toLowerCase()];
    if (Array.isArray(cached) && cached.length >= 2) {
      return res.status(200).json({ prices: cached.slice(-5) });
    }
  }

  res.status(404).json({ error: "No data" });
}

// ─── Stooq daily bars (fallback for indices) ────────────────

async function fetchStooqDaily(stooqSymbol) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 10);
  const d1 = fmtDate(start);
  const d2 = fmtDate(end);
  const url = `https://stooq.pl/q/d/l/?s=${stooqSymbol.toLowerCase()}&d1=${d1}&d2=${d2}&i=d`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const res = await fetch(url, {
    signal: controller.signal,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "text/csv, text/plain, */*",
    },
  });
  clearTimeout(timeout);
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

// ─── Stooq 5-min intraday CSV ──────────────────────────────

async function fetchStooqIntraday(stooqSymbol) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 5); // 5 days to cover weekends

  const d1 = fmtDate(start);
  const d2 = fmtDate(end);
  const url = `https://stooq.pl/q/d/l/?s=${stooqSymbol.toLowerCase()}&d1=${d1}&d2=${d2}&i=5`;

  for (let attempt = 0; attempt <= 1; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "text/csv, text/plain, */*",
        },
      });
      clearTimeout(timeout);

      if (!res.ok) {
        if (attempt < 1) { await new Promise(r => setTimeout(r, 300)); continue; }
        return null;
      }

      const csv = await res.text();
      const lines = csv.trim().split("\n");
      if (lines.length < 3) return null;

      // Intraday CSV: Date,Time,Open,High,Low,Close,Volume (7 cols)
      // or: Data,Czas,Otwarcie,Najwyzszy,Najnizszy,Zamkniecie,Wolumen
      const allBars = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");
        if (cols.length < 6) continue;

        const dateCol = cols[0].trim();
        const timeCol = cols[1].trim();
        const close = parseFloat(cols[5]);
        if (isNaN(close) || close <= 0) continue;

        allBars.push({
          dateKey: dateCol,
          time: timeCol.slice(0, 5), // "HH:MM"
          open:  parseFloat(cols[2]) || close,
          high:  parseFloat(cols[3]) || close,
          low:   parseFloat(cols[4]) || close,
          close,
          volume: parseInt(cols[6]) || 0,
        });
      }

      if (allBars.length < 2) return null;

      // Get last trading day's bars
      const lastDate = allBars[allBars.length - 1].dateKey;
      const prices = allBars
        .filter(b => b.dateKey === lastDate)
        .map(({ dateKey, ...rest }) => rest);

      return prices.length >= 2 ? prices : null;
    } catch {
      if (attempt < 1) { await new Promise(r => setTimeout(r, 300)); continue; }
      return null;
    }
  }
  return null;
}

function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

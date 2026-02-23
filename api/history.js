import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { toYahoo, YF_HEADERS } from "./_yahoo-map.js";

// Index symbols that have cached history in data/indices-cache.json
const INDEX_STOOQ_SYMBOLS = new Set(["wig20", "wig", "mwig40", "swig80"]);

export default async function handler(req, res) {
  const { symbol, interval: reqInterval } = req.query;
  if (!symbol) return res.status(400).json({ error: "Symbol is required" });

  const interval = reqInterval === "1h" ? "1h" : "1d";
  const range = interval === "1h" ? "7d" : "1y";

  // Edge cache: 5 min for daily, 1 min for hourly
  const maxAge = interval === "1h" ? 60 : 300;
  res.setHeader("Cache-Control", `s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`);

  // ── Strategy 1: Stooq.pl (primary) ────────────────────
  try {
    const days = interval === "1h" ? 10 : 400;
    const stooqInterval = interval === "1h" ? "60" : "d";
    const stooqPrices = await fetchStooqHistory(symbol, days, stooqInterval);
    if (stooqPrices && stooqPrices.length >= 2) {
      return res.status(200).json({ prices: stooqPrices });
    }
  } catch {
    // Stooq failed, fall through to Yahoo
  }

  // ── Strategy 2: Yahoo Finance (fallback) ───────────────
  try {
    const yahooSymbol = toYahoo(symbol);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=${interval}&range=${range}`;
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
    // Yahoo also failed
  }

  // ── Strategy 3: Static cache fallback (for GPW indices) ─
  if (interval === "1d" && INDEX_STOOQ_SYMBOLS.has(symbol.toLowerCase())) {
    const cached = readCachedHistory(symbol.toLowerCase());
    if (cached && cached.length >= 2) {
      return res.status(200).json({ prices: cached });
    }
  }

  res.status(404).json({ error: "No data" });
}

// ─── Read cached history from data/indices-cache.json ────

function readCachedHistory(stooqSymbol) {
  const paths = [
    join(process.cwd(), "data", "indices-cache.json"),
  ];
  try {
    const dir = typeof __dirname !== "undefined"
      ? __dirname
      : dirname(fileURLToPath(import.meta.url));
    paths.push(join(dir, "..", "data", "indices-cache.json"));
  } catch {}

  for (const p of paths) {
    try {
      if (existsSync(p)) {
        const data = JSON.parse(readFileSync(p, "utf-8"));
        const history = data?.history?.[stooqSymbol];
        if (Array.isArray(history) && history.length >= 2) return history;
      }
    } catch {}
  }
  return null;
}

// ─── Stooq historical OHLCV ───────────────────────────────
// interval: "d" (daily), "60" (hourly), "5" (5-min)

async function fetchStooqHistory(stooqSymbol, days = 400, interval = "d") {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days);

  const d1 = fmtDate(start);
  const d2 = fmtDate(end);
  const url = `https://stooq.pl/q/d/l/?s=${stooqSymbol.toLowerCase()}&d1=${d1}&d2=${d2}&i=${interval}`;

  for (let attempt = 0; attempt <= 2; attempt++) {
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
        if (attempt < 2) { await new Promise(r => setTimeout(r, 300)); continue; }
        return null;
      }

      const csv = await res.text();
      const lines = csv.trim().split("\n");
      if (lines.length < 3) return null;

      // Detect column layout from header
      // Daily: Date,Open,High,Low,Close,Volume (6 cols)
      // Intraday: Date,Time,Open,High,Low,Close,Volume (7 cols)
      const headerCols = lines[0].split(",").length;
      const hasTime = headerCols >= 7;

      const prices = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");
        if (cols.length < (hasTime ? 6 : 5)) continue;

        const dateCol = cols[0].trim();
        const offset = hasTime ? 1 : 0;
        const timeCol = hasTime ? cols[1].trim() : null;

        const open  = parseFloat(cols[1 + offset]);
        const high  = parseFloat(cols[2 + offset]);
        const low   = parseFloat(cols[3 + offset]);
        const close = parseFloat(cols[4 + offset]);
        const vol   = parseInt(cols[5 + offset]) || 0;
        if (isNaN(close) || close <= 0) continue;

        const bar = {
          date: dateCol,
          open:  isNaN(open)  ? close : open,
          high:  isNaN(high)  ? close : high,
          low:   isNaN(low)   ? close : low,
          close,
          volume: vol,
        };
        if (timeCol) bar.time = timeCol;

        prices.push(bar);
      }

      return prices.length >= 2 ? prices : null;
    } catch {
      if (attempt < 2) { await new Promise(r => setTimeout(r, 300)); continue; }
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

import { createRequire } from "module";
import { YF_HEADERS } from "./_yahoo-map.js";

// ─── Bundled cache data (guaranteed available on Vercel) ─────────
// createRequire resolves relative to this file → always bundled
const require = createRequire(import.meta.url);
let CACHE = { indices: [], history: {} };
try { CACHE = require("../data/indices-cache.json"); } catch {}

const INDEX_SYMBOLS = [
  { name: "WIG20",  yahoo: "^WIG20",  stooq: "wig20"  },
  { name: "WIG",    yahoo: "^WIG",    stooq: "wig"    },
  { name: "mWIG40", yahoo: "^MWIG40", stooq: "mwig40" },
  { name: "sWIG80", yahoo: "^SWIG80", stooq: "swig80" },
];

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

// ─── Stooq.pl historical CSV fetcher ────────────────────────────
async function fetchFromStooq(stooqSymbol) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 35);
  const d1 = start.toISOString().slice(0, 10).replace(/-/g, "");
  const d2 = end.toISOString().slice(0, 10).replace(/-/g, "");
  const url = `https://stooq.pl/q/d/l/?s=${stooqSymbol}&d1=${d1}&d2=${d2}&i=d`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": UA,
        Accept: "text/csv, text/plain, */*",
      },
    });
    clearTimeout(timeout);
    if (!res.ok) {
      console.log(`[indices] Stooq historical ${stooqSymbol}: HTTP ${res.status}`);
      return null;
    }
    const csv = await res.text();
    const parsed = parseCSV(csv);
    if (parsed) {
      console.log(`[indices] Stooq historical ${stooqSymbol}: OK, value=${parsed.value}, latest date=${csv.trim().split("\n").pop()?.split(",")[0]}`);
    } else {
      console.log(`[indices] Stooq historical ${stooqSymbol}: parsed null, csv length=${csv.length}, lines=${csv.trim().split("\n").length}`);
    }
    return parsed;
  } catch (err) {
    console.log(`[indices] Stooq historical ${stooqSymbol}: error — ${err.message}`);
    return null;
  }
}

function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  if (lines.length < 3) return null;
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 5) continue;
    const close = parseFloat(cols[4]);
    if (isNaN(close) || close <= 0) continue;
    rows.push({ date: cols[0].trim(), close });
  }
  if (rows.length < 2) return null;
  const latest = rows[rows.length - 1];
  const prev = rows[rows.length - 2];
  const weekAgo = rows[Math.max(0, rows.length - 6)];
  return {
    value: latest.close,
    change24h: parseFloat((((latest.close - prev.close) / prev.close) * 100).toFixed(2)),
    change7d: parseFloat((((latest.close - weekAgo.close) / weekAgo.close) * 100).toFixed(2)),
    sparkline: rows.map(r => ({ date: r.date, close: r.close })),
  };
}

// ─── Stooq.pl quote endpoint (latest single quote) ─────────────
async function fetchFromStooqQuote(stooqSymbol) {
  // This endpoint returns a single CSV line with the latest quote
  const url = `https://stooq.pl/q/l/?s=${stooqSymbol}&f=sd2t2ohlcv&h&e=csv`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": UA,
        Accept: "text/csv, text/plain, */*",
      },
    });
    clearTimeout(timeout);
    if (!res.ok) {
      console.log(`[indices] Stooq quote ${stooqSymbol}: HTTP ${res.status}`);
      return null;
    }
    const csv = await res.text();
    const lines = csv.trim().split("\n");
    if (lines.length < 2) {
      console.log(`[indices] Stooq quote ${stooqSymbol}: too few lines`);
      return null;
    }
    // Header: Symbol,Date,Time,Open,High,Low,Close,Volume
    const cols = lines[1].split(",");
    if (cols.length < 7) {
      console.log(`[indices] Stooq quote ${stooqSymbol}: bad columns: ${lines[1]}`);
      return null;
    }
    const close = parseFloat(cols[6]);
    if (isNaN(close) || close <= 0) {
      console.log(`[indices] Stooq quote ${stooqSymbol}: invalid close: ${cols[6]}`);
      return null;
    }
    console.log(`[indices] Stooq quote ${stooqSymbol}: OK, value=${close}, date=${cols[1]}, time=${cols[2]}`);
    // Return just the value — no sparkline/change from this endpoint
    return { value: close, date: cols[1] };
  } catch (err) {
    console.log(`[indices] Stooq quote ${stooqSymbol}: error — ${err.message}`);
    return null;
  }
}

// ─── Yahoo Finance fetcher ───────────────────────────────────────
async function fetchFromYahoo(yahooSymbol) {
  // Try query2 first (often less rate-limited), then query1
  for (const host of ["query2.finance.yahoo.com", "query1.finance.yahoo.com"]) {
    const url = `https://${host}/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1mo`;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, { signal: controller.signal, headers: YF_HEADERS });
      clearTimeout(timeout);
      if (!res.ok) {
        console.log(`[indices] Yahoo ${yahooSymbol} via ${host}: HTTP ${res.status}`);
        continue;
      }
      const json = await res.json();
      const result = json?.chart?.result?.[0];
      if (!result) {
        console.log(`[indices] Yahoo ${yahooSymbol} via ${host}: no chart result`);
        continue;
      }
      const timestamps = result.timestamp || [];
      const rawCloses = result.indicators?.quote?.[0]?.close || [];
      const closes = rawCloses.filter(c => c != null && !isNaN(c) && c > 0);
      if (closes.length < 2) {
        console.log(`[indices] Yahoo ${yahooSymbol} via ${host}: too few closes (${closes.length})`);
        continue;
      }
      const today = closes[closes.length - 1];
      const yesterday = closes[closes.length - 2];
      const weekAgo = closes[Math.max(0, closes.length - 6)];
      const sparkline = timestamps
        .map((ts, i) => ({ date: new Date(ts * 1000).toISOString().slice(0, 10), close: rawCloses[i] }))
        .filter(p => p.close != null && !isNaN(p.close) && p.close > 0);
      console.log(`[indices] Yahoo ${yahooSymbol} via ${host}: OK, value=${today}`);
      return {
        value: today,
        change24h: parseFloat((((today - yesterday) / yesterday) * 100).toFixed(2)),
        change7d: parseFloat((((today - weekAgo) / weekAgo) * 100).toFixed(2)),
        sparkline,
      };
    } catch (err) {
      console.log(`[indices] Yahoo ${yahooSymbol} via ${host}: error — ${err.message}`);
    }
  }
  return null;
}

// ─── Fetch single index (live sources) ───────────────────────────
async function fetchLiveIndex({ name, yahoo, stooq }) {
  // Strategy 1: Stooq historical CSV (includes sparkline + changes)
  const stooqData = await fetchFromStooq(stooq);
  if (stooqData) return { name, ...stooqData, _source: "stooq-hist" };

  // Strategy 2: Yahoo Finance chart
  const yahooData = await fetchFromYahoo(yahoo);
  if (yahooData) return { name, ...yahooData, _source: "yahoo" };

  // Strategy 3: Stooq single quote (value only, no sparkline)
  const quoteData = await fetchFromStooqQuote(stooq);
  if (quoteData) {
    return {
      name,
      value: quoteData.value,
      change24h: null,
      change7d: null,
      sparkline: [],
      _source: "stooq-quote",
    };
  }

  console.log(`[indices] ${name}: ALL SOURCES FAILED`);
  return null;
}

// ─── Handler ─────────────────────────────────────────────────────
export default async function handler(req, res) {
  const startTime = Date.now();

  // Build cache lookup map
  const cacheMap = {};
  for (const idx of (CACHE.indices || [])) {
    cacheMap[idx.name] = idx;
  }

  // Start with cache data as baseline (always available)
  const baseline = INDEX_SYMBOLS.map(({ name }) =>
    cacheMap[name] || { name, value: null, change24h: null, change7d: null, sparkline: [] }
  );

  // Try fetching live data in parallel (non-blocking, with timeout)
  try {
    const liveResults = await Promise.all(INDEX_SYMBOLS.map(fetchLiveIndex));
    const hasLive = liveResults.some(r => r != null);
    const elapsed = Date.now() - startTime;

    console.log(`[indices] Results (${elapsed}ms):`, liveResults.map(r =>
      r ? `${r.name}=${r.value} (${r._source})` : "null"
    ).join(", "));

    if (hasLive) {
      // Merge: use live where available, fall back to cache per-index
      const merged = INDEX_SYMBOLS.map(({ name }, i) => {
        const live = liveResults[i];
        if (live) {
          const { _source, ...data } = live;
          return data;
        }
        return cacheMap[name] || baseline[i];
      });
      res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
      return res.status(200).json(merged);
    }
  } catch (err) {
    console.log(`[indices] Live fetch error: ${err.message}`);
  }

  // Return cached data
  console.log("[indices] All live sources failed, returning bundled cache");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
  res.status(200).json(baseline);
}

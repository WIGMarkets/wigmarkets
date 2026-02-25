import { createRequire } from "module";
import { YF_HEADERS } from "./_yahoo-map.js";

// ─── Bundled cache data (guaranteed available on Vercel) ─────────
const require = createRequire(import.meta.url);
let CACHE = { indices: [], history: {} };
try { CACHE = require("../data/indices-cache.json"); } catch {}

// Yahoo Finance uses .WA suffix for Polish indices (NOT ^ prefix)
const INDEX_SYMBOLS = [
  { name: "WIG20",  yahoo: "WIG20.WA",  stooq: "wig20"  },
  { name: "WIG",    yahoo: "WIG.WA",    stooq: "wig"    },
  { name: "mWIG40", yahoo: "MWIG40.WA", stooq: "mwig40" },
  { name: "sWIG80", yahoo: "SWIG80.WA", stooq: "swig80" },
];

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

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
      headers: { "User-Agent": UA, Accept: "text/csv, text/plain, */*" },
    });
    clearTimeout(timeout);
    if (!res.ok) {
      console.log(`[indices] Stooq hist ${stooqSymbol}: HTTP ${res.status}`);
      return null;
    }
    const csv = await res.text();
    const parsed = parseCSV(csv);
    if (parsed) {
      const lastLine = csv.trim().split("\n").pop()?.split(",")[0];
      console.log(`[indices] Stooq hist ${stooqSymbol}: OK, value=${parsed.value}, date=${lastLine}`);
    } else {
      console.log(`[indices] Stooq hist ${stooqSymbol}: parsed null, lines=${csv.trim().split("\n").length}`);
    }
    return parsed;
  } catch (err) {
    console.log(`[indices] Stooq hist ${stooqSymbol}: ${err.name === "AbortError" ? "timeout" : err.message}`);
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

// ─── Yahoo Finance fetcher ───────────────────────────────────────
async function fetchFromYahoo(yahooSymbol) {
  // Try both Yahoo hosts — query2 is often less rate-limited
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
        console.log(`[indices] Yahoo ${yahooSymbol} via ${host}: only ${closes.length} close(s)`);
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
      console.log(`[indices] Yahoo ${yahooSymbol} via ${host}: ${err.name === "AbortError" ? "timeout" : err.message}`);
    }
  }
  return null;
}

// ─── Handler ─────────────────────────────────────────────────────
export default async function handler(req, res) {
  const startTime = Date.now();

  // Build cache lookup map from bundled data
  const cacheMap = {};
  for (const idx of (CACHE.indices || [])) {
    cacheMap[idx.name] = idx;
  }

  // Baseline: bundled cache (always available, may be old)
  const baseline = INDEX_SYMBOLS.map(({ name }) =>
    cacheMap[name] || { name, value: null, change24h: null, change7d: null, sparkline: [] }
  );

  // Fetch live data SEQUENTIALLY to avoid rate-limiting
  // (Stooq limits ~3 req/s, parallel requests all fail)
  const results = new Array(INDEX_SYMBOLS.length).fill(null);

  // Strategy 1: Try Stooq sequentially with 400ms delays
  for (let i = 0; i < INDEX_SYMBOLS.length; i++) {
    const { name, stooq } = INDEX_SYMBOLS[i];
    try {
      const data = await fetchFromStooq(stooq);
      if (data) {
        results[i] = { name, ...data, _source: "stooq" };
      }
    } catch (err) {
      console.log(`[indices] Stooq ${name}: unexpected error — ${err.message}`);
    }
    // Delay between Stooq requests to avoid rate limiting
    if (i < INDEX_SYMBOLS.length - 1) {
      await sleep(400);
    }
  }

  // Strategy 2: Try Yahoo for indices that Stooq didn't return
  const missingAfterStooq = INDEX_SYMBOLS
    .map((sym, i) => ({ ...sym, idx: i }))
    .filter((_, i) => results[i] == null);

  if (missingAfterStooq.length > 0) {
    console.log(`[indices] ${missingAfterStooq.length} missing after Stooq, trying Yahoo...`);
    for (const { name, yahoo, idx } of missingAfterStooq) {
      try {
        const data = await fetchFromYahoo(yahoo);
        if (data) {
          results[idx] = { name, ...data, _source: "yahoo" };
        }
      } catch (err) {
        console.log(`[indices] Yahoo ${name}: unexpected error — ${err.message}`);
      }
    }
  }

  const elapsed = Date.now() - startTime;
  const hasLive = results.some(r => r != null);

  console.log(`[indices] Done (${elapsed}ms): ${results.map((r, i) =>
    r ? `${r.name}=${r.value} (${r._source})` : `${INDEX_SYMBOLS[i].name}=MISS`
  ).join(", ")}`);

  if (hasLive) {
    // Merge: live where available, cache per-index otherwise
    const merged = INDEX_SYMBOLS.map(({ name }, i) => {
      const live = results[i];
      if (live) {
        const { _source, ...data } = live;
        return data;
      }
      return cacheMap[name] || baseline[i];
    });
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    return res.status(200).json(merged);
  }

  // All live sources failed — return bundled cache
  console.log("[indices] ALL SOURCES FAILED, returning bundled cache");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
  res.status(200).json(baseline);
}

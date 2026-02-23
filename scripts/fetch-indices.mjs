/**
 * Cron script: fetches current GPW index values + 1-year daily history from Stooq.
 * Writes to data/indices-cache.json for use as a fallback by /api/indices and /api/history.
 *
 * Usage:  node scripts/fetch-indices.mjs
 * Cron:   every 30 min Mon-Fri during GPW hours (see .github/workflows/fetch-indices.yml)
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";

const STOOQ_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

const INDICES = [
  { name: "WIG20",  stooq: "wig20"  },
  { name: "WIG",    stooq: "wig"    },
  { name: "mWIG40", stooq: "mwig40" },
  { name: "sWIG80", stooq: "swig80" },
];

// ─── Helpers ────────────────────────────────────────────

function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Stooq CSV fetcher with retry ──────────────────────

async function fetchStooqCSV(symbol, days, retries = 2) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days);

  const d1 = fmtDate(start);
  const d2 = fmtDate(end);
  const url = `https://stooq.pl/q/d/l/?s=${symbol}&d1=${d1}&d2=${d2}&i=d`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": STOOQ_UA,
          Accept: "text/csv, text/plain, */*",
        },
      });
      clearTimeout(timeout);

      if (!res.ok) {
        console.warn(`  [RETRY] ${symbol}: HTTP ${res.status}`);
        if (attempt < retries) { await sleep(1000 * (attempt + 1)); continue; }
        return null;
      }

      const csv = await res.text();
      return parseCSV(csv);
    } catch (err) {
      console.warn(`  [RETRY] ${symbol}: ${err.message}`);
      if (attempt < retries) { await sleep(1000 * (attempt + 1)); continue; }
      return null;
    }
  }
  return null;
}

function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return null;

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 5) continue;

    const date  = cols[0].trim();
    const open  = parseFloat(cols[1]);
    const high  = parseFloat(cols[2]);
    const low   = parseFloat(cols[3]);
    const close = parseFloat(cols[4]);
    const vol   = parseInt(cols[5]) || 0;

    if (isNaN(close) || close <= 0) continue;

    rows.push({
      date,
      open:  isNaN(open)  ? close : open,
      high:  isNaN(high)  ? close : high,
      low:   isNaN(low)   ? close : low,
      close,
      volume: vol,
    });
  }

  return rows.length >= 1 ? rows : null;
}

// ─── Yahoo Finance fallback ─────────────────────────────

const YAHOO_MAP = {
  wig20:  "^WIG20",
  wig:    "^WIG",
  mwig40: "^MWIG40",
  swig80: "^SWIG80",
};

const YF_HEADERS = {
  "User-Agent": STOOQ_UA,
  Accept: "application/json",
};

async function fetchYahooHistory(symbol, retries = 2) {
  const yahooSymbol = YAHOO_MAP[symbol];
  if (!yahooSymbol) return null;

  const hosts = ["query1", "query2"];
  const encoded = encodeURIComponent(yahooSymbol);

  for (let attempt = 0; attempt <= retries; attempt++) {
    const host = hosts[attempt % hosts.length];
    const url = `https://${host}.finance.yahoo.com/v8/finance/chart/${encoded}?interval=1d&range=1y`;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(url, { signal: controller.signal, headers: YF_HEADERS });
      clearTimeout(timeout);

      if (res.status === 429 || res.status >= 500) {
        if (attempt < retries) { await sleep(1000 * (attempt + 1)); continue; }
        return null;
      }
      if (!res.ok) return null;

      const json = await res.json();
      const result = json?.chart?.result?.[0];
      if (!result) return null;

      const timestamps = result.timestamp || [];
      const quote = result.indicators?.quote?.[0] || {};
      const rawOpens  = quote.open  || [];
      const rawHighs  = quote.high  || [];
      const rawLows   = quote.low   || [];
      const rawCloses = quote.close || [];
      const rawVols   = quote.volume || [];

      const rows = [];
      for (let i = 0; i < timestamps.length; i++) {
        const close = rawCloses[i];
        if (close == null || isNaN(close) || close <= 0) continue;
        const d = new Date(timestamps[i] * 1000);
        rows.push({
          date:   d.toISOString().slice(0, 10),
          open:   rawOpens[i]  ?? close,
          high:   rawHighs[i]  ?? close,
          low:    rawLows[i]   ?? close,
          close,
          volume: rawVols[i]   ?? 0,
        });
      }
      return rows.length >= 1 ? rows : null;
    } catch {
      if (attempt < retries) { await sleep(1000 * (attempt + 1)); continue; }
      return null;
    }
  }
  return null;
}

// ─── Compute index summary from history rows ────────────

function computeSummary(name, rows) {
  if (!rows || rows.length === 0) return null;

  const latest     = rows[rows.length - 1];
  const prev       = rows.length >= 2 ? rows[rows.length - 2] : null;
  const weekAgoRow = rows.length >= 6 ? rows[rows.length - 6] : prev;

  const change24h = prev
    ? parseFloat((((latest.close - prev.close) / prev.close) * 100).toFixed(2))
    : null;
  const change7d = weekAgoRow
    ? parseFloat((((latest.close - weekAgoRow.close) / weekAgoRow.close) * 100).toFixed(2))
    : null;

  // Sparkline: last 35 trading days
  const sparkline = rows.slice(-35).map((r) => ({ date: r.date, close: r.close }));

  return {
    name,
    value: latest.close,
    change24h,
    change7d,
    sparkline,
    latestDate: latest.date,
  };
}

// ─── Main ───────────────────────────────────────────────

async function main() {
  console.log(`[${new Date().toISOString()}] Fetching GPW indices...`);

  // Load existing cache to preserve data if any fetch fails
  let existingCache = null;
  const cachePath = "data/indices-cache.json";
  try {
    if (existsSync(cachePath)) {
      existingCache = JSON.parse(readFileSync(cachePath, "utf-8"));
    }
  } catch {}

  const results = { indices: [], history: {}, updatedAt: new Date().toISOString() };

  for (const idx of INDICES) {
    console.log(`  Fetching ${idx.name} (${idx.stooq})...`);

    // Try Stooq first (1 year of daily data)
    let rows = await fetchStooqCSV(idx.stooq, 400);

    // Fallback to Yahoo Finance
    if (!rows || rows.length < 5) {
      console.log(`  Stooq failed for ${idx.name}, trying Yahoo...`);
      rows = await fetchYahooHistory(idx.stooq);
    }

    if (rows && rows.length >= 2) {
      const summary = computeSummary(idx.name, rows);
      if (summary) {
        results.indices.push(summary);
        results.history[idx.stooq] = rows;
        console.log(`  [OK] ${idx.name}: ${summary.value} (${summary.change24h >= 0 ? "+" : ""}${summary.change24h}%) — ${rows.length} bars, latest: ${summary.latestDate}`);
      }
    } else {
      console.warn(`  [FAIL] ${idx.name}: no data from any source`);
      // Preserve existing data if available
      if (existingCache) {
        const oldSummary = existingCache.indices?.find((i) => i.name === idx.name);
        const oldHistory = existingCache.history?.[idx.stooq];
        if (oldSummary) results.indices.push(oldSummary);
        if (oldHistory) results.history[idx.stooq] = oldHistory;
        console.log(`  [KEEP] Using previous cached data for ${idx.name}`);
      }
    }

    // Rate limit between requests
    await sleep(500);
  }

  if (results.indices.length === 0) {
    console.error("No index data fetched at all. Not writing cache.");
    process.exit(1);
  }

  // Ensure data/ directory exists
  if (!existsSync("data")) {
    mkdirSync("data", { recursive: true });
  }

  writeFileSync(cachePath, JSON.stringify(results, null, 2), "utf-8");
  console.log(`\nSaved ${results.indices.length} indices to ${cachePath}`);
  console.log(`History: ${Object.keys(results.history).map((k) => `${k}(${results.history[k].length})`).join(", ")}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

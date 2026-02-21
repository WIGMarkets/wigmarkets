/**
 * Stooq.pl CSV fallback for GPW stock data.
 *
 * Used when Yahoo Finance doesn't return data for a stock.
 * Stooq provides free CSV data for all GPW-listed companies.
 *
 * Rate limit: ~3 requests/second (350ms delay between requests).
 */

const STOOQ_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

/**
 * Fetch historical daily data from Stooq CSV API.
 * Returns { close, volume, change24h, change7d, sparkline } or null.
 */
export async function fetchStooqQuote(stooqSymbol, retries = 1) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 14); // 14 days to ensure >=6 trading days

  const d1 = fmtDate(start);
  const d2 = fmtDate(end);
  const url = `https://stooq.pl/q/d/l/?s=${stooqSymbol.toLowerCase()}&d1=${d1}&d2=${d2}&i=d`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": STOOQ_UA,
          Accept: "text/csv, text/plain, */*",
        },
      });
      clearTimeout(timeout);

      if (!res.ok) {
        if (attempt < retries) {
          await sleep(300);
          continue;
        }
        return null;
      }

      const csv = await res.text();
      return parseStooqCSV(csv);
    } catch {
      if (attempt < retries) {
        await sleep(300);
        continue;
      }
      return null;
    }
  }
  return null;
}

/**
 * Batch-fetch multiple stocks from Stooq with rate limiting.
 * Returns { [stooqSymbol]: { close, volume, change24h, change7d, sparkline } }
 */
export async function fetchStooqBatch(stooqSymbols, delayMs = 350) {
  const results = {};
  for (let i = 0; i < stooqSymbols.length; i++) {
    const sym = stooqSymbols[i];
    const data = await fetchStooqQuote(sym);
    if (data) {
      results[sym] = data;
    }
    if (i < stooqSymbols.length - 1) {
      await sleep(delayMs);
    }
  }
  return results;
}

// ─── Internal helpers ────────────────────────────────────

function parseStooqCSV(csv) {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return null;

  // Header: Data,Otwarcie,Najwyzszy,Najnizszy,Zamkniecie,Wolumen
  // (or English: Date,Open,High,Low,Close,Volume)
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 5) continue;

    const close = parseFloat(cols[4]);
    if (isNaN(close) || close <= 0) continue;

    const volume = parseInt(cols[5]) || 0;
    rows.push({ date: cols[0].trim(), close, volume });
  }

  if (rows.length < 1) return null;

  // Stooq returns oldest-first; last row is most recent
  const latest = rows[rows.length - 1];
  const prev = rows.length >= 2 ? rows[rows.length - 2] : null;
  const weekAgo = rows.length >= 6 ? rows[rows.length - 6] : prev;

  const change24h = prev
    ? parseFloat((((latest.close - prev.close) / prev.close) * 100).toFixed(2))
    : 0;
  const change7d = weekAgo
    ? parseFloat(
        (((latest.close - weekAgo.close) / weekAgo.close) * 100).toFixed(2)
      )
    : 0;

  return {
    close: latest.close,
    volume: latest.volume,
    change24h,
    change7d,
    sparkline: rows.map((r) => r.close),
  };
}

function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

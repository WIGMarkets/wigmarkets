export async function fetchStooq(symbol) {
  try {
    const res = await fetch(`/api/stooq?symbol=${symbol}`);
    const data = await res.json();
    return data;
  } catch { return null; }
}

export async function fetchBulk(symbols) {
  try {
    const res = await fetch(`/api/gpw-bulk?symbols=${symbols.join(",")}`);
    return await res.json();
  } catch { return {}; }
}

export async function fetchHistory(symbol) {
  try {
    const res = await fetch(`/api/history?symbol=${symbol}`);
    const data = await res.json();
    return data;
  } catch { return null; }
}

export async function fetchHourly(symbol) {
  try {
    const res = await fetch(`/api/history?symbol=${symbol}&interval=1h`);
    return await res.json();
  } catch { return null; }
}

export async function fetchIntraday(symbol) {
  try {
    const res = await fetch(`/api/intraday?symbol=${symbol}`);
    const data = await res.json();
    return data;
  } catch { return null; }
}

export async function fetchIndices() {
  try {
    const res = await fetch("/api/indices");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export async function fetchFundamentals(symbol) {
  try {
    const res = await fetch(`/api/fundamentals?symbol=${symbol}`);
    const data = await res.json();
    return data?.error ? null : data;
  } catch { return null; }
}

export async function fetchMarketNews() {
  try {
    const res = await fetch("/api/news?limit=30");
    return await res.json();
  } catch { return null; }
}

export async function fetchRedditTrends(tickers) {
  try {
    const res = await fetch(`/api/reddit?tickers=${tickers.join(",")}`);
    return await res.json();
  } catch { return { ranked: [], postsScanned: 0 }; }
}

export async function fetchFearGreed() {
  try {
    const res = await fetch("/api/fear-greed");
    if (!res.ok) return null;
    const data = await res.json();
    return data?.error ? null : data;
  } catch { return null; }
}

/**
 * Load the dynamic GPW stock list from Vercel KV (populated by the daily cron).
 * Returns { stocks, quotes, lastRefresh } on success, or null if KV is unavailable
 * or not yet populated — in which case the caller should fall back to STOCKS.
 */
export async function fetchDynamicList() {
  try {
    const res = await fetch("/api/gpw-screener");
    if (!res.ok) return null;
    const data = await res.json();
    return data?.ok ? data : null;
  } catch { return null; }
}

// ── localStorage cache with TTL ──────────────────────────────────────────────

const CACHE_PREFIX = "wm_cache_";

function cacheGet(key, maxAgeMs) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > maxAgeMs) return null;
    return data;
  } catch { return null; }
}

function cacheSet(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ ts: Date.now(), data }));
  } catch { /* quota exceeded — ignore */ }
}

// TTL constants (ms)
const TTL_STOCKS  = 2 * 60 * 1000;   // 2 min
const TTL_FEAR    = 60 * 60 * 1000;   // 1 hour
const TTL_NEWS    = 10 * 60 * 1000;   // 10 min
const TTL_INDICES = 2 * 60 * 1000;    // 2 min
const TTL_REDDIT  = 5 * 60 * 1000;    // 5 min

/**
 * Cached fetch helper: returns cached data immediately if available,
 * then fetches fresh data in the background and calls onFresh with the result.
 * If no cache, fetches synchronously and returns the result.
 */
async function cachedFetch(cacheKey, ttl, fetcher) {
  const cached = cacheGet(cacheKey, ttl);
  if (cached !== null) {
    // Fire background refresh (don't await)
    fetcher().then(data => { if (data) cacheSet(cacheKey, data); }).catch(() => {});
    return cached;
  }
  const data = await fetcher();
  if (data) cacheSet(cacheKey, data);
  return data;
}

// ── In-flight deduplication ─────────────────────────────────────────────────

const inflight = new Map();

function dedup(key, fn) {
  if (inflight.has(key)) return inflight.get(key);
  const promise = fn().finally(() => inflight.delete(key));
  inflight.set(key, promise);
  return promise;
}

// ── API functions ───────────────────────────────────────────────────────────

export async function fetchStooq(symbol) {
  try {
    const res = await fetch(`/api/stooq?symbol=${symbol}`);
    const data = await res.json();
    return data;
  } catch { return null; }
}

export async function fetchBulk(symbols) {
  const key = `bulk_${symbols.sort().join(",")}`;
  return dedup(key, async () => {
    try {
      const res = await fetch(`/api/gpw-bulk?symbols=${symbols.join(",")}`);
      return await res.json();
    } catch { return {}; }
  });
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
  return cachedFetch("indices", TTL_INDICES, async () => {
    try {
      const res = await fetch("/api/indices");
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      return arr.length > 0 ? arr : null;
    } catch { return null; }
  }).then(d => d || []);
}

export async function fetchFundamentals(symbol) {
  try {
    const res = await fetch(`/api/fundamentals?symbol=${symbol}`);
    const data = await res.json();
    return data?.error ? null : data;
  } catch { return null; }
}

export async function fetchMarketNews() {
  return cachedFetch("news", TTL_NEWS, async () => {
    try {
      const res = await fetch("/api/news");
      return await res.json();
    } catch { return null; }
  });
}

export async function fetchRedditTrends(tickers) {
  const key = `reddit_${tickers.sort().join(",")}`;
  return cachedFetch(key, TTL_REDDIT, async () => {
    try {
      const res = await fetch(`/api/reddit?tickers=${tickers.join(",")}`);
      return await res.json();
    } catch { return null; }
  }).then(d => d || { ranked: [], postsScanned: 0 });
}

export async function fetchFearGreed() {
  return cachedFetch("feargreed", TTL_FEAR, async () => {
    try {
      const res = await fetch("/api/fear-greed");
      if (!res.ok) return null;
      const data = await res.json();
      return data?.error ? null : data;
    } catch { return null; }
  });
}

/**
 * Load the dynamic GPW stock list from /api/gpw-screener.
 * Returns { stocks, quotes, lastRefresh } on success, or null if unavailable.
 */
export async function fetchDynamicList() {
  return cachedFetch("screener", TTL_STOCKS, async () => {
    try {
      const res = await fetch("/api/gpw-screener");
      if (!res.ok) return null;
      const data = await res.json();
      return data?.ok ? data : null;
    } catch { return null; }
  });
}

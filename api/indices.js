import { YF_HEADERS } from "./_yahoo-map.js";

// Indeksy GPW: Yahoo Finance (primary) + Stooq.pl (fallback)
const INDEX_SYMBOLS = [
  { name: "WIG20",  yahoo: "^WIG20",  stooq: "wig20"  },
  { name: "WIG",    yahoo: "^WIG",    stooq: "wig"    },
  { name: "mWIG40", yahoo: "^MWIG40", stooq: "mwig40" },
  { name: "sWIG80", yahoo: "^SWIG80", stooq: "swig80" },
];

// ─── Yahoo Finance (primary source) ────────────────────
async function fetchYFChart(symbol, retries = 2) {
  const hosts = ["query1", "query2"];
  const encoded = encodeURIComponent(symbol);
  const path = `/v8/finance/chart/${encoded}?interval=1d&range=1mo`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const host = hosts[attempt % hosts.length];
    const url  = `https://${host}.finance.yahoo.com${path}`;
    try {
      const res = await fetch(url, { headers: YF_HEADERS });
      if (res.status === 429 || res.status >= 500) {
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
          continue;
        }
        return null;
      }
      if (!res.ok) return null;
      const json = await res.json();
      const result = json?.chart?.result?.[0];
      if (result) return result;
    } catch {
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
        continue;
      }
    }
  }
  return null;
}

function parseYFResult(name, result) {
  if (!result) return null;

  const timestamps = result.timestamp || [];
  const rawCloses  = result.indicators?.quote?.[0]?.close || [];
  const closes = rawCloses.filter(c => c !== null && c !== undefined && !isNaN(c) && c > 0);
  if (closes.length < 1) return null;

  const today     = closes[closes.length - 1];
  const yesterday = closes.length >= 2 ? closes[closes.length - 2] : null;
  const change24h = yesterday != null
    ? parseFloat((((today - yesterday) / yesterday) * 100).toFixed(2))
    : null;

  const sparkline = timestamps
    .map((ts, i) => ({
      date:  new Date(ts * 1000).toISOString().slice(0, 10),
      close: rawCloses[i],
    }))
    .filter(p => p.close !== null && p.close !== undefined && !isNaN(p.close) && p.close > 0);

  // 7-day change: compare to close ~5 trading days ago (≈7 calendar days)
  const weekIdx = Math.max(0, closes.length - 6);
  const weekAgo = closes[weekIdx];
  const change7d = weekAgo != null
    ? parseFloat((((today - weekAgo) / weekAgo) * 100).toFixed(2))
    : null;

  return { name, value: today, change24h, change7d, sparkline };
}

// ─── Stooq.pl (fallback source) ────────────────────────
// Stooq CSV API: returns daily OHLCV data for Polish indices
async function fetchFromStooq(stooqSymbol, retries = 1) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 35);

  const d1 = start.toISOString().slice(0, 10).replace(/-/g, "");
  const d2 = end.toISOString().slice(0, 10).replace(/-/g, "");
  const url = `https://stooq.pl/q/d/l/?s=${stooqSymbol}&d1=${d1}&d2=${d2}&i=d`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "text/csv, text/plain, */*",
        },
      });
      if (!res.ok) {
        if (attempt < retries) { await new Promise(r => setTimeout(r, 300)); continue; }
        return null;
      }
      const text = await res.text();
      return parseStooqCSV(text);
    } catch {
      if (attempt < retries) { await new Promise(r => setTimeout(r, 300)); continue; }
      return null;
    }
  }
  return null;
}

function parseStooqCSV(csv) {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return null;

  // Header: Data,Otwarcie,Najwyzszy,Najnizszy,Zamkniecie,Wolumen
  // (or English: Date,Open,High,Low,Close,Volume)
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 5) continue;
    const date  = cols[0].trim();
    const close = parseFloat(cols[4]);
    if (isNaN(close) || close <= 0) continue;
    rows.push({ date, close });
  }

  if (rows.length < 1) return null;

  // Stooq returns oldest-first, so last row is most recent
  const latest = rows[rows.length - 1];
  const prev   = rows.length >= 2 ? rows[rows.length - 2] : null;
  const change24h = prev
    ? parseFloat((((latest.close - prev.close) / prev.close) * 100).toFixed(2))
    : null;

  const sparkline = rows.map(r => ({ date: r.date, close: r.close }));

  // 7-day change: compare to close ~5 trading days ago
  const weekIdx = Math.max(0, rows.length - 6);
  const weekAgo = rows[weekIdx];
  const change7d = weekAgo
    ? parseFloat((((latest.close - weekAgo.close) / weekAgo.close) * 100).toFixed(2))
    : null;

  return { value: latest.close, change24h, change7d, sparkline };
}

// ─── Fetch single index: Yahoo first, Stooq fallback ───
async function fetchIndex({ name, yahoo, stooq }) {
  // Try Yahoo Finance first
  const yfResult = await fetchYFChart(yahoo);
  const parsed = parseYFResult(name, yfResult);
  if (parsed) return parsed;

  // Fallback to Stooq.pl
  const stooqData = await fetchFromStooq(stooq);
  if (stooqData) {
    return {
      name,
      value:     stooqData.value,
      change24h: stooqData.change24h,
      change7d:  stooqData.change7d,
      sparkline: stooqData.sparkline,
    };
  }

  // Both sources failed
  return { name, value: null, change24h: null, change7d: null, sparkline: [] };
}

// ─── Handler ────────────────────────────────────────────
export default async function handler(req, res) {
  try {
    const results = [];
    for (const sym of INDEX_SYMBOLS) {
      results.push(await fetchIndex(sym));
      if (sym !== INDEX_SYMBOLS[INDEX_SYMBOLS.length - 1]) {
        await new Promise(r => setTimeout(r, 80));
      }
    }

    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch indices" });
  }
}

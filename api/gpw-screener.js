/**
 * Returns the full GPW stock list (~300 companies) with price quotes + fundamentals.
 *
 * Stock list comes from the static GPW_COMPANIES master file.
 *
 * Data strategy (three-tier):
 *   1. Try Yahoo v7/finance/quote (needs crumb) — gives price, volume, change,
 *      PLUS marketCap, trailingPE, dividendYield in one batch call.
 *   2. Fallback: Yahoo v8/finance/chart (no auth) — price/volume/change only.
 *   3. Fallback: Stooq.pl CSV — for stocks missing from both Yahoo sources.
 *
 * CDN-cached for 24 hours (s-maxage=86400).
 *
 * Returns:
 *   { ok: true,  stocks: [...], quotes: {...}, ts: "..." }
 *   { ok: false, error: "..." }
 */

import { GPW_COMPANIES } from "../src/data/gpw-companies.js";
import { toYahoo, YF_HEADERS } from "./_yahoo-map.js";
import { fetchStooqBatch } from "./_stooq-fallback.js";
import { getYahooCrumb } from "./_yahoo-crumb.js";

const CHART_BATCH = 15;
const QUOTE_BATCH = 40;
const DELAY = 100;
const FETCH_TIMEOUT_MS = 8_000;

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

// ── v7/finance/quote — batch price + fundamentals ───────────────────

async function fetchQuoteBatch(yahooSymbols, crumb, cookie) {
  const symbols = yahooSymbols.map(encodeURIComponent).join(",");
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}&crumb=${encodeURIComponent(crumb)}`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  const r = await fetch(url, {
    signal: ctrl.signal,
    headers: {
      "User-Agent": UA,
      Cookie: cookie,
      Accept: "application/json",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  clearTimeout(t);
  if (!r.ok) return [];
  const j = await r.json();
  return j?.quoteResponse?.result || [];
}

// ── v8/finance/chart — fallback, no auth needed ─────────────────────

async function fetchChart(yahoo, retries = 2) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahoo)}?interval=1d&range=10d`;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
      const r = await fetch(url, { signal: ctrl.signal, headers: YF_HEADERS });
      clearTimeout(t);
      if (r.status === 429 || r.status >= 500) {
        if (attempt < retries) {
          await new Promise((w) => setTimeout(w, 500 * (attempt + 1)));
          continue;
        }
        return null;
      }
      if (!r.ok) return null;
      const j = await r.json();
      const res = j?.chart?.result?.[0];
      if (!res) return null;

      const closes = (res.indicators?.quote?.[0]?.close || []).filter(
        (c) => c != null && !isNaN(c)
      );
      if (!closes.length) return null;

      const today = closes[closes.length - 1];
      const yesterday = closes.length >= 2 ? closes[closes.length - 2] : today;
      const weekAgo = closes.length >= 6 ? closes[closes.length - 6] : yesterday;
      const volume = (res.indicators?.quote?.[0]?.volume || []).at(-1) || 0;

      return {
        close: today,
        volume,
        change24h: yesterday
          ? parseFloat((((today - yesterday) / yesterday) * 100).toFixed(2))
          : 0,
        change7d: weekAgo
          ? parseFloat((((today - weekAgo) / weekAgo) * 100).toFixed(2))
          : 0,
        sparkline: closes,
      };
    } catch {
      if (attempt < retries) {
        await new Promise((w) => setTimeout(w, 500 * (attempt + 1)));
        continue;
      }
      return null;
    }
  }
  return null;
}

// ── Handler ─────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=3600");

  try {
    const quotes = {};
    const entries = GPW_COMPANIES.map((c, i) => ({
      ...c,
      id: i + 1,
      yahoo: toYahoo(c.stooq),
    }));

    // Build stocks array (will be enriched with fundamentals if quote API works)
    const stockMap = new Map();
    const stocks = entries.map((e) => {
      const s = {
        id: e.id,
        ticker: e.ticker,
        stooq: e.stooq,
        name: e.name,
        sector: e.sector,
        cap: 0,
        pe: null,
        div: null,
      };
      stockMap.set(e.ticker, s);
      return s;
    });

    // ── Strategy 1: v7/finance/quote (price + fundamentals) ──────
    let quoteOk = false;
    try {
      const { crumb, cookieStr } = await getYahooCrumb();

      for (let i = 0; i < entries.length; i += QUOTE_BATCH) {
        const batch = entries.slice(i, i + QUOTE_BATCH);
        const yahooSymbols = batch.map((e) => e.yahoo);
        const quoteResults = await fetchQuoteBatch(
          yahooSymbols,
          crumb,
          cookieStr
        );

        // Index results by Yahoo symbol for O(1) lookup
        const bySymbol = new Map();
        for (const q of quoteResults) bySymbol.set(q.symbol, q);

        for (const e of batch) {
          const q = bySymbol.get(e.yahoo);
          if (!q) continue;

          const price = q.regularMarketPrice;
          if (price) {
            quotes[e.ticker] = {
              close: price,
              volume: q.regularMarketVolume || 0,
              change24h: q.regularMarketChangePercent
                ? parseFloat(q.regularMarketChangePercent.toFixed(2))
                : 0,
              change7d: 0, // filled by bulk refresh every 60s
            };
          }

          // Enrich stock with fundamentals
          const stock = stockMap.get(e.ticker);
          if (stock) {
            if (q.marketCap) stock.cap = Math.round(q.marketCap / 1e6);
            if (q.trailingPE) stock.pe = parseFloat(q.trailingPE.toFixed(1));
            if (q.dividendYield != null && q.dividendYield > 0) {
              // Yahoo v7/finance/quote returns yield already as percentage (e.g. 5.1 = 5.1%)
              stock.div = parseFloat(q.dividendYield.toFixed(2));
            }
          }
        }

        if (i + QUOTE_BATCH < entries.length) {
          await new Promise((w) => setTimeout(w, DELAY));
        }
      }
      quoteOk = true;
    } catch (err) {
      console.log(
        "[gpw-screener] Quote API failed, falling back to chart:",
        err.message
      );
    }

    // ── Strategy 2: fallback to v8/finance/chart (prices only) ───
    // Only for stocks not yet in quotes (if v7 worked, some may still be missing)
    const missingAfterV7 = entries.filter((e) => !quotes[e.ticker]);

    if (!quoteOk || missingAfterV7.length > 0) {
      const toFetch = quoteOk ? missingAfterV7 : entries;
      for (let i = 0; i < toFetch.length; i += CHART_BATCH) {
        const batch = toFetch.slice(i, i + CHART_BATCH);
        const results = await Promise.allSettled(
          batch.map((e) => fetchChart(e.yahoo))
        );

        for (let j = 0; j < batch.length; j++) {
          const e = batch[j];
          const r = results[j];
          if (r.status === "fulfilled" && r.value && !quotes[e.ticker]) {
            quotes[e.ticker] = r.value;
          }
        }

        if (i + CHART_BATCH < toFetch.length) {
          await new Promise((w) => setTimeout(w, DELAY));
        }
      }
    }

    // ── Strategy 3: Stooq.pl CSV fallback ────────────────────────
    const missingAfterYahoo = entries.filter((e) => !quotes[e.ticker]);
    if (missingAfterYahoo.length > 0) {
      console.log(
        `[gpw-screener] ${missingAfterYahoo.length} stocks missing after Yahoo, trying Stooq...`
      );
      const stooqSymbols = missingAfterYahoo.map((e) => e.stooq);
      const stooqData = await fetchStooqBatch(stooqSymbols, 350);

      for (const e of missingAfterYahoo) {
        const sq = stooqData[e.stooq];
        if (sq) {
          quotes[e.ticker] = sq;
        }
      }

      const stillMissing = missingAfterYahoo.filter((e) => !quotes[e.ticker]);
      if (stillMissing.length > 0) {
        console.log(
          `[gpw-screener] ${stillMissing.length} stocks still without data: ${stillMissing.map((e) => e.ticker).join(", ")}`
        );
      }
    }

    return res.status(200).json({
      ok: true,
      stocks,
      quotes,
      ts: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[gpw-screener]", err.message);
    return res.status(200).json({ ok: false, error: err.message });
  }
}

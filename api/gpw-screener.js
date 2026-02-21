/**
 * Returns the full GPW stock list (~300 companies) with price quotes + fundamentals.
 *
 * Stock list comes from the static GPW_COMPANIES master file.
 *
 * Data strategy (two-tier):
 *   1. Try Yahoo v7/finance/quote (needs crumb) — gives price, volume, change,
 *      PLUS marketCap, trailingPE, dividendYield in one batch call.
 *   2. Fallback: Yahoo v8/finance/chart (no auth) — price/volume/change only.
 *
 * CDN-cached for 24 hours (s-maxage=86400).
 *
 * Returns:
 *   { ok: true,  stocks: [...], quotes: {...}, ts: "..." }
 *   { ok: false, error: "..." }
 */

import { GPW_COMPANIES } from "../src/data/gpw-companies.js";
import { toYahoo, YF_HEADERS } from "./yahoo-map.js";

const CHART_BATCH = 15;
const QUOTE_BATCH = 40;
const DELAY = 100;

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

// ── Yahoo crumb auth (needed for v7/finance/quote) ──────────────────

async function getYahooCrumb() {
  const cookieRes = await fetch("https://finance.yahoo.com/", {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    redirect: "follow",
  });

  let rawCookies = [];
  if (typeof cookieRes.headers.getSetCookie === "function") {
    rawCookies = cookieRes.headers.getSetCookie();
  } else {
    const raw = cookieRes.headers.get("set-cookie") || "";
    rawCookies = raw ? raw.split(/,(?=[^ ])/) : [];
  }
  const cookieStr = rawCookies
    .map((c) => c.split(";")[0].trim())
    .filter(Boolean)
    .join("; ");

  const crumbRes = await fetch(
    "https://query1.finance.yahoo.com/v1/test/getcrumb",
    {
      headers: {
        "User-Agent": UA,
        Cookie: cookieStr,
        Accept: "text/plain, */*",
      },
    }
  );
  const crumb = (await crumbRes.text()).trim();
  if (!crumb || crumb.startsWith("{") || crumb.length > 20) {
    throw new Error(`Invalid crumb: ${crumb.slice(0, 50)}`);
  }
  return { crumb, cookieStr };
}

// ── v7/finance/quote — batch price + fundamentals ───────────────────

async function fetchQuoteBatch(yahooSymbols, crumb, cookie) {
  const symbols = yahooSymbols.map(encodeURIComponent).join(",");
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}&crumb=${encodeURIComponent(crumb)}`;
  const r = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Cookie: cookie,
      Accept: "application/json",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  if (!r.ok) return [];
  const j = await r.json();
  return j?.quoteResponse?.result || [];
}

// ── v8/finance/chart — fallback, no auth needed ─────────────────────

async function fetchChart(yahoo, retries = 2) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahoo)}?interval=1d&range=10d`;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const r = await fetch(url, { headers: YF_HEADERS });
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
              // Yahoo returns yield as decimal (0.051 = 5.1%)
              const pct = q.dividendYield > 1 ? q.dividendYield : q.dividendYield * 100;
              stock.div = parseFloat(pct.toFixed(1));
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
    if (!quoteOk) {
      for (let i = 0; i < entries.length; i += CHART_BATCH) {
        const batch = entries.slice(i, i + CHART_BATCH);
        const results = await Promise.allSettled(
          batch.map((e) => fetchChart(e.yahoo))
        );

        for (let j = 0; j < batch.length; j++) {
          const e = batch[j];
          const r = results[j];
          if (r.status === "fulfilled" && r.value) {
            quotes[e.ticker] = r.value;
          }
        }

        if (i + CHART_BATCH < entries.length) {
          await new Promise((w) => setTimeout(w, DELAY));
        }
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

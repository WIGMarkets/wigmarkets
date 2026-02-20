/**
 * Returns the full GPW stock list (~300 companies) with initial price quotes.
 *
 * Stock list comes from the static GPW_COMPANIES master file.
 * Price data comes from Yahoo Finance chart API (v8/finance/chart) in batches.
 *
 * CDN-cached for 24 hours (s-maxage=86400). No Yahoo auth/crumb needed —
 * uses the same chart endpoint as gpw-bulk.js which is proven to work.
 *
 * Returns:
 *   { ok: true,  stocks: [...], quotes: {...}, ts: "..." }
 *   { ok: false, error: "..." }
 */

import { GPW_COMPANIES } from "../gpw-companies.js";
import { toYahoo, YF_HEADERS } from "./yahoo-map.js";

const BATCH = 15;
const DELAY = 100;

async function fetchChart(yahoo, retries = 2) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahoo)}?interval=1d&range=10d`;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const r = await fetch(url, { headers: YF_HEADERS });
      if (r.status === 429 || r.status >= 500) {
        if (attempt < retries) { await new Promise(w => setTimeout(w, 500 * (attempt + 1))); continue; }
        return null;
      }
      if (!r.ok) return null;
      const j = await r.json();
      const res = j?.chart?.result?.[0];
      if (!res) return null;

      const closes = (res.indicators?.quote?.[0]?.close || []).filter(c => c != null && !isNaN(c));
      if (!closes.length) return null;

      const today     = closes[closes.length - 1];
      const yesterday = closes.length >= 2 ? closes[closes.length - 2] : today;
      const weekAgo   = closes.length >= 6 ? closes[closes.length - 6] : yesterday;
      const volume    = (res.indicators?.quote?.[0]?.volume || []).at(-1) || 0;

      return {
        close:     today,
        volume,
        change24h: yesterday ? parseFloat(((today - yesterday) / yesterday * 100).toFixed(2)) : 0,
        change7d:  weekAgo   ? parseFloat(((today - weekAgo)   / weekAgo   * 100).toFixed(2)) : 0,
      };
    } catch {
      if (attempt < retries) { await new Promise(w => setTimeout(w, 500 * (attempt + 1))); continue; }
      return null;
    }
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=3600");

  try {
    const stocks = [];
    const quotes = {};
    const entries = GPW_COMPANIES.map((c, i) => ({
      ...c,
      id: i + 1,
      yahoo: toYahoo(c.stooq),
    }));

    for (let i = 0; i < entries.length; i += BATCH) {
      const batch = entries.slice(i, i + BATCH);
      const results = await Promise.allSettled(
        batch.map(e => fetchChart(e.yahoo))
      );

      for (let j = 0; j < batch.length; j++) {
        const e = batch[j];
        const r = results[j];

        stocks.push({
          id:     e.id,
          ticker: e.ticker,
          stooq:  e.stooq,
          name:   e.name,
          sector: e.sector,
          cap:    0,
          pe:     null,
          div:    null,
        });

        if (r.status === "fulfilled" && r.value) {
          quotes[e.ticker] = r.value;
        }
      }

      if (i + BATCH < entries.length) {
        await new Promise(w => setTimeout(w, DELAY));
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

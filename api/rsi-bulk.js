/**
 * Bulk RSI(14) calculation for all GPW stocks.
 *
 * Replaces ~330 sequential client-side /api/history calls with a single
 * server-side endpoint. Fetches 60 days of daily history per stock from
 * Stooq (primary) with Yahoo Finance fallback, then computes Wilder RSI.
 *
 * CDN-cached for 1 hour (RSI changes meaningfully only at market close).
 *
 * Returns: { rsi: { "PKN": 54.2, "CDR": 31.8, ... }, computed: 285, ts: "..." }
 */

import { GPW_COMPANIES } from "../src/data/gpw-companies.js";
import { toYahoo, YF_HEADERS } from "./_yahoo-map.js";

const BATCH_SIZE = 15;
const BATCH_DELAY_MS = 200;
const FETCH_TIMEOUT_MS = 5_000;
const HISTORY_DAYS = 60;

// ── RSI(14) — Wilder smoothing (same as src/lib/formatters.js) ──────

function calculateRSI(prices, period = 14) {
  if (!prices || prices.length < period + 1) return null;
  const closes = prices.map(p => p.close);
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff; else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + (diff > 0 ? diff : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (diff < 0 ? -diff : 0)) / period;
  }
  if (avgLoss === 0) return 100;
  return 100 - 100 / (1 + avgGain / avgLoss);
}

// ── Date formatter ──────────────────────────────────────────────────

function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

// ── Stooq history fetch ─────────────────────────────────────────────

async function fetchStooqHistory(stooqSymbol) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - HISTORY_DAYS);
  const url = `https://stooq.pl/q/d/l/?s=${stooqSymbol.toLowerCase()}&d1=${fmtDate(start)}&d2=${fmtDate(end)}&i=d`;

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/csv, text/plain, */*",
      },
    });
    clearTimeout(t);
    if (!res.ok) return null;

    const csv = await res.text();
    const lines = csv.trim().split("\n");
    if (lines.length < 3) return null;

    const prices = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      if (cols.length < 5) continue;
      const close = parseFloat(cols[4]);
      if (isNaN(close) || close <= 0) continue;
      prices.push({ close });
    }
    return prices.length >= 15 ? prices : null;
  } catch {
    return null;
  }
}

// ── Yahoo Finance history fallback ──────────────────────────────────

async function fetchYahooHistory(yahooSymbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=3mo`;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    const r = await fetch(url, { signal: ctrl.signal, headers: YF_HEADERS });
    clearTimeout(t);
    if (!r.ok) return null;

    const json = await r.json();
    const result = json?.chart?.result?.[0];
    if (!result) return null;

    const closes = (result.indicators?.quote?.[0]?.close || [])
      .filter(c => c !== null && !isNaN(c));
    return closes.length >= 15 ? closes.map(c => ({ close: c })) : null;
  } catch {
    return null;
  }
}

// ── Handler ─────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=1800");

  const rsi = {};

  for (let i = 0; i < GPW_COMPANIES.length; i += BATCH_SIZE) {
    const batch = GPW_COMPANIES.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async ({ ticker, stooq }) => {
        let prices = await fetchStooqHistory(stooq);
        if (!prices) prices = await fetchYahooHistory(toYahoo(stooq));
        const value = calculateRSI(prices);
        return { ticker, value };
      })
    );

    for (const r of results) {
      if (r.status === "fulfilled" && r.value.value != null) {
        rsi[r.value.ticker] = parseFloat(r.value.value.toFixed(1));
      }
    }

    if (i + BATCH_SIZE < GPW_COMPANIES.length) {
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }

  res.status(200).json({
    rsi,
    computed: Object.keys(rsi).length,
    ts: new Date().toISOString(),
  });
}

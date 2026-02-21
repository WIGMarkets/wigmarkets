#!/usr/bin/env node

/**
 * GPW Fear & Greed Index — Real Calculation Engine
 *
 * Runs daily via GitHub Actions (after GPW close at 18:00 UTC).
 * Fetches market data from Yahoo Finance, calculates 7 sub-indicators,
 * aggregates a composite index, and appends to history JSON.
 *
 * Usage:  node scripts/calculate-fear-greed.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HISTORY_PATH = join(__dirname, "..", "data", "fear-greed-history.json");

// ─── Configuration ──────────────────────────────────────

const YF_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
};

// Index tickers (Yahoo Finance format)
const INDEX_TICKERS = {
  wig20: "^WIG20",
  wig: "^WIG",
  swig80: "^SWIG80",
  mwig40: "^MWIG40",
};

// Safe haven tickers
const SAFE_HAVEN_TICKER = "GC=F"; // Gold futures (USD-denominated, but relative perf is fine)

// WIG140 stocks — loaded from GPW companies list
// We import the list inline to avoid dependency issues with the Vite project structure
function loadWIG140Tickers() {
  const filePath = join(__dirname, "..", "src", "data", "gpw-companies.js");
  const raw = readFileSync(filePath, "utf-8");

  // Parse the JS file to extract stooq symbols for WIG20/mWIG40/sWIG80 stocks
  const tickers = [];
  const regex = /\{\s*ticker:\s*"([^"]+)",\s*stooq:\s*"([^"]+)",\s*name:\s*"[^"]*",\s*sector:\s*"[^"]*",\s*index:\s*"(WIG20|mWIG40|sWIG80)"/g;
  let match;
  while ((match = regex.exec(raw)) !== null) {
    tickers.push({ ticker: match[1], stooq: match[2], index: match[3] });
  }
  return tickers;
}

// ─── Yahoo Finance Data Fetching ────────────────────────

async function fetchYFChart(symbol, range = "1y", interval = "1d", retries = 2) {
  const hosts = ["query1", "query2"];
  const encoded = encodeURIComponent(symbol);
  const path = `/v8/finance/chart/${encoded}?interval=${interval}&range=${range}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const host = hosts[attempt % hosts.length];
    const url = `https://${host}.finance.yahoo.com${path}`;
    try {
      const res = await fetch(url, { headers: YF_HEADERS });
      if (res.status === 429 || res.status >= 500) {
        if (attempt < retries) {
          await sleep(500 * (attempt + 1));
          continue;
        }
        return null;
      }
      if (!res.ok) return null;
      const json = await res.json();
      const result = json?.chart?.result?.[0];
      if (!result) return null;

      const timestamps = result.timestamp || [];
      const quote = result.indicators?.quote?.[0] || {};
      const closes = quote.close || [];
      const volumes = quote.volume || [];
      const highs = quote.high || [];
      const lows = quote.low || [];

      const bars = timestamps.map((ts, i) => ({
        date: new Date(ts * 1000).toISOString().slice(0, 10),
        close: closes[i],
        volume: volumes[i],
        high: highs[i],
        low: lows[i],
      })).filter(b => b.close !== null && !isNaN(b.close) && b.close > 0);

      return bars;
    } catch {
      if (attempt < retries) {
        await sleep(500 * (attempt + 1));
        continue;
      }
    }
  }
  return null;
}

// Stooq.pl fallback for indices
async function fetchStooqCSV(symbol, retries = 1) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 400); // ~1.1 years of data

  const d1 = start.toISOString().slice(0, 10).replace(/-/g, "");
  const d2 = end.toISOString().slice(0, 10).replace(/-/g, "");
  const url = `https://stooq.pl/q/d/l/?s=${symbol}&d1=${d1}&d2=${d2}&i=d`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": YF_HEADERS["User-Agent"], Accept: "text/csv, */*" },
      });
      if (!res.ok) { if (attempt < retries) { await sleep(300); continue; } return null; }
      const text = await res.text();
      const lines = text.trim().split("\n");
      if (lines.length < 2) return null;

      const bars = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");
        if (cols.length < 5) continue;
        const close = parseFloat(cols[4]);
        const volume = parseInt(cols[5] || "0") || 0;
        const high = parseFloat(cols[2]) || close;
        const low = parseFloat(cols[3]) || close;
        if (isNaN(close) || close <= 0) continue;
        bars.push({ date: cols[0].trim(), close, volume, high, low });
      }
      return bars.length > 0 ? bars : null;
    } catch {
      if (attempt < retries) { await sleep(300); continue; }
      return null;
    }
  }
  return null;
}

// Fetch with Yahoo Finance first, then Stooq fallback for indices
async function fetchIndexHistory(yahooSymbol, stooqSymbol) {
  let data = await fetchYFChart(yahooSymbol, "1y", "1d");
  if (data && data.length >= 50) return data;

  log(`  Yahoo failed for ${yahooSymbol}, trying Stooq (${stooqSymbol})...`);
  data = await fetchStooqCSV(stooqSymbol);
  if (data && data.length >= 50) return data;

  log(`  WARN: Both sources failed for ${yahooSymbol}/${stooqSymbol}`);
  return null;
}

// Fetch stock data in batches with rate limiting
async function fetchStockHistories(stocks, range = "1y") {
  const results = {};
  const BATCH = 5;
  const DELAY = 300; // ms between batches

  for (let i = 0; i < stocks.length; i += BATCH) {
    const batch = stocks.slice(i, i + BATCH);
    const promises = batch.map(async (s) => {
      const yahoo = s.stooq.toUpperCase() + ".WA";
      const bars = await fetchYFChart(yahoo, range, "1d");
      return { stooq: s.stooq, bars };
    });

    const settled = await Promise.allSettled(promises);
    for (const r of settled) {
      if (r.status === "fulfilled" && r.value.bars && r.value.bars.length >= 20) {
        results[r.value.stooq] = r.value.bars;
      }
    }

    if (i + BATCH < stocks.length) await sleep(DELAY);
    if ((i + BATCH) % 50 === 0) {
      log(`  Fetched ${Math.min(i + BATCH, stocks.length)}/${stocks.length} stocks...`);
    }
  }

  return results;
}

// ─── Math Helpers ───────────────────────────────────────

function average(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stdDev(arr) {
  if (arr.length < 2) return 0;
  const avg = average(arr);
  const squareDiffs = arr.map((v) => (v - avg) ** 2);
  return Math.sqrt(average(squareDiffs));
}

function normalize(value, min, max) {
  if (max === min) return 50;
  const clamped = Math.max(min, Math.min(max, value));
  return ((clamped - min) / (max - min)) * 100;
}

function getLabel(score) {
  if (score <= 24) return "Skrajna panika";
  if (score <= 44) return "Strach";
  if (score <= 55) return "Neutralny";
  if (score <= 74) return "Chciwość";
  return "Skrajna chciwość";
}

function getColor(score) {
  if (score <= 24) return "#dc2626";
  if (score <= 44) return "#ea580c";
  if (score <= 55) return "#ca8a04";
  if (score <= 74) return "#16a34a";
  return "#15803d";
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function log(msg) {
  console.log(`[F&G] ${msg}`);
}

// ─── Sub-Indicator Calculations ─────────────────────────

/**
 * 1. Momentum rynku (weight: 20%)
 * Compares current WIG20 to its 125-session SMA.
 */
function calcMomentum(wig20Bars) {
  if (!wig20Bars || wig20Bars.length < 125)
    return null;

  const closes = wig20Bars.map((b) => b.close);
  const current = closes[closes.length - 1];
  const sma125 = average(closes.slice(-125));
  const deviation = ((current - sma125) / sma125) * 100;

  // -10% → 0, +10% → 100
  const score = normalize(deviation, -10, 10);

  return {
    name: "Momentum rynku",
    value: Math.round(score),
    label: getLabel(score),
    description: `Porównuje bieżący kurs WIG20 do średniej 125-sesyjnej. Wzrost ponad średnią oznacza chciwość. Odchylenie: ${deviation >= 0 ? "+" : ""}${deviation.toFixed(2)}%.`,
    details: {
      currentWIG20: round2(current),
      sma125: round2(sma125),
      deviationPercent: round2(deviation),
    },
  };
}

/**
 * 2. Volume Strength (weight: 10%)
 * Ratio of volume on up-days vs down-days over last 30 sessions.
 */
function calcVolumeStrength(stockHistories) {
  const stockKeys = Object.keys(stockHistories);
  if (stockKeys.length < 10) return null;

  let upVolume = 0;
  let downVolume = 0;

  for (const key of stockKeys) {
    const bars = stockHistories[key];
    const recent = bars.slice(-31); // 31 bars to get 30 day-over-day changes
    for (let i = 1; i < recent.length; i++) {
      const vol = recent[i].volume || 0;
      if (vol <= 0) continue;
      if (recent[i].close > recent[i - 1].close) {
        upVolume += vol;
      } else if (recent[i].close < recent[i - 1].close) {
        downVolume += vol;
      }
    }
  }

  if (downVolume === 0 && upVolume === 0) return null;

  const ratio = upVolume / Math.max(downVolume, 1);
  // ratio 0.5 → 0, 1.0 → 50, 1.5 → 100
  const score = normalize(ratio, 0.5, 1.5);

  return {
    name: "Siła wolumenu",
    value: Math.round(score),
    label: getLabel(score),
    description: `Stosunek wolumenu w dniach wzrostowych do spadkowych na GPW (30 sesji). Przewaga kupujących to sygnał chciwości. Ratio: ${ratio.toFixed(2)}.`,
    details: { upVolume, downVolume, ratio: round2(ratio) },
  };
}

/**
 * 3. Market Breadth (weight: 20%)
 * Percentage of stocks trading above their 50-session SMA.
 */
function calcMarketBreadth(stockHistories) {
  const stockKeys = Object.keys(stockHistories);
  if (stockKeys.length < 10) return null;

  let aboveSMA50 = 0;
  let total = 0;

  for (const key of stockKeys) {
    const bars = stockHistories[key];
    if (bars.length < 50) continue;
    total++;
    const closes = bars.map((b) => b.close);
    const sma50 = average(closes.slice(-50));
    const current = closes[closes.length - 1];
    if (current > sma50) aboveSMA50++;
  }

  if (total < 10) return null;

  const percent = (aboveSMA50 / total) * 100;
  const score = percent; // Already 0-100

  return {
    name: "Szerokość rynku",
    value: Math.round(score),
    label: getLabel(score),
    description: `Procent spółek GPW notujących powyżej 50-sesyjnej średniej. Im więcej spółek rośnie, tym wyższy wskaźnik. Obecnie ${aboveSMA50} z ${total} spółek.`,
    details: { aboveSMA50, total, percent: round2(percent) },
  };
}

/**
 * 4. Volatility (weight: 15%)
 * Current 20-session volatility vs year average. INVERTED: high vol = fear.
 */
function calcVolatility(wig20Bars) {
  if (!wig20Bars || wig20Bars.length < 60)
    return null;

  const closes = wig20Bars.map((b) => b.close);
  const returns = [];
  for (let i = 1; i < closes.length; i++) {
    returns.push((closes[i] - closes[i - 1]) / closes[i - 1]);
  }

  const recent20 = returns.slice(-20);
  const currentVol = stdDev(recent20) * Math.sqrt(252) * 100;

  const yearReturns = returns.slice(-252);
  const yearVol = stdDev(yearReturns) * Math.sqrt(252) * 100;

  if (yearVol === 0) return null;

  const ratio = currentVol / yearVol;
  // INVERTED: ratio 1.5 → 0 (panic), ratio 0.5 → 100 (greed)
  const score = normalize(ratio, 1.5, 0.5);

  return {
    name: "Zmienność rynku",
    value: Math.round(score),
    label: getLabel(score),
    description: `Zmienność WIG20 w ostatnich 20 sesjach vs średnia roczna. Wysoka zmienność towarzyszy panice, niska — spokojowi. Bieżąca: ${currentVol.toFixed(1)}%, średnia: ${yearVol.toFixed(1)}%.`,
    details: {
      currentVol: round2(currentVol),
      yearVol: round2(yearVol),
      ratio: round2(ratio),
    },
  };
}

/**
 * 5. New Highs vs Lows (weight: 15%)
 * Ratio of stocks near 52-week highs vs lows.
 */
function calcHighLowIndex(stockHistories) {
  const stockKeys = Object.keys(stockHistories);
  if (stockKeys.length < 10) return null;

  let newHighs = 0;
  let newLows = 0;

  for (const key of stockKeys) {
    const bars = stockHistories[key];
    if (bars.length < 100) continue; // Need reasonable history

    const closes = bars.map((b) => b.close);
    const current = closes[closes.length - 1];
    const high52 = Math.max(...closes);
    const low52 = Math.min(...closes);

    // Within 5% of 52-week high
    if (current >= high52 * 0.95) newHighs++;
    // Within 5% of 52-week low
    if (current <= low52 * 1.05) newLows++;
  }

  const total = newHighs + newLows;
  if (total === 0) {
    return {
      name: "Nowe szczyty vs dołki",
      value: 50,
      label: "Neutralny",
      description: "Brak spółek blisko rocznych ekstremiów. Rynek w neutralnej strefie.",
      details: { newHighs: 0, newLows: 0 },
    };
  }

  const score = (newHighs / total) * 100;

  return {
    name: "Nowe szczyty vs dołki",
    value: Math.round(score),
    label: getLabel(score),
    description: `Stosunek spółek blisko 52-tygodniowych maksimów do tych blisko minimów. Obecnie ${newHighs} spółek blisko szczytów, ${newLows} blisko dołków.`,
    details: { newHighs, newLows },
  };
}

/**
 * 6. Small vs Large Cap (weight: 10%)
 * Performance of sWIG80 vs WIG20 over last 20 sessions.
 */
function calcSmallVsLargeCap(swig80Bars, wig20Bars) {
  if (!swig80Bars || !wig20Bars) return null;
  if (swig80Bars.length < 21 || wig20Bars.length < 21) return null;

  const sCloses = swig80Bars.map((b) => b.close);
  const wCloses = wig20Bars.map((b) => b.close);

  const sPerf =
    ((sCloses[sCloses.length - 1] / sCloses[sCloses.length - 21] - 1) * 100);
  const wPerf =
    ((wCloses[wCloses.length - 1] / wCloses[wCloses.length - 21] - 1) * 100);

  const diff = sPerf - wPerf;
  // -5% → 0, +5% → 100
  const score = normalize(diff, -5, 5);

  return {
    name: "Małe vs duże spółki",
    value: Math.round(score),
    label: getLabel(score),
    description: `Porównanie wyników sWIG80 (małe spółki) do WIG20 (blue chipy) w ostatnich 20 sesjach. Gdy małe spółki wygrywają, inwestorzy szukają ryzyka — to sygnał chciwości. sWIG80: ${sPerf >= 0 ? "+" : ""}${sPerf.toFixed(1)}%, WIG20: ${wPerf >= 0 ? "+" : ""}${wPerf.toFixed(1)}%.`,
    details: {
      swig80Perf: round2(sPerf),
      wig20Perf: round2(wPerf),
      diff: round2(diff),
    },
  };
}

/**
 * 7. Safe Haven Demand (weight: 10%)
 * Performance of WIG20 vs gold over last 20 sessions.
 */
function calcSafeHavenDemand(wig20Bars, goldBars) {
  if (!wig20Bars || !goldBars) return null;
  if (wig20Bars.length < 21 || goldBars.length < 21) return null;

  const wCloses = wig20Bars.map((b) => b.close);
  const gCloses = goldBars.map((b) => b.close);

  const wPerf =
    ((wCloses[wCloses.length - 1] / wCloses[wCloses.length - 21] - 1) * 100);
  const gPerf =
    ((gCloses[gCloses.length - 1] / gCloses[gCloses.length - 21] - 1) * 100);

  const diff = wPerf - gPerf;
  // -5% → 0 (fear), +5% → 100 (greed)
  const score = normalize(diff, -5, 5);

  return {
    name: "Popyt na bezpieczne aktywa",
    value: Math.round(score),
    label: getLabel(score),
    description: `Porównanie wyników WIG20 vs złoto w ostatnich 20 sesjach. Gdy akcje wygrywają ze złotem, inwestorzy podejmują ryzyko — to sygnał chciwości. WIG20: ${wPerf >= 0 ? "+" : ""}${wPerf.toFixed(1)}%, Złoto: ${gPerf >= 0 ? "+" : ""}${gPerf.toFixed(1)}%.`,
    details: {
      wig20Perf: round2(wPerf),
      goldPerf: round2(gPerf),
      diff: round2(diff),
    },
  };
}

function round2(v) {
  return Math.round(v * 100) / 100;
}

// ─── Aggregation ────────────────────────────────────────

const WEIGHTS = {
  "Momentum rynku": 0.20,
  "Siła wolumenu": 0.10,
  "Szerokość rynku": 0.20,
  "Zmienność rynku": 0.15,
  "Nowe szczyty vs dołki": 0.15,
  "Małe vs duże spółki": 0.10,
  "Popyt na bezpieczne aktywa": 0.10,
};

function calculateFearGreedIndex(indicators) {
  // Filter out null indicators and redistribute weights proportionally
  const valid = indicators.filter(Boolean);
  if (valid.length === 0) return null;

  const totalWeight = valid.reduce((sum, ind) => sum + (WEIGHTS[ind.name] || 0), 0);
  if (totalWeight === 0) return null;

  let weightedSum = 0;
  for (const ind of valid) {
    const rawWeight = WEIGHTS[ind.name] || 0;
    const normalizedWeight = rawWeight / totalWeight; // Redistribute
    weightedSum += ind.value * normalizedWeight;
  }

  const index = Math.round(weightedSum);

  return {
    value: index,
    label: getLabel(index),
    color: getColor(index),
    indicators: valid,
    indicatorsUsed: valid.length,
    indicatorsTotal: 7,
    updatedAt: new Date().toISOString(),
  };
}

// ─── Main ───────────────────────────────────────────────

async function main() {
  log("Starting GPW Fear & Greed Index calculation...");
  const startTime = Date.now();

  // 1. Load WIG140 stock list
  const wig140 = loadWIG140Tickers();
  log(`Loaded ${wig140.length} WIG140 stocks`);

  // 2. Fetch index histories (Yahoo + Stooq fallback)
  log("Fetching index histories...");
  const [wig20Bars, wigBars, swig80Bars, mwig40Bars, goldBars] =
    await Promise.all([
      fetchIndexHistory(INDEX_TICKERS.wig20, "wig20"),
      fetchIndexHistory(INDEX_TICKERS.wig, "wig"),
      fetchIndexHistory(INDEX_TICKERS.swig80, "swig80"),
      fetchIndexHistory(INDEX_TICKERS.mwig40, "mwig40"),
      fetchYFChart(SAFE_HAVEN_TICKER, "3mo", "1d"),
    ]);

  log(
    `  WIG20: ${wig20Bars?.length ?? 0} bars, WIG: ${wigBars?.length ?? 0} bars, sWIG80: ${swig80Bars?.length ?? 0} bars, Gold: ${goldBars?.length ?? 0} bars`
  );

  // 3. Fetch individual stock histories (for breadth, volume, high-low)
  log(`Fetching ${wig140.length} stock histories (batched)...`);
  const stockHistories = await fetchStockHistories(wig140);
  log(`  Got data for ${Object.keys(stockHistories).length}/${wig140.length} stocks`);

  // 4. Calculate all 7 sub-indicators
  log("Calculating sub-indicators...");

  const indicators = [
    calcMomentum(wig20Bars),
    calcVolumeStrength(stockHistories),
    calcMarketBreadth(stockHistories),
    calcVolatility(wig20Bars),
    calcHighLowIndex(stockHistories),
    calcSmallVsLargeCap(swig80Bars, wig20Bars),
    calcSafeHavenDemand(wig20Bars, goldBars),
  ];

  for (const ind of indicators) {
    if (ind) {
      log(`  ${ind.name}: ${ind.value} (${ind.label})`);
    } else {
      const idx = indicators.indexOf(ind);
      const names = Object.keys(WEIGHTS);
      log(`  ${names[idx] ?? "Unknown"}: FAILED — data unavailable`);
    }
  }

  // 5. Aggregate
  const result = calculateFearGreedIndex(indicators);
  if (!result) {
    log("ERROR: Could not calculate F&G Index — all indicators failed");
    process.exit(1);
  }

  log(
    `\n  ═══ GPW Fear & Greed Index: ${result.value} (${result.label}) ═══`
  );
  log(`  Using ${result.indicatorsUsed}/${result.indicatorsTotal} indicators`);

  // 6. Load existing history and append
  let history = [];
  if (existsSync(HISTORY_PATH)) {
    try {
      history = JSON.parse(readFileSync(HISTORY_PATH, "utf-8"));
      if (!Array.isArray(history)) history = [];
    } catch {
      history = [];
    }
  }

  // Deduplicate by date — replace existing entry for today
  const today = new Date().toISOString().slice(0, 10);
  history = history.filter((h) => h.date !== today);
  history.push({
    date: today,
    value: result.value,
    label: result.label,
    color: result.color,
    indicators: result.indicators.map((ind) => ({
      name: ind.name,
      value: ind.value,
      label: ind.label,
      description: ind.description,
    })),
    indicatorsUsed: result.indicatorsUsed,
    updatedAt: result.updatedAt,
  });

  // Sort by date ascending
  history.sort((a, b) => a.date.localeCompare(b.date));

  // Keep max 730 days (2 years)
  if (history.length > 730) {
    history = history.slice(-730);
  }

  // 7. Write
  writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2) + "\n");

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  log(`Done! History now has ${history.length} entries. Took ${elapsed}s.`);
  log(`Written to: ${HISTORY_PATH}`);
}

main().catch((err) => {
  console.error("[F&G] Fatal error:", err);
  process.exit(1);
});

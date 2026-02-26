#!/usr/bin/env node

/**
 * Audit GPW companies — checks every ticker against Yahoo Finance and Stooq.
 * Companies with NO data from either source are candidates for removal.
 *
 * Usage: node scripts/audit-companies.mjs
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { toYahoo } from "../api/_yahoo-map.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

// ─── Load companies ──────────────────────────────────────

function loadCompanies() {
  const filePath = join(__dirname, "..", "src", "data", "gpw-companies.js");
  const raw = readFileSync(filePath, "utf-8");
  const tickers = [];
  const regex = /\{\s*ticker:\s*"([^"]+)",\s*stooq:\s*"([^"]+)",\s*name:\s*"([^"]*)",\s*sector:\s*"([^"]*)",\s*index:\s*"([^"]*)"/g;
  let match;
  while ((match = regex.exec(raw)) !== null) {
    tickers.push({ ticker: match[1], stooq: match[2], name: match[3], sector: match[4], index: match[5] });
  }
  return tickers;
}

// ─── Yahoo Finance v8/chart check ────────────────────────

async function checkYahoo(yahooSymbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=5d`;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": UA, Accept: "application/json" },
    });
    clearTimeout(t);
    if (!res.ok) return false;
    const j = await res.json();
    const closes = j?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];
    const valid = closes.filter(c => c != null && !isNaN(c) && c > 0);
    return valid.length > 0;
  } catch {
    return false;
  }
}

// ─── Stooq CSV check ────────────────────────────────────

async function checkStooq(stooqSymbol) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 14);
  const d1 = fmtDate(start);
  const d2 = fmtDate(end);
  const url = `https://stooq.pl/q/d/l/?s=${stooqSymbol.toLowerCase()}&d1=${d1}&d2=${d2}&i=d`;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": UA, Accept: "text/csv, */*" },
    });
    clearTimeout(t);
    if (!res.ok) return false;
    const csv = await res.text();
    const lines = csv.trim().split("\n");
    if (lines.length < 2) return false;
    // Check at least one valid close price
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      if (cols.length >= 5) {
        const close = parseFloat(cols[4]);
        if (!isNaN(close) && close > 0) return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Main ────────────────────────────────────────────────

async function main() {
  const companies = loadCompanies();
  console.log(`\n[AUDIT] Checking ${companies.length} GPW companies...\n`);

  const results = [];
  const BATCH = 5;

  for (let i = 0; i < companies.length; i += BATCH) {
    const batch = companies.slice(i, i + BATCH);
    const batchResults = await Promise.all(
      batch.map(async (c) => {
        const yahoo = toYahoo(c.stooq);
        const hasYahoo = await checkYahoo(yahoo);
        // Only check Stooq if Yahoo failed (saves rate limit)
        const hasStooq = hasYahoo ? false : await checkStooq(c.stooq);
        let status;
        if (hasYahoo) status = "OK";
        else if (hasStooq) status = "STOOQ_ONLY";
        else status = "NO_DATA";
        return { ...c, yahoo, hasYahoo, hasStooq, status };
      })
    );
    results.push(...batchResults);

    // Progress
    const done = Math.min(i + BATCH, companies.length);
    const noData = results.filter(r => r.status === "NO_DATA").length;
    process.stdout.write(`\r  [${done}/${companies.length}] checked — ${noData} without data`);

    if (i + BATCH < companies.length) await sleep(200);
  }

  console.log("\n");

  // ─── Report ─────────────────────────────────────────────

  const ok = results.filter(r => r.status === "OK");
  const stooqOnly = results.filter(r => r.status === "STOOQ_ONLY");
  const noData = results.filter(r => r.status === "NO_DATA");

  console.log("═══════════════════════════════════════════════════════");
  console.log(`  SUMMARY: ${ok.length} OK | ${stooqOnly.length} Stooq-only | ${noData.length} NO DATA`);
  console.log("═══════════════════════════════════════════════════════\n");

  if (stooqOnly.length > 0) {
    console.log("── Stooq-only (Yahoo missing, Stooq has data) ──");
    for (const r of stooqOnly) {
      console.log(`  ${r.ticker.padEnd(6)} ${r.name.padEnd(40)} ${r.index.padEnd(8)} yahoo=${r.yahoo}`);
    }
    console.log();
  }

  if (noData.length > 0) {
    console.log("── NO DATA (remove candidates) ──");
    // Separate index members from WIG (broad)
    const indexNoData = noData.filter(r => ["WIG20", "mWIG40", "sWIG80"].includes(r.index));
    const wigNoData = noData.filter(r => r.index === "WIG");

    if (indexNoData.length > 0) {
      console.log("  WARNING — Index members (WIG20/mWIG40/sWIG80) with no data:");
      for (const r of indexNoData) {
        console.log(`    ${r.ticker.padEnd(6)} ${r.name.padEnd(40)} ${r.index}`);
      }
    }

    if (wigNoData.length > 0) {
      console.log("  WIG (broad) — SAFE TO REMOVE:");
      for (const r of wigNoData) {
        console.log(`    ${r.ticker.padEnd(6)} ${r.name.padEnd(40)} yahoo=${r.yahoo}`);
      }
    }
    console.log();
  }

  // Output tickers to remove (WIG-only, no data)
  const toRemove = noData.filter(r => r.index === "WIG").map(r => r.ticker);
  if (toRemove.length > 0) {
    console.log(`TICKERS TO REMOVE (${toRemove.length}):`);
    console.log(JSON.stringify(toRemove));
  } else {
    console.log("No tickers to remove — all have data from at least one source.");
  }

  console.log(`\nAfter removal: ${companies.length - toRemove.length} companies`);
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});

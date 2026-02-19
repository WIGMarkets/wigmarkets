/**
 * Cron job: runs daily at 05:00 UTC (= 06:00–07:00 Warsaw time, before GPW open).
 * 1. Authenticates with Yahoo Finance (cookie + crumb).
 * 2. POSTs to the screener: top 300 WSE equities by market cap.
 * 3. Saves the stock list + initial quote snapshot to Upstash Redis (30h TTL).
 *
 * Vercel automatically adds   Authorization: Bearer <CRON_SECRET>   to cron requests.
 * Set CRON_SECRET in your Vercel project env vars (Settings → Environment Variables).
 */

import { YF_HEADERS } from "./yahoo-map.js";
import { kvMSet } from "./kv.js";

const UA = YF_HEADERS["User-Agent"];

const SECTOR_MAP = {
  "Basic Materials":        "Surowce",
  "Communication Services": "Telekomunikacja",
  "Consumer Cyclical":      "Dobra cykliczne",
  "Consumer Defensive":     "FMCG",
  "Energy":                 "Energia",
  "Financial Services":     "Finanse",
  "Healthcare":             "Ochrona zdrowia",
  "Industrials":            "Przemysł",
  "Real Estate":            "Nieruchomości",
  "Technology":             "Technologia",
  "Utilities":              "Usługi komunalne",
};

// Authenticate with Yahoo Finance (same pattern as api/fundamentals.js)
async function getYahooCrumb() {
  const cookieRes = await fetch("https://finance.yahoo.com/", {
    headers: {
      "User-Agent": UA,
      "Accept": "text/html,application/xhtml+xml,*/*",
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
  const cookieStr = rawCookies.map(c => c.split(";")[0].trim()).filter(Boolean).join("; ");

  const crumbRes = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
    headers: { "User-Agent": UA, "Cookie": cookieStr, "Accept": "text/plain, */*" },
  });
  const crumb = (await crumbRes.text()).trim();
  if (!crumb || crumb.startsWith("{") || crumb.length > 20) {
    throw new Error(`Invalid crumb: "${crumb.slice(0, 50)}"`);
  }
  return { crumb, cookieStr };
}

// POST to Yahoo Finance screener: top N WSE equities sorted by market cap
async function fetchWSEScreener(crumb, cookieStr, size = 300) {
  const body = {
    size,
    offset: 0,
    sortField: "marketcap",
    sortType: "DESC",
    quoteType: "EQUITY",
    query: {
      operator: "AND",
      operands: [{ operator: "EQ", operands: ["exchange", "WSE"] }],
    },
    userId: "",
    userIdType: "guid",
  };

  const url = `https://query1.finance.yahoo.com/v1/finance/screener?lang=en-US&region=US&crumb=${encodeURIComponent(crumb)}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": UA,
      "Cookie": cookieStr,
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Screener HTTP ${resp.status}: ${text.slice(0, 200)}`);
  }

  const data = await resp.json();
  const quotes = data?.finance?.result?.[0]?.quotes;
  if (!Array.isArray(quotes)) {
    throw new Error(`Unexpected screener shape: ${JSON.stringify(data).slice(0, 300)}`);
  }
  return quotes;
}

export default async function handler(req, res) {
  // Verify Vercel cron secret (Vercel injects this automatically for scheduled runs)
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    console.log("[cron-refresh] Starting GPW refresh…");

    // 1. Auth
    const { crumb, cookieStr } = await getYahooCrumb();

    // 2. Screener
    const rawQuotes = await fetchWSEScreener(crumb, cookieStr, 300);
    if (rawQuotes.length === 0) {
      return res.status(502).json({ error: "Screener returned 0 quotes" });
    }

    // 3. Build normalised stock list + initial quote snapshot
    const stocks = [];
    const quotes = {};

    for (let i = 0; i < rawQuotes.length; i++) {
      const q = rawQuotes[i];
      if (!q?.symbol) continue;

      const ticker = q.symbol.replace(/\.WA$/i, "");
      const stooq  = ticker.toLowerCase();
      const sector = SECTOR_MAP[q.sector] || q.sector || "Inne";

      // Sanitise P/E (skip negative, infinity, >10 000)
      const pe =
        q.trailingPE && isFinite(q.trailingPE) && q.trailingPE > 0 && q.trailingPE < 10_000
          ? parseFloat(q.trailingPE.toFixed(1))
          : null;

      // Dividend yield — YF screener returns decimal (0.042 = 4.2%) or occasionally %
      const divRaw = q.dividendYield ?? q.trailingAnnualDividendYield ?? 0;
      const div = divRaw > 0
        ? parseFloat((divRaw < 1 ? divRaw * 100 : divRaw).toFixed(2))
        : null;

      // Market cap in millions PLN
      const cap = q.marketCap ? Math.round(q.marketCap / 1_000_000) : 0;

      stocks.push({
        id: i + 1,
        ticker,
        stooq,
        name: q.longName || q.shortName || ticker,
        sector,
        cap,
        pe,
        div,
      });

      // Initial quote snapshot (change7d not in screener; live poll fills it within 60s)
      if (q.regularMarketPrice) {
        quotes[ticker] = {
          close:     q.regularMarketPrice,
          volume:    q.regularMarketVolume  || 0,
          change24h: q.regularMarketChangePercent != null
            ? parseFloat(q.regularMarketChangePercent.toFixed(2))
            : 0,
          change7d: null,
        };
      }
    }

    // 4. Persist to Redis — 30h TTL (survives one full trading day + buffer)
    const EX = 30 * 3600;
    await kvMSet(
      [
        { key: "gpw:stocks",       value: stocks },
        { key: "gpw:quotes",       value: quotes },
        { key: "gpw:last_refresh", value: new Date().toISOString() },
      ],
      EX
    );

    console.log(`[cron-refresh] Saved ${stocks.length} stocks.`);
    return res.status(200).json({ ok: true, count: stocks.length, ts: new Date().toISOString() });

  } catch (err) {
    console.error("[cron-refresh] Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

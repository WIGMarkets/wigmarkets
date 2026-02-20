/**
 * Returns the 300 largest GPW (WSE) stocks by market cap, fetched directly
 * from the Yahoo Finance screener.
 *
 * No Redis / KV / cron needed. Vercel CDN caches the response for 24 hours
 * (s-maxage=86400), so Yahoo Finance is hit at most once per day per region.
 * stale-while-revalidate=3600 keeps old data serving while the CDN refreshes
 * in the background.
 *
 * On cache miss the endpoint authenticates with Yahoo Finance (cookie + crumb)
 * and POSTs to the screener — takes ~2–4 s, well within serverless limits.
 *
 * Returns:
 *   { ok: true,  stocks: [...], quotes: {...}, ts: "2025-02-19T05:00:00.000Z" }
 *   { ok: false, error: "..." }
 */

import { YF_HEADERS } from "./yahoo-map.js";

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
  // 24-hour CDN cache — Vercel edge serves cached responses for one day,
  // then refreshes in the background. Equivalent to a daily cron, zero setup.
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=3600");

  try {
    const { crumb, cookieStr } = await getYahooCrumb();
    const rawQuotes = await fetchWSEScreener(crumb, cookieStr, 300);

    const stocks = [];
    const quotes = {};

    for (let i = 0; i < rawQuotes.length; i++) {
      const q = rawQuotes[i];
      if (!q?.symbol) continue;

      const ticker = q.symbol.replace(/\.WA$/i, "");
      const stooq  = ticker.toLowerCase();
      const sector = SECTOR_MAP[q.sector] || q.sector || "Inne";

      const pe =
        q.trailingPE && isFinite(q.trailingPE) && q.trailingPE > 0 && q.trailingPE < 10_000
          ? parseFloat(q.trailingPE.toFixed(1))
          : null;

      const divRaw = q.dividendYield ?? q.trailingAnnualDividendYield ?? 0;
      const div = divRaw > 0
        ? parseFloat((divRaw < 1 ? divRaw * 100 : divRaw).toFixed(2))
        : null;

      stocks.push({
        id: i + 1,
        ticker,
        stooq,
        name:   q.longName || q.shortName || ticker,
        sector,
        cap:    q.marketCap ? Math.round(q.marketCap / 1_000_000) : 0,
        pe,
        div,
      });

      if (q.regularMarketPrice) {
        quotes[ticker] = {
          close:     q.regularMarketPrice,
          volume:    q.regularMarketVolume || 0,
          change24h: q.regularMarketChangePercent != null
            ? parseFloat(q.regularMarketChangePercent.toFixed(2))
            : 0,
          change7d: null,
        };
      }
    }

    return res.status(200).json({ ok: true, stocks, quotes, ts: new Date().toISOString() });

  } catch (err) {
    console.error("[gpw-screener]", err.message);
    return res.status(200).json({ ok: false, error: err.message });
  }
}

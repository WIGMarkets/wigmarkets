import { YF_HEADERS } from "./yahoo-map.js";

// Poprawne symbole Yahoo Finance dla indeksów GPW.
// ^ prefix to standard YF dla indeksów (tak jak ^GSPC dla S&P500).
// .WA dotyczy tylko SPÓŁEK na GPW, NIE indeksów.
const INDEX_SYMBOLS = [
  { name: "WIG20",  yahoo: "^WIG20"  },
  { name: "WIG",    yahoo: "^WIG"    },
  { name: "mWIG40", yahoo: "^MWIG40" },
  { name: "sWIG80", yahoo: "^SWIG80" },
];

// Próbuje fetcha z retry (query1 → query2) i backoffem
async function fetchYFChart(symbol, retries = 2) {
  const hosts = ["query1", "query2"];
  const encoded = encodeURIComponent(symbol);
  // range=1mo: ~22 dni handlowe, zawsze wystarczy danych na sparkline + zmianę 24h
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

async function fetchIndex({ name, yahoo }) {
  const result = await fetchYFChart(yahoo);
  if (!result) return { name, value: null, change24h: null, sparkline: [] };

  const timestamps = result.timestamp || [];
  const rawCloses  = result.indicators?.quote?.[0]?.close || [];

  // Filtrujemy null — dzisiejszy bar może być pusty gdy rynek otwarty
  const closes = rawCloses.filter(c => c !== null && c !== undefined && !isNaN(c) && c > 0);
  if (closes.length < 1) return { name, value: null, change24h: null, sparkline: [] };

  const today     = closes[closes.length - 1];
  const yesterday = closes.length >= 2 ? closes[closes.length - 2] : null;
  const change24h = yesterday != null
    ? parseFloat((((today - yesterday) / yesterday) * 100).toFixed(2))
    : null;

  // Sparkline [{date, close}] z timestampów — IndekSparkline w karcie używa .close
  const sparkline = timestamps
    .map((ts, i) => ({
      date:  new Date(ts * 1000).toISOString().slice(0, 10),
      close: rawCloses[i],
    }))
    .filter(p => p.close !== null && p.close !== undefined && !isNaN(p.close) && p.close > 0);

  return { name, value: today, change24h, sparkline };
}

export default async function handler(req, res) {
  try {
    // Sekwencyjnie z małym staggerem — zapobiega rate-limitingowi przy 4 naraz
    const results = [];
    for (const sym of INDEX_SYMBOLS) {
      results.push(await fetchIndex(sym));
      // 80ms przerwy między requestami, pomija ostatni
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

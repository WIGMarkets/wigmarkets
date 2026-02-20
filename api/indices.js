import { YF_HEADERS } from "./yahoo-map.js";

// Używamy symboli .WA zamiast ^ — ten sam format co dla spółek GPW.
// WIG20.WA i WIG.WA są obsługiwane przez Yahoo Finance Chart API.
const INDEX_SYMBOLS = [
  { name: "WIG20",  yahoo: "WIG20.WA"  },
  { name: "WIG",    yahoo: "WIG.WA"    },
  { name: "mWIG40", yahoo: "MWIG40.WA" },
  { name: "sWIG80", yahoo: "SWIG80.WA" },
];

export default async function handler(req, res) {
  try {
    const results = await Promise.all(
      INDEX_SYMBOLS.map(async ({ name, yahoo }) => {
        // range=1mo daje ~22 dni handlowe — wystarczy na sparkline 30D i zmianę 24h
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahoo)}?interval=1d&range=1mo`;

        let json;
        try {
          const response = await fetch(url, { headers: YF_HEADERS });
          if (!response.ok) return { name, value: null, change24h: null, sparkline: [] };
          json = await response.json();
        } catch {
          return { name, value: null, change24h: null, sparkline: [] };
        }

        const result = json?.chart?.result?.[0];
        if (!result) return { name, value: null, change24h: null, sparkline: [] };

        const timestamps = result.timestamp || [];
        const rawCloses  = result.indicators?.quote?.[0]?.close || [];

        const closes = rawCloses.filter(c => c !== null && !isNaN(c));
        if (closes.length < 2) return { name, value: null, change24h: null, sparkline: [] };

        const today     = closes[closes.length - 1];
        const yesterday = closes[closes.length - 2];
        const change24h = ((today - yesterday) / yesterday) * 100;

        // Budujemy dane sparkline [{date, close}] z pełnych timestampów
        const sparkline = timestamps
          .map((ts, i) => ({
            date:  new Date(ts * 1000).toISOString().slice(0, 10),
            close: rawCloses[i],
          }))
          .filter(p => p.close !== null && !isNaN(p.close));

        return {
          name,
          value:    today,
          change24h: parseFloat(change24h.toFixed(2)),
          sparkline,
        };
      })
    );

    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch indices" });
  }
}

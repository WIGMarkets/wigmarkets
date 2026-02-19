// Yahoo Finance symbols for GPW indices
const INDEX_SYMBOLS = [
  { name: "WIG20",  yahoo: "^WIG20"  },
  { name: "WIG",    yahoo: "^WIG"    },
  { name: "mWIG40", yahoo: "^MWIG40" },
  { name: "sWIG80", yahoo: "^SWIG80" },
];

const YF_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
};

export default async function handler(req, res) {
  try {
    const results = await Promise.all(
      INDEX_SYMBOLS.map(async ({ name, yahoo }) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahoo)}?interval=1d&range=5d`;
        const response = await fetch(url, { headers: YF_HEADERS });
        const json = await response.json();

        const result = json?.chart?.result?.[0];
        if (!result) return { name, value: null, change24h: null };

        const closes = (result.indicators?.quote?.[0]?.close || []).filter(c => c !== null && !isNaN(c));
        if (closes.length < 2) return { name, value: null, change24h: null };

        const today     = closes[closes.length - 1];
        const yesterday = closes[closes.length - 2];
        const change24h = ((today - yesterday) / yesterday) * 100;

        return {
          name,
          value:    today,
          change24h: parseFloat(change24h.toFixed(2)),
        };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch indices" });
  }
}

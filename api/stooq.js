const YAHOO_MAP = {
  "dia": "DIAG.WA",
  "xau":     "GC=F",
  "xag":     "SI=F",
  "cl.f":    "CL=F",
  "ng.f":    "NG=F",
  "hg.f":    "HG=F",
  "weat.us": "WEAT",
  "corn.us": "CORN",
  "soy.us":  "SOYB",
  "xpt":     "PL=F",
  "xpd":     "PA=F",
};

function toYahoo(stooq) {
  const s = stooq.toLowerCase();
  return YAHOO_MAP[s] || (s.toUpperCase() + ".WA");
}

const YF_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
};

export default async function handler(req, res) {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: "symbol parameter required" });

  const yahooSymbol = toYahoo(symbol);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=10d`;

  try {
    const response = await fetch(url, { headers: YF_HEADERS });
    const json = await response.json();

    const result = json?.chart?.result?.[0];
    if (!result) return res.status(404).json({ error: "No data" });

    const rawCloses = result.indicators?.quote?.[0]?.close || [];
    const closes = rawCloses.filter(c => c !== null && !isNaN(c));
    if (closes.length < 1) return res.status(404).json({ error: "No data" });

    const today     = closes[closes.length - 1];
    const yesterday = closes.length >= 2 ? closes[closes.length - 2] : today;
    const weekAgo   = closes.length >= 6 ? closes[closes.length - 6] : yesterday;

    const rawVolumes = result.indicators?.quote?.[0]?.volume || [];
    const volume = rawVolumes[rawVolumes.length - 1] || 0;

    const change24h = yesterday ? ((today - yesterday) / yesterday) * 100 : 0;
    const change7d  = weekAgo   ? ((today - weekAgo)   / weekAgo)   * 100 : 0;

    res.status(200).json({
      symbol,
      close: today,
      volume,
      change24h: parseFloat(change24h.toFixed(2)),
      change7d:  parseFloat(change7d.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
}

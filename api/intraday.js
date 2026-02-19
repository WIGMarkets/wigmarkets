const YAHOO_MAP = {
  "dia":     "DIAG.WA",
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
  if (!symbol) return res.status(400).json({ error: "Symbol is required" });

  const yahooSymbol = toYahoo(symbol);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=5m&range=1d`;

  try {
    const response = await fetch(url, { headers: YF_HEADERS });
    const json = await response.json();

    const result = json?.chart?.result?.[0];
    if (!result) return res.status(404).json({ error: "No data" });

    const timestamps = result.timestamp || [];
    const quote = result.indicators?.quote?.[0] || {};
    const rawOpens  = quote.open  || [];
    const rawHighs  = quote.high  || [];
    const rawLows   = quote.low   || [];
    const rawCloses = quote.close || [];

    if (timestamps.length < 2) return res.status(404).json({ error: "No data" });

    const prices = timestamps
      .map((ts, i) => ({
        time:  new Date(ts * 1000).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" }),
        open:  rawOpens[i],
        high:  rawHighs[i],
        low:   rawLows[i],
        close: rawCloses[i],
      }))
      .filter(p => p.close !== null && !isNaN(p.close));

    res.status(200).json({ prices });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
}

export const fmt = (n, d = 2) => n?.toLocaleString("pl-PL", { minimumFractionDigits: d, maximumFractionDigits: d }) ?? "—";
export const changeColor = (v) => v > 0 ? "#00c896" : v < 0 ? "#ff4d6d" : "#8b949e";
export const changeFmt = (v) => `${v > 0 ? "+" : ""}${fmt(v)}%`;

const YAHOO_SYMBOL_MAP = {
  "dia": "DIAG.WA",
  "xau": "GC=F", "xag": "SI=F",
  "cl.f": "CL=F", "ng.f": "NG=F", "hg.f": "HG=F",
  "weat.us": "WEAT", "corn.us": "CORN", "soy.us": "SOYB",
  "xpt": "PL=F", "xpd": "PA=F",
};

export function getYahooSymbol(stooq) {
  const s = (stooq || "").toLowerCase();
  return YAHOO_SYMBOL_MAP[s] || (s.toUpperCase() + ".WA");
}

export function calculateRSI(prices, period = 14) {
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
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

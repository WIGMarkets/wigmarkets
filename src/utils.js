export const fmt = (n, d = 2) => n?.toLocaleString("pl-PL", { minimumFractionDigits: d, maximumFractionDigits: d }) ?? "—";
export const changeColor = (v) => v > 0 ? "#22c55e" : v < 0 ? "#ef4444" : "#94a3b8";
export const changeFmt = (v) => `${v > 0 ? "▲ +" : v < 0 ? "▼ " : ""}${fmt(v)}%`;

const YAHOO_SYMBOL_MAP = {
  // GPW stocks with non-standard Yahoo Finance tickers
  "dia": "DIAG.WA",  // Diagnostyka: GPW=DIAG, stooq=dia
  "11b": "11B.WA",   // 11 bit studios (numeric prefix)
  "1at": "1AT.WA",   // Atal SA (numeric prefix)
  "grn": "GRN.WA",   // Grenevia SA
  "sfg": "SFG.WA",   // Synektik SA
  "r22": "R22.WA",   // R22 SA (numeric in ticker)
  "zab": "ZAB.WA",   // Żabka Group
  "sho": "SHO.WA",   // Shoper SA
  "vrc": "VRC.WA",   // Vercom SA
  "sts": "STS.WA",   // STS Holding
  "dad": "DAD.WA",   // Dadelo SA
  "inp": "INPST.AS", // InPost — listed on Euronext Amsterdam, not GPW
  // Commodities
  "xau": "GC=F", "xag": "SI=F",
  "cl.f": "CL=F", "ng.f": "NG=F", "hg.f": "HG=F",
  "weat.us": "WEAT", "corn.us": "CORN", "soy.us": "SOYB",
  "xpt": "PL=F", "xpd": "PA=F",
};

const FOREX_RE = /^[a-z]{6}$/;

export function getYahooSymbol(stooq) {
  const s = (stooq || "").toLowerCase();
  if (YAHOO_SYMBOL_MAP[s]) return YAHOO_SYMBOL_MAP[s];
  if (FOREX_RE.test(s)) return s.toUpperCase() + "=X";
  return s.toUpperCase() + ".WA";
}

export function isForex(stock) {
  return stock.id >= 301 && stock.id <= 400;
}

export function isCommodity(stock) {
  return stock.id >= 201 && stock.id <= 300;
}

export function getUnit(stock) {
  if (stock.unit) return stock.unit;
  if (isForex(stock)) return "";
  if (isCommodity(stock)) return "";
  return "zł";
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

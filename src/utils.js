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

export function calculateSMA(closes, period) {
  if (!closes || closes.length < period) return null;
  const slice = closes.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function emaArray(values, period) {
  if (!values || values.length < period) return [];
  const k = 2 / (period + 1);
  const result = [values.slice(0, period).reduce((a, b) => a + b, 0) / period];
  for (let i = period; i < values.length; i++) {
    result.push(values[i] * k + result[result.length - 1] * (1 - k));
  }
  return result;
}

export function calculateMACD(prices) {
  if (!prices || prices.length < 35) return null;
  const closes = prices.map(p => p.close);
  const ema12 = emaArray(closes, 12);
  const ema26 = emaArray(closes, 26);
  if (ema26.length === 0) return null;
  const offset = 14; // 26 - 12
  const macdLine = [];
  for (let i = 0; i < ema26.length; i++) {
    macdLine.push(ema12[i + offset] - ema26[i]);
  }
  if (macdLine.length < 9) return null;
  const signalArr = emaArray(macdLine, 9);
  if (signalArr.length === 0) return null;
  const macd = macdLine[macdLine.length - 1];
  const signal = signalArr[signalArr.length - 1];
  return {
    macd: parseFloat(macd.toFixed(2)),
    signal: parseFloat(signal.toFixed(2)),
    histogram: parseFloat((macd - signal).toFixed(2)),
  };
}

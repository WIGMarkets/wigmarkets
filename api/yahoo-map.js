// Shared Yahoo Finance symbol mapping used by all API handlers.
// GPW stocks: default is uppercase(stooq) + ".WA" (e.g. "pkn" → "PKN.WA")
// Commodities, forex, and special cases are listed explicitly.

const YAHOO_MAP = {
  // GPW stocks with non-standard Yahoo Finance tickers
  "dia":  "DIAG.WA",
  "11b":  "11B.WA",
  "1at":  "1AT.WA",
  "grn":  "GRN.WA",
  "sfg":  "SFG.WA",
  "r22":  "R22.WA",
  "zab":  "ZAB.WA",
  "gpp":  "GPP.WA",
  "sho":  "SHO.WA",
  "vrc":  "VRC.WA",
  "sts":  "STS.WA",
  "dad":  "DAD.WA",
  "pct":  "PCF.WA",
  "inp":  "INPST.AS",  // InPost — listed on Euronext Amsterdam, not GPW
  // Commodities
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

const FOREX_RE = /^[a-z]{6}$/;

export function toYahoo(stooq) {
  const s = stooq.toLowerCase();
  if (YAHOO_MAP[s]) return YAHOO_MAP[s];
  if (FOREX_RE.test(s)) return s.toUpperCase() + "=X";
  return s.toUpperCase() + ".WA";
}

export const YF_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
};

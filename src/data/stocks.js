// STOCKS is generated from GPW_COMPANIES master list (~300 entries).
// This serves as the fallback when /api/gpw-screener is unavailable.
import { GPW_COMPANIES } from "./gpw-companies.js";

export const STOCKS = GPW_COMPANIES.map((c, i) => ({
  id: i + 1,
  ticker: c.ticker,
  stooq:  c.stooq,
  name:   c.name,
  sector: c.sector,
  price:  0,
  cap:    0,
  pe:     null,
  div:    null,
}));

export const COMMODITIES = [
  { id: 201, ticker: "XAU",  stooq: "xau",     name: "Złoto",            sector: "Metal szlachetny",  price: 0, change24h: 0, change7d: 0, unit: "USD/oz"    },
  { id: 202, ticker: "XAG",  stooq: "xag",     name: "Srebro",           sector: "Metal szlachetny",  price: 0, change24h: 0, change7d: 0, unit: "USD/oz"    },
  { id: 203, ticker: "CL",   stooq: "cl.f",    name: "Ropa naftowa WTI", sector: "Energia",           price: 0, change24h: 0, change7d: 0, unit: "USD/bbl"   },
  { id: 204, ticker: "NG",   stooq: "ng.f",    name: "Gaz ziemny",       sector: "Energia",           price: 0, change24h: 0, change7d: 0, unit: "USD/MMBtu" },
  { id: 205, ticker: "HG",   stooq: "hg.f",    name: "Miedź",            sector: "Metal przemysłowy", price: 0, change24h: 0, change7d: 0, unit: "USD/lb"    },
  { id: 206, ticker: "WEAT", stooq: "weat.us", name: "Pszenica",          sector: "Rolnictwo",         price: 0, change24h: 0, change7d: 0, unit: "USD/bu"    },
  { id: 207, ticker: "CORN", stooq: "corn.us", name: "Kukurydza",         sector: "Rolnictwo",         price: 0, change24h: 0, change7d: 0, unit: "USD/bu"    },
  { id: 208, ticker: "SOY",  stooq: "soy.us",  name: "Soja",             sector: "Rolnictwo",         price: 0, change24h: 0, change7d: 0, unit: "USD/bu"    },
  { id: 209, ticker: "XPT",  stooq: "xpt",     name: "Platyna",          sector: "Metal szlachetny",  price: 0, change24h: 0, change7d: 0, unit: "USD/oz"    },
  { id: 210, ticker: "XPD",  stooq: "xpd",     name: "Pallad",           sector: "Metal szlachetny",  price: 0, change24h: 0, change7d: 0, unit: "USD/oz"    },
];

export const FOREX = [
  // ─── Pary PLN ─────────────────────────────────────────────────
  { id: 301, ticker: "USDPLN", stooq: "usdpln", name: "Dolar / Złoty",               sector: "PLN",        price: 0, unit: "" },
  { id: 302, ticker: "EURPLN", stooq: "eurpln", name: "Euro / Złoty",                sector: "PLN",        price: 0, unit: "" },
  { id: 303, ticker: "GBPPLN", stooq: "gbppln", name: "Funt / Złoty",                sector: "PLN",        price: 0, unit: "" },
  { id: 304, ticker: "CHFPLN", stooq: "chfpln", name: "Frank / Złoty",               sector: "PLN",        price: 0, unit: "" },
  { id: 305, ticker: "AUDPLN", stooq: "audpln", name: "Dolar AUD / Złoty",           sector: "PLN",        price: 0, unit: "" },
  { id: 306, ticker: "CADPLN", stooq: "cadpln", name: "Dolar CAD / Złoty",           sector: "PLN",        price: 0, unit: "" },
  { id: 307, ticker: "NOKPLN", stooq: "nokpln", name: "Korona NOK / Złoty",          sector: "PLN",        price: 0, unit: "" },
  { id: 308, ticker: "SEKPLN", stooq: "sekpln", name: "Korona SEK / Złoty",          sector: "PLN",        price: 0, unit: "" },
  { id: 309, ticker: "CZKPLN", stooq: "czkpln", name: "Korona CZK / Złoty",          sector: "PLN",        price: 0, unit: "" },
  { id: 310, ticker: "DKKPLN", stooq: "dkkpln", name: "Korona DKK / Złoty",          sector: "PLN",        price: 0, unit: "" },
  { id: 311, ticker: "JPYPLN", stooq: "jpypln", name: "Jen / Złoty",                 sector: "PLN",        price: 0, unit: "" },
  { id: 312, ticker: "HUFPLN", stooq: "hufpln", name: "Forint / Złoty",              sector: "PLN",        price: 0, unit: "" },
  // ─── Główne (Majors) ─────────────────────────────────────────
  { id: 313, ticker: "EURUSD", stooq: "eurusd", name: "Euro / Dolar",                sector: "Główne",     price: 0, unit: "" },
  { id: 314, ticker: "GBPUSD", stooq: "gbpusd", name: "Funt / Dolar",                sector: "Główne",     price: 0, unit: "" },
  { id: 315, ticker: "USDJPY", stooq: "usdjpy", name: "Dolar / Jen",                 sector: "Główne",     price: 0, unit: "" },
  { id: 316, ticker: "USDCHF", stooq: "usdchf", name: "Dolar / Frank",               sector: "Główne",     price: 0, unit: "" },
  { id: 317, ticker: "AUDUSD", stooq: "audusd", name: "Dolar AUD / Dolar USD",       sector: "Główne",     price: 0, unit: "" },
  { id: 318, ticker: "NZDUSD", stooq: "nzdusd", name: "Dolar NZD / Dolar USD",       sector: "Główne",     price: 0, unit: "" },
  { id: 319, ticker: "USDCAD", stooq: "usdcad", name: "Dolar / Dolar CAD",           sector: "Główne",     price: 0, unit: "" },
  // ─── EUR krzyżowe ─────────────────────────────────────────────
  { id: 320, ticker: "EURGBP", stooq: "eurgbp", name: "Euro / Funt",                 sector: "EUR",        price: 0, unit: "" },
  { id: 321, ticker: "EURJPY", stooq: "eurjpy", name: "Euro / Jen",                  sector: "EUR",        price: 0, unit: "" },
  { id: 322, ticker: "EURCHF", stooq: "eurchf", name: "Euro / Frank",                sector: "EUR",        price: 0, unit: "" },
  { id: 323, ticker: "EURAUD", stooq: "euraud", name: "Euro / Dolar AUD",            sector: "EUR",        price: 0, unit: "" },
  { id: 324, ticker: "EURCAD", stooq: "eurcad", name: "Euro / Dolar CAD",            sector: "EUR",        price: 0, unit: "" },
  { id: 325, ticker: "EURNZD", stooq: "eurnzd", name: "Euro / Dolar NZD",            sector: "EUR",        price: 0, unit: "" },
  { id: 326, ticker: "EURNOK", stooq: "eurnok", name: "Euro / Korona NOK",           sector: "EUR",        price: 0, unit: "" },
  { id: 327, ticker: "EURSEK", stooq: "eursek", name: "Euro / Korona SEK",           sector: "EUR",        price: 0, unit: "" },
  // ─── GBP krzyżowe ─────────────────────────────────────────────
  { id: 328, ticker: "GBPJPY", stooq: "gbpjpy", name: "Funt / Jen",                  sector: "GBP",        price: 0, unit: "" },
  { id: 329, ticker: "GBPCHF", stooq: "gbpchf", name: "Funt / Frank",                sector: "GBP",        price: 0, unit: "" },
  { id: 330, ticker: "GBPAUD", stooq: "gbpaud", name: "Funt / Dolar AUD",            sector: "GBP",        price: 0, unit: "" },
  { id: 331, ticker: "GBPCAD", stooq: "gbpcad", name: "Funt / Dolar CAD",            sector: "GBP",        price: 0, unit: "" },
  { id: 332, ticker: "GBPNZD", stooq: "gbpnzd", name: "Funt / Dolar NZD",            sector: "GBP",        price: 0, unit: "" },
  // ─── Pozostałe krzyżowe ───────────────────────────────────────
  { id: 333, ticker: "AUDJPY", stooq: "audjpy", name: "Dolar AUD / Jen",             sector: "Krzyżowe",   price: 0, unit: "" },
  { id: 334, ticker: "AUDNZD", stooq: "audnzd", name: "Dolar AUD / Dolar NZD",       sector: "Krzyżowe",   price: 0, unit: "" },
  { id: 335, ticker: "AUDCAD", stooq: "audcad", name: "Dolar AUD / Dolar CAD",       sector: "Krzyżowe",   price: 0, unit: "" },
  { id: 336, ticker: "AUDCHF", stooq: "audchf", name: "Dolar AUD / Frank",           sector: "Krzyżowe",   price: 0, unit: "" },
  { id: 337, ticker: "NZDJPY", stooq: "nzdjpy", name: "Dolar NZD / Jen",             sector: "Krzyżowe",   price: 0, unit: "" },
  { id: 338, ticker: "NZDCAD", stooq: "nzdcad", name: "Dolar NZD / Dolar CAD",       sector: "Krzyżowe",   price: 0, unit: "" },
  { id: 339, ticker: "CADJPY", stooq: "cadjpy", name: "Dolar CAD / Jen",             sector: "Krzyżowe",   price: 0, unit: "" },
  { id: 340, ticker: "CADCHF", stooq: "cadchf", name: "Dolar CAD / Frank",           sector: "Krzyżowe",   price: 0, unit: "" },
  { id: 341, ticker: "CHFJPY", stooq: "chfjpy", name: "Frank / Jen",                 sector: "Krzyżowe",   price: 0, unit: "" },
  { id: 342, ticker: "NZDCHF", stooq: "nzdchf", name: "Dolar NZD / Frank",           sector: "Krzyżowe",   price: 0, unit: "" },
  // ─── Egzotyczne ───────────────────────────────────────────────
  { id: 343, ticker: "USDTRY", stooq: "usdtry", name: "Dolar / Lira turecka",        sector: "Egzotyczne",  price: 0, unit: "" },
  { id: 344, ticker: "USDMXN", stooq: "usdmxn", name: "Dolar / Peso meksykańskie",   sector: "Egzotyczne",  price: 0, unit: "" },
  { id: 345, ticker: "USDZAR", stooq: "usdzar", name: "Dolar / Rand",                sector: "Egzotyczne",  price: 0, unit: "" },
  { id: 346, ticker: "USDHKD", stooq: "usdhkd", name: "Dolar / Dolar HKD",           sector: "Egzotyczne",  price: 0, unit: "" },
  { id: 347, ticker: "USDSGD", stooq: "usdsgd", name: "Dolar / Dolar SGD",           sector: "Egzotyczne",  price: 0, unit: "" },
  { id: 348, ticker: "USDNOK", stooq: "usdnok", name: "Dolar / Korona NOK",          sector: "Egzotyczne",  price: 0, unit: "" },
  { id: 349, ticker: "USDSEK", stooq: "usdsek", name: "Dolar / Korona SEK",          sector: "Egzotyczne",  price: 0, unit: "" },
  { id: 350, ticker: "USDDKK", stooq: "usddkk", name: "Dolar / Korona DKK",          sector: "Egzotyczne",  price: 0, unit: "" },
];

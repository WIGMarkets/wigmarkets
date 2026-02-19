const YAHOO_MAP = {
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

function toYahoo(stooq) {
  const s = stooq.toLowerCase();
  if (YAHOO_MAP[s]) return YAHOO_MAP[s];
  if (FOREX_RE.test(s)) return s.toUpperCase() + "=X";
  return s.toUpperCase() + ".WA";
}

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

async function getYahooCrumb() {
  // Step 1: Get cookies from Yahoo Finance homepage
  const cookieRes = await fetch("https://finance.yahoo.com/", {
    headers: {
      "User-Agent": UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    redirect: "follow",
  });

  // getSetCookie() is modern Node 18+ API; fall back to get("set-cookie") for older runtimes
  let rawCookies = [];
  if (typeof cookieRes.headers.getSetCookie === "function") {
    rawCookies = cookieRes.headers.getSetCookie();
  } else {
    const raw = cookieRes.headers.get("set-cookie") || "";
    rawCookies = raw ? raw.split(/,(?=[^ ])/) : [];
  }
  const cookieStr = rawCookies.map(c => c.split(";")[0].trim()).filter(Boolean).join("; ");

  // Step 2: Get crumb using the session cookie
  const crumbRes = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
    headers: {
      "User-Agent": UA,
      "Cookie": cookieStr,
      "Accept": "text/plain, */*",
    },
  });
  const crumb = (await crumbRes.text()).trim();
  if (!crumb || crumb.startsWith("{") || crumb.length > 20) {
    throw new Error(`Invalid crumb received: ${crumb.slice(0, 50)}`);
  }
  return { crumb, cookieStr };
}

export default async function handler(req, res) {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: "Symbol is required" });

  const yahooSymbol = toYahoo(symbol);
  const modules = "incomeStatementHistory,balanceSheetHistory,defaultKeyStatistics";

  try {
    const { crumb, cookieStr } = await getYahooCrumb();

    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(yahooSymbol)}?modules=${modules}&crumb=${encodeURIComponent(crumb)}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": UA,
        "Cookie": cookieStr,
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const json = await response.json();

    const summary = json?.quoteSummary?.result?.[0];
    if (!summary) return res.status(404).json({ error: "No data", raw: json?.quoteSummary?.error });

    const income  = summary.incomeStatementHistory?.incomeStatementHistory || [];
    const balance = summary.balanceSheetHistory?.balanceSheetStatements   || [];
    const stats   = summary.defaultKeyStatistics || {};

    if (income.length === 0) return res.status(404).json({ error: "No financial data" });

    const years     = income.map(s => new Date(s.endDate.raw * 1000).getFullYear()).slice(0, 4);
    const revenue   = income.map(s => s.totalRevenue?.raw    ?? null).slice(0, 4);
    const netIncome = income.map(s => s.netIncome?.raw       ?? null).slice(0, 4);
    const ebitda    = income.map(s => s.ebitda?.raw          ?? null).slice(0, 4);
    const eps       = stats.trailingEps?.raw ?? null;

    // bookValue per share comes from defaultKeyStatistics (already PLN/share)
    const bvps    = stats.bookValue?.raw ?? null;
    const netDebt = balance.map(s => {
      const debt = (s.shortLongTermDebt?.raw ?? 0) + (s.longTermDebt?.raw ?? 0);
      const cash = s.cash?.raw ?? 0;
      return debt - cash;
    }).slice(0, 4);

    // Divide financials by 1e6 so frontend fmtBig() displays values in millions
    const toMln = v => (v !== null && v !== undefined) ? v / 1e6 : null;

    res.status(200).json({
      symbol: symbol.toLowerCase(),
      years,
      annual: years.map((year, i) => ({
        year,
        revenue:   toMln(revenue[i]),
        netIncome: toMln(netIncome[i]),
        ebitda:    toMln(ebitda[i]),
      })),
      current: {
        revenue:   toMln(revenue[0]),
        netIncome: toMln(netIncome[0]),
        ebitda:    toMln(ebitda[0]),
        eps,
        bookValue: bvps,
        netDebt:   toMln(netDebt[0]),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch", details: error.message });
  }
}

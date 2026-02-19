export default async function handler(req, res) {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: "Symbol is required" });

  try {
    const url = `https://stooq.pl/q/fg/?s=${symbol.toLowerCase()}&i=a`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pl-PL,pl;q=0.9,en;q=0.8",
        "Referer": "https://stooq.pl/",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Stooq returned ${response.status}` });
    }

    const html = await response.text();

    // Parse financial table rows
    const parsed = parseFinancialHTML(html);

    const annual = parsed.years.slice(0, 4).map((year, i) => ({
      year,
      revenue: parsed.revenue[i] ?? null,
      netIncome: parsed.netIncome[i] ?? null,
      ebitda: parsed.ebitda[i] ?? null,
    }));

    res.status(200).json({
      symbol: symbol.toLowerCase(),
      years: parsed.years.slice(0, 4),
      annual,
      current: {
        revenue: parsed.revenue[0] ?? null,
        netIncome: parsed.netIncome[0] ?? null,
        ebitda: parsed.ebitda[0] ?? null,
        eps: parsed.eps[0] ?? null,
        bookValue: parsed.bookValue[0] ?? null,
        netDebt: parsed.netDebt[0] ?? null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch", details: error.message });
  }
}

function parseFinancialHTML(html) {
  const result = {
    years: [],
    revenue: [],
    netIncome: [],
    ebitda: [],
    eps: [],
    bookValue: [],
    netDebt: [],
  };

  // Extract years from <th> headers
  const thRe = /<th[^>]*>\s*(\d{4})\s*<\/th>/gi;
  let thM;
  while ((thM = thRe.exec(html)) !== null) {
    const y = parseInt(thM[1]);
    if (y >= 2015 && y <= 2030 && !result.years.includes(y)) {
      result.years.push(y);
    }
  }

  // Split HTML into table rows and parse each
  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trM;
  while ((trM = trRe.exec(html)) !== null) {
    const rowHTML = trM[1];

    // Extract all cell text values from this row
    const cells = [];
    const cellRe = /<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi;
    let cellM;
    while ((cellM = cellRe.exec(rowHTML)) !== null) {
      const text = cellM[1].replace(/<[^>]+>/g, "").trim();
      cells.push(text);
    }

    if (cells.length < 2) continue;

    const label = cells[0].toLowerCase();

    // Also try to pick up years from data rows if not found in headers
    if (result.years.length === 0) {
      const potYears = cells.slice(1)
        .map(c => parseInt(c.trim()))
        .filter(y => y >= 2015 && y <= 2030);
      if (potYears.length >= 2) {
        result.years = potYears;
        continue;
      }
    }

    // Parse numeric values from subsequent cells
    const values = cells.slice(1).map(c => {
      const text = c.replace(/\s+/g, "").replace(",", ".");
      const n = parseFloat(text);
      return isNaN(n) || !isFinite(n) ? null : n;
    }).filter(v => v !== null);

    if (values.length === 0) continue;

    // Match label to a known metric (first match wins)
    if (result.revenue.length === 0 && label.includes("przychody")) {
      result.revenue = values.slice(0, 5);
    } else if (result.netIncome.length === 0 && label.includes("zysk netto")) {
      result.netIncome = values.slice(0, 5);
    } else if (result.netIncome.length === 0 && label.includes("zysk (strata) netto")) {
      result.netIncome = values.slice(0, 5);
    } else if (result.ebitda.length === 0 && (label === "ebitda" || label.startsWith("ebitda"))) {
      result.ebitda = values.slice(0, 5);
    } else if (result.eps.length === 0 && (label.includes("zysk na akcj") || label === "eps")) {
      result.eps = values.slice(0, 5);
    } else if (result.bookValue.length === 0 && label.includes("warto") && label.includes("ksi")) {
      result.bookValue = values.slice(0, 5);
    } else if (result.netDebt.length === 0 && label.includes("zad") && label.includes("enie netto")) {
      result.netDebt = values.slice(0, 5);
    } else if (result.netDebt.length === 0 && label.includes("ug netto")) {
      result.netDebt = values.slice(0, 5);
    }
  }

  return result;
}

const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 150;

async function fetchSymbol(symbol) {
  const url = `https://stooq.pl/q/d/l/?s=${symbol}&i=d`;
  const response = await fetch(url);
  const text = await response.text();
  const lines = text.trim().split("\n").filter(l => l && !l.startsWith("Date"));

  if (lines.length < 1) return { symbol, error: "no data" };

  const parse = (line) => {
    const cols = line.split(",");
    return { close: parseFloat(cols[4]), volume: parseFloat(cols[5]) };
  };

  const today = parse(lines[lines.length - 1]);
  const yesterday = lines.length >= 2 ? parse(lines[lines.length - 2]) : today;
  const weekAgo = lines.length >= 6 ? parse(lines[lines.length - 6]) : yesterday;

  if (isNaN(today.close)) return { symbol, error: "invalid data" };

  const change24h = ((today.close - yesterday.close) / yesterday.close) * 100;
  const change7d = ((today.close - weekAgo.close) / weekAgo.close) * 100;

  return {
    symbol,
    close: today.close,
    volume: today.volume || 0,
    change24h: parseFloat(change24h.toFixed(2)),
    change7d: parseFloat(change7d.toFixed(2)),
  };
}

export default async function handler(req, res) {
  const { symbols } = req.query;
  if (!symbols) return res.status(400).json({ error: "symbols parameter required (comma-separated)" });

  const list = symbols.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).slice(0, 300);

  const allResults = [];
  for (let i = 0; i < list.length; i += BATCH_SIZE) {
    const batch = list.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(batch.map(fetchSymbol));
    allResults.push(...results);
    if (i + BATCH_SIZE < list.length) {
      await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  const data = {};
  for (const result of allResults) {
    if (result.status === "fulfilled" && result.value && !result.value.error) {
      const { symbol, ...rest } = result.value;
      data[symbol] = rest;
    }
  }

  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
  res.status(200).json(data);
}

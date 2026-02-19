export default async function handler(req, res) {
  const { symbol } = req.query;
  const url = `https://stooq.pl/q/d/l/?s=${symbol}&i=d`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.trim().split("\n").filter(l => l && !l.startsWith("Date"));
    
    if (lines.length < 1) {
      return res.status(404).json({ error: "No data" });
    }

    const parse = (line) => {
      const cols = line.split(",");
      return { date: cols[0], close: parseFloat(cols[4]), volume: parseFloat(cols[5]) };
    };

    const today = parse(lines[lines.length - 1]);
    const yesterday = lines.length >= 2 ? parse(lines[lines.length - 2]) : today;
    const weekAgo = lines.length >= 6 ? parse(lines[lines.length - 6]) : yesterday;

    const change24h = ((today.close - yesterday.close) / yesterday.close) * 100;
    const change7d = ((today.close - weekAgo.close) / weekAgo.close) * 100;

    res.status(200).json({
      symbol,
      close: today.close,
      volume: today.volume,
      change24h: parseFloat(change24h.toFixed(2)),
      change7d: parseFloat(change7d.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
}

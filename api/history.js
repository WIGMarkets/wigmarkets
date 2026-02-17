export default async function handler(req, res) {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: "Symbol is required" });

  const url = `https://stooq.pl/q/d/l/?s=${symbol}&i=d`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.trim().split("\n").filter(l => l && !l.startsWith("Date"));

    if (lines.length < 2) return res.status(404).json({ error: "No data" });

    const prices = lines.slice(-365).map(line => {
      const cols = line.split(",");
      return { date: cols[0], close: parseFloat(cols[4]) };
    }).filter(p => !isNaN(p.close));

    res.status(200).json({ prices });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
}

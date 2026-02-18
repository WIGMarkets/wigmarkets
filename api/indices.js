const INDEX_SYMBOLS = [
  { name: "WIG20", symbol: "wig20" },
  { name: "WIG", symbol: "wig" },
  { name: "mWIG40", symbol: "mwig40" },
  { name: "sWIG80", symbol: "swig80" },
];

export default async function handler(req, res) {
  try {
    const results = await Promise.all(
      INDEX_SYMBOLS.map(async ({ name, symbol }) => {
        const url = `https://stooq.pl/q/d/l/?s=${symbol}&i=d`;
        const response = await fetch(url);
        const text = await response.text();
        const lines = text.trim().split("\n").filter(l => l && !l.startsWith("Date"));

        if (lines.length < 2) return { name, value: null, change24h: null };

        const parse = (line) => {
          const cols = line.split(",");
          return { close: parseFloat(cols[4]) };
        };

        const today = parse(lines[lines.length - 1]);
        const yesterday = parse(lines[lines.length - 2]);
        const change24h = ((today.close - yesterday.close) / yesterday.close) * 100;

        return {
          name,
          value: today.close,
          change24h: parseFloat(change24h.toFixed(2)),
        };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch indices" });
  }
}

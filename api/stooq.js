export default async function handler(req, res) {
  const { symbol } = req.query;
  const url = `https://stooq.pl/q/l/?s=${symbol}&f=sd2t2ohlcv&h&e=csv`;
  
  try {
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.trim().split("\n");
    const values = lines[1]?.split(",");
    
    if (!values || values.length < 5) {
      return res.status(404).json({ error: "No data" });
    }

    res.status(200).json({
      symbol: values[0],
      date: values[1],
      open: parseFloat(values[3]),
      high: parseFloat(values[4]),
      low: parseFloat(values[5]),
      close: parseFloat(values[6]),
      volume: parseFloat(values[7]),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
}

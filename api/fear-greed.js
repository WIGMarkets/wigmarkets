import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Try multiple paths — process.cwd() and __dirname-relative for Vercel compatibility
function readHistory() {
  const paths = [
    join(process.cwd(), "data", "fear-greed-history.json"),
  ];

  // Also try relative to the API file itself (works on Vercel)
  try {
    const dir = typeof __dirname !== "undefined"
      ? __dirname
      : dirname(fileURLToPath(import.meta.url));
    paths.push(join(dir, "..", "data", "fear-greed-history.json"));
  } catch {}

  for (const p of paths) {
    try {
      if (existsSync(p)) {
        return JSON.parse(readFileSync(p, "utf-8"));
      }
    } catch {}
  }
  return null;
}

export default function handler(req, res) {
  try {
    const history = readHistory();

    if (!history) {
      return res.status(503).json({
        error: "Fear & Greed data not yet available",
        message: "Dane indeksu Fear & Greed nie są jeszcze dostępne. Zostaną obliczone przy następnej aktualizacji.",
      });
    }

    if (!Array.isArray(history) || history.length === 0) {
      return res.status(503).json({ error: "Empty history" });
    }

    const latest = history[history.length - 1];
    if (typeof latest.value !== "number" || isNaN(latest.value)) {
      return res.status(503).json({ error: "Corrupted history data" });
    }
    const values = history.map((h) => h.value).filter(v => typeof v === "number" && !isNaN(v));
    if (values.length === 0) {
      return res.status(503).json({ error: "No valid values in history" });
    }
    const validHistory = history.filter(h => typeof h.value === "number" && !isNaN(h.value));
    const minEntry = validHistory.reduce((a, b) => (a.value < b.value ? a : b));
    const maxEntry = validHistory.reduce((a, b) => (a.value > b.value ? a : b));

    // Historical reference points
    const yesterday = history.length >= 2 ? history[history.length - 2].value : null;
    const weekAgo = history.length >= 6 ? history[history.length - 6].value : null;
    const monthAgo = history.length >= 23 ? history[history.length - 23].value : null;
    const yearAgo = history.length >= 253 ? history[history.length - 253].value : null;

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=1800");
    res.status(200).json({
      current: {
        value: latest.value,
        label: latest.label,
        color: latest.color,
        indicators: latest.indicators || [],
        indicatorsUsed: latest.indicatorsUsed || latest.indicators?.length || 0,
        updatedAt: latest.updatedAt,
      },
      historical: {
        yesterday,
        weekAgo,
        monthAgo,
        yearAgo,
      },
      history: history.map((h) => ({
        date: h.date,
        value: h.value,
        label: h.label,
      })),
      yearMin: Math.min(...values),
      yearMax: Math.max(...values),
      yearMinDate: minEntry.date,
      yearMaxDate: maxEntry.date,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to read Fear & Greed data" });
  }
}

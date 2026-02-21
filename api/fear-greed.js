import { readFileSync, existsSync } from "fs";
import { join } from "path";

const HISTORY_PATH = join(process.cwd(), "data", "fear-greed-history.json");

export default function handler(req, res) {
  try {
    if (!existsSync(HISTORY_PATH)) {
      return res.status(503).json({
        error: "Fear & Greed data not yet available",
        message: "Dane indeksu Fear & Greed nie są jeszcze dostępne. Zostaną obliczone przy następnej aktualizacji.",
      });
    }

    const history = JSON.parse(readFileSync(HISTORY_PATH, "utf-8"));

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

/**
 * Public endpoint for the frontend to load the dynamic GPW stock list from Redis.
 *
 * Returns:
 *   { ok: true,  stocks: [...], quotes: {...}, lastRefresh: "2025-02-19T06:00:00.000Z" }
 *   { ok: false, reason: "no_data" | "kv_unavailable" }
 *
 * The frontend falls back to the hardcoded STOCKS list when ok=false.
 */

import { kvMGet } from "./kv.js";

export default async function handler(req, res) {
  // Cache for 5 min on CDN edge; serve stale for up to 10 min while revalidating
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

  try {
    const [stocks, quotes, lastRefresh] = await kvMGet("gpw:stocks", "gpw:quotes", "gpw:last_refresh");

    if (!stocks) {
      return res.status(200).json({ ok: false, reason: "no_data" });
    }

    return res.status(200).json({
      ok: true,
      stocks,
      quotes:      quotes      || {},
      lastRefresh: lastRefresh || null,
    });

  } catch (err) {
    // Redis not configured or network error — signal frontend to use fallback
    console.error("[gpw-screener] KV error:", err.message);
    return res.status(200).json({ ok: false, reason: "kv_unavailable" });
  }
}

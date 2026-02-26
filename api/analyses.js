/**
 * GET /api/analyses          — list all analyses (summaries)
 * GET /api/analyses?ticker=PKN — single full analysis by ticker
 * GET /api/analyses?slug=pkn-orlen — single full analysis by slug
 *
 * Serves from static data. Can be swapped to Supabase later.
 * CDN-cached for 24 hours (analyses change infrequently).
 */

import { ANALYSES, getAnalysisByTicker, getAnalysisBySlug, getAnalysesList } from "../src/data/analyses.js";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=3600");

  const { ticker, slug } = req.query;

  // Single analysis by ticker
  if (ticker) {
    const analysis = getAnalysisByTicker(ticker);
    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found", ticker });
    }
    return res.status(200).json(analysis);
  }

  // Single analysis by slug
  if (slug) {
    const analysis = getAnalysisBySlug(slug);
    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found", slug });
    }
    return res.status(200).json(analysis);
  }

  // List all analyses (summaries only)
  return res.status(200).json({
    analyses: getAnalysesList(),
    total: ANALYSES.length,
    ts: new Date().toISOString(),
  });
}

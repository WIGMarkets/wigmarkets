import { useMemo } from "react";
import { getAnalysisByTicker, getAnalysesList } from "../data/analyses.js";

/**
 * Hook to get a single analysis by ticker.
 * Data is static (bundled), so no loading state needed.
 */
export function useAnalysis(ticker) {
  const analysis = useMemo(() => getAnalysisByTicker(ticker), [ticker]);
  return {
    analysis,
    loading: false,
    error: analysis ? null : "Analiza nie znaleziona",
  };
}

/**
 * Hook to get all analyses (summaries).
 */
export function useAnalysesList() {
  const analyses = useMemo(() => getAnalysesList(), []);
  return { analyses, loading: false };
}

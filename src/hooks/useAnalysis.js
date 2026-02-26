import { useState, useEffect } from "react";
import { fetchAnalysis, fetchAnalysesList } from "../lib/api.js";

/**
 * Hook to load a single analysis by ticker.
 * Returns { analysis, loading, error }.
 */
export function useAnalysis(ticker) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticker) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchAnalysis(ticker).then(data => {
      if (cancelled) return;
      if (data?.error || !data?.ticker) {
        setError("Analiza nie znaleziona");
        setAnalysis(null);
      } else {
        setAnalysis(data);
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [ticker]);

  return { analysis, loading, error };
}

/**
 * Hook to load all analyses (summaries).
 * Returns { analyses, loading }.
 */
export function useAnalysesList() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchAnalysesList().then(data => {
      if (cancelled) return;
      setAnalyses(data?.analyses || []);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return { analyses, loading };
}

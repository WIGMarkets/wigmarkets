import { useMemo } from "react";

function generateSparkline(trend) {
  const points = [];
  let val = 50 + Math.random() * 20;
  for (let i = 0; i < 20; i++) {
    val += (Math.random() - 0.5) * 8 + (trend > 0 ? 0.5 : -0.5);
    val = Math.max(20, Math.min(80, val));
    points.push(val);
  }
  const min = Math.min(...points), max = Math.max(...points);
  return points.map((p, i) => `${(i / 19) * 100},${40 - ((p - min) / (max - min + 1)) * 36}`).join(" ");
}

export default function Sparkline({ prices, trend = 0 }) {
  const color = trend >= 0 ? "#22c55e" : "#ef4444";

  const path = useMemo(() => {
    if (prices && prices.length >= 2) {
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const range = max - min || 1;
      const n = prices.length;
      return prices
        .map((p, i) => `${(i / (n - 1)) * 100},${40 - ((p - min) / range) * 36}`)
        .join(" ");
    }
    return generateSparkline(trend);
  }, [prices, trend]);

  return (
    <svg width="60" height="32" viewBox="0 0 100 40" style={{ display: "block" }}>
      <polyline points={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

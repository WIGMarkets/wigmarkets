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

export default function Sparkline({ trend }) {
  const path = useMemo(() => generateSparkline(trend), [trend]);
  const color = trend >= 0 ? "#00c896" : "#ff4d6d";
  return (
    <svg width="60" height="32" viewBox="0 0 100 40" style={{ display: "block" }}>
      <polyline points={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

import { useState, useEffect } from "react";

export function getLabel(v) {
  if (v < 25) return "Skrajna panika";
  if (v < 45) return "Strach";
  if (v < 55) return "Neutralny";
  if (v < 75) return "Chciwość";
  return "Skrajna chciwość";
}

export function getColor(v) {
  if (v < 25) return "#ef4444";
  if (v < 45) return "#f97316";
  if (v < 55) return "#eab308";
  if (v < 75) return "#22c55e";
  return "#10b981";
}

// Interpolate color on the gauge arc at a given 0-100 position
function arcColorAt(pct) {
  const stops = [
    { p: 0,   r: 239, g: 68,  b: 68  }, // #ef4444
    { p: 25,  r: 249, g: 115, b: 22  }, // #f97316
    { p: 45,  r: 234, g: 179, b: 8   }, // #eab308
    { p: 55,  r: 234, g: 179, b: 8   }, // #eab308
    { p: 75,  r: 34,  g: 197, b: 94  }, // #22c55e
    { p: 100, r: 16,  g: 185, b: 129 }, // #10b981
  ];
  let a = stops[0], b = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (pct >= stops[i].p && pct <= stops[i + 1].p) { a = stops[i]; b = stops[i + 1]; break; }
  }
  const t = a.p === b.p ? 0 : (pct - a.p) / (b.p - a.p);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bl = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r},${g},${bl})`;
}

/**
 * Semi-circular SVG gauge with gradient arc and glowing dot indicator.
 * @param {number} value - 0-100
 * @param {number} size - width in px (height = size * 0.55)
 * @param {boolean} animate - whether to animate on mount
 * @param {object} theme
 */
export default function FearGreedGauge({ value = 50, size = 320, animate = true, theme }) {
  const [animated, setAnimated] = useState(!animate);
  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setAnimated(true), 100);
      return () => clearTimeout(t);
    }
  }, [animate]);

  const w = size;
  const h = size * 0.55;
  // SVG viewBox
  const vw = 200;
  const vh = 110;
  const cx = 100;
  const cy = 95;
  const R = 80;
  const strokeW = 12;

  // Generate arc segments for gradient effect (36 segments)
  const segments = 36;
  const arcPaths = [];
  for (let i = 0; i < segments; i++) {
    const startPct = (i / segments) * 100;
    const endPct = ((i + 1) / segments) * 100;
    const startDeg = (startPct / 100) * 180;
    const endDeg = (endPct / 100) * 180;
    const toRad = (d) => ((d - 180) * Math.PI) / 180;
    const x1 = cx + R * Math.cos(toRad(startDeg));
    const y1 = cy + R * Math.sin(toRad(startDeg));
    const x2 = cx + R * Math.cos(toRad(endDeg));
    const y2 = cy + R * Math.sin(toRad(endDeg));
    arcPaths.push({
      d: `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
      color: arcColorAt((startPct + endPct) / 2),
    });
  }

  // Dot position on arc
  const dotPct = animated ? value : 0;
  const dotDeg = (dotPct / 100) * 180;
  const toRad = (d) => ((d - 180) * Math.PI) / 180;
  const dotX = cx + R * Math.cos(toRad(dotDeg));
  const dotY = cy + R * Math.sin(toRad(dotDeg));
  const dotColor = getColor(value);

  const label = getLabel(value);
  const color = getColor(value);

  // Value text font size scales with gauge size
  const valueFontSize = size >= 280 ? 72 : size >= 200 ? 40 : 32;
  const labelFontSize = size >= 280 ? 18 : size >= 200 ? 13 : 11;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={w} height={h} viewBox={`0 0 ${vw} ${vh}`} style={{ display: "block", overflow: "visible" }}>
        {/* Background arc */}
        {arcPaths.map((seg, i) => (
          <path key={`bg-${i}`} d={seg.d} fill="none" stroke={theme.bgElevated} strokeWidth={strokeW} strokeLinecap="butt" opacity="0.3" />
        ))}
        {/* Colored arc segments */}
        {arcPaths.map((seg, i) => (
          <path key={`fg-${i}`} d={seg.d} fill="none" stroke={seg.color} strokeWidth={strokeW} strokeLinecap="butt" opacity="0.85" />
        ))}
        {/* Glowing dot */}
        <circle
          cx={dotX}
          cy={dotY}
          r="7"
          fill={dotColor}
          style={{
            filter: `drop-shadow(0 0 6px ${dotColor})`,
            transition: animated && animate ? "cx 0.8s ease-out, cy 0.8s ease-out" : "none",
          }}
        />
        <circle cx={dotX} cy={dotY} r="3.5" fill="#fff" opacity="0.9"
          style={{ transition: animated && animate ? "cx 0.8s ease-out, cy 0.8s ease-out" : "none" }}
        />
        {/* Scale labels */}
        <text x="12" y={cy + 14} fill={theme.textMuted} fontSize="8" textAnchor="start" fontFamily="var(--font-ui)" opacity="0.6">0</text>
        <text x="188" y={cy + 14} fill={theme.textMuted} fontSize="8" textAnchor="end" fontFamily="var(--font-ui)" opacity="0.6">100</text>
      </svg>

      {/* Value + label below gauge */}
      <div style={{ textAlign: "center", marginTop: size >= 280 ? -12 : -8 }}>
        <div style={{
          fontSize: valueFontSize,
          fontWeight: 700,
          color,
          lineHeight: 1,
          fontFamily: "var(--font-mono)",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: -1,
        }}>
          {animated ? value : 0}
        </div>
        <div style={{
          fontSize: labelFontSize,
          fontWeight: 500,
          color,
          marginTop: 4,
          fontFamily: "var(--font-ui)",
        }}>
          {label}
        </div>
      </div>
    </div>
  );
}

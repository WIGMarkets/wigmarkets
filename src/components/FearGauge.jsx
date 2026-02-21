import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FEAR_COMPONENTS, FEAR_HISTORY } from "../data/constants.js";
import FearGreedGauge, { getLabel, getColor } from "./FearGreedGauge.jsx";

export default function FearGauge({ value = 62, history, components, historical, isMobile, theme }) {
  const navigate = useNavigate();

  // Use API data if provided, fall back to hardcoded constants
  const compList = components || FEAR_COMPONENTS.map(f => ({ name: f.label, value: f.val }));

  // Canonical indicator names for display
  const INDICATOR_NAMES = [
    "Momentum rynku", "Szerokość rynku", "Zmienność rynku",
    "Nowe szczyty", "Siła wolumenu", "Małe vs duże", "Safe haven",
  ];

  // Short name mapping
  const SHORT_NAMES = {
    "Momentum rynku": "Momentum rynku",
    "Szerokość rynku": "Szerokość rynku",
    "Zmienność rynku": "Zmienność",
    "Zmienność (VIX GPW)": "Zmienność",
    "Nowe szczyty vs dołki": "Nowe szczyty",
    "Nowe szczyty": "Nowe szczyty",
    "Siła wolumenu": "Siła wolumenu",
    "Małe vs duże spółki": "Małe vs duże",
    "Małe vs duże": "Małe vs duże",
    "Popyt na bezpieczne aktywa": "Safe haven",
    "Put/Call ratio": "Put/Call",
  };

  // Diff arrow helper
  function diffEl(refVal) {
    if (refVal == null) return null;
    const diff = value - refVal;
    if (diff === 0) return <span style={{ fontSize: 11, color: theme.textMuted }}>—</span>;
    return (
      <span style={{ fontSize: 11, color: diff > 0 ? "#22c55e" : "#ef4444", fontFamily: "var(--font-mono)" }}>
        {diff > 0 ? "↑" : "↓"}{Math.abs(diff)}
      </span>
    );
  }

  return (
    <div
      onClick={() => navigate("/fear-greed")}
      style={{
        background: `linear-gradient(135deg, ${theme.bgCardAlt} 0%, ${theme.bgCard} 100%)`,
        border: `1px solid rgba(255,255,255,0.06)`,
        borderRadius: 14,
        padding: 20,
        cursor: "pointer",
        transition: "border-color 0.2s, transform 0.15s",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Header */}
      <div style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--font-ui)", marginBottom: 8 }}>
        Fear & Greed Index
      </div>

      {/* Mini gauge */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
        <FearGreedGauge value={value} size={160} animate={true} theme={theme} />
      </div>

      {/* Historical comparisons */}
      {historical && (
        <div style={{ marginTop: 8, marginBottom: 4 }}>
          {[
            { label: "Wczoraj", val: historical.yesterday },
            { label: "Tydzień", val: historical.weekAgo },
            { label: "Miesiąc", val: historical.monthAgo },
          ].filter(h => h.val != null).map(h => (
            <div key={h.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0" }}>
              <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: "var(--font-ui)" }}>{h.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: getColor(h.val), fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{h.val}</span>
                {diffEl(h.val)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Separator */}
      <div style={{ borderTop: `1px solid ${theme.border}`, margin: "8px 0" }} />

      {/* Mini progress bars for sub-indicators */}
      <div>
        {compList.slice(0, 7).map((f) => {
          const fName = f.name || f.label;
          const fVal = f.value != null ? f.value : f.val;
          const shortName = SHORT_NAMES[fName] || fName;
          const barColor = getColor(fVal);
          return (
            <div key={fName} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0" }}>
              <span style={{
                fontSize: 11,
                color: theme.textMuted,
                fontFamily: "var(--font-ui)",
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0,
              }}>
                {shortName}
              </span>
              {/* Mini bar */}
              <div style={{ width: 44, height: 4, background: theme.bgCardAlt, borderRadius: 2, overflow: "hidden", flexShrink: 0 }}>
                <div style={{
                  width: `${Math.min(100, Math.max(0, fVal))}%`,
                  height: "100%",
                  background: barColor,
                  borderRadius: 2,
                  transition: "width 0.4s ease",
                }} />
              </div>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: barColor,
                fontFamily: "var(--font-mono)",
                fontVariantNumeric: "tabular-nums",
                width: 22,
                textAlign: "right",
                flexShrink: 0,
              }}>
                {fVal}
              </span>
            </div>
          );
        })}
      </div>

      {/* See details link */}
      <div style={{
        textAlign: "center",
        marginTop: 10,
        fontSize: 12,
        color: theme.textMuted,
        fontFamily: "var(--font-ui)",
      }}>
        Zobacz szczegóły →
      </div>
    </div>
  );
}

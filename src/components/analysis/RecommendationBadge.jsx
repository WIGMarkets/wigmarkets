const COLORS = {
  "Kupuj":   { bg: "rgba(16,185,129,0.12)", text: "#10b981", border: "rgba(16,185,129,0.25)" },
  "Trzymaj": { bg: "rgba(59,130,246,0.12)", text: "#3b82f6", border: "rgba(59,130,246,0.25)" },
  "Sprzedaj":{ bg: "rgba(239,68,68,0.12)",  text: "#ef4444", border: "rgba(239,68,68,0.25)"  },
};

export default function RecommendationBadge({ recommendation, size = "md" }) {
  const c = COLORS[recommendation] || COLORS["Trzymaj"];
  const isLg = size === "lg";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: isLg ? "6px 16px" : "3px 10px",
      borderRadius: 8,
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.text,
      fontSize: isLg ? 15 : 12,
      fontWeight: 600,
      fontFamily: "var(--font-ui)",
      letterSpacing: "0.02em",
      whiteSpace: "nowrap",
    }}>
      {recommendation}
    </span>
  );
}

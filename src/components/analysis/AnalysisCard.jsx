import { Link } from "react-router-dom";
import RecommendationBadge from "./RecommendationBadge.jsx";
import StockLogo from "../StockLogo.jsx";

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" });
  } catch { return dateStr; }
}

export default function AnalysisCard({ analysis, theme }) {
  const { ticker, name, title, summary, recommendation, publishedAt, currentMetrics } = analysis;

  return (
    <Link
      to={`/spolka/${ticker}/analiza`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderRadius: 14,
          padding: 20,
          transition: "all 0.2s ease",
          cursor: "pointer",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = theme.borderHover || "rgba(255,255,255,0.15)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = theme.border;
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <StockLogo ticker={ticker} size={32} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: theme.textBright, fontFamily: "var(--font-mono)" }}>{ticker}</span>
              <span style={{ fontSize: 13, color: theme.textMuted, fontFamily: "var(--font-ui)" }}>{name}</span>
            </div>
          </div>
          <RecommendationBadge recommendation={recommendation} />
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 15, fontWeight: 600, color: theme.textBright,
          fontFamily: "var(--font-ui)", margin: "0 0 8px", lineHeight: 1.35,
        }}>
          {title}
        </h3>

        {/* Summary */}
        <p style={{
          fontSize: 13, color: theme.textSecondary, fontFamily: "var(--font-ui)",
          lineHeight: 1.55, margin: "0 0 12px",
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {summary}
        </p>

        {/* Metrics row */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 16,
          paddingTop: 12, borderTop: `1px solid ${theme.border}`,
        }}>
          {currentMetrics?.pe != null && (
            <MetricChip label="P/E" value={`${currentMetrics.pe.toFixed(1)}x`} theme={theme} />
          )}
          {currentMetrics?.roe != null && (
            <MetricChip label="ROE" value={`${currentMetrics.roe.toFixed(1)}%`} theme={theme} />
          )}
          {currentMetrics?.divYield != null && currentMetrics.divYield > 0 && (
            <MetricChip label="Dywidenda" value={`${currentMetrics.divYield.toFixed(1)}%`} theme={theme} />
          )}
          <span style={{
            fontSize: 11, color: theme.textMuted, fontFamily: "var(--font-ui)",
            marginLeft: "auto", alignSelf: "center",
          }}>
            {formatDate(publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}

function MetricChip({ label, value, theme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: "var(--font-ui)" }}>{label}</span>
      <span style={{
        fontSize: 12, fontWeight: 600, color: theme.textBright,
        fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums",
      }}>{value}</span>
    </div>
  );
}

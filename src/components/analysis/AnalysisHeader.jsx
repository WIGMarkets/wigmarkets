import { Link } from "react-router-dom";
import RecommendationBadge from "./RecommendationBadge.jsx";
import StockLogo from "../StockLogo.jsx";
import CompanyMonogram from "../CompanyMonogram.jsx";

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
  } catch { return dateStr; }
}

export default function AnalysisHeader({ analysis, theme }) {
  const { ticker, name, title, author, publishedAt, updatedAt, recommendation, targetPrice, summary } = analysis;

  return (
    <header>
      {/* Back link */}
      <div style={{ marginBottom: 16 }}>
        <Link
          to={`/spolka/${ticker}`}
          style={{
            fontSize: 12, color: theme.textMuted, textDecoration: "none",
            fontFamily: "var(--font-ui)", display: "inline-flex", alignItems: "center", gap: 4,
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#3b82f6"}
          onMouseLeave={e => e.currentTarget.style.color = theme.textMuted}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Wróć do {ticker}
        </Link>
      </div>

      {/* Company identity */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <StockLogo ticker={ticker} size={40} />
        <div>
          <div style={{ fontSize: 13, color: theme.textMuted, fontFamily: "var(--font-mono)", fontWeight: 600 }}>{ticker}</div>
          <div style={{ fontSize: 14, color: theme.textSecondary, fontFamily: "var(--font-ui)" }}>{name}</div>
        </div>
      </div>

      {/* Title */}
      <h1 style={{
        fontSize: 28, fontWeight: 700, color: theme.textBright,
        fontFamily: "var(--font-ui)", lineHeight: 1.25, margin: "0 0 16px",
      }}>
        {title}
      </h1>

      {/* Meta row */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12,
        marginBottom: 20,
      }}>
        <RecommendationBadge recommendation={recommendation} size="lg" />
        {targetPrice && (
          <span style={{
            fontSize: 13, color: theme.textSecondary, fontFamily: "var(--font-ui)",
          }}>
            Cena docelowa: <strong style={{ color: theme.textBright, fontFamily: "var(--font-mono)" }}>{targetPrice} zł</strong>
          </span>
        )}
      </div>

      {/* Author & date */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 16, fontSize: 12,
        color: theme.textMuted, fontFamily: "var(--font-ui)", marginBottom: 20,
      }}>
        <span>{author}</span>
        <span>Opublikowano: {formatDate(publishedAt)}</span>
        {updatedAt && updatedAt !== publishedAt && (
          <span>Aktualizacja: {formatDate(updatedAt)}</span>
        )}
      </div>

      {/* Summary */}
      <p style={{
        fontSize: 15, lineHeight: 1.65, color: theme.textSecondary,
        fontFamily: "var(--font-ui)", margin: "0 0 24px",
        padding: 16, background: theme.bgCardAlt || theme.bgElevated,
        borderRadius: 10, borderLeft: "3px solid #3b82f6",
      }}>
        {summary}
      </p>
    </header>
  );
}

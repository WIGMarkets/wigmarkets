import ArticleIllustration from "./ArticleIllustration.jsx";
import Icon from "./Icon.jsx";

const CATEGORY_LABELS = { podstawy: "Podstawy", analiza: "Analiza", strategia: "Strategia" };
const CATEGORY_COLORS = { podstawy: "#3b82f6", analiza: "#22c55e", strategia: "#f0883e" };

export default function ArticleCard({ article, theme, onNavigate, compact = false }) {
  const catColor = CATEGORY_COLORS[article.category] || "#3b82f6";
  const catLabel = CATEGORY_LABELS[article.category] || article.category;

  return (
    <article
      onClick={() => onNavigate(article.slug)}
      style={{
        background: theme.bgCard,
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.2s, transform 0.15s",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = catColor;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = theme.border;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {!compact && (
        <div style={{
          borderBottom: `1px solid ${theme.border}`,
          overflow: "hidden",
          lineHeight: 0,
        }}>
          <ArticleIllustration
            slug={article.slug}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      )}
      <div style={{ padding: compact ? "12px 14px" : "16px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            background: `${catColor}22`,
            color: catColor,
            fontSize: 11,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 20,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>{catLabel}</span>
          <span style={{ color: theme.textSecondary, fontSize: 11, marginLeft: "auto" }}>
            {article.readingTime} min czytania
          </span>
        </div>
        <h3 style={{
          margin: 0,
          fontSize: compact ? 14 : 16,
          fontWeight: 700,
          color: theme.textBright,
          lineHeight: 1.4,
        }}>{article.title}</h3>
        {!compact && (
          <p style={{ margin: 0, fontSize: 13, color: theme.textSecondary, lineHeight: 1.6, flex: 1 }}>
            {article.metaDescription}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: compact ? 0 : 4 }}>
          <span style={{ fontSize: 11, color: theme.textSecondary }}>{article.publishDate}</span>
          <span style={{ fontSize: 12, color: catColor, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>Czytaj <Icon name="arrow-right" size={14} /></span>
        </div>
      </div>
    </article>
  );
}

import ArticleCard from "./ArticleCard.jsx";

export default function RelatedArticles({ articles, theme, onNavigate }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section style={{ marginTop: 48 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: theme.textBright, marginBottom: 20 }}>
        Powiązane artykuły
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 16,
      }}>
        {articles.map(article => (
          <ArticleCard key={article.slug} article={article} theme={theme} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  );
}

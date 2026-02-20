import { useEffect, useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import { getArticlesByCategory } from "../../content/edukacja/articles.js";
import ArticleCard from "./ArticleCard.jsx";
import Breadcrumbs from "./Breadcrumbs.jsx";

const CATEGORY_INFO = {
  podstawy: {
    label: "Podstawy",
    icon: "📚",
    description: "Wszystko co musisz wiedzieć na start — jak działa giełda, jak otworzyć konto maklerskie, pierwsze kroki inwestora i podstawowe pojęcia rynku kapitałowego.",
    color: "#58a6ff",
  },
  analiza: {
    label: "Analiza",
    icon: "📊",
    description: "Poznaj narzędzia analizy fundamentalnej i technicznej. Dowiedz się jak czytać sprawozdania finansowe, wskaźniki P/E, RSI, MACD i oceniać wartość spółek.",
    color: "#00c896",
  },
  strategia: {
    label: "Strategia",
    icon: "♟️",
    description: "Sprawdzone strategie inwestycyjne dla GPW: inwestowanie dywidendowe, value investing, growth investing, DCA i budowanie długoterminowego portfela.",
    color: "#f0883e",
  },
};

const SORT_OPTIONS = [
  { key: "newest", label: "Najnowsze" },
  { key: "oldest", label: "Najstarsze" },
  { key: "readingTime", label: "Czas czytania" },
];

export default function CategoryPage({ theme, category, onBack, onNavigateArticle, onNavigateHome }) {
  const isMobile = useIsMobile();
  const [sortBy, setSortBy] = useState("newest");
  const info = CATEGORY_INFO[category] || { label: category, icon: "📄", description: "", color: "#58a6ff" };

  let articles = getArticlesByCategory(category);
  if (sortBy === "newest") articles = [...articles].sort((a, b) => b.publishDate.localeCompare(a.publishDate));
  else if (sortBy === "oldest") articles = [...articles].sort((a, b) => a.publishDate.localeCompare(b.publishDate));
  else if (sortBy === "readingTime") articles = [...articles].sort((a, b) => a.readingTime - b.readingTime);

  useEffect(() => {
    document.title = `${info.label} — Edukacja inwestycyjna | WIGmarkets.pl`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", info.description.slice(0, 160));
  }, [category, info.label, info.description]);

  return (
    <div style={{ minHeight: "100vh", background: theme.bgPage, color: theme.text, fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: isMobile ? 16 : 24, boxSizing: "border-box", width: "100%" }}>

        <Breadcrumbs
          theme={theme}
          items={[
            { label: "Strona główna", href: "/", onClick: onNavigateHome },
            { label: "Edukacja", href: "/edukacja", onClick: onBack },
            { label: info.label },
          ]}
        />

        {/* Category header */}
        <div style={{
          background: `linear-gradient(135deg, ${info.color}15 0%, ${info.color}05 100%)`,
          border: `1px solid ${info.color}30`,
          borderRadius: 16,
          padding: isMobile ? "24px 20px" : "36px 40px",
          marginBottom: 36,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{info.icon}</div>
          <h1 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 900, color: theme.textBright, margin: "0 0 12px", lineHeight: 1.2 }}>
            {info.label}
          </h1>
          <p style={{ margin: 0, fontSize: isMobile ? 14 : 16, color: theme.textSecondary, lineHeight: 1.65, maxWidth: 600 }}>
            {info.description}
          </p>
        </div>

        {/* Sort and count */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 14, color: theme.textSecondary }}>
            <span style={{ color: info.color, fontWeight: 700 }}>{articles.length}</span> artykuł{articles.length === 1 ? "" : "ów"}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                style={{
                  padding: "8px 14px",
                  background: sortBy === opt.key ? info.color : theme.bgCard,
                  color: sortBy === opt.key ? "#000" : theme.textSecondary,
                  border: `1px solid ${sortBy === opt.key ? info.color : theme.border}`,
                  borderRadius: 8,
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: sortBy === opt.key ? 700 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  minHeight: 44,
                }}
              >{opt.label}</button>
            ))}
          </div>
        </div>

        {/* Articles grid */}
        {articles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: theme.textSecondary }}>
            Brak artykułów w tej kategorii.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {articles.map(article => (
              <ArticleCard key={article.slug} article={article} theme={theme} onNavigate={onNavigateArticle} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

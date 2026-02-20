import { useEffect } from "react";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import { ARTICLES, getArticlesByCategory } from "../../content/edukacja/articles.js";
import ArticleCard from "./ArticleCard.jsx";
import Breadcrumbs from "./Breadcrumbs.jsx";

const CATEGORIES = [
  { key: "podstawy", label: "Podstawy", icon: "📚", description: "Dowiedz się jak działa giełda, jak otworzyć konto maklerskie i zacząć swoją przygodę z inwestowaniem.", color: "#58a6ff" },
  { key: "analiza", label: "Analiza", icon: "📊", description: "Naucz się czytać wykresy, wskaźniki fundamentalne i oceniać wartość spółek.", color: "#00c896" },
  { key: "strategia", label: "Strategia", icon: "♟️", description: "Poznaj sprawdzone strategie inwestycyjne: dywidendową, value investing, momentum i inne.", color: "#f0883e" },
];

const POPULAR_SLUGS = [
  "jak-zaczac-inwestowac-na-gpw",
  "najlepsze-konto-maklerskie",
  "wskaznik-pe",
  "spolki-dywidendowe-gpw",
  "etf-na-gpw",
];

function Sidebar({ theme, popularArticles, onNavigateArticle }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Popular */}
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 14 }}>
          Najpopularniejsze
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {popularArticles.map((article, i) => (
            <div key={article.slug} onClick={() => onNavigateArticle(article.slug)} style={{ display: "flex", gap: 10, cursor: "pointer", alignItems: "flex-start", minHeight: 44, paddingTop: 4, paddingBottom: 4 }}>
              <span style={{ fontSize: 11, color: theme.textSecondary, fontWeight: 700, minWidth: 18, marginTop: 2 }}>{i + 1}.</span>
              <div>
                <div style={{ fontSize: 13, color: theme.text, fontWeight: 600, lineHeight: 1.4 }}>{article.title}</div>
                <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>{article.readingTime} min czytania</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div style={{ background: `linear-gradient(135deg, ${theme.accent}18 0%, ${theme.accent}08 100%)`, border: `1px solid ${theme.accent}30`, borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: theme.textBright, marginBottom: 6 }}>Newsletter WIGmarkets</div>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: theme.textSecondary, lineHeight: 1.5 }}>
          Cotygodniowy przegląd rynku, nowe artykuły i analizy bezpośrednio na Twój email.
        </p>
        <input type="email" placeholder="Twój adres email" style={{ width: "100%", boxSizing: "border-box", padding: "12px 12px", background: theme.bgCard, border: `1px solid ${theme.borderInput}`, borderRadius: 8, color: theme.text, fontFamily: "inherit", fontSize: 16, marginBottom: 8 }} />
        <button style={{ width: "100%", padding: "14px", background: theme.accent, color: "#000", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 14, minHeight: 48 }}>
          Zapisz się bezpłatnie
        </button>
        <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 8, textAlign: "center" }}>Bez spamu. Rezygnacja w każdej chwili.</div>
      </div>
    </div>
  );
}

export default function EdukacjaHome({ theme, onBack, onNavigateCategory, onNavigateArticle }) {
  const isMobile = useIsMobile();

  useEffect(() => {
    document.title = "Edukacja inwestycyjna GPW — WIGmarkets.pl";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Naucz się inwestować na Giełdzie Papierów Wartościowych. Artykuły, poradniki i narzędzia dla inwestorów indywidualnych na GPW.");
  }, []);

  const recentArticles = [...ARTICLES].sort((a, b) => b.publishDate.localeCompare(a.publishDate));
  const popularArticles = POPULAR_SLUGS.map(slug => ARTICLES.find(a => a.slug === slug)).filter(Boolean);

  return (
    <div style={{ minHeight: "100vh", background: theme.bgPage, color: theme.text, fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "16px" : "24px", boxSizing: "border-box", width: "100%" }}>

        <Breadcrumbs theme={theme} items={[{ label: "Strona główna", href: "/", onClick: onBack }, { label: "Edukacja" }]} />

        {/* Hero */}
        <div style={{
          background: `linear-gradient(135deg, ${theme.bgCard} 0%, ${theme.bgCardAlt} 100%)`,
          border: `1px solid ${theme.border}`,
          borderRadius: isMobile ? 12 : 16,
          padding: isMobile ? "24px 16px" : "48px 48px",
          marginBottom: isMobile ? 28 : 40,
          textAlign: "center",
        }}>
          <div style={{ fontSize: isMobile ? 11 : 12, fontWeight: 700, color: theme.accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>
            Centrum Edukacji Inwestycyjnej
          </div>
          <h1 style={{ fontSize: isMobile ? 26 : 42, fontWeight: 900, color: theme.textBright, margin: "0 0 16px", lineHeight: 1.2 }}>
            Naucz się inwestować na GPW
          </h1>
          <p style={{ fontSize: isMobile ? 15 : 17, color: theme.textSecondary, maxWidth: 580, margin: "0 auto 24px", lineHeight: 1.6 }}>
            Praktyczne poradniki, analizy i strategie dla inwestorów indywidualnych na Giełdzie Papierów Wartościowych w Warszawie.
          </p>
          <div style={{ display: "flex", gap: isMobile ? 8 : 12, justifyContent: "center", flexWrap: "wrap" }}>
            {[{ label: "10 artykułów", icon: "📄" }, { label: "3 kategorie", icon: "🗂️" }, { label: "Bezpłatnie", icon: "✅" }].map(item => (
              <span key={item.label} style={{ background: theme.bgCardAlt, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "6px 12px", fontSize: 12, color: theme.textMuted, display: "flex", alignItems: "center", gap: 6 }}>
                <span>{item.icon}</span> {item.label}
              </span>
            ))}
          </div>
        </div>

        {/* Category cards */}
        <h2 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 800, color: theme.textBright, marginBottom: 16 }}>Kategorie</h2>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, marginBottom: isMobile ? 32 : 48 }}>
          {CATEGORIES.map(cat => (
            <div
              key={cat.key}
              onClick={() => onNavigateCategory(cat.key)}
              style={{
                background: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: 14,
                padding: isMobile ? "20px 16px" : "24px 24px",
                cursor: "pointer",
                transition: "border-color 0.2s, transform 0.15s",
                minHeight: 44,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>{cat.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: theme.textBright, marginBottom: 8 }}>{cat.label}</div>
              <p style={{ margin: "0 0 12px", fontSize: 14, color: theme.textSecondary, lineHeight: 1.6 }}>{cat.description}</p>
              <span style={{ fontSize: 13, color: cat.color, fontWeight: 600 }}>
                {getArticlesByCategory(cat.key).length} artykułów →
              </span>
            </div>
          ))}
        </div>

        {/* Main content + Sidebar (desktop: side-by-side, mobile: stacked) */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 280px", gap: isMobile ? 24 : 32 }}>
          {/* Articles grid */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 800, color: theme.textBright, margin: 0 }}>Wszystkie artykuły</h2>
              <span style={{ fontSize: 13, color: theme.textSecondary }}>{ARTICLES.length} artykułów</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 16 }}>
              {recentArticles.map(article => (
                <ArticleCard key={article.slug} article={article} theme={theme} onNavigate={onNavigateArticle} />
              ))}
            </div>
          </div>

          {/* Sidebar — always shown, below content on mobile */}
          <aside>
            <Sidebar theme={theme} popularArticles={popularArticles} onNavigateArticle={onNavigateArticle} />
          </aside>
        </div>

      </div>
    </div>
  );
}

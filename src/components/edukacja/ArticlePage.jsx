import { useEffect } from "react";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import { getArticleBySlug, getArticlesBySlug } from "../../content/edukacja/articles.js";
import Breadcrumbs from "./Breadcrumbs.jsx";
import TOC, { buildTOC } from "./TOC.jsx";
import SectionRenderer from "./SectionRenderer.jsx";
import FAQSection from "./FAQSection.jsx";
import CTABox from "./CTABox.jsx";
import SocialShare from "./SocialShare.jsx";
import RelatedArticles from "./RelatedArticles.jsx";

const CATEGORY_LABELS = { podstawy: "Podstawy", analiza: "Analiza", strategia: "Strategia" };
const CATEGORY_COLORS = { podstawy: "#58a6ff", analiza: "#00c896", strategia: "#f0883e" };

function injectSchema(article) {
  const existingSchema = document.getElementById("article-schema");
  if (existingSchema) existingSchema.remove();
  const existingFAQ = document.getElementById("faq-schema");
  if (existingFAQ) existingFAQ.remove();
  const existingBC = document.getElementById("breadcrumb-schema");
  if (existingBC) existingBC.remove();

  const baseUrl = window.location.origin;
  const articleUrl = `${baseUrl}/edukacja/${article.slug}`;

  // Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.metaDescription,
    "image": article.featuredImage ? `${baseUrl}${article.featuredImage}` : undefined,
    "url": articleUrl,
    "datePublished": article.publishDate,
    "dateModified": article.updatedDate,
    "author": { "@type": "Organization", "name": article.author },
    "publisher": { "@type": "Organization", "name": "WIGmarkets.pl", "url": baseUrl },
    "mainEntityOfPage": { "@type": "WebPage", "@id": articleUrl },
  };
  const s1 = document.createElement("script");
  s1.id = "article-schema";
  s1.type = "application/ld+json";
  s1.textContent = JSON.stringify(articleSchema);
  document.head.appendChild(s1);

  // FAQ schema
  if (article.faq && article.faq.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": article.faq.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": { "@type": "Answer", "text": f.answer },
      })),
    };
    const s2 = document.createElement("script");
    s2.id = "faq-schema";
    s2.type = "application/ld+json";
    s2.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(s2);
  }

  // Breadcrumb schema
  const bcSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Strona główna", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Edukacja", "item": `${baseUrl}/edukacja` },
      { "@type": "ListItem", "position": 3, "name": CATEGORY_LABELS[article.category] || article.category, "item": `${baseUrl}/edukacja/${article.category}` },
      { "@type": "ListItem", "position": 4, "name": article.title, "item": articleUrl },
    ],
  };
  const s3 = document.createElement("script");
  s3.id = "breadcrumb-schema";
  s3.type = "application/ld+json";
  s3.textContent = JSON.stringify(bcSchema);
  document.head.appendChild(s3);
}

function updateOGTags(article) {
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/edukacja/${article.slug}`;
  const setMeta = (prop, content, attr = "property") => {
    let el = document.querySelector(`meta[${attr}="${prop}"]`);
    if (!el) { el = document.createElement("meta"); el.setAttribute(attr, prop); document.head.appendChild(el); }
    el.setAttribute("content", content);
  };
  setMeta("og:title", article.metaTitle);
  setMeta("og:description", article.metaDescription);
  setMeta("og:url", url);
  setMeta("og:type", "article");
  if (article.featuredImage) setMeta("og:image", `${baseUrl}${article.featuredImage}`);
  setMeta("twitter:card", "summary_large_image", "name");
  setMeta("twitter:title", article.metaTitle, "name");
  setMeta("twitter:description", article.metaDescription, "name");

  // Canonical
  let canonical = document.querySelector("link[rel='canonical']");
  if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
  canonical.href = url;
}

export default function ArticlePage({ theme, slug, onBack, onNavigateCategory, onNavigateArticle, onNavigateHome }) {
  const isMobile = useIsMobile();
  const article = getArticleBySlug(slug);

  useEffect(() => {
    if (!article) return;
    document.title = article.metaTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", article.metaDescription);
    updateOGTags(article);
    injectSchema(article);
    window.scrollTo(0, 0);

    return () => {
      ["article-schema", "faq-schema", "breadcrumb-schema"].forEach(id => {
        document.getElementById(id)?.remove();
      });
    };
  }, [article]);

  if (!article) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bgPage, color: theme.text, fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 48 }}>🔍</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: theme.textBright }}>Artykuł nie znaleziony</div>
        <div style={{ fontSize: 14, color: theme.textSecondary }}>Artykuł o podanym adresie nie istnieje.</div>
        <button onClick={onBack} style={{ padding: "10px 20px", background: theme.accent, color: "#000", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Wróć do edukacji</button>
      </div>
    );
  }

  const catColor = CATEGORY_COLORS[article.category] || "#58a6ff";
  const catLabel = CATEGORY_LABELS[article.category] || article.category;
  const tocItems = buildTOC(article.sections || []);
  const relatedArticles = getArticlesBySlug(article.relatedSlugs || []);

  function handleNavigate(path) {
    if (path.startsWith("/edukacja/")) {
      const parts = path.replace("/edukacja/", "");
      onNavigateArticle(parts);
    } else {
      onNavigateHome();
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.bgPage, color: theme.text, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "16px 16px" : "24px 24px" }}>

        <Breadcrumbs
          theme={theme}
          items={[
            { label: "Strona główna", href: "/", onClick: onNavigateHome },
            { label: "Edukacja", href: "/edukacja", onClick: onBack },
            { label: catLabel, href: `/edukacja/${article.category}`, onClick: () => onNavigateCategory(article.category) },
            { label: article.title.length > 50 ? article.title.slice(0, 47) + "…" : article.title },
          ]}
        />

        {/* Main layout: article + TOC sidebar */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 260px", gap: 32, alignItems: "start" }}>

          <article>
            {/* Category badge */}
            <div style={{ marginBottom: 16 }}>
              <span style={{
                background: `${catColor}20`,
                color: catColor,
                fontSize: 12,
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 20,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>{catLabel}</span>
            </div>

            {/* Title H1 */}
            <h1 style={{ fontSize: isMobile ? 26 : 36, fontWeight: 900, color: theme.textBright, margin: "0 0 16px", lineHeight: 1.2 }}>
              {article.title}
            </h1>

            {/* Meta info */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${theme.border}`, fontSize: 13, color: theme.textSecondary }}>
              <span>✍️ {article.author}</span>
              <span>📅 {article.publishDate}</span>
              {article.updatedDate && article.updatedDate !== article.publishDate && <span>🔄 Aktualizacja: {article.updatedDate}</span>}
              <span>⏱️ {article.readingTime} min czytania</span>
            </div>

            {/* Mobile TOC */}
            {isMobile && <TOC items={tocItems} theme={theme} isMobile={true} />}

            {/* Featured image */}
            {article.featuredImage && (
              <div style={{ marginBottom: 28, borderRadius: 12, overflow: "hidden", background: `linear-gradient(135deg, ${catColor}22 0%, ${catColor}11 100%)`, height: 200, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>
                {article.category === "podstawy" ? "📚" : article.category === "analiza" ? "📊" : "♟️"}
              </div>
            )}

            {/* Article body */}
            <SectionRenderer sections={article.sections} theme={theme} onNavigate={handleNavigate} />

            {/* CTA box */}
            <CTABox ctaType={article.ctaType} ctaText={article.ctaText} ctaLink={article.ctaLink} theme={theme} onNavigate={handleNavigate} />

            {/* FAQ */}
            <FAQSection items={article.faq} theme={theme} />

            {/* Social share */}
            <SocialShare title={article.title} theme={theme} />

            {/* Related articles */}
            <RelatedArticles articles={relatedArticles} theme={theme} onNavigate={onNavigateArticle} />
          </article>

          {/* Desktop TOC sidebar */}
          {!isMobile && (
            <aside>
              <TOC items={tocItems} theme={theme} isMobile={false} />
            </aside>
          )}

        </div>
      </div>
    </div>
  );
}

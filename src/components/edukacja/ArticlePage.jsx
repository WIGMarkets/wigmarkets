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
import ArticleIllustration from "./ArticleIllustration.jsx";
import Icon from "./Icon.jsx";

const CATEGORY_LABELS = { podstawy: "Podstawy", analiza: "Analiza", strategia: "Strategia" };
const CATEGORY_COLORS = { podstawy: "#3b82f6", analiza: "#22c55e", strategia: "#f0883e" };

function injectSchema(article) {
  ["article-schema", "faq-schema", "breadcrumb-schema"].forEach(id => document.getElementById(id)?.remove());
  const baseUrl = window.location.origin;
  const articleUrl = `${baseUrl}/edukacja/${article.slug}`;

  const addScript = (id, data) => {
    const s = document.createElement("script");
    s.id = id;
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  };

  addScript("article-schema", {
    "@context": "https://schema.org", "@type": "Article",
    headline: article.title, description: article.metaDescription,
    image: article.featuredImage ? `${baseUrl}${article.featuredImage}` : undefined,
    url: articleUrl, datePublished: article.publishDate, dateModified: article.updatedDate,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: "WIGmarkets.pl", url: baseUrl },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
  });

  if (article.faq?.length > 0) {
    addScript("faq-schema", {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: article.faq.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
    });
  }

  addScript("breadcrumb-schema", {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Edukacja", item: `${baseUrl}/edukacja` },
      { "@type": "ListItem", position: 3, name: CATEGORY_LABELS[article.category] || article.category, item: `${baseUrl}/edukacja/${article.category}` },
      { "@type": "ListItem", position: 4, name: article.title, item: articleUrl },
    ],
  });
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
    return () => { ["article-schema", "faq-schema", "breadcrumb-schema"].forEach(id => document.getElementById(id)?.remove()); };
  }, [article]);

  if (!article) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bgPage, color: theme.text, fontFamily: "var(--font-ui)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 16 }}>
        <div style={{ color: theme.textSecondary }}><Icon name="search" size={48} /></div>
        <div style={{ fontSize: 20, fontWeight: 700, color: theme.textBright }}>Artykuł nie znaleziony</div>
        <div style={{ fontSize: 14, color: theme.textSecondary }}>Artykuł o podanym adresie nie istnieje.</div>
        <button onClick={onBack} style={{ padding: "12px 24px", background: theme.accent, color: "#000", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", minHeight: 48 }}>Wróć do edukacji</button>
      </div>
    );
  }

  const catColor = CATEGORY_COLORS[article.category] || "#3b82f6";
  const catLabel = CATEGORY_LABELS[article.category] || article.category;
  const tocItems = buildTOC(article.sections || []);
  const relatedArticles = getArticlesBySlug(article.relatedSlugs || []);

  function handleNavigate(path) {
    if (path.startsWith("/edukacja/")) {
      onNavigateArticle(path.replace("/edukacja/", ""));
    } else {
      onNavigateHome();
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.bgPage, color: theme.text, fontFamily: "var(--font-ui)", overflowX: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "16px" : "24px", boxSizing: "border-box", width: "100%" }}>

        <Breadcrumbs
          theme={theme}
          items={[
            { label: "Strona główna", href: "/", onClick: onNavigateHome },
            { label: "Edukacja", href: "/edukacja", onClick: onBack },
            { label: catLabel, href: `/edukacja/${article.category}`, onClick: () => onNavigateCategory(article.category) },
            { label: article.title.length > 40 ? article.title.slice(0, 37) + "…" : article.title },
          ]}
        />

        {/* Main layout: article + TOC sidebar */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 260px", gap: isMobile ? 0 : 32, alignItems: "start" }}>

          <article style={{ minWidth: 0, overflowX: "hidden" }}>
            {/* Article illustration */}
            <div style={{ marginBottom: 20, borderRadius: 12, overflow: "hidden", border: `1px solid ${theme.border}` }}>
              <ArticleIllustration slug={slug} style={{ width: "100%", height: "auto", display: "block" }} />
            </div>

            {/* Category badge */}
            <div style={{ marginBottom: 12 }}>
              <span style={{
                background: `${catColor}20`, color: catColor,
                fontSize: 12, fontWeight: 700, padding: "4px 12px",
                borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.5px",
              }}>{catLabel}</span>
            </div>

            {/* Title H1 */}
            <h1 style={{ fontSize: isMobile ? 24 : 36, fontWeight: 900, color: theme.textBright, margin: "0 0 16px", lineHeight: 1.25 }}>
              {article.title}
            </h1>

            {/* Meta info */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? 8 : 16, marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${theme.border}`, fontSize: 13, color: theme.textSecondary }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="user" size={14} /> {article.author}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="calendar" size={14} /> {article.publishDate}</span>
              {article.updatedDate && article.updatedDate !== article.publishDate && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="refresh-cw" size={14} /> {article.updatedDate}</span>}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="clock" size={14} /> {article.readingTime} min</span>
            </div>

            {/* Mobile TOC — collapsed by default */}
            {isMobile && <TOC items={tocItems} theme={theme} isMobile={true} />}

            {/* Article body */}
            <SectionRenderer sections={article.sections} theme={theme} onNavigate={handleNavigate} isMobile={isMobile} />

            {/* CTA box */}
            <CTABox ctaType={article.ctaType} ctaText={article.ctaText} ctaLink={article.ctaLink} theme={theme} onNavigate={handleNavigate} isMobile={isMobile} />

            {/* FAQ */}
            <FAQSection items={article.faq} theme={theme} isMobile={isMobile} />

            {/* Social share */}
            <SocialShare title={article.title} theme={theme} />

            {/* Related articles */}
            <RelatedArticles articles={relatedArticles} theme={theme} onNavigate={onNavigateArticle} isMobile={isMobile} />
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

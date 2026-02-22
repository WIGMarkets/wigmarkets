import { useMemo, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile.js";
import Icon from "../components/edukacja/Icon.jsx";
import GlossaryCalculator from "../components/edukacja/GlossaryCalculator.jsx";
import GlossaryLiveData from "../components/edukacja/GlossaryLiveData.jsx";
import GlossaryQuiz from "../components/edukacja/GlossaryQuiz.jsx";
import DidYouKnow from "../components/edukacja/DidYouKnow.jsx";
import glossaryData from "../data/glossary.json";

const CATEGORY_LABELS = {
  "podstawy": "Podstawy",
  "analiza-fundamentalna": "Analiza fundamentalna",
  "analiza-techniczna": "Analiza techniczna",
  "wskazniki": "Wskaźniki",
};

export default function GlossaryTerm({ theme }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const sorted = useMemo(() =>
    [...glossaryData].sort((a, b) => a.term.localeCompare(b.term, "pl")),
  []);

  const currentIndex = sorted.findIndex(e => e.slug === slug);
  const entry = currentIndex >= 0 ? sorted[currentIndex] : null;
  const prev = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const next = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  const relatedEntries = useMemo(() => {
    if (!entry) return [];
    return (entry.related || [])
      .map(r => glossaryData.find(e => e.slug === r))
      .filter(Boolean);
  }, [entry]);

  // SEO: document title + meta description
  useEffect(() => {
    if (!entry) return;
    document.title = `${entry.term} — Słowniczek giełdowy — WIGmarkets.pl`;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", `${entry.shortDef} Definicja, wzór, przykład.`);

    // Schema.org DefinedTerm JSON-LD
    const ldId = "glossary-term-jsonld";
    let ldScript = document.getElementById(ldId);
    if (!ldScript) {
      ldScript = document.createElement("script");
      ldScript.id = ldId;
      ldScript.type = "application/ld+json";
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "name": entry.term,
      "description": entry.shortDef,
      "url": `https://wigmarkets.pl/edukacja/slowniczek/${entry.slug}`,
      "inDefinedTermSet": {
        "@type": "DefinedTermSet",
        "name": "Słowniczek giełdowy WIGmarkets.pl",
        "url": "https://wigmarkets.pl/edukacja/slowniczek",
      },
    });

    return () => {
      const el = document.getElementById(ldId);
      if (el) el.remove();
    };
  }, [entry]);

  if (!entry) return <Navigate to="/edukacja/slowniczek" replace />;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: isMobile ? "24px 16px 64px" : "40px 24px 80px" }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: 28, fontSize: 13, color: theme.textMuted, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
        <span
          onClick={() => navigate("/edukacja")}
          style={{ color: theme.textSecondary, cursor: "pointer", transition: "color 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.color = theme.accent; }}
          onMouseLeave={e => { e.currentTarget.style.color = theme.textSecondary; }}
        >
          Edukacja
        </span>
        <span style={{ color: theme.textMuted }}>/</span>
        <span
          onClick={() => navigate("/edukacja/slowniczek")}
          style={{ color: theme.textSecondary, cursor: "pointer", transition: "color 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.color = theme.accent; }}
          onMouseLeave={e => { e.currentTarget.style.color = theme.textSecondary; }}
        >
          Słowniczek
        </span>
        <span style={{ color: theme.textMuted }}>/</span>
        <span style={{ color: theme.textMuted }}>{entry.term}</span>
      </nav>

      {/* Category badge */}
      <div style={{ marginBottom: 16 }}>
        <span style={{
          display: "inline-block",
          padding: "4px 10px", borderRadius: 6,
          fontSize: 12, fontWeight: 500,
          background: `${theme.accent}18`,
          color: theme.accent,
          fontFamily: "var(--font-ui)",
          letterSpacing: "0.02em",
        }}>
          {CATEGORY_LABELS[entry.category] || entry.category}
        </span>
      </div>

      {/* Title */}
      <h1 style={{
        fontSize: isMobile ? 24 : 28, fontWeight: 800,
        color: theme.textBright, marginBottom: 24,
        fontFamily: "var(--font-ui)", lineHeight: 1.2,
      }}>
        {entry.term}
      </h1>

      {/* Full definition */}
      <div style={{
        maxWidth: 720, fontSize: 16, lineHeight: 1.75,
        color: theme.text, marginBottom: 32,
      }}>
        {entry.fullDef.split("\n\n").map((paragraph, i) => (
          <p key={i} style={{ marginBottom: 16 }}>{paragraph}</p>
        ))}
      </div>

      {/* Calculator */}
      {entry.hasCalculator && <GlossaryCalculator slug={entry.slug} theme={theme} />}

      {/* Live data */}
      {entry.liveDataType && <GlossaryLiveData liveDataType={entry.liveDataType} theme={theme} />}

      {/* Quiz */}
      {entry.quiz && <GlossaryQuiz quiz={entry.quiz} theme={theme} />}

      {/* Did you know */}
      {entry.didYouKnow && <DidYouKnow text={entry.didYouKnow} theme={theme} />}

      {/* Example callout */}
      {entry.example && (
        <div style={{
          borderLeft: `3px solid ${theme.accent}`,
          background: theme.bgCardAlt,
          borderRadius: "0 10px 10px 0",
          padding: isMobile ? "16px 16px" : "20px 24px",
          marginBottom: 40,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.1em", color: theme.accent,
            marginBottom: 10, fontFamily: "var(--font-ui)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Icon name="lightbulb" size={14} />
            Przykład
          </div>
          <div style={{
            fontSize: 15, lineHeight: 1.7, color: theme.textSecondary,
          }}>
            {entry.example}
          </div>
        </div>
      )}

      {/* Related terms */}
      {relatedEntries.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.1em", color: theme.textMuted,
            marginBottom: 14, fontFamily: "var(--font-ui)",
          }}>
            Powiązane pojęcia
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {relatedEntries.map(rel => (
              <span
                key={rel.slug}
                onClick={() => navigate(`/edukacja/slowniczek/${rel.slug}`)}
                style={{
                  display: "inline-block",
                  padding: "6px 14px", borderRadius: 8,
                  fontSize: 13, fontWeight: 500,
                  background: theme.bgCard,
                  border: `1px solid ${theme.border}`,
                  color: theme.textSecondary,
                  cursor: "pointer",
                  fontFamily: "var(--font-ui)",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = theme.accent;
                  e.currentTarget.style.color = theme.accent;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.color = theme.textSecondary;
                }}
              >
                {rel.term}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Prev / Next navigation */}
      <div style={{
        display: "grid",
        gridTemplateColumns: prev && next ? "1fr 1fr" : "1fr",
        gap: 12,
        borderTop: `1px solid ${theme.border}`,
        paddingTop: 24,
      }}>
        {prev && (
          <div
            onClick={() => navigate(`/edukacja/slowniczek/${prev.slug}`)}
            style={{
              padding: "16px 20px",
              background: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: 10,
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent + "60"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; }}
          >
            <div style={{
              fontSize: 11, fontWeight: 600, textTransform: "uppercase",
              letterSpacing: "0.08em", color: theme.textMuted,
              marginBottom: 6, display: "flex", alignItems: "center", gap: 4,
            }}>
              <Icon name="arrow-left" size={12} /> Poprzednie
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.textBright, fontFamily: "var(--font-ui)" }}>
              {prev.term}
            </div>
          </div>
        )}
        {next && (
          <div
            onClick={() => navigate(`/edukacja/slowniczek/${next.slug}`)}
            style={{
              padding: "16px 20px",
              background: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: 10,
              cursor: "pointer",
              transition: "border-color 0.15s",
              textAlign: "right",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent + "60"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; }}
          >
            <div style={{
              fontSize: 11, fontWeight: 600, textTransform: "uppercase",
              letterSpacing: "0.08em", color: theme.textMuted,
              marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4,
            }}>
              Następne <Icon name="arrow-right" size={12} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.textBright, fontFamily: "var(--font-ui)" }}>
              {next.term}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

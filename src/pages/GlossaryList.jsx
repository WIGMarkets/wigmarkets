import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile.js";
import Icon from "../components/edukacja/Icon.jsx";
import glossaryData from "../data/glossary.json";

const CATEGORIES = [
  { key: "all", label: "Wszystkie" },
  { key: "podstawy", label: "Podstawy" },
  { key: "analiza-fundamentalna", label: "Analiza fundamentalna" },
  { key: "analiza-techniczna", label: "Analiza techniczna" },
  { key: "wskazniki", label: "Wskaźniki" },
];

function groupByLetter(entries) {
  const groups = {};
  for (const entry of entries) {
    const letter = entry.term[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(entry);
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, "pl"));
}

export default function GlossaryList({ theme }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return glossaryData
      .filter(entry => {
        if (activeCategory !== "all" && entry.category !== activeCategory) return false;
        if (q && !entry.term.toLowerCase().includes(q) && !entry.shortDef.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => a.term.localeCompare(b.term, "pl"));
  }, [search, activeCategory]);

  const grouped = useMemo(() => groupByLetter(filtered), [filtered]);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: isMobile ? "24px 16px 64px" : "40px 24px 80px" }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: 24, fontSize: 13, color: theme.textMuted }}>
        <span
          onClick={() => navigate("/edukacja")}
          style={{ color: theme.textSecondary, cursor: "pointer", transition: "color 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.color = theme.accent; }}
          onMouseLeave={e => { e.currentTarget.style.color = theme.textSecondary; }}
        >
          Edukacja
        </span>
        <span style={{ margin: "0 8px", color: theme.textMuted }}>/</span>
        <span style={{ color: theme.textMuted }}>Słowniczek giełdowy</span>
      </nav>

      {/* Header */}
      <h1 style={{
        fontSize: isMobile ? 24 : 32, fontWeight: 800, color: theme.textBright,
        marginBottom: 8, fontFamily: "var(--font-ui)",
      }}>
        Słowniczek giełdowy
      </h1>
      <p style={{
        fontSize: 15, color: theme.textSecondary, marginBottom: 32,
        lineHeight: 1.6, maxWidth: 600,
      }}>
        Najważniejsze pojęcia giełdowe wyjaśnione prostym językiem. Idealne na start przygody z inwestowaniem na GPW.
      </p>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <div style={{
          position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          color: theme.textMuted, pointerEvents: "none",
        }}>
          <Icon name="search" size={18} />
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Szukaj pojęcia..."
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "12px 16px 12px 42px",
            background: theme.bgCardAlt,
            border: `1px solid ${theme.border}`,
            borderRadius: 10, fontSize: 15,
            color: theme.textBright,
            outline: "none",
            fontFamily: "var(--font-ui)",
            transition: "border-color 0.15s",
          }}
          onFocus={e => { e.currentTarget.style.borderColor = theme.accent; }}
          onBlur={e => { e.currentTarget.style.borderColor = theme.border; }}
        />
      </div>

      {/* Category pills */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32,
      }}>
        {CATEGORIES.map(cat => {
          const active = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                padding: "6px 14px", borderRadius: 8,
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                fontFamily: "var(--font-ui)",
                border: `1px solid ${active ? theme.accent : theme.border}`,
                background: active ? `${theme.accent}18` : "transparent",
                color: active ? theme.accent : theme.textSecondary,
                transition: "all 0.15s",
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grouped entries */}
      {grouped.length === 0 && (
        <div style={{
          textAlign: "center", padding: "48px 24px",
          color: theme.textMuted, fontSize: 15,
        }}>
          Brak wyników dla &ldquo;{search}&rdquo;
        </div>
      )}

      {grouped.map(([letter, entries]) => (
        <div key={letter} style={{ marginBottom: 32 }}>
          {/* Letter separator */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            marginBottom: 12,
          }}>
            <span style={{
              fontSize: 13, fontWeight: 700, color: theme.accent,
              letterSpacing: "0.08em", textTransform: "uppercase",
              fontFamily: "var(--font-mono)",
            }}>
              {letter}
            </span>
            <div style={{ flex: 1, height: 1, background: theme.border }} />
          </div>

          {/* Entries */}
          {entries.map(entry => (
            <div
              key={entry.slug}
              onClick={() => navigate(`/edukacja/slowniczek/${entry.slug}`)}
              style={{
                padding: "16px 20px",
                background: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: 10,
                marginBottom: 8,
                cursor: "pointer",
                transition: "border-color 0.15s, transform 0.15s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = theme.accent + "60";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = theme.border;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 16, fontWeight: 600, color: theme.textBright,
                    marginBottom: 4, fontFamily: "var(--font-ui)",
                  }}>
                    {entry.term}
                  </div>
                  <div style={{
                    fontSize: 14, color: theme.textSecondary, lineHeight: 1.5,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {entry.shortDef}
                  </div>
                </div>
                <div style={{ flexShrink: 0, color: theme.textMuted }}>
                  <Icon name="chevron-right" size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Count */}
      <div style={{
        textAlign: "center", fontSize: 12, color: theme.textMuted,
        marginTop: 16, fontFamily: "var(--font-mono)",
      }}>
        {filtered.length} {filtered.length === 1 ? "pojęcie" : filtered.length < 5 ? "pojęcia" : "pojęć"}
      </div>
    </div>
  );
}

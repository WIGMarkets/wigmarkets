import { useState, useEffect, useMemo } from "react";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { fetchMarketNews } from "../lib/api.js";

const SOURCES = [
  { name: "Bankier.pl", color: "#e74c3c" },
  { name: "Stooq", color: "#3498db" },
  { name: "Money.pl", color: "#27ae60" },
  { name: "Business Insider Polska", color: "#2c3e50" },
  { name: "Investing.com PL", color: "#e67e22" },
];

const TIME_FILTERS = [
  { key: "all", label: "Wszystkie" },
  { key: "dzis", label: "Dziś" },
  { key: "tydzien", label: "Ten tydzień" },
  { key: "miesiac", label: "Ten miesiąc" },
];

function ExternalLinkIcon({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function getTimeCategory(dateISO) {
  const d = new Date(dateISO);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const articleDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = (today - articleDay) / 86400000;
  if (diffDays < 1) return "dzis";
  if (diffDays < 7) return "tydzien";
  return "miesiac";
}

function getDayLabel(dateISO) {
  const d = new Date(dateISO);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const articleDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.floor((today - articleDay) / 86400000);
  const months = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
    "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
  const dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  if (diffDays === 0) return `DZIŚ — ${dateStr}`;
  if (diffDays === 1) return `WCZORAJ — ${dateStr}`;
  return dateStr;
}

function getDayKey(dateISO) {
  const d = new Date(dateISO);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getTimeStr(dateISO) {
  const d = new Date(dateISO);
  if (isNaN(d.getTime())) return "";
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  if (h === "00" && m === "00") return "";
  return `${h}:${m}`;
}

function isLive(articles) {
  if (!articles.length) return false;
  const newest = new Date(articles[0].dateISO);
  return (Date.now() - newest.getTime()) < 2 * 60 * 60 * 1000;
}

function formatUpdatedAt(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  const months = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${h}:${m}`;
}

// --- Skeleton components ---

function HeroSkeleton({ theme }) {
  const pulse = {
    background: theme.bgCardAlt,
    borderRadius: 8,
    animation: "newsPulse 1.5s ease-in-out infinite",
  };
  return (
    <div style={{
      background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12,
      overflow: "hidden", minHeight: 260,
    }}>
      <div style={{ ...pulse, height: 160, borderRadius: 0 }} />
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ ...pulse, width: 80, height: 12 }} />
        <div style={{ ...pulse, width: "90%", height: 18 }} />
        <div style={{ ...pulse, width: "60%", height: 14 }} />
        <div style={{ ...pulse, width: 120, height: 12 }} />
      </div>
    </div>
  );
}

function ListSkeleton({ theme, count = 5 }) {
  const pulse = {
    background: theme.bgCardAlt,
    borderRadius: 6,
    animation: "newsPulse 1.5s ease-in-out infinite",
  };
  return Array.from({ length: count }, (_, i) => (
    <div key={i} style={{
      padding: "14px 16px", borderBottom: `1px solid ${theme.border}`,
      display: "flex", gap: 16, alignItems: "flex-start",
    }}>
      <div style={{ ...pulse, width: 40, height: 12, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ ...pulse, width: 80, height: 10 }} />
        <div style={{ ...pulse, width: "85%", height: 16 }} />
      </div>
    </div>
  ));
}

// --- Hero article card ---

function HeroArticleCard({ article, theme, isMobile }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const hasImage = article.image && !imgError;

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block", textDecoration: "none", color: "inherit",
        background: theme.bgCard,
        border: `1px solid ${hovered ? theme.borderInput : theme.border}`,
        borderRadius: 12, overflow: "hidden",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.2)" : "none",
        transition: "all 200ms ease",
      }}
    >
      {hasImage && (
        <div style={{ overflow: "hidden" }}>
          <img
            src={article.image}
            alt=""
            loading="lazy"
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              aspectRatio: "16/9",
              objectFit: "cover",
              display: "block",
              transform: hovered ? "scale(1.03)" : "scale(1)",
              transition: "transform 300ms ease",
            }}
          />
        </div>
      )}
      <div style={{
        padding: isMobile ? "16px 18px" : "20px 24px",
        display: "flex", flexDirection: "column", gap: 10,
        ...(hasImage ? {} : { borderLeft: `3px solid ${article.sourceColor || theme.accent}` }),
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
            background: article.sourceColor || theme.accent,
          }} />
          <span style={{
            fontSize: 11, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.06em", color: article.sourceColor || theme.accent,
          }}>
            {article.source}
          </span>
        </div>
        <h3 style={{
          fontSize: isMobile ? 16 : 18, fontWeight: 700, lineHeight: 1.35,
          color: theme.textBright, margin: 0,
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {article.title}
        </h3>
        {article.description && (
          <p style={{
            fontSize: 13, lineHeight: 1.5, color: theme.textSecondary, margin: 0,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {article.description}
          </p>
        )}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: "auto", paddingTop: 4,
        }}>
          <span style={{ fontSize: 12, color: theme.textMuted }}>
            {article.dateFormatted}
            {getTimeStr(article.dateISO) && ` · ${getTimeStr(article.dateISO)}`}
          </span>
          <ExternalLinkIcon size={14} color={hovered ? theme.textBright : theme.textMuted} />
        </div>
      </div>
    </a>
  );
}

// --- Compact article row ---

function ArticleRow({ article, theme }) {
  const [hovered, setHovered] = useState(false);
  const timeStr = getTimeStr(article.dateISO);

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "flex-start", gap: 14,
        padding: "12px 16px", textDecoration: "none", color: "inherit",
        borderBottom: `1px solid ${theme.border}`,
        background: hovered ? theme.bgCard : "transparent",
        borderRadius: hovered ? 8 : 0,
        cursor: "pointer", transition: "background 150ms ease",
      }}
    >
      {timeStr && (
        <span style={{
          fontSize: 13, color: theme.textMuted, fontFamily: "var(--font-mono, monospace)",
          fontVariantNumeric: "tabular-nums", width: 44, flexShrink: 0, paddingTop: 1,
        }}>
          {timeStr}
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
            background: article.sourceColor || theme.accent,
          }} />
          <span style={{
            fontSize: 11, fontWeight: 600, color: article.sourceColor || theme.accent,
          }}>
            {article.source}
          </span>
        </div>
        <div style={{
          fontSize: 14, fontWeight: 500, lineHeight: 1.4, color: theme.textBright,
          textDecoration: hovered ? "underline" : "none",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {article.title}
        </div>
      </div>
      <span style={{ flexShrink: 0, paddingTop: 2 }}>
        <ExternalLinkIcon size={13} color={hovered ? theme.textBright : theme.textMuted} />
      </span>
    </a>
  );
}

// --- Filter pill button ---

function FilterPill({ label, active, color, theme, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: active ? (color ? color + "18" : theme.accent + "22") : "transparent",
        border: `1px solid ${active ? (color || theme.accent) : theme.border}`,
        color: active ? (color || theme.accent) : theme.textSecondary,
        borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: active ? 600 : 500,
        cursor: "pointer", fontFamily: "inherit", transition: "all 150ms ease",
        whiteSpace: "nowrap",
      }}
    >
      {color && (
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
      )}
      {label}
    </button>
  );
}

// --- Live dot ---

function LiveDot() {
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: "50%",
      background: "#22c55e", animation: "newsPulse 2s ease-in-out infinite",
    }} />
  );
}

// --- Main page ---

export default function NewsPage({ theme }) {
  const isMobile = useIsMobile();
  const [articles, setArticles] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [timeFilter, setTimeFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchMarketNews()
      .then(data => {
        if (data && data.articles) {
          setArticles(data.articles);
          setUpdatedAt(data.updatedAt);
        } else if (data && data.items) {
          // Fallback: old API format
          setArticles(data.items.map(item => ({
            ...item,
            dateISO: item.dateISO || new Date(item.pubDate).toISOString(),
            dateFormatted: item.dateFormatted || "",
            sourceColor: SOURCES.find(s => s.name === item.source)?.color || theme.accent,
          })));
        } else {
          setArticles([]);
        }
      })
      .catch(() => {
        setError(true);
        setArticles([]);
      });
  }, []);

  const filtered = useMemo(() => {
    if (!articles) return [];
    return articles.filter(a => {
      if (timeFilter !== "all" && getTimeCategory(a.dateISO) !== timeFilter) return false;
      if (sourceFilter !== "all" && a.source !== sourceFilter) return false;
      return true;
    });
  }, [articles, timeFilter, sourceFilter]);

  const heroArticles = useMemo(() => filtered.slice(0, 3), [filtered]);
  const listArticles = useMemo(() => filtered.slice(3), [filtered]);

  // Group list articles by day
  const groupedByDay = useMemo(() => {
    const groups = [];
    const dayMap = new Map();
    for (const article of listArticles) {
      const key = getDayKey(article.dateISO);
      if (!dayMap.has(key)) {
        const group = { key, label: getDayLabel(article.dateISO), articles: [] };
        dayMap.set(key, group);
        groups.push(group);
      }
      dayMap.get(key).articles.push(article);
    }
    return groups;
  }, [listArticles]);

  const live = articles ? isLive(articles) : false;

  // Unique sources present in data
  const activeSources = useMemo(() => {
    if (!articles) return [];
    const found = new Set(articles.map(a => a.source));
    return SOURCES.filter(s => found.has(s.name));
  }, [articles]);

  const loading = articles === null;

  return (
    <div style={{ color: theme.text, fontFamily: "var(--font-ui)" }}>
      <style>{`
        @keyframes newsPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "16px 14px" : "28px 32px" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontSize: isMobile ? 22 : 28, fontWeight: 800, color: theme.textBright,
            margin: "0 0 4px",
          }}>
            Wiadomości rynkowe
          </h1>
          <p style={{ fontSize: 13, color: theme.textSecondary, margin: "0 0 6px" }}>
            Najważniejsze informacje z rynku GPW
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: theme.textMuted }}>
            {live ? (
              <>
                <LiveDot />
                <span>Aktualne</span>
              </>
            ) : (
              <span style={{ opacity: 0.7 }}>Oczekiwanie na nowe wiadomości</span>
            )}
            {updatedAt && (
              <>
                <span style={{ opacity: 0.3 }}>·</span>
                <span>Ostatnia aktualizacja: {formatUpdatedAt(updatedAt)}</span>
              </>
            )}
          </div>
        </div>

        {/* Time filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {TIME_FILTERS.map(f => (
            <FilterPill
              key={f.key}
              label={f.label}
              active={timeFilter === f.key}
              theme={theme}
              onClick={() => setTimeFilter(f.key)}
            />
          ))}
        </div>

        {/* Source filter */}
        {activeSources.length > 1 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
            <FilterPill
              label="Wszystkie źródła"
              active={sourceFilter === "all"}
              theme={theme}
              onClick={() => setSourceFilter("all")}
            />
            {activeSources.map(s => (
              <FilterPill
                key={s.name}
                label={s.name}
                color={s.color}
                active={sourceFilter === s.name}
                theme={theme}
                onClick={() => setSourceFilter(s.name)}
              />
            ))}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 16, marginBottom: 40,
            }}>
              <HeroSkeleton theme={theme} />
              <HeroSkeleton theme={theme} />
            </div>
            <ListSkeleton theme={theme} count={5} />
          </>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{
            textAlign: "center", padding: "40px 0", color: theme.textSecondary, fontSize: 14,
          }}>
            Nie udało się załadować wiadomości. Spróbuj ponownie później.
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{
            textAlign: "center", padding: "40px 0", color: theme.textSecondary, fontSize: 14,
          }}>
            Brak wiadomości dla wybranych filtrów.
          </div>
        )}

        {/* Content */}
        {!loading && filtered.length > 0 && (
          <>
            {/* Hero cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : heroArticles.length >= 3 ? "1fr 1fr 1fr" : "1fr 1fr",
              gap: 16, marginBottom: 40,
            }}>
              {heroArticles.map((article, i) => (
                <HeroArticleCard key={article.link + i} article={article} theme={theme} isMobile={isMobile} />
              ))}
            </div>

            {/* Timeline list grouped by day */}
            {groupedByDay.map(group => (
              <div key={group.key} style={{ marginBottom: 32 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  fontSize: 12, fontWeight: 600, color: theme.textSecondary,
                  letterSpacing: "0.06em", marginBottom: 8,
                  padding: "0 4px",
                }}>
                  <span>{group.label}</span>
                  <span style={{ height: 1, flex: 1, background: theme.border }} />
                  <span style={{ color: theme.textMuted }}>{group.articles.length}</span>
                </div>
                <div style={{
                  background: theme.bgCard, border: `1px solid ${theme.border}`,
                  borderRadius: 10, overflow: "hidden",
                }}>
                  {group.articles.map((article, i) => (
                    <ArticleRow key={article.link + i} article={article} theme={theme} />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

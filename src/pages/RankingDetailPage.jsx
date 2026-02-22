import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { RANKINGS, buildRankingData, applyRanking } from "../data/rankings.js";
import { GPW_COMPANIES } from "../data/gpw-companies.js";
import { fmt, changeFmt, changeColor, fmtCap, fmtVolume } from "../lib/formatters.js";
import StockLogo from "../components/StockLogo.jsx";
import Icon from "../components/edukacja/Icon.jsx";

const INDEX_MAP = Object.fromEntries(GPW_COMPANIES.map(c => [c.ticker, c.index]));
const INITIAL_SHOW = 20;

function formatValue(value, format) {
  if (value == null) return "b.d.";
  switch (format) {
    case "percent":
      return changeFmt(value);
    case "dividendYield":
      return `${fmt(value, 1)}%`;
    case "marketcap":
      return fmtCap(value);
    case "volume": {
      if (value >= 1e9) return `${(value / 1e9).toFixed(1)} mld`;
      if (value >= 1e6) return `${(value / 1e6).toFixed(1)} mln`;
      if (value >= 1e3) return `${(value / 1e3).toFixed(0)} tys`;
      return `${Math.round(value)}`;
    }
    case "price":
      return `${fmt(value)} zł`;
    case "number":
      return fmt(value, 1);
    default:
      return String(value);
  }
}

function getValueColor(format, value, theme) {
  if (format === "percent") return changeColor(value);
  if (format === "dividendYield") return "#22c55e";
  return theme.textBright;
}

const MEDAL_COLORS = {
  1: { bg: "#FFD700", text: "#92710a" }, // gold
  2: { bg: "#C0C0C0", text: "#5a5a5a" }, // silver
  3: { bg: "#CD7F32", text: "#6b3e14" }, // bronze
};

function PositionBadge({ position, theme }) {
  const medal = MEDAL_COLORS[position];
  if (medal) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 24, height: 24, borderRadius: "50%",
        background: medal.bg,
        color: medal.text,
        fontSize: 11, fontWeight: 800,
        fontFamily: "var(--font-mono)",
        lineHeight: 1,
      }}>
        {position}
      </span>
    );
  }
  return (
    <span style={{
      fontSize: 12, color: theme.textMuted,
      fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums",
      minWidth: 20, textAlign: "center",
    }}>
      {position}
    </span>
  );
}

export default function RankingDetailPage({ theme, liveStocks, prices, changes }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showAll, setShowAll] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  const ranking = RANKINGS.find(r => r.slug === slug);

  useEffect(() => {
    if (ranking) {
      document.title = `${ranking.seoTitle} — WIGmarkets.pl`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", ranking.seoDescription);
    }
  }, [ranking]);

  useEffect(() => {
    setShowAll(false);
  }, [slug]);

  const enrichedStocks = useMemo(
    () => buildRankingData(liveStocks, prices, changes, INDEX_MAP),
    [liveStocks, prices, changes]
  );

  const rankedStocks = useMemo(
    () => ranking ? applyRanking(ranking, enrichedStocks) : [],
    [ranking, enrichedStocks]
  );

  const displayedStocks = showAll ? rankedStocks : rankedStocks.slice(0, INITIAL_SHOW);

  const relatedRankings = useMemo(
    () => (ranking?.related || [])
      .map(slug => RANKINGS.find(r => r.slug === slug))
      .filter(Boolean),
    [ranking]
  );

  // Schema.org ItemList JSON-LD
  const jsonLd = useMemo(() => {
    if (!ranking || rankedStocks.length === 0) return null;
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": ranking.seoTitle,
      "numberOfItems": Math.min(rankedStocks.length, 20),
      "itemListElement": rankedStocks.slice(0, 20).map((s, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": s.ticker,
        "url": `https://wigmarkets.pl/spolka/${s.ticker}`,
      })),
    };
  }, [ranking, rankedStocks]);

  if (!ranking) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, color: theme.textBright, marginBottom: 12 }}>Ranking nie znaleziony</h1>
        <p style={{ color: theme.textSecondary, marginBottom: 24 }}>Podana strona rankingu nie istnieje.</p>
        <Link to="/rankingi" style={{ color: theme.accent, textDecoration: "none", fontSize: 14 }}>
          Wróć do listy rankingów
        </Link>
      </div>
    );
  }

  const PAD = isMobile ? "12px 8px" : "14px 16px";

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "24px 12px 48px" : "32px 24px 64px" }}>
      {/* JSON-LD for SEO */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: 20 }}>
        <ol style={{ display: "flex", flexWrap: "wrap", gap: 6, listStyle: "none", margin: 0, padding: 0, fontSize: 13, color: theme.textMuted }}>
          <li style={{ display: "flex", alignItems: "center" }}>
            <Link to="/rankingi" style={{
              color: theme.textSecondary, textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = theme.accent; }}
            onMouseLeave={e => { e.currentTarget.style.color = theme.textSecondary; }}
            >
              Rankingi
            </Link>
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: theme.textMuted, fontSize: 11 }}>/</span>
            <span style={{ color: theme.textMuted }}>{ranking.title}</span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: isMobile ? 20 : 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: `${theme.accent}15`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name={ranking.icon} size={20} style={{ color: theme.accent }} />
          </div>
          <h1 style={{
            fontSize: isMobile ? 22 : 28, fontWeight: 700,
            color: theme.textBright, margin: 0,
            fontFamily: "var(--font-ui)",
          }}>
            {ranking.title}
          </h1>
        </div>
        <p style={{
          fontSize: 14, color: theme.textSecondary, margin: 0,
          maxWidth: 600, lineHeight: 1.5,
        }}>
          {ranking.description}
        </p>
      </div>

      {/* Table */}
      <div style={{
        background: theme.bgCard,
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? 500 : 700 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                <th style={{
                  padding: PAD, textAlign: "center", width: 50,
                  fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
                  color: theme.textMuted, position: "sticky", top: 0, background: theme.bgCard,
                }}>#</th>
                <th style={{
                  padding: PAD, textAlign: "left",
                  fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
                  color: theme.textMuted, position: "sticky", top: 0, background: theme.bgCard,
                }}>SPÓŁKA</th>
                <th style={{
                  padding: PAD, textAlign: "right",
                  fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
                  color: theme.textMuted, position: "sticky", top: 0, background: theme.bgCard,
                }}>KURS</th>
                <th style={{
                  padding: PAD, textAlign: "right",
                  fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
                  color: theme.textMuted, position: "sticky", top: 0, background: theme.bgCard,
                }}>ZMIANA 24H</th>
                <th style={{
                  padding: PAD, textAlign: "right",
                  fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                  color: theme.accent, position: "sticky", top: 0, background: theme.bgCard,
                }}>{ranking.valueLabel}</th>
                {!isMobile && (
                  <th style={{
                    padding: PAD, textAlign: "right",
                    fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
                    color: theme.textMuted, position: "sticky", top: 0, background: theme.bgCard,
                  }}>OBRÓT</th>
                )}
              </tr>
            </thead>
            <tbody>
              {displayedStocks.length === 0 && (
                <tr>
                  <td colSpan={isMobile ? 5 : 6} style={{
                    padding: "40px 16px", textAlign: "center",
                    color: theme.textMuted, fontSize: 14,
                  }}>
                    Brak danych dla tego rankingu
                  </td>
                </tr>
              )}
              {displayedStocks.map((stock, i) => {
                const position = i + 1;
                const isHovered = hoveredRow === i;
                // If the ranking value column is the same as change24h, skip duplicate display
                const isValueSameAs24h = ranking.valueKey === "change24h";
                const isValueSameAsPrice = ranking.valueKey === "close";
                return (
                  <tr
                    key={stock.ticker}
                    onClick={() => navigate(`/spolka/${stock.ticker}`)}
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      borderBottom: `1px solid ${theme.border}`,
                      cursor: "pointer",
                      transition: "background 0.15s",
                      background: isHovered ? (theme.bgCardAlt || theme.bgElevated || "rgba(255,255,255,0.03)") : "transparent",
                    }}
                  >
                    {/* Position */}
                    <td style={{ padding: PAD, textAlign: "center", width: 50 }}>
                      <PositionBadge position={position} theme={theme} />
                    </td>

                    {/* Ticker + Name */}
                    <td style={{ padding: PAD }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <StockLogo ticker={stock.ticker} size={isMobile ? 28 : 32} borderRadius={6} sector={stock.sector} />
                        <div>
                          <div style={{
                            fontWeight: 600, color: theme.textBright,
                            fontSize: isMobile ? 12 : 14,
                            fontFamily: "var(--font-ui)", letterSpacing: "0.01em",
                          }}>{stock.ticker}</div>
                          <div style={{
                            fontSize: 11, color: theme.textMuted,
                            maxWidth: isMobile ? 120 : 200,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>{stock.name}</div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td style={{
                      padding: PAD, textAlign: "right",
                      fontWeight: isValueSameAsPrice ? 700 : 500,
                      color: theme.textBright,
                      fontSize: isMobile ? 12 : 14,
                      fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)",
                      whiteSpace: "nowrap",
                    }}>
                      {fmt(stock.close)} zł
                    </td>

                    {/* Change 24H */}
                    <td style={{
                      padding: PAD, textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}>
                      <span style={{
                        display: "inline-block", padding: "3px 8px", borderRadius: 6,
                        fontSize: isMobile ? 11 : 12,
                        fontWeight: isValueSameAs24h ? 700 : 500,
                        background: stock.change24h > 0 ? "rgba(34,197,94,0.12)" : stock.change24h < 0 ? "rgba(239,68,68,0.12)" : "rgba(148,163,184,0.08)",
                        color: changeColor(stock.change24h),
                        whiteSpace: "nowrap", fontFamily: "var(--font-mono)",
                      }}>
                        {changeFmt(stock.change24h)}
                      </span>
                    </td>

                    {/* Ranking Value (highlighted) */}
                    <td style={{
                      padding: PAD, textAlign: "right",
                      fontWeight: 700,
                      fontSize: isMobile ? 12 : 14,
                      fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)",
                      whiteSpace: "nowrap",
                      color: getValueColor(ranking.valueFormat, stock[ranking.valueKey], theme),
                    }}>
                      {formatValue(stock[ranking.valueKey], ranking.valueFormat)}
                    </td>

                    {/* Volume */}
                    {!isMobile && (
                      <td style={{
                        padding: PAD, textAlign: "right",
                        color: theme.textSecondary, fontSize: 12,
                        fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)",
                        whiteSpace: "nowrap",
                      }}>
                        {fmtVolume(stock.volume, stock.close)}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Show more / less */}
      {rankedStocks.length > INITIAL_SHOW && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button
            onClick={() => setShowAll(prev => !prev)}
            style={{
              background: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: 8,
              padding: "10px 24px",
              color: theme.textSecondary,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "var(--font-ui)",
              transition: "all 0.15s",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.textBright; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSecondary; }}
          >
            {showAll ? (
              <>Pokaż mniej <Icon name="chevron-up" size={14} /></>
            ) : (
              <>Pokaż więcej ({rankedStocks.length - INITIAL_SHOW} spółek) <Icon name="chevron-down" size={14} /></>
            )}
          </button>
        </div>
      )}

      {/* Related rankings */}
      {relatedRankings.length > 0 && (
        <div style={{ marginTop: isMobile ? 32 : 48 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.05em", color: theme.textMuted,
            marginBottom: 12,
          }}>
            Powiązane rankingi
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {relatedRankings.map(r => (
              <Link
                key={r.slug}
                to={`/rankingi/${r.slug}`}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 20,
                  background: theme.bgCardAlt || theme.bgElevated || "rgba(255,255,255,0.05)",
                  border: `1px solid ${theme.border}`,
                  color: theme.textSecondary,
                  fontSize: 13, fontFamily: "var(--font-ui)",
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.textBright; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSecondary; }}
              >
                <Icon name={r.icon} size={14} />
                {r.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{
        marginTop: 32, padding: "12px 16px", borderRadius: 8,
        background: "rgba(148,163,184,0.06)",
        fontSize: 12, color: theme.textMuted, lineHeight: 1.5,
        fontStyle: "italic",
      }}>
        Nie stanowi rekomendacji inwestycyjnej. Dane aktualizowane automatycznie na podstawie notowań GPW.
      </div>
    </div>
  );
}

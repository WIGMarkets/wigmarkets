import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { RANKINGS, buildRankingData, applyRanking } from "../data/rankings.js";
import { GPW_COMPANIES } from "../data/gpw-companies.js";
import { fmt, changeFmt, changeColor, fmtCap, fmtVolume } from "../lib/formatters.js";
import Icon from "../components/edukacja/Icon.jsx";

const INDEX_MAP = Object.fromEntries(GPW_COMPANIES.map(c => [c.ticker, c.index]));

function formatRankingValue(value, format) {
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

function RankingCard({ ranking, stocks, theme, onClick }) {
  const top3 = stocks.slice(0, 3);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: theme.bgCard,
        border: `1px solid ${hovered ? theme.borderHover || theme.accent + "40" : theme.border}`,
        borderRadius: 12,
        padding: 20,
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.15)" : "none",
      }}
    >
      {/* Icon + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: `${theme.accent}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name={ranking.icon} size={18} style={{ color: theme.accent }} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: theme.textBright, fontFamily: "var(--font-ui)" }}>
          {ranking.title}
        </div>
      </div>

      {/* Top 3 preview */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {top3.length === 0 && (
          <div style={{ fontSize: 13, color: theme.textMuted, fontStyle: "italic" }}>Brak danych</div>
        )}
        {top3.map((stock, i) => (
          <div key={stock.ticker} style={{
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 13,
          }}>
            <span style={{
              width: 20, textAlign: "center",
              color: theme.textMuted, fontSize: 12,
              fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums",
            }}>
              {i + 1}.
            </span>
            <span style={{
              fontWeight: 500, color: theme.textBright,
              fontFamily: "var(--font-ui)", minWidth: 40,
            }}>
              {stock.ticker}
            </span>
            <span style={{
              marginLeft: "auto",
              fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums",
              fontWeight: 600, fontSize: 13,
              color: getValueColor(ranking.valueFormat, stock[ranking.valueKey], theme),
            }}>
              {formatRankingValue(stock[ranking.valueKey], ranking.valueFormat)}
            </span>
          </div>
        ))}
      </div>

      {/* "Zobacz pełny →" */}
      <div style={{
        fontSize: 13, color: hovered ? theme.textBright : theme.textMuted,
        transition: "color 0.15s",
        display: "flex", alignItems: "center", gap: 4,
      }}>
        Zobacz pełny ranking
        <Icon name="arrow-right" size={14} />
      </div>
    </div>
  );
}

export default function RankingsPage({ theme, liveStocks, prices, changes }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    document.title = "Rankingi GPW — WIGmarkets.pl";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Automatycznie aktualizowane rankingi spółek na Giełdzie Papierów Wartościowych. Wzrosty, spadki, dywidendy, kapitalizacja i więcej.");
  }, []);

  const enrichedStocks = useMemo(
    () => buildRankingData(liveStocks, prices, changes, INDEX_MAP),
    [liveStocks, prices, changes]
  );

  const rankingsWithData = useMemo(
    () => RANKINGS.map(r => ({
      ranking: r,
      stocks: applyRanking(r, enrichedStocks),
    })),
    [enrichedStocks]
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "24px 12px 48px" : "32px 24px 64px" }}>
      {/* Header */}
      <div style={{ marginBottom: isMobile ? 24 : 36 }}>
        <h1 style={{
          fontSize: isMobile ? 24 : 30, fontWeight: 700,
          color: theme.textBright, margin: 0, marginBottom: 8,
          fontFamily: "var(--font-ui)",
        }}>
          Rankingi GPW
        </h1>
        <p style={{
          fontSize: 14, color: theme.textSecondary, margin: 0,
          maxWidth: 520, lineHeight: 1.5,
        }}>
          Automatycznie aktualizowane rankingi spółek na Giełdzie Papierów Wartościowych
        </p>
      </div>

      {/* Grid of ranking cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? 12 : 16,
      }}>
        {rankingsWithData.map(({ ranking, stocks }) => (
          <RankingCard
            key={ranking.slug}
            ranking={ranking}
            stocks={stocks}
            theme={theme}
            onClick={() => navigate(`/rankingi/${ranking.slug}`)}
          />
        ))}
      </div>
    </div>
  );
}

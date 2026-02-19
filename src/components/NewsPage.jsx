import { useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { NEWS } from "../data/news.js";
import { STOCKS, COMMODITIES } from "../data/stocks.js";

const ALL_INSTRUMENTS = [...STOCKS, ...COMMODITIES];

const PERIODS = [
  { key: "dzis",    label: "Dziś" },
  { key: "tydzien", label: "Ten tydzień" },
  { key: "miesiac", label: "Ten miesiąc" },
];

function TickerChip({ ticker, theme, onSelect }) {
  const instrument = ALL_INSTRUMENTS.find(s => s.ticker === ticker);
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onClick={() => instrument && onSelect(instrument)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: hovered ? theme.accent + "22" : theme.bgCardAlt ?? theme.bgPage,
        border: `1px solid ${hovered ? theme.accent : theme.border}`,
        color: hovered ? theme.accent : theme.textSecondary,
        borderRadius: 6,
        padding: "2px 8px",
        fontSize: 11,
        fontWeight: 700,
        cursor: instrument ? "pointer" : "default",
        transition: "all 0.15s",
        letterSpacing: "0.03em",
      }}
    >
      {ticker}
      {instrument && <span style={{ opacity: 0.6, fontSize: 10 }}>↗</span>}
    </span>
  );
}

function NewsCard({ item, theme, onSelectStock }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      overflow: "hidden",
      cursor: "pointer",
    }}
      onClick={() => setExpanded(e => !e)}
    >
      {/* Image — full width when expanded, thumbnail when collapsed */}
      {expanded ? (
        <img
          src={item.image}
          alt=""
          style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
          loading="lazy"
        />
      ) : null}

      <div style={{ padding: "14px 18px" }}>
        {/* Header row: text + thumbnail */}
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.textBright, lineHeight: 1.4, marginBottom: 6 }}>
              {item.title}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: item.tickers.length ? 8 : 0 }}>
              <span style={{ fontSize: 11, color: theme.textSecondary }}>{item.date}</span>
              <span style={{ fontSize: 11, color: theme.textSecondary, opacity: 0.4 }}>·</span>
              <span style={{ fontSize: 11, color: theme.accent, fontWeight: 600 }}>{item.source}</span>
              <span style={{ marginLeft: "auto", fontSize: 12, color: theme.textSecondary }}>{expanded ? "▲" : "▼"}</span>
            </div>
            {/* Tickers */}
            {item.tickers.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                onClick={e => e.stopPropagation()}
              >
                {item.tickers.map(t => (
                  <TickerChip key={t} ticker={t} theme={theme} onSelect={onSelectStock} />
                ))}
              </div>
            )}
          </div>
          {/* Thumbnail — only when collapsed */}
          {!expanded && (
            <img
              src={item.image}
              alt=""
              style={{ width: 90, height: 62, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
              loading="lazy"
            />
          )}
        </div>

        {/* Expandable summary */}
        {expanded && (
          <div style={{
            fontSize: 13,
            color: theme.text,
            lineHeight: 1.7,
            borderTop: `1px solid ${theme.border}`,
            paddingTop: 12,
            marginTop: 12,
          }}>
            {item.summary}
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewsPage({ onBack, theme, onSelectStock }) {
  const isMobile = useIsMobile();
  const [activePeriod, setActivePeriod] = useState(null); // null = all

  const filtered = activePeriod
    ? NEWS.filter(n => n.period === activePeriod)
    : NEWS;

  // Group by period for "all" view
  const byPeriod = PERIODS.map(p => ({
    ...p,
    items: filtered.filter(n => n.period === p.key),
  })).filter(p => p.items.length > 0);

  return (
    <div style={{ minHeight: "100vh", background: theme.bgPage, color: theme.text, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: theme.bgCard,
        borderBottom: `1px solid ${theme.border}`,
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: `1px solid ${theme.border}`,
            color: theme.text,
            borderRadius: 8,
            padding: "6px 14px",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "inherit",
          }}
        >
          ← Powrót
        </button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: theme.textBright }}>Wiadomości rynkowe</div>
          <div style={{ fontSize: 11, color: theme.textSecondary }}>Najważniejsze informacje z rynku GPW</div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "16px 14px" : "28px 32px" }}>

        {/* Period filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          <button
            onClick={() => setActivePeriod(null)}
            style={{
              background: activePeriod === null ? theme.accent + "22" : "transparent",
              border: `1px solid ${activePeriod === null ? theme.accent : theme.border}`,
              color: activePeriod === null ? theme.accent : theme.textSecondary,
              borderRadius: 8,
              padding: "7px 16px",
              fontSize: 13,
              fontWeight: activePeriod === null ? 700 : 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Wszystkie
          </button>
          {PERIODS.map(p => (
            <button
              key={p.key}
              onClick={() => setActivePeriod(p.key)}
              style={{
                background: activePeriod === p.key ? theme.accent + "22" : "transparent",
                border: `1px solid ${activePeriod === p.key ? theme.accent : theme.border}`,
                color: activePeriod === p.key ? theme.accent : theme.textSecondary,
                borderRadius: 8,
                padding: "7px 16px",
                fontSize: 13,
                fontWeight: activePeriod === p.key ? 700 : 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* News grouped by period */}
        {byPeriod.map(group => (
          <div key={group.key} style={{ marginBottom: 32 }}>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: theme.textSecondary,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              {group.label}
              <span style={{ height: 1, flex: 1, background: theme.border, display: "inline-block" }} />
              <span style={{ opacity: 0.5 }}>{group.items.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {group.items.map(item => (
                <NewsCard key={item.id} item={item} theme={theme} onSelectStock={onSelectStock} />
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

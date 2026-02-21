import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { fetchMarketNews } from "../lib/api.js";
import Icon from "./edukacja/Icon.jsx";

const PERIODS = [
  { key: "dzis",    label: "Dziś" },
  { key: "tydzien", label: "Ten tydzień" },
  { key: "miesiac", label: "Ten miesiąc" },
];

function getPeriod(pubDate) {
  const d = new Date(pubDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const articleDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = (today - articleDay) / 86400000;
  if (diffDays < 1) return "dzis";
  if (diffDays < 7) return "tydzien";
  return "miesiac";
}

function NewsCard({ item, theme }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "block",
        textDecoration: "none",
        background: theme.bgCard,
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "14px 18px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: theme.textBright, lineHeight: 1.4, marginBottom: 6 }}>
          {item.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: theme.textSecondary }}>
            {item.pubDate ? new Date(item.pubDate).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" }) : ""}
          </span>
          {item.source && (
            <>
              <span style={{ fontSize: 11, color: theme.textSecondary, opacity: 0.4 }}>·</span>
              <span style={{ fontSize: 11, color: theme.accent, fontWeight: 600 }}>{item.source}</span>
            </>
          )}
          <span style={{ marginLeft: "auto" }}><Icon name="external-link" size={12} color={theme.textSecondary} /></span>
        </div>
      </div>
    </a>
  );
}

export default function NewsPage({ theme }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activePeriod, setActivePeriod] = useState(null);
  const [news, setNews] = useState(null);

  useEffect(() => {
    fetchMarketNews().then(d => setNews(d?.items || []));
  }, []);

  const enriched = (news || []).map(item => ({
    ...item,
    period: getPeriod(item.pubDate),
  }));

  const filtered = activePeriod
    ? enriched.filter(n => n.period === activePeriod)
    : enriched;

  const byPeriod = PERIODS.map(p => ({
    ...p,
    items: filtered.filter(n => n.period === p.key),
  })).filter(p => p.items.length > 0);

  return (
    <div style={{ color: theme.text, fontFamily: "var(--font-ui)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "16px 14px" : "28px 32px" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: theme.textBright, margin: "0 0 4px" }}>Wiadomości rynkowe</h1>
          <p style={{ fontSize: 13, color: theme.textSecondary, margin: 0 }}>Najważniejsze informacje z rynku GPW</p>
        </div>

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

        {news === null && (
          <div style={{ color: theme.textSecondary, fontSize: 13, padding: "32px 0", textAlign: "center" }}>
            Ładowanie wiadomości...
          </div>
        )}

        {news !== null && filtered.length === 0 && (
          <div style={{ color: theme.textSecondary, fontSize: 13, padding: "32px 0", textAlign: "center" }}>
            {activePeriod ? "Brak wiadomości z tego okresu." : "Brak wiadomości."}
          </div>
        )}

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
              {group.items.map((item, i) => (
                <NewsCard key={i} item={item} theme={theme} />
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

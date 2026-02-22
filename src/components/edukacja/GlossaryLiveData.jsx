import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import { fetchDynamicList, fetchFearGreed, fetchHistory } from "../../lib/api.js";
import { fmt, fmtCap, fmtVolume, changeColor, changeFmt, calculateRSI } from "../../lib/formatters.js";
import Icon from "./Icon.jsx";

const DATA_CONFIGS = {
  pe: {
    title: "Spółki GPW wg P/E",
    description: "Top 5 najtańszych spółek po wskaźniku cena/zysk",
    link: null,
    columns: ["Spółka", "P/E", "Cena"],
    fetch: async () => {
      const data = await fetchDynamicList();
      if (!data) return null;
      const { stocks, quotes } = data;
      const withPE = stocks
        .filter(s => s.pe && s.pe > 0 && quotes[s.ticker])
        .map(s => ({ ticker: s.ticker, name: s.name, pe: s.pe, price: quotes[s.ticker].close }))
        .sort((a, b) => a.pe - b.pe)
        .slice(0, 5);
      return withPE.map(s => ({
        label: s.ticker,
        sublabel: s.name,
        cols: [`${fmt(s.pe, 1)}x`, `${fmt(s.price)} zł`],
        href: `/spolka/${s.ticker}`,
      }));
    },
  },
  dividend: {
    title: "Najwyższe stopy dywidendy",
    description: "Top 5 spółek GPW wg stopy dywidendy",
    link: { label: "Kalendarz dywidend →", href: "/dywidendy" },
    columns: ["Spółka", "Stopa dyw.", "Cena"],
    fetch: async () => {
      const data = await fetchDynamicList();
      if (!data) return null;
      const { stocks, quotes } = data;
      const withDiv = stocks
        .filter(s => s.div && s.div > 0 && quotes[s.ticker])
        .map(s => ({ ticker: s.ticker, name: s.name, div: s.div, price: quotes[s.ticker].close }))
        .sort((a, b) => b.div - a.div)
        .slice(0, 5);
      return withDiv.map(s => ({
        label: s.ticker,
        sublabel: s.name,
        cols: [`${fmt(s.div, 1)}%`, `${fmt(s.price)} zł`],
        href: `/spolka/${s.ticker}`,
        highlight: s.div > 7 ? "#f59e0b" : "#22c55e",
      }));
    },
  },
  "market-cap": {
    title: "Największe spółki GPW",
    description: "Top 5 wg kapitalizacji rynkowej",
    link: null,
    columns: ["Spółka", "Kap. rynkowa", "Zmiana 24h"],
    fetch: async () => {
      const data = await fetchDynamicList();
      if (!data) return null;
      const { stocks, quotes } = data;
      const withCap = stocks
        .filter(s => s.cap && s.cap > 0 && quotes[s.ticker])
        .map(s => ({
          ticker: s.ticker, name: s.name, cap: s.cap,
          change: quotes[s.ticker].change24h,
        }))
        .sort((a, b) => b.cap - a.cap)
        .slice(0, 5);
      return withCap.map(s => ({
        label: s.ticker,
        sublabel: s.name,
        cols: [fmtCap(s.cap), changeFmt(s.change)],
        colColors: [null, changeColor(s.change)],
        href: `/spolka/${s.ticker}`,
      }));
    },
  },
  volume: {
    title: "Najbardziej aktywne dziś",
    description: "Top 3 spółek wg wartości obrotu",
    link: null,
    columns: ["Spółka", "Obrót", "Zmiana"],
    fetch: async () => {
      const data = await fetchDynamicList();
      if (!data) return null;
      const { stocks, quotes } = data;
      const withVol = stocks
        .filter(s => quotes[s.ticker] && quotes[s.ticker].volume > 0)
        .map(s => ({
          ticker: s.ticker, name: s.name,
          volume: quotes[s.ticker].volume,
          price: quotes[s.ticker].close,
          change: quotes[s.ticker].change24h,
        }))
        .sort((a, b) => (b.volume * b.price) - (a.volume * a.price))
        .slice(0, 3);
      return withVol.map(s => ({
        label: s.ticker,
        sublabel: s.name,
        cols: [fmtVolume(s.volume, s.price), changeFmt(s.change)],
        colColors: [null, changeColor(s.change)],
        href: `/spolka/${s.ticker}`,
      }));
    },
  },
  "fear-greed": {
    title: "Fear & Greed Index",
    description: "Aktualny sentyment rynku GPW",
    link: { label: "Pełny indeks F&G →", href: "/fear-greed" },
    columns: null,
    fetch: async () => {
      const data = await fetchFearGreed();
      if (!data?.current) return null;
      return {
        type: "gauge",
        value: data.current.value,
        label: data.current.label,
        color: data.current.color,
        yesterday: data.historical?.yesterday,
        weekAgo: data.historical?.weekAgo,
      };
    },
  },
  rsi: {
    title: "Sygnały RSI (14)",
    description: "Spółki wykupione (>70) i wyprzedane (<30)",
    link: null,
    columns: ["Spółka", "RSI", "Sygnał"],
    fetch: async () => {
      const screener = await fetchDynamicList();
      if (!screener) return null;
      const { stocks, quotes } = screener;
      // Pick top 20 by volume to calculate RSI for
      const top = stocks
        .filter(s => quotes[s.ticker] && quotes[s.ticker].volume > 0)
        .sort((a, b) => {
          const volA = (quotes[a.ticker].volume || 0) * (quotes[a.ticker].close || 0);
          const volB = (quotes[b.ticker].volume || 0) * (quotes[b.ticker].close || 0);
          return volB - volA;
        })
        .slice(0, 20);

      const results = await Promise.all(
        top.map(async (s) => {
          const hist = await fetchHistory(s.stooq);
          if (!hist?.prices) return null;
          const rsi = calculateRSI(hist.prices);
          if (rsi === null) return null;
          return { ticker: s.ticker, name: s.name, rsi, stooq: s.stooq };
        })
      );

      const valid = results.filter(Boolean);
      const overbought = valid.filter(s => s.rsi > 70).sort((a, b) => b.rsi - a.rsi).slice(0, 3);
      const oversold = valid.filter(s => s.rsi < 30).sort((a, b) => a.rsi - b.rsi).slice(0, 3);
      const combined = [
        ...overbought.map(s => ({
          label: s.ticker,
          sublabel: s.name,
          cols: [fmt(s.rsi, 1), "Wykupiony"],
          colColors: ["#ef4444", "#ef4444"],
          href: `/spolka/${s.ticker}`,
        })),
        ...oversold.map(s => ({
          label: s.ticker,
          sublabel: s.name,
          cols: [fmt(s.rsi, 1), "Wyprzedany"],
          colColors: ["#22c55e", "#22c55e"],
          href: `/spolka/${s.ticker}`,
        })),
      ];
      if (combined.length === 0) return "empty";
      return combined;
    },
  },
};

function LiveBadge({ theme }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 8px", borderRadius: 6,
      fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
      textTransform: "uppercase",
      background: `${theme.green}18`,
      color: theme.green,
      fontFamily: "var(--font-ui)",
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: theme.green,
        animation: "glossaryLivePulse 2s ease-in-out infinite",
      }} />
      Live
    </span>
  );
}

function MiniGauge({ value, label, color, yesterday, weekAgo, theme }) {
  const isMobile = useIsMobile();
  const angle = (value / 100) * 180 - 90;

  return (
    <div style={{ textAlign: "center", padding: isMobile ? "8px 0" : "12px 0" }}>
      {/* Gauge arc */}
      <div style={{ position: "relative", width: 140, height: 80, margin: "0 auto 12px" }}>
        <svg viewBox="0 0 140 80" width="140" height="80">
          {/* Background arc */}
          <path
            d="M 10 75 A 60 60 0 0 1 130 75"
            fill="none" stroke={theme.border} strokeWidth="8" strokeLinecap="round"
          />
          {/* Colored arc */}
          <path
            d="M 10 75 A 60 60 0 0 1 130 75"
            fill="none" stroke={color || theme.accent} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${(value / 100) * 188} 188`}
          />
        </svg>
        {/* Needle */}
        <div style={{
          position: "absolute", bottom: 5, left: "50%",
          width: 2, height: 40,
          background: theme.textBright,
          transformOrigin: "bottom center",
          transform: `translateX(-50%) rotate(${angle}deg)`,
          borderRadius: 2,
          transition: "transform 0.6s ease",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: 8, height: 8, borderRadius: "50%", background: theme.textBright,
        }} />
      </div>
      {/* Value */}
      <div style={{
        fontSize: 28, fontWeight: 800, color: color || theme.textBright,
        fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums",
        lineHeight: 1.2,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginTop: 2 }}>
        {label}
      </div>
      {/* Historical comparison */}
      {(yesterday != null || weekAgo != null) && (
        <div style={{
          display: "flex", justifyContent: "center", gap: 16,
          marginTop: 10, fontSize: 12, color: theme.textMuted,
        }}>
          {yesterday != null && <span>Wczoraj: <b style={{ color: theme.textSecondary }}>{yesterday}</b></span>}
          {weekAgo != null && <span>Tydzień temu: <b style={{ color: theme.textSecondary }}>{weekAgo}</b></span>}
        </div>
      )}
    </div>
  );
}

export default function GlossaryLiveData({ liveDataType, theme }) {
  const config = DATA_CONFIGS[liveDataType];
  if (!config) return null;

  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    config.fetch().then(result => {
      if (cancelled) return;
      if (!result) { setError(true); setLoading(false); return; }
      setData(result);
      setLoading(false);
    }).catch(() => {
      if (!cancelled) { setError(true); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [liveDataType]);

  const isGauge = data?.type === "gauge";
  const isEmpty = data === "empty";
  const rows = !isGauge && !isEmpty && Array.isArray(data) ? data : [];

  return (
    <>
      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes glossaryLivePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
      <div style={{
        background: theme.bgElevated,
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        padding: isMobile ? 16 : 20,
        marginBottom: 32,
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 14,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.1em", color: theme.accent,
            fontFamily: "var(--font-ui)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Icon name="activity" size={14} />
            {config.title}
          </div>
          <LiveBadge theme={theme} />
        </div>

        {/* Description */}
        <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 16 }}>
          {config.description}
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ padding: "24px 0", textAlign: "center" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                height: 36, borderRadius: 8,
                background: theme.bgCard,
                marginBottom: 8,
                animation: "glossaryLivePulse 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }} />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div style={{
            padding: "20px 0", textAlign: "center",
            fontSize: 13, color: theme.textMuted,
          }}>
            Dane tymczasowo niedostępne
          </div>
        )}

        {/* Empty state (RSI) */}
        {!loading && !error && isEmpty && (
          <div style={{
            padding: "20px 0", textAlign: "center",
            fontSize: 13, color: theme.textMuted,
          }}>
            Brak spółek z ekstremalnym RSI — rynek w równowadze
          </div>
        )}

        {/* Gauge (Fear & Greed) */}
        {!loading && !error && isGauge && (
          <MiniGauge
            value={data.value}
            label={data.label}
            color={data.color}
            yesterday={data.yesterday}
            weekAgo={data.weekAgo}
            theme={theme}
          />
        )}

        {/* Table rows */}
        {!loading && !error && rows.length > 0 && (
          <div>
            {/* Column headers */}
            {config.columns && (
              <div style={{
                display: "grid",
                gridTemplateColumns: `1fr ${config.columns.slice(1).map(() => "auto").join(" ")}`,
                gap: 8,
                padding: "0 12px 8px",
                borderBottom: `1px solid ${theme.border}`,
                marginBottom: 4,
              }}>
                {config.columns.map((col, i) => (
                  <div key={col} style={{
                    fontSize: 10, fontWeight: 600, textTransform: "uppercase",
                    letterSpacing: "0.08em", color: theme.textMuted,
                    textAlign: i === 0 ? "left" : "right",
                    fontFamily: "var(--font-ui)",
                    minWidth: i > 0 ? 72 : undefined,
                  }}>
                    {col}
                  </div>
                ))}
              </div>
            )}
            {/* Data rows */}
            {rows.map((row, idx) => (
              <div
                key={idx}
                onClick={() => row.href && navigate(row.href)}
                style={{
                  display: "grid",
                  gridTemplateColumns: `1fr ${(config.columns || []).slice(1).map(() => "auto").join(" ")}`,
                  gap: 8,
                  padding: "10px 12px",
                  borderRadius: 8,
                  cursor: row.href ? "pointer" : "default",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = theme.bgHover; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ minWidth: 0 }}>
                  <span style={{
                    fontSize: 14, fontWeight: 600, color: theme.textBright,
                    fontFamily: "var(--font-mono)",
                  }}>
                    {row.label}
                  </span>
                  {row.sublabel && (
                    <span style={{
                      fontSize: 12, color: theme.textMuted,
                      marginLeft: 8, fontFamily: "var(--font-ui)",
                    }}>
                      {row.sublabel.length > 18 ? row.sublabel.slice(0, 18) + "…" : row.sublabel}
                    </span>
                  )}
                </div>
                {row.cols && row.cols.map((val, ci) => (
                  <div key={ci} style={{
                    fontSize: 13, fontWeight: 600, textAlign: "right",
                    color: row.colColors?.[ci] || row.highlight || theme.textSecondary,
                    fontFamily: "var(--font-mono)",
                    fontVariantNumeric: "tabular-nums",
                    minWidth: 72,
                    whiteSpace: "nowrap",
                  }}>
                    {val}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Link to related page */}
        {!loading && !error && config.link && (
          <div
            onClick={() => navigate(config.link.href)}
            style={{
              marginTop: 14, paddingTop: 12,
              borderTop: `1px solid ${theme.border}`,
              textAlign: "center", fontSize: 13, fontWeight: 600,
              color: theme.accent, cursor: "pointer",
              fontFamily: "var(--font-ui)",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.8"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >
            {config.link.label}
          </div>
        )}
      </div>
    </>
  );
}

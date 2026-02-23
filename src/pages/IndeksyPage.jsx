import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchIndices, fetchBulk } from "../lib/api.js";
import { INDICES_META, INDICES_BY_NAME } from "../data/indices-meta.js";

// ── Formatters ─────────────────────────────────────────────────────

const fmtVal = v =>
  v != null
    ? v.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "—";

const fmtChange = v =>
  v != null ? `${v >= 0 ? "+" : ""}${v.toFixed(2)}%` : null;

const fmtTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
};

// ── localStorage cache helpers ─────────────────────────────────────

const CACHE_KEY_GPW = "wm_idx_gpw";
const CACHE_KEY_WORLD = "wm_idx_world";
const CACHE_TTL = 2 * 60 * 1000;

function cacheGet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch { return null; }
}

function cacheSet(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch {}
}

// ── Mini sparkline SVG ─────────────────────────────────────────────

function MiniSpark({ prices, trend, height = 72, id }) {
  const color = (trend ?? 0) >= 0 ? "#22c55e" : "#ef4444";
  const { linePath, areaPath } = useMemo(() => {
    if (!prices || prices.length < 2) return { linePath: "", areaPath: "" };
    const vals = prices.map(p => typeof p === "number" ? p : p.close).filter(v => v != null && !isNaN(v));
    if (vals.length < 2) return { linePath: "", areaPath: "" };
    const min = Math.min(...vals), max = Math.max(...vals);
    const range = max - min || 1;
    const pts = vals.map((v, i) => [(i / (vals.length - 1)) * 100, 95 - ((v - min) / range) * 85]);
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
    return { linePath: line, areaPath: `${line} L100,100 L0,100 Z` };
  }, [prices]);

  if (!linePath) return <div style={{ height }} />;
  return (
    <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: "block", marginTop: 14 }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${id})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// ── LIVE badge ─────────────────────────────────────────────────────

function LiveBadge() {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontSize: 11, fontWeight: 700, color: "#22c55e",
      background: "rgba(34,197,94,0.1)", padding: "3px 10px",
      borderRadius: 6, fontFamily: "var(--font-mono)",
      letterSpacing: "0.06em", textTransform: "uppercase",
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%",
        background: "#22c55e",
        boxShadow: "0 0 6px #22c55e",
        animation: "livePulse 1.5s ease-in-out infinite",
      }} />
      LIVE
    </span>
  );
}

// ── Main page component ────────────────────────────────────────────

const WORLD_DEFS = [
  { name: "S&P 500",    stooq: "sp500"  },
  { name: "NASDAQ",     stooq: "nasdaq" },
  { name: "Dow Jones",  stooq: "djia"   },
  { name: "DAX",        stooq: "dax"    },
  { name: "FTSE 100",   stooq: "ftse"   },
  { name: "CAC 40",     stooq: "cac40"  },
  { name: "Nikkei 225", stooq: "nikkei" },
  { name: "Hang Seng",  stooq: "hsi"    },
];

export default function IndeksyPage({ theme, indices: propIndices, worldIndices: propWorldIndices }) {
  const navigate = useNavigate();
  const [gpwIndices, setGpwIndices] = useState(() => cacheGet(CACHE_KEY_GPW) || propIndices || []);
  const [worldIndices, setWorldIndices] = useState(() => cacheGet(CACHE_KEY_WORLD) || propWorldIndices || []);
  const [lastUpdate, setLastUpdate] = useState(fmtTime);
  const [flashCards, setFlashCards] = useState(new Set());
  const prevGpw = useRef(gpwIndices);
  const prevWorld = useRef(worldIndices);

  // Sync from parent props on mount
  useEffect(() => {
    if (propIndices?.length) { setGpwIndices(propIndices); cacheSet(CACHE_KEY_GPW, propIndices); }
    if (propWorldIndices?.length) { setWorldIndices(propWorldIndices); cacheSet(CACHE_KEY_WORLD, propWorldIndices); }
  }, [propIndices, propWorldIndices]);

  // Flash detection helper
  const detectChanges = useCallback((prev, next) => {
    const changed = new Set();
    for (const idx of next) {
      const old = prev.find(o => o.name === idx.name);
      if (old && old.value !== idx.value && idx.value != null) {
        changed.add(idx.name);
      }
    }
    return changed;
  }, []);

  // Load GPW indices
  const loadGpw = useCallback(async () => {
    const data = await fetchIndices();
    if (data.length > 0) {
      const changed = detectChanges(prevGpw.current, data);
      prevGpw.current = data;
      setGpwIndices(data);
      cacheSet(CACHE_KEY_GPW, data);
      setLastUpdate(fmtTime());
      if (changed.size > 0) {
        setFlashCards(prev => new Set([...prev, ...changed]));
        setTimeout(() => setFlashCards(prev => {
          const next = new Set(prev);
          for (const c of changed) next.delete(c);
          return next;
        }), 500);
      }
    }
  }, [detectChanges]);

  // Load world indices
  const loadWorld = useCallback(async () => {
    const symbols = WORLD_DEFS.map(d => d.stooq);
    const bulk = await fetchBulk(symbols);
    const built = WORLD_DEFS.map(({ name, stooq }) => {
      const d = bulk[stooq];
      if (!d?.close) return { name, value: null, change24h: null, sparkline: [] };
      return {
        name, value: d.close, change24h: d.change24h ?? null,
        sparkline: (d.sparkline || []).map(c => ({ close: c })),
      };
    });
    if (built.some(i => i.value !== null)) {
      const changed = detectChanges(prevWorld.current, built);
      prevWorld.current = built;
      setWorldIndices(built);
      cacheSet(CACHE_KEY_WORLD, built);
      setLastUpdate(fmtTime());
      if (changed.size > 0) {
        setFlashCards(prev => new Set([...prev, ...changed]));
        setTimeout(() => setFlashCards(prev => {
          const next = new Set(prev);
          for (const c of changed) next.delete(c);
          return next;
        }), 500);
      }
    }
  }, [detectChanges]);

  // Auto-refresh every 60s
  useEffect(() => {
    loadGpw();
    loadWorld();
    const interval = setInterval(() => { loadGpw(); loadWorld(); }, 60_000);
    return () => clearInterval(interval);
  }, [loadGpw, loadWorld]);

  // SEO
  useEffect(() => {
    document.title = "Indeksy giełdowe — GPW i światowe — WIGmarkets.pl";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Notowania indeksów giełdowych w czasie rzeczywistym: WIG20, WIG, mWIG40, sWIG80, S&P 500, DAX, NASDAQ i więcej.");
  }, []);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const renderCard = (idx, i, accentColor) => {
    const meta = INDICES_BY_NAME[idx.name];
    const ch24 = idx.change24h;
    const c24 = ch24 == null ? theme.textSecondary : ch24 >= 0 ? "#22c55e" : "#ef4444";
    const isFlashing = flashCards.has(idx.name);
    const slug = meta?.slug;

    return (
      <div
        key={idx.name}
        onClick={() => slug && navigate(`/indeksy/${slug}`)}
        style={{
          background: theme.bgCard,
          border: `1px solid ${isFlashing ? accentColor : theme.border}`,
          borderTop: `3px solid ${accentColor}`,
          borderRadius: 12,
          padding: isMobile ? "14px 14px 12px" : "22px 24px 18px",
          animation: "idxCardIn 0.35s ease both",
          animationDelay: `${i * 60}ms`,
          minWidth: 0, overflow: "hidden",
          cursor: slug ? "pointer" : "default",
          transition: "border-color 0.3s, transform 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {meta?.country && (
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", color: accentColor, background: `${accentColor}18`, borderRadius: 4, padding: "2px 5px", fontFamily: "var(--font-mono)" }}>{meta.country}</span>
          )}
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: accentColor, fontFamily: "var(--font-ui)" }}>
            {idx.name}
          </span>
        </div>

        {idx.value != null ? (
          <>
            <div style={{
              fontSize: isMobile ? 18 : 26, fontWeight: 800,
              color: theme.textBright, fontFamily: "var(--font-mono)",
              fontVariantNumeric: "tabular-nums", lineHeight: 1.15,
              marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {fmtVal(idx.value)}
            </div>
            {ch24 != null && (
              <div style={{ marginTop: 8 }}>
                <span style={{
                  display: "inline-block", padding: "3px 8px", borderRadius: 6,
                  fontSize: isMobile ? 11 : 13, fontWeight: 700,
                  background: ch24 >= 0 ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                  color: c24, fontFamily: "var(--font-mono)",
                }}>
                  {ch24 >= 0 ? "\u25B2" : "\u25BC"} {fmtChange(ch24)}
                </span>
              </div>
            )}
            <MiniSpark
              prices={idx.sparkline}
              trend={ch24}
              height={isMobile ? 48 : 72}
              id={`idxp_${idx.name.replace(/\s+/g, "_")}`}
            />
          </>
        ) : (
          <div style={{ color: theme.textMuted, fontSize: 13, marginTop: 12, fontFamily: "var(--font-ui)" }}>
            Brak danych
          </div>
        )}
      </div>
    );
  };

  const REGIONS = [
    { key: "gpw", title: "Indeksy GPW", subtitle: "Główne indeksy Giełdy Papierów Wartościowych w Warszawie", data: gpwIndices, color: "#3b82f6" },
    { key: "usa", title: "Indeksy amerykańskie", subtitle: "Wall Street — najważniejsze indeksy giełdowe USA", data: worldIndices.filter(i => ["S&P 500", "NASDAQ", "Dow Jones"].includes(i.name)), color: "#8b5cf6" },
    { key: "eu", title: "Indeksy europejskie", subtitle: "Główne giełdy Europy — Frankfurt, Londyn, Paryż", data: worldIndices.filter(i => ["DAX", "FTSE 100", "CAC 40"].includes(i.name)), color: "#f59e0b" },
    { key: "asia", title: "Indeksy azjatyckie", subtitle: "Rynki Azji-Pacyfiku — Tokio, Hongkong", data: worldIndices.filter(i => ["Nikkei 225", "Hang Seng"].includes(i.name)), color: "#ec4899" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "16px 12px 40px" : "24px 24px 64px" }}>
      <style>{`
        @keyframes idxCardIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes livePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: theme.textBright, margin: 0, fontFamily: "var(--font-ui)" }}>
            Indeksy giełdowe
          </h1>
          <LiveBadge />
        </div>
        <p style={{ fontSize: 13, color: theme.textSecondary, margin: "6px 0 0", fontFamily: "var(--font-ui)" }}>
          Notowania indeksów GPW i rynków światowych w czasie rzeczywistym · Ostatnia aktualizacja: {lastUpdate}
        </p>
      </div>

      {/* Sections */}
      {REGIONS.map(({ key, title, subtitle, data, color: regionColor }) => {
        if (!data || data.length === 0) return null;
        return (
          <div key={key} style={{ marginBottom: 40 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: theme.textBright, margin: 0, fontFamily: "var(--font-ui)" }}>
                  {title}
                </h2>
                {key === "gpw" && <LiveBadge />}
              </div>
              <p style={{ fontSize: 12, color: theme.textSecondary, margin: "4px 0 0", fontFamily: "var(--font-ui)" }}>
                {subtitle}
              </p>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : `repeat(${Math.min(data.length, 4)}, 1fr)`,
              gap: isMobile ? 10 : 16,
            }}>
              {data.map((idx, i) => {
                const meta = INDICES_BY_NAME[idx.name];
                return renderCard(idx, i, meta?.color || regionColor);
              })}
            </div>
          </div>
        );
      })}

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Indeksy giełdowe — GPW i światowe",
            "description": "Notowania indeksów giełdowych w czasie rzeczywistym: WIG20, WIG, mWIG40, sWIG80, S&P 500, DAX, NASDAQ.",
            "url": "https://wigmarkets.pl/indeksy",
          }),
        }}
      />
    </div>
  );
}

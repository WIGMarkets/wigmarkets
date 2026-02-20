import { useState, useMemo } from "react";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { DIVIDENDS, MONTHS_PL } from "../data/dividends.js";
import { fmt } from "../utils.js";
import Icon from "./edukacja/Icon.jsx";
import CompanyMonogram from "./CompanyMonogram.jsx";

// ─── Helpers ───────────────────────────────────────────────────────
function parseDate(d) {
  return d ? new Date(d + "T00:00:00") : null;
}

function fmtDate(d) {
  if (!d) return "—";
  const dt = typeof d === "string" ? parseDate(d) : d;
  return dt.toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" });
}

function daysUntil(dateStr) {
  if (!dateStr) return Infinity;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = parseDate(dateStr);
  return Math.ceil((target - today) / 86400000);
}

function yieldColor(y, theme) {
  if (y >= 7) return "#22c55e";
  if (y >= 4) return theme.accent;
  if (y >= 2) return "#f0883e";
  return theme.textSecondary;
}

function streakBadge(streak) {
  if (streak >= 15) return { label: "Arystokrata", color: "#ffd700", bg: "rgba(255,215,0,0.12)" };
  if (streak >= 10) return { label: "Weteran", color: "#c084fc", bg: "rgba(192,132,252,0.12)" };
  if (streak >= 5) return { label: "Stabilna", color: "#22c55e", bg: "rgba(34,197,94,0.12)" };
  return null;
}

// Only dividends with valid dates (filter out placeholder entries)
function getActiveDividends() {
  return DIVIDENDS.filter(d => d.exDate && d.divPerShare > 0);
}

// ─── Sub-tabs ──────────────────────────────────────────────────────
const TABS = [
  { key: "kalendarz", label: "Kalendarz", icon: "calendar" },
  { key: "ranking", label: "Ranking", icon: "trending-up" },
  { key: "kalkulator", label: "Kalkulator", icon: "chart-bar" },
];

// ─── Calendar Tab ──────────────────────────────────────────────────
function CalendarView({ theme, isMobile, onSelectStock }) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showPast, setShowPast] = useState(false);

  const dividends = useMemo(() => {
    const all = getActiveDividends();
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return all
      .filter(d => showPast || parseDate(d.exDate) >= now)
      .sort((a, b) => parseDate(a.exDate) - parseDate(b.exDate));
  }, [showPast]);

  // Group by month
  const byMonth = useMemo(() => {
    const map = {};
    for (const d of dividends) {
      const dt = parseDate(d.exDate);
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
      if (!map[key]) map[key] = { key, year: dt.getFullYear(), month: dt.getMonth(), items: [] };
      map[key].items.push(d);
    }
    return Object.values(map).sort((a, b) => a.key.localeCompare(b.key));
  }, [dividends]);

  const visibleMonths = selectedMonth
    ? byMonth.filter(m => m.key === selectedMonth)
    : byMonth;

  return (
    <div>
      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 10 : 16, marginBottom: 24 }}>
        {[
          { label: "Nadchodzące", value: dividends.filter(d => daysUntil(d.exDate) > 0).length, icon: "calendar", color: theme.accent },
          { label: "Ten miesiąc", value: (() => { const now = new Date(); return dividends.filter(d => { const dt = parseDate(d.exDate); return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear(); }).length; })(), icon: "clock", color: "#f0883e" },
          { label: "Śr. stopa", value: fmt(dividends.length > 0 ? dividends.reduce((s, d) => s + d.divYield, 0) / dividends.length : 0, 1) + "%", icon: "trending-up", color: "#22c55e" },
          { label: "Najwyższa stopa", value: fmt(Math.max(0, ...dividends.map(d => d.divYield)), 1) + "%", icon: "target", color: "#ffd700" },
        ].map((s, i) => (
          <div key={i} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? "12px 14px" : "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Icon name={s.icon} size={16} color={s.color} />
              <span style={{ fontSize: 11, color: theme.textSecondary, fontWeight: 500 }}>{s.label}</span>
            </div>
            <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: theme.textBright, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{typeof s.value === "number" ? s.value : s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <button
          onClick={() => setSelectedMonth(null)}
          style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${!selectedMonth ? theme.accent : theme.borderInput}`, background: !selectedMonth ? `${theme.accent}18` : "transparent", color: !selectedMonth ? theme.accent : theme.textSecondary, fontSize: 12, fontWeight: !selectedMonth ? 600 : 400, cursor: "pointer", fontFamily: "var(--font-ui)" }}
        >Wszystkie</button>
        {byMonth.map(m => (
          <button
            key={m.key}
            onClick={() => setSelectedMonth(m.key === selectedMonth ? null : m.key)}
            style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${selectedMonth === m.key ? theme.accent : theme.borderInput}`, background: selectedMonth === m.key ? `${theme.accent}18` : "transparent", color: selectedMonth === m.key ? theme.accent : theme.textSecondary, fontSize: 12, fontWeight: selectedMonth === m.key ? 600 : 400, cursor: "pointer", fontFamily: "var(--font-ui)" }}
          >{MONTHS_PL[m.month]} {m.year !== new Date().getFullYear() ? m.year : ""}</button>
        ))}
        <label style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: theme.textSecondary, cursor: "pointer" }}>
          <input type="checkbox" checked={showPast} onChange={e => setShowPast(e.target.checked)} style={{ accentColor: theme.accent }} />
          Pokaż minione
        </label>
      </div>

      {/* Calendar entries */}
      {visibleMonths.length === 0 && (
        <div style={{ textAlign: "center", padding: 48, color: theme.textSecondary }}>
          <Icon name="calendar" size={36} color={theme.textMuted} />
          <div style={{ marginTop: 12, fontSize: 14 }}>Brak nadchodzących dywidend</div>
        </div>
      )}

      {visibleMonths.map(month => (
        <div key={month.key} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.textBright, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="calendar" size={16} color={theme.accent} />
            {MONTHS_PL[month.month]} {month.year}
            <span style={{ fontSize: 11, color: theme.textSecondary, fontWeight: 400 }}>({month.items.length} {month.items.length === 1 ? "spółka" : month.items.length < 5 ? "spółki" : "spółek"})</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 8 : 10 }}>
            {month.items.map((d, i) => {
              const days = daysUntil(d.exDate);
              const isPast = days < 0;
              const badge = streakBadge(d.streak);
              return (
                <div
                  key={`${d.ticker}-${d.year}-${i}`}
                  onClick={() => onSelectStock && onSelectStock(d)}
                  style={{
                    background: theme.bgCard,
                    border: `1px solid ${isPast ? theme.border : days <= 7 ? "rgba(34,197,94,0.25)" : theme.border}`,
                    borderRadius: 12,
                    padding: isMobile ? "12px 14px" : "14px 20px",
                    cursor: "pointer",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "36px 1fr" : "36px 1fr auto",
                    gap: isMobile ? 12 : 16,
                    alignItems: "center",
                    opacity: isPast ? 0.6 : 1,
                    transition: "border-color 0.2s, transform 0.15s",
                  }}
                  onMouseEnter={e => { if (!isPast) { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = isPast ? theme.border : days <= 7 ? "rgba(34,197,94,0.25)" : theme.border; e.currentTarget.style.transform = "none"; }}
                >
                  <CompanyMonogram ticker={d.ticker} sector={d.sector} size={36} />

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, color: theme.textBright, fontSize: 14, fontFamily: "var(--font-ui)" }}>{d.ticker}</span>
                      <span style={{ fontSize: 12, color: theme.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
                      {badge && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, background: badge.bg, color: badge.color, fontWeight: 600 }}>{badge.label}</span>}
                    </div>
                    <div style={{ display: "flex", gap: isMobile ? 8 : 16, marginTop: 6, flexWrap: "wrap", fontSize: 12 }}>
                      <span style={{ color: theme.textSecondary }}>Odcięcie: <strong style={{ color: theme.textBright }}>{fmtDate(d.exDate)}</strong></span>
                      <span style={{ color: theme.textSecondary }}>Wypłata: <strong style={{ color: theme.textBright }}>{fmtDate(d.payDate)}</strong></span>
                      <span style={{ color: theme.textSecondary }}>Za rok: <strong style={{ color: theme.textBright }}>{d.year}</strong></span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: isMobile ? 10 : 16, alignItems: "center", flexWrap: isMobile ? "wrap" : "nowrap", ...(isMobile ? { gridColumn: "1 / -1", paddingLeft: 0 } : {}) }}>
                    <div style={{ textAlign: "center", minWidth: 70 }}>
                      <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 2 }}>Dywidenda</div>
                      <div style={{ fontWeight: 700, color: theme.textBright, fontSize: 14, fontFamily: "var(--font-mono)" }}>{fmt(d.divPerShare)} zł</div>
                    </div>
                    <div style={{ textAlign: "center", minWidth: 60 }}>
                      <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 2 }}>Stopa</div>
                      <div style={{ fontWeight: 700, color: yieldColor(d.divYield, theme), fontSize: 14, fontFamily: "var(--font-mono)" }}>{fmt(d.divYield, 1)}%</div>
                    </div>
                    {!isPast && days !== Infinity && (
                      <div style={{ padding: "4px 10px", borderRadius: 8, background: days <= 7 ? "rgba(34,197,94,0.12)" : days <= 30 ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.06)", color: days <= 7 ? "#22c55e" : days <= 30 ? theme.accent : theme.textSecondary, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
                        {days === 0 ? "Dziś!" : days === 1 ? "Jutro" : `za ${days} dni`}
                      </div>
                    )}
                    {isPast && (
                      <div style={{ padding: "4px 10px", borderRadius: 8, background: "rgba(255,255,255,0.04)", color: theme.textMuted, fontSize: 11, fontWeight: 500 }}>Wypłacona</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Ranking Tab ───────────────────────────────────────────────────
function RankingView({ theme, isMobile, onSelectStock }) {
  const [sortKey, setSortKey] = useState("divYield");
  const [sortDir, setSortDir] = useState("desc");
  const [filterSector, setFilterSector] = useState("all");
  const [minStreak, setMinStreak] = useState(0);

  const dividends = useMemo(() => {
    let all = getActiveDividends();
    // Deduplicate by ticker — keep latest year entry
    const byTicker = {};
    for (const d of all) {
      if (!byTicker[d.ticker] || d.year > byTicker[d.ticker].year) {
        byTicker[d.ticker] = d;
      }
    }
    let list = Object.values(byTicker).filter(d => d.divYield > 0);
    if (filterSector !== "all") list = list.filter(d => d.sector === filterSector);
    if (minStreak > 0) list = list.filter(d => d.streak >= minStreak);
    list.sort((a, b) => {
      const va = a[sortKey] ?? 0, vb = b[sortKey] ?? 0;
      return sortDir === "desc" ? vb - va : va - vb;
    });
    return list;
  }, [sortKey, sortDir, filterSector, minStreak]);

  const sectors = useMemo(() => {
    const s = new Set(getActiveDividends().map(d => d.sector));
    return ["all", ...Array.from(s).sort()];
  }, []);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortHeader = ({ label, field, align }) => (
    <th
      onClick={() => toggleSort(field)}
      style={{ padding: isMobile ? "8px 6px" : "10px 12px", fontSize: 11, fontWeight: 600, color: sortKey === field ? theme.accent : theme.textSecondary, cursor: "pointer", textAlign: align || "left", userSelect: "none", whiteSpace: "nowrap", borderBottom: `1px solid ${theme.border}` }}
    >
      {label} {sortKey === field ? (sortDir === "desc" ? "▼" : "▲") : ""}
    </th>
  );

  return (
    <div>
      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <select
          value={filterSector}
          onChange={e => setFilterSector(e.target.value)}
          style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${theme.borderInput}`, background: theme.bgCardAlt, color: theme.text, fontSize: 12, fontFamily: "var(--font-ui)" }}
        >
          {sectors.map(s => <option key={s} value={s}>{s === "all" ? "Wszystkie sektory" : s}</option>)}
        </select>

        <select
          value={minStreak}
          onChange={e => setMinStreak(Number(e.target.value))}
          style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${theme.borderInput}`, background: theme.bgCardAlt, color: theme.text, fontSize: 12, fontFamily: "var(--font-ui)" }}
        >
          <option value={0}>Każdy streak</option>
          <option value={3}>Min. 3 lata</option>
          <option value={5}>Min. 5 lat</option>
          <option value={10}>Min. 10 lat</option>
          <option value={15}>Min. 15 lat (arystokraci)</option>
        </select>

        <span style={{ fontSize: 12, color: theme.textSecondary, marginLeft: "auto" }}>
          {dividends.length} {dividends.length === 1 ? "spółka" : dividends.length < 5 ? "spółki" : "spółek"}
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", borderRadius: 12, border: `1px solid ${theme.border}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 12 : 13, fontFamily: "var(--font-ui)" }}>
          <thead>
            <tr style={{ background: theme.bgCardAlt }}>
              <th style={{ padding: isMobile ? "8px 6px" : "10px 12px", fontSize: 11, fontWeight: 600, color: theme.textSecondary, textAlign: "left", borderBottom: `1px solid ${theme.border}`, width: 32 }}>#</th>
              <th style={{ padding: isMobile ? "8px 6px" : "10px 12px", fontSize: 11, fontWeight: 600, color: theme.textSecondary, textAlign: "left", borderBottom: `1px solid ${theme.border}` }}>Spółka</th>
              {!isMobile && <th style={{ padding: "10px 12px", fontSize: 11, fontWeight: 600, color: theme.textSecondary, textAlign: "left", borderBottom: `1px solid ${theme.border}` }}>Sektor</th>}
              <SortHeader label="Stopa" field="divYield" align="right" />
              <SortHeader label="Dywidenda" field="divPerShare" align="right" />
              <SortHeader label="Streak" field="streak" align="right" />
              <SortHeader label="Payout" field="payoutRatio" align="right" />
              {!isMobile && <SortHeader label="Odcięcie" field="exDate" align="right" />}
            </tr>
          </thead>
          <tbody>
            {dividends.map((d, i) => {
              const badge = streakBadge(d.streak);
              return (
                <tr
                  key={d.ticker}
                  onClick={() => onSelectStock && onSelectStock(d)}
                  style={{ background: i % 2 === 0 ? "transparent" : theme.bgCardAlt, cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${theme.accent}10`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 0 ? "transparent" : theme.bgCardAlt; }}
                >
                  <td style={{ padding: isMobile ? "8px 6px" : "10px 12px", color: theme.textMuted, fontSize: 11, fontWeight: 600 }}>{i + 1}</td>
                  <td style={{ padding: isMobile ? "8px 6px" : "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CompanyMonogram ticker={d.ticker} sector={d.sector} size={28} />
                      <div>
                        <div style={{ fontWeight: 700, color: theme.textBright, fontSize: 13 }}>{d.ticker}</div>
                        <div style={{ fontSize: 10, color: theme.textMuted, maxWidth: isMobile ? 100 : 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                      </div>
                    </div>
                  </td>
                  {!isMobile && <td style={{ padding: "10px 12px", fontSize: 11, color: theme.textSecondary }}>{d.sector}</td>}
                  <td style={{ padding: isMobile ? "8px 6px" : "10px 12px", textAlign: "right", fontWeight: 700, color: yieldColor(d.divYield, theme), fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{fmt(d.divYield, 1)}%</td>
                  <td style={{ padding: isMobile ? "8px 6px" : "10px 12px", textAlign: "right", color: theme.textBright, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{fmt(d.divPerShare)} zł</td>
                  <td style={{ padding: isMobile ? "8px 6px" : "10px 12px", textAlign: "right" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <span style={{ color: theme.textBright, fontFamily: "var(--font-mono)" }}>{d.streak}</span>
                      {badge && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: badge.bg, color: badge.color, fontWeight: 600 }}>{badge.label}</span>}
                    </span>
                  </td>
                  <td style={{ padding: isMobile ? "8px 6px" : "10px 12px", textAlign: "right", color: theme.textSecondary, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{d.payoutRatio}%</td>
                  {!isMobile && <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, color: theme.textSecondary }}>{fmtDate(d.exDate)}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {dividends.length === 0 && (
        <div style={{ textAlign: "center", padding: 48, color: theme.textSecondary }}>
          Brak spółek spełniających kryteria
        </div>
      )}
    </div>
  );
}

// ─── Calculator Tab ────────────────────────────────────────────────
function CalculatorView({ theme, isMobile }) {
  const [investedAmount, setInvestedAmount] = useState(10000);
  const [divYield, setDivYield] = useState(5.0);
  const [years, setYears] = useState(10);
  const [reinvest, setReinvest] = useState(true);
  const [taxRate] = useState(19); // Podatek Belki

  const results = useMemo(() => {
    const rows = [];
    let capital = investedAmount;
    let totalDivGross = 0;
    let totalDivNet = 0;

    for (let y = 1; y <= years; y++) {
      const divGross = capital * (divYield / 100);
      const divNet = divGross * (1 - taxRate / 100);
      totalDivGross += divGross;
      totalDivNet += divNet;
      if (reinvest) capital += divNet;
      rows.push({
        year: y,
        capital: capital,
        divGross,
        divNet,
        totalDivGross,
        totalDivNet,
        yieldOnCost: ((reinvest ? capital : investedAmount) * (divYield / 100) / investedAmount * 100),
      });
    }
    return rows;
  }, [investedAmount, divYield, years, reinvest, taxRate]);

  const lastRow = results[results.length - 1];
  const totalReturn = lastRow ? ((lastRow.capital - investedAmount) / investedAmount * 100) : 0;

  // SVG chart for capital growth
  const chartW = isMobile ? 300 : 500;
  const chartH = 160;
  const maxVal = Math.max(...results.map(r => r.capital), investedAmount * 1.1);
  const minVal = investedAmount * 0.95;
  const points = results.map((r, i) => {
    const x = 30 + (i / Math.max(1, results.length - 1)) * (chartW - 50);
    const y = chartH - 20 - ((r.capital - minVal) / (maxVal - minVal)) * (chartH - 40);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "320px 1fr", gap: 24 }}>
        {/* Input panel */}
        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 16 : 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: theme.textBright, marginBottom: 16 }}>Parametry inwestycji</div>

          <label style={{ display: "block", marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4 }}>Kwota inwestycji (PLN)</div>
            <input
              type="number"
              value={investedAmount}
              onChange={e => setInvestedAmount(Math.max(0, Number(e.target.value)))}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${theme.borderInput}`, background: theme.bgCardAlt, color: theme.textBright, fontSize: 14, fontFamily: "var(--font-mono)", boxSizing: "border-box" }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4 }}>Stopa dywidendy (%)</div>
            <input
              type="number"
              step="0.1"
              value={divYield}
              onChange={e => setDivYield(Math.max(0, Math.min(30, Number(e.target.value))))}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${theme.borderInput}`, background: theme.bgCardAlt, color: theme.textBright, fontSize: 14, fontFamily: "var(--font-mono)", boxSizing: "border-box" }}
            />
            <input
              type="range"
              min="0.5"
              max="15"
              step="0.1"
              value={divYield}
              onChange={e => setDivYield(Number(e.target.value))}
              style={{ width: "100%", marginTop: 4, accentColor: theme.accent }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4 }}>Okres inwestycji (lata)</div>
            <input
              type="number"
              value={years}
              onChange={e => setYears(Math.max(1, Math.min(30, Number(e.target.value))))}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${theme.borderInput}`, background: theme.bgCardAlt, color: theme.textBright, fontSize: 14, fontFamily: "var(--font-mono)", boxSizing: "border-box" }}
            />
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={years}
              onChange={e => setYears(Number(e.target.value))}
              style={{ width: "100%", marginTop: 4, accentColor: theme.accent }}
            />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={reinvest}
              onChange={e => setReinvest(e.target.checked)}
              style={{ accentColor: theme.accent }}
            />
            <span style={{ fontSize: 13, color: theme.text }}>Reinwestuj dywidendy (DRIP)</span>
          </label>

          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 8, padding: "8px 10px", background: theme.bgCardAlt, borderRadius: 8 }}>
            Podatek od dywidend: {taxRate}% (podatek Belki).
            {reinvest ? " Dywidendy netto są reinwestowane." : " Dywidendy wypłacane na rachunek."}
          </div>
        </div>

        {/* Results panel */}
        <div>
          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: isMobile ? 10 : 14, marginBottom: 20 }}>
            {[
              { label: "Kapitał końcowy", value: `${fmt(lastRow?.capital ?? investedAmount, 0)} zł`, color: "#22c55e" },
              { label: "Suma dywidend (netto)", value: `${fmt(lastRow?.totalDivNet ?? 0, 0)} zł`, color: theme.accent },
              { label: "Zwrot z inwestycji", value: `${fmt(totalReturn, 1)}%`, color: totalReturn > 0 ? "#22c55e" : "#ef4444" },
            ].map((s, i) => (
              <div key={i} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? "12px 14px" : "14px 18px" }}>
                <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: s.color, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          {results.length > 1 && (
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: theme.textBright, marginBottom: 8 }}>Wzrost kapitału</div>
              <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: "100%", height: "auto" }}>
                {/* Grid lines */}
                {[0.25, 0.5, 0.75].map(p => (
                  <line key={p} x1={30} y1={chartH - 20 - p * (chartH - 40)} x2={chartW - 20} y2={chartH - 20 - p * (chartH - 40)} stroke={theme.border} strokeWidth="0.5" />
                ))}
                {/* Area fill */}
                <polygon
                  points={`30,${chartH - 20} ${points} ${30 + ((results.length - 1) / Math.max(1, results.length - 1)) * (chartW - 50)},${chartH - 20}`}
                  fill={`${theme.accent}15`}
                />
                {/* Line */}
                <polyline
                  points={points}
                  fill="none"
                  stroke={theme.accent}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Start/end labels */}
                <text x={30} y={chartH - 4} fontSize="10" fill={theme.textMuted} fontFamily="var(--font-mono)" textAnchor="start">Rok 1</text>
                <text x={chartW - 20} y={chartH - 4} fontSize="10" fill={theme.textMuted} fontFamily="var(--font-mono)" textAnchor="end">Rok {years}</text>
                <text x={30} y={14} fontSize="10" fill={theme.textMuted} fontFamily="var(--font-mono)" textAnchor="start">{fmt(investedAmount, 0)} zł</text>
                <text x={chartW - 20} y={14} fontSize="10" fill="#22c55e" fontFamily="var(--font-mono)" textAnchor="end" fontWeight="700">{fmt(lastRow?.capital ?? 0, 0)} zł</text>
              </svg>
            </div>
          )}

          {/* Yearly table */}
          <div style={{ overflowX: "auto", borderRadius: 12, border: `1px solid ${theme.border}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "var(--font-ui)" }}>
              <thead>
                <tr style={{ background: theme.bgCardAlt }}>
                  <th style={{ padding: "8px 10px", fontSize: 11, color: theme.textSecondary, textAlign: "left", borderBottom: `1px solid ${theme.border}` }}>Rok</th>
                  <th style={{ padding: "8px 10px", fontSize: 11, color: theme.textSecondary, textAlign: "right", borderBottom: `1px solid ${theme.border}` }}>Dywidenda brutto</th>
                  <th style={{ padding: "8px 10px", fontSize: 11, color: theme.textSecondary, textAlign: "right", borderBottom: `1px solid ${theme.border}` }}>Dywidenda netto</th>
                  <th style={{ padding: "8px 10px", fontSize: 11, color: theme.textSecondary, textAlign: "right", borderBottom: `1px solid ${theme.border}` }}>Kapitał</th>
                  {!isMobile && <th style={{ padding: "8px 10px", fontSize: 11, color: theme.textSecondary, textAlign: "right", borderBottom: `1px solid ${theme.border}` }}>Stopa zwrotu na koszt</th>}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={r.year} style={{ background: i % 2 === 0 ? "transparent" : theme.bgCardAlt }}>
                    <td style={{ padding: "8px 10px", color: theme.textBright, fontWeight: 600 }}>{r.year}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", color: theme.text, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{fmt(r.divGross, 0)} zł</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", color: "#22c55e", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{fmt(r.divNet, 0)} zł</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", color: theme.textBright, fontWeight: 600, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{fmt(r.capital, 0)} zł</td>
                    {!isMobile && <td style={{ padding: "8px 10px", textAlign: "right", color: theme.accent, fontFamily: "var(--font-mono)" }}>{fmt(r.yieldOnCost, 1)}%</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ───────────────────────────────────────────
export default function DividendPage({ onBack, theme, onSelectStock }) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("kalendarz");

  return (
    <div style={{ minHeight: "100vh", background: theme.bgPage, color: theme.text, fontFamily: "var(--font-ui)" }}>
      {/* Header */}
      <div style={{ padding: isMobile ? "16px 12px" : "20px 24px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button
            onClick={onBack}
            style={{ background: "none", border: "none", color: theme.textSecondary, cursor: "pointer", padding: "4px 0", fontSize: 13, display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-ui)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            Powrót
          </button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: theme.textBright, margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="calendar" size={isMobile ? 24 : 28} color={theme.accent} />
            Dywidendy GPW
          </h1>
          <p style={{ fontSize: 13, color: theme.textSecondary, margin: "6px 0 0", lineHeight: 1.5 }}>
            Kalendarz dywidend, ranking spółek dywidendowych i kalkulator zwrotu z dywidend na GPW
          </p>
        </div>

        {/* Sub-tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: `1px solid ${theme.border}`, paddingBottom: 0 }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: isMobile ? "10px 14px" : "10px 20px",
                border: "none",
                borderBottom: `2px solid ${activeTab === t.key ? theme.accent : "transparent"}`,
                background: "transparent",
                color: activeTab === t.key ? theme.accent : theme.textMuted,
                fontSize: isMobile ? 12 : 13,
                fontWeight: activeTab === t.key ? 700 : 400,
                cursor: "pointer",
                fontFamily: "var(--font-ui)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s ease",
              }}
            >
              <Icon name={t.icon} size={14} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: isMobile ? "0 12px 40px" : "0 24px 60px", maxWidth: 1400, margin: "0 auto" }}>
        {activeTab === "kalendarz" && <CalendarView theme={theme} isMobile={isMobile} onSelectStock={onSelectStock} />}
        {activeTab === "ranking" && <RankingView theme={theme} isMobile={isMobile} onSelectStock={onSelectStock} />}
        {activeTab === "kalkulator" && <CalculatorView theme={theme} isMobile={isMobile} />}
      </div>

      {/* SEO: Schema.org structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Dywidendy GPW — Kalendarz dywidend i ranking spółek",
        description: "Kalendarz dywidend spółek notowanych na GPW, ranking najlepszych spółek dywidendowych, kalkulator zwrotu z dywidend.",
        url: "https://wigmarkets.com/dywidendy",
        publisher: { "@type": "Organization", name: "WIGmarkets" },
      }) }} />
    </div>
  );
}

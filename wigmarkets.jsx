import { useState, useEffect, useRef } from "react";

const STOCKS = [
  { id: 1, ticker: "PKN", name: "PKN ORLEN", sector: "Energetyka", price: 58.42, change1h: 0.34, change24h: -1.82, change7d: 3.45, cap: 74500, vol: 312, pe: 8.2, div: 5.1 },
  { id: 2, ticker: "PKO", name: "PKO Bank Polski", sector: "Banki", price: 47.18, change1h: -0.12, change24h: 2.14, change7d: 5.67, cap: 58200, vol: 287, pe: 10.1, div: 6.8 },
  { id: 3, ticker: "PZU", name: "PZU SA", sector: "Ubezpieczenia", price: 34.56, change1h: 0.08, change24h: -0.45, change7d: -1.23, cap: 41800, vol: 145, pe: 11.3, div: 8.2 },
  { id: 4, ticker: "KGH", name: "KGHM Polska Miedź", sector: "Surowce", price: 148.90, change1h: 1.24, change24h: 4.32, change7d: 8.91, cap: 35600, vol: 198, pe: 12.8, div: 3.5 },
  { id: 5, ticker: "CDR", name: "CD Projekt", sector: "Technologia", price: 182.40, change1h: -0.56, change24h: -2.90, change7d: -4.15, cap: 17200, vol: 423, pe: 35.6, div: 0.0 },
  { id: 6, ticker: "LPP", name: "LPP SA", sector: "Handel", price: 16840.00, change1h: 0.22, change24h: 1.15, change7d: 2.87, cap: 31400, vol: 56, pe: 28.4, div: 1.2 },
  { id: 7, ticker: "ALE", name: "Allegro.eu", sector: "E-commerce", price: 38.72, change1h: -0.88, change24h: -3.21, change7d: -6.54, cap: 24600, vol: 389, pe: 22.1, div: 0.0 },
  { id: 8, ticker: "PEO", name: "Bank Pekao", sector: "Banki", price: 142.80, change1h: 0.45, change24h: 1.78, change7d: 4.23, cap: 18700, vol: 112, pe: 9.5, div: 7.4 },
  { id: 9, ticker: "DNP", name: "Dino Polska", sector: "Handel", price: 378.20, change1h: -0.31, change24h: 0.67, change7d: 1.94, cap: 15300, vol: 78, pe: 24.7, div: 0.0 },
  { id: 10, ticker: "JSW", name: "JSW SA", sector: "Surowce", price: 24.36, change1h: 2.15, change24h: 5.80, change7d: -12.30, cap: 4200, vol: 534, pe: 4.1, div: 0.0 },
  { id: 11, ticker: "CCC", name: "CCC SA", sector: "Handel", price: 82.10, change1h: -1.20, change24h: -4.10, change7d: -8.20, cap: 6800, vol: 678, pe: 0, div: 0.0 },
  { id: 12, ticker: "PGE", name: "PGE Polska Grupa Energetyczna", sector: "Energetyka", price: 8.94, change1h: 0.11, change24h: 0.34, change7d: 1.12, cap: 14100, vol: 267, pe: 6.8, div: 4.2 },
];

const INDICES = [
  { name: "WIG20", value: "2 341,87", change: "+0,82%" },
  { name: "WIG", value: "84 521,30", change: "+0,61%" },
  { name: "mWIG40", value: "5 892,44", change: "-0,14%" },
  { name: "sWIG80", value: "21 034,10", change: "+1,20%" },
];

const FEAR_COMPONENTS = [
  { label: "Momentum rynku", val: 68 },
  { label: "Siła wolumenu", val: 55 },
  { label: "Szerokość rynku", val: 72 },
  { label: "Zmienność (VIX GPW)", val: 44 },
  { label: "Put/Call ratio", val: 60 },
  { label: "Popyt na bezpieczne aktywa", val: 38 },
];

function generateSparkline(trend) {
  const points = [];
  let val = 50 + Math.random() * 20;
  for (let i = 0; i < 20; i++) {
    val += (Math.random() - 0.5) * 8 + (trend > 0 ? 0.5 : -0.5);
    val = Math.max(20, Math.min(80, val));
    points.push(val);
  }
  const min = Math.min(...points);
  const max = Math.max(...points);
  return points.map((p, i) => {
    const x = (i / 19) * 100;
    const y = 40 - ((p - min) / (max - min + 1)) * 36;
    return `${x},${y}`;
  }).join(" ");
}

function Sparkline({ trend }) {
  const path = generateSparkline(trend);
  const color = trend >= 0 ? "#00c896" : "#ff4d6d";
  return (
    <svg width="80" height="40" viewBox="0 0 100 40" style={{ display: "block" }}>
      <polyline
        points={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

function FearGauge({ value = 62 }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 400); }, []);

  const getLabel = (v) => {
    if (v < 20) return "Skrajna panika";
    if (v < 40) return "Strach";
    if (v < 60) return "Neutralny";
    if (v < 80) return "Chciwość";
    return "Ekstremalna chciwość";
  };

  const getColor = (v) => {
    if (v < 20) return "#ff2244";
    if (v < 40) return "#ff6b35";
    if (v < 60) return "#ffd700";
    if (v < 80) return "#7ecb5f";
    return "#00e676";
  };

  const angle = animated ? (value / 100) * 180 - 90 : -90;
  const color = getColor(value);

  const arcPath = (startDeg, endDeg, r, color) => {
    const cx = 100, cy = 90;
    const s = (startDeg * Math.PI) / 180;
    const e = (endDeg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(s - Math.PI);
    const y1 = cy + r * Math.sin(s - Math.PI);
    const x2 = cx + r * Math.cos(e - Math.PI);
    const y2 = cy + r * Math.sin(e - Math.PI);
    return (
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${endDeg - startDeg > 180 ? 1 : 0} 1 ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.85"
      />
    );
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
      border: "1px solid #21262d",
      borderRadius: 16,
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <div style={{ color: "#8b949e", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
        GPW Fear & Greed Index
      </div>
      <svg width="200" height="110" viewBox="0 0 200 110">
        {arcPath(0, 36, 75, "#ff2244")}
        {arcPath(36, 72, 75, "#ff6b35")}
        {arcPath(72, 108, 75, "#ffd700")}
        {arcPath(108, 144, 75, "#7ecb5f")}
        {arcPath(144, 180, 75, "#00e676")}
        <g transform={`rotate(${angle}, 100, 90)`} style={{ transition: "transform 1.2s cubic-bezier(0.34,1.2,0.64,1)" }}>
          <line x1="100" y1="90" x2="100" y2="24" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="100" cy="90" r="5" fill={color} />
        </g>
        <circle cx="100" cy="90" r="3" fill="#0d1117" />
      </svg>
      <div style={{ fontSize: 38, fontWeight: 800, color, lineHeight: 1, marginTop: -8 }}>{value}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color, marginTop: 4 }}>{getLabel(value)}</div>
      <div style={{ display: "flex", gap: 20, marginTop: 16, fontSize: 11, color: "#8b949e" }}>
        {[["Wczoraj", "58"], ["Tydzień", "51"], ["Miesiąc", "67"]].map(([label, val]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ color: "#c9d1d9", fontWeight: 600 }}>{val}</div>
            <div>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, width: "100%" }}>
        {FEAR_COMPONENTS.map((f) => (
          <div key={f.label} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8b949e", marginBottom: 3 }}>
              <span>{f.label}</span>
              <span style={{ color: getColor(f.val) }}>{f.val}</span>
            </div>
            <div style={{ height: 4, background: "#21262d", borderRadius: 4 }}>
              <div style={{
                height: "100%", borderRadius: 4,
                width: animated ? `${f.val}%` : "0%",
                background: getColor(f.val),
                transition: "width 1s cubic-bezier(0.34,1.2,0.64,1)",
                transitionDelay: "0.3s",
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const fmt = (n, d = 2) => n.toLocaleString("pl-PL", { minimumFractionDigits: d, maximumFractionDigits: d });

export default function WigMarkets() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("cap");
  const [sortDir, setSortDir] = useState("desc");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [prices, setPrices] = useState(() => Object.fromEntries(STOCKS.map(s => [s.ticker, s.price])));
  const PER_PAGE = 10;

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const updated = { ...prev };
        STOCKS.forEach(s => {
          updated[s.ticker] = Math.max(1, prev[s.ticker] * (1 + (Math.random() - 0.499) * 0.002));
        });
        return updated;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const sectors = ["all", ...Array.from(new Set(STOCKS.map(s => s.sector)))];

  const filtered = STOCKS
    .filter(s => filter === "all" || s.sector === filter)
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.ticker.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let av = a[sortBy], bv = b[sortBy];
      if (sortBy === "price") { av = prices[a.ticker]; bv = prices[b.ticker]; }
      return sortDir === "desc" ? bv - av : av - bv;
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const col = (label, key, right = true) => (
    <th
      onClick={() => handleSort(key)}
      style={{
        padding: "10px 16px", textAlign: right ? "right" : "left",
        fontSize: 11, color: sortBy === key ? "#58a6ff" : "#8b949e",
        cursor: "pointer", whiteSpace: "nowrap", userSelect: "none",
        borderBottom: "1px solid #21262d", fontWeight: 600, letterSpacing: 1,
        textTransform: "uppercase",
      }}
    >
      {label} {sortBy === key ? (sortDir === "desc" ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle" }}><polyline points="6 9 12 15 18 9" /></svg> : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle" }}><polyline points="18 15 12 9 6 15" /></svg>) : ""}
    </th>
  );

  const changeColor = (v) => v > 0 ? "#00c896" : v < 0 ? "#ff4d6d" : "#8b949e";
  const changeFmt = (v) => `${v > 0 ? "+" : ""}${fmt(v)}%`;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#010409",
      color: "#c9d1d9",
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
    }}>
      {/* Top bar */}
      <div style={{
        background: "#0d1117",
        borderBottom: "1px solid #21262d",
        padding: "0 24px",
        overflowX: "auto",
      }}>
        <div style={{ display: "flex", gap: 32, padding: "12px 0" }}>
          {INDICES.map(idx => (
            <div key={idx.name} style={{ display: "flex", gap: 10, alignItems: "baseline", whiteSpace: "nowrap" }}>
              <span style={{ color: "#58a6ff", fontWeight: 700, fontSize: 12 }}>{idx.name}</span>
              <span style={{ fontSize: 13, color: "#e6edf3" }}>{idx.value}</span>
              <span style={{ fontSize: 12, color: idx.change.startsWith("+") ? "#00c896" : "#ff4d6d" }}>{idx.change}</span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 11, color: "#8b949e", whiteSpace: "nowrap", alignSelf: "center", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#00c896" }} /> Rynek otwarty · GPW Warszawa · {new Date().toLocaleTimeString("pl-PL")}
          </div>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: "32px 24px 0", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "linear-gradient(135deg, #1f6feb, #58a6ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 16, color: "#fff",
          }}>W</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 22, color: "#e6edf3", letterSpacing: -0.5 }}>
              WIG<span style={{ color: "#58a6ff" }}>markets</span>
            </div>
            <div style={{ fontSize: 11, color: "#8b949e", letterSpacing: 1 }}>NOTOWANIA GPW W CZASIE RZECZYWISTYM</div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div style={{
        maxWidth: 1400, margin: "24px auto",
        display: "grid", gridTemplateColumns: "1fr 280px",
        gap: 24, padding: "0 24px",
      }}>
        {/* Left: table */}
        <div>
          {/* Controls */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Szukaj spółki lub tickera..."
              style={{
                flex: 1, minWidth: 200, background: "#0d1117", border: "1px solid #30363d",
                borderRadius: 8, padding: "8px 14px", color: "#c9d1d9", fontSize: 13,
                outline: "none", fontFamily: "inherit",
              }}
            />
            <select
              value={filter}
              onChange={e => { setFilter(e.target.value); setPage(1); }}
              style={{
                background: "#0d1117", border: "1px solid #30363d", borderRadius: 8,
                padding: "8px 12px", color: "#c9d1d9", fontSize: 12, cursor: "pointer",
                fontFamily: "inherit", outline: "none",
              }}
            >
              {sectors.map(s => <option key={s} value={s}>{s === "all" ? "Wszystkie sektory" : s}</option>)}
            </select>
          </div>

          {/* Table */}
          <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {col("#", "id", false)}
                  <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#8b949e", borderBottom: "1px solid #21262d", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Spółka</th>
                  {col("Kurs", "price")}
                  {col("1h %", "change1h")}
                  {col("24h %", "change24h")}
                  {col("7d %", "change7d")}
                  {col("Kap. (mln zł)", "cap")}
                  {col("Wolumen", "vol")}
                  {col("C/Z", "pe")}
                  <th style={{ padding: "10px 16px", textAlign: "right", fontSize: 11, color: "#8b949e", borderBottom: "1px solid #21262d", fontWeight: 600, letterSpacing: 1 }}>7D</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((s, i) => {
                  const currentPrice = prices[s.ticker];
                  const priceColor = currentPrice > s.price ? "#00c896" : currentPrice < s.price ? "#ff4d6d" : "#c9d1d9";
                  return (
                    <tr key={s.id} style={{
                      borderBottom: "1px solid #161b22",
                      transition: "background 0.15s",
                      cursor: "pointer",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "#161b22"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "12px 16px", color: "#8b949e", fontSize: 12 }}>{(page - 1) * PER_PAGE + i + 1}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: "linear-gradient(135deg, #1f6feb22, #58a6ff33)",
                            border: "1px solid #58a6ff44",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10, fontWeight: 800, color: "#58a6ff",
                          }}>{s.ticker.slice(0, 2)}</div>
                          <div>
                            <div style={{ fontWeight: 700, color: "#e6edf3", fontSize: 13 }}>{s.ticker}</div>
                            <div style={{ fontSize: 11, color: "#8b949e" }}>{s.name}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, color: priceColor, transition: "color 0.3s" }}>
                        {fmt(currentPrice)} zł
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right", color: changeColor(s.change1h) }}>{changeFmt(s.change1h)}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <span style={{
                          padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                          background: s.change24h > 0 ? "#00c89620" : "#ff4d6d20",
                          color: changeColor(s.change24h),
                        }}>{changeFmt(s.change24h)}</span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right", color: changeColor(s.change7d) }}>{changeFmt(s.change7d)}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", color: "#8b949e" }}>{fmt(s.cap, 0)}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", color: "#8b949e" }}>{s.vol}K</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", color: "#8b949e" }}>{s.pe > 0 ? fmt(s.pe) : "—"}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <Sparkline trend={s.change7d} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #21262d" }}>
              <div style={{ fontSize: 12, color: "#8b949e" }}>
                Pokazuje {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} z {filtered.length} spółek
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{
                    width: 28, height: 28, borderRadius: 6, border: "1px solid",
                    borderColor: p === page ? "#58a6ff" : "#30363d",
                    background: p === page ? "#1f6feb22" : "transparent",
                    color: p === page ? "#58a6ff" : "#8b949e",
                    fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                  }}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FearGauge value={62} />

          {/* Top movers */}
          <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 11, color: "#8b949e", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
              Top wzrosty 24h
            </div>
            {[...STOCKS].sort((a, b) => b.change24h - a.change24h).slice(0, 5).map(s => (
              <div key={s.ticker} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #161b22" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: "#e6edf3" }}>{s.ticker}</div>
                  <div style={{ fontSize: 10, color: "#8b949e" }}>{s.sector}</div>
                </div>
                <span style={{
                  padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                  background: "#00c89620", color: "#00c896",
                }}>{changeFmt(s.change24h)}</span>
              </div>
            ))}
          </div>

          {/* Top losers */}
          <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 11, color: "#8b949e", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
              Top spadki 24h
            </div>
            {[...STOCKS].sort((a, b) => a.change24h - b.change24h).slice(0, 5).map(s => (
              <div key={s.ticker} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #161b22" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: "#e6edf3" }}>{s.ticker}</div>
                  <div style={{ fontSize: 10, color: "#8b949e" }}>{s.sector}</div>
                </div>
                <span style={{
                  padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                  background: "#ff4d6d20", color: "#ff4d6d",
                }}>{changeFmt(s.change24h)}</span>
              </div>
            ))}
          </div>

          {/* Market stats */}
          <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 11, color: "#8b949e", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
              Statystyki rynku
            </div>
            {[
              ["Spółki rosnące", `${STOCKS.filter(s => s.change24h > 0).length}/${STOCKS.length}`, "#00c896"],
              ["Łączna kap. (mld zł)", fmt(STOCKS.reduce((a, s) => a + s.cap, 0) / 1000, 1), "#58a6ff"],
              ["Śr. zmiana 24h", `${changeFmt(STOCKS.reduce((a, s) => a + s.change24h, 0) / STOCKS.length)}`, "#ffd700"],
            ].map(([label, val, color]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #161b22", fontSize: 12 }}>
                <span style={{ color: "#8b949e" }}>{label}</span>
                <span style={{ fontWeight: 700, color }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "32px 24px", fontSize: 11, color: "#484f58" }}>
        WIGmarkets © 2026 · Dane przykładowe (demo) · Nie stanowią rekomendacji inwestycyjnej
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

const TICKERS_GPW = ["pkn","pko","pzu","kgh","cdr","lpp","ale","peo","dnp","jsw","ccc","pge","kty","dno","mrc","mbk","opl","spx","pcr","tpe","eng","eur","bdi","cig","acp","pge","krk","gtc","amr","gpw"];
const TICKERS_COMMODITIES = ["xau","xag","cl.f","ng.f","hg.f","weat.us","corn.us","soy.us"];

async function fetchStooq(symbol) {
  try {
    const res = await fetch(`/api/stooq?symbol=${symbol}`);
    const data = await res.json();
    return data;
  } catch { return null; }
}

async function fetchHistory(symbol) {
  try {
    const res = await fetch(`/api/history?symbol=${symbol}`);
    const data = await res.json();
    return data;
  } catch { return null; }
}

const STOCKS = [
  { id: 1, ticker: "PKN", name: "PKN ORLEN", sector: "Energetyka", price: 106, change24h: 0, change7d: 0, cap: 74500, vol: 312, pe: 8.2, div: 5.1 },
  { id: 2, ticker: "PKO", name: "PKO Bank Polski", sector: "Banki", price: 89, change24h: 0, change7d: 0, cap: 58200, vol: 287, pe: 10.1, div: 6.8 },
  { id: 3, ticker: "PZU", name: "PZU SA", sector: "Ubezpieczenia", price: 68, change24h: 0, change7d: 0, cap: 41800, vol: 145, pe: 11.3, div: 8.2 },
  { id: 4, ticker: "KGH", name: "KGHM Polska Miedź", sector: "Surowce", price: 285, change24h: 0, change7d: 0, cap: 35600, vol: 198, pe: 12.8, div: 3.5 },
  { id: 5, ticker: "CDR", name: "CD Projekt", sector: "Technologia", price: 244, change24h: 0, change7d: 0, cap: 17200, vol: 423, pe: 35.6, div: 0 },
  { id: 6, ticker: "LPP", name: "LPP SA", sector: "Handel", price: 20470, change24h: 0, change7d: 0, cap: 31400, vol: 56, pe: 28.4, div: 1.2 },
  { id: 7, ticker: "ALE", name: "Allegro.eu", sector: "E-commerce", price: 29, change24h: 0, change7d: 0, cap: 24600, vol: 389, pe: 22.1, div: 0 },
  { id: 8, ticker: "PEO", name: "Bank Pekao", sector: "Banki", price: 224, change24h: 0, change7d: 0, cap: 18700, vol: 112, pe: 9.5, div: 7.4 },
  { id: 9, ticker: "DNP", name: "Dino Polska", sector: "Handel", price: 398, change24h: 0, change7d: 0, cap: 15300, vol: 78, pe: 24.7, div: 0 },
  { id: 10, ticker: "JSW", name: "JSW SA", sector: "Surowce", price: 24, change24h: 0, change7d: 0, cap: 4200, vol: 534, pe: 4.1, div: 0 },
  { id: 11, ticker: "CCC", name: "CCC SA", sector: "Handel", price: 82, change24h: 0, change7d: 0, cap: 6800, vol: 678, pe: 0, div: 0 },
  { id: 12, ticker: "PGE", name: "PGE Polska Grupa Energetyczna", sector: "Energetyka", price: 10, change24h: 0, change7d: 0, cap: 14100, vol: 267, pe: 6.8, div: 4.2 },
  { id: 13, ticker: "KTY", name: "Grupa Kęty", sector: "Przemysł", price: 580, change24h: 0, change7d: 0, cap: 5200, vol: 45, pe: 14.2, div: 3.8 },
  { id: 14, ticker: "MBK", name: "mBank", sector: "Banki", price: 620, change24h: 0, change7d: 0, cap: 8900, vol: 89, pe: 11.8, div: 2.1 },
  { id: 15, ticker: "OPL", name: "Orange Polska", sector: "Telekomunikacja", price: 9.2, change24h: 0, change7d: 0, cap: 6100, vol: 234, pe: 18.4, div: 5.5 },
  { id: 16, ticker: "PCR", name: "Polskie Górnictwo Naftowe", sector: "Energetyka", price: 6.8, change24h: 0, change7d: 0, cap: 11200, vol: 456, pe: 7.2, div: 6.1 },
  { id: 17, ticker: "TPE", name: "Tauron Polska Energia", sector: "Energetyka", price: 3.4, change24h: 0, change7d: 0, cap: 4800, vol: 678, pe: 5.9, div: 0 },
  { id: 18, ticker: "GPW", name: "Giełda Papierów Wartościowych", sector: "Finanse", price: 42, change24h: 0, change7d: 0, cap: 1700, vol: 34, pe: 16.3, div: 7.2 },
  { id: 19, ticker: "ACP", name: "Asseco Poland", sector: "Technologia", price: 78, change24h: 0, change7d: 0, cap: 4100, vol: 67, pe: 19.8, div: 4.3 },
  { id: 20, ticker: "GTC", name: "Globe Trade Centre", sector: "Nieruchomości", price: 5.2, change24h: 0, change7d: 0, cap: 1900, vol: 123, pe: 0, div: 3.2 },
];

const COMMODITIES = [
  { id: 101, ticker: "XAU", stooq: "xau", name: "Złoto", sector: "Metal szlachetny", price: 0, change24h: 0, change7d: 0, unit: "USD/oz" },
  { id: 102, ticker: "XAG", stooq: "xag", name: "Srebro", sector: "Metal szlachetny", price: 0, change24h: 0, change7d: 0, unit: "USD/oz" },
  { id: 103, ticker: "CL", stooq: "cl.f", name: "Ropa naftowa WTI", sector: "Energia", price: 0, change24h: 0, change7d: 0, unit: "USD/bbl" },
  { id: 104, ticker: "NG", stooq: "ng.f", name: "Gaz ziemny", sector: "Energia", price: 0, change24h: 0, change7d: 0, unit: "USD/MMBtu" },
  { id: 105, ticker: "HG", stooq: "hg.f", name: "Miedź", sector: "Metal przemysłowy", price: 0, change24h: 0, change7d: 0, unit: "USD/lb" },
  { id: 106, ticker: "WEAT", stooq: "weat.us", name: "Pszenica", sector: "Rolnictwo", price: 0, change24h: 0, change7d: 0, unit: "USD/bu" },
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
  const min = Math.min(...points), max = Math.max(...points);
  return points.map((p, i) => `${(i / 19) * 100},${40 - ((p - min) / (max - min + 1)) * 36}`).join(" ");
}

function Sparkline({ trend }) {
  const path = generateSparkline(trend);
  const color = trend >= 0 ? "#00c896" : "#ff4d6d";
  return (
    <svg width="80" height="40" viewBox="0 0 100 40" style={{ display: "block" }}>
      <polyline points={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

function MiniChart({ data, color }) {
  if (!data || data.length < 2) return <div style={{ color: "#8b949e", fontSize: 12, textAlign: "center", padding: "40px 0" }}>Ładowanie wykresu...</div>;
  const prices = data.map(d => d.close);
  const min = Math.min(...prices), max = Math.max(...prices);
  const w = 600, h = 160;
  const pts = prices.map((p, i) => `${(i / (prices.length - 1)) * w},${h - ((p - min) / (max - min + 0.01)) * (h - 20) - 10}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill="url(#cg)" stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function StockModal({ stock, price, change24h, change7d, onClose }) {
  const [history, setHistory] = useState(null);
  const [range, setRange] = useState("1M");
  const fmtN = (n, d = 2) => n?.toLocaleString("pl-PL", { minimumFractionDigits: d, maximumFractionDigits: d }) ?? "—";
  const changeFmt = (v) => `${v > 0 ? "+" : ""}${fmtN(v)}%`;
  const color = change24h >= 0 ? "#00c896" : "#ff4d6d";
  const stooqSymbol = stock.stooq || stock.ticker.toLowerCase();

  useEffect(() => {
    fetchHistory(stooqSymbol).then(d => setHistory(d?.prices || null));
  }, [stooqSymbol]);

  const filterHistory = () => {
    if (!history) return [];
    const days = { "1W": 7, "1M": 30, "3M": 90, "1R": 365 };
    return history.slice(-(days[range] || 30));
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 20, padding: 32, width: "100%", maxWidth: 720, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #1f6feb22, #58a6ff33)", border: "1px solid #58a6ff44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#58a6ff" }}>{stock.ticker.slice(0, 2)}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#e6edf3" }}>{stock.ticker}</div>
              <div style={{ fontSize: 13, color: "#8b949e" }}>{stock.name} · {stock.sector}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "#21262d", border: "none", borderRadius: 8, color: "#8b949e", width: 32, height: 32, fontSize: 18, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#e6edf3" }}>{fmtN(price)} {stock.unit || "zł"}</div>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <span style={{ padding: "4px 12px", borderRadius: 6, background: `${color}20`, color, fontWeight: 700, fontSize: 13 }}>24h: {changeFmt(change24h)}</span>
            <span style={{ padding: "4px 12px", borderRadius: 6, background: `${color}20`, color, fontWeight: 700, fontSize: 13 }}>7d: {changeFmt(change7d)}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {["1W", "1M", "3M", "1R"].map(r => (
            <button key={r} onClick={() => setRange(r)} style={{ padding: "4px 14px", borderRadius: 6, border: "1px solid", borderColor: range === r ? "#58a6ff" : "#30363d", background: range === r ? "#1f6feb22" : "transparent", color: range === r ? "#58a6ff" : "#8b949e", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{r}</button>
          ))}
        </div>
        <div style={{ background: "#010409", borderRadius: 12, padding: "16px 8px", marginBottom: 24 }}>
          <MiniChart data={filterHistory()} color={color} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            ["Kapitalizacja", stock.cap ? `${fmtN(stock.cap, 0)} mln zł` : "—"],
            ["C/Z (P/E)", stock.pe > 0 ? fmtN(stock.pe) : "—"],
            ["Dywidenda", stock.div > 0 ? `${fmtN(stock.div)}%` : "Brak"],
            ["Wolumen", stock.vol ? `${stock.vol}K` : "—"],
          ].map(([label, val]) => (
            <div key={label} style={{ background: "#161b22", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#e6edf3" }}>{val}</div>
            </div>
          ))}
        </div>
        <a href={`https://stooq.pl/q/?s=${stooqSymbol}`} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", color: "#58a6ff", fontSize: 12, textDecoration: "none" }}>
          Zobacz pełne dane na stooq.pl →
        </a>
      </div>
    </div>
  );
}

function FearGauge({ value = 62 }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 400); }, []);
  const getLabel = (v) => { if (v < 20) return "Skrajna panika"; if (v < 40) return "Strach"; if (v < 60) return "Neutralny"; if (v < 80) return "Chciwość"; return "Ekstremalna chciwość"; };
  const getColor = (v) => { if (v < 20) return "#ff2244"; if (v < 40) return "#ff6b35"; if (v < 60) return "#ffd700"; if (v < 80) return "#7ecb5f"; return "#00e676"; };
  const angle = animated ? (value / 100) * 180 - 90 : -90;
  const color = getColor(value);
  const arcPath = (startDeg, endDeg, r, c) => {
    const cx = 100, cy = 90, s = (startDeg * Math.PI) / 180, e = (endDeg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(s - Math.PI), y1 = cy + r * Math.sin(s - Math.PI);
    const x2 = cx + r * Math.cos(e - Math.PI), y2 = cy + r * Math.sin(e - Math.PI);
    return <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${endDeg - startDeg > 180 ? 1 : 0} 1 ${x2} ${y2}`} fill="none" stroke={c} strokeWidth="10" strokeLinecap="round" opacity="0.85" />;
  };
  return (
    <div style={{ background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)", border: "1px solid #21262d", borderRadius: 16, padding: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ color: "#8b949e", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>GPW Fear & Greed Index</div>
      <svg width="200" height="110" viewBox="0 0 200 110">
        {arcPath(0, 36, 75, "#ff2244")}{arcPath(36, 72, 75, "#ff6b35")}{arcPath(72, 108, 75, "#ffd700")}{arcPath(108, 144, 75, "#7ecb5f")}{arcPath(144, 180, 75, "#00e676")}
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
          <div key={label} style={{ textAlign: "center" }}><div style={{ color: "#c9d1d9", fontWeight: 600 }}>{val}</div><div>{label}</div></div>
        ))}
      </div>
      <div style={{ marginTop: 16, width: "100%" }}>
        {FEAR_COMPONENTS.map((f) => (
          <div key={f.label} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8b949e", marginBottom: 3 }}>
              <span>{f.label}</span><span style={{ color: getColor(f.val) }}>{f.val}</span>
            </div>
            <div style={{ height: 4, background: "#21262d", borderRadius: 4 }}>
              <div style={{ height: "100%", borderRadius: 4, width: animated ? `${f.val}%` : "0%", background: getColor(f.val), transition: "width 1s cubic-bezier(0.34,1.2,0.64,1)", transitionDelay: "0.3s" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const fmt = (n, d = 2) => n?.toLocaleString("pl-PL", { minimumFractionDigits: d, maximumFractionDigits: d }) ?? "—";

export default function WigMarkets() {
  const [tab, setTab] = useState("akcje");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("cap");
  const [sortDir, setSortDir] = useState("desc");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [prices, setPrices] = useState(() => Object.fromEntries([...STOCKS, ...COMMODITIES].map(s => [s.ticker, s.price])));
  const [changes, setChanges] = useState({});
  const [selected, setSelected] = useState(null);
  const PER_PAGE = 15;

  useEffect(() => {
    const fetchAll = async () => {
      const allItems = tab === "akcje" ? STOCKS : COMMODITIES;
      for (const item of allItems) {
        const symbol = item.stooq || item.ticker.toLowerCase();
        const data = await fetchStooq(symbol);
        if (data?.close) {
          setPrices(prev => ({ ...prev, [item.ticker]: data.close }));
          setChanges(prev => ({ ...prev, [item.ticker]: { change24h: data.change24h ?? 0, change7d: data.change7d ?? 0 } }));
        }
      }
    };
    fetchAll();
    const interval = setInterval(fetchAll, 60000);
    return () => clearInterval(interval);
  }, [tab]);

  const activeData = tab === "akcje" ? STOCKS : COMMODITIES;
  const sectors = ["all", ...Array.from(new Set(activeData.map(s => s.sector)))];

  const filtered = activeData
    .filter(s => filter === "all" || s.sector === filter)
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.ticker.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let av = a[sortBy] ?? 0, bv = b[sortBy] ?? 0;
      if (sortBy === "price") { av = prices[a.ticker]; bv = prices[b.ticker]; }
      if (sortBy === "change24h") { av = changes[a.ticker]?.change24h ?? 0; bv = changes[b.ticker]?.change24h ?? 0; }
      if (sortBy === "change7d") { av = changes[a.ticker]?.change7d ?? 0; bv = changes[b.ticker]?.change7d ?? 0; }
      return sortDir === "desc" ? bv - av : av - bv;
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const handleSort = (col) => { if (sortBy === col) setSortDir(d => d === "desc" ? "asc" : "desc"); else { setSortBy(col); setSortDir("desc"); } };
  const col = (label, key, right = true) => (
    <th onClick={() => handleSort(key)} style={{ padding: "10px 16px", textAlign: right ? "right" : "left", fontSize: 11, color: sortBy === key ? "#58a6ff" : "#8b949e", cursor: "pointer", whiteSpace: "nowrap", userSelect: "none", borderBottom: "1px solid #21262d", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
      {label} {sortBy === key ? (sortDir === "desc" ? "↓" : "↑") : ""}
    </th>
  );
  const changeColor = (v) => v > 0 ? "#00c896" : v < 0 ? "#ff4d6d" : "#8b949e";
  const changeFmt = (v) => `${v > 0 ? "+" : ""}${fmt(v)}%`;

  return (
    <div style={{ minHeight: "100vh", background: "#010409", color: "#c9d1d9", fontFamily: "'IBM Plex Mono', 'Courier New', monospace" }}>

      {selected && <StockModal stock={selected} price={prices[selected.ticker]} change24h={changes[selected.ticker]?.change24h ?? 0} change7d={changes[selected.ticker]?.change7d ?? 0} onClose={() => setSelected(null)} />}

      <div style={{ background: "#0d1117", borderBottom: "1px solid #21262d", padding: "0 24px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 32, padding: "12px 0" }}>
          {INDICES.map(idx => (
            <div key={idx.name} style={{ display: "flex", gap: 10, alignItems: "baseline", whiteSpace: "nowrap" }}>
              <span style={{ color: "#58a6ff", fontWeight: 700, fontSize: 12 }}>{idx.name}</span>
              <span style={{ fontSize: 13, color: "#e6edf3" }}>{idx.value}</span>
              <span style={{ fontSize: 12, color: idx.change.startsWith("+") ? "#00c896" : "#ff4d6d" }}>{idx.change}</span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 11, color: "#8b949e", whiteSpace: "nowrap", alignSelf: "center" }}>🟢 GPW Warszawa · {new Date().toLocaleTimeString("pl-PL")}</div>
        </div>
      </div>

      <div style={{ padding: "32px 24px 0", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #1f6feb, #58a6ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, color: "#fff" }}>W</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 22, color: "#e6edf3", letterSpacing: -0.5 }}>WIG<span style={{ color: "#58a6ff" }}>markets</span></div>
            <div style={{ fontSize: 11, color: "#8b949e", letterSpacing: 1 }}>NOTOWANIA GPW W CZASIE RZECZYWISTYM</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
          {[["akcje", "🏛️ Akcje GPW"], ["surowce", "🥇 Surowce"]].map(([key, label]) => (
            <button key={key} onClick={() => { setTab(key); setPage(1); setFilter("all"); }} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid", borderColor: tab === key ? "#58a6ff" : "#30363d", background: tab === key ? "#1f6feb22" : "transparent", color: tab === key ? "#58a6ff" : "#8b949e", fontSize: 13, fontWeight: tab === key ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, padding: "0 24px" }}>
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Szukaj..."
              style={{ flex: 1, minWidth: 200, background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, padding: "8px 14px", color: "#c9d1d9", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
            <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}
              style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, padding: "8px 12px", color: "#c9d1d9", fontSize: 12, cursor: "pointer", fontFamily: "inherit", outline: "none" }}>
              {sectors.map(s => <option key={s} value={s}>{s === "all" ? "Wszystkie sektory" : s}</option>)}
            </select>
          </div>

          <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {col("#", "id", false)}
                  <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#8b949e", borderBottom: "1px solid #21262d", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Instrument</th>
                  {col("Kurs", "price")}{col("24h %", "change24h")}{col("7d %", "change7d")}
                  {tab === "akcje" && col("Kap. (mln zł)", "cap")}
                  {tab === "akcje" && col("C/Z", "pe")}
                  <th style={{ padding: "10px 16px", textAlign: "right", fontSize: 11, color: "#8b949e", borderBottom: "1px solid #21262d", fontWeight: 600, letterSpacing: 1 }}>7D</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((s, i) => {
                  const currentPrice = prices[s.ticker];
                  const c24h = changes[s.ticker]?.change24h ?? 0;
                  const c7d = changes[s.ticker]?.change7d ?? 0;
                  const priceColor = c24h > 0 ? "#00c896" : c24h < 0 ? "#ff4d6d" : "#c9d1d9";
                  return (
                    <tr key={s.id} onClick={() => setSelected(s)} style={{ borderBottom: "1px solid #161b22", transition: "background 0.15s", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#161b22"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "12px 16px", color: "#8b949e", fontSize: 12 }}>{(page - 1) * PER_PAGE + i + 1}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #1f6feb22, #58a6ff33)", border: "1px solid #58a6ff44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#58a6ff" }}>{s.ticker.slice(0, 2)}</div>
                          <div>
                            <div style={{ fontWeight: 700, color: "#e6edf3", fontSize: 13 }}>{s.ticker}</div>
                            <div style={{ fontSize: 11, color: "#8b949e" }}>{s.name}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, color: priceColor }}>{fmt(currentPrice)} {s.unit || "zł"}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700, background: c24h > 0 ? "#00c89620" : "#ff4d6d20", color: changeColor(c24h) }}>{changeFmt(c24h)}</span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right", color: changeColor(c7d) }}>{changeFmt(c7d)}</td>
                      {tab === "akcje" && <td style={{ padding: "12px 16px", textAlign: "right", color: "#8b949e" }}>{fmt(s.cap, 0)}</td>}
                      {tab === "akcje" && <td style={{ padding: "12px 16px", textAlign: "right", color: "#8b949e" }}>{s.pe > 0 ? fmt(s.pe) : "—"}</td>}
                      <td style={{ padding: "12px 16px", textAlign: "right" }}><Sparkline trend={c7d} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #21262d" }}>
              <div style={{ fontSize: 12, color: "#8b949e" }}>Pokazuje {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} z {filtered.length} instrumentów</div>
              <div style={{ display: "flex", gap: 6 }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid", borderColor: p === page ? "#58a6ff" : "#30363d", background: p === page ? "#1f6feb22" : "transparent", color: p === page ? "#58a6ff" : "#8b949e", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FearGauge value={62} />
          <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 11, color: "#8b949e", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Top wzrosty 24h</div>
            {[...STOCKS].sort((a, b) => (changes[b.ticker]?.change24h ?? 0) - (changes[a.ticker]?.change24h ?? 0)).slice(0, 5).map(s => (
              <div key={s.ticker} onClick={() => setSelected(s)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #161b22", cursor: "pointer" }}>
                <div><div style={{ fontWeight: 700, fontSize: 12, color: "#e6edf3" }}>{s.ticker}</div><div style={{ fontSize: 10, color: "#8b949e" }}>{s.sector}</div></div>
                <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700, background: "#00c89620", color: "#00c896" }}>{changeFmt(changes[s.ticker]?.change24h ?? 0)}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 11, color: "#8b949e", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Top spadki 24h</div>
            {[...STOCKS].sort((a, b) => (changes[a.ticker]?.change24h ?? 0) - (changes[b.ticker]?.change24h ?? 0)).slice(0, 5).map(s => (
              <div key={s.ticker} onClick={() => setSelected(s)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #161b22", cursor: "pointer" }}>
                <div><div style={{ fontWeight: 700, fontSize: 12, color: "#e6edf3" }}>{s.ticker}</div><div style={{ fontSize: 10, color: "#8b949e" }}>{s.sector}</div></div>
                <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700, background: "#ff4d6d20", color: "#ff4d6d" }}>{changeFmt(changes[s.ticker]?.change24h ?? 0)}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 11, color: "#8b949e", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Statystyki rynku</div>
            {[
              ["Spółki rosnące", `${STOCKS.filter(s => (changes[s.ticker]?.change24h ?? 0) > 0).length}/${STOCKS.length}`, "#00c896"],
              ["Łączna kap. (mld zł)", fmt(STOCKS.reduce((a, s) => a + s.cap, 0) / 1000, 1), "#58a6ff"],
              ["Śr. zmiana 24h", changeFmt(STOCKS.reduce((a, s) => a + (changes[s.ticker]?.change24h ?? 0), 0) / STOCKS.length), "#ffd700"],
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
        WIGmarkets © 2026 · Dane z GPW via stooq.pl · Nie stanowią rekomendacji inwestycyjnej
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<WigMarkets />);

import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

const DARK_THEME = {
  bgPage: "#010409",
  bgCard: "#0d1117",
  bgCardAlt: "#161b22",
  border: "#21262d",
  borderInput: "#30363d",
  text: "#c9d1d9",
  textSecondary: "#8b949e",
  textBright: "#e6edf3",
  accent: "#58a6ff",
  fearGaugeBg: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
};

const LIGHT_THEME = {
  bgPage: "#f6f8fa",
  bgCard: "#ffffff",
  bgCardAlt: "#f0f2f5",
  border: "#d0d7de",
  borderInput: "#d0d7de",
  text: "#24292f",
  textSecondary: "#656d76",
  textBright: "#1f2328",
  accent: "#0969da",
  fearGaugeBg: "linear-gradient(135deg, #ffffff 0%, #f0f2f5 100%)",
};

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

async function fetchIndices() {
  try {
    const res = await fetch("/api/indices");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

const STOCKS = [
  { id: 1, ticker: "PKN", stooq: "pkn", name: "PKN ORLEN", sector: "Energetyka", price: 106, change24h: 0, change7d: 0, cap: 74500, pe: 8.2, div: 5.1 },
  { id: 2, ticker: "PKO", stooq: "pko", name: "PKO Bank Polski", sector: "Banki", price: 89, change24h: 0, change7d: 0, cap: 58200, pe: 10.1, div: 6.8 },
  { id: 3, ticker: "PZU", stooq: "pzu", name: "PZU SA", sector: "Ubezpieczenia", price: 68, change24h: 0, change7d: 0, cap: 41800, pe: 11.3, div: 8.2 },
  { id: 4, ticker: "KGH", stooq: "kgh", name: "KGHM Polska Miedź", sector: "Surowce", price: 285, change24h: 0, change7d: 0, cap: 35600, pe: 12.8, div: 3.5 },
  { id: 5, ticker: "CDR", stooq: "cdr", name: "CD Projekt", sector: "Technologia", price: 244, change24h: 0, change7d: 0, cap: 17200, pe: 35.6, div: 0 },
  { id: 6, ticker: "LPP", stooq: "lpp", name: "LPP SA", sector: "Handel", price: 20470, change24h: 0, change7d: 0, cap: 31400, pe: 28.4, div: 1.2 },
  { id: 7, ticker: "ALE", stooq: "ale", name: "Allegro.eu", sector: "E-commerce", price: 29, change24h: 0, change7d: 0, cap: 24600, pe: 22.1, div: 0 },
  { id: 8, ticker: "PEO", stooq: "peo", name: "Bank Pekao", sector: "Banki", price: 224, change24h: 0, change7d: 0, cap: 18700, pe: 9.5, div: 7.4 },
  { id: 9, ticker: "DNP", stooq: "dnp", name: "Dino Polska", sector: "Handel", price: 398, change24h: 0, change7d: 0, cap: 15300, pe: 24.7, div: 0 },
  { id: 10, ticker: "JSW", stooq: "jsw", name: "JSW SA", sector: "Surowce", price: 24, change24h: 0, change7d: 0, cap: 4200, pe: 4.1, div: 0 },
  { id: 11, ticker: "CCC", stooq: "ccc", name: "CCC SA", sector: "Handel", price: 82, change24h: 0, change7d: 0, cap: 6800, pe: 0, div: 0 },
  { id: 12, ticker: "PGE", stooq: "pge", name: "PGE Polska Grupa Energetyczna", sector: "Energetyka", price: 10, change24h: 0, change7d: 0, cap: 14100, pe: 6.8, div: 4.2 },
  { id: 13, ticker: "KTY", stooq: "kty", name: "Grupa Kęty", sector: "Przemysł", price: 580, change24h: 0, change7d: 0, cap: 5200, pe: 14.2, div: 3.8 },
  { id: 14, ticker: "MBK", stooq: "mbk", name: "mBank", sector: "Banki", price: 620, change24h: 0, change7d: 0, cap: 8900, pe: 11.8, div: 2.1 },
  { id: 15, ticker: "OPL", stooq: "opl", name: "Orange Polska", sector: "Telekomunikacja", price: 9.2, change24h: 0, change7d: 0, cap: 6100, pe: 18.4, div: 5.5 },
  { id: 16, ticker: "PCR", stooq: "pcr", name: "Polskie Górnictwo Naftowe", sector: "Energetyka", price: 6.8, change24h: 0, change7d: 0, cap: 11200, pe: 7.2, div: 6.1 },
  { id: 17, ticker: "TPE", stooq: "tpe", name: "Tauron Polska Energia", sector: "Energetyka", price: 3.4, change24h: 0, change7d: 0, cap: 4800, pe: 5.9, div: 0 },
  { id: 18, ticker: "GPW", stooq: "gpw", name: "Giełda Papierów Wartościowych", sector: "Finanse", price: 42, change24h: 0, change7d: 0, cap: 1700, pe: 16.3, div: 7.2 },
  { id: 19, ticker: "ACP", stooq: "acp", name: "Asseco Poland", sector: "Technologia", price: 78, change24h: 0, change7d: 0, cap: 4100, pe: 19.8, div: 4.3 },
  { id: 20, ticker: "GTC", stooq: "gtc", name: "Globe Trade Centre", sector: "Nieruchomości", price: 5.2, change24h: 0, change7d: 0, cap: 1900, pe: 0, div: 3.2 },
  { id: 21, ticker: "BDX", stooq: "bdx", name: "Budimex", sector: "Budownictwo", price: 890, change24h: 0, change7d: 0, cap: 5900, pe: 18.2, div: 6.1 },
  { id: 22, ticker: "ENG", stooq: "eng", name: "Energa", sector: "Energetyka", price: 8.2, change24h: 0, change7d: 0, cap: 3400, pe: 9.1, div: 3.2 },
  { id: 23, ticker: "EUR", stooq: "eur", name: "Eurocash", sector: "Handel", price: 14.5, change24h: 0, change7d: 0, cap: 1800, pe: 12.4, div: 2.1 },
  { id: 24, ticker: "MRC", stooq: "mrc", name: "Mercator Medical", sector: "Medycyna", price: 42, change24h: 0, change7d: 0, cap: 890, pe: 8.7, div: 0 },
  { id: 25, ticker: "AMR", stooq: "amr", name: "Amrest Holdings", sector: "Restauracje", price: 6.8, change24h: 0, change7d: 0, cap: 2100, pe: 0, div: 0 },
  { id: 26, ticker: "BIO", stooq: "bio", name: "Biomed-Lublin", sector: "Medycyna", price: 3.2, change24h: 0, change7d: 0, cap: 210, pe: 0, div: 0 },
  { id: 27, ticker: "CIG", stooq: "cig", name: "Cinema City International", sector: "Rozrywka", price: 8.9, change24h: 0, change7d: 0, cap: 1200, pe: 0, div: 0 },
  { id: 28, ticker: "ING", stooq: "ing", name: "ING Bank Śląski", sector: "Banki", price: 240, change24h: 0, change7d: 0, cap: 12800, pe: 13.2, div: 5.8 },
  { id: 29, ticker: "SNK", stooq: "snk", name: "Sanok Rubber Company", sector: "Przemysł", price: 28, change24h: 0, change7d: 0, cap: 620, pe: 11.4, div: 4.2 },
  { id: 30, ticker: "MIL", stooq: "mil", name: "Bank Millennium", sector: "Banki", price: 9.8, change24h: 0, change7d: 0, cap: 4200, pe: 8.9, div: 3.1 },
  { id: 31, ticker: "ALR", stooq: "alr", name: "Alior Bank", sector: "Banki", price: 78, change24h: 0, change7d: 0, cap: 3800, pe: 7.2, div: 2.4 },
  { id: 32, ticker: "CAR", stooq: "car", name: "Carrefour Polska", sector: "Handel", price: 18.4, change24h: 0, change7d: 0, cap: 2100, pe: 14.1, div: 3.8 },
  { id: 33, ticker: "ATT", stooq: "att", name: "Amica", sector: "AGD", price: 98, change24h: 0, change7d: 0, cap: 780, pe: 12.3, div: 3.5 },
  { id: 34, ticker: "TEN", stooq: "ten", name: "Tenders.pl", sector: "Technologia", price: 4.2, change24h: 0, change7d: 0, cap: 320, pe: 0, div: 0 },
  { id: 35, ticker: "VGO", stooq: "vgo", name: "Vigo Photonics", sector: "Technologia", price: 210, change24h: 0, change7d: 0, cap: 890, pe: 28.4, div: 0 },
  { id: 36, ticker: "ZEP", stooq: "zep", name: "ZE PAK", sector: "Energetyka", price: 34, change24h: 0, change7d: 0, cap: 1200, pe: 6.4, div: 4.1 },
  { id: 37, ticker: "TRK", stooq: "trk", name: "Trakcja", sector: "Budownictwo", price: 2.8, change24h: 0, change7d: 0, cap: 280, pe: 0, div: 0 },
  { id: 38, ticker: "HRP", stooq: "hrp", name: "Harper Hygienics", sector: "FMCG", price: 5.6, change24h: 0, change7d: 0, cap: 180, pe: 14.2, div: 2.1 },
  { id: 39, ticker: "PCO", stooq: "pco", name: "Polskie Centrum Opieki", sector: "Medycyna", price: 12.4, change24h: 0, change7d: 0, cap: 420, pe: 18.9, div: 0 },
  { id: 40, ticker: "VRG", stooq: "vrg", name: "VRG SA", sector: "Handel", price: 6.2, change24h: 0, change7d: 0, cap: 580, pe: 9.8, div: 3.4 },
  { id: 41, ticker: "ACG", stooq: "acg", name: "Accolade", sector: "Nieruchomości", price: 38, change24h: 0, change7d: 0, cap: 1400, pe: 0, div: 4.2 },
  { id: 42, ticker: "MAB", stooq: "mab", name: "Mabion", sector: "Biotechnologia", price: 28, change24h: 0, change7d: 0, cap: 420, pe: 0, div: 0 },
  { id: 43, ticker: "PKP", stooq: "pkp", name: "PKP Cargo", sector: "Transport", price: 24, change24h: 0, change7d: 0, cap: 890, pe: 0, div: 0 },
  { id: 44, ticker: "EMC", stooq: "emc", name: "EMC Instytut Medyczny", sector: "Medycyna", price: 18, change24h: 0, change7d: 0, cap: 230, pe: 16.4, div: 2.8 },
  { id: 45, ticker: "ABS", stooq: "abs", name: "Abstra", sector: "Technologia", price: 8.4, change24h: 0, change7d: 0, cap: 140, pe: 0, div: 0 },
  { id: 46, ticker: "PCX", stooq: "pcx", name: "Polimex-Mostostal", sector: "Budownictwo", price: 3.8, change24h: 0, change7d: 0, cap: 680, pe: 0, div: 0 },
  { id: 47, ticker: "NTT", stooq: "ntt", name: "NTT System", sector: "Technologia", price: 2.4, change24h: 0, change7d: 0, cap: 98, pe: 12.1, div: 0 },
  { id: 48, ticker: "OAT", stooq: "oat", name: "Oat Foods", sector: "Spożywczy", price: 4.8, change24h: 0, change7d: 0, cap: 210, pe: 14.8, div: 1.2 },
  { id: 49, ticker: "KRU", stooq: "kru", name: "Kruk SA", sector: "Finanse", price: 380, change24h: 0, change7d: 0, cap: 4800, pe: 12.4, div: 3.8 },
  { id: 50, ticker: "HBP", stooq: "hbp", name: "Huuuge Games", sector: "Gry", price: 18, change24h: 0, change7d: 0, cap: 680, pe: 0, div: 0 },
  { id: 51, ticker: "SGN", stooq: "sgn", name: "Selvita", sector: "Biotechnologia", price: 62, change24h: 0, change7d: 0, cap: 580, pe: 0, div: 0 },
  { id: 52, ticker: "CNT", stooq: "cnt", name: "Centurion Finance", sector: "Finanse", price: 1.8, change24h: 0, change7d: 0, cap: 89, pe: 0, div: 0 },
  { id: 53, ticker: "BFT", stooq: "bft", name: "Benefit Systems", sector: "HR/Benefity", price: 580, change24h: 0, change7d: 0, cap: 3200, pe: 24.8, div: 2.1 },
  { id: 54, ticker: "RFK", stooq: "rfk", name: "Rafako", sector: "Przemysł", price: 1.2, change24h: 0, change7d: 0, cap: 210, pe: 0, div: 0 },
  { id: 55, ticker: "SKA", stooq: "ska", name: "Skarbiec Holding", sector: "Finanse", price: 28, change24h: 0, change7d: 0, cap: 180, pe: 14.2, div: 5.8 },
  { id: 56, ticker: "WAR", stooq: "war", name: "Wawel SA", sector: "Spożywczy", price: 980, change24h: 0, change7d: 0, cap: 890, pe: 16.4, div: 4.2 },
  { id: 57, ticker: "MWT", stooq: "mwt", name: "Mewa Textil", sector: "Przemysł", price: 12, change24h: 0, change7d: 0, cap: 140, pe: 8.9, div: 3.1 },
  { id: 58, ticker: "PHN", stooq: "phn", name: "Polski Holding Nieruchomości", sector: "Nieruchomości", price: 42, change24h: 0, change7d: 0, cap: 1800, pe: 0, div: 4.8 },
  { id: 59, ticker: "FCE", stooq: "fce", name: "Force Entertainment", sector: "Rozrywka", price: 3.4, change24h: 0, change7d: 0, cap: 120, pe: 0, div: 0 },
  { id: 60, ticker: "ELT", stooq: "elt", name: "Eltel Networks", sector: "Telekomunikacja", price: 8.9, change24h: 0, change7d: 0, cap: 340, pe: 0, div: 0 },
];

const COMMODITIES = [
  { id: 101, ticker: "XAU", stooq: "xau", name: "Złoto", sector: "Metal szlachetny", price: 0, change24h: 0, change7d: 0, unit: "USD/oz" },
  { id: 102, ticker: "XAG", stooq: "xag", name: "Srebro", sector: "Metal szlachetny", price: 0, change24h: 0, change7d: 0, unit: "USD/oz" },
  { id: 103, ticker: "CL", stooq: "cl.f", name: "Ropa naftowa WTI", sector: "Energia", price: 0, change24h: 0, change7d: 0, unit: "USD/bbl" },
  { id: 104, ticker: "NG", stooq: "ng.f", name: "Gaz ziemny", sector: "Energia", price: 0, change24h: 0, change7d: 0, unit: "USD/MMBtu" },
  { id: 105, ticker: "HG", stooq: "hg.f", name: "Miedź", sector: "Metal przemysłowy", price: 0, change24h: 0, change7d: 0, unit: "USD/lb" },
  { id: 106, ticker: "WEAT", stooq: "weat.us", name: "Pszenica", sector: "Rolnictwo", price: 0, change24h: 0, change7d: 0, unit: "USD/bu" },
  { id: 107, ticker: "CORN", stooq: "corn.us", name: "Kukurydza", sector: "Rolnictwo", price: 0, change24h: 0, change7d: 0, unit: "USD/bu" },
  { id: 108, ticker: "SOY", stooq: "soy.us", name: "Soja", sector: "Rolnictwo", price: 0, change24h: 0, change7d: 0, unit: "USD/bu" },
  { id: 109, ticker: "XPT", stooq: "xpt", name: "Platyna", sector: "Metal szlachetny", price: 0, change24h: 0, change7d: 0, unit: "USD/oz" },
  { id: 110, ticker: "XPD", stooq: "xpd", name: "Pallad", sector: "Metal szlachetny", price: 0, change24h: 0, change7d: 0, unit: "USD/oz" },
];

const FEAR_COMPONENTS = [
  { label: "Momentum rynku", val: 68 },
  { label: "Siła wolumenu", val: 55 },
  { label: "Szerokość rynku", val: 72 },
  { label: "Zmienność (VIX GPW)", val: 44 },
  { label: "Put/Call ratio", val: 60 },
  { label: "Popyt na bezpieczne aktywa", val: 38 },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

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
    <svg width="60" height="32" viewBox="0 0 100 40" style={{ display: "block" }}>
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

function ProfitCalculatorModal({ stock, currentPrice, onClose, theme }) {
  const [shares, setShares] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const isMobile = useIsMobile();

  const sharesNum = parseFloat(shares) || 0;
  const buyPriceNum = parseFloat(buyPrice.replace(",", ".")) || 0;

  const purchaseCost = sharesNum * buyPriceNum;
  const currentValue = sharesNum * (currentPrice || 0);
  const profitPLN = currentValue - purchaseCost;
  const profitPct = buyPriceNum > 0 ? ((currentPrice - buyPriceNum) / buyPriceNum) * 100 : 0;
  const hasCalc = sharesNum > 0 && buyPriceNum > 0;
  const color = profitPLN >= 0 ? "#00c896" : "#ff4d6d";
  const sign = (v) => (v >= 0 ? "+" : "");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 8 : 24 }} onClick={onClose}>
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderInput}`, borderRadius: 20, padding: isMobile ? 20 : 32, width: "100%", maxWidth: 460 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #1f6feb22, #58a6ff33)", border: "1px solid #58a6ff44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🧮</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: theme.textBright }}>Kalkulator zysku/straty</div>
              <div style={{ fontSize: 11, color: theme.textSecondary }}>{stock.ticker} · {stock.name}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: theme.bgCardAlt, border: "none", borderRadius: 8, color: theme.textSecondary, width: 32, height: 32, fontSize: 18, cursor: "pointer" }}>×</button>
        </div>

        <div style={{ background: theme.bgCardAlt, borderRadius: 10, padding: "10px 14px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: theme.textSecondary }}>Kurs bieżący</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: theme.textBright }}>{fmt(currentPrice)} {stock.unit || "zł"}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Liczba akcji</label>
            <input type="number" value={shares} onChange={e => setShares(e.target.value)} placeholder="np. 100" min="0"
              style={{ width: "100%", background: theme.bgPage, border: `1px solid ${theme.borderInput}`, borderRadius: 8, padding: "10px 12px", color: theme.text, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Cena zakupu ({stock.unit || "zł"})</label>
            <input type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} placeholder={`np. ${fmt(currentPrice)}`} min="0" step="0.01"
              style={{ width: "100%", background: theme.bgPage, border: `1px solid ${theme.borderInput}`, borderRadius: 8, padding: "10px 12px", color: theme.text, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
          </div>
        </div>

        {hasCalc ? (
          <div style={{ borderRadius: 12, border: `1px solid ${color}44`, background: `${color}0f`, padding: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div style={{ background: theme.bgCardAlt, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 4 }}>Wartość zakupu</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: theme.textBright }}>{fmt(purchaseCost)} {stock.unit || "zł"}</div>
              </div>
              <div style={{ background: theme.bgCardAlt, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 4 }}>Wartość bieżąca</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: theme.textBright }}>{fmt(currentValue)} {stock.unit || "zł"}</div>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${color}33`, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 4 }}>Zysk / Strata</div>
                <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 800, color }}>{sign(profitPLN)}{fmt(profitPLN)} {stock.unit || "zł"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 4 }}>Zwrot</div>
                <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 800, color }}>{sign(profitPct)}{fmt(profitPct)}%</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0", color: theme.textSecondary, fontSize: 12 }}>
            Wprowadź liczbę akcji i cenę zakupu, aby zobaczyć wynik
          </div>
        )}
      </div>
    </div>
  );
}

function StockModal({ stock, price, change24h, change7d, onClose, theme }) {
  const [history, setHistory] = useState(null);
  const [range, setRange] = useState("1M");
  const isMobile = useIsMobile();
  const [news, setNews] = useState(null);
  const fmtN = (n, d = 2) => n?.toLocaleString("pl-PL", { minimumFractionDigits: d, maximumFractionDigits: d }) ?? "—";
  const changeFmt = (v) => `${v > 0 ? "+" : ""}${fmtN(v)}%`;
  const color = change24h >= 0 ? "#00c896" : "#ff4d6d";

  useEffect(() => {
    fetchHistory(stock.stooq || stock.ticker.toLowerCase()).then(d => setHistory(d?.prices || null));
    fetch(`/api/news?q=${encodeURIComponent(stock.name)}`)
      .then(r => r.json())
      .then(d => setNews(d?.items || []))
      .catch(() => setNews([]));
  }, [stock.ticker, stock.name]);

  const filterHistory = () => {
    if (!history) return [];
    const days = { "1W": 7, "1M": 30, "3M": 90, "1R": 365 };
    return history.slice(-(days[range] || 30));
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 8 : 24 }} onClick={onClose}>
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderInput}`, borderRadius: 20, padding: isMobile ? 20 : 32, width: "100%", maxWidth: 720, maxHeight: "95vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg, #1f6feb22, #58a6ff33)", border: "1px solid #58a6ff44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: theme.accent }}>{stock.ticker.slice(0, 2)}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: isMobile ? 16 : 20, color: theme.textBright }}>{stock.ticker}</div>
              <div style={{ fontSize: 11, color: theme.textSecondary }}>{stock.name} · {stock.sector}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: theme.bgCardAlt, border: "none", borderRadius: 8, color: theme.textSecondary, width: 32, height: 32, fontSize: 18, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: theme.textBright }}>{fmtN(price)} {stock.unit || "zł"}</div>
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            <span style={{ padding: "4px 12px", borderRadius: 6, background: `${color}20`, color, fontWeight: 700, fontSize: 13 }}>24h: {changeFmt(change24h)}</span>
            <span style={{ padding: "4px 12px", borderRadius: 6, background: `${color}20`, color, fontWeight: 700, fontSize: 13 }}>7d: {changeFmt(change7d)}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {["1W", "1M", "3M", "1R"].map(r => (
            <button key={r} onClick={() => setRange(r)} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid", borderColor: range === r ? theme.accent : theme.borderInput, background: range === r ? "#1f6feb22" : "transparent", color: range === r ? theme.accent : theme.textSecondary, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{r}</button>
          ))}
        </div>
        <div style={{ background: theme.bgPage, borderRadius: 12, padding: "12px 8px", marginBottom: 20 }}>
          <MiniChart data={filterHistory()} color={color} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            ["Kapitalizacja", stock.cap ? `${fmtN(stock.cap, 0)} mln zł` : "—"],
            ["C/Z (P/E)", stock.pe > 0 ? fmtN(stock.pe) : "—"],
            ["Dywidenda", stock.div > 0 ? `${fmtN(stock.div)}%` : "Brak"],
            ["Sektor", stock.sector],
          ].map(([label, val]) => (
            <div key={label} style={{ background: theme.bgCardAlt, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: theme.textBright }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
            Najnowsze wiadomości
          </div>
          {news === null && (
            <div style={{ color: theme.textSecondary, fontSize: 12, padding: "12px 0" }}>Ładowanie wiadomości...</div>
          )}
          {news !== null && news.length === 0 && (
            <div style={{ color: theme.textSecondary, fontSize: 12, padding: "12px 0" }}>Brak wiadomości.</div>
          )}
          {news !== null && news.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              style={{ display: "block", textDecoration: "none", padding: "10px 0", borderBottom: `1px solid ${theme.border}` }}
            >
              <div style={{ fontSize: 13, color: theme.textBright, lineHeight: 1.4, marginBottom: 4 }}>{item.title}</div>
              <div style={{ display: "flex", gap: 12, fontSize: 11, color: theme.textSecondary }}>
                {item.source && <span>{item.source}</span>}
                {item.pubDate && <span>{new Date(item.pubDate).toLocaleDateString("pl-PL")}</span>}
              </div>
            </a>
          ))}
        </div>
        <a href={`https://stooq.pl/q/?s=${stock.stooq || stock.ticker.toLowerCase()}`} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", color: theme.accent, fontSize: 12, textDecoration: "none" }}>
          Zobacz pełne dane na stooq.pl →
        </a>
      </div>
    </div>
  );
}

function FearGauge({ value = 62, isMobile, theme }) {
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
    <div style={{ background: theme.fearGaugeBg, border: `1px solid ${theme.border}`, borderRadius: 16, padding: "20px", display: "flex", flexDirection: isMobile ? "row" : "column", alignItems: "center", gap: isMobile ? 16 : 0 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ color: theme.textSecondary, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Fear & Greed</div>
        <svg width={isMobile ? 140 : 200} height={isMobile ? 77 : 110} viewBox="0 0 200 110">
          {arcPath(0, 36, 75, "#ff2244")}{arcPath(36, 72, 75, "#ff6b35")}{arcPath(72, 108, 75, "#ffd700")}{arcPath(108, 144, 75, "#7ecb5f")}{arcPath(144, 180, 75, "#00e676")}
          <g transform={`rotate(${angle}, 100, 90)`} style={{ transition: "transform 1.2s cubic-bezier(0.34,1.2,0.64,1)" }}>
            <line x1="100" y1="90" x2="100" y2="24" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="100" cy="90" r="5" fill={color} />
          </g>
          <circle cx="100" cy="90" r="3" fill={theme.bgCard} />
        </svg>
        <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1, marginTop: -6 }}>{value}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color, marginTop: 4 }}>{getLabel(value)}</div>
      </div>
      {!isMobile && (
        <div style={{ marginTop: 16, width: "100%" }}>
          {FEAR_COMPONENTS.map((f) => (
            <div key={f.label} style={{ marginBottom: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: theme.textSecondary, marginBottom: 2 }}>
                <span>{f.label}</span><span style={{ color: getColor(f.val) }}>{f.val}</span>
              </div>
              <div style={{ height: 3, background: theme.border, borderRadius: 4 }}>
                <div style={{ height: "100%", borderRadius: 4, width: animated ? `${f.val}%` : "0%", background: getColor(f.val), transition: "width 1s cubic-bezier(0.34,1.2,0.64,1)", transitionDelay: "0.3s" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const fmt = (n, d = 2) => n?.toLocaleString("pl-PL", { minimumFractionDigits: d, maximumFractionDigits: d }) ?? "—";

export default function WigMarkets() {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState("akcje");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("cap");
  const [sortDir, setSortDir] = useState("desc");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [prices, setPrices] = useState(() => Object.fromEntries([...STOCKS, ...COMMODITIES].map(s => [s.ticker, s.price])));
  const [changes, setChanges] = useState({});
  const [selected, setSelected] = useState(null);
  const [calcStock, setCalcStock] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") !== "light");
  const [indices, setIndices] = useState([]);
  const PER_PAGE = isMobile ? 20 : 20;
  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.style.background = theme.bgPage;
  }, [darkMode, theme.bgPage]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchIndices();
      if (data.length) setIndices(data);
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const activeData = tab === "akcje" ? STOCKS : COMMODITIES;
    const fetchAll = async () => {
      for (const item of activeData) {
        const data = await fetchStooq(item.stooq || item.ticker.toLowerCase());
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
      if (sortBy === "price") { av = prices[a.ticker] || 0; bv = prices[b.ticker] || 0; }
      if (sortBy === "change24h") { av = changes[a.ticker]?.change24h ?? 0; bv = changes[b.ticker]?.change24h ?? 0; }
      if (sortBy === "change7d") { av = changes[a.ticker]?.change7d ?? 0; bv = changes[b.ticker]?.change7d ?? 0; }
      return sortDir === "desc" ? bv - av : av - bv;
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const handleSort = (col) => { if (sortBy === col) setSortDir(d => d === "desc" ? "asc" : "desc"); else { setSortBy(col); setSortDir("desc"); } };
  const col = (label, key, right = true) => (
    <th onClick={() => handleSort(key)} style={{ padding: isMobile ? "8px 8px" : "10px 16px", textAlign: right ? "right" : "left", fontSize: 10, color: sortBy === key ? theme.accent : theme.textSecondary, cursor: "pointer", whiteSpace: "nowrap", userSelect: "none", borderBottom: `1px solid ${theme.border}`, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
      {label} {sortBy === key ? (sortDir === "desc" ? "↓" : "↑") : ""}
    </th>
  );
  const changeColor = (v) => v > 0 ? "#00c896" : v < 0 ? "#ff4d6d" : "#8b949e";
  const changeFmt = (v) => `${v > 0 ? "+" : ""}${fmt(v)}%`;

  const fmtIdx = (v) => v != null ? v.toLocaleString("pl-PL", { maximumFractionDigits: 2 }) : "—";
  const fmtIdxChange = (v) => v != null ? `${v >= 0 ? "+" : ""}${v.toFixed(2)}%` : "—";

  return (
    <div style={{ minHeight: "100vh", background: theme.bgPage, color: theme.text, fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>

      {selected && <StockModal stock={selected} price={prices[selected.ticker]} change24h={changes[selected.ticker]?.change24h ?? 0} change7d={changes[selected.ticker]?.change7d ?? 0} onClose={() => setSelected(null)} theme={theme} />}
      {calcStock && <ProfitCalculatorModal stock={calcStock} currentPrice={prices[calcStock.ticker]} onClose={() => setCalcStock(null)} theme={theme} />}

      {/* Top bar */}
      <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}`, padding: "0 16px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: isMobile ? 16 : 32, padding: "10px 0", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: theme.textBright, whiteSpace: "nowrap" }}>WIG<span style={{ color: theme.accent }}>markets</span></div>
          {!isMobile && indices.map(idx => (
            <div key={idx.name} style={{ display: "flex", gap: 8, alignItems: "baseline", whiteSpace: "nowrap" }}>
              <span style={{ color: theme.accent, fontWeight: 700, fontSize: 11 }}>{idx.name}</span>
              <span style={{ fontSize: 12, color: theme.textBright }}>{fmtIdx(idx.value)}</span>
              <span style={{ fontSize: 11, color: idx.change24h >= 0 ? "#00c896" : "#ff4d6d" }}>{fmtIdxChange(idx.change24h)}</span>
            </div>
          ))}
          {isMobile && indices.slice(0, 2).map(idx => (
            <div key={idx.name} style={{ display: "flex", gap: 6, alignItems: "baseline", whiteSpace: "nowrap" }}>
              <span style={{ color: theme.accent, fontWeight: 700, fontSize: 10 }}>{idx.name}</span>
              <span style={{ fontSize: 11, color: idx.change24h >= 0 ? "#00c896" : "#ff4d6d" }}>{fmtIdxChange(idx.change24h)}</span>
            </div>
          ))}
          <button onClick={() => setDarkMode(d => !d)} style={{ marginLeft: "auto", background: theme.bgCardAlt, border: `1px solid ${theme.border}`, borderRadius: 6, color: theme.textSecondary, padding: "4px 10px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          {isMobile && (
            <button onClick={() => setSidebarOpen(o => !o)} style={{ background: theme.bgCardAlt, border: `1px solid ${theme.border}`, borderRadius: 6, color: theme.textSecondary, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
              {sidebarOpen ? "✕" : "📊"}
            </button>
          )}
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div style={{ padding: "16px", background: theme.bgCard, borderBottom: `1px solid ${theme.border}` }}>
          <FearGauge value={62} isMobile={true} theme={theme} />
        </div>
      )}

      <div style={{ padding: isMobile ? "16px 12px 0" : "24px 24px 0", maxWidth: 1400, margin: "0 auto" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {[["akcje", "🏛️ Akcje GPW"], ["surowce", "🥇 Surowce"]].map(([key, label]) => (
            <button key={key} onClick={() => { setTab(key); setPage(1); setFilter("all"); }} style={{ padding: isMobile ? "6px 14px" : "8px 20px", borderRadius: 8, border: "1px solid", borderColor: tab === key ? theme.accent : theme.borderInput, background: tab === key ? "#1f6feb22" : "transparent", color: tab === key ? theme.accent : theme.textSecondary, fontSize: isMobile ? 12 : 13, fontWeight: tab === key ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", display: isMobile ? "block" : "grid", gridTemplateColumns: "1fr 280px", gap: 24, padding: isMobile ? "0 12px" : "0 24px" }}>
        <div>
          {/* Controls */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Szukaj..."
              style={{ flex: 1, minWidth: 140, background: theme.bgCard, border: `1px solid ${theme.borderInput}`, borderRadius: 8, padding: "7px 12px", color: theme.text, fontSize: 12, outline: "none", fontFamily: "inherit" }} />
            <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}
              style={{ background: theme.bgCard, border: `1px solid ${theme.borderInput}`, borderRadius: 8, padding: "7px 10px", color: theme.text, fontSize: 11, cursor: "pointer", fontFamily: "inherit", outline: "none" }}>
              {sectors.map(s => <option key={s} value={s}>{s === "all" ? "Wszystkie sektory" : s}</option>)}
            </select>
          </div>

          {/* Table */}
          <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 12 : 13, minWidth: isMobile ? "auto" : 600 }}>
                <thead>
                  <tr>
                    {!isMobile && col("#", "id", false)}
                    <th style={{ padding: isMobile ? "8px 10px" : "10px 16px", textAlign: "left", fontSize: 10, color: theme.textSecondary, borderBottom: `1px solid ${theme.border}`, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Instrument</th>
                    {col("Kurs", "price")}
                    {col("24h %", "change24h")}
                    {!isMobile && col("7d %", "change7d")}
                    {!isMobile && tab === "akcje" && col("Kap.", "cap")}
                    {!isMobile && <th style={{ padding: "10px 16px", textAlign: "right", fontSize: 10, color: theme.textSecondary, borderBottom: `1px solid ${theme.border}`, fontWeight: 600 }}>7D</th>}
                    <th style={{ padding: isMobile ? "8px 8px" : "10px 16px", borderBottom: `1px solid ${theme.border}` }}></th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((s, i) => {
                    const currentPrice = prices[s.ticker];
                    const c24h = changes[s.ticker]?.change24h ?? 0;
                    const c7d = changes[s.ticker]?.change7d ?? 0;
                    const priceColor = c24h > 0 ? "#00c896" : c24h < 0 ? "#ff4d6d" : "#c9d1d9";
                    return (
                      <tr key={s.id} onClick={() => setSelected(s)} style={{ borderBottom: `1px solid ${theme.bgCardAlt}`, cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = theme.bgCardAlt}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        {!isMobile && <td style={{ padding: "10px 16px", color: theme.textSecondary, fontSize: 11 }}>{(page - 1) * PER_PAGE + i + 1}</td>}
                        <td style={{ padding: isMobile ? "10px 10px" : "10px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 6, background: "linear-gradient(135deg, #1f6feb22, #58a6ff33)", border: "1px solid #58a6ff44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#58a6ff", flexShrink: 0 }}>{s.ticker.slice(0, 2)}</div>
                            <div>
                              <div style={{ fontWeight: 700, color: theme.textBright, fontSize: isMobile ? 12 : 13 }}>{s.ticker}</div>
                              {!isMobile && <div style={{ fontSize: 10, color: theme.textSecondary }}>{s.name}</div>}
                              {isMobile && <div style={{ fontSize: 10, color: theme.textSecondary, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: isMobile ? "10px 8px" : "10px 16px", textAlign: "right", fontWeight: 700, color: priceColor, fontSize: isMobile ? 12 : 13, whiteSpace: "nowrap" }}>{fmt(currentPrice)} {s.unit || "zł"}</td>
                        <td style={{ padding: isMobile ? "10px 8px" : "10px 16px", textAlign: "right" }}>
                          <span style={{ padding: "2px 6px", borderRadius: 5, fontSize: isMobile ? 11 : 12, fontWeight: 700, background: c24h > 0 ? "#00c89620" : "#ff4d6d20", color: changeColor(c24h), whiteSpace: "nowrap" }}>{changeFmt(c24h)}</span>
                        </td>
                        {!isMobile && <td style={{ padding: "10px 16px", textAlign: "right", color: changeColor(c7d), fontSize: 12 }}>{changeFmt(c7d)}</td>}
                        {!isMobile && tab === "akcje" && <td style={{ padding: "10px 16px", textAlign: "right", color: theme.textSecondary, fontSize: 12 }}>{fmt(s.cap, 0)}</td>}
                        {!isMobile && <td style={{ padding: "10px 16px", textAlign: "right" }}><Sparkline trend={c7d} /></td>}
                        <td style={{ padding: isMobile ? "6px 8px" : "10px 16px", textAlign: "right" }}>
                          <button
                            onClick={e => { e.stopPropagation(); setCalcStock(s); }}
                            style={{ padding: isMobile ? "4px 7px" : "5px 11px", borderRadius: 6, border: `1px solid ${theme.borderInput}`, background: "transparent", color: theme.textSecondary, fontSize: isMobile ? 12 : 11, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", lineHeight: 1.2 }}
                            title="Kalkulator zysku/straty"
                          >
                            {isMobile ? "🧮" : "Kalkulator"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${theme.border}`, flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: 11, color: theme.textSecondary }}>{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} z {filtered.length}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{ width: 26, height: 26, borderRadius: 5, border: "1px solid", borderColor: p === page ? theme.accent : theme.borderInput, background: p === page ? "#1f6feb22" : "transparent", color: p === page ? theme.accent : theme.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        {!isMobile && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FearGauge value={62} isMobile={false} theme={theme} />
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Top wzrosty 24h</div>
              {[...STOCKS].sort((a, b) => (changes[b.ticker]?.change24h ?? 0) - (changes[a.ticker]?.change24h ?? 0)).slice(0, 5).map(s => (
                <div key={s.ticker} onClick={() => setSelected(s)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${theme.bgCardAlt}`, cursor: "pointer" }}>
                  <div><div style={{ fontWeight: 700, fontSize: 12, color: theme.textBright }}>{s.ticker}</div><div style={{ fontSize: 10, color: theme.textSecondary }}>{s.sector}</div></div>
                  <span style={{ padding: "2px 7px", borderRadius: 5, fontSize: 11, fontWeight: 700, background: "#00c89620", color: "#00c896" }}>{changeFmt(changes[s.ticker]?.change24h ?? 0)}</span>
                </div>
              ))}
            </div>
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Top spadki 24h</div>
              {[...STOCKS].sort((a, b) => (changes[a.ticker]?.change24h ?? 0) - (changes[b.ticker]?.change24h ?? 0)).slice(0, 5).map(s => (
                <div key={s.ticker} onClick={() => setSelected(s)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${theme.bgCardAlt}`, cursor: "pointer" }}>
                  <div><div style={{ fontWeight: 700, fontSize: 12, color: theme.textBright }}>{s.ticker}</div><div style={{ fontSize: 10, color: theme.textSecondary }}>{s.sector}</div></div>
                  <span style={{ padding: "2px 7px", borderRadius: 5, fontSize: 11, fontWeight: 700, background: "#ff4d6d20", color: "#ff4d6d" }}>{changeFmt(changes[s.ticker]?.change24h ?? 0)}</span>
                </div>
              ))}
            </div>
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Statystyki rynku</div>
              {[
                ["Spółki rosnące", `${STOCKS.filter(s => (changes[s.ticker]?.change24h ?? 0) > 0).length}/${STOCKS.length}`, "#00c896"],
                ["Kap. łączna (mld zł)", fmt(STOCKS.reduce((a, s) => a + s.cap, 0) / 1000, 1), "#58a6ff"],
                ["Śr. zmiana 24h", changeFmt(STOCKS.reduce((a, s) => a + (changes[s.ticker]?.change24h ?? 0), 0) / STOCKS.length), "#ffd700"],
              ].map(([label, val, color]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${theme.bgCardAlt}`, fontSize: 11 }}>
                  <span style={{ color: theme.textSecondary }}>{label}</span>
                  <span style={{ fontWeight: 700, color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "24px", fontSize: 10, color: theme.textSecondary }}>
        WIGmarkets © 2026 · Dane z GPW via stooq.pl · Nie stanowią rekomendacji inwestycyjnej
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<WigMarkets />);

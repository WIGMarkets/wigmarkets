import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { fmt, changeFmt, changeColor } from "../utils.js";
import StockLogo from "./StockLogo.jsx";
import Icon from "./edukacja/Icon.jsx";

const LS_KEY = "portfolio_v1";

function load() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}
function save(positions) {
  localStorage.setItem(LS_KEY, JSON.stringify(positions));
}

function sign(v) { return v >= 0 ? "+" : ""; }

export default function PortfolioPage({ theme, prices, allInstruments }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [positions, setPositions] = useState(load);
  const [form, setForm] = useState({ ticker: "", shares: "", buyPrice: "" });
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);

  const updatePositions = (next) => { setPositions(next); save(next); };

  const handleAdd = () => {
    const ticker = form.ticker.toUpperCase().trim();
    const shares = parseFloat(form.shares.replace(",", "."));
    const buyPrice = parseFloat(form.buyPrice.replace(",", "."));
    if (!ticker)               { setError("Wpisz ticker"); return; }
    if (!shares || shares <= 0) { setError("Liczba akcji musi być > 0"); return; }
    if (!buyPrice || buyPrice <= 0) { setError("Cena musi być > 0"); return; }
    const instrument = allInstruments.find(s => s.ticker === ticker);
    if (!instrument)           { setError(`Nie znaleziono instrumentu: ${ticker}`); return; }
    setError("");

    if (editId != null) {
      updatePositions(positions.map(p => p.id === editId ? { ...p, ticker, shares, buyPrice } : p));
      setEditId(null);
    } else {
      updatePositions([...positions, { id: Date.now(), ticker, shares, buyPrice }]);
    }
    setForm({ ticker: "", shares: "", buyPrice: "" });
  };

  const handleEdit = (p) => {
    setForm({ ticker: p.ticker, shares: String(p.shares), buyPrice: String(p.buyPrice) });
    setEditId(p.id);
  };

  const handleDelete = (id) => updatePositions(positions.filter(p => p.id !== id));

  const handleCancel = () => { setForm({ ticker: "", shares: "", buyPrice: "" }); setEditId(null); setError(""); };

  const enriched = useMemo(() => positions.map(p => {
    const instr = allInstruments.find(s => s.ticker === p.ticker);
    const currentPrice = prices[p.ticker];
    const purchaseCost = p.shares * p.buyPrice;
    const currentValue = p.shares * (currentPrice || 0);
    const profit = currentValue - purchaseCost;
    const profitPct = p.buyPrice > 0 ? ((currentPrice - p.buyPrice) / p.buyPrice) * 100 : 0;
    return { ...p, instr, currentPrice, purchaseCost, currentValue, profit, profitPct };
  }), [positions, prices]);

  const totals = useMemo(() => {
    const cost  = enriched.reduce((a, p) => a + p.purchaseCost, 0);
    const value = enriched.reduce((a, p) => a + p.currentValue, 0);
    return { cost, value, profit: value - cost, profitPct: cost > 0 ? ((value - cost) / cost) * 100 : 0 };
  }, [enriched]);

  const inputStyle = {
    background: theme.bgPage,
    border: `1px solid ${theme.borderInput}`,
    borderRadius: 8,
    padding: "9px 12px",
    color: theme.text,
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bgPage, color: theme.text, fontFamily: "var(--font-ui)" }}>
      {/* Header */}
      <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}`, padding: "12px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: `1px solid ${theme.border}`, color: theme.text, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="arrow-left" size={14} /> Powrót</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: theme.textBright }}>Portfolio</div>
          <div style={{ fontSize: 11, color: theme.textSecondary }}>Śledź swoje pozycje w czasie rzeczywistym</div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "16px 14px" : "28px 32px" }}>

        {/* Summary bar */}
        {positions.length > 0 && (
          <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 24, display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12 }}>
            {[
              ["Wartość portfela", `${fmt(totals.value)} zł`, theme.textBright],
              ["Koszt zakupu", `${fmt(totals.cost)} zł`, theme.textSecondary],
              ["Zysk / Strata", `${sign(totals.profit)}${fmt(totals.profit)} zł`, totals.profit >= 0 ? "#22c55e" : "#ef4444"],
              ["Zwrot", `${sign(totals.profitPct)}${fmt(totals.profitPct)}%`, totals.profit >= 0 ? "#22c55e" : "#ef4444"],
            ].map(([label, val, color]) => (
              <div key={label}>
                <div style={{ fontSize: 10, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, color }}>{val}</div>
              </div>
            ))}
          </div>
        )}

        {/* Add / Edit form */}
        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: isMobile ? 16 : 22, marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: theme.textBright, marginBottom: 14 }}>
            {editId != null ? "Edytuj pozycję" : "Dodaj pozycję"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
            <div>
              <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Ticker</label>
              <input style={inputStyle} placeholder="np. PKN" value={form.ticker} onChange={e => setForm(f => ({ ...f, ticker: e.target.value.toUpperCase() }))} onKeyDown={e => e.key === "Enter" && handleAdd()} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Liczba akcji</label>
              <input style={inputStyle} type="number" placeholder="100" min="0" value={form.shares} onChange={e => setForm(f => ({ ...f, shares: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleAdd()} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Cena zakupu (zł)</label>
              <input style={inputStyle} type="number" placeholder="50.00" min="0" step="0.01" value={form.buyPrice} onChange={e => setForm(f => ({ ...f, buyPrice: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleAdd()} />
            </div>
            <div style={{ display: "flex", gap: 6, ...(isMobile ? { gridColumn: "1/-1" } : {}) }}>
              <button onClick={handleAdd} style={{ flex: 1, padding: "9px 18px", borderRadius: 8, border: "none", background: theme.accent, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                {editId != null ? "Zapisz" : "+ Dodaj"}
              </button>
              {editId != null && (
                <button onClick={handleCancel} style={{ padding: "9px 14px", borderRadius: 8, border: `1px solid ${theme.border}`, background: "transparent", color: theme.textSecondary, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Anuluj</button>
              )}
            </div>
          </div>
          {error && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 10 }}>{error}</div>}
        </div>

        {/* Positions list */}
        {positions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: theme.textSecondary }}>
            <div style={{ marginBottom: 12, color: theme.textSecondary }}><Icon name="chart-bar" size={32} /></div>
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginBottom: 6 }}>Brak pozycji</div>
            <div style={{ fontSize: 13 }}>Dodaj pierwszą pozycję powyżej</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {enriched.map(p => {
              const color = p.profit >= 0 ? "#22c55e" : "#ef4444";
              return (
                <div key={p.id} style={{ background: theme.bgCard, border: `1px solid ${p.profit >= 0 ? "rgba(34,197,94,0.19)" : "rgba(239,68,68,0.19)"}`, borderRadius: 12, padding: isMobile ? "12px 14px" : "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <StockLogo ticker={p.ticker} size={36} borderRadius={9} sector={p.instr?.sector} />
                    <div style={{ flex: 1, minWidth: 120 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: theme.textBright }}>{p.ticker}</div>
                      <div style={{ fontSize: 11, color: theme.textSecondary }}>{p.instr?.name || "—"} · {p.shares} szt. × {fmt(p.buyPrice)} zł</div>
                    </div>
                    {/* Stats */}
                    <div style={{ display: "flex", gap: isMobile ? 12 : 24, flexWrap: "wrap", alignItems: "center" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 2 }}>Kurs bieżący</div>
                        <div style={{ fontWeight: 700, color: theme.textBright }}>{fmt(p.currentPrice)} zł</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 2 }}>Wartość</div>
                        <div style={{ fontWeight: 700, color: theme.textBright }}>{fmt(p.currentValue)} zł</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 2 }}>Zysk / Strata</div>
                        <div style={{ fontWeight: 800, fontSize: 15, color }}>{sign(p.profit)}{fmt(p.profit)} zł</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color }}>{sign(p.profitPct)}{fmt(p.profitPct)}%</div>
                      </div>
                    </div>
                    {/* Actions */}
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleEdit(p)} style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${theme.borderInput}`, background: "transparent", color: theme.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Edytuj</button>
                      <button onClick={() => handleDelete(p.id)} style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid rgba(239,68,68,0.27)", background: "transparent", color: "#ef4444", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Usuń</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

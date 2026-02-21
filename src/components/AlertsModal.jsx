import { useState } from "react";
import { fmt } from "../lib/formatters.js";
import { loadAlerts, saveAlerts } from "../hooks/usePriceAlerts.js";
import Icon from "./edukacja/Icon.jsx";

export default function AlertsModal({ onClose, theme, prices, allInstruments, alerts, setAlerts }) {
  const [form, setForm] = useState({ ticker: "", condition: "above", target: "" });
  const [error, setError] = useState("");
  const [notifAsked, setNotifAsked] = useState(false);

  const requestNotif = async () => {
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
    setNotifAsked(true);
  };

  const handleAdd = () => {
    const ticker = form.ticker.toUpperCase().trim();
    const target = parseFloat(form.target.replace(",", "."));
    if (!ticker)           { setError("Wpisz ticker"); return; }
    if (!target || target <= 0) { setError("Cena musi być > 0"); return; }
    const instr = allInstruments.find(s => s.ticker === ticker);
    if (!instr)            { setError(`Nieznany ticker: ${ticker}`); return; }
    setError("");
    const next = [...alerts, { id: Date.now(), ticker, condition: form.condition, target, triggered: false }];
    saveAlerts(next);
    setAlerts(next);
    setForm(f => ({ ...f, ticker: "", target: "" }));
  };

  const handleDelete = (id) => {
    const next = alerts.filter(a => a.id !== id);
    saveAlerts(next);
    setAlerts(next);
  };

  const handleReset = (id) => {
    const next = alerts.map(a => a.id === id ? { ...a, triggered: false } : a);
    saveAlerts(next);
    setAlerts(next);
  };

  const inputStyle = {
    background: theme.bgPage,
    border: `1px solid ${theme.borderInput}`,
    borderRadius: 8,
    padding: "8px 11px",
    color: theme.text,
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderInput}`, borderRadius: 20, padding: 28, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: theme.textBright, display: "flex", alignItems: "center", gap: 8 }}><Icon name="bell" size={18} /> Alerty cenowe</div>
          <button onClick={onClose} style={{ background: theme.bgCardAlt, border: "none", borderRadius: 8, color: theme.textSecondary, width: 32, height: 32, fontSize: 18, cursor: "pointer" }}>×</button>
        </div>

        {/* Notification permission */}
        {Notification.permission !== "granted" && (
          <div style={{ background: "#ffd70015", border: "1px solid #ffd70044", borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontSize: 12, color: "#ffd700", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Włącz powiadomienia systemowe żeby otrzymywać alerty</span>
            <button onClick={requestNotif} style={{ background: "#ffd700", border: "none", borderRadius: 6, color: "#000", padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginLeft: 8, flexShrink: 0 }}>Włącz</button>
          </div>
        )}

        {/* Form */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, marginBottom: 8, alignItems: "end" }}>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Ticker</label>
            <input style={{ ...inputStyle, width: "100%" }} placeholder="PKN" value={form.ticker} onChange={e => setForm(f => ({ ...f, ticker: e.target.value.toUpperCase() }))} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Warunek</label>
            <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
              style={{ ...inputStyle, cursor: "pointer", height: 38 }}>
              <option value="above">≥ Powyżej</option>
              <option value="below">≤ Poniżej</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Cena</label>
            <input style={{ ...inputStyle, width: "100%" }} type="number" placeholder="100.00" min="0" step="0.01" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleAdd()} />
          </div>
        </div>
        {error && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 8 }}>{error}</div>}
        <button onClick={handleAdd} style={{ width: "100%", padding: "9px 0", borderRadius: 8, border: "none", background: theme.accent, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginBottom: 20 }}>
          + Dodaj alert
        </button>

        {/* List */}
        {alerts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: theme.textSecondary, fontSize: 13 }}>Brak aktywnych alertów</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {alerts.map(a => {
              const currentPrice = prices[a.ticker];
              const condLabel = a.condition === "above" ? "≥" : "≤";
              return (
                <div key={a.id} style={{ background: theme.bgCardAlt, borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: a.triggered ? 0.5 : 1 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: theme.textBright, fontSize: 13 }}>
                      {a.ticker} {condLabel} {fmt(a.target)} {a.triggered && <span style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", borderRadius: 4, padding: "1px 6px", fontSize: 10, marginLeft: 4 }}>Uruchomiony</span>}
                    </div>
                    <div style={{ fontSize: 11, color: theme.textSecondary }}>Kurs bieżący: {currentPrice ? fmt(currentPrice) : "—"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {a.triggered && <button onClick={() => handleReset(a.id)} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${theme.borderInput}`, background: "transparent", color: theme.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Reset</button>}
                    <button onClick={() => handleDelete(a.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(239,68,68,0.27)", background: "transparent", color: "#ef4444", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Usuń</button>
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

import { useState, useMemo } from "react";
import { useIsMobile } from "../../../hooks/useIsMobile.js";

function fmt(n) {
  return n.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Calculator({ type = "compound", title = "Kalkulator inwestycyjny", theme }) {
  const isMobile = useIsMobile();
  const [capital, setCapital] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const r = rate / 100;
    const n = years;
    const fvCapital = capital * Math.pow(1 + r, n);
    const fvMonthly = monthly * 12 * ((Math.pow(1 + r, n) - 1) / r);
    const total = fvCapital + fvMonthly;
    const invested = capital + monthly * 12 * n;
    const profit = total - invested;
    return { total, invested, profit };
  }, [capital, monthly, rate, years]);

  const inputStyle = {
    background: theme.bgCard,
    border: `1px solid ${theme.borderInput}`,
    borderRadius: 8,
    color: theme.textBright,
    padding: "10px 12px",
    fontSize: 16,
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
    minHeight: 44,
  };

  const labelStyle = { fontSize: 12, color: theme.textSecondary, marginBottom: 4, display: "block" };

  return (
    <div style={{
      background: theme.bgCardAlt,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      padding: isMobile ? 16 : 24,
      margin: "24px 0",
    }}>
      <div style={{ fontWeight: 700, fontSize: 15, color: theme.textBright, marginBottom: 20 }}>🧮 {title}</div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <div>
          <label style={labelStyle}>Kapitał początkowy (zł)</label>
          <input type="number" style={inputStyle} value={capital} onChange={e => setCapital(Number(e.target.value))} min={0} step={1000} />
        </div>
        <div>
          <label style={labelStyle}>Miesięczna wpłata (zł)</label>
          <input type="number" style={inputStyle} value={monthly} onChange={e => setMonthly(Number(e.target.value))} min={0} step={100} />
        </div>
        <div>
          <label style={labelStyle}>Stopa zwrotu (%)</label>
          <input type="number" style={inputStyle} value={rate} onChange={e => setRate(Number(e.target.value))} min={0} max={50} step={0.5} />
        </div>
        <div>
          <label style={labelStyle}>Horyzont (lata)</label>
          <input type="number" style={inputStyle} value={years} onChange={e => setYears(Number(e.target.value))} min={1} max={40} step={1} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Łączna wartość portfela", value: `${fmt(result.total)} zł`, color: "#00c896" },
          { label: "Wpłacony kapitał", value: `${fmt(result.invested)} zł`, color: "#58a6ff" },
          { label: "Zysk z inwestycji", value: `${fmt(result.profit)} zł`, color: "#f0883e" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: theme.bgCard, borderRadius: 10, padding: isMobile ? "12px 14px" : "14px 16px", textAlign: "center", border: `1px solid ${theme.border}` }}>
            <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, color, wordBreak: "break-word" }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 12, textAlign: "center" }}>
        * Kalkulator poglądowy. Wyniki historyczne nie gwarantują przyszłych stóp zwrotu. Nie uwzględnia podatków i inflacji.
      </div>
    </div>
  );
}

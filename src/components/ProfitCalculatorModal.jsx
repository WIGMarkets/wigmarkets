import { useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { fmt } from "../utils.js";

export default function ProfitCalculatorModal({ stock, currentPrice, onClose, theme }) {
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
            <div style={{ width: 40, height: 40, borderRadius: 8, background: theme.bgCardAlt, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: theme.accent, fontWeight: 700, fontFamily: "inherit" }}>P/L</div>
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

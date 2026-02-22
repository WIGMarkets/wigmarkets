import { useState, useMemo } from "react";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import Icon from "./Icon.jsx";

function fmtNum(n, decimals = 2) {
  return n.toLocaleString("pl-PL", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const CALCULATORS = {
  pe: {
    title: "Kalkulator P/E",
    inputs: [
      { key: "price", label: "Cena akcji (zł)", default: 109, step: 0.1, min: 0.01 },
      { key: "eps", label: "EPS — zysk na akcję (zł)", default: 12.5, step: 0.1, min: 0.01 },
    ],
    calc: ({ price, eps }) => {
      if (!eps || eps <= 0) return null;
      const pe = price / eps;
      let color = "#22c55e";
      let interpretation = "Niska wycena — spółka może być niedowartościowana (średnia GPW ≈ 12x)";
      if (pe > 20) { color = "#ef4444"; interpretation = "Wysoka wycena — rynek oczekuje dynamicznego wzrostu zysków"; }
      else if (pe > 10) { color = "#f59e0b"; interpretation = "Umiarkowana wycena — bliska średniej rynkowej GPW"; }
      return { value: `${fmtNum(pe, 1)}x`, color, interpretation };
    },
  },
  "stopa-dywidendy": {
    title: "Kalkulator stopy dywidendy",
    inputs: [
      { key: "dividend", label: "Dywidenda na akcję (zł)", default: 2.5, step: 0.1, min: 0 },
      { key: "price", label: "Cena akcji (zł)", default: 45, step: 0.1, min: 0.01 },
    ],
    calc: ({ dividend, price }) => {
      if (!price || price <= 0) return null;
      const rate = (dividend / price) * 100;
      const netRate = rate * 0.81;
      let color = "#22c55e";
      let interpretation = `Stopa netto (po 19% podatku Belki): ${fmtNum(netRate, 1)}%. Dla porównania — lokata bankowa: ~5%`;
      if (rate < 2) { color = "#64748b"; interpretation = `Niska stopa dywidendy (netto ${fmtNum(netRate, 1)}%). Poniżej oprocentowania lokat bankowych`; }
      else if (rate > 7) { color = "#f59e0b"; interpretation = `Bardzo wysoka stopa (netto ${fmtNum(netRate, 1)}%). Sprawdź, czy spółka utrzyma dywidendę na tym poziomie`; }
      return { value: `${fmtNum(rate, 2)}%`, color, interpretation };
    },
  },
  kapitalizacja: {
    title: "Kalkulator kapitalizacji rynkowej",
    inputs: [
      { key: "price", label: "Cena akcji (zł)", default: 109, step: 0.1, min: 0.01 },
      { key: "shares", label: "Liczba akcji (mln)", default: 427.7, step: 0.1, min: 0.01 },
    ],
    calc: ({ price, shares }) => {
      if (!price || !shares) return null;
      const cap = (price * shares) / 1000;
      let color = "#3b82f6";
      let interpretation = "Mała spółka (small cap)";
      if (cap >= 10) { color = "#22c55e"; interpretation = "Duża spółka (large cap) — potencjalny składnik WIG20"; }
      else if (cap >= 2) { color = "#f59e0b"; interpretation = "Średnia spółka (mid cap) — potencjalny składnik mWIG40"; }
      return { value: `${fmtNum(cap, 1)} mld zł`, color, interpretation };
    },
  },
  eps: {
    title: "Kalkulator EPS",
    inputs: [
      { key: "netIncome", label: "Zysk netto (mln zł)", default: 420, step: 1, min: 0 },
      { key: "shares", label: "Liczba akcji (mln)", default: 100.1, step: 0.1, min: 0.01 },
    ],
    calc: ({ netIncome, shares }) => {
      if (!shares || shares <= 0) return null;
      const eps = netIncome / shares;
      let color = eps > 0 ? "#22c55e" : "#ef4444";
      let interpretation = eps > 0
        ? `Spółka generuje ${fmtNum(eps, 2)} zł zysku na każdą akcję`
        : "Ujemny EPS — spółka generuje stratę netto";
      return { value: `${fmtNum(eps, 2)} zł`, color, interpretation };
    },
  },
  roe: {
    title: "Kalkulator ROE",
    inputs: [
      { key: "netIncome", label: "Zysk netto (mln zł)", default: 6200, step: 100, min: 0 },
      { key: "equity", label: "Kapitał własny (mln zł)", default: 42000, step: 100, min: 0.01 },
    ],
    calc: ({ netIncome, equity }) => {
      if (!equity || equity <= 0) return null;
      const roe = (netIncome / equity) * 100;
      let color = "#22c55e";
      let interpretation = "Wysoka rentowność — spółka efektywnie wykorzystuje kapitał";
      if (roe < 8) { color = "#ef4444"; interpretation = "Niska rentowność — spółka słabo zarabia na kapitale własnym"; }
      else if (roe < 15) { color = "#f59e0b"; interpretation = "Umiarkowana rentowność — solidny, przeciętny wynik"; }
      return { value: `${fmtNum(roe, 1)}%`, color, interpretation };
    },
  },
  "stop-loss": {
    title: "Kalkulator stop loss",
    inputs: [
      { key: "entry", label: "Cena wejścia (zł)", default: 128, step: 0.1, min: 0.01 },
      { key: "slPercent", label: "Stop loss (%)", default: 10, step: 0.5, min: 0.1, max: 99 },
      { key: "qty", label: "Liczba akcji", default: 100, step: 1, min: 1 },
    ],
    calc: ({ entry, slPercent, qty }) => {
      if (!entry || !slPercent || !qty) return null;
      const slPrice = entry * (1 - slPercent / 100);
      const loss = (entry - slPrice) * qty;
      return {
        value: `${fmtNum(slPrice, 2)} zł`,
        color: "#ef4444",
        interpretation: `Maksymalna strata: ${fmtNum(loss, 2)} zł (${qty} szt. × ${fmtNum(entry - slPrice, 2)} zł)`,
      };
    },
  },
};

export default function GlossaryCalculator({ slug, theme }) {
  const config = CALCULATORS[slug];
  if (!config) return null;

  const isMobile = useIsMobile();
  const [values, setValues] = useState(() =>
    Object.fromEntries(config.inputs.map(i => [i.key, i.default]))
  );

  const result = useMemo(() => config.calc(values), [values, config]);

  const handleChange = (key, raw) => {
    const n = parseFloat(raw);
    setValues(prev => ({ ...prev, [key]: isNaN(n) ? 0 : n }));
  };

  return (
    <div style={{
      background: theme.bgElevated,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      padding: isMobile ? 16 : 20,
      marginBottom: 32,
    }}>
      {/* Header */}
      <div style={{
        fontSize: 11, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.1em", color: theme.accent,
        marginBottom: 16, fontFamily: "var(--font-ui)",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <Icon name="calculator" size={14} />
        {config.title}
      </div>

      {/* Inputs */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile
          ? "1fr"
          : config.inputs.length <= 2 ? "1fr 1fr" : "repeat(3, 1fr)",
        gap: 12,
        marginBottom: 20,
      }}>
        {config.inputs.map(input => (
          <div key={input.key}>
            <label style={{
              display: "block", fontSize: 12, fontWeight: 500,
              color: theme.textSecondary, marginBottom: 6,
              fontFamily: "var(--font-ui)",
            }}>
              {input.label}
            </label>
            <input
              type="number"
              value={values[input.key]}
              onChange={e => handleChange(input.key, e.target.value)}
              min={input.min}
              max={input.max}
              step={input.step}
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "10px 12px",
                background: theme.bgCard,
                border: `1px solid ${theme.borderInput}`,
                borderRadius: 8,
                color: theme.textBright,
                fontSize: 16,
                fontFamily: "var(--font-mono)",
                fontVariantNumeric: "tabular-nums",
                textAlign: "right",
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = theme.accent; }}
              onBlur={e => { e.currentTarget.style.borderColor = theme.borderInput; }}
            />
          </div>
        ))}
      </div>

      {/* Result */}
      {result && (
        <div style={{
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderRadius: 10,
          padding: isMobile ? "14px 16px" : "16px 20px",
          textAlign: "center",
        }}>
          <div style={{
            fontSize: isMobile ? 24 : 28,
            fontWeight: 800,
            color: result.color,
            fontFamily: "var(--font-mono)",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.2,
            marginBottom: 8,
          }}>
            {result.value}
          </div>
          <div style={{
            fontSize: 14,
            color: theme.textSecondary,
            lineHeight: 1.5,
          }}>
            {result.interpretation}
          </div>
        </div>
      )}
    </div>
  );
}

GlossaryCalculator.hasCalculator = (slug) => slug in CALCULATORS;

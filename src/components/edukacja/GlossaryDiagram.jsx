import { useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import Icon from "./Icon.jsx";

/* ─── Shared tooltip hook ─── */
function useTooltip() {
  const [tip, setTip] = useState(null);
  const show = (text, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTip({ text, x: rect.left + rect.width / 2, y: rect.top });
  };
  const hide = () => setTip(null);
  return { tip, show, hide };
}

function Tooltip({ tip, theme }) {
  if (!tip) return null;
  return (
    <div style={{
      position: "fixed", left: tip.x, top: tip.y - 8,
      transform: "translate(-50%, -100%)",
      background: theme.bgElevated,
      border: `1px solid ${theme.border}`,
      borderRadius: 8, padding: "8px 12px",
      fontSize: 12, lineHeight: 1.5, color: theme.textSecondary,
      fontFamily: "var(--font-ui)", maxWidth: 240, textAlign: "center",
      pointerEvents: "none", zIndex: 1000,
      boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
    }}>
      {tip.text}
    </div>
  );
}

/* ─── 1. Formacja świecowa ─── */
function CandlestickDiagram({ theme }) {
  const { tip, show, hide } = useTooltip();
  const w = 360, h = 280;
  const bullOpen = 180, bullClose = 110, bullHigh = 80, bullLow = 220;
  const bearOpen = 110, bearClose = 190, bearHigh = 80, bearLow = 230;

  const candleW = 48;

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ maxWidth: w, display: "block", margin: "0 auto" }}>
        {/* Grid lines */}
        {[80, 110, 150, 190, 220].map(y => (
          <line key={y} x1={20} x2={w - 20} y1={y} y2={y} stroke={theme.border} strokeWidth={0.5} strokeDasharray="4 4" />
        ))}

        {/* ─── Bullish candle (left) ─── */}
        <g>
          {/* Wick */}
          <line x1={100} x2={100} y1={bullHigh} y2={bullLow}
            stroke={theme.green} strokeWidth={2} />
          {/* Body */}
          <rect x={100 - candleW / 2} y={bullClose} width={candleW} height={bullOpen - bullClose}
            fill={theme.green} rx={3}
            style={{ cursor: "pointer" }}
            onMouseEnter={e => show("Zielona (wzrostowa): zamknięcie wyżej niż otwarcie — kupujący dominowali", e)}
            onMouseLeave={hide} />
          {/* High label */}
          <text x={100} y={bullHigh - 10} textAnchor="middle" fontSize={11}
            fill={theme.textSecondary} fontFamily="var(--font-ui)"
            style={{ cursor: "pointer" }}
            onMouseEnter={e => show("High — najwyższa cena w danym okresie", e)}
            onMouseLeave={hide}>
            High
          </text>
          {/* Low label */}
          <text x={100} y={bullLow + 16} textAnchor="middle" fontSize={11}
            fill={theme.textSecondary} fontFamily="var(--font-ui)"
            style={{ cursor: "pointer" }}
            onMouseEnter={e => show("Low — najniższa cena w danym okresie", e)}
            onMouseLeave={hide}>
            Low
          </text>
          {/* Open label */}
          <line x1={100 + candleW / 2 + 4} x2={100 + candleW / 2 + 24} y1={bullOpen} y2={bullOpen}
            stroke={theme.textMuted} strokeWidth={1} strokeDasharray="2 2" />
          <text x={100 + candleW / 2 + 28} y={bullOpen + 4} fontSize={11}
            fill={theme.textMuted} fontFamily="var(--font-ui)"
            style={{ cursor: "pointer" }}
            onMouseEnter={e => show("Open — cena otwarcia (dolna krawędź ciała zielonej świecy)", e)}
            onMouseLeave={hide}>
            Open
          </text>
          {/* Close label */}
          <line x1={100 + candleW / 2 + 4} x2={100 + candleW / 2 + 24} y1={bullClose} y2={bullClose}
            stroke={theme.textMuted} strokeWidth={1} strokeDasharray="2 2" />
          <text x={100 + candleW / 2 + 28} y={bullClose + 4} fontSize={11}
            fill={theme.textMuted} fontFamily="var(--font-ui)"
            style={{ cursor: "pointer" }}
            onMouseEnter={e => show("Close — cena zamknięcia (górna krawędź ciała zielonej świecy)", e)}
            onMouseLeave={hide}>
            Close
          </text>
          {/* Label */}
          <text x={100} y={h - 10} textAnchor="middle" fontSize={12} fontWeight={600}
            fill={theme.green} fontFamily="var(--font-ui)">
            Wzrostowa
          </text>
        </g>

        {/* ─── Bearish candle (right) ─── */}
        <g>
          {/* Wick */}
          <line x1={260} x2={260} y1={bearHigh} y2={bearLow}
            stroke={theme.red} strokeWidth={2} />
          {/* Body */}
          <rect x={260 - candleW / 2} y={bearOpen} width={candleW} height={bearClose - bearOpen}
            fill={theme.red} rx={3}
            style={{ cursor: "pointer" }}
            onMouseEnter={e => show("Czerwona (spadkowa): zamknięcie niżej niż otwarcie — sprzedający dominowali", e)}
            onMouseLeave={hide} />
          {/* High label */}
          <text x={260} y={bearHigh - 10} textAnchor="middle" fontSize={11}
            fill={theme.textSecondary} fontFamily="var(--font-ui)"
            style={{ cursor: "pointer" }}
            onMouseEnter={e => show("High — najwyższa cena w danym okresie", e)}
            onMouseLeave={hide}>
            High
          </text>
          {/* Low label */}
          <text x={260} y={bearLow + 16} textAnchor="middle" fontSize={11}
            fill={theme.textSecondary} fontFamily="var(--font-ui)"
            style={{ cursor: "pointer" }}
            onMouseEnter={e => show("Low — najniższa cena w danym okresie", e)}
            onMouseLeave={hide}>
            Low
          </text>
          {/* Open label */}
          <line x1={260 - candleW / 2 - 4} x2={260 - candleW / 2 - 24} y1={bearOpen} y2={bearOpen}
            stroke={theme.textMuted} strokeWidth={1} strokeDasharray="2 2" />
          <text x={260 - candleW / 2 - 28} y={bearOpen + 4} textAnchor="end" fontSize={11}
            fill={theme.textMuted} fontFamily="var(--font-ui)"
            style={{ cursor: "pointer" }}
            onMouseEnter={e => show("Open — cena otwarcia (górna krawędź ciała czerwonej świecy)", e)}
            onMouseLeave={hide}>
            Open
          </text>
          {/* Close label */}
          <line x1={260 - candleW / 2 - 4} x2={260 - candleW / 2 - 24} y1={bearClose} y2={bearClose}
            stroke={theme.textMuted} strokeWidth={1} strokeDasharray="2 2" />
          <text x={260 - candleW / 2 - 28} y={bearClose + 4} textAnchor="end" fontSize={11}
            fill={theme.textMuted} fontFamily="var(--font-ui)"
            style={{ cursor: "pointer" }}
            onMouseEnter={e => show("Close — cena zamknięcia (dolna krawędź ciała czerwonej świecy)", e)}
            onMouseLeave={hide}>
            Close
          </text>
          {/* Label */}
          <text x={260} y={h - 10} textAnchor="middle" fontSize={12} fontWeight={600}
            fill={theme.red} fontFamily="var(--font-ui)">
            Spadkowa
          </text>
        </g>

        {/* Shadow/wick annotations */}
        {/* Bull upper shadow */}
        <line x1={68} x2={68} y1={bullHigh + 2} y2={bullClose - 2}
          stroke={theme.accent} strokeWidth={1} markerEnd="url(#arrowUp)" markerStart="url(#arrowDown)" />
        <text x={58} y={(bullHigh + bullClose) / 2 + 4} textAnchor="end" fontSize={10}
          fill={theme.accent} fontFamily="var(--font-ui)"
          style={{ cursor: "pointer" }}
          onMouseEnter={e => show("Górny cień (knot) — odległość od szczytu do ciała świecy. Długi górny cień = silna presja sprzedających", e)}
          onMouseLeave={hide}>
          Cień
        </text>
        {/* Bull lower shadow */}
        <line x1={68} x2={68} y1={bullOpen + 2} y2={bullLow - 2}
          stroke={theme.accent} strokeWidth={1} />
        <text x={58} y={(bullOpen + bullLow) / 2 + 4} textAnchor="end" fontSize={10}
          fill={theme.accent} fontFamily="var(--font-ui)"
          style={{ cursor: "pointer" }}
          onMouseEnter={e => show("Dolny cień (knot) — odległość od ciała do minimum. Długi dolny cień = silne wsparcie kupujących", e)}
          onMouseLeave={hide}>
          Cień
        </text>

        <defs>
          <marker id="arrowUp" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto">
            <path d="M0,6 L3,0 L6,6" fill="none" stroke={theme.accent} strokeWidth="1" />
          </marker>
          <marker id="arrowDown" markerWidth="6" markerHeight="6" refX="3" refY="0" orient="auto">
            <path d="M0,0 L3,6 L6,0" fill="none" stroke={theme.accent} strokeWidth="1" />
          </marker>
        </defs>
      </svg>
      <Tooltip tip={tip} theme={theme} />
    </div>
  );
}

/* ─── 2. RSI oscylator ─── */
function RSIDiagram({ theme }) {
  const { tip, show, hide } = useTooltip();
  const w = 400, h = 220;
  const padL = 40, padR = 20, padT = 20, padB = 30;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  // RSI data points (simulated)
  const rsiValues = [45, 52, 58, 65, 72, 78, 82, 75, 68, 55, 42, 35, 28, 22, 30, 38, 48, 55, 62, 70, 65, 58];
  const points = rsiValues.map((v, i) => ({
    x: padL + (i / (rsiValues.length - 1)) * chartW,
    y: padT + ((100 - v) / 100) * chartH,
    v,
  }));
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  const yForVal = v => padT + ((100 - v) / 100) * chartH;

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ maxWidth: w, display: "block", margin: "0 auto" }}>
        {/* Overbought zone */}
        <rect x={padL} y={yForVal(100)} width={chartW} height={yForVal(70) - yForVal(100)}
          fill={theme.red} opacity={0.08} rx={0}
          style={{ cursor: "pointer" }}
          onMouseEnter={e => show("Strefa wykupienia (>70): cena rosła intensywnie, możliwa korekta w dół", e)}
          onMouseLeave={hide} />
        {/* Oversold zone */}
        <rect x={padL} y={yForVal(30)} width={chartW} height={yForVal(0) - yForVal(30)}
          fill={theme.green} opacity={0.08} rx={0}
          style={{ cursor: "pointer" }}
          onMouseEnter={e => show("Strefa wyprzedania (<30): cena spadała intensywnie, możliwe odbicie w górę", e)}
          onMouseLeave={hide} />

        {/* Grid lines at 0, 30, 50, 70, 100 */}
        {[0, 30, 50, 70, 100].map(v => (
          <g key={v}>
            <line x1={padL} x2={padL + chartW} y1={yForVal(v)} y2={yForVal(v)}
              stroke={v === 30 || v === 70 ? theme.accent : theme.border}
              strokeWidth={v === 30 || v === 70 ? 1 : 0.5}
              strokeDasharray={v === 50 ? "4 4" : v === 30 || v === 70 ? "6 3" : "none"} />
            <text x={padL - 6} y={yForVal(v) + 4} textAnchor="end" fontSize={11}
              fill={v === 30 || v === 70 ? theme.accent : theme.textMuted}
              fontFamily="var(--font-mono)" fontWeight={v === 30 || v === 70 ? 600 : 400}>
              {v}
            </text>
          </g>
        ))}

        {/* RSI line */}
        <path d={line} fill="none" stroke={theme.accent} strokeWidth={2.5}
          strokeLinecap="round" strokeLinejoin="round" />

        {/* Peak point (82) */}
        <circle cx={points[6].x} cy={points[6].y} r={5}
          fill={theme.red} stroke={theme.bgCard} strokeWidth={2}
          style={{ cursor: "pointer" }}
          onMouseEnter={e => show("RSI = 82 — silne wykupienie. Historycznie przy takich wartościach następuje korekta spadkowa", e)}
          onMouseLeave={hide} />

        {/* Trough point (22) */}
        <circle cx={points[13].x} cy={points[13].y} r={5}
          fill={theme.green} stroke={theme.bgCard} strokeWidth={2}
          style={{ cursor: "pointer" }}
          onMouseEnter={e => show("RSI = 22 — silne wyprzedanie. To potencjalny sygnał do szukania okazji kupna", e)}
          onMouseLeave={hide} />

        {/* Zone labels */}
        <text x={padL + 6} y={yForVal(85)} fontSize={10} fill={theme.red}
          fontFamily="var(--font-ui)" fontWeight={600} opacity={0.7}>
          WYKUPIENIE
        </text>
        <text x={padL + 6} y={yForVal(15)} fontSize={10} fill={theme.green}
          fontFamily="var(--font-ui)" fontWeight={600} opacity={0.7}>
          WYPRZEDANIE
        </text>

        {/* Y axis */}
        <line x1={padL} x2={padL} y1={padT} y2={padT + chartH} stroke={theme.border} strokeWidth={1} />
      </svg>
      <Tooltip tip={tip} theme={theme} />
    </div>
  );
}

/* ─── 3. Wsparcie i opór ─── */
function SupportResistanceDiagram({ theme }) {
  const { tip, show, hide } = useTooltip();
  const w = 400, h = 240;
  const padL = 10, padR = 10, padT = 20, padB = 20;

  // Price path bouncing between support and resistance
  const pricePoints = [
    [0, 140], [20, 130], [40, 100], [60, 75], [80, 70], [100, 80],
    [120, 100], [130, 120], [140, 140], [155, 135], [170, 105],
    [185, 75], [200, 72], [215, 80], [230, 110], [245, 135],
    [260, 140], [275, 130], [290, 95], [305, 73], [320, 78],
    [340, 100], [355, 130], [370, 140], [385, 130],
  ].map(([x, y]) => [x + padL, y + padT]);

  const priceLine = pricePoints.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");

  const resistanceY = padT + 68;
  const supportY = padT + 142;

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ maxWidth: w, display: "block", margin: "0 auto" }}>
        {/* Resistance zone */}
        <rect x={padL} y={resistanceY - 6} width={w - padL - padR} height={12}
          fill={theme.red} opacity={0.1} rx={2}
          style={{ cursor: "pointer" }}
          onMouseEnter={e => show("Strefa oporu — poziom cenowy, przy którym podaż (sprzedający) regularnie przewyższa popyt. Cena ma trudność z przebiciem tego poziomu w górę", e)}
          onMouseLeave={hide} />
        <line x1={padL} x2={w - padR} y1={resistanceY} y2={resistanceY}
          stroke={theme.red} strokeWidth={1.5} strokeDasharray="8 4" />
        <text x={w - padR - 4} y={resistanceY - 12} textAnchor="end" fontSize={12} fontWeight={700}
          fill={theme.red} fontFamily="var(--font-ui)">
          Opór
        </text>

        {/* Support zone */}
        <rect x={padL} y={supportY - 6} width={w - padL - padR} height={12}
          fill={theme.green} opacity={0.1} rx={2}
          style={{ cursor: "pointer" }}
          onMouseEnter={e => show("Strefa wsparcia — poziom cenowy, przy którym popyt (kupujący) regularnie przewyższa podaż. Cena odbija się od tego poziomu w górę", e)}
          onMouseLeave={hide} />
        <line x1={padL} x2={w - padR} y1={supportY} y2={supportY}
          stroke={theme.green} strokeWidth={1.5} strokeDasharray="8 4" />
        <text x={w - padR - 4} y={supportY + 18} textAnchor="end" fontSize={12} fontWeight={700}
          fill={theme.green} fontFamily="var(--font-ui)">
          Wsparcie
        </text>

        {/* Price line */}
        <path d={priceLine} fill="none" stroke={theme.accent} strokeWidth={2}
          strokeLinecap="round" strokeLinejoin="round" />

        {/* Bounce arrows at support */}
        {[[100, supportY], [215, supportY], [320, supportY]].map(([x, y], i) => (
          <g key={`s${i}`} style={{ cursor: "pointer" }}
            onMouseEnter={e => show("Odbicie od wsparcia — kupujący wchodzą na rynek, broniąc tego poziomu cenowego", e)}
            onMouseLeave={hide}>
            <circle cx={x} cy={y} r={8} fill={theme.green} opacity={0.2} />
            <path d={`M${x - 4},${y + 2} L${x},${y - 4} L${x + 4},${y + 2}`}
              fill="none" stroke={theme.green} strokeWidth={2} strokeLinecap="round" />
          </g>
        ))}

        {/* Rejection arrows at resistance */}
        {[[60, resistanceY], [185, resistanceY], [290, resistanceY]].map(([x, y], i) => (
          <g key={`r${i}`} style={{ cursor: "pointer" }}
            onMouseEnter={e => show("Odrzucenie od oporu — sprzedający przewyższają kupujących, cena zawraca w dół", e)}
            onMouseLeave={hide}>
            <circle cx={x} cy={y} r={8} fill={theme.red} opacity={0.2} />
            <path d={`M${x - 4},${y - 2} L${x},${y + 4} L${x + 4},${y - 2}`}
              fill="none" stroke={theme.red} strokeWidth={2} strokeLinecap="round" />
          </g>
        ))}
      </svg>
      <Tooltip tip={tip} theme={theme} />
    </div>
  );
}

/* ─── 4. SMA ─── */
function SMADiagram({ theme }) {
  const { tip, show, hide } = useTooltip();
  const w = 400, h = 220;
  const padL = 10, padR = 10, padT = 25, padB = 25;
  const chartW = w - padL - padR;

  // Price data (volatile)
  const rawPrice = [120, 118, 125, 122, 128, 124, 130, 127, 135, 132, 138, 140, 136, 142, 139, 145, 143, 148, 144, 150, 147, 152, 155, 150, 148, 145, 140, 138, 142, 136];
  // SMA(7) — smoothed
  const smaWindow = 7;
  const smaValues = rawPrice.map((_, i) => {
    if (i < smaWindow - 1) return null;
    const slice = rawPrice.slice(i - smaWindow + 1, i + 1);
    return slice.reduce((a, b) => a + b, 0) / smaWindow;
  });

  const minP = Math.min(...rawPrice) - 5;
  const maxP = Math.max(...rawPrice) + 5;
  const chartH = h - padT - padB;

  const toXY = (i, v) => ({
    x: padL + (i / (rawPrice.length - 1)) * chartW,
    y: padT + ((maxP - v) / (maxP - minP)) * chartH,
  });

  const priceLine = rawPrice.map((v, i) => {
    const { x, y } = toXY(i, v);
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");

  const smaLine = smaValues
    .map((v, i) => {
      if (v === null) return null;
      const { x, y } = toXY(i, v);
      return `L${x},${y}`;
    })
    .filter(Boolean);
  smaLine[0] = "M" + smaLine[0].slice(1);
  const smaPath = smaLine.join(" ");

  // Golden cross approximate point (where price crosses above SMA convincingly) ~index 10
  const crossIdx = 10;
  const crossPt = toXY(crossIdx, rawPrice[crossIdx]);

  // Death cross approximate point ~index 26
  const deathIdx = 26;
  const deathPt = toXY(deathIdx, rawPrice[deathIdx]);

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ maxWidth: w, display: "block", margin: "0 auto" }}>
        {/* Grid */}
        {[120, 130, 140, 150].map(v => {
          const y = padT + ((maxP - v) / (maxP - minP)) * chartH;
          return (
            <g key={v}>
              <line x1={padL} x2={padL + chartW} y1={y} y2={y}
                stroke={theme.border} strokeWidth={0.5} strokeDasharray="4 4" />
              <text x={padL + chartW + 4} y={y + 4} fontSize={10}
                fill={theme.textMuted} fontFamily="var(--font-mono)">
                {v}
              </text>
            </g>
          );
        })}

        {/* Price line */}
        <path d={priceLine} fill="none" stroke={theme.textSecondary} strokeWidth={1.5}
          strokeLinecap="round" strokeLinejoin="round" opacity={0.5}
          style={{ cursor: "pointer" }}
          onMouseEnter={e => show("Cena rynkowa — rzeczywiste notowania z dużą zmiennością (szum rynkowy)", e)}
          onMouseLeave={hide} />

        {/* SMA line */}
        <path d={smaPath} fill="none" stroke={theme.accent} strokeWidth={2.5}
          strokeLinecap="round" strokeLinejoin="round"
          style={{ cursor: "pointer" }}
          onMouseEnter={e => show("SMA (prosta średnia krocząca) — wygładza szum cenowy, pokazując kierunek trendu", e)}
          onMouseLeave={hide} />

        {/* Cross point - bullish */}
        <circle cx={crossPt.x} cy={crossPt.y} r={6}
          fill={theme.green} stroke={theme.bgCard} strokeWidth={2}
          style={{ cursor: "pointer" }}
          onMouseEnter={e => show("Cena przebija SMA od dołu — sygnał kupna. Trend zmienia się na wzrostowy", e)}
          onMouseLeave={hide} />

        {/* Cross point - bearish */}
        <circle cx={deathPt.x} cy={deathPt.y} r={6}
          fill={theme.red} stroke={theme.bgCard} strokeWidth={2}
          style={{ cursor: "pointer" }}
          onMouseEnter={e => show("Cena przebija SMA od góry — sygnał sprzedaży. Trend zmienia się na spadkowy", e)}
          onMouseLeave={hide} />

        {/* Legend */}
        <g transform={`translate(${padL + 8}, ${padT - 6})`}>
          <line x1={0} x2={20} y1={0} y2={0} stroke={theme.textSecondary} strokeWidth={1.5} opacity={0.5} />
          <text x={24} y={4} fontSize={11} fill={theme.textSecondary} fontFamily="var(--font-ui)">Cena</text>
          <line x1={65} x2={85} y1={0} y2={0} stroke={theme.accent} strokeWidth={2.5} />
          <text x={89} y={4} fontSize={11} fill={theme.accent} fontFamily="var(--font-ui)" fontWeight={600}>SMA(7)</text>
        </g>

        {/* Annotations */}
        <text x={crossPt.x} y={crossPt.y - 12} textAnchor="middle" fontSize={10} fontWeight={600}
          fill={theme.green} fontFamily="var(--font-ui)">
          Kupno
        </text>
        <text x={deathPt.x} y={deathPt.y + 18} textAnchor="middle" fontSize={10} fontWeight={600}
          fill={theme.red} fontFamily="var(--font-ui)">
          Sprzedaż
        </text>
      </svg>
      <Tooltip tip={tip} theme={theme} />
    </div>
  );
}

/* ─── Main diagram component ─── */
const DIAGRAMS = {
  "formacja-swiecowa": CandlestickDiagram,
  "rsi": RSIDiagram,
  "wsparcie-i-opor": SupportResistanceDiagram,
  "sma": SMADiagram,
};

export default function GlossaryDiagram({ slug, theme }) {
  const DiagramComponent = DIAGRAMS[slug];
  if (!DiagramComponent) return null;

  const isMobile = useIsMobile();

  return (
    <div style={{
      background: theme.bgElevated,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      padding: isMobile ? 16 : 20,
      marginBottom: 32,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.1em", color: theme.accent,
        marginBottom: 14, fontFamily: "var(--font-ui)",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <Icon name="line-chart" size={14} />
        Diagram interaktywny
      </div>
      <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 12, fontFamily: "var(--font-ui)" }}>
        Najedź na elementy, aby zobaczyć wyjaśnienia
      </div>
      <DiagramComponent theme={theme} />
    </div>
  );
}

GlossaryDiagram.hasDiagram = (slug) => slug in DIAGRAMS;

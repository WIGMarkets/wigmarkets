import React from "react";

const ACCENT = "#3b82f6";
const GREEN = "#22c55e";
const ORANGE = "#f0883e";
const RED = "#ef4444";
const DARK_BG = "#0d1117";
const CARD_BG = "#161b22";
const BORDER = "#21262d";

/* ------------------------------------------------------------------ */
/* 1. jak-zaczac-inwestowac-na-gpw                                     */
/*    Person silhouette at laptop with rising chart line               */
/* ------------------------------------------------------------------ */
function IllustJakZaczac() {
  return (
    <g>
      {/* Background card */}
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Grid lines */}
      {[100, 160, 220, 280, 340].map((y) => (
        <line key={y} x1="80" y1={y} x2="720" y2={y} stroke={BORDER} strokeWidth="1" />
      ))}
      {/* Rising chart line */}
      <polyline
        points="120,320 200,290 280,300 360,250 440,230 520,180 600,120 680,80"
        fill="none"
        stroke={GREEN}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Chart area fill */}
      <polygon
        points="120,320 200,290 280,300 360,250 440,230 520,180 600,120 680,80 680,340 120,340"
        fill={GREEN}
        opacity="0.1"
      />
      {/* Chart dots */}
      {[
        [120, 320], [200, 290], [280, 300], [360, 250],
        [440, 230], [520, 180], [600, 120], [680, 80],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill={GREEN} />
      ))}
      {/* Desk surface */}
      <rect x="100" y="340" width="600" height="6" rx="3" fill={BORDER} />
      {/* Laptop base */}
      <rect x="180" y="260" width="160" height="80" rx="6" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      {/* Laptop screen */}
      <rect x="190" y="268" width="140" height="60" rx="3" fill={DARK_BG} />
      {/* Mini chart on screen */}
      <polyline
        points="200,315 220,308 240,310 260,298 280,290 300,280 320,270"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2"
      />
      {/* Person silhouette - head */}
      <circle cx="340" cy="190" r="22" fill={ACCENT} opacity="0.8" />
      {/* Person silhouette - body */}
      <path
        d="M315,220 Q315,250 320,280 L360,280 Q365,250 365,220 Z"
        fill={ACCENT}
        opacity="0.6"
      />
      {/* Arrow up indicator */}
      <polygon points="660,70 670,50 680,70" fill={GREEN} />
      <rect x="667" y="70" width="6" height="20" rx="2" fill={GREEN} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 2. najlepsze-konto-maklerskie                                       */
/*    Monitor with trading interface, comparison bars                  */
/* ------------------------------------------------------------------ */
function IllustKontoMaklerskie() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Monitor stand */}
      <rect x="370" y="320" width="60" height="40" rx="4" fill={BORDER} />
      <rect x="330" y="355" width="140" height="8" rx="4" fill={BORDER} />
      {/* Monitor body */}
      <rect x="160" y="40" width="480" height="280" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      {/* Screen */}
      <rect x="175" y="55" width="450" height="245" rx="6" fill={DARK_BG} />
      {/* Header bar */}
      <rect x="175" y="55" width="450" height="30" rx="6" fill={CARD_BG} />
      <circle cx="195" cy="70" r="5" fill={RED} />
      <circle cx="212" cy="70" r="5" fill={ORANGE} />
      <circle cx="229" cy="70" r="5" fill={GREEN} />
      {/* Comparison bars - Broker A */}
      <rect x="210" y="110" width="120" height="22" rx="4" fill={ACCENT} opacity="0.8" />
      <rect x="210" y="145" width="180" height="22" rx="4" fill={ACCENT} opacity="0.6" />
      <rect x="210" y="180" width="90" height="22" rx="4" fill={ACCENT} opacity="0.8" />
      {/* Comparison bars - Broker B */}
      <rect x="420" y="110" width="160" height="22" rx="4" fill={GREEN} opacity="0.8" />
      <rect x="420" y="145" width="100" height="22" rx="4" fill={GREEN} opacity="0.6" />
      <rect x="420" y="180" width="140" height="22" rx="4" fill={GREEN} opacity="0.8" />
      {/* Labels */}
      <rect x="210" y="220" width="60" height="12" rx="3" fill={BORDER} />
      <rect x="290" y="220" width="60" height="12" rx="3" fill={BORDER} />
      <rect x="420" y="220" width="60" height="12" rx="3" fill={BORDER} />
      <rect x="500" y="220" width="60" height="12" rx="3" fill={BORDER} />
      {/* Checkmark */}
      <circle cx="580" cy="265" r="14" fill={GREEN} opacity="0.2" />
      <path d="M572,265 L578,272 L590,258" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 3. co-to-jest-gpw                                                   */
/*    Building facade (GPW) with bar chart columns                    */
/* ------------------------------------------------------------------ */
function IllustCoToJestGPW() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Building base */}
      <rect x="240" y="130" width="320" height="220" rx="4" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      {/* Roof / pediment */}
      <polygon points="230,130 400,50 570,130" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      {/* Columns */}
      {[280, 340, 400, 460, 520].map((x) => (
        <rect key={x} x={x - 8} y="130" width="16" height="220" rx="3" fill={BORDER} />
      ))}
      {/* GPW text placeholder */}
      <rect x="350" y="70" width="100" height="20" rx="4" fill={ACCENT} opacity="0.3" />
      {/* Door */}
      <rect x="370" y="290" width="60" height="60" rx="4" fill={DARK_BG} stroke={ACCENT} strokeWidth="1.5" />
      {/* Bar chart columns to the right */}
      <rect x="620" y="280" width="30" height="70" rx="3" fill={ACCENT} opacity="0.5" />
      <rect x="660" y="240" width="30" height="110" rx="3" fill={ACCENT} opacity="0.7" />
      <rect x="700" y="200" width="30" height="150" rx="3" fill={GREEN} opacity="0.8" />
      <rect x="740" y="160" width="30" height="190" rx="3" fill={GREEN} />
      {/* Bar chart columns to the left */}
      <rect x="30" y="300" width="30" height="50" rx="3" fill={ORANGE} opacity="0.4" />
      <rect x="70" y="260" width="30" height="90" rx="3" fill={ORANGE} opacity="0.6" />
      <rect x="110" y="230" width="30" height="120" rx="3" fill={ACCENT} opacity="0.6" />
      <rect x="150" y="270" width="30" height="80" rx="3" fill={ACCENT} opacity="0.4" />
      {/* Ground line */}
      <line x1="20" y1="350" x2="780" y2="350" stroke={BORDER} strokeWidth="2" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 4. wskaznik-pe                                                      */
/*    Magnifying glass over bar chart                                  */
/* ------------------------------------------------------------------ */
function IllustWskaznikPE() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* X axis */}
      <line x1="100" y1="340" x2="700" y2="340" stroke={BORDER} strokeWidth="2" />
      {/* Y axis */}
      <line x1="100" y1="60" x2="100" y2="340" stroke={BORDER} strokeWidth="2" />
      {/* Bar chart bars */}
      <rect x="140" y="220" width="50" height="120" rx="4" fill={ACCENT} opacity="0.5" />
      <rect x="210" y="180" width="50" height="160" rx="4" fill={ACCENT} opacity="0.6" />
      <rect x="280" y="140" width="50" height="200" rx="4" fill={ACCENT} opacity="0.7" />
      <rect x="350" y="100" width="50" height="240" rx="4" fill={GREEN} opacity="0.8" />
      <rect x="420" y="160" width="50" height="180" rx="4" fill={ACCENT} opacity="0.6" />
      <rect x="490" y="200" width="50" height="140" rx="4" fill={ORANGE} opacity="0.7" />
      <rect x="560" y="250" width="50" height="90" rx="4" fill={RED} opacity="0.6" />
      {/* Magnifying glass circle */}
      <circle cx="370" cy="160" r="80" fill="none" stroke={ACCENT} strokeWidth="4" opacity="0.8" />
      {/* Magnifying glass inner highlight */}
      <circle cx="370" cy="160" r="76" fill={ACCENT} opacity="0.06" />
      {/* Magnifying glass handle */}
      <line x1="427" y1="218" x2="500" y2="290" stroke={ACCENT} strokeWidth="8" strokeLinecap="round" opacity="0.8" />
      {/* PE label inside lens */}
      <rect x="340" y="140" width="60" height="26" rx="6" fill={GREEN} opacity="0.2" />
      {/* Grid lines */}
      {[120, 180, 240, 300].map((y) => (
        <line key={y} x1="100" y1={y} x2="700" y2={y} stroke={BORDER} strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 5. spolki-dywidendowe-gpw                                           */
/*    Coins falling from rising chart line                             */
/* ------------------------------------------------------------------ */
function IllustSpolkiDywidendowe() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Rising chart line */}
      <polyline
        points="80,320 180,280 280,260 380,200 480,170 580,120 680,70"
        fill="none"
        stroke={GREEN}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Chart area fill */}
      <polygon
        points="80,320 180,280 280,260 380,200 480,170 580,120 680,70 680,360 80,360"
        fill={GREEN}
        opacity="0.07"
      />
      {/* Coins - gold circles */}
      <circle cx="220" cy="310" r="18" fill={ORANGE} opacity="0.8" />
      <circle cx="220" cy="310" r="12" fill="none" stroke={DARK_BG} strokeWidth="1.5" />
      <circle cx="310" cy="340" r="18" fill={ORANGE} opacity="0.7" />
      <circle cx="310" cy="340" r="12" fill="none" stroke={DARK_BG} strokeWidth="1.5" />
      <circle cx="400" cy="290" r="18" fill={ORANGE} opacity="0.8" />
      <circle cx="400" cy="290" r="12" fill="none" stroke={DARK_BG} strokeWidth="1.5" />
      <circle cx="500" cy="260" r="18" fill={ORANGE} opacity="0.7" />
      <circle cx="500" cy="260" r="12" fill="none" stroke={DARK_BG} strokeWidth="1.5" />
      <circle cx="580" cy="220" r="18" fill={ORANGE} opacity="0.8" />
      <circle cx="580" cy="220" r="12" fill="none" stroke={DARK_BG} strokeWidth="1.5" />
      {/* Falling coins (smaller, above line) */}
      <circle cx="350" cy="140" r="12" fill={ORANGE} opacity="0.4" />
      <circle cx="450" cy="100" r="10" fill={ORANGE} opacity="0.3" />
      <circle cx="530" cy="80" r="11" fill={ORANGE} opacity="0.35" />
      <circle cx="650" cy="40" r="10" fill={ORANGE} opacity="0.3" />
      {/* Small arrows down from coins */}
      <polygon points="350,158 345,150 355,150" fill={ORANGE} opacity="0.5" />
      <polygon points="450,115 445,108 455,108" fill={ORANGE} opacity="0.4" />
      <polygon points="530,96 525,89 535,89" fill={ORANGE} opacity="0.4" />
      {/* Axis */}
      <line x1="60" y1="360" x2="740" y2="360" stroke={BORDER} strokeWidth="1.5" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 6. analiza-techniczna-podstawy                                      */
/*    Candlestick chart with trend lines                               */
/* ------------------------------------------------------------------ */
function IllustAnalizaTechniczna() {
  const candles = [
    { x: 120, o: 260, c: 220, h: 200, l: 280, bull: true },
    { x: 180, o: 230, c: 250, h: 210, l: 270, bull: false },
    { x: 240, o: 240, c: 200, h: 180, l: 260, bull: true },
    { x: 300, o: 210, c: 230, h: 190, l: 250, bull: false },
    { x: 360, o: 220, c: 180, h: 160, l: 240, bull: true },
    { x: 420, o: 190, c: 210, h: 170, l: 230, bull: false },
    { x: 480, o: 200, c: 160, h: 140, l: 220, bull: true },
    { x: 540, o: 170, c: 190, h: 150, l: 210, bull: false },
    { x: 600, o: 180, c: 140, h: 120, l: 200, bull: true },
    { x: 660, o: 150, c: 130, h: 110, l: 170, bull: true },
  ];

  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Grid */}
      {[120, 180, 240, 300, 360].map((y) => (
        <line key={y} x1="80" y1={y} x2="720" y2={y} stroke={BORDER} strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* Candlesticks */}
      {candles.map((c, i) => {
        const top = Math.min(c.o, c.c);
        const bot = Math.max(c.o, c.c);
        const color = c.bull ? GREEN : RED;
        return (
          <g key={i}>
            {/* Wick */}
            <line x1={c.x} y1={c.h} x2={c.x} y2={c.l} stroke={color} strokeWidth="2" />
            {/* Body */}
            <rect x={c.x - 12} y={top} width="24" height={Math.max(bot - top, 4)} rx="2" fill={color} opacity="0.85" />
          </g>
        );
      })}
      {/* Trend line (support) */}
      <line x1="108" y1="280" x2="672" y2="175" stroke={ACCENT} strokeWidth="2" strokeDasharray="8 4" opacity="0.7" />
      {/* Trend line (resistance) */}
      <line x1="108" y1="195" x2="672" y2="100" stroke={ORANGE} strokeWidth="2" strokeDasharray="8 4" opacity="0.7" />
      {/* Axes */}
      <line x1="80" y1="80" x2="80" y2="370" stroke={BORDER} strokeWidth="1.5" />
      <line x1="80" y1="370" x2="720" y2="370" stroke={BORDER} strokeWidth="1.5" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 7. jak-czytac-wyniki-finansowe                                      */
/*    Document/paper with magnifying glass                             */
/* ------------------------------------------------------------------ */
function IllustWynikiFinansowe() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Paper shadow */}
      <rect x="234" y="44" width="320" height="340" rx="6" fill={BORDER} opacity="0.5" />
      {/* Paper */}
      <rect x="230" y="40" width="320" height="340" rx="6" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      {/* Paper corner fold */}
      <polygon points="490,40 550,40 550,90 490,90" fill={DARK_BG} stroke={BORDER} strokeWidth="1" />
      <polygon points="490,40 490,90 550,40" fill={BORDER} opacity="0.4" />
      {/* Text lines on paper */}
      <rect x="260" y="80" width="180" height="10" rx="3" fill={BORDER} />
      <rect x="260" y="110" width="240" height="8" rx="3" fill={BORDER} opacity="0.5" />
      <rect x="260" y="130" width="220" height="8" rx="3" fill={BORDER} opacity="0.5" />
      <rect x="260" y="150" width="200" height="8" rx="3" fill={BORDER} opacity="0.5" />
      {/* Table on paper */}
      <rect x="260" y="180" width="260" height="4" rx="1" fill={ACCENT} opacity="0.4" />
      <rect x="260" y="196" width="120" height="8" rx="2" fill={BORDER} opacity="0.4" />
      <rect x="400" y="196" width="60" height="8" rx="2" fill={GREEN} opacity="0.5" />
      <rect x="260" y="216" width="120" height="8" rx="2" fill={BORDER} opacity="0.4" />
      <rect x="400" y="216" width="80" height="8" rx="2" fill={GREEN} opacity="0.5" />
      <rect x="260" y="236" width="120" height="8" rx="2" fill={BORDER} opacity="0.4" />
      <rect x="400" y="236" width="50" height="8" rx="2" fill={RED} opacity="0.5" />
      <rect x="260" y="260" width="260" height="2" rx="1" fill={BORDER} opacity="0.3" />
      {/* More text */}
      <rect x="260" y="280" width="200" height="8" rx="3" fill={BORDER} opacity="0.4" />
      <rect x="260" y="300" width="240" height="8" rx="3" fill={BORDER} opacity="0.3" />
      {/* Magnifying glass */}
      <circle cx="580" cy="260" r="60" fill="none" stroke={ACCENT} strokeWidth="4" />
      <circle cx="580" cy="260" r="55" fill={ACCENT} opacity="0.06" />
      <line x1="622" y1="302" x2="680" y2="360" stroke={ACCENT} strokeWidth="8" strokeLinecap="round" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 8. etf-na-gpw                                                       */
/*    Basket/container with various small chart icons                  */
/* ------------------------------------------------------------------ */
function IllustETF() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Basket body */}
      <path
        d="M260,180 L240,350 L560,350 L540,180 Z"
        fill={CARD_BG}
        stroke={BORDER}
        strokeWidth="2"
      />
      {/* Basket rim */}
      <rect x="240" y="170" width="320" height="20" rx="6" fill={BORDER} />
      {/* Basket handle */}
      <path
        d="M320,170 Q400,60 480,170"
        fill="none"
        stroke={BORDER}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Mini chart icon 1 - bar chart */}
      <rect x="290" y="240" width="12" height="30" rx="2" fill={ACCENT} opacity="0.8" />
      <rect x="308" y="225" width="12" height="45" rx="2" fill={GREEN} opacity="0.8" />
      <rect x="326" y="235" width="12" height="35" rx="2" fill={ACCENT} opacity="0.8" />
      {/* Mini chart icon 2 - line chart */}
      <polyline
        points="370,260 385,240 400,250 415,220 430,230"
        fill="none"
        stroke={ORANGE}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Mini chart icon 3 - pie chart */}
      <circle cx="480" cy="250" r="22" fill={ACCENT} opacity="0.6" />
      <path d="M480,228 L480,250 L500,240 Z" fill={GREEN} opacity="0.8" />
      <path d="M480,250 L480,272 L462,258 Z" fill={ORANGE} opacity="0.7" />
      {/* Small dots (representing diversity) */}
      <circle cx="310" cy="300" r="6" fill={GREEN} opacity="0.5" />
      <circle cx="360" cy="310" r="6" fill={ACCENT} opacity="0.5" />
      <circle cx="410" cy="300" r="6" fill={ORANGE} opacity="0.5" />
      <circle cx="460" cy="305" r="6" fill={RED} opacity="0.4" />
      <circle cx="500" cy="300" r="6" fill={GREEN} opacity="0.5" />
      {/* Label "ETF" */}
      <rect x="360" y="140" width="80" height="24" rx="8" fill={ACCENT} opacity="0.15" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 9. wig20-mwig40-swig80                                              */
/*    Three charts side by side, different sizes                       */
/* ------------------------------------------------------------------ */
function IllustWIG20() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Chart 1 - WIG20 (large) */}
      <rect x="40" y="60" width="220" height="300" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <rect x="60" y="80" width="100" height="14" rx="4" fill={ACCENT} opacity="0.3" />
      <polyline
        points="60,300 90,270 120,280 150,240 180,220 210,180 240,140"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        points="60,300 90,270 120,280 150,240 180,220 210,180 240,140 240,330 60,330"
        fill={ACCENT}
        opacity="0.08"
      />

      {/* Chart 2 - mWIG40 (medium) */}
      <rect x="290" y="100" width="220" height="260" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <rect x="310" y="118" width="80" height="12" rx="4" fill={GREEN} opacity="0.3" />
      <polyline
        points="310,300 340,280 370,290 400,260 430,250 460,220 490,200"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        points="310,300 340,280 370,290 400,260 430,250 460,220 490,200 490,330 310,330"
        fill={GREEN}
        opacity="0.08"
      />

      {/* Chart 3 - sWIG80 (small) */}
      <rect x="540" y="140" width="220" height="220" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <rect x="560" y="158" width="70" height="12" rx="4" fill={ORANGE} opacity="0.3" />
      <polyline
        points="560,310 590,290 620,300 650,280 680,260 710,240 740,230"
        fill="none"
        stroke={ORANGE}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        points="560,310 590,290 620,300 650,280 680,260 710,240 740,230 740,330 560,330"
        fill={ORANGE}
        opacity="0.08"
      />

      {/* Size indicators */}
      <circle cx="150" cy="38" r="14" fill={ACCENT} opacity="0.2" />
      <circle cx="400" cy="78" r="11" fill={GREEN} opacity="0.2" />
      <circle cx="650" cy="118" r="8" fill={ORANGE} opacity="0.2" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 10. ile-pieniedzy-zeby-zaczac                                       */
/*     Wallet with coins and small upward arrow                       */
/* ------------------------------------------------------------------ */
function IllustIlePieniedzy() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Wallet body */}
      <rect x="220" y="120" width="280" height="200" rx="16" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      {/* Wallet flap */}
      <path
        d="M220,180 L220,140 Q220,120 240,120 L480,120 Q500,120 500,140 L500,180"
        fill="none"
        stroke={BORDER}
        strokeWidth="2"
      />
      <rect x="220" y="170" width="280" height="16" rx="4" fill={BORDER} />
      {/* Wallet clasp */}
      <circle cx="460" cy="178" r="10" fill={ACCENT} opacity="0.6" />
      {/* Money peeking out */}
      <rect x="250" y="110" width="100" height="30" rx="4" fill={GREEN} opacity="0.25" />
      <rect x="260" y="105" width="80" height="30" rx="4" fill={GREEN} opacity="0.15" />
      {/* Coins */}
      <circle cx="560" cy="280" r="28" fill={ORANGE} opacity="0.8" />
      <circle cx="560" cy="280" r="20" fill="none" stroke={DARK_BG} strokeWidth="2" />
      <circle cx="610" cy="310" r="24" fill={ORANGE} opacity="0.65" />
      <circle cx="610" cy="310" r="17" fill="none" stroke={DARK_BG} strokeWidth="1.5" />
      <circle cx="580" cy="340" r="20" fill={ORANGE} opacity="0.5" />
      <circle cx="580" cy="340" r="14" fill="none" stroke={DARK_BG} strokeWidth="1.5" />
      {/* Small stacked coins */}
      <rect x="135" y="280" width="44" height="6" rx="3" fill={ORANGE} opacity="0.5" />
      <rect x="135" y="270" width="44" height="6" rx="3" fill={ORANGE} opacity="0.6" />
      <rect x="135" y="260" width="44" height="6" rx="3" fill={ORANGE} opacity="0.7" />
      {/* Upward arrow */}
      <line x1="680" y1="220" x2="680" y2="100" stroke={GREEN} strokeWidth="4" strokeLinecap="round" />
      <polygon points="680,85 665,110 695,110" fill={GREEN} />
      {/* Small sparkles */}
      <circle cx="700" cy="130" r="3" fill={ACCENT} opacity="0.5" />
      <circle cx="660" cy="105" r="2" fill={ACCENT} opacity="0.4" />
      <circle cx="710" cy="100" r="2.5" fill={GREEN} opacity="0.4" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 11. xtb-vs-mbank-vs-bossa                                           */
/*     Three phone screens side by side with different interfaces      */
/* ------------------------------------------------------------------ */
function IllustXtbVsMbank() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Phone 1 - XTB */}
      <rect x="80" y="60" width="160" height="290" rx="16" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      <rect x="95" y="90" width="130" height="230" rx="4" fill={DARK_BG} />
      <circle cx="160" cy="75" r="4" fill={BORDER} />
      <polyline points="110,280 130,260 150,270 170,240 190,220 210,200" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" />
      <rect x="105" y="105" width="60" height="8" rx="3" fill={ACCENT} opacity="0.5" />
      <rect x="105" y="120" width="40" height="6" rx="3" fill={BORDER} opacity="0.4" />
      {/* Phone 2 - mBank */}
      <rect x="320" y="60" width="160" height="290" rx="16" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      <rect x="335" y="90" width="130" height="230" rx="4" fill={DARK_BG} />
      <circle cx="400" cy="75" r="4" fill={BORDER} />
      <rect x="345" y="110" width="110" height="20" rx="4" fill={ACCENT} opacity="0.3" />
      <rect x="345" y="140" width="110" height="20" rx="4" fill={GREEN} opacity="0.3" />
      <rect x="345" y="170" width="110" height="20" rx="4" fill={ORANGE} opacity="0.3" />
      <rect x="345" y="200" width="50" height="8" rx="3" fill={BORDER} opacity="0.4" />
      <rect x="345" y="260" width="110" height="30" rx="6" fill={ACCENT} opacity="0.2" />
      {/* Phone 3 - Bossa */}
      <rect x="560" y="60" width="160" height="290" rx="16" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      <rect x="575" y="90" width="130" height="230" rx="4" fill={DARK_BG} />
      <circle cx="640" cy="75" r="4" fill={BORDER} />
      {/* Candlestick mini chart on phone 3 */}
      {[590, 610, 630, 650, 670, 690].map((x, i) => (
        <g key={i}>
          <line x1={x} y1={160 + (i % 3) * 15} x2={x} y2={240 - (i % 2) * 20} stroke={i % 2 === 0 ? GREEN : RED} strokeWidth="1.5" />
          <rect x={x - 4} y={180 + (i % 3) * 8} width="8" height={20 - (i % 2) * 6} rx="1" fill={i % 2 === 0 ? GREEN : RED} opacity="0.8" />
        </g>
      ))}
      <rect x="585" y="105" width="50" height="8" rx="3" fill={ORANGE} opacity="0.5" />
      {/* VS labels */}
      <circle cx="280" cy="200" r="18" fill={ACCENT} opacity="0.15" />
      <circle cx="520" cy="200" r="18" fill={ACCENT} opacity="0.15" />
      {/* Bottom line */}
      <line x1="60" y1="370" x2="740" y2="370" stroke={BORDER} strokeWidth="1.5" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 12. jak-kupic-akcje-krok-po-kroku                                   */
/*     Steps/arrows from wallet to growing chart                       */
/* ------------------------------------------------------------------ */
function IllustKupnoAkcji() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Step 1 - Wallet */}
      <rect x="60" y="140" width="80" height="60" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      <rect x="60" y="155" width="80" height="10" rx="3" fill={BORDER} />
      <rect x="70" y="130" width="40" height="18" rx="3" fill={GREEN} opacity="0.3" />
      <circle cx="100" cy="200" r="6" fill={ACCENT} opacity="0.4" />
      {/* Arrow 1 to 2 */}
      <line x1="160" y1="170" x2="220" y2="170" stroke={ACCENT} strokeWidth="2" strokeDasharray="4 3" />
      <polygon points="220,164 232,170 220,176" fill={ACCENT} />
      {/* Step 2 - Search/Screen */}
      <rect x="240" y="130" width="100" height="80" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      <rect x="255" y="145" width="70" height="8" rx="3" fill={BORDER} opacity="0.5" />
      <circle cx="265" cy="170" r="8" fill={ACCENT} opacity="0.2" />
      <rect x="278" y="166" width="50" height="8" rx="3" fill={BORDER} opacity="0.4" />
      <circle cx="265" cy="190" r="8" fill={GREEN} opacity="0.2" />
      <rect x="278" y="186" width="45" height="8" rx="3" fill={BORDER} opacity="0.4" />
      {/* Arrow 2 to 3 */}
      <line x1="360" y1="170" x2="420" y2="170" stroke={ACCENT} strokeWidth="2" strokeDasharray="4 3" />
      <polygon points="420,164 432,170 420,176" fill={ACCENT} />
      {/* Step 3 - Order/Click */}
      <rect x="440" y="130" width="100" height="80" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      <rect x="455" y="145" width="70" height="30" rx="6" fill={GREEN} opacity="0.2" />
      <rect x="465" y="155" width="50" height="10" rx="4" fill={GREEN} opacity="0.5" />
      <rect x="455" y="185" width="30" height="8" rx="3" fill={BORDER} opacity="0.4" />
      <rect x="495" y="185" width="30" height="8" rx="3" fill={ORANGE} opacity="0.4" />
      {/* Arrow 3 to 4 */}
      <line x1="560" y1="170" x2="620" y2="170" stroke={ACCENT} strokeWidth="2" strokeDasharray="4 3" />
      <polygon points="620,164 632,170 620,176" fill={ACCENT} />
      {/* Step 4 - Rising chart */}
      <rect x="640" y="100" width="120" height="140" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      <polyline points="660,210 680,195 700,200 720,170 740,140" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="740,130 735,145 745,145" fill={GREEN} />
      {/* Step numbers */}
      {[100, 290, 490, 700].map((cx, i) => (
        <circle key={i} cx={cx} cy={270} r="16" fill={ACCENT} opacity="0.15" />
      ))}
      {/* Ground */}
      <line x1="40" y1="310" x2="760" y2="310" stroke={BORDER} strokeWidth="1.5" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 13. podatek-belki-pit-38                                            */
/*     Tax document with calculator and coins                          */
/* ------------------------------------------------------------------ */
function IllustPodatekBelki() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Document */}
      <rect x="200" y="40" width="260" height="330" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      {/* Document header - PIT-38 */}
      <rect x="220" y="60" width="120" height="20" rx="4" fill={RED} opacity="0.2" />
      <rect x="220" y="60" width="120" height="20" rx="4" fill="none" stroke={RED} strokeWidth="1" opacity="0.5" />
      {/* Document lines */}
      <rect x="220" y="100" width="200" height="8" rx="3" fill={BORDER} opacity="0.5" />
      <rect x="220" y="120" width="180" height="8" rx="3" fill={BORDER} opacity="0.4" />
      <rect x="220" y="140" width="220" height="8" rx="3" fill={BORDER} opacity="0.4" />
      {/* Table in document */}
      <line x1="220" y1="170" x2="440" y2="170" stroke={BORDER} strokeWidth="1" />
      <rect x="220" y="180" width="100" height="8" rx="2" fill={BORDER} opacity="0.4" />
      <rect x="350" y="180" width="80" height="8" rx="2" fill={GREEN} opacity="0.5" />
      <rect x="220" y="200" width="100" height="8" rx="2" fill={BORDER} opacity="0.4" />
      <rect x="350" y="200" width="60" height="8" rx="2" fill={RED} opacity="0.5" />
      <rect x="220" y="220" width="100" height="8" rx="2" fill={BORDER} opacity="0.4" />
      <rect x="350" y="220" width="70" height="8" rx="2" fill={ORANGE} opacity="0.5" />
      <line x1="220" y1="240" x2="440" y2="240" stroke={BORDER} strokeWidth="1" />
      {/* Total line - 19% */}
      <rect x="220" y="255" width="80" height="12" rx="3" fill={BORDER} opacity="0.5" />
      <rect x="350" y="255" width="90" height="12" rx="3" fill={RED} opacity="0.3" />
      {/* Calculator */}
      <rect x="520" y="100" width="160" height="200" rx="12" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      <rect x="540" y="120" width="120" height="40" rx="6" fill={DARK_BG} />
      <rect x="550" y="135" width="60" height="12" rx="3" fill={GREEN} opacity="0.6" />
      {/* Calculator buttons */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <rect key={i} x={540 + (i % 3) * 42} y={180 + Math.floor(i / 3) * 36} width="34" height="28" rx="4" fill={BORDER} opacity="0.5" />
      ))}
      {/* Coins */}
      <circle cx="120" cy="280" r="24" fill={ORANGE} opacity="0.7" />
      <circle cx="120" cy="280" r="16" fill="none" stroke={DARK_BG} strokeWidth="2" />
      <circle cx="90" cy="320" r="20" fill={ORANGE} opacity="0.5" />
      <circle cx="90" cy="320" r="14" fill="none" stroke={DARK_BG} strokeWidth="1.5" />
      <circle cx="155" cy="330" r="18" fill={ORANGE} opacity="0.6" />
      <circle cx="155" cy="330" r="12" fill="none" stroke={DARK_BG} strokeWidth="1.5" />
      {/* 19% indicator */}
      <rect x="530" y="50" width="80" height="30" rx="8" fill={RED} opacity="0.15" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 14. ike-vs-ikze                                                     */
/*     Two jars/piggy banks with coins falling in                      */
/* ------------------------------------------------------------------ */
function IllustIkeVsIkze() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Jar 1 - IKE */}
      <rect x="120" y="140" width="180" height="200" rx="14" fill={CARD_BG} stroke={ACCENT} strokeWidth="2" />
      <rect x="150" y="130" width="120" height="20" rx="6" fill={BORDER} />
      {/* IKE label */}
      <rect x="170" y="170" width="80" height="28" rx="8" fill={ACCENT} opacity="0.15" />
      {/* Coins inside jar 1 */}
      <circle cx="180" cy="290" r="14" fill={ORANGE} opacity="0.6" />
      <circle cx="210" cy="300" r="14" fill={ORANGE} opacity="0.5" />
      <circle cx="240" cy="290" r="14" fill={ORANGE} opacity="0.7" />
      <circle cx="195" cy="270" r="14" fill={ORANGE} opacity="0.5" />
      <circle cx="225" cy="275" r="14" fill={ORANGE} opacity="0.6" />
      {/* Falling coin into jar 1 */}
      <circle cx="210" cy="90" r="16" fill={ORANGE} opacity="0.8" />
      <circle cx="210" cy="90" r="10" fill="none" stroke={DARK_BG} strokeWidth="1.5" />
      <line x1="210" y1="106" x2="210" y2="128" stroke={ORANGE} strokeWidth="1.5" strokeDasharray="3 2" />
      {/* Jar 2 - IKZE */}
      <rect x="500" y="140" width="180" height="200" rx="14" fill={CARD_BG} stroke={GREEN} strokeWidth="2" />
      <rect x="530" y="130" width="120" height="20" rx="6" fill={BORDER} />
      {/* IKZE label */}
      <rect x="545" y="170" width="90" height="28" rx="8" fill={GREEN} opacity="0.15" />
      {/* Coins inside jar 2 */}
      <circle cx="555" cy="295" r="14" fill={ORANGE} opacity="0.5" />
      <circle cx="585" cy="300" r="14" fill={ORANGE} opacity="0.6" />
      <circle cx="625" cy="290" r="14" fill={ORANGE} opacity="0.5" />
      <circle cx="575" cy="275" r="14" fill={ORANGE} opacity="0.6" />
      {/* Falling coin into jar 2 */}
      <circle cx="590" cy="90" r="16" fill={ORANGE} opacity="0.8" />
      <circle cx="590" cy="90" r="10" fill="none" stroke={DARK_BG} strokeWidth="1.5" />
      <line x1="590" y1="106" x2="590" y2="128" stroke={ORANGE} strokeWidth="1.5" strokeDasharray="3 2" />
      {/* VS */}
      <circle cx="400" cy="230" r="24" fill={BORDER} opacity="0.5" />
      {/* Arrows up from jars */}
      <line x1="210" y1="350" x2="210" y2="370" stroke={ACCENT} strokeWidth="2" />
      <line x1="590" y1="350" x2="590" y2="370" stroke={GREEN} strokeWidth="2" />
      {/* Ground */}
      <line x1="60" y1="360" x2="740" y2="360" stroke={BORDER} strokeWidth="1.5" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 15. obligacje-skarbowe-2026                                         */
/*     Certificate with seal and interest chart                        */
/* ------------------------------------------------------------------ */
function IllustObligacje() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Certificate */}
      <rect x="140" y="50" width="340" height="300" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      {/* Certificate border inner */}
      <rect x="155" y="65" width="310" height="270" rx="4" fill="none" stroke={BORDER} strokeWidth="1" strokeDasharray="6 3" />
      {/* Certificate header */}
      <rect x="200" y="85" width="220" height="16" rx="4" fill={ACCENT} opacity="0.3" />
      {/* Certificate text lines */}
      <rect x="180" y="120" width="260" height="8" rx="3" fill={BORDER} opacity="0.5" />
      <rect x="180" y="140" width="240" height="8" rx="3" fill={BORDER} opacity="0.4" />
      <rect x="180" y="160" width="260" height="8" rx="3" fill={BORDER} opacity="0.4" />
      <rect x="180" y="180" width="200" height="8" rx="3" fill={BORDER} opacity="0.3" />
      {/* Seal */}
      <circle cx="310" cy="250" r="36" fill={RED} opacity="0.12" />
      <circle cx="310" cy="250" r="36" fill="none" stroke={RED} strokeWidth="2" opacity="0.4" />
      <circle cx="310" cy="250" r="26" fill="none" stroke={RED} strokeWidth="1" opacity="0.3" />
      <circle cx="310" cy="250" r="8" fill={RED} opacity="0.3" />
      {/* Interest rate chart */}
      <rect x="540" y="80" width="210" height="260" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <line x1="560" y1="300" x2="730" y2="300" stroke={BORDER} strokeWidth="1" />
      <line x1="560" y1="100" x2="560" y2="300" stroke={BORDER} strokeWidth="1" />
      {/* Bar chart for different bond types */}
      <rect x="575" y="260" width="20" height="40" rx="3" fill={ACCENT} opacity="0.4" />
      <rect x="605" y="230" width="20" height="70" rx="3" fill={ACCENT} opacity="0.5" />
      <rect x="635" y="210" width="20" height="90" rx="3" fill={GREEN} opacity="0.6" />
      <rect x="665" y="190" width="20" height="110" rx="3" fill={GREEN} opacity="0.7" />
      <rect x="695" y="160" width="20" height="140" rx="3" fill={ORANGE} opacity="0.8" />
      {/* Rising trend line */}
      <polyline points="585,255 615,225 645,200 675,180 705,150" fill="none" stroke={GREEN} strokeWidth="2" strokeDasharray="4 3" />
      {/* Label */}
      <rect x="570" y="95" width="100" height="12" rx="4" fill={BORDER} opacity="0.4" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 16. najlepsze-aplikacje-do-inwestowania                             */
/*     Smartphone with trading interface and rating stars              */
/* ------------------------------------------------------------------ */
function IllustAplikacje() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Main phone */}
      <rect x="280" y="30" width="240" height="340" rx="24" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      <rect x="300" y="65" width="200" height="280" rx="6" fill={DARK_BG} />
      {/* Phone notch */}
      <rect x="360" y="38" width="80" height="18" rx="9" fill={DARK_BG} />
      {/* App interface on screen */}
      <rect x="310" y="80" width="180" height="24" rx="6" fill={CARD_BG} />
      <rect x="320" y="86" width="60" height="12" rx="4" fill={ACCENT} opacity="0.5" />
      {/* Chart on phone */}
      <polyline points="310,200 340,185 370,190 400,160 430,145 460,120 490,100" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="310,200 340,185 370,190 400,160 430,145 460,120 490,100 490,220 310,220" fill={GREEN} opacity="0.1" />
      {/* Portfolio items */}
      <rect x="310" y="235" width="180" height="22" rx="4" fill={CARD_BG} />
      <rect x="316" y="240" width="40" height="12" rx="3" fill={GREEN} opacity="0.4" />
      <rect x="440" y="240" width="40" height="12" rx="3" fill={GREEN} opacity="0.6" />
      <rect x="310" y="265" width="180" height="22" rx="4" fill={CARD_BG} />
      <rect x="316" y="270" width="40" height="12" rx="3" fill={ACCENT} opacity="0.4" />
      <rect x="440" y="270" width="35" height="12" rx="3" fill={RED} opacity="0.5" />
      <rect x="310" y="295" width="180" height="22" rx="4" fill={CARD_BG} />
      <rect x="316" y="300" width="40" height="12" rx="3" fill={ORANGE} opacity="0.4" />
      <rect x="440" y="300" width="45" height="12" rx="3" fill={GREEN} opacity="0.5" />
      {/* Rating stars left */}
      {[0, 1, 2, 3, 4].map(i => (
        <polygon key={`l${i}`} points={`${80 + i * 28},200 ${85 + i * 28},186 ${90 + i * 28},200 ${98 + i * 28},202 ${92 + i * 28},212 ${94 + i * 28},226 ${85 + i * 28},218 ${76 + i * 28},226 ${78 + i * 28},212 ${72 + i * 28},202`} fill={i < 4 ? ORANGE : BORDER} opacity={i < 4 ? 0.7 : 0.3} />
      ))}
      {/* Rating stars right */}
      {[0, 1, 2, 3, 4].map(i => (
        <polygon key={`r${i}`} points={`${580 + i * 28},200 ${585 + i * 28},186 ${590 + i * 28},200 ${598 + i * 28},202 ${592 + i * 28},212 ${594 + i * 28},226 ${585 + i * 28},218 ${576 + i * 28},226 ${578 + i * 28},212 ${572 + i * 28},202`} fill={i < 3 ? ORANGE : BORDER} opacity={i < 3 ? 0.7 : 0.3} />
      ))}
      {/* Small app icons */}
      <rect x="80" y="100" width="50" height="50" rx="12" fill={ACCENT} opacity="0.15" />
      <rect x="80" y="260" width="50" height="50" rx="12" fill={GREEN} opacity="0.15" />
      <rect x="670" y="100" width="50" height="50" rx="12" fill={ORANGE} opacity="0.15" />
      <rect x="670" y="260" width="50" height="50" rx="12" fill={RED} opacity="0.1" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 17. wskazniki-fundamentalne-gpw                                     */
/*     Dashboard with multiple indicators and charts                   */
/* ------------------------------------------------------------------ */
function IllustWskaznikiGPW() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Card 1 - P/E gauge */}
      <rect x="40" y="40" width="220" height="150" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <rect x="60" y="60" width="60" height="10" rx="3" fill={ACCENT} opacity="0.4" />
      <path d="M100,160 A50,50 0 0,1 200,160" fill="none" stroke={BORDER} strokeWidth="6" strokeLinecap="round" />
      <path d="M100,160 A50,50 0 0,1 170,115" fill="none" stroke={GREEN} strokeWidth="6" strokeLinecap="round" />
      <circle cx="170" cy="115" r="6" fill={GREEN} />
      {/* Card 2 - ROE bar chart */}
      <rect x="290" y="40" width="220" height="150" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <rect x="310" y="60" width="60" height="10" rx="3" fill={GREEN} opacity="0.4" />
      <rect x="310" y="130" width="30" height="40" rx="3" fill={ACCENT} opacity="0.5" />
      <rect x="350" y="110" width="30" height="60" rx="3" fill={ACCENT} opacity="0.6" />
      <rect x="390" y="90" width="30" height="80" rx="3" fill={GREEN} opacity="0.7" />
      <rect x="430" y="100" width="30" height="70" rx="3" fill={GREEN} opacity="0.8" />
      <rect x="470" y="120" width="30" height="50" rx="3" fill={ORANGE} opacity="0.6" />
      {/* Card 3 - Pie chart */}
      <rect x="540" y="40" width="220" height="150" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <rect x="560" y="60" width="60" height="10" rx="3" fill={ORANGE} opacity="0.4" />
      <circle cx="650" cy="130" r="45" fill={ACCENT} opacity="0.6" />
      <path d="M650,85 L650,130 L690,105 Z" fill={GREEN} opacity="0.8" />
      <path d="M650,130 L650,175 L615,160 Z" fill={ORANGE} opacity="0.7" />
      <path d="M650,130 L615,100 L650,85 Z" fill={RED} opacity="0.5" />
      {/* Card 4 - Metrics table */}
      <rect x="40" y="220" width="340" height="150" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      {/* Table header */}
      <rect x="40" y="220" width="340" height="30" rx="10" fill={BORDER} opacity="0.3" />
      {/* Table rows */}
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          <rect x="55" y={262 + i * 26} width="50" height="8" rx="3" fill={BORDER} opacity="0.5" />
          <rect x="130" y={262 + i * 26} width="40" height="8" rx="3" fill={i < 2 ? GREEN : ORANGE} opacity="0.5" />
          <rect x="200" y={262 + i * 26} width="35" height="8" rx="3" fill={ACCENT} opacity="0.4" />
          <rect x="260" y={262 + i * 26} width="50" height="8" rx="3" fill={BORDER} opacity="0.4" />
          <rect x="335" y={262 + i * 26} width="30" height="8" rx="3" fill={i === 0 ? GREEN : BORDER} opacity="0.5" />
        </g>
      ))}
      {/* Card 5 - Trend */}
      <rect x="420" y="220" width="340" height="150" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <rect x="440" y="240" width="50" height="10" rx="3" fill={ACCENT} opacity="0.4" />
      <polyline points="440,340 480,320 520,325 560,300 600,280 640,260 680,240 720,220" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 18. jak-budowac-portfel-inwestycyjny                                */
/*     Pie chart with segments: stocks, bonds, ETF, cash               */
/* ------------------------------------------------------------------ */
function IllustPortfel() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Main pie chart */}
      <circle cx="320" cy="200" r="140" fill={ACCENT} opacity="0.6" />
      {/* Segment 2: 30% bonds - green */}
      <path d="M320,200 L320,60 A140,140 0 0,1 441,116 Z" fill={GREEN} opacity="0.7" />
      {/* Segment 3: 15% ETF - orange */}
      <path d="M320,200 L441,116 A140,140 0 0,1 460,200 Z" fill={ORANGE} opacity="0.7" />
      {/* Segment 4: 10% cash - red */}
      <path d="M320,200 L460,200 A140,140 0 0,1 420,310 Z" fill={RED} opacity="0.5" />
      {/* Center hole (donut) */}
      <circle cx="320" cy="200" r="60" fill={DARK_BG} />
      {/* Center label */}
      <rect x="290" y="190" width="60" height="20" rx="6" fill={BORDER} opacity="0.4" />
      {/* Legend */}
      <rect x="560" y="100" width="190" height="200" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      {/* Legend items */}
      <rect x="580" y="130" width="14" height="14" rx="3" fill={ACCENT} opacity="0.8" />
      <rect x="604" y="132" width="80" height="10" rx="3" fill={BORDER} opacity="0.5" />
      <rect x="700" y="132" width="30" height="10" rx="3" fill={BORDER} opacity="0.4" />
      <rect x="580" y="165" width="14" height="14" rx="3" fill={GREEN} opacity="0.8" />
      <rect x="604" y="167" width="80" height="10" rx="3" fill={BORDER} opacity="0.5" />
      <rect x="700" y="167" width="30" height="10" rx="3" fill={BORDER} opacity="0.4" />
      <rect x="580" y="200" width="14" height="14" rx="3" fill={ORANGE} opacity="0.8" />
      <rect x="604" y="202" width="60" height="10" rx="3" fill={BORDER} opacity="0.5" />
      <rect x="700" y="202" width="30" height="10" rx="3" fill={BORDER} opacity="0.4" />
      <rect x="580" y="235" width="14" height="14" rx="3" fill={RED} opacity="0.7" />
      <rect x="604" y="237" width="70" height="10" rx="3" fill={BORDER} opacity="0.5" />
      <rect x="700" y="237" width="30" height="10" rx="3" fill={BORDER} opacity="0.4" />
      {/* Legend header */}
      <rect x="580" y="110" width="100" height="10" rx="3" fill={ACCENT} opacity="0.3" />
      {/* Small balance scale icon */}
      <line x1="100" y1="120" x2="100" y2="200" stroke={BORDER} strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="140" x2="140" y2="140" stroke={BORDER} strokeWidth="2" />
      <path d="M60,140 L50,180 L90,180 Z" fill={ACCENT} opacity="0.2" stroke={BORDER} strokeWidth="1" />
      <path d="M140,140 L120,180 L160,180 Z" fill={GREEN} opacity="0.2" stroke={BORDER} strokeWidth="1" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 19. rodzaje-zlecen-gieldowych                                       */
/*     Chart with entry/exit points, stop loss and take profit arrows  */
/* ------------------------------------------------------------------ */
function IllustZlecenia() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Axes */}
      <line x1="80" y1="60" x2="80" y2="350" stroke={BORDER} strokeWidth="1.5" />
      <line x1="80" y1="350" x2="740" y2="350" stroke={BORDER} strokeWidth="1.5" />
      {/* Grid */}
      {[120, 180, 240, 300].map(y => (
        <line key={y} x1="80" y1={y} x2="740" y2={y} stroke={BORDER} strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* Price line */}
      <polyline
        points="100,280 160,260 220,270 280,230 340,200 400,220 460,180 520,150 580,170 640,130 700,120"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Entry point (buy) */}
      <circle cx="280" cy="230" r="8" fill={GREEN} opacity="0.8" />
      <circle cx="280" cy="230" r="14" fill={GREEN} opacity="0.15" />
      <line x1="280" y1="248" x2="280" y2="280" stroke={GREEN} strokeWidth="1.5" strokeDasharray="3 2" />
      <polygon points="274,280 280,292 286,280" fill={GREEN} opacity="0.6" />
      {/* Stop loss level */}
      <line x1="280" y1="290" x2="700" y2="290" stroke={RED} strokeWidth="2" strokeDasharray="8 4" />
      <rect x="700" y="282" width="30" height="16" rx="4" fill={RED} opacity="0.2" />
      {/* Take profit level */}
      <line x1="280" y1="130" x2="700" y2="130" stroke={GREEN} strokeWidth="2" strokeDasharray="8 4" />
      <rect x="700" y="122" width="30" height="16" rx="4" fill={GREEN} opacity="0.2" />
      {/* Exit point (sell/take profit) */}
      <circle cx="640" cy="130" r="8" fill={GREEN} opacity="0.8" />
      <circle cx="640" cy="130" r="14" fill={GREEN} opacity="0.15" />
      {/* Profit zone fill */}
      <rect x="280" y="130" width="360" height="100" rx="0" fill={GREEN} opacity="0.04" />
      {/* Loss zone fill */}
      <rect x="280" y="230" width="360" height="60" rx="0" fill={RED} opacity="0.04" />
      {/* Arrow showing trailing stop */}
      <polyline points="400,250 460,210 520,180 580,200" fill="none" stroke={ORANGE} strokeWidth="1.5" strokeDasharray="4 3" />
      <polygon points="500,195 520,180 510,200" fill={ORANGE} opacity="0.6" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 20. sezon-wynikow-gpw                                               */
/*     Calendar with marked dates and chart reacting to results        */
/* ------------------------------------------------------------------ */
function IllustSezonWynikow() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Calendar */}
      <rect x="60" y="60" width="300" height="280" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      {/* Calendar header */}
      <rect x="60" y="60" width="300" height="44" rx="10" fill={ACCENT} opacity="0.12" />
      <rect x="130" y="72" width="100" height="14" rx="4" fill={ACCENT} opacity="0.4" />
      {/* Day grid */}
      {[0, 1, 2, 3, 4].map(row =>
        [0, 1, 2, 3, 4, 5, 6].map(col => {
          const isHighlighted = (row === 1 && col === 2) || (row === 2 && col === 4) || (row === 3 && col === 1) || (row === 4 && col === 5);
          return (
            <rect
              key={`${row}-${col}`}
              x={80 + col * 38}
              y={118 + row * 40}
              width="28"
              height="28"
              rx="6"
              fill={isHighlighted ? GREEN : "transparent"}
              opacity={isHighlighted ? 0.25 : 1}
              stroke={isHighlighted ? GREEN : BORDER}
              strokeWidth={isHighlighted ? 1.5 : 0.5}
            />
          );
        })
      )}
      {/* Chart reacting to results */}
      <rect x="420" y="60" width="340" height="280" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      {/* Mini axes */}
      <line x1="450" y1="90" x2="450" y2="310" stroke={BORDER} strokeWidth="1" />
      <line x1="450" y1="310" x2="730" y2="310" stroke={BORDER} strokeWidth="1" />
      {/* Price line with gap-up on earnings */}
      <polyline
        points="460,240 490,235 520,245 550,238 570,240"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Gap up on good results */}
      <line x1="570" y1="240" x2="580" y2="180" stroke={GREEN} strokeWidth="2" strokeDasharray="2 2" />
      <polyline
        points="580,180 610,170 640,175 670,160 700,150"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Results publication marker */}
      <line x1="575" y1="90" x2="575" y2="310" stroke={ORANGE} strokeWidth="1.5" strokeDasharray="4 3" />
      <rect x="555" y="90" width="40" height="20" rx="6" fill={ORANGE} opacity="0.2" />
      {/* Volume bars at bottom */}
      {[460, 490, 520, 550, 580, 610, 640, 670, 700].map((x, i) => (
        <rect key={i} x={x} y={i === 4 ? 275 : 290} width="16" height={i === 4 ? 35 : 20} rx="2" fill={i >= 4 ? GREEN : ACCENT} opacity={i === 4 ? 0.7 : 0.3} />
      ))}
      {/* Arrow showing gap up */}
      <polygon points="575,170 569,185 581,185" fill={GREEN} opacity="0.6" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Illustration registry                                               */
/* ------------------------------------------------------------------ */
const ILLUSTRATIONS = {
  "jak-zaczac-inwestowac-na-gpw": IllustJakZaczac,
  "najlepsze-konto-maklerskie": IllustKontoMaklerskie,
  "co-to-jest-gpw": IllustCoToJestGPW,
  "wskaznik-pe": IllustWskaznikPE,
  "spolki-dywidendowe-gpw": IllustSpolkiDywidendowe,
  "analiza-techniczna-podstawy": IllustAnalizaTechniczna,
  "jak-czytac-wyniki-finansowe": IllustWynikiFinansowe,
  "etf-na-gpw": IllustETF,
  "wig20-mwig40-swig80": IllustWIG20,
  "ile-pieniedzy-zeby-zaczac": IllustIlePieniedzy,
  "xtb-vs-mbank-vs-bossa": IllustXtbVsMbank,
  "jak-kupic-akcje-krok-po-kroku": IllustKupnoAkcji,
  "podatek-belki-pit-38": IllustPodatekBelki,
  "ike-vs-ikze": IllustIkeVsIkze,
  "obligacje-skarbowe-2026": IllustObligacje,
  "najlepsze-aplikacje-do-inwestowania": IllustAplikacje,
  "wskazniki-fundamentalne-gpw": IllustWskaznikiGPW,
  "jak-budowac-portfel-inwestycyjny": IllustPortfel,
  "rodzaje-zlecen-gieldowych": IllustZlecenia,
  "sezon-wynikow-gpw": IllustSezonWynikow,
};

/* ------------------------------------------------------------------ */
/* Default fallback illustration                                       */
/* ------------------------------------------------------------------ */
function IllustDefault() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      <rect x="200" y="100" width="400" height="200" rx="12" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      <polyline
        points="240,260 320,200 400,220 480,160 560,140"
        fill="none"
        stroke={ACCENT}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="560" cy="140" r="6" fill={GREEN} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Main exported component                                             */
/* ------------------------------------------------------------------ */
export default function ArticleIllustration({ slug, style }) {
  const Illustration = ILLUSTRATIONS[slug] || IllustDefault;

  return (
    <svg
      viewBox="0 0 800 400"
      width="100%"
      height="auto"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      role="img"
      aria-label={`Ilustracja artykulu: ${slug}`}
    >
      <Illustration />
    </svg>
  );
}

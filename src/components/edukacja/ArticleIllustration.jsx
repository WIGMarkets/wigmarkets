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
/* 21. czym-jest-dywidenda                                              */
/*     Coins with percentage symbols and rising dividend yield chart    */
/* ------------------------------------------------------------------ */
function IllustDywidenda() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Grid lines */}
      {[120, 180, 240, 300].map((y) => (
        <line key={y} x1="80" y1={y} x2="500" y2={y} stroke={BORDER} strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* Axes */}
      <line x1="80" y1="80" x2="80" y2="340" stroke={BORDER} strokeWidth="1.5" />
      <line x1="80" y1="340" x2="500" y2="340" stroke={BORDER} strokeWidth="1.5" />
      {/* Rising dividend bar chart */}
      <rect x="110" y="280" width="40" height="60" rx="4" fill={GREEN} opacity="0.4" />
      <rect x="170" y="250" width="40" height="90" rx="4" fill={GREEN} opacity="0.5" />
      <rect x="230" y="220" width="40" height="120" rx="4" fill={GREEN} opacity="0.6" />
      <rect x="290" y="190" width="40" height="150" rx="4" fill={GREEN} opacity="0.7" />
      <rect x="350" y="150" width="40" height="190" rx="4" fill={GREEN} opacity="0.8" />
      <rect x="410" y="120" width="40" height="220" rx="4" fill={GREEN} opacity="0.9" />
      {/* Trend line over bars */}
      <polyline points="130,275 190,245 250,215 310,185 370,145 430,115" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 3" />
      {/* Large coins on right side */}
      <circle cx="600" cy="140" r="40" fill={ORANGE} opacity="0.8" />
      <circle cx="600" cy="140" r="28" fill="none" stroke={DARK_BG} strokeWidth="2.5" />
      <circle cx="600" cy="140" r="14" fill={ORANGE} opacity="0.5" />
      <circle cx="660" cy="220" r="35" fill={ORANGE} opacity="0.7" />
      <circle cx="660" cy="220" r="24" fill="none" stroke={DARK_BG} strokeWidth="2" />
      <circle cx="660" cy="220" r="12" fill={ORANGE} opacity="0.4" />
      <circle cx="620" cy="300" r="30" fill={ORANGE} opacity="0.6" />
      <circle cx="620" cy="300" r="20" fill="none" stroke={DARK_BG} strokeWidth="2" />
      {/* Percentage symbol */}
      <circle cx="720" cy="120" r="8" fill="none" stroke={GREEN} strokeWidth="2" opacity="0.6" />
      <circle cx="744" cy="148" r="8" fill="none" stroke={GREEN} strokeWidth="2" opacity="0.6" />
      <line x1="746" y1="112" x2="718" y2="156" stroke={GREEN} strokeWidth="2" opacity="0.6" />
      {/* Small falling coins */}
      <circle cx="560" cy="60" r="14" fill={ORANGE} opacity="0.3" />
      <circle cx="700" cy="80" r="12" fill={ORANGE} opacity="0.25" />
      <circle cx="750" cy="200" r="16" fill={ORANGE} opacity="0.3" />
      {/* Arrow down into coins */}
      <polygon points="600,86 594,98 606,98" fill={ORANGE} opacity="0.5" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 22. jak-dziala-sesja-gieldowa                                        */
/*     Clock face with trading phases timeline                         */
/* ------------------------------------------------------------------ */
function IllustSesjaGieldowa() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Clock face */}
      <circle cx="200" cy="200" r="130" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      <circle cx="200" cy="200" r="125" fill="none" stroke={BORDER} strokeWidth="1" strokeDasharray="6 6" />
      {/* Clock hour marks */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 200 + 110 * Math.sin(rad);
        const y1 = 200 - 110 * Math.cos(rad);
        const x2 = 200 + 120 * Math.sin(rad);
        const y2 = 200 - 120 * Math.cos(rad);
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={BORDER} strokeWidth="3" strokeLinecap="round" />;
      })}
      {/* Clock hands - hour */}
      <line x1="200" y1="200" x2="200" y2="120" stroke={ACCENT} strokeWidth="4" strokeLinecap="round" />
      {/* Clock hands - minute */}
      <line x1="200" y1="200" x2="260" y2="170" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
      {/* Center dot */}
      <circle cx="200" cy="200" r="6" fill={ACCENT} />
      {/* Trading phases timeline on right */}
      <line x1="420" y1="60" x2="420" y2="360" stroke={BORDER} strokeWidth="2" />
      {/* Phase 1 - Pre-opening */}
      <circle cx="420" cy="80" r="8" fill={ORANGE} opacity="0.6" />
      <rect x="445" y="70" width="120" height="18" rx="4" fill={ORANGE} opacity="0.15" />
      <rect x="455" y="74" width="80" height="10" rx="3" fill={BORDER} opacity="0.5" />
      {/* Phase 2 - Opening auction */}
      <circle cx="420" cy="140" r="8" fill={ACCENT} opacity="0.7" />
      <rect x="445" y="130" width="140" height="18" rx="4" fill={ACCENT} opacity="0.15" />
      <rect x="455" y="134" width="100" height="10" rx="3" fill={BORDER} opacity="0.5" />
      {/* Phase 3 - Continuous trading */}
      <circle cx="420" cy="220" r="10" fill={GREEN} opacity="0.8" />
      <rect x="445" y="208" width="180" height="22" rx="4" fill={GREEN} opacity="0.12" />
      <rect x="455" y="213" width="140" height="12" rx="3" fill={BORDER} opacity="0.5" />
      {/* Phase 4 - Closing auction */}
      <circle cx="420" cy="300" r="8" fill={ACCENT} opacity="0.7" />
      <rect x="445" y="290" width="140" height="18" rx="4" fill={ACCENT} opacity="0.15" />
      <rect x="455" y="294" width="100" height="10" rx="3" fill={BORDER} opacity="0.5" />
      {/* Phase 5 - After hours */}
      <circle cx="420" cy="350" r="6" fill={BORDER} opacity="0.5" />
      <rect x="445" y="342" width="100" height="16" rx="4" fill={BORDER} opacity="0.1" />
      <rect x="455" y="345" width="60" height="10" rx="3" fill={BORDER} opacity="0.4" />
      {/* Connecting lines between phases */}
      <line x1="420" y1="88" x2="420" y2="132" stroke={BORDER} strokeWidth="2" />
      <line x1="420" y1="148" x2="420" y2="210" stroke={BORDER} strokeWidth="2" />
      <line x1="420" y1="230" x2="420" y2="292" stroke={BORDER} strokeWidth="2" />
      <line x1="420" y1="308" x2="420" y2="344" stroke={BORDER} strokeWidth="2" />
      {/* Small volume chart at bottom left */}
      <rect x="100" y="360" width="200" height="4" rx="2" fill={BORDER} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 23. short-selling                                                    */
/*     Downward chart with bear icon and borrow-sell-buyback arrows    */
/* ------------------------------------------------------------------ */
function IllustShortSelling() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Grid */}
      {[100, 160, 220, 280, 340].map((y) => (
        <line key={y} x1="60" y1={y} x2="520" y2={y} stroke={BORDER} strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* Axes */}
      <line x1="60" y1="60" x2="60" y2="360" stroke={BORDER} strokeWidth="1.5" />
      <line x1="60" y1="360" x2="520" y2="360" stroke={BORDER} strokeWidth="1.5" />
      {/* Falling price line */}
      <polyline
        points="80,100 140,120 200,110 260,160 320,200 380,260 440,300 500,340"
        fill="none"
        stroke={RED}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Area fill under falling line */}
      <polygon
        points="80,100 140,120 200,110 260,160 320,200 380,260 440,300 500,340 500,360 80,360"
        fill={RED}
        opacity="0.08"
      />
      {/* Sell point (high) */}
      <circle cx="200" cy="110" r="8" fill={RED} opacity="0.8" />
      <circle cx="200" cy="110" r="14" fill={RED} opacity="0.15" />
      {/* Buy-back point (low) */}
      <circle cx="500" cy="340" r="8" fill={GREEN} opacity="0.8" />
      <circle cx="500" cy="340" r="14" fill={GREEN} opacity="0.15" />
      {/* Profit arrow between sell and buy */}
      <line x1="210" y1="120" x2="490" y2="330" stroke={ORANGE} strokeWidth="2" strokeDasharray="6 3" />
      <polygon points="490,322 484,336 496,336" fill={ORANGE} opacity="0.7" />
      {/* Borrow-Sell-BuyBack cycle on right */}
      <rect x="560" y="60" width="200" height="280" rx="12" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      {/* Step 1 - Borrow */}
      <circle cx="600" cy="110" r="18" fill={ACCENT} opacity="0.15" />
      <rect x="630" y="102" width="110" height="14" rx="3" fill={BORDER} opacity="0.5" />
      {/* Step 2 - Sell high */}
      <circle cx="600" cy="170" r="18" fill={RED} opacity="0.15" />
      <rect x="630" y="162" width="90" height="14" rx="3" fill={BORDER} opacity="0.5" />
      {/* Step 3 - Buy back low */}
      <circle cx="600" cy="230" r="18" fill={GREEN} opacity="0.15" />
      <rect x="630" y="222" width="100" height="14" rx="3" fill={BORDER} opacity="0.5" />
      {/* Step 4 - Return */}
      <circle cx="600" cy="290" r="18" fill={ACCENT} opacity="0.15" />
      <rect x="630" y="282" width="80" height="14" rx="3" fill={BORDER} opacity="0.5" />
      {/* Arrows between steps */}
      <line x1="600" y1="130" x2="600" y2="150" stroke={BORDER} strokeWidth="1.5" />
      <polygon points="594,150 600,158 606,150" fill={BORDER} />
      <line x1="600" y1="190" x2="600" y2="210" stroke={BORDER} strokeWidth="1.5" />
      <polygon points="594,210 600,218 606,210" fill={BORDER} />
      <line x1="600" y1="250" x2="600" y2="270" stroke={BORDER} strokeWidth="1.5" />
      <polygon points="594,270 600,278 606,270" fill={BORDER} />
      {/* Bear icon - simplified */}
      <circle cx="50" cy="50" r="3" fill={RED} opacity="0.4" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 24. newconnect-rynek                                                 */
/*     Small building with rocket launching, growth chart               */
/* ------------------------------------------------------------------ */
function IllustNewConnect() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Main platform/stage */}
      <rect x="100" y="300" width="600" height="8" rx="4" fill={BORDER} />
      {/* Small company buildings */}
      <rect x="140" y="230" width="60" height="70" rx="4" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <rect x="150" y="245" width="16" height="16" rx="2" fill={ACCENT} opacity="0.2" />
      <rect x="174" y="245" width="16" height="16" rx="2" fill={ACCENT} opacity="0.2" />
      <rect x="150" y="270" width="16" height="16" rx="2" fill={ACCENT} opacity="0.15" />
      <rect x="174" y="270" width="16" height="16" rx="2" fill={ACCENT} opacity="0.15" />
      <rect x="240" y="250" width="50" height="50" rx="4" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <rect x="250" y="262" width="12" height="12" rx="2" fill={GREEN} opacity="0.2" />
      <rect x="268" y="262" width="12" height="12" rx="2" fill={GREEN} opacity="0.2" />
      <rect x="330" y="220" width="70" height="80" rx="4" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <rect x="342" y="238" width="18" height="18" rx="2" fill={ORANGE} opacity="0.2" />
      <rect x="366" y="238" width="18" height="18" rx="2" fill={ORANGE} opacity="0.2" />
      <rect x="342" y="264" width="18" height="18" rx="2" fill={ORANGE} opacity="0.15" />
      <rect x="366" y="264" width="18" height="18" rx="2" fill={ORANGE} opacity="0.15" />
      {/* Rocket launching from biggest building */}
      <polygon points="365,100 355,160 375,160" fill={ACCENT} opacity="0.8" />
      <rect x="357" y="140" width="16" height="30" rx="2" fill={ACCENT} opacity="0.6" />
      {/* Rocket flame */}
      <polygon points="365,170 358,190 372,190" fill={ORANGE} opacity="0.7" />
      <polygon points="365,182 360,196 370,196" fill={RED} opacity="0.5" />
      {/* Sparkles around rocket */}
      <circle cx="340" cy="120" r="3" fill={ACCENT} opacity="0.4" />
      <circle cx="392" cy="110" r="2.5" fill={GREEN} opacity="0.4" />
      <circle cx="350" cy="80" r="2" fill={ACCENT} opacity="0.3" />
      {/* Growth chart on right */}
      <rect x="480" y="80" width="260" height="200" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <polyline points="510,240 540,230 570,220 600,200 630,170 660,140 690,110 720,100" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="510,240 540,230 570,220 600,200 630,170 660,140 690,110 720,100 720,250 510,250" fill={GREEN} opacity="0.08" />
      {/* Chart label */}
      <rect x="500" y="92" width="80" height="12" rx="3" fill={GREEN} opacity="0.3" />
      {/* Ground line */}
      <line x1="80" y1="340" x2="720" y2="340" stroke={BORDER} strokeWidth="1" />
      {/* Small dots representing companies */}
      <circle cx="160" cy="340" r="4" fill={ACCENT} opacity="0.3" />
      <circle cx="260" cy="340" r="4" fill={GREEN} opacity="0.3" />
      <circle cx="365" cy="340" r="5" fill={ORANGE} opacity="0.4" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 25. kontrakty-terminowe                                              */
/*     Calendar with futures curve and leverage indicator               */
/* ------------------------------------------------------------------ */
function IllustKontraktyTerminowe() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Futures curve chart */}
      <rect x="40" y="40" width="440" height="320" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      {/* Axes */}
      <line x1="80" y1="70" x2="80" y2="320" stroke={BORDER} strokeWidth="1.5" />
      <line x1="80" y1="320" x2="450" y2="320" stroke={BORDER} strokeWidth="1.5" />
      {/* Grid */}
      {[120, 170, 220, 270].map((y) => (
        <line key={y} x1="80" y1={y} x2="450" y2={y} stroke={BORDER} strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* Spot price line */}
      <line x1="80" y1="220" x2="450" y2="220" stroke={ACCENT} strokeWidth="2" strokeDasharray="8 4" opacity="0.5" />
      {/* Contango curve (futures above spot) */}
      <path d="M100,220 Q200,200 300,180 Q400,165 440,155" fill="none" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" />
      {/* Backwardation curve (futures below spot) */}
      <path d="M100,220 Q200,240 300,255 Q400,262 440,265" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
      {/* Expiration markers */}
      {[160, 260, 360, 440].map((x) => (
        <g key={x}>
          <line x1={x} y1="310" x2={x} y2="330" stroke={BORDER} strokeWidth="1.5" />
          <rect x={x - 10} y="332" width="20" height="10" rx="3" fill={BORDER} opacity="0.4" />
        </g>
      ))}
      {/* Calendar on right */}
      <rect x="520" y="40" width="240" height="180" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <rect x="520" y="40" width="240" height="34" rx="10" fill={ACCENT} opacity="0.1" />
      <rect x="570" y="50" width="100" height="12" rx="4" fill={ACCENT} opacity="0.4" />
      {/* Calendar grid */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4, 5, 6].map((col) => {
          const isExpiry = (row === 1 && col === 4) || (row === 3 && col === 2);
          return (
            <rect
              key={`${row}-${col}`}
              x={535 + col * 30}
              y={86 + row * 30}
              width="22"
              height="22"
              rx="4"
              fill={isExpiry ? ORANGE : "transparent"}
              opacity={isExpiry ? 0.25 : 1}
              stroke={isExpiry ? ORANGE : BORDER}
              strokeWidth={isExpiry ? 1.5 : 0.5}
            />
          );
        })
      )}
      {/* Leverage indicator */}
      <rect x="520" y="250" width="240" height="110" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <rect x="540" y="268" width="60" height="10" rx="3" fill={RED} opacity="0.4" />
      {/* Leverage bars */}
      <rect x="540" y="295" width="40" height="16" rx="3" fill={ACCENT} opacity="0.5" />
      <rect x="540" y="320" width="160" height="16" rx="3" fill={RED} opacity="0.6" />
      {/* Arrow showing leverage amplification */}
      <line x1="590" y1="303" x2="700" y2="303" stroke={BORDER} strokeWidth="1" strokeDasharray="3 2" />
      <polygon points="700,299 710,303 700,307" fill={BORDER} opacity="0.5" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 26. wskaznik-rsi                                                     */
/*     RSI oscillator with overbought/oversold zones                   */
/* ------------------------------------------------------------------ */
function IllustRSI() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Price chart (top half) */}
      <rect x="60" y="20" width="680" height="160" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <polyline
        points="90,140 140,130 190,120 240,100 290,90 340,80 390,100 440,120 490,110 540,90 590,70 640,60 690,50 710,55"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="80" y="30" width="50" height="10" rx="3" fill={BORDER} opacity="0.4" />
      {/* RSI chart (bottom half) */}
      <rect x="60" y="200" width="680" height="180" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      {/* RSI label */}
      <rect x="80" y="210" width="40" height="10" rx="3" fill={ACCENT} opacity="0.4" />
      {/* Overbought zone (70) */}
      <rect x="60" y="230" width="680" height="40" rx="0" fill={RED} opacity="0.06" />
      <line x1="60" y1="270" x2="740" y2="270" stroke={RED} strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5" />
      {/* Oversold zone (30) */}
      <rect x="60" y="330" width="680" height="50" rx="0" fill={GREEN} opacity="0.06" />
      <line x1="60" y1="330" x2="740" y2="330" stroke={GREEN} strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5" />
      {/* 50 center line */}
      <line x1="60" y1="300" x2="740" y2="300" stroke={BORDER} strokeWidth="1" strokeDasharray="4 4" />
      {/* RSI line */}
      <polyline
        points="90,310 140,300 190,290 240,270 290,260 340,250 390,280 440,310 490,320 540,340 590,350 640,330 690,300 710,290"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Overbought signal dots */}
      <circle cx="290" cy="260" r="5" fill={RED} opacity="0.7" />
      <circle cx="340" cy="250" r="5" fill={RED} opacity="0.7" />
      {/* Oversold signal dots */}
      <circle cx="590" cy="350" r="5" fill={GREEN} opacity="0.7" />
      <circle cx="540" cy="340" r="5" fill={GREEN} opacity="0.7" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 27. wskaznik-macd                                                    */
/*     MACD histogram with signal line crossover                       */
/* ------------------------------------------------------------------ */
function IllustMACD() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Price chart top */}
      <rect x="60" y="20" width="680" height="150" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <polyline
        points="90,140 130,130 170,125 210,110 250,100 290,95 330,105 370,115 410,120 450,110 490,95 530,80 570,70 610,65 650,60 700,55"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* MACD chart bottom */}
      <rect x="60" y="190" width="680" height="190" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      {/* Zero line */}
      <line x1="80" y1="290" x2="720" y2="290" stroke={BORDER} strokeWidth="1.5" />
      {/* MACD histogram bars */}
      {[
        { x: 100, h: -15 }, { x: 125, h: -25 }, { x: 150, h: -35 }, { x: 175, h: -30 },
        { x: 200, h: -20 }, { x: 225, h: -8 }, { x: 250, h: 5 }, { x: 275, h: 15 },
        { x: 300, h: 28 }, { x: 325, h: 35 }, { x: 350, h: 30 }, { x: 375, h: 22 },
        { x: 400, h: 12 }, { x: 425, h: 3 }, { x: 450, h: -8 }, { x: 475, h: -18 },
        { x: 500, h: -12 }, { x: 525, h: -5 }, { x: 550, h: 8 }, { x: 575, h: 20 },
        { x: 600, h: 32 }, { x: 625, h: 40 }, { x: 650, h: 45 }, { x: 675, h: 42 },
        { x: 700, h: 36 },
      ].map(({ x, h }) => (
        <rect
          key={x}
          x={x - 8}
          y={h > 0 ? 290 - h : 290}
          width="16"
          height={Math.abs(h)}
          rx="2"
          fill={h > 0 ? GREEN : RED}
          opacity="0.6"
        />
      ))}
      {/* MACD line */}
      <polyline
        points="100,305 150,320 200,310 250,290 300,265 350,260 400,275 450,295 500,305 550,285 600,260 650,245 700,252"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Signal line */}
      <polyline
        points="100,310 150,315 200,312 250,298 300,275 350,268 400,270 450,288 500,300 550,295 600,275 650,258 700,255"
        fill="none"
        stroke={ORANGE}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 2"
      />
      {/* Crossover points */}
      <circle cx="250" cy="290" r="6" fill={GREEN} opacity="0.8" />
      <circle cx="250" cy="290" r="10" fill={GREEN} opacity="0.15" />
      <circle cx="550" cy="285" r="6" fill={GREEN} opacity="0.8" />
      <circle cx="550" cy="285" r="10" fill={GREEN} opacity="0.15" />
      {/* Label */}
      <rect x="80" y="200" width="55" height="10" rx="3" fill={ACCENT} opacity="0.4" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 28. srednie-kroczace-sma-ema                                         */
/*     Golden cross with two moving average lines                      */
/* ------------------------------------------------------------------ */
function IllustSrednieKroczace() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Grid */}
      {[80, 140, 200, 260, 320].map((y) => (
        <line key={y} x1="60" y1={y} x2="740" y2={y} stroke={BORDER} strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* Axes */}
      <line x1="60" y1="40" x2="60" y2="360" stroke={BORDER} strokeWidth="1.5" />
      <line x1="60" y1="360" x2="740" y2="360" stroke={BORDER} strokeWidth="1.5" />
      {/* Price line (volatile) */}
      <polyline
        points="80,300 120,280 160,290 200,270 240,260 280,240 320,250 360,230 400,210 440,200 480,180 520,170 560,160 600,140 640,120 680,110 720,100"
        fill="none"
        stroke={BORDER}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* SMA 50 (shorter, faster - blue) */}
      <polyline
        points="80,310 140,290 200,280 260,260 320,250 380,235 440,210 500,185 560,165 620,140 680,115 720,105"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* SMA 200 (longer, slower - orange) */}
      <polyline
        points="80,290 140,280 200,275 260,268 320,262 380,256 440,245 500,230 560,210 620,185 680,160 720,145"
        fill="none"
        stroke={ORANGE}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Golden cross point (where SMA50 crosses above SMA200) */}
      <circle cx="320" cy="255" r="10" fill={GREEN} opacity="0.8" />
      <circle cx="320" cy="255" r="18" fill={GREEN} opacity="0.15" />
      <circle cx="320" cy="255" r="26" fill={GREEN} opacity="0.08" />
      {/* Star burst at golden cross */}
      <line x1="320" y1="225" x2="320" y2="235" stroke={GREEN} strokeWidth="2" opacity="0.5" />
      <line x1="320" y1="275" x2="320" y2="285" stroke={GREEN} strokeWidth="2" opacity="0.5" />
      <line x1="290" y1="255" x2="300" y2="255" stroke={GREEN} strokeWidth="2" opacity="0.5" />
      <line x1="340" y1="255" x2="350" y2="255" stroke={GREEN} strokeWidth="2" opacity="0.5" />
      {/* Legend */}
      <rect x="560" y="40" width="170" height="60" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="1" />
      <line x1="575" y1="60" x2="610" y2="60" stroke={ACCENT} strokeWidth="2.5" />
      <rect x="618" y="55" width="50" height="10" rx="3" fill={BORDER} opacity="0.5" />
      <line x1="575" y1="82" x2="610" y2="82" stroke={ORANGE} strokeWidth="2.5" />
      <rect x="618" y="77" width="55" height="10" rx="3" fill={BORDER} opacity="0.5" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 29. wykres-swiecowy-formacje                                         */
/*     Various candlestick patterns: hammer, doji, engulfing           */
/* ------------------------------------------------------------------ */
function IllustWykresSwiecowy() {
  const patterns = [
    { x: 100, label: "Hammer", candles: [
      { o: 200, c: 160, h: 150, l: 260, bull: true },
    ]},
    { x: 220, label: "Doji", candles: [
      { o: 180, c: 182, h: 140, l: 220, bull: true },
    ]},
    { x: 340, label: "Engulfing", candles: [
      { o: 170, c: 200, h: 160, l: 210, bull: false },
      { o: 210, c: 150, h: 140, l: 220, bull: true },
    ]},
    { x: 500, label: "Morning Star", candles: [
      { o: 160, c: 210, h: 150, l: 220, bull: false },
      { o: 215, c: 220, h: 210, l: 230, bull: false },
      { o: 218, c: 165, h: 155, l: 225, bull: true },
    ]},
  ];

  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Background grid */}
      {[120, 180, 240, 300].map((y) => (
        <line key={y} x1="40" y1={y} x2="760" y2={y} stroke={BORDER} strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* Pattern groups */}
      {patterns.map((pattern, pi) => (
        <g key={pi}>
          {/* Pattern card background */}
          <rect x={pattern.x - 40} y="70" width={pattern.candles.length * 50 + 40} height="260" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="1" />
          {/* Pattern label */}
          <rect x={pattern.x - 25} y="82" width={pattern.candles.length * 40 + 10} height="12" rx="4" fill={ACCENT} opacity="0.2" />
          {/* Candles */}
          {pattern.candles.map((c, ci) => {
            const cx = pattern.x + ci * 50;
            const top = Math.min(c.o, c.c);
            const bot = Math.max(c.o, c.c);
            const color = c.bull ? GREEN : RED;
            return (
              <g key={ci}>
                <line x1={cx} y1={c.h} x2={cx} y2={c.l} stroke={color} strokeWidth="2" />
                <rect x={cx - 14} y={top} width="28" height={Math.max(bot - top, 4)} rx="2" fill={color} opacity="0.85" />
              </g>
            );
          })}
        </g>
      ))}
      {/* Decorative arrow at bottom */}
      <line x1="680" y1="340" x2="760" y2="340" stroke={BORDER} strokeWidth="1.5" />
      {/* Ground */}
      <line x1="40" y1="360" x2="760" y2="360" stroke={BORDER} strokeWidth="1" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 30. wskaznik-roe                                                     */
/*     ROE bar chart with sectors and magnifying glass                 */
/* ------------------------------------------------------------------ */
function IllustROE() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Chart area */}
      <rect x="40" y="40" width="500" height="320" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      {/* Axes */}
      <line x1="80" y1="60" x2="80" y2="320" stroke={BORDER} strokeWidth="1.5" />
      <line x1="80" y1="320" x2="510" y2="320" stroke={BORDER} strokeWidth="1.5" />
      {/* Grid */}
      {[120, 170, 220, 270].map((y) => (
        <line key={y} x1="80" y1={y} x2="510" y2={y} stroke={BORDER} strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* ROE bars for different companies */}
      <rect x="100" y="240" width="45" height="80" rx="4" fill={ACCENT} opacity="0.5" />
      <rect x="160" y="200" width="45" height="120" rx="4" fill={ACCENT} opacity="0.6" />
      <rect x="220" y="160" width="45" height="160" rx="4" fill={GREEN} opacity="0.6" />
      <rect x="280" y="120" width="45" height="200" rx="4" fill={GREEN} opacity="0.7" />
      <rect x="340" y="90" width="45" height="230" rx="4" fill={GREEN} opacity="0.8" />
      <rect x="400" y="180" width="45" height="140" rx="4" fill={ORANGE} opacity="0.6" />
      <rect x="460" y="260" width="45" height="60" rx="4" fill={RED} opacity="0.5" />
      {/* Benchmark line */}
      <line x1="80" y1="200" x2="510" y2="200" stroke={ORANGE} strokeWidth="2" strokeDasharray="8 4" opacity="0.5" />
      {/* Magnifying glass */}
      <circle cx="640" cy="160" r="70" fill="none" stroke={ACCENT} strokeWidth="3.5" opacity="0.7" />
      <circle cx="640" cy="160" r="65" fill={ACCENT} opacity="0.05" />
      <line x1="690" y1="210" x2="750" y2="270" stroke={ACCENT} strokeWidth="7" strokeLinecap="round" opacity="0.7" />
      {/* Inside magnifying glass - ROE percentage */}
      <rect x="608" y="140" width="64" height="28" rx="8" fill={GREEN} opacity="0.2" />
      {/* Bottom labels */}
      {[100, 160, 220, 280, 340, 400, 460].map((x) => (
        <rect key={x} x={x + 5} y="330" width="35" height="8" rx="2" fill={BORDER} opacity="0.4" />
      ))}
      {/* Formula hint */}
      <rect x="580" y="300" width="180" height="50" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="1" />
      <rect x="596" y="315" width="150" height="10" rx="3" fill={BORDER} opacity="0.4" />
      <rect x="596" y="332" width="120" height="8" rx="3" fill={ACCENT} opacity="0.3" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 31. strategia-dca                                                    */
/*     Staircase of coins growing upward with regular intervals        */
/* ------------------------------------------------------------------ */
function IllustDCA() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Ascending staircase of investment blocks */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <g key={i}>
          <rect
            x={80 + i * 80}
            y={320 - i * 30}
            width="60"
            height={30 + i * 30}
            rx="4"
            fill={GREEN}
            opacity={0.3 + i * 0.08}
          />
          {/* Coin on top of each step */}
          <circle cx={110 + i * 80} cy={310 - i * 30} r="12" fill={ORANGE} opacity={0.6 + i * 0.04} />
          <circle cx={110 + i * 80} cy={310 - i * 30} r="7" fill="none" stroke={DARK_BG} strokeWidth="1.5" />
        </g>
      ))}
      {/* Rising trend line through tops */}
      <polyline
        points="110,310 190,280 270,250 350,220 430,190 510,160 590,130 670,100"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="6 3"
      />
      {/* Arrow at end of trend line */}
      <polygon points="670,92 660,100 670,108" fill={ACCENT} opacity="0" />
      <polygon points="680,92 670,84 660,92" fill={ACCENT} opacity="0.7" />
      {/* Calendar/repeat icon (right side) */}
      <rect x="700" y="250" width="60" height="60" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <rect x="700" y="250" width="60" height="18" rx="8" fill={ACCENT} opacity="0.15" />
      {/* Calendar dots */}
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${r}-${c}`} x={710 + c * 16} y={275 + r * 10} width="10" height="6" rx="2" fill={BORDER} opacity="0.4" />
        ))
      )}
      {/* Repeat arrow */}
      <path d="M710,330 Q730,350 750,330" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
      <polygon points="750,324 756,332 748,336" fill={ACCENT} opacity="0.6" />
      {/* Ground */}
      <line x1="60" y1="352" x2="780" y2="352" stroke={BORDER} strokeWidth="1.5" />
      {/* Monthly markers */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <line key={i} x1={110 + i * 80} y1="352" x2={110 + i * 80} y2="358" stroke={BORDER} strokeWidth="1.5" />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 32. value-investing-gpw                                              */
/*     Scale/balance with price vs intrinsic value                     */
/* ------------------------------------------------------------------ */
function IllustValueInvesting() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Balance scale */}
      {/* Stand */}
      <rect x="386" y="280" width="28" height="80" rx="4" fill={BORDER} />
      <rect x="350" y="355" width="100" height="10" rx="5" fill={BORDER} />
      {/* Beam (tilted - value side heavier) */}
      <line x1="180" y1="220" x2="620" y2="170" stroke={BORDER} strokeWidth="4" strokeLinecap="round" />
      {/* Fulcrum triangle */}
      <polygon points="400,260 380,280 420,280" fill={BORDER} />
      {/* Left pan - Market Price (lighter, higher) */}
      <path d="M130,220 L100,280 L260,280 Z" fill={RED} opacity="0.12" stroke={BORDER} strokeWidth="1.5" />
      <line x1="130" y1="195" x2="180" y2="220" stroke={BORDER} strokeWidth="2" />
      <line x1="230" y1="210" x2="180" y2="220" stroke={BORDER} strokeWidth="2" />
      {/* Price tag on left */}
      <rect x="140" y="240" width="80" height="24" rx="6" fill={RED} opacity="0.2" />
      <rect x="150" y="247" width="50" height="10" rx="3" fill={BORDER} opacity="0.5" />
      {/* Right pan - Intrinsic Value (heavier, lower) */}
      <path d="M570,170 L540,240 L700,240 Z" fill={GREEN} opacity="0.12" stroke={BORDER} strokeWidth="1.5" />
      <line x1="570" y1="145" x2="620" y2="170" stroke={BORDER} strokeWidth="2" />
      <line x1="670" y1="158" x2="620" y2="170" stroke={BORDER} strokeWidth="2" />
      {/* Value indicator on right */}
      <rect x="580" y="196" width="90" height="24" rx="6" fill={GREEN} opacity="0.2" />
      <rect x="590" y="203" width="60" height="10" rx="3" fill={BORDER} opacity="0.5" />
      {/* Gold coins in right pan */}
      <circle cx="600" cy="210" r="10" fill={ORANGE} opacity="0.5" />
      <circle cx="625" cy="215" r="10" fill={ORANGE} opacity="0.6" />
      <circle cx="650" cy="210" r="10" fill={ORANGE} opacity="0.5" />
      {/* Margin of safety arrow */}
      <line x1="400" y1="100" x2="400" y2="140" stroke={GREEN} strokeWidth="2" strokeDasharray="4 2" />
      <rect x="340" y="70" width="120" height="28" rx="8" fill={GREEN} opacity="0.12" />
      <rect x="355" y="78" width="90" height="12" rx="3" fill={GREEN} opacity="0.3" />
      {/* Magnifying glass (searching for value) */}
      <circle cx="100" cy="100" r="35" fill="none" stroke={ACCENT} strokeWidth="3" opacity="0.5" />
      <circle cx="100" cy="100" r="30" fill={ACCENT} opacity="0.04" />
      <line x1="125" y1="125" x2="155" y2="155" stroke={ACCENT} strokeWidth="5" strokeLinecap="round" opacity="0.5" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 33. stop-loss-take-profit                                            */
/*     Chart with stop-loss and take-profit horizontal zones           */
/* ------------------------------------------------------------------ */
function IllustStopLoss() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Chart background */}
      <rect x="40" y="20" width="720" height="360" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      {/* Grid */}
      {[80, 140, 200, 260, 320].map((y) => (
        <line key={y} x1="80" y1={y} x2="720" y2={y} stroke={BORDER} strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* Take profit zone */}
      <rect x="80" y="60" width="640" height="60" rx="0" fill={GREEN} opacity="0.06" />
      <line x1="80" y1="120" x2="720" y2="120" stroke={GREEN} strokeWidth="2.5" strokeDasharray="8 4" />
      <rect x="722" y="112" width="30" height="16" rx="4" fill={GREEN} opacity="0.25" />
      {/* Entry point area */}
      <line x1="200" y1="200" x2="720" y2="200" stroke={ACCENT} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
      {/* Stop loss zone */}
      <rect x="80" y="280" width="640" height="60" rx="0" fill={RED} opacity="0.06" />
      <line x1="80" y1="280" x2="720" y2="280" stroke={RED} strokeWidth="2.5" strokeDasharray="8 4" />
      <rect x="722" y="272" width="30" height="16" rx="4" fill={RED} opacity="0.25" />
      {/* Price path */}
      <polyline
        points="100,260 150,240 200,200 250,190 300,180 350,170 400,185 450,160 500,140 550,130 600,125 650,120"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Entry point */}
      <circle cx="200" cy="200" r="8" fill={ACCENT} opacity="0.8" />
      <circle cx="200" cy="200" r="14" fill={ACCENT} opacity="0.15" />
      {/* Take profit hit */}
      <circle cx="650" cy="120" r="8" fill={GREEN} opacity="0.8" />
      <circle cx="650" cy="120" r="14" fill={GREEN} opacity="0.15" />
      {/* Profit zone fill */}
      <rect x="200" y="120" width="450" height="80" rx="0" fill={GREEN} opacity="0.04" />
      {/* Risk zone fill */}
      <rect x="200" y="200" width="450" height="80" rx="0" fill={RED} opacity="0.04" />
      {/* R:R ratio indicator */}
      <rect x="60" y="130" width="8" height="70" rx="2" fill={GREEN} opacity="0.5" />
      <rect x="60" y="210" width="8" height="70" rx="2" fill={RED} opacity="0.5" />
      {/* Shield icon (risk management) */}
      <path d="M730,40 L710,50 L710,75 Q720,90 730,95 Q740,90 750,75 L750,50 Z" fill={ACCENT} stroke={ACCENT} strokeWidth="1.5" opacity="0.2" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 34. momentum-investing                                               */
/*     Rocket following strong upward trend                            */
/* ------------------------------------------------------------------ */
function IllustMomentum() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Grid */}
      {[100, 160, 220, 280, 340].map((y) => (
        <line key={y} x1="60" y1={y} x2="700" y2={y} stroke={BORDER} strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* Axes */}
      <line x1="60" y1="60" x2="60" y2="360" stroke={BORDER} strokeWidth="1.5" />
      <line x1="60" y1="360" x2="700" y2="360" stroke={BORDER} strokeWidth="1.5" />
      {/* Strong uptrend line */}
      <polyline
        points="80,340 140,320 200,300 260,270 320,230 380,190 440,160 500,120 560,90 620,65 680,45"
        fill="none"
        stroke={GREEN}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Trend area fill */}
      <polygon
        points="80,340 140,320 200,300 260,270 320,230 380,190 440,160 500,120 560,90 620,65 680,45 680,360 80,360"
        fill={GREEN}
        opacity="0.07"
      />
      {/* Momentum arrow/rocket shape */}
      <polygon points="690,40 670,65 680,58 680,80 700,80 700,58 710,65" fill={GREEN} opacity="0.8" />
      {/* Trailing flame */}
      <polygon points="680,80 690,100 700,80" fill={ORANGE} opacity="0.6" />
      <polygon points="685,95 690,110 695,95" fill={RED} opacity="0.4" />
      {/* Speed lines */}
      <line x1="640" y1="80" x2="670" y2="55" stroke={GREEN} strokeWidth="1.5" opacity="0.3" />
      <line x1="650" y1="95" x2="675" y2="70" stroke={GREEN} strokeWidth="1.5" opacity="0.25" />
      <line x1="660" y1="110" x2="680" y2="90" stroke={GREEN} strokeWidth="1" opacity="0.2" />
      {/* Momentum indicator panel on right */}
      <rect x="720" y="120" width="60" height="240" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      {/* Momentum bars (vertical meter) */}
      <rect x="735" y="310" width="30" height="30" rx="3" fill={GREEN} opacity="0.3" />
      <rect x="735" y="270" width="30" height="30" rx="3" fill={GREEN} opacity="0.4" />
      <rect x="735" y="230" width="30" height="30" rx="3" fill={GREEN} opacity="0.5" />
      <rect x="735" y="190" width="30" height="30" rx="3" fill={GREEN} opacity="0.6" />
      <rect x="735" y="150" width="30" height="30" rx="3" fill={GREEN} opacity="0.8" />
      {/* Dots on trend */}
      {[
        [320, 230], [440, 160], [560, 90],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill={GREEN} opacity="0.6" />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 35. inwestowanie-zloto-surowce                                       */
/*     Gold bars with commodity price chart                            */
/* ------------------------------------------------------------------ */
function IllustZlotoSurowce() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Gold bars stack */}
      {/* Bar 1 (bottom) */}
      <polygon points="100,310 200,310 220,290 120,290" fill={ORANGE} opacity="0.7" />
      <polygon points="200,310 220,290 220,270 200,290" fill={ORANGE} opacity="0.5" />
      <rect x="100" y="290" width="100" height="20" rx="2" fill={ORANGE} opacity="0.8" />
      {/* Bar 2 */}
      <polygon points="115,290 195,290 210,272 130,272" fill={ORANGE} opacity="0.65" />
      <polygon points="195,290 210,272 210,254 195,272" fill={ORANGE} opacity="0.45" />
      <rect x="115" y="272" width="80" height="18" rx="2" fill={ORANGE} opacity="0.75" />
      {/* Bar 3 (top) */}
      <polygon points="128,272 188,272 200,256 140,256" fill={ORANGE} opacity="0.6" />
      <polygon points="188,272 200,256 200,240 188,256" fill={ORANGE} opacity="0.4" />
      <rect x="128" y="256" width="60" height="16" rx="2" fill={ORANGE} opacity="0.7" />
      {/* Gold coins */}
      <circle cx="80" cy="350" r="20" fill={ORANGE} opacity="0.6" />
      <circle cx="80" cy="350" r="13" fill="none" stroke={DARK_BG} strokeWidth="2" />
      <circle cx="250" cy="340" r="16" fill={ORANGE} opacity="0.5" />
      <circle cx="250" cy="340" r="10" fill="none" stroke={DARK_BG} strokeWidth="1.5" />
      {/* Commodity price chart */}
      <rect x="320" y="40" width="440" height="320" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      {/* Chart axes */}
      <line x1="360" y1="70" x2="360" y2="320" stroke={BORDER} strokeWidth="1.5" />
      <line x1="360" y1="320" x2="730" y2="320" stroke={BORDER} strokeWidth="1.5" />
      {/* Grid */}
      {[120, 170, 220, 270].map((y) => (
        <line key={y} x1="360" y1={y} x2="730" y2={y} stroke={BORDER} strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* Gold price line */}
      <polyline
        points="380,280 420,260 460,250 500,230 540,200 580,180 620,160 660,130 700,100"
        fill="none"
        stroke={ORANGE}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        points="380,280 420,260 460,250 500,230 540,200 580,180 620,160 660,130 700,100 700,320 380,320"
        fill={ORANGE}
        opacity="0.08"
      />
      {/* Oil/commodity line */}
      <polyline
        points="380,200 420,210 460,190 500,220 540,240 580,230 620,210 660,200 700,180"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 3"
      />
      {/* Legend */}
      <rect x="560" y="50" width="150" height="40" rx="6" fill={CARD_BG} stroke={BORDER} strokeWidth="1" />
      <line x1="575" y1="63" x2="605" y2="63" stroke={ORANGE} strokeWidth="2.5" />
      <rect x="612" y="58" width="40" height="10" rx="3" fill={BORDER} opacity="0.5" />
      <line x1="575" y1="80" x2="605" y2="80" stroke={ACCENT} strokeWidth="2" strokeDasharray="4 2" />
      <rect x="612" y="75" width="50" height="10" rx="3" fill={BORDER} opacity="0.5" />
      {/* Sparkle on gold */}
      <circle cx="160" cy="240" r="3" fill={ORANGE} opacity="0.4" />
      <circle cx="145" cy="250" r="2" fill={ORANGE} opacity="0.3" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* rynek-catalyst-obligacje                                            */
/* Bond certificates with yield bars                                   */
/* ------------------------------------------------------------------ */
function IllustCatalyst() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Bond certificate */}
      <rect x="60" y="60" width="300" height="200" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      <rect x="60" y="60" width="300" height="40" rx="8" fill={ACCENT} opacity="0.1" />
      <rect x="80" y="75" width="120" height="12" rx="4" fill={ACCENT} opacity="0.4" />
      {/* Bond lines */}
      <rect x="80" y="120" width="260" height="6" rx="3" fill={BORDER} opacity="0.4" />
      <rect x="80" y="140" width="200" height="6" rx="3" fill={BORDER} opacity="0.3" />
      <rect x="80" y="160" width="240" height="6" rx="3" fill={BORDER} opacity="0.3" />
      {/* Coupon markers */}
      {[0, 1, 2, 3].map(i => (
        <circle key={i} cx={100 + i * 60} cy="210" r="12" fill={GREEN} opacity={0.3 + i * 0.15} />
      ))}
      {/* Yield chart */}
      <rect x="420" y="60" width="340" height="280" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <line x1="450" y1="300" x2="730" y2="300" stroke={BORDER} strokeWidth="1.5" />
      <line x1="450" y1="80" x2="450" y2="300" stroke={BORDER} strokeWidth="1.5" />
      {/* Yield bars */}
      <rect x="475" y="230" width="28" height="70" rx="4" fill={ACCENT} opacity="0.4" />
      <rect x="515" y="200" width="28" height="100" rx="4" fill={ACCENT} opacity="0.5" />
      <rect x="555" y="170" width="28" height="130" rx="4" fill={GREEN} opacity="0.6" />
      <rect x="595" y="150" width="28" height="150" rx="4" fill={GREEN} opacity="0.7" />
      <rect x="635" y="130" width="28" height="170" rx="4" fill={GREEN} opacity="0.8" />
      <rect x="675" y="110" width="28" height="190" rx="4" fill={ORANGE} opacity="0.7" />
      {/* Yield curve */}
      <polyline points="489,225 529,195 569,165 609,145 649,125 689,105" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 3" />
      {/* Percentage labels */}
      <rect x="460" y="75" width="80" height="10" rx="3" fill={BORDER} opacity="0.3" />
      {/* Decorative bond border */}
      <rect x="64" y="64" width="292" height="192" rx="6" fill="none" stroke={ACCENT} strokeWidth="1" strokeDasharray="4 3" opacity="0.2" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* prawa-poboru-emisja-akcji                                           */
/* Share certificates splitting                                        */
/* ------------------------------------------------------------------ */
function IllustPrawaPoboru() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Original share */}
      <rect x="80" y="100" width="200" height="130" rx="8" fill={CARD_BG} stroke={ACCENT} strokeWidth="2" />
      <rect x="100" y="120" width="80" height="10" rx="3" fill={ACCENT} opacity="0.5" />
      <rect x="100" y="140" width="160" height="6" rx="3" fill={BORDER} opacity="0.4" />
      <rect x="100" y="155" width="120" height="6" rx="3" fill={BORDER} opacity="0.3" />
      <circle cx="230" cy="195" r="16" fill={ACCENT} opacity="0.2" />
      <rect x="222" y="189" width="16" height="12" rx="3" fill={ACCENT} opacity="0.4" />
      {/* Arrow splitting */}
      <path d="M300,165 L380,120" fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      <polygon points="380,120 370,128 376,115" fill={GREEN} />
      <path d="M300,165 L380,210" fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      <polygon points="380,210 370,202 376,215" fill={GREEN} />
      {/* New shares (2) */}
      <rect x="400" y="60" width="170" height="110" rx="8" fill={CARD_BG} stroke={GREEN} strokeWidth="2" />
      <rect x="416" y="78" width="60" height="8" rx="3" fill={GREEN} opacity="0.5" />
      <rect x="416" y="95" width="138" height="5" rx="2" fill={BORDER} opacity="0.3" />
      <rect x="416" y="108" width="100" height="5" rx="2" fill={BORDER} opacity="0.3" />
      <rect x="400" y="200" width="170" height="110" rx="8" fill={CARD_BG} stroke={GREEN} strokeWidth="2" />
      <rect x="416" y="218" width="60" height="8" rx="3" fill={GREEN} opacity="0.5" />
      <rect x="416" y="235" width="138" height="5" rx="2" fill={BORDER} opacity="0.3" />
      <rect x="416" y="248" width="100" height="5" rx="2" fill={BORDER} opacity="0.3" />
      {/* Rights badge */}
      <rect x="620" y="100" width="140" height="200" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <rect x="640" y="120" width="100" height="10" rx="3" fill={ORANGE} opacity="0.5" />
      {/* Timeline dots */}
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          <circle cx="690" cy={165 + i * 35} r="6" fill={i < 3 ? GREEN : ORANGE} opacity="0.7" />
          <rect x="706" y={161 + i * 35} width="40" height="8" rx="3" fill={BORDER} opacity="0.4" />
          {i < 3 && <line x1="690" y1={171 + i * 35} x2="690" y2={194 + i * 35} stroke={BORDER} strokeWidth="1.5" />}
        </g>
      ))}
      {/* Plus signs */}
      <line x1="345" y1="155" x2="345" y2="175" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      <line x1="335" y1="165" x2="355" y2="165" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* depozyt-dzwignia-finansowa                                          */
/* Lever/fulcrum with amplified returns                                */
/* ------------------------------------------------------------------ */
function IllustDzwignia() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Fulcrum triangle */}
      <polygon points="400,300 370,350 430,350" fill={BORDER} stroke={BORDER} strokeWidth="2" />
      {/* Lever bar */}
      <line x1="150" y1="220" x2="650" y2="280" stroke={ACCENT} strokeWidth="6" strokeLinecap="round" />
      {/* Small weight (deposit) on right */}
      <rect x="600" y="245" width="80" height="40" rx="6" fill={ORANGE} opacity="0.7" />
      <rect x="615" y="255" width="50" height="8" rx="3" fill={DARK_BG} opacity="0.3" />
      {/* Large weight (position) lifted on left */}
      <rect x="110" y="170" width="120" height="55" rx="6" fill={GREEN} opacity="0.7" />
      <rect x="130" y="183" width="80" height="8" rx="3" fill={DARK_BG} opacity="0.3" />
      <rect x="130" y="200" width="60" height="8" rx="3" fill={DARK_BG} opacity="0.2" />
      {/* Multiplier labels */}
      <rect x="300" y="60" width="200" height="70" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <rect x="320" y="78" width="60" height="10" rx="3" fill={ACCENT} opacity="0.4" />
      {/* Multiplier bars */}
      <rect x="320" y="98" width="40" height="14" rx="4" fill={GREEN} opacity="0.5" />
      <rect x="370" y="98" width="60" height="14" rx="4" fill={GREEN} opacity="0.6" />
      <rect x="440" y="98" width="40" height="14" rx="4" fill={ORANGE} opacity="0.7" />
      {/* Up arrow (amplified gain) */}
      <line x1="100" y1="160" x2="100" y2="80" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      <polygon points="100,75 88,95 112,95" fill={GREEN} />
      {/* Down arrow (amplified loss) */}
      <line x1="700" y1="240" x2="700" y2="350" stroke={RED} strokeWidth="3" strokeLinecap="round" />
      <polygon points="700,355 688,335 712,335" fill={RED} />
      {/* Warning triangle */}
      <polygon points="700,60 680,100 720,100" fill="none" stroke={RED} strokeWidth="2" />
      <line x1="700" y1="72" x2="700" y2="88" stroke={RED} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="700" cy="94" r="2" fill={RED} />
      {/* Ground */}
      <line x1="50" y1="355" x2="750" y2="355" stroke={BORDER} strokeWidth="2" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* ipo-debiuty-gieldowe                                                */
/* Company building going public — bell, rising chart                  */
/* ------------------------------------------------------------------ */
function IllustIPO() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Podium / stage */}
      <rect x="200" y="240" width="400" height="120" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      {/* Company building on podium */}
      <rect x="320" y="140" width="160" height="100" rx="4" fill={CARD_BG} stroke={ACCENT} strokeWidth="2" />
      <rect x="320" y="140" width="160" height="25" rx="4" fill={ACCENT} opacity="0.15" />
      {/* Windows */}
      {[0, 1, 2].map(i => (
        <g key={i}>
          <rect x={340 + i * 45} y="180" width="30" height="20" rx="3" fill={DARK_BG} stroke={BORDER} strokeWidth="1" />
          <rect x={340 + i * 45} y="210" width="30" height="20" rx="3" fill={DARK_BG} stroke={BORDER} strokeWidth="1" />
        </g>
      ))}
      {/* Bell */}
      <path d="M395,90 C395,70 405,70 405,90" fill="none" stroke={ORANGE} strokeWidth="3" />
      <path d="M380,110 C380,85 420,85 420,110" fill={ORANGE} opacity="0.3" stroke={ORANGE} strokeWidth="2" />
      <line x1="380" y1="110" x2="420" y2="110" stroke={ORANGE} strokeWidth="2" />
      <circle cx="400" cy="115" r="4" fill={ORANGE} />
      {/* Sound waves */}
      <path d="M425,95 C435,90 435,105 425,100" fill="none" stroke={ORANGE} strokeWidth="1.5" opacity="0.5" />
      <path d="M435,88 C450,80 450,110 435,102" fill="none" stroke={ORANGE} strokeWidth="1.5" opacity="0.3" />
      {/* Arrow up */}
      <line x1="400" y1="60" x2="400" y2="35" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      <polygon points="400,30 390,45 410,45" fill={GREEN} />
      {/* Stock chart on right */}
      <polyline points="620,340 650,310 670,320 700,280 730,250 760,200" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="620,340 650,310 670,320 700,280 730,250 760,200 760,340" fill={GREEN} opacity="0.08" />
      {/* People silhouettes (investors) */}
      {[60, 120, 680, 740].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="300" r="10" fill={ACCENT} opacity="0.3" />
          <rect x={x - 8} y="315" width="16" height="25" rx="5" fill={ACCENT} opacity="0.2" />
        </g>
      ))}
      {/* IPO label */}
      <rect x="350" y="260" width="100" height="24" rx="6" fill={GREEN} opacity="0.15" />
      <rect x="365" y="267" width="70" height="10" rx="3" fill={GREEN} opacity="0.4" />
      {/* Ground */}
      <line x1="30" y1="365" x2="770" y2="365" stroke={BORDER} strokeWidth="1.5" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* ryzyko-inwestycyjne                                                 */
/* Risk gauge/shield with different risk levels                        */
/* ------------------------------------------------------------------ */
function IllustRyzyko() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Shield */}
      <path d="M400,50 L500,90 L500,220 C500,300 400,350 400,350 C400,350 300,300 300,220 L300,90 Z" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      <path d="M400,65 L485,100 L485,220 C485,290 400,335 400,335 C400,335 315,290 315,220 L315,100 Z" fill={ACCENT} opacity="0.06" />
      {/* Risk gauge arc */}
      <path d="M345,220 A55,55 0 0,1 455,220" fill="none" stroke={BORDER} strokeWidth="8" strokeLinecap="round" />
      <path d="M345,220 A55,55 0 0,1 382,173" fill="none" stroke={GREEN} strokeWidth="8" strokeLinecap="round" />
      <path d="M382,173 A55,55 0 0,1 418,173" fill="none" stroke={ORANGE} strokeWidth="8" strokeLinecap="round" />
      <path d="M418,173 A55,55 0 0,1 455,220" fill="none" stroke={RED} strokeWidth="8" strokeLinecap="round" />
      {/* Gauge needle */}
      <line x1="400" y1="220" x2="425" y2="185" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" />
      <circle cx="400" cy="220" r="6" fill={ACCENT} />
      {/* Risk level cards */}
      <rect x="40" y="80" width="180" height="70" rx="8" fill={CARD_BG} stroke={GREEN} strokeWidth="1.5" opacity="0.8" />
      <rect x="60" y="98" width="60" height="8" rx="3" fill={GREEN} opacity="0.5" />
      <rect x="60" y="116" width="140" height="6" rx="3" fill={BORDER} opacity="0.3" />
      <rect x="60" y="130" width="100" height="6" rx="3" fill={BORDER} opacity="0.2" />
      <rect x="40" y="170" width="180" height="70" rx="8" fill={CARD_BG} stroke={ORANGE} strokeWidth="1.5" opacity="0.8" />
      <rect x="60" y="188" width="60" height="8" rx="3" fill={ORANGE} opacity="0.5" />
      <rect x="60" y="206" width="140" height="6" rx="3" fill={BORDER} opacity="0.3" />
      <rect x="60" y="220" width="100" height="6" rx="3" fill={BORDER} opacity="0.2" />
      <rect x="40" y="260" width="180" height="70" rx="8" fill={CARD_BG} stroke={RED} strokeWidth="1.5" opacity="0.8" />
      <rect x="60" y="278" width="60" height="8" rx="3" fill={RED} opacity="0.5" />
      <rect x="60" y="296" width="140" height="6" rx="3" fill={BORDER} opacity="0.3" />
      <rect x="60" y="310" width="100" height="6" rx="3" fill={BORDER} opacity="0.2" />
      {/* Volatility chart on right */}
      <rect x="580" y="80" width="180" height="260" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <polyline points="600,300 620,280 635,290 650,260 670,270 685,230 700,250 715,200 730,220 745,180" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <polyline points="600,280 630,270 660,260 690,245 720,230 745,210" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
      <rect x="600" y="95" width="70" height="10" rx="3" fill={BORDER} opacity="0.3" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* wskaznik-eps                                                        */
/* EPS calculator with earnings bars                                   */
/* ------------------------------------------------------------------ */
function IllustEPS() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Calculator */}
      <rect x="60" y="60" width="260" height="280" rx="12" fill={CARD_BG} stroke={BORDER} strokeWidth="2" />
      <rect x="80" y="80" width="220" height="60" rx="8" fill={DARK_BG} />
      <rect x="100" y="95" width="100" height="14" rx="4" fill={GREEN} opacity="0.5" />
      <rect x="210" y="100" width="70" height="10" rx="3" fill={ACCENT} opacity="0.3" />
      {/* Calculator buttons */}
      {[0, 1, 2].map(row => [0, 1, 2, 3].map(col => (
        <rect key={`${row}${col}`} x={90 + col * 52} y={160 + row * 52} width="40" height="36" rx="6" fill={BORDER} opacity="0.3" />
      )))}
      {/* Formula display */}
      <rect x="80" y="310" width="220" height="20" rx="4" fill={ACCENT} opacity="0.1" />
      <rect x="90" y="314" width="140" height="12" rx="3" fill={ACCENT} opacity="0.3" />
      {/* EPS growth chart */}
      <rect x="380" y="60" width="380" height="280" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <line x1="410" y1="300" x2="730" y2="300" stroke={BORDER} strokeWidth="1.5" />
      <line x1="410" y1="80" x2="410" y2="300" stroke={BORDER} strokeWidth="1.5" />
      {/* EPS bars growing */}
      <rect x="430" y="250" width="35" height="50" rx="4" fill={ACCENT} opacity="0.4" />
      <rect x="480" y="220" width="35" height="80" rx="4" fill={ACCENT} opacity="0.5" />
      <rect x="530" y="190" width="35" height="110" rx="4" fill={GREEN} opacity="0.6" />
      <rect x="580" y="160" width="35" height="140" rx="4" fill={GREEN} opacity="0.7" />
      <rect x="630" y="130" width="35" height="170" rx="4" fill={GREEN} opacity="0.8" />
      <rect x="680" y="100" width="35" height="200" rx="4" fill={GREEN} />
      {/* Trend line */}
      <polyline points="447,245 497,215 547,185 597,155 647,125 697,95" fill="none" stroke={ACCENT} strokeWidth="2" strokeDasharray="6 3" />
      {/* Label */}
      <rect x="420" y="75" width="60" height="10" rx="3" fill={BORDER} opacity="0.3" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* wolumen-obrotu                                                      */
/* Volume bars beneath price line                                      */
/* ------------------------------------------------------------------ */
function IllustWolumen() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Axes */}
      <line x1="80" y1="60" x2="80" y2="370" stroke={BORDER} strokeWidth="1.5" />
      <line x1="80" y1="370" x2="740" y2="370" stroke={BORDER} strokeWidth="1.5" />
      {/* Price line (upper half) */}
      <polyline points="100,180 150,170 200,160 250,175 300,150 350,130 400,140 450,120 500,100 550,110 600,90 650,85 700,70" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Separator line */}
      <line x1="80" y1="220" x2="740" y2="220" stroke={BORDER} strokeWidth="1" strokeDasharray="4 4" />
      {/* Volume bars (lower half) */}
      {[
        [100, 50, false], [150, 70, true], [200, 40, false], [250, 90, true], [300, 60, false],
        [350, 110, true], [400, 80, true], [450, 130, true], [500, 160, true], [550, 100, false],
        [600, 140, true], [650, 120, true], [700, 90, false],
      ].map(([x, h, up], i) => (
        <rect key={i} x={x - 14} y={360 - h} width="28" height={h} rx="3" fill={up ? GREEN : RED} opacity="0.6" />
      ))}
      {/* High volume spike highlight */}
      <rect x="486" y="195" width="28" height="170" rx="3" fill={GREEN} opacity="0.1" />
      {/* VWAP line */}
      <polyline points="100,175 200,170 300,160 400,145 500,130 600,120 700,110" fill="none" stroke={ORANGE} strokeWidth="1.5" strokeDasharray="6 3" opacity="0.6" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* wskaznik-ebitda                                                     */
/* Financial statement layers breakdown                                */
/* ------------------------------------------------------------------ */
function IllustEBITDA() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Waterfall chart: Revenue → EBITDA → EBIT → Net Income */}
      <line x1="100" y1="350" x2="700" y2="350" stroke={BORDER} strokeWidth="1.5" />
      {/* Revenue bar */}
      <rect x="120" y="70" width="80" height="280" rx="6" fill={ACCENT} opacity="0.7" />
      <rect x="130" y="80" width="60" height="10" rx="3" fill={DARK_BG} opacity="0.3" />
      {/* Minus DA */}
      <rect x="240" y="70" width="80" height="80" rx="6" fill={RED} opacity="0.4" />
      {/* EBITDA bar */}
      <rect x="360" y="150" width="80" height="200" rx="6" fill={GREEN} opacity="0.7" />
      <rect x="370" y="160" width="60" height="10" rx="3" fill={DARK_BG} opacity="0.3" />
      {/* Minus Interest & Tax */}
      <rect x="480" y="150" width="80" height="60" rx="6" fill={ORANGE} opacity="0.4" />
      {/* Net Income bar */}
      <rect x="600" y="210" width="80" height="140" rx="6" fill={GREEN} opacity="0.5" />
      <rect x="610" y="220" width="60" height="10" rx="3" fill={DARK_BG} opacity="0.3" />
      {/* Connecting lines */}
      <line x1="200" y1="350" x2="240" y2="350" stroke={BORDER} strokeWidth="1" strokeDasharray="3 2" />
      <line x1="200" y1="150" x2="360" y2="150" stroke={BORDER} strokeWidth="1" strokeDasharray="3 2" />
      <line x1="440" y1="210" x2="600" y2="210" stroke={BORDER} strokeWidth="1" strokeDasharray="3 2" />
      {/* Labels */}
      <rect x="120" y="355" width="80" height="10" rx="3" fill={BORDER} opacity="0.4" />
      <rect x="360" y="355" width="80" height="10" rx="3" fill={BORDER} opacity="0.4" />
      <rect x="600" y="355" width="80" height="10" rx="3" fill={BORDER} opacity="0.4" />
      {/* Highlight bracket for EBITDA */}
      <path d="M355,145 L355,355 M355,250 L345,250" fill="none" stroke={GREEN} strokeWidth="2" opacity="0.4" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* formacje-cenowe                                                     */
/* Head and shoulders pattern with triangles                           */
/* ------------------------------------------------------------------ */
function IllustFormacjeCenowe() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Grid */}
      {[100, 160, 220, 280, 340].map(y => (
        <line key={y} x1="60" y1={y} x2="400" y2={y} stroke={BORDER} strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* Head and Shoulders pattern */}
      <polyline points="80,280 120,240 150,280 190,200 230,120 270,200 310,280 350,240 380,280" fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Neckline */}
      <line x1="80" y1="280" x2="400" y2="280" stroke={RED} strokeWidth="2" strokeDasharray="8 4" />
      {/* Labels */}
      <circle cx="120" cy="235" r="4" fill={ACCENT} opacity="0.5" />
      <circle cx="230" cy="115" r="4" fill={ACCENT} opacity="0.5" />
      <circle cx="350" cy="235" r="4" fill={ACCENT} opacity="0.5" />
      {/* Triangle pattern on right side */}
      <rect x="440" y="60" width="320" height="280" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      {/* Ascending triangle */}
      <line x1="470" y1="140" x2="730" y2="140" stroke={GREEN} strokeWidth="2" />
      <polyline points="470,260 510,230 540,250 580,210 610,240 650,190 690,220 730,170" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
      {/* Support trendline */}
      <line x1="470" y1="260" x2="730" y2="170" stroke={GREEN} strokeWidth="2" strokeDasharray="6 3" />
      {/* Breakout arrow */}
      <line x1="710" y1="140" x2="710" y2="100" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      <polygon points="710,95 700,110 720,110" fill={GREEN} />
      {/* Label */}
      <rect x="460" y="75" width="80" height="10" rx="3" fill={BORDER} opacity="0.3" />
      {/* Axes */}
      <line x1="60" y1="60" x2="60" y2="370" stroke={BORDER} strokeWidth="1.5" />
      <line x1="60" y1="370" x2="400" y2="370" stroke={BORDER} strokeWidth="1.5" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* bollinger-bands                                                     */
/* Chart with upper, middle, lower Bollinger Bands                     */
/* ------------------------------------------------------------------ */
function IllustBollingerBands() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Axes */}
      <line x1="80" y1="60" x2="80" y2="360" stroke={BORDER} strokeWidth="1.5" />
      <line x1="80" y1="360" x2="740" y2="360" stroke={BORDER} strokeWidth="1.5" />
      {/* Grid */}
      {[120, 180, 240, 300].map(y => (
        <line key={y} x1="80" y1={y} x2="740" y2={y} stroke={BORDER} strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* Upper band */}
      <polyline points="100,140 160,130 220,120 280,100 340,130 400,160 460,120 520,90 580,110 640,100 700,80" fill="none" stroke={ACCENT} strokeWidth="1.5" opacity="0.6" />
      {/* Middle band (SMA) */}
      <polyline points="100,200 160,195 220,190 280,180 340,195 400,210 460,190 520,170 580,180 640,175 700,160" fill="none" stroke={ACCENT} strokeWidth="2" strokeDasharray="6 3" />
      {/* Lower band */}
      <polyline points="100,260 160,260 220,260 280,260 340,260 400,260 460,260 520,250 580,250 640,250 700,240" fill="none" stroke={ACCENT} strokeWidth="1.5" opacity="0.6" />
      {/* Band fill */}
      <polygon points="100,140 160,130 220,120 280,100 340,130 400,160 460,120 520,90 580,110 640,100 700,80 700,240 640,250 580,250 520,250 460,260 400,260 340,260 280,260 220,260 160,260 100,260" fill={ACCENT} opacity="0.06" />
      {/* Price line */}
      <polyline points="100,210 160,200 220,195 280,170 340,200 400,220 460,180 520,150 580,170 640,160 700,140" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Squeeze zone highlight */}
      <rect x="340" y="130" width="120" height="140" rx="6" fill={ORANGE} opacity="0.08" />
      {/* Breakout arrow */}
      <line x1="520" y1="85" x2="520" y2="55" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      <polygon points="520,50 510,65 530,65" fill={GREEN} />
      {/* Band width indicator */}
      <line x1="720" y1="80" x2="720" y2="240" stroke={ACCENT} strokeWidth="1" />
      <line x1="715" y1="80" x2="725" y2="80" stroke={ACCENT} strokeWidth="1.5" />
      <line x1="715" y1="240" x2="725" y2="240" stroke={ACCENT} strokeWidth="1.5" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* swing-trading                                                       */
/* Chart with swing highs and lows marked                              */
/* ------------------------------------------------------------------ */
function IllustSwingTrading() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Axes */}
      <line x1="60" y1="60" x2="60" y2="360" stroke={BORDER} strokeWidth="1.5" />
      <line x1="60" y1="360" x2="760" y2="360" stroke={BORDER} strokeWidth="1.5" />
      {/* Grid */}
      {[120, 180, 240, 300].map(y => (
        <line key={y} x1="60" y1={y} x2="760" y2={y} stroke={BORDER} strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* Price line with swings */}
      <polyline points="80,300 140,250 200,280 280,180 340,220 420,140 480,180 560,100 620,150 700,80 740,110" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Swing highs */}
      {[[280, 180], [420, 140], [560, 100], [700, 80]].map(([x, y], i) => (
        <g key={`h${i}`}>
          <circle cx={x} cy={y} r="8" fill={RED} opacity="0.2" />
          <circle cx={x} cy={y} r="4" fill={RED} opacity="0.8" />
          <line x1={x} y1={y - 12} x2={x} y2={y - 25} stroke={RED} strokeWidth="2" strokeLinecap="round" />
          <polygon points={`${x},${y - 30} ${x - 5},${y - 20} ${x + 5},${y - 20}`} fill={RED} opacity="0.6" />
        </g>
      ))}
      {/* Swing lows */}
      {[[200, 280], [340, 220], [480, 180], [620, 150]].map(([x, y], i) => (
        <g key={`l${i}`}>
          <circle cx={x} cy={y} r="8" fill={GREEN} opacity="0.2" />
          <circle cx={x} cy={y} r="4" fill={GREEN} opacity="0.8" />
          <line x1={x} y1={y + 12} x2={x} y2={y + 25} stroke={GREEN} strokeWidth="2" strokeLinecap="round" />
          <polygon points={`${x},${y + 30} ${x - 5},${y + 20} ${x + 5},${y + 20}`} fill={GREEN} opacity="0.6" />
        </g>
      ))}
      {/* Trade brackets */}
      <rect x="195" y="175" width="90" height="110" rx="6" fill={GREEN} opacity="0.06" stroke={GREEN} strokeWidth="1" strokeDasharray="4 3" />
      <rect x="335" y="135" width="90" height="90" rx="6" fill={GREEN} opacity="0.06" stroke={GREEN} strokeWidth="1" strokeDasharray="4 3" />
      {/* Time labels */}
      <rect x="180" y="345" width="40" height="8" rx="3" fill={BORDER} opacity="0.3" />
      <rect x="400" y="345" width="40" height="8" rx="3" fill={BORDER} opacity="0.3" />
      <rect x="620" y="345" width="40" height="8" rx="3" fill={BORDER} opacity="0.3" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* growth-investing                                                    */
/* Rocket chart with accelerating growth                               */
/* ------------------------------------------------------------------ */
function IllustGrowthInvesting() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Chart area */}
      <line x1="80" y1="60" x2="80" y2="350" stroke={BORDER} strokeWidth="1.5" />
      <line x1="80" y1="350" x2="740" y2="350" stroke={BORDER} strokeWidth="1.5" />
      {/* Accelerating growth curve */}
      <path d="M100,330 C200,320 300,300 400,260 C500,220 550,150 600,90 C620,65 640,50 680,35" fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      <path d="M100,330 C200,320 300,300 400,260 C500,220 550,150 600,90 C620,65 640,50 680,35 L680,350 L100,350 Z" fill={GREEN} opacity="0.08" />
      {/* Revenue bars in background */}
      {[140, 220, 300, 380, 460, 540, 620].map((x, i) => (
        <rect key={i} x={x - 15} y={340 - (i + 1) * 30} width="30" height={(i + 1) * 30} rx="4" fill={ACCENT} opacity={0.15 + i * 0.03} />
      ))}
      {/* Growth dot on curve */}
      <circle cx="680" cy="35" r="8" fill={GREEN} opacity="0.3" />
      <circle cx="680" cy="35" r="4" fill={GREEN} />
      {/* Rocket icon */}
      <path d="M700,55 L720,30 L730,50 Z" fill={ORANGE} opacity="0.7" />
      <rect x="706" y="50" width="12" height="16" rx="3" fill={ORANGE} opacity="0.5" />
      {/* Exhaust */}
      <circle cx="712" cy="72" r="4" fill={ORANGE} opacity="0.3" />
      <circle cx="708" cy="80" r="3" fill={ORANGE} opacity="0.2" />
      <circle cx="716" cy="82" r="2" fill={ORANGE} opacity="0.15" />
      {/* Key metrics cards */}
      <rect x="100" y="70" width="160" height="60" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <rect x="115" y="85" width="50" height="8" rx="3" fill={GREEN} opacity="0.5" />
      <rect x="115" y="105" width="130" height="6" rx="3" fill={BORDER} opacity="0.3" />
      <rect x="100" y="145" width="160" height="60" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <rect x="115" y="160" width="50" height="8" rx="3" fill={ACCENT} opacity="0.5" />
      <rect x="115" y="180" width="130" height="6" rx="3" fill={BORDER} opacity="0.3" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* dywersyfikacja-portfela                                             */
/* Multiple baskets with eggs — diversification visual                 */
/* ------------------------------------------------------------------ */
function IllustDywersyfikacja() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Basket 1 — Stocks */}
      <path d="M80,240 C80,210 180,210 180,240 L170,310 C170,320 90,320 90,310 Z" fill={CARD_BG} stroke={ACCENT} strokeWidth="2" />
      <ellipse cx="130" cy="240" rx="50" ry="15" fill={CARD_BG} stroke={ACCENT} strokeWidth="2" />
      {/* Eggs in basket 1 */}
      <ellipse cx="115" cy="260" rx="14" ry="18" fill={ACCENT} opacity="0.5" />
      <ellipse cx="145" cy="265" rx="14" ry="18" fill={ACCENT} opacity="0.4" />
      <ellipse cx="130" cy="280" rx="14" ry="18" fill={ACCENT} opacity="0.3" />
      {/* Basket 2 — Bonds */}
      <path d="M270,240 C270,210 370,210 370,240 L360,310 C360,320 280,320 280,310 Z" fill={CARD_BG} stroke={GREEN} strokeWidth="2" />
      <ellipse cx="320" cy="240" rx="50" ry="15" fill={CARD_BG} stroke={GREEN} strokeWidth="2" />
      <ellipse cx="305" cy="260" rx="14" ry="18" fill={GREEN} opacity="0.5" />
      <ellipse cx="335" cy="265" rx="14" ry="18" fill={GREEN} opacity="0.4" />
      {/* Basket 3 — ETFs */}
      <path d="M460,240 C460,210 560,210 560,240 L550,310 C550,320 470,320 470,310 Z" fill={CARD_BG} stroke={ORANGE} strokeWidth="2" />
      <ellipse cx="510" cy="240" rx="50" ry="15" fill={CARD_BG} stroke={ORANGE} strokeWidth="2" />
      <ellipse cx="495" cy="260" rx="14" ry="18" fill={ORANGE} opacity="0.5" />
      <ellipse cx="525" cy="265" rx="14" ry="18" fill={ORANGE} opacity="0.4" />
      {/* Basket 4 — Cash/Gold */}
      <path d="M650,240 C650,210 750,210 750,240 L740,310 C740,320 660,320 660,310 Z" fill={CARD_BG} stroke={RED} strokeWidth="1.5" />
      <ellipse cx="700" cy="240" rx="50" ry="15" fill={CARD_BG} stroke={RED} strokeWidth="1.5" />
      <ellipse cx="700" cy="260" rx="14" ry="18" fill={RED} opacity="0.4" />
      {/* Labels */}
      <rect x="95" y="335" width="70" height="10" rx="3" fill={ACCENT} opacity="0.4" />
      <rect x="285" y="335" width="70" height="10" rx="3" fill={GREEN} opacity="0.4" />
      <rect x="475" y="335" width="70" height="10" rx="3" fill={ORANGE} opacity="0.4" />
      <rect x="665" y="335" width="70" height="10" rx="3" fill={RED} opacity="0.3" />
      {/* Correlation matrix on top */}
      <rect x="250" y="50" width="300" height="130" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <rect x="270" y="68" width="80" height="10" rx="3" fill={BORDER} opacity="0.4" />
      {/* Matrix cells */}
      {[0, 1, 2, 3].map(r => [0, 1, 2, 3].map(c => (
        <rect key={`${r}${c}`} x={275 + c * 65} y={90 + r * 22} width="55" height="16" rx="3" fill={r === c ? ACCENT : c > r ? GREEN : ORANGE} opacity={r === c ? 0.3 : 0.15} />
      )))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* kiedy-sprzedac-akcje                                                */
/* Chart with sell signals and exit points                             */
/* ------------------------------------------------------------------ */
function IllustKiedySprzedac() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Chart */}
      <line x1="80" y1="60" x2="80" y2="350" stroke={BORDER} strokeWidth="1.5" />
      <line x1="80" y1="350" x2="740" y2="350" stroke={BORDER} strokeWidth="1.5" />
      {/* Price line — rise then fall */}
      <polyline points="100,300 160,260 220,230 280,180 340,140 400,110 460,100 520,120 580,160 640,200 700,250" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Area fill */}
      <polygon points="100,300 160,260 220,230 280,180 340,140 400,110 460,100 520,120 580,160 640,200 700,250 700,350 100,350" fill={ACCENT} opacity="0.05" />
      {/* Peak zone */}
      <rect x="420" y="85" width="100" height="50" rx="6" fill={RED} opacity="0.1" stroke={RED} strokeWidth="1" strokeDasharray="4 3" />
      {/* Sell signal 1 — at top */}
      <circle cx="460" cy="100" r="10" fill={RED} opacity="0.2" />
      <circle cx="460" cy="100" r="5" fill={RED} />
      <line x1="460" y1="70" x2="460" y2="55" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      <rect x="435" y="40" width="50" height="16" rx="4" fill={RED} opacity="0.3" />
      {/* Sell signal 2 — trend break */}
      <circle cx="580" cy="160" r="10" fill={ORANGE} opacity="0.2" />
      <circle cx="580" cy="160" r="5" fill={ORANGE} />
      {/* Support line broken */}
      <line x1="280" y1="180" x2="600" y2="180" stroke={GREEN} strokeWidth="2" strokeDasharray="8 4" opacity="0.4" />
      {/* Stop loss line */}
      <line x1="340" y1="220" x2="740" y2="220" stroke={RED} strokeWidth="2" strokeDasharray="6 3" />
      <rect x="700" y="212" width="35" height="16" rx="4" fill={RED} opacity="0.2" />
      {/* Decision checklist */}
      <rect x="580" y="270" width="160" height="80" rx="8" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      {[0, 1, 2].map(i => (
        <g key={i}>
          <rect x="596" y={286 + i * 20} width="10" height="10" rx="2" fill={i < 2 ? RED : BORDER} opacity="0.4" />
          <rect x="614" y={288 + i * 20} width="60" height="6" rx="2" fill={BORDER} opacity="0.3" />
        </g>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* inwestowanie-kontrarianskie                                         */
/* Crowd going one direction, contrarian going opposite                */
/* ------------------------------------------------------------------ */
function IllustKontrarian() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="400" rx="12" fill={DARK_BG} />
      {/* Crowd going right (following trend) */}
      {[
        [150, 200], [200, 195], [250, 190], [300, 205],
        [180, 230], [230, 225], [280, 235], [330, 220],
        [160, 260], [210, 255], [260, 265], [310, 250],
      ].map(([x, y], i) => (
        <g key={`c${i}`}>
          <circle cx={x} cy={y} r="12" fill={ACCENT} opacity="0.25" />
          <rect x={x - 6} y={y + 14} width="12" height="18" rx="4" fill={ACCENT} opacity="0.15" />
        </g>
      ))}
      {/* Crowd arrows right */}
      {[195, 225, 255].map(y => (
        <g key={y}>
          <line x1="350" y1={y} x2="400" y2={y} stroke={ACCENT} strokeWidth="2" opacity="0.3" />
          <polygon points={`405,${y} 395,${y - 5} 395,${y + 5}`} fill={ACCENT} opacity="0.3" />
        </g>
      ))}
      {/* Contrarian person going LEFT */}
      <circle cx="550" cy="225" r="20" fill={GREEN} opacity="0.7" />
      <rect x="540" y="248" width="20" height="30" rx="6" fill={GREEN} opacity="0.5" />
      {/* Contrarian arrow left */}
      <line x1="520" y1="225" x2="470" y2="225" stroke={GREEN} strokeWidth="4" strokeLinecap="round" />
      <polygon points="465,225 480,215 480,235" fill={GREEN} />
      {/* Dividing line */}
      <line x1="430" y1="140" x2="430" y2="310" stroke={BORDER} strokeWidth="1" strokeDasharray="6 4" />
      {/* Fear & Greed gauge on top */}
      <rect x="250" y="40" width="300" height="80" rx="10" fill={CARD_BG} stroke={BORDER} strokeWidth="1.5" />
      <path d="M350,95 A50,50 0 0,1 450,95" fill="none" stroke={BORDER} strokeWidth="6" strokeLinecap="round" />
      <path d="M350,95 A50,50 0 0,1 380,55" fill="none" stroke={RED} strokeWidth="6" strokeLinecap="round" />
      <path d="M380,55 A50,50 0 0,1 420,55" fill="none" stroke={ORANGE} strokeWidth="6" strokeLinecap="round" />
      <path d="M420,55 A50,50 0 0,1 450,95" fill="none" stroke={GREEN} strokeWidth="6" strokeLinecap="round" />
      {/* Needle pointing to fear (left) */}
      <line x1="400" y1="95" x2="365" y2="65" stroke={RED} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="400" cy="95" r="4" fill={ACCENT} />
      {/* Chart in background - bottom falling */}
      <polyline points="580,300 620,310 660,330 700,340 740,350" fill="none" stroke={RED} strokeWidth="2" opacity="0.3" />
      <polyline points="580,350 620,340 660,330 700,310 740,290" fill="none" stroke={GREEN} strokeWidth="2" strokeDasharray="4 3" opacity="0.4" />
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
  /* New articles */
  "czym-jest-dywidenda": IllustDywidenda,
  "jak-dziala-sesja-gieldowa": IllustSesjaGieldowa,
  "short-selling": IllustShortSelling,
  "newconnect-rynek": IllustNewConnect,
  "kontrakty-terminowe": IllustKontraktyTerminowe,
  "wskaznik-rsi": IllustRSI,
  "wskaznik-macd": IllustMACD,
  "srednie-kroczace-sma-ema": IllustSrednieKroczace,
  "wykres-swiecowy-formacje": IllustWykresSwiecowy,
  "wskaznik-roe": IllustROE,
  "strategia-dca": IllustDCA,
  "value-investing-gpw": IllustValueInvesting,
  "stop-loss-take-profit": IllustStopLoss,
  "momentum-investing": IllustMomentum,
  "inwestowanie-zloto-surowce": IllustZlotoSurowce,
  /* New batch — 15 articles */
  "rynek-catalyst-obligacje": IllustCatalyst,
  "prawa-poboru-emisja-akcji": IllustPrawaPoboru,
  "depozyt-dzwignia-finansowa": IllustDzwignia,
  "ipo-debiuty-gieldowe": IllustIPO,
  "ryzyko-inwestycyjne": IllustRyzyko,
  "wskaznik-eps": IllustEPS,
  "wolumen-obrotu": IllustWolumen,
  "wskaznik-ebitda": IllustEBITDA,
  "formacje-cenowe": IllustFormacjeCenowe,
  "bollinger-bands": IllustBollingerBands,
  "swing-trading": IllustSwingTrading,
  "growth-investing": IllustGrowthInvesting,
  "dywersyfikacja-portfela": IllustDywersyfikacja,
  "kiedy-sprzedac-akcje": IllustKiedySprzedac,
  "inwestowanie-kontrarianskie": IllustKontrarian,
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

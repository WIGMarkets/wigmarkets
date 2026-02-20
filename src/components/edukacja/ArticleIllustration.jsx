import React from "react";

const ACCENT = "#58a6ff";
const GREEN = "#00c896";
const ORANGE = "#f0883e";
const RED = "#ff4d6d";
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

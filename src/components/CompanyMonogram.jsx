// Sector palette — ciemne, stonowane gradienty pasujące do dark theme
// Klucze odpowiadają polskim nazwom sektorów z bazy GPW
export const SECTOR_PALETTE = {
  "Banki":             { from: "#1a2d4a", to: "#243d5e", accent: "#4a90d9" },
  "Energetyka":        { from: "#3d2e1a", to: "#4d3a22", accent: "#d4943a" },
  "Surowce":           { from: "#3a2a1a", to: "#4a3622", accent: "#c47a30" },
  "Handel":            { from: "#1a3329", to: "#224433", accent: "#3aad6e" },
  "Technologia":       { from: "#2a1a3d", to: "#36244d", accent: "#8b5cf6" },
  "Gry":               { from: "#3d1a2a", to: "#4d2236", accent: "#e04070" },
  "Ubezpieczenia":     { from: "#1a2a3d", to: "#22364d", accent: "#5b9bd5" },
  "Farmacja":          { from: "#1a3d2e", to: "#224d3a", accent: "#34d399" },
  "Biotechnologia":    { from: "#1a3d2e", to: "#224d3a", accent: "#34d399" },
  "Medycyna":          { from: "#1a3d2e", to: "#224d3a", accent: "#34d399" },
  "Telekomunikacja":   { from: "#2d1a3d", to: "#3a224d", accent: "#a78bfa" },
  "Budownictwo":       { from: "#33291a", to: "#443522", accent: "#b8860b" },
  "Chemia":            { from: "#1a333d", to: "#22444d", accent: "#3abbd4" },
  "Motoryzacja":       { from: "#2e2e1a", to: "#3d3d22", accent: "#9ca33a" },
  "Nieruchomości":     { from: "#2e1a2e", to: "#3d223d", accent: "#b060b0" },
  "E-commerce":        { from: "#3d1a2a", to: "#4d2236", accent: "#e04070" },
  "Finanse":           { from: "#1a2a3d", to: "#22364d", accent: "#5b9bd5" },
  "Przemysł":          { from: "#252830", to: "#2e3138", accent: "#6b7280" },
  "Spożywczy":         { from: "#2a3318", to: "#364222", accent: "#8aad3a" },
  "FMCG":              { from: "#2a3318", to: "#364222", accent: "#8aad3a" },
  "Transport":         { from: "#1a2d4a", to: "#243d5e", accent: "#4a90d9" },
  "Logistyka":         { from: "#1a2d4a", to: "#243d5e", accent: "#4a90d9" },
  "Media":             { from: "#2d1a3d", to: "#3a224d", accent: "#a78bfa" },
  "Rozrywka":          { from: "#3d1a2a", to: "#4d2236", accent: "#e04070" },
  "Usługi":            { from: "#252830", to: "#2e3138", accent: "#6b7280" },
  "Rolnictwo":         { from: "#1a3329", to: "#224433", accent: "#3aad6e" },
  "Ekologia":          { from: "#1a3329", to: "#224433", accent: "#22c55e" },
  "Restauracje":       { from: "#3d2e1a", to: "#4d3a22", accent: "#d4943a" },
  "Turystyka":         { from: "#1a333d", to: "#22444d", accent: "#3abbd4" },
  "Obronność":         { from: "#252830", to: "#2e3138", accent: "#6b7280" },
  "HR/Benefity":       { from: "#3d2e1a", to: "#4d3a22", accent: "#d4943a" },
  "AGD":               { from: "#252830", to: "#2e3138", accent: "#6b7280" },
  "Meble":             { from: "#33291a", to: "#443522", accent: "#b8860b" },
  // Surowce / towary
  "Metal szlachetny":  { from: "#3a3018", to: "#4a3d22", accent: "#d4b530" },
  "Metal przemysłowy": { from: "#252830", to: "#2e3138", accent: "#9ca33a" },
  "Energia":           { from: "#3d2e1a", to: "#4d3a22", accent: "#d4943a" },
  // Forex
  "PLN":               { from: "#1a2d4a", to: "#243d5e", accent: "#4a90d9" },
  "Główne":            { from: "#1a2d4a", to: "#243d5e", accent: "#4a90d9" },
  "EUR":               { from: "#1a2d4a", to: "#243d5e", accent: "#4a90d9" },
  "GBP":               { from: "#1a2d4a", to: "#243d5e", accent: "#4a90d9" },
  "Krzyżowe":          { from: "#252830", to: "#2e3138", accent: "#6b7280" },
  "Egzotyczne":        { from: "#252830", to: "#2e3138", accent: "#6b7280" },
};

const DEFAULT_PALETTE = { from: "#252830", to: "#2e3138", accent: "#6b7280" };

export function getSectorPalette(sector) {
  return SECTOR_PALETTE[sector] || DEFAULT_PALETTE;
}

/**
 * CompanyMonogram — elegancki, ujednolicony monogram spółki.
 *
 * Props:
 *   ticker  — symbol spółki (maks. 4 litery wyświetlane)
 *   sector  — polska nazwa sektora (np. "Banki", "Technologia")
 *   size    — wymiar kwadratu w px (domyślnie 36)
 */
export default function CompanyMonogram({ ticker, sector = "", size = 36 }) {
  const label = ticker.length <= 3 ? ticker : ticker.slice(0, 4);
  const fs    = label.length <= 3
    ? Math.max(8, Math.round(size * 0.306))   // ~11px przy 36px
    : Math.max(7, Math.round(size * 0.278));  // ~10px przy 36px

  const palette  = getSectorPalette(sector);
  const rx       = Math.round(size * 0.222);       // border-radius ~8px przy 36
  const accentH  = Math.max(2, Math.round(size * 0.056)); // linia ~2px
  const accentY  = size - accentH;
  const accentX  = Math.round(size * 0.12);
  const accentW  = size - accentX * 2;
  const textY    = (size - accentH - 1) / 2;       // lekko nad środkiem

  // ID gradientu — unikalny per ticker+size, bezpieczny dla XML
  const gradId = `cm_${ticker.replace(/[^a-zA-Z0-9]/g, "_")}_${size}`;

  return (
    <div
      style={{
        width: size, height: size, flexShrink: 0,
        borderRadius: rx, overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        transition: "transform 150ms ease",
        cursor: "inherit",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      <svg
        width={size} height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label={ticker}
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={palette.from} />
            <stop offset="100%" stopColor={palette.to}   />
          </linearGradient>
        </defs>

        {/* Tło z gradientem sektorowym */}
        <rect width={size} height={size} fill={`url(#${gradId})`} />

        {/* Ticker */}
        <text
          x={size / 2}
          y={textY}
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(255,255,255,0.9)"
          fontSize={fs}
          fontWeight="700"
          fontFamily="'JetBrains Mono','Fira Code','IBM Plex Mono',monospace"
          letterSpacing="0.04em"
        >
          {label}
        </text>

        {/* Akcentowa linia sektorowa na dole */}
        <rect
          x={accentX} y={accentY}
          width={accentW} height={accentH}
          rx={1}
          fill={palette.accent}
          opacity="0.85"
        />
      </svg>
    </div>
  );
}

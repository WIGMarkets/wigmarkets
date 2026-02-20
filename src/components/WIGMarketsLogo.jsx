/**
 * WIGMarketsLogo — profesjonalne logo SVG.
 * 3 warianty:
 *   "small"   — ikona + "WIG"            (navbar mobile)
 *   "default" — ikona + "WIG markets"     (navbar desktop)
 *   "large"   — ikona + "WIG markets"     (footer, większe)
 */
export default function WIGMarketsLogo({ size = "default", theme = {} }) {
  const cfg = {
    small:   { icon: 18, wigPx: 14, mktPx: 11, gap: 7  },
    default: { icon: 24, wigPx: 17, mktPx: 13, gap: 9  },
    large:   { icon: 32, wigPx: 22, mktPx: 17, gap: 12 },
  }[size] ?? { icon: 24, wigPx: 17, mktPx: 13, gap: 9 };

  const accent      = theme.accent       || "#3b82f6";
  const textBright  = theme.textBright   || "#f1f5f9";
  const textMuted   = theme.textSecondary || "#94a3b8";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: cfg.gap,
      userSelect: "none", flexShrink: 0, cursor: "pointer",
    }}>
      {/* ── Ikona: 3 rosnące słupki ── */}
      <svg
        width={cfg.icon}
        height={cfg.icon}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect x="0"  y="16" width="6" height="8"  rx="1.5" fill={accent} fillOpacity="0.50" />
        <rect x="9"  y="10" width="6" height="14" rx="1.5" fill={accent} fillOpacity="0.75" />
        <rect x="18" y="2"  width="6" height="22" rx="1.5" fill={accent} fillOpacity="1.00" />
      </svg>

      {/* ── Tekst: WIG + markets ── */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 1, lineHeight: 1 }}>
        <span style={{
          fontWeight: 800,
          fontSize: cfg.wigPx,
          color: textBright,
          fontFamily: "var(--font-ui)",
          letterSpacing: "-0.02em",
        }}>WIG</span>

        {size !== "small" && (
          <span style={{
            fontWeight: 400,
            fontSize: cfg.mktPx,
            color: textMuted,
            fontFamily: "var(--font-ui)",
            letterSpacing: "0",
          }}>markets</span>
        )}
      </div>
    </div>
  );
}

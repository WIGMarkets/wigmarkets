import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "../../hooks/useIsMobile.js";

export default function Breadcrumbs({ theme, allInstruments }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Only render on stock detail pages
  if (!location.pathname.startsWith("/spolka/")) return null;

  const ticker = location.pathname.split("/")[2]?.toUpperCase();
  const stock = (allInstruments || []).find(s => s.ticker === ticker);
  const label = stock ? `${stock.ticker} ${stock.name}` : ticker || "Spółka";

  return (
    <nav aria-label="Breadcrumb" style={{ maxWidth: 1400, margin: "0 auto", padding: isMobile ? "10px 12px 0" : "12px 24px 0" }}>
      <ol style={{ display: "flex", flexWrap: "wrap", gap: 6, listStyle: "none", margin: 0, padding: 0, fontSize: 13, color: theme.textMuted }}>
        <li style={{ display: "flex", alignItems: "center" }}>
          <span
            onClick={() => navigate("/")}
            style={{ color: theme.textSecondary, cursor: "pointer", padding: "4px 0", transition: "color 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.color = theme.accent; }}
            onMouseLeave={e => { e.currentTarget.style.color = theme.textSecondary; }}
          >
            Akcje GPW
          </span>
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: theme.textMuted, fontSize: 11 }}>/</span>
          <span style={{ color: theme.textMuted }}>{label}</span>
        </li>
      </ol>
    </nav>
  );
}

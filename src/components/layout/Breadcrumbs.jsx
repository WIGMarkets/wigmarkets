import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useIsMobile } from "../../hooks/useIsMobile.js";

const PAGE_NAMES = {
  "/fear-greed": "Fear & Greed Index",
  "/dywidendy": "Dywidendy",
  "/wiadomosci": "Wiadomości",
  "/portfolio": "Portfolio",
  "/edukacja": "Edukacja",
};

export default function Breadcrumbs({ theme, stockName }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Don't render on home page
  if (location.pathname === "/") return null;

  const items = [{ label: "Strona główna", href: "/" }];

  // Stock detail page
  if (location.pathname.startsWith("/spolka/")) {
    const ticker = location.pathname.split("/")[2]?.toUpperCase();
    items.push({ label: stockName || ticker || "Spółka" });
  }
  // Edukacja subpage
  else if (location.pathname.startsWith("/edukacja/")) {
    items.push({ label: "Edukacja", href: "/edukacja" });
    // The slug page will be handled by its own breadcrumbs
    return null;
  }
  // Known pages
  else if (PAGE_NAMES[location.pathname]) {
    items.push({ label: PAGE_NAMES[location.pathname] });
  }
  // Edukacja home
  else if (location.pathname === "/edukacja") {
    // EdukacjaHome has its own breadcrumbs
    return null;
  }
  else {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" style={{ maxWidth: 1400, margin: "0 auto", padding: isMobile ? "10px 12px 0" : "12px 24px 0" }}>
      <ol style={{ display: "flex", flexWrap: "wrap", gap: 4, listStyle: "none", margin: 0, padding: 0, fontSize: 13, color: theme.textSecondary }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i > 0 && <span style={{ color: theme.textMuted, fontSize: 11 }}>/</span>}
            {item.href ? (
              <span
                onClick={() => navigate(item.href)}
                style={{ color: theme.accent, cursor: "pointer", padding: "4px 0" }}
              >
                {item.label}
              </span>
            ) : (
              <span style={{ color: theme.textSecondary }}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

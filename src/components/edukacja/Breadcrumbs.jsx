import { useIsMobile } from "../../hooks/useIsMobile.js";

export default function Breadcrumbs({ items, theme }) {
  const isMobile = useIsMobile();

  // On mobile with >3 items, collapse middle items
  let displayItems = items;
  if (isMobile && items.length > 3) {
    displayItems = [items[0], { label: "…" }, items[items.length - 1]];
  }

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 20, overflowX: "hidden" }}>
      <ol style={{ display: "flex", flexWrap: "wrap", gap: 4, listStyle: "none", margin: 0, padding: 0, fontSize: 13, color: theme.textSecondary }}>
        {displayItems.map((item, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: 4, minHeight: 44, maxWidth: "100%" }}>
            {i > 0 && <span style={{ color: theme.border }}>/</span>}
            {item.href ? (
              <a
                href={item.href}
                onClick={e => { e.preventDefault(); item.onClick?.(); }}
                style={{ color: theme.accent, textDecoration: "none", padding: "8px 0", minHeight: 44, display: "flex", alignItems: "center" }}
              >
                {item.label}
              </a>
            ) : (
              <span style={{ color: theme.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: isMobile ? 200 : "none" }}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

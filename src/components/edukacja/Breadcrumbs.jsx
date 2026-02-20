export default function Breadcrumbs({ items, theme }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 20 }}>
      <ol style={{ display: "flex", flexWrap: "wrap", gap: 4, listStyle: "none", margin: 0, padding: 0, fontSize: 13, color: theme.textSecondary }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {i > 0 && <span style={{ color: theme.border }}>/</span>}
            {item.href ? (
              <a
                href={item.href}
                onClick={e => { e.preventDefault(); item.onClick?.(); }}
                style={{ color: theme.accent, textDecoration: "none" }}
              >
                {item.label}
              </a>
            ) : (
              <span style={{ color: theme.textSecondary }}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

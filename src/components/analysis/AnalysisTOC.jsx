export default function AnalysisTOC({ sections, theme }) {
  if (!sections?.length) return null;

  return (
    <nav style={{
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      padding: 16,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 600, textTransform: "uppercase",
        letterSpacing: "0.08em", color: theme.textSecondary,
        fontFamily: "var(--font-ui)", marginBottom: 12,
      }}>
        Spis treści
      </div>
      <ol style={{ margin: 0, padding: "0 0 0 18px", listStyleType: "decimal" }}>
        {sections.map((s, i) => (
          <li key={s.id} style={{ marginBottom: i < sections.length - 1 ? 8 : 0 }}>
            <a
              href={`#${s.id}`}
              style={{
                fontSize: 13, color: theme.textSecondary, textDecoration: "none",
                fontFamily: "var(--font-ui)", transition: "color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#3b82f6"}
              onMouseLeave={e => e.currentTarget.style.color = theme.textSecondary}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

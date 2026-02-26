/**
 * Renders a single analysis section with simple Markdown-like formatting:
 * - **bold** text
 * - Tables (| col | col |)
 * - Bullet lists (- item)
 * - Blank lines become paragraph breaks
 */

function parseContent(text, theme) {
  const blocks = text.split("\n\n");
  return blocks.map((block, bi) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Table
    if (trimmed.includes("|") && trimmed.split("\n").length >= 2) {
      const lines = trimmed.split("\n").filter(l => l.trim());
      const isTable = lines.every(l => l.includes("|"));
      if (isTable) {
        const rows = lines
          .filter(l => !/^\|[\s-|]+\|$/.test(l.trim()))
          .map(l => l.split("|").map(c => c.trim()).filter(Boolean));
        if (rows.length >= 2) {
          const [header, ...body] = rows;
          return (
            <div key={bi} style={{ overflowX: "auto", margin: "12px 0" }}>
              <table style={{
                width: "100%", borderCollapse: "collapse", fontSize: 13,
                fontFamily: "var(--font-mono)",
              }}>
                <thead>
                  <tr>
                    {header.map((h, i) => (
                      <th key={i} style={{
                        textAlign: "left", padding: "8px 12px",
                        borderBottom: `2px solid ${theme.border}`,
                        color: theme.textSecondary, fontSize: 11,
                        fontWeight: 600, textTransform: "uppercase",
                        letterSpacing: "0.04em", fontFamily: "var(--font-ui)",
                      }}>{renderInline(h)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{
                          padding: "8px 12px",
                          borderBottom: ri < body.length - 1 ? `1px solid ${theme.border}` : "none",
                          color: theme.textBright, fontVariantNumeric: "tabular-nums",
                        }}>{renderInline(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      }
    }

    // Bullet list
    const listLines = trimmed.split("\n").filter(l => /^[-•]/.test(l.trim()));
    if (listLines.length === trimmed.split("\n").filter(l => l.trim()).length && listLines.length >= 2) {
      return (
        <ul key={bi} style={{
          margin: "8px 0", paddingLeft: 20,
          fontSize: 14, lineHeight: 1.7, color: theme.textSecondary,
          fontFamily: "var(--font-ui)",
        }}>
          {listLines.map((l, li) => (
            <li key={li} style={{ marginBottom: 4 }}>
              {renderInline(l.replace(/^[-•]\s*/, ""))}
            </li>
          ))}
        </ul>
      );
    }

    // Normal paragraph
    return (
      <p key={bi} style={{
        margin: "8px 0", fontSize: 14, lineHeight: 1.7,
        color: theme.textSecondary, fontFamily: "var(--font-ui)",
      }}>
        {renderInline(trimmed.replace(/\n/g, " "))}
      </p>
    );
  });
}

function renderInline(text) {
  // Split on **bold** markers
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ fontWeight: 600, color: "inherit" }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function AnalysisSection({ section, theme }) {
  return (
    <section id={section.id} style={{ scrollMarginTop: 80, marginBottom: 32 }}>
      <h2 style={{
        fontSize: 20, fontWeight: 700, color: theme.textBright,
        fontFamily: "var(--font-ui)", margin: "0 0 12px",
        paddingBottom: 8, borderBottom: `1px solid ${theme.border}`,
      }}>
        {section.title}
      </h2>
      <div>{parseContent(section.content, theme)}</div>
    </section>
  );
}

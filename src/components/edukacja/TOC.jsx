import { useState } from "react";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ą/g, "a").replace(/ć/g, "c").replace(/ę/g, "e")
    .replace(/ł/g, "l").replace(/ń/g, "n").replace(/ó/g, "o")
    .replace(/ś/g, "s").replace(/ź/g, "z").replace(/ż/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildTOC(sections) {
  return sections
    .filter(s => s.type === "heading" && (s.level === 2 || s.level === 3))
    .map(s => ({ id: slugify(s.text), text: s.text, level: s.level }));
}

export default function TOC({ items, theme, isMobile }) {
  const [open, setOpen] = useState(false);

  if (!items || items.length === 0) return null;

  if (isMobile) {
    return (
      <div style={{
        background: theme.bgCardAlt,
        border: `1px solid ${theme.border}`,
        borderRadius: 10,
        marginBottom: 24,
        overflow: "hidden",
      }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "transparent",
            border: "none",
            color: theme.textBright,
            fontFamily: "inherit",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>📋 Spis treści</span>
          <span style={{ fontSize: 12, color: theme.textSecondary }}>{open ? "▲" : "▼"}</span>
        </button>
        {open && (
          <ol style={{ margin: 0, padding: "0 16px 16px 32px", display: "flex", flexDirection: "column", gap: 6 }}>
            {items.map(item => (
              <li key={item.id} style={{ paddingLeft: item.level === 3 ? 12 : 0 }}>
                <a
                  href={`#${item.id}`}
                  style={{ color: theme.accent, textDecoration: "none", fontSize: item.level === 3 ? 12 : 13 }}
                  onClick={() => setOpen(false)}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ol>
        )}
      </div>
    );
  }

  return (
    <div style={{
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      padding: 20,
      position: "sticky",
      top: 20,
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
        Spis treści
      </div>
      <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map(item => (
          <li key={item.id} style={{ paddingLeft: item.level === 3 ? 12 : 0 }}>
            <a
              href={`#${item.id}`}
              style={{
                color: theme.textSecondary,
                textDecoration: "none",
                fontSize: item.level === 3 ? 12 : 13,
                lineHeight: 1.5,
                display: "block",
                padding: "3px 0",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => e.target.style.color = theme.accent}
              onMouseLeave={e => e.target.style.color = theme.textSecondary}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export { slugify };

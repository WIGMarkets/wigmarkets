import { useState } from "react";

export default function FAQSection({ items, theme }) {
  const [open, setOpen] = useState(null);

  if (!items || items.length === 0) return null;

  return (
    <section style={{ marginTop: 48 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: theme.textBright, marginBottom: 20 }}>
        Często zadawane pytania
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              background: theme.bgCard,
              border: `1px solid ${open === i ? theme.accent + "60" : theme.border}`,
              borderRadius: 10,
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "transparent",
                border: "none",
                color: theme.textBright,
                fontFamily: "inherit",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                textAlign: "left",
                minHeight: 48,
              }}
            >
              <span>{item.question}</span>
              <span style={{ fontSize: 18, color: theme.textSecondary, flexShrink: 0, transition: "transform 0.2s", transform: open === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
            </button>
            {open === i && (
              <div style={{ padding: "0 20px 18px", fontSize: 15, color: theme.text, lineHeight: 1.7 }}>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

import ComparisonTable from "./interactive/ComparisonTable.jsx";
import Calculator from "./interactive/Calculator.jsx";
import QuizBlock from "./interactive/QuizBlock.jsx";
import DividendRanking from "./interactive/DividendRanking.jsx";
import StockTableWidget from "./interactive/StockTableWidget.jsx";
import ScreenerPreview from "./interactive/ScreenerPreview.jsx";
import { slugify } from "./TOC.jsx";

const BLOCK_STYLES = {
  tip: { borderColor: "#00c896", bg: "#00c89612", icon: "💡" },
  warning: { borderColor: "#f0883e", bg: "#f0883e12", icon: "⚠️" },
  info: { borderColor: "#58a6ff", bg: "#58a6ff12", icon: "ℹ️" },
};

const INTERACTIVE_COMPONENTS = {
  ComparisonTable,
  Calculator,
  QuizBlock,
  DividendRanking,
  StockTableWidget,
  ScreenerPreview,
};

export default function SectionRenderer({ sections, theme, onNavigate }) {
  if (!sections) return null;

  const bodyStyle = {
    fontSize: 16,
    lineHeight: 1.75,
    color: theme.text,
  };

  return (
    <div style={bodyStyle}>
      {sections.map((section, i) => {
        switch (section.type) {
          case "heading": {
            const id = slugify(section.text);
            if (section.level === 2) {
              return (
                <h2
                  key={i}
                  id={id}
                  style={{ fontSize: 22, fontWeight: 800, color: theme.textBright, marginTop: 40, marginBottom: 16, lineHeight: 1.3, scrollMarginTop: 20 }}
                >
                  {section.text}
                </h2>
              );
            }
            return (
              <h3
                key={i}
                id={id}
                style={{ fontSize: 18, fontWeight: 700, color: theme.textBright, marginTop: 28, marginBottom: 12, lineHeight: 1.4, scrollMarginTop: 20 }}
              >
                {section.text}
              </h3>
            );
          }

          case "paragraph":
            return (
              <p key={i} style={{ margin: "0 0 18px", fontSize: 16, lineHeight: 1.75, color: theme.text }}>
                {section.text}
              </p>
            );

          case "list": {
            const Tag = section.ordered ? "ol" : "ul";
            return (
              <Tag key={i} style={{ margin: "0 0 18px", paddingLeft: 24, display: "flex", flexDirection: "column", gap: 6 }}>
                {(section.items || []).map((item, j) => (
                  <li key={j} style={{ fontSize: 16, lineHeight: 1.65, color: theme.text }}>{item}</li>
                ))}
              </Tag>
            );
          }

          case "tip":
          case "warning":
          case "info": {
            const style = BLOCK_STYLES[section.type];
            return (
              <div
                key={i}
                style={{
                  background: style.bg,
                  borderLeft: `4px solid ${style.borderColor}`,
                  borderRadius: "0 10px 10px 0",
                  padding: "14px 18px",
                  margin: "20px 0",
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: theme.text,
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <span style={{ flexShrink: 0, fontSize: 18 }}>{style.icon}</span>
                <span>{section.text}</span>
              </div>
            );
          }

          case "code":
            return (
              <pre
                key={i}
                style={{
                  background: theme.bgCardAlt,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 10,
                  padding: "16px 20px",
                  margin: "20px 0",
                  overflowX: "auto",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "#00c896",
                  fontFamily: "monospace",
                }}
              >
                <code>{section.text}</code>
              </pre>
            );

          case "image":
            return (
              <figure key={i} style={{ margin: "24px 0" }}>
                <img
                  src={section.src}
                  alt={section.alt || ""}
                  loading="lazy"
                  style={{ width: "100%", borderRadius: 10, border: `1px solid ${theme.border}` }}
                />
                {section.caption && (
                  <figcaption style={{ fontSize: 13, color: theme.textSecondary, marginTop: 8, textAlign: "center" }}>
                    {section.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "interactive": {
            const Component = INTERACTIVE_COMPONENTS[section.component];
            if (!Component) return null;
            return <Component key={i} theme={theme} onNavigate={onNavigate} {...(section.props || {})} />;
          }

          default:
            return null;
        }
      })}
    </div>
  );
}

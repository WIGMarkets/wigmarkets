import { useIsMobile } from "../../hooks/useIsMobile.js";
import ComparisonTable from "./interactive/ComparisonTable.jsx";
import Calculator from "./interactive/Calculator.jsx";
import QuizBlock from "./interactive/QuizBlock.jsx";
import DividendRanking from "./interactive/DividendRanking.jsx";
import StockTableWidget from "./interactive/StockTableWidget.jsx";
import ScreenerPreview from "./interactive/ScreenerPreview.jsx";
import { slugify } from "./TOC.jsx";

function TipIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <circle cx="10" cy="8" r="5" stroke="#22c55e" strokeWidth="1.5" fill="none" />
      <line x1="10" y1="13" x2="10" y2="16" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="15" x2="12" y2="15" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8.5" y1="17" x2="11.5" y2="17" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="6" r="1" fill="#22c55e" />
      <line x1="10" y1="6" x2="10" y2="4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M10 2L1 18h18L10 2z" stroke="#f0883e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <line x1="10" y1="8" x2="10" y2="13" stroke="#f0883e" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="15.5" r="0.8" fill="#f0883e" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <circle cx="10" cy="10" r="8" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
      <line x1="10" y1="9" x2="10" y2="14" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="6.5" r="0.8" fill="#3b82f6" />
    </svg>
  );
}

const BLOCK_ICONS = {
  tip: TipIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

const BLOCK_STYLES = {
  tip: { borderColor: "#22c55e", bg: "#22c55e12" },
  warning: { borderColor: "#f0883e", bg: "#f0883e12" },
  info: { borderColor: "#3b82f6", bg: "#3b82f612" },
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
  const isMobile = useIsMobile();

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
                  style={{ fontSize: isMobile ? 20 : 22, fontWeight: 800, color: theme.textBright, marginTop: 40, marginBottom: 16, lineHeight: 1.3, scrollMarginTop: 20, wordBreak: "break-word" }}
                >
                  {section.text}
                </h2>
              );
            }
            return (
              <h3
                key={i}
                id={id}
                style={{ fontSize: isMobile ? 17 : 18, fontWeight: 700, color: theme.textBright, marginTop: 28, marginBottom: 12, lineHeight: 1.4, scrollMarginTop: 20, wordBreak: "break-word" }}
              >
                {section.text}
              </h3>
            );
          }

          case "paragraph":
            return (
              <p key={i} style={{ margin: "0 0 18px", fontSize: 16, lineHeight: 1.75, color: theme.text, wordBreak: "break-word", overflowWrap: "break-word" }}>
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
            const IconComponent = BLOCK_ICONS[section.type];
            return (
              <div
                key={i}
                style={{
                  background: style.bg,
                  borderLeft: `4px solid ${style.borderColor}`,
                  borderRadius: "0 10px 10px 0",
                  padding: isMobile ? "12px 14px" : "14px 18px",
                  margin: "20px 0",
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: theme.text,
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <IconComponent />
                <span style={{ minWidth: 0 }}>{section.text}</span>
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
                  padding: isMobile ? "12px 14px" : "16px 20px",
                  margin: "20px 0",
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "#22c55e",
                  fontFamily: "monospace",
                }}
              >
                <code>{section.text}</code>
              </pre>
            );

          case "image":
            return (
              <figure key={i} style={{ margin: "24px 0", overflowX: "hidden" }}>
                <img
                  src={section.src}
                  alt={section.alt || ""}
                  loading="lazy"
                  style={{ width: "100%", height: "auto", borderRadius: 10, border: `1px solid ${theme.border}`, display: "block" }}
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
            return (
              <div key={i} style={{ overflowX: "hidden", margin: "0 -1px" }}>
                <Component theme={theme} onNavigate={onNavigate} {...(section.props || {})} />
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}

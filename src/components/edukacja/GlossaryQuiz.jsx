import { useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import Icon from "./Icon.jsx";

export default function GlossaryQuiz({ quiz, theme }) {
  if (!quiz) return null;

  const isMobile = useIsMobile();
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;

  return (
    <div style={{
      background: theme.bgElevated,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      padding: isMobile ? 16 : 20,
      marginBottom: 32,
    }}>
      {/* Header */}
      <div style={{
        fontSize: 11, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.1em", color: theme.accent,
        marginBottom: 14, fontFamily: "var(--font-ui)",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <Icon name="brain" size={14} />
        Sprawdź się
      </div>

      {/* Question */}
      <div style={{
        fontSize: 15, fontWeight: 600, color: theme.textBright,
        lineHeight: 1.6, marginBottom: 16, fontFamily: "var(--font-ui)",
      }}>
        {quiz.question}
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: answered ? 16 : 0 }}>
        {quiz.options.map((option, i) => {
          const isCorrect = i === quiz.correct;
          const isSelected = i === selected;

          let bg = theme.bgCard;
          let border = theme.border;
          let textColor = theme.textSecondary;
          let icon = null;

          if (answered) {
            if (isCorrect) {
              bg = "#10b98118";
              border = "#10b98150";
              textColor = "#10b981";
              icon = <Icon name="check-circle" size={16} color="#10b981" />;
            } else if (isSelected && !isCorrect) {
              bg = "#ef444418";
              border = "#ef444450";
              textColor = "#ef4444";
              icon = <Icon name="x" size={16} color="#ef4444" />;
            } else {
              textColor = theme.textMuted;
            }
          }

          return (
            <button
              key={i}
              onClick={() => { if (!answered) setSelected(i); }}
              disabled={answered}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", textAlign: "left",
                padding: "12px 16px", borderRadius: 10,
                background: bg,
                border: `1px solid ${border}`,
                color: textColor,
                fontSize: 14, fontWeight: 500,
                fontFamily: "var(--font-ui)",
                cursor: answered ? "default" : "pointer",
                transition: "all 0.15s",
                outline: "none",
                opacity: answered && !isCorrect && !isSelected ? 0.5 : 1,
              }}
              onMouseEnter={e => {
                if (!answered) {
                  e.currentTarget.style.borderColor = theme.accent + "60";
                  e.currentTarget.style.background = theme.bgHover;
                }
              }}
              onMouseLeave={e => {
                if (!answered) {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.background = theme.bgCard;
                }
              }}
            >
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                fontSize: 12, fontWeight: 700,
                background: answered && isCorrect ? "#10b98125" : answered && isSelected ? "#ef444425" : `${theme.accent}15`,
                color: answered && isCorrect ? "#10b981" : answered && isSelected ? "#ef4444" : theme.accent,
                fontFamily: "var(--font-mono)",
              }}>
                {String.fromCharCode(65 + i)}
              </span>
              <span style={{ flex: 1 }}>{option}</span>
              {icon}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && quiz.explanation && (
        <div style={{
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderRadius: 10,
          padding: "14px 16px",
        }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: theme.textMuted,
            marginBottom: 6, fontFamily: "var(--font-ui)",
          }}>
            Wyjaśnienie
          </div>
          <div style={{
            fontSize: 14, lineHeight: 1.6, color: theme.textSecondary,
          }}>
            {quiz.explanation}
          </div>
        </div>
      )}
    </div>
  );
}

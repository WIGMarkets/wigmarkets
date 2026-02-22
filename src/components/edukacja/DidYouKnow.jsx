import { useIsMobile } from "../../hooks/useIsMobile.js";
import Icon from "./Icon.jsx";

export default function DidYouKnow({ text, theme }) {
  if (!text) return null;

  const isMobile = useIsMobile();

  return (
    <div style={{
      borderLeft: `3px solid ${theme.accent}`,
      background: `${theme.accent}0D`,
      borderRadius: "0 10px 10px 0",
      padding: isMobile ? "16px 16px" : "18px 24px",
      marginBottom: 32,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.1em", color: theme.accent,
        marginBottom: 10, fontFamily: "var(--font-ui)",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <Icon name="star" size={14} />
        Czy wiesz, że...
      </div>
      <div style={{
        fontSize: 15, lineHeight: 1.7, color: theme.textSecondary,
      }}>
        {text}
      </div>
    </div>
  );
}

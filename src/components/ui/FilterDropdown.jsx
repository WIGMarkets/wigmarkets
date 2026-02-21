import { useState, useRef, useEffect } from "react";
import Icon from "../edukacja/Icon.jsx";

export default function FilterDropdown({ options, value, onChange, theme, minWidth = 180 }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const selected = options.find(o => o.id === value);
  const selectedLabel = selected?.label || options[0]?.label || "";

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          width: "100%",
          padding: "8px 12px",
          borderRadius: 8,
          border: `1px solid ${isOpen ? theme.accent : theme.borderInput}`,
          background: theme.bgCard,
          color: value !== "all" ? theme.textBright : theme.text,
          fontSize: 12,
          cursor: "pointer",
          fontFamily: "inherit",
          outline: "none",
          transition: "border-color 0.15s",
          textAlign: "left",
          lineHeight: 1.4,
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selectedLabel}
        </span>
        <span style={{
          flexShrink: 0,
          transition: "transform 0.15s",
          transform: isOpen ? "rotate(180deg)" : "none",
          opacity: 0.5,
          display: "inline-flex",
        }}>
          <Icon name="chevron-down" size={14} />
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            minWidth: Math.max(minWidth, ref.current?.offsetWidth || 0),
            maxHeight: 320,
            overflowY: "auto",
            borderRadius: 10,
            border: `1px solid ${theme.borderInput}`,
            background: theme.bgCardAlt,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            zIndex: 50,
            padding: 4,
          }}
        >
          {options.map(option => {
            const isActive = option.id === value;
            return (
              <button
                key={option.id}
                onClick={() => { onChange(option.id); setIsOpen(false); }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = theme.bgElevated; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "none",
                  background: isActive ? `${theme.accent}12` : "transparent",
                  color: isActive ? theme.textBright : theme.textSecondary,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  transition: "background 0.1s",
                  lineHeight: 1.4,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {isActive ? (
                    <span style={{ flexShrink: 0, color: theme.accent, display: "inline-flex" }}><Icon name="check" size={14} /></span>
                  ) : (
                    <span style={{ width: 14, flexShrink: 0 }} />
                  )}
                  <span>{option.label}</span>
                </span>
                {option.count != null && (
                  <span style={{ fontSize: 11, color: theme.textMuted, marginLeft: 8, flexShrink: 0 }}>
                    {option.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

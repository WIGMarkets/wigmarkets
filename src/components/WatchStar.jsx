import { memo } from "react";

export default memo(function WatchStar({ active, onClick, theme }) {
  return (
    <span
      onClick={onClick ? (e => { e.stopPropagation(); onClick(); }) : undefined}
      style={{ cursor: onClick ? "pointer" : "default", lineHeight: 1, display: "inline-flex", alignItems: "center", transition: "opacity 0.15s, transform 0.15s", userSelect: "none", opacity: active ? 1 : 0.3 }}
      title={active ? "Usuń z obserwowanych" : "Dodaj do obserwowanych"}
      onMouseEnter={e => { if (!active) e.currentTarget.style.opacity = "0.6"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.opacity = "0.3"; }}
    >
      <svg
        width={14}
        height={14}
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: active ? "#eab308" : (theme?.textMuted || "#64748b"), flexShrink: 0, transition: "color 0.2s" }}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </span>
  );
})

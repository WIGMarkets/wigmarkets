export default function WatchStar({ active, onClick, theme }) {
  return (
    <span
      onClick={e => { e.stopPropagation(); onClick(); }}
      style={{ cursor: "pointer", fontSize: 14, lineHeight: 1, color: active ? "#ffd700" : theme.borderInput, transition: "color 0.15s", userSelect: "none" }}
      title={active ? "Usuń z obserwowanych" : "Dodaj do obserwowanych"}
    >
      {active ? "●" : "○"}
    </span>
  );
}

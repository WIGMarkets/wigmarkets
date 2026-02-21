/**
 * Pagination with ellipsis — shows first, last, and ~5 pages around current.
 *
 * Examples (current=9, total=15):  1 ... 7 8 9 10 11 ... 15
 *          (current=14, total=15): 1 ... 12 13 14 15
 *          (current=2, total=15):  1 2 3 4 ... 15
 */
function getPageNumbers(current, total, siblings = 2) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total]);
  for (let i = Math.max(1, current - siblings); i <= Math.min(total, current + siblings); i++) {
    pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) result.push("...");
    result.push(p);
    prev = p;
  }
  return result;
}

export default function Pagination({ page, totalPages, onPageChange, theme }) {
  if (totalPages <= 1) return null;

  const items = getPageNumbers(page, totalPages);

  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
      {items.map((item, idx) =>
        item === "..." ? (
          <span key={`dots-${idx}`} style={{ width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: theme.textMuted, fontFamily: "var(--font-mono)", userSelect: "none" }}>...</span>
        ) : (
          <button key={item} onClick={() => onPageChange(item)} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid", borderColor: item === page ? theme.accent : theme.borderInput, background: item === page ? `${theme.accent}18` : "transparent", color: item === page ? theme.accent : theme.textMuted, fontSize: 11, cursor: "pointer", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", transition: "all 0.15s" }}>{item}</button>
        )
      )}
    </div>
  );
}

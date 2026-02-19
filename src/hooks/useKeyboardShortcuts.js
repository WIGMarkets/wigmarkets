import { useEffect } from "react";

/**
 * Global keyboard shortcuts:
 *  /         → focus search input
 *  Esc       → close modal / clear search
 *  j / k     → navigate rows down / up
 *  ?         → toggle shortcuts help
 */
export function useKeyboardShortcuts({ onSlash, onEsc, onDown, onUp, onHelp, enabled = true }) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      if (e.key === "Escape") { onEsc?.(); return; }
      if (isInput) return; // don't hijack typing
      if (e.key === "/" || e.key === "f") { e.preventDefault(); onSlash?.(); return; }
      if (e.key === "j" || e.key === "ArrowDown") { e.preventDefault(); onDown?.(); return; }
      if (e.key === "k" || e.key === "ArrowUp")   { e.preventDefault(); onUp?.(); return; }
      if (e.key === "?") { onHelp?.(); return; }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled, onSlash, onEsc, onDown, onUp, onHelp]);
}

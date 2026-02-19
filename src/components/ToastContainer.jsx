import { useState, useEffect, useCallback } from "react";

let _addToast = null;

export function toast(msg, type = "info") {
  _addToast?.({ id: Date.now() + Math.random(), msg, type });
}

export default function ToastContainer({ theme }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((t) => {
    setToasts(prev => [...prev.slice(-4), t]); // max 5
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 4500);
  }, []);

  useEffect(() => { _addToast = add; return () => { _addToast = null; }; }, [add]);

  if (!toasts.length) return null;

  const colors = {
    info:    { bg: "#1f6feb22", border: "#1f6feb", text: "#58a6ff" },
    success: { bg: "#00c89622", border: "#00c896", text: "#00c896" },
    warning: { bg: "#ffd70022", border: "#ffd700", text: "#ffd700" },
    error:   { bg: "#ff4d6d22", border: "#ff4d6d", text: "#ff4d6d" },
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9000, display: "flex", flexDirection: "column", gap: 10, maxWidth: 340 }}>
      {toasts.map(t => {
        const c = colors[t.type] || colors.info;
        return (
          <div key={t.id} style={{
            background: theme.bgCard,
            border: `1px solid ${c.border}`,
            borderLeft: `4px solid ${c.border}`,
            borderRadius: 10,
            padding: "12px 16px",
            fontSize: 13,
            color: theme.text,
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            animation: "toast-in 0.25s ease",
          }}>
            <span style={{ color: c.text, fontWeight: 700, marginRight: 6 }}>
              {t.type === "success" ? "✓" : t.type === "warning" ? "⚠" : t.type === "error" ? "✕" : "ℹ"}
            </span>
            {t.msg}
          </div>
        );
      })}
    </div>
  );
}

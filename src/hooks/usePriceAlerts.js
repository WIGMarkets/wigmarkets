import { useEffect, useRef } from "react";

const LS_KEY = "price_alerts_v1";

export function loadAlerts() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}
export function saveAlerts(alerts) {
  localStorage.setItem(LS_KEY, JSON.stringify(alerts));
}

/**
 * Runs on every prices update.
 * For each alert: if condition met → fire browser notification, mark as triggered.
 */
export function usePriceAlerts(prices, setAlerts) {
  const firedRef = useRef(new Set()); // already fired this session

  useEffect(() => {
    const alerts = loadAlerts();
    let changed = false;
    alerts.forEach(alert => {
      if (alert.triggered) return;
      const price = prices[alert.ticker];
      if (price == null) return;
      const hit = alert.condition === "above" ? price >= alert.target : price <= alert.target;
      if (!hit || firedRef.current.has(alert.id)) return;
      firedRef.current.add(alert.id);
      alert.triggered = true;
      changed = true;

      // Browser notification
      const msg = `${alert.ticker} ${alert.condition === "above" ? "≥" : "≤"} ${alert.target} · bieżący kurs: ${price.toFixed(2)}`;
      if (Notification.permission === "granted") {
        new Notification(`WIGmarkets — Alert cenowy`, { body: msg, icon: "/icon.svg" });
      } else {
        // fallback: document title flash
        const orig = document.title;
        document.title = `🔔 ${msg}`;
        setTimeout(() => { document.title = orig; }, 5000);
      }
    });
    if (changed) { saveAlerts(alerts); setAlerts([...alerts]); }
  }, [prices]);
}

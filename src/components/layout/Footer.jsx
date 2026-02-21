import WIGMarketsLogo from "../WIGMarketsLogo.jsx";

export default function Footer({ theme }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "48px 24px 20px", borderTop: `1px solid ${theme.border}` }}>
      <WIGMarketsLogo size="large" theme={theme} />
      <div style={{ fontSize: 10, color: theme.textSecondary, textAlign: "center" }}>
        &copy; 2026 &middot; Dane z GPW via Yahoo Finance &middot; Nie stanowi&#261; rekomendacji inwestycyjnej
      </div>
    </div>
  );
}

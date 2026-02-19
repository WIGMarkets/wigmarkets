/** Pulse skeleton row shown while prices are loading */
export default function SkeletonRow({ theme, isMobile, tab }) {
  const pulse = {
    background: `linear-gradient(90deg, ${theme.bgCardAlt} 25%, ${theme.border} 50%, ${theme.bgCardAlt} 75%)`,
    backgroundSize: "200% 100%",
    animation: "skeleton-pulse 1.4s ease infinite",
    borderRadius: 4,
    display: "inline-block",
  };
  return (
    <tr style={{ borderBottom: `1px solid ${theme.bgCardAlt}` }}>
      <td style={{ padding: isMobile ? "10px 4px" : "10px 8px" }} />
      {!isMobile && <td style={{ padding: "10px 16px" }}><span style={{ ...pulse, width: 20, height: 12 }} /></td>}
      <td style={{ padding: isMobile ? "10px 10px" : "10px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ ...pulse, width: 28, height: 28, borderRadius: 6 }} />
          <div>
            <span style={{ ...pulse, width: 48, height: 12, display: "block", marginBottom: 4 }} />
            {!isMobile && <span style={{ ...pulse, width: 90, height: 9, display: "block" }} />}
          </div>
        </div>
      </td>
      <td style={{ padding: isMobile ? "10px 8px" : "10px 16px", textAlign: "right" }}><span style={{ ...pulse, width: 58, height: 13 }} /></td>
      <td style={{ padding: isMobile ? "10px 8px" : "10px 16px", textAlign: "right" }}><span style={{ ...pulse, width: 52, height: 20, borderRadius: 5 }} /></td>
      {!isMobile && <td style={{ padding: "10px 16px", textAlign: "right" }}><span style={{ ...pulse, width: 44, height: 12 }} /></td>}
      {!isMobile && (tab === "akcje" || tab === "screener") && <td style={{ padding: "10px 16px", textAlign: "right" }}><span style={{ ...pulse, width: 40, height: 12 }} /></td>}
      {!isMobile && tab !== "screener" && <td style={{ padding: "10px 16px", textAlign: "right" }}><span style={{ ...pulse, width: 36, height: 12 }} /></td>}
      {!isMobile && <td style={{ padding: "10px 16px" }}><span style={{ ...pulse, width: 60, height: 24, borderRadius: 4 }} /></td>}
      {!isMobile && <td style={{ padding: "10px 16px" }}><span style={{ ...pulse, width: 52, height: 26, borderRadius: 6 }} /></td>}
    </tr>
  );
}

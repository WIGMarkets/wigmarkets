import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import WIGMarketsLogo from "../WIGMarketsLogo.jsx";
import DesktopNavMenu from "../DesktopNavMenu.jsx";
import MobileDrawer from "../MobileDrawer.jsx";
import AlertsModal from "../AlertsModal.jsx";
import Icon from "../edukacja/Icon.jsx";

export default function Navbar({ theme, darkMode, setDarkMode, watchlist, alerts, setAlerts, tab, setTab, setViewMode, prices, allInstruments }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  const isHome = location.pathname === "/";

  // When on a subpage, clicking a tab item navigates home and sets tab
  const handleSetTab = useCallback((t) => {
    if (setTab) setTab(t);
    if (!isHome) navigate("/");
  }, [setTab, isHome, navigate]);

  const handleSetViewMode = useCallback((m) => {
    if (setViewMode) setViewMode(m);
    if (!isHome) navigate("/");
  }, [setViewMode, isHome, navigate]);

  return (
    <>
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: `${theme.bgCard}ee`,
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${theme.border}`,
        padding: "0 16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", minHeight: 58, maxWidth: 1400, margin: "0 auto" }}>
          {/* Mobile: hamburger */}
          {isMobile && (
            <button onClick={() => setDrawerOpen(true)} style={{ background: "transparent", border: "none", color: theme.textBright, cursor: "pointer", padding: "6px 8px 6px 0", lineHeight: 1, fontFamily: "inherit", display: "inline-flex", alignItems: "center" }}>
              <Icon name="menu" size={22} />
            </button>
          )}
          <div onClick={() => navigate("/")} style={{ display: "flex", flexDirection: "column", cursor: "pointer" }}>
            <WIGMarketsLogo size={isMobile ? "small" : "default"} theme={theme} />
            {!isMobile && <span style={{ fontSize: 10, color: theme.textMuted, fontFamily: "var(--font-ui)", marginTop: -2, letterSpacing: "0.02em" }}>Notowania GPW w czasie rzeczywistym</span>}
          </div>

          {/* Desktop: mega menu nav */}
          {!isMobile && (
            <DesktopNavMenu
              theme={theme} darkMode={darkMode} setDarkMode={setDarkMode}
              tab={isHome ? tab : null} setTab={handleSetTab}
              navigate={navigate} watchlistSize={watchlist?.size ?? 0}
              showAlerts={showAlerts} setShowAlerts={setShowAlerts} alerts={alerts || []}
              setViewMode={handleSetViewMode}
            />
          )}

          {/* Mobile: right-side controls */}
          {isMobile && (
            <div style={{ marginLeft: "auto", display: "flex", gap: 6, flexShrink: 0 }}>
              <button onClick={() => setShowAlerts(s => !s)} title="Alerty cenowe" style={{ position: "relative", background: theme.bgCardAlt, border: `1px solid ${theme.border}`, borderRadius: 6, color: theme.textSecondary, padding: "6px 10px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center" }}>
                <Icon name="bell" size={16} />{(alerts || []).some(a => a.triggered) && <span style={{ position: "absolute", top: 3, right: 3, width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "block" }} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobile && (
        <MobileDrawer
          open={drawerOpen} onClose={() => setDrawerOpen(false)}
          theme={theme} darkMode={darkMode} setDarkMode={setDarkMode}
          tab={isHome ? tab : null} setTab={handleSetTab}
          navigate={navigate} watchlistSize={watchlist?.size ?? 0}
          setViewMode={handleSetViewMode}
        />
      )}

      {/* Alerts modal */}
      {showAlerts && (
        <AlertsModal
          onClose={() => setShowAlerts(false)}
          theme={theme} prices={prices || {}}
          allInstruments={allInstruments || []}
          alerts={alerts || []} setAlerts={setAlerts}
        />
      )}
    </>
  );
}

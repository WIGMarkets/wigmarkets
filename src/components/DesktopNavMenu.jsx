import { useState, useRef, useCallback, useEffect } from "react";
import Icon from "./edukacja/Icon.jsx";

const POPULAR_ARTICLES = [
  { title: "Jak zacząć inwestować na GPW?", slug: "jak-zaczac-inwestowac-na-gpw" },
  { title: "Najlepsze konto maklerskie 2026", slug: "najlepsze-konto-maklerskie" },
  { title: "IKE vs IKZE — co wybrać?", slug: "ike-vs-ikze" },
];

export default function DesktopNavMenu({ theme, darkMode, setDarkMode, tab, setTab, navigate, watchlistSize, showAlerts, setShowAlerts, alerts, setViewMode }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const closeTimer = useRef(null);

  const handleMouseEnter = useCallback((key) => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdown(key), 80);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 200);
  }, []);

  const handleDropdownEnter = useCallback(() => {
    clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    return () => clearTimeout(closeTimer.current);
  }, []);

  const handleNavClick = useCallback((item) => {
    setOpenDropdown(null);
    if (item.tab) {
      setTab(item.tab);
      navigate("/");
    }
    if (item.href) {
      navigate(item.href);
    }
    if (item.action === "heatmap") {
      setTab("akcje");
      setViewMode("heatmap");
      navigate("/");
    }
  }, [setTab, navigate, setViewMode]);

  const sectionTitle = (text) => (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
      textTransform: "uppercase", color: theme.textMuted,
      marginBottom: 10, fontFamily: "var(--font-ui)",
    }}>{text}</div>
  );

  const dropdownLink = (iconName, label, onClick, isSoon = false, isActive = false) => (
    <div
      onClick={isSoon ? undefined : onClick}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 12px", borderRadius: 8,
        fontSize: 14, color: isSoon ? theme.textMuted : (isActive ? theme.accent : theme.textBright),
        cursor: isSoon ? "default" : "pointer",
        transition: "background 0.15s",
        fontFamily: "var(--font-ui)",
        opacity: isSoon ? 0.5 : 1,
        background: isActive ? `${theme.accent}10` : "transparent",
      }}
      onMouseEnter={e => { if (!isSoon) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = isActive ? `${theme.accent}10` : "transparent"; }}
    >
      <Icon name={iconName} size={18} />
      <span>{label}</span>
      {isSoon && <span style={{ fontSize: 10, background: theme.bgCardAlt, borderRadius: 4, padding: "2px 6px", marginLeft: "auto", color: theme.textMuted }}>Wkrótce</span>}
    </div>
  );

  const dropdown = (key, content) => (
    <div
      onMouseEnter={handleDropdownEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "absolute", top: "100%", left: 0,
        background: theme.bgCard,
        border: `1px solid ${theme.border}`,
        borderTop: `2px solid ${theme.accent}`,
        borderRadius: "0 0 12px 12px",
        padding: "20px 24px",
        minWidth: 400,
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        opacity: openDropdown === key ? 1 : 0,
        transform: openDropdown === key ? "translateY(0)" : "translateY(-8px)",
        transition: "opacity 0.2s ease, transform 0.2s ease",
        pointerEvents: openDropdown === key ? "auto" : "none",
        zIndex: 100,
      }}
    >
      {content}
    </div>
  );

  const isActivePage = (key) => {
    const path = typeof window !== "undefined" ? window.location.pathname : "";
    if (key === "dywidendy") return path === "/dywidendy";
    if (key === "rankingi") return path.startsWith("/rankingi");
    if (key === "wiadomosci") return path === "/wiadomosci";
    if (key === "edukacja") return path.startsWith("/edukacja");
    return false;
  };

  const navButton = (label, key, hasDropdown = true) => {
    const active = !hasDropdown && isActivePage(key);
    return (
      <button
        onClick={() => {
          if (hasDropdown) setOpenDropdown(o => o === key ? null : key);
          else if (key === "dywidendy") navigate("/dywidendy");
          else if (key === "rankingi") navigate("/rankingi");
          else if (key === "wiadomosci") navigate("/wiadomosci");
        }}
        style={{
          background: active ? `${theme.accent}10` : "transparent",
          border: "none",
          borderBottom: active ? `2px solid ${theme.accent}` : "2px solid transparent",
          color: openDropdown === key || active ? theme.accent : theme.textBright,
          fontSize: 14, fontWeight: active ? 600 : 500, cursor: "pointer",
          padding: "8px 14px", borderRadius: "6px 6px 0 0",
          fontFamily: "var(--font-ui)",
          display: "inline-flex", alignItems: "center", gap: 4,
          transition: "color 0.15s, background 0.15s, border-color 0.15s",
        }}
        onMouseEnter={e => { if (!hasDropdown && !active) e.currentTarget.style.background = `${theme.accent}10`; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
      >
        {label}
        {hasDropdown && <Icon name="chevron-down" size={12} style={{ opacity: 0.5 }} />}
      </button>
    );
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, marginLeft: 24 }}>
      {/* Rynki dropdown */}
      <div style={{ position: "relative" }}
        onMouseEnter={() => handleMouseEnter("rynki")}
        onMouseLeave={handleMouseLeave}
      >
        {navButton("Rynki", "rynki")}
        {dropdown("rynki", (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, minWidth: 480 }}>
            <div>
              {sectionTitle("Akcje")}
              {dropdownLink("building", "Akcje GPW", () => handleNavClick({ tab: "akcje" }), false, tab === "akcje")}
              {dropdownLink("flame", "Popularne", () => handleNavClick({ tab: "popularne" }), false, tab === "popularne")}
              {dropdownLink("list", "Indeksy GPW", () => handleNavClick({ tab: "indeksy" }), false, tab === "indeksy")}
            </div>
            <div>
              {sectionTitle("Inne rynki")}
              {dropdownLink("diamond", "Surowce", () => handleNavClick({ tab: "surowce" }), false, tab === "surowce")}
              {dropdownLink("dollar-sign", "Forex", () => handleNavClick({ tab: "forex" }), false, tab === "forex")}
              {dropdownLink("globe", "Indeksy światowe", () => handleNavClick({ tab: "swiatowe" }), false, tab === "swiatowe")}
            </div>
            <div>
              {sectionTitle("Widoki")}
              {dropdownLink("chart-bar", "Tabela", () => { handleNavClick({ tab: "akcje" }); setViewMode("table"); })}
              {dropdownLink("grid", "Heatmapa", () => handleNavClick({ action: "heatmap" }))}
            </div>
          </div>
        ))}
      </div>

      {/* Narzędzia dropdown */}
      <div style={{ position: "relative" }}
        onMouseEnter={() => handleMouseEnter("narzedzia")}
        onMouseLeave={handleMouseLeave}
      >
        {navButton("Narzędzia", "narzedzia")}
        {dropdown("narzedzia", (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, minWidth: 380 }}>
            <div>
              {sectionTitle("Analiza")}
              {dropdownLink("search", "Screener", () => handleNavClick({ tab: "screener" }), false, tab === "screener")}
              {dropdownLink("sliders", "Porównywarka", null, true)}
              {dropdownLink("calculator", "Kalkulator dyw.", () => handleNavClick({ href: "/dywidendy" }))}
            </div>
            <div>
              {sectionTitle("Portfolio")}
              {dropdownLink("briefcase", "Portfolio", () => handleNavClick({ href: "/portfolio" }))}
              {dropdownLink("star", `Obserwowane${watchlistSize > 0 ? ` (${watchlistSize})` : ""}`, () => handleNavClick({ tab: "watchlist" }), false, tab === "watchlist")}
              {dropdownLink("trending-up", "Moje screeny", null, true)}
            </div>
          </div>
        ))}
      </div>

      {/* Direct links */}
      {navButton("Dywidendy", "dywidendy", false)}

      {/* Edukacja dropdown */}
      <div style={{ position: "relative" }}
        onMouseEnter={() => handleMouseEnter("edukacja")}
        onMouseLeave={handleMouseLeave}
      >
        {navButton("Edukacja", "edukacja")}
        {dropdown("edukacja", (
          <div style={{ minWidth: 360 }}>
            <div style={{ marginBottom: 16 }}>
              {dropdownLink("book", "Podstawy inwestowania", () => handleNavClick({ href: "/edukacja/podstawy" }))}
              {dropdownLink("chart-bar", "Analiza fundamentalna i techniczna", () => handleNavClick({ href: "/edukacja/analiza" }))}
              {dropdownLink("target", "Strategie inwestycyjne", () => handleNavClick({ href: "/edukacja/strategia" }))}
              {dropdownLink("book-open", "Słowniczek pojęć", () => handleNavClick({ href: "/edukacja/slowniczek" }))}
              {dropdownLink("file-text", "Wszystkie artykuły", () => handleNavClick({ href: "/edukacja" }))}
            </div>
            <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 14 }}>
              {sectionTitle("Popularne")}
              {POPULAR_ARTICLES.map(a => (
                <div
                  key={a.slug}
                  onClick={() => handleNavClick({ href: `/edukacja/${a.slug}` })}
                  style={{
                    padding: "8px 12px", borderRadius: 6,
                    fontSize: 13, color: theme.textSecondary,
                    cursor: "pointer", transition: "background 0.15s, color 0.15s",
                    fontFamily: "var(--font-ui)",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = theme.textBright; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = theme.textSecondary; }}
                >
                  <Icon name="arrow-right" size={14} style={{ color: theme.accent }} /> {a.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {navButton("Rankingi", "rankingi", false)}
      {navButton("Wiadomości", "wiadomosci", false)}

      {/* Right side controls */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <button
          onClick={() => handleNavClick({ tab: "watchlist" })}
          title="Obserwowane"
          style={{
            position: "relative",
            background: tab === "watchlist" ? `${theme.accent}18` : theme.bgCardAlt,
            border: `1px solid ${tab === "watchlist" ? theme.accent : theme.border}`,
            borderRadius: 6, color: tab === "watchlist" ? theme.accent : theme.textSecondary,
            padding: "6px 10px", fontSize: 13, cursor: "pointer",
            fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4,
          }}
        >
          <Icon name="star" size={14} />
          {watchlistSize > 0 && (
            <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "var(--font-mono)" }}>{watchlistSize}</span>
          )}
        </button>
        <button
          onClick={() => setShowAlerts(s => !s)}
          title="Alerty cenowe"
          style={{
            position: "relative",
            background: theme.bgCardAlt,
            border: `1px solid ${theme.border}`,
            borderRadius: 6, color: theme.textSecondary,
            padding: "6px 10px", fontSize: 13, cursor: "pointer",
            fontFamily: "inherit", display: "inline-flex", alignItems: "center",
          }}
        >
          <Icon name="bell" size={16} />
          {alerts.some(a => a.triggered) && (
            <span style={{ position: "absolute", top: 3, right: 3, width: 6, height: 6, borderRadius: "50%", background: "#ef4444" }} />
          )}
        </button>
        <button
          onClick={() => setDarkMode(d => !d)}
          style={{
            background: theme.bgCardAlt,
            border: `1px solid ${theme.border}`,
            borderRadius: 6, color: theme.textSecondary,
            padding: "6px 10px", fontSize: 13, cursor: "pointer",
            fontFamily: "inherit", display: "inline-flex", alignItems: "center",
          }}
        >
          <Icon name={darkMode ? "sun" : "moon"} size={16} />
        </button>
      </div>
    </div>
  );
}

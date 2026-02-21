import { useState, useRef, useCallback, useEffect } from "react";
import Icon from "./edukacja/Icon.jsx";

const POPULAR_ARTICLES = [
  { title: "Jak zacz\u0105\u0107 inwestowa\u0107 na GPW?", slug: "jak-zaczac-inwestowac-na-gpw" },
  { title: "Najlepsze konto maklerskie 2026", slug: "najlepsze-konto-maklerskie" },
  { title: "IKE vs IKZE \u2014 co wybra\u0107?", slug: "ike-vs-ikze" },
];

export default function DesktopNavMenu({ theme, darkMode, setDarkMode, tab, setTab, navigate, watchlistSize, showAlerts, setShowAlerts, alerts, setViewMode }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const closeTimer = useRef(null);
  const dropdownRefs = useRef({});

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

  const navItem = (label, key, hasDropdown = true) => (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => hasDropdown && handleMouseEnter(key)}
      onMouseLeave={handleMouseLeave}
      ref={el => dropdownRefs.current[key] = el}
    >
      <button
        onClick={() => {
          if (hasDropdown) {
            setOpenDropdown(o => o === key ? null : key);
          } else if (key === "dywidendy") {
            navigate("/dywidendy");
          }
        }}
        style={{
          background: "transparent", border: "none",
          color: openDropdown === key ? theme.accent : theme.textBright,
          fontSize: 14, fontWeight: 500, cursor: "pointer",
          padding: "8px 14px", borderRadius: 6,
          fontFamily: "var(--font-ui)",
          display: "inline-flex", alignItems: "center", gap: 4,
          transition: "color 0.15s, background 0.15s",
        }}
        onMouseEnter={e => { if (!hasDropdown) e.currentTarget.style.background = `${theme.accent}10`; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
      >
        {label}
        {hasDropdown && <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 2 }}>\u25BE</span>}
      </button>
    </div>
  );

  const sectionTitle = (text) => (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
      textTransform: "uppercase", color: theme.textMuted,
      marginBottom: 10, fontFamily: "var(--font-ui)",
    }}>{text}</div>
  );

  const dropdownLink = (icon, label, onClick, isSoon = false, isActive = false) => (
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
      onMouseEnter={e => { if (!isSoon) e.currentTarget.style.background = `rgba(255,255,255,0.06)`; }}
      onMouseLeave={e => { e.currentTarget.style.background = isActive ? `${theme.accent}10` : "transparent"; }}
    >
      <span style={{ fontSize: 16, width: 22, textAlign: "center", flexShrink: 0 }}>{icon}</span>
      <span>{label}</span>
      {isSoon && <span style={{ fontSize: 10, background: theme.bgCardAlt, borderRadius: 4, padding: "2px 6px", marginLeft: "auto", color: theme.textMuted }}>Wkr\u00F3tce</span>}
    </div>
  );

  const dropdown = (key, content, style = {}) => (
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
        ...style,
      }}
    >
      {content}
    </div>
  );

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 2,
      flex: 1, marginLeft: 24,
    }}>
      {/* Nav items */}
      <div style={{ position: "relative" }}
        onMouseEnter={() => handleMouseEnter("rynki")}
        onMouseLeave={handleMouseLeave}
      >
        <button
          onClick={() => setOpenDropdown(o => o === "rynki" ? null : "rynki")}
          style={{
            background: "transparent", border: "none",
            color: openDropdown === "rynki" ? theme.accent : theme.textBright,
            fontSize: 14, fontWeight: 500, cursor: "pointer",
            padding: "8px 14px", borderRadius: 6,
            fontFamily: "var(--font-ui)",
            display: "inline-flex", alignItems: "center", gap: 4,
            transition: "color 0.15s",
          }}
        >
          Rynki <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 2 }}>{"\u25BE"}</span>
        </button>
        {dropdown("rynki", (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, minWidth: 480 }}>
            <div>
              {sectionTitle("Akcje")}
              {dropdownLink("\u{1F3DB}\uFE0F", "Akcje GPW", () => handleNavClick({ tab: "akcje" }), false, tab === "akcje")}
              {dropdownLink("\u{1F525}", "Popularne", () => handleNavClick({ tab: "popularne" }), false, tab === "popularne")}
              {dropdownLink("\u{1F4CB}", "Indeksy GPW", () => handleNavClick({ tab: "indeksy" }), false, tab === "indeksy")}
            </div>
            <div>
              {sectionTitle("Inne rynki")}
              {dropdownLink("\u26CF\uFE0F", "Surowce", () => handleNavClick({ tab: "surowce" }), false, tab === "surowce")}
              {dropdownLink("\u{1F4B1}", "Forex", () => handleNavClick({ tab: "forex" }), false, tab === "forex")}
              {dropdownLink("\u{1F30D}", "Indeksy \u015Bwiatowe", () => handleNavClick({ tab: "swiatowe" }), false, tab === "swiatowe")}
            </div>
            <div>
              {sectionTitle("Widoki")}
              {dropdownLink("\u{1F4CA}", "Tabela", () => { handleNavClick({ tab: "akcje" }); setViewMode("table"); })}
              {dropdownLink("\u{1F5FA}\uFE0F", "Heatmapa", () => handleNavClick({ action: "heatmap" }))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: "relative" }}
        onMouseEnter={() => handleMouseEnter("narzedzia")}
        onMouseLeave={handleMouseLeave}
      >
        <button
          onClick={() => setOpenDropdown(o => o === "narzedzia" ? null : "narzedzia")}
          style={{
            background: "transparent", border: "none",
            color: openDropdown === "narzedzia" ? theme.accent : theme.textBright,
            fontSize: 14, fontWeight: 500, cursor: "pointer",
            padding: "8px 14px", borderRadius: 6,
            fontFamily: "var(--font-ui)",
            display: "inline-flex", alignItems: "center", gap: 4,
            transition: "color 0.15s",
          }}
        >
          Narz\u0119dzia <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 2 }}>{"\u25BE"}</span>
        </button>
        {dropdown("narzedzia", (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, minWidth: 380 }}>
            <div>
              {sectionTitle("Analiza")}
              {dropdownLink("\u{1F50D}", "Screener", () => handleNavClick({ tab: "screener" }), false, tab === "screener")}
              {dropdownLink("\u{1F4CA}", "Por\u00F3wnywarka", null, true)}
              {dropdownLink("\u{1F9EE}", "Kalkulator dyw.", () => handleNavClick({ href: "/dywidendy" }))}
            </div>
            <div>
              {sectionTitle("Portfolio")}
              {dropdownLink("\u{1F4BC}", "Portfolio", () => handleNavClick({ href: "/portfolio" }))}
              {dropdownLink("\u2B50", `Obserwowane${watchlistSize > 0 ? ` (${watchlistSize})` : ""}`, () => handleNavClick({ tab: "watchlist" }), false, tab === "watchlist")}
              {dropdownLink("\u{1F4C8}", "Moje screeny", null, true)}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/dywidendy")}
        style={{
          background: "transparent", border: "none",
          color: theme.textBright,
          fontSize: 14, fontWeight: 500, cursor: "pointer",
          padding: "8px 14px", borderRadius: 6,
          fontFamily: "var(--font-ui)",
          transition: "color 0.15s, background 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = `${theme.accent}10`}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        Dywidendy
      </button>

      <div style={{ position: "relative" }}
        onMouseEnter={() => handleMouseEnter("edukacja")}
        onMouseLeave={handleMouseLeave}
      >
        <button
          onClick={() => setOpenDropdown(o => o === "edukacja" ? null : "edukacja")}
          style={{
            background: "transparent", border: "none",
            color: openDropdown === "edukacja" ? theme.accent : theme.textBright,
            fontSize: 14, fontWeight: 500, cursor: "pointer",
            padding: "8px 14px", borderRadius: 6,
            fontFamily: "var(--font-ui)",
            display: "inline-flex", alignItems: "center", gap: 4,
            transition: "color 0.15s",
          }}
        >
          Edukacja <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 2 }}>{"\u25BE"}</span>
        </button>
        {dropdown("edukacja", (
          <div style={{ minWidth: 360 }}>
            <div style={{ marginBottom: 16 }}>
              {dropdownLink("\u{1F4DA}", "Podstawy inwestowania", () => handleNavClick({ href: "/edukacja/podstawy" }))}
              {dropdownLink("\u{1F4CA}", "Analiza fundamentalna i techniczna", () => handleNavClick({ href: "/edukacja/analiza" }))}
              {dropdownLink("\u{1F4B0}", "Strategie inwestycyjne", () => handleNavClick({ href: "/edukacja/strategia" }))}
              {dropdownLink("\u{1F4DD}", "Wszystkie artyku\u0142y", () => handleNavClick({ href: "/edukacja" }))}
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
                  <span style={{ color: theme.accent }}>→</span> {a.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/wiadomosci")}
        style={{
          background: "transparent", border: "none",
          color: theme.textBright,
          fontSize: 14, fontWeight: 500, cursor: "pointer",
          padding: "8px 14px", borderRadius: 6,
          fontFamily: "var(--font-ui)",
          transition: "color 0.15s, background 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = `${theme.accent}10`}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        Wiadomo\u015Bci
      </button>

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
            padding: "6px 12px", fontSize: 13, cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {darkMode ? "\u2600\uFE0F" : "\u{1F319}"}
        </button>
      </div>
    </div>
  );
}

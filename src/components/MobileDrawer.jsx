import { useState, useEffect, useRef, useCallback } from "react";

const MENU = [
  {
    icon: "\u{1F4C8}", label: "Rynki",
    children: [
      { icon: "\u{1F3DB}\uFE0F", label: "Akcje GPW", tab: "akcje" },
      { icon: "\u{1F525}", label: "Popularne", tab: "popularne" },
      { icon: "\u26CF\uFE0F", label: "Surowce", tab: "surowce" },
      { icon: "\u{1F4B1}", label: "Forex", tab: "forex" },
      { icon: "\u{1F4CB}", label: "Indeksy GPW", tab: "indeksy" },
      { icon: "\u{1F30D}", label: "Indeksy \u015Bwiatowe", tab: "swiatowe" },
    ],
  },
  {
    icon: "\u{1F4CA}", label: "Narz\u0119dzia",
    children: [
      { icon: "\u{1F50D}", label: "Screener", tab: "screener" },
      { icon: "\u{1F5FA}\uFE0F", label: "Heatmapa", action: "heatmap" },
      { icon: "\u{1F9EE}", label: "Kalkulator dywidend", href: "/dywidendy" },
    ],
  },
  {
    icon: "\u{1F4F0}", label: "Informacje",
    children: [
      { icon: "\u{1F4F0}", label: "Wiadomo\u015Bci", href: "/wiadomosci" },
      { icon: "\u{1F4C5}", label: "Kalendarz dywidend", href: "/dywidendy" },
      { icon: "\u{1F4C8}", label: "Indeks Fear & Greed", href: "/indeks" },
    ],
  },
  {
    icon: "\u{1F393}", label: "Edukacja",
    children: [
      { icon: "\u{1F4DA}", label: "Podstawy", href: "/edukacja/podstawy" },
      { icon: "\u{1F4CA}", label: "Analiza", href: "/edukacja/analiza" },
      { icon: "\u{1F4C8}", label: "Strategia", href: "/edukacja/strategia" },
      { icon: "\u{1F4DD}", label: "Wszystkie artyku\u0142y", href: "/edukacja" },
    ],
  },
  {
    icon: "\u{1F464}", label: "Moje",
    children: [
      { icon: "\u{1F4BC}", label: "Portfolio", href: "/portfolio" },
      { icon: "\u2B50", label: "Obserwowane", tab: "watchlist" },
    ],
  },
];

export default function MobileDrawer({ open, onClose, theme, darkMode, setDarkMode, tab, setTab, navigate, watchlistSize, setViewMode }) {
  const [submenu, setSubmenu] = useState(null);
  const [slideDir, setSlideDir] = useState("right");
  const drawerRef = useRef(null);
  const touchStartX = useRef(null);

  // Reset submenu when closed
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setSubmenu(null), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  const handleTouchStart = useCallback(e => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(e => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -60) onClose();
    touchStartX.current = null;
  }, [onClose]);

  const openSubmenu = (idx) => {
    setSlideDir("right");
    setSubmenu(idx);
  };

  const closeSubmenu = () => {
    setSlideDir("left");
    setSubmenu(null);
  };

  const handleItemClick = (item) => {
    if (item.tab) {
      setTab(item.tab);
      if (item.tab === "watchlist") setTab("akcje");
      onClose();
      // Navigate to home if we're not there
      navigate("/");
      if (item.tab === "watchlist") {
        // Handled via watchFilter in main
        setTab("watchlist");
      } else {
        setTab(item.tab);
      }
    }
    if (item.href) {
      navigate(item.href);
      onClose();
    }
    if (item.action === "heatmap") {
      setTab("akcje");
      setViewMode("heatmap");
      navigate("/");
      onClose();
    }
  };

  const menuItem = (icon, label, onClick, hasChevron = false, active = false) => (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "16px 20px",
        fontSize: 16, fontWeight: 500,
        color: active ? theme.accent : theme.textBright,
        borderBottom: `1px solid ${theme.border}`,
        cursor: "pointer",
        transition: "background 0.15s",
        background: active ? `${theme.accent}10` : "transparent",
        borderLeft: active ? `3px solid ${theme.accent}` : "3px solid transparent",
      }}
    >
      <span style={{ fontSize: 18, width: 24, textAlign: "center", flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, fontFamily: "var(--font-ui)" }}>{label}</span>
      {hasChevron && <span style={{ color: theme.textMuted, fontSize: 14 }}>\u203A</span>}
    </div>
  );

  const activeCategory = submenu !== null ? MENU[submenu] : null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 4999,
          background: "rgba(0,0,0,0.6)",
          opacity: open ? 1 : 0,
          transition: "opacity 200ms ease",
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0,
          width: "85vw", maxWidth: 360,
          zIndex: 5000,
          background: theme.bgCard,
          borderRight: `1px solid ${theme.border}`,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 300ms ease-out",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: `1px solid ${theme.border}`,
          flexShrink: 0,
        }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: theme.textBright }}>
            WIG<span style={{ color: theme.accent }}>markets</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent", border: "none",
              color: theme.textSecondary, fontSize: 22, cursor: "pointer",
              padding: "4px 8px", lineHeight: 1,
            }}
          >\u2715</button>
        </div>

        {/* Content area with animation */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          {/* Main menu */}
          <div style={{
            position: "absolute", inset: 0,
            overflowY: "auto", WebkitOverflowScrolling: "touch",
            transform: submenu !== null ? "translateX(-100%)" : "translateX(0)",
            transition: "transform 250ms ease-out",
          }}>
            {MENU.map((cat, i) => {
              const isActive = cat.children.some(c =>
                (c.tab && c.tab === tab) ||
                (c.href && window.location.pathname === c.href)
              );
              return (
                <div key={cat.label}>
                  {menuItem(cat.icon, cat.label, () => openSubmenu(i), true, isActive)}
                </div>
              );
            })}
          </div>

          {/* Submenu */}
          <div style={{
            position: "absolute", inset: 0,
            overflowY: "auto", WebkitOverflowScrolling: "touch",
            transform: submenu !== null ? "translateX(0)" : "translateX(100%)",
            transition: "transform 250ms ease-out",
          }}>
            {activeCategory && (
              <>
                {/* Back button */}
                <div
                  onClick={closeSubmenu}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "16px 20px",
                    borderBottom: `1px solid ${theme.border}`,
                    cursor: "pointer",
                    fontSize: 14, fontWeight: 700,
                    color: theme.textBright,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  <span style={{ fontSize: 16 }}>\u2190</span>
                  {activeCategory.label}
                </div>

                {/* Submenu items */}
                {activeCategory.children.map(item => {
                  const isActive =
                    (item.tab && item.tab === tab) ||
                    (item.href && window.location.pathname === item.href);
                  const label = item.tab === "watchlist" && watchlistSize > 0
                    ? `${item.label} (${watchlistSize})`
                    : item.label;
                  return (
                    <div key={item.label}>
                      {menuItem(item.icon, label, () => handleItemClick(item), false, isActive)}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Footer: theme toggle */}
        <div style={{
          borderTop: `1px solid ${theme.border}`,
          padding: "16px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 14, color: theme.textSecondary, fontFamily: "var(--font-ui)" }}>
            {darkMode ? "\u2600\uFE0F Tryb jasny" : "\u{1F319} Tryb ciemny"}
          </span>
          <button
            onClick={() => setDarkMode(d => !d)}
            style={{
              width: 48, height: 26, borderRadius: 13,
              border: "none", cursor: "pointer",
              background: darkMode ? theme.accent : theme.borderInput,
              position: "relative",
              transition: "background 0.2s",
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              background: "#fff",
              position: "absolute", top: 3,
              left: darkMode ? 25 : 3,
              transition: "left 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }} />
          </button>
        </div>
      </div>
    </>
  );
}

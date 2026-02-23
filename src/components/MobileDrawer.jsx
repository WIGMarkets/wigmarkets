import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "./edukacja/Icon.jsx";

const MENU = [
  {
    icon: "trending-up", label: "Rynki",
    children: [
      { icon: "building", label: "Akcje GPW", tab: "akcje" },
      { icon: "flame", label: "Popularne", tab: "popularne" },
      { icon: "diamond", label: "Surowce", tab: "surowce" },
      { icon: "dollar-sign", label: "Forex", tab: "forex" },
      { icon: "list", label: "Indeksy", href: "/indeksy" },
    ],
  },
  {
    icon: "sliders", label: "Narzędzia",
    children: [
      { icon: "search", label: "Screener", tab: "screener" },
      { icon: "grid", label: "Heatmapa", action: "heatmap" },
      { icon: "maximize-2", label: "Heatmapa pełny ekran", href: "/heatmapa" },
      { icon: "calculator", label: "Kalkulator dywidend", href: "/dywidendy" },
    ],
  },
  {
    icon: "newspaper", label: "Informacje",
    children: [
      { icon: "newspaper", label: "Wiadomości", href: "/wiadomosci" },
      { icon: "calendar", label: "Kalendarz dywidend", href: "/dywidendy" },
      { icon: "activity", label: "Indeks Fear & Greed", href: "/indeks" },
      { icon: "trophy", label: "Rankingi GPW", href: "/rankingi" },
    ],
  },
  {
    icon: "book-open", label: "Edukacja",
    children: [
      { icon: "book", label: "Podstawy", href: "/edukacja/podstawy" },
      { icon: "chart-bar", label: "Analiza", href: "/edukacja/analiza" },
      { icon: "target", label: "Strategia", href: "/edukacja/strategia" },
      { icon: "book-open", label: "Słowniczek pojęć", href: "/edukacja/slowniczek" },
      { icon: "file-text", label: "Wszystkie artykuły", href: "/edukacja" },
    ],
  },
  {
    icon: "user", label: "Moje",
    children: [
      { icon: "briefcase", label: "Portfolio", href: "/portfolio" },
      { icon: "star", label: "Obserwowane", tab: "watchlist" },
    ],
  },
];

export default function MobileDrawer({ open, onClose, theme, darkMode, setDarkMode, tab, setTab, navigate, watchlistSize, setViewMode }) {
  const [submenu, setSubmenu] = useState(null);
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
    setSubmenu(idx);
  };

  const closeSubmenu = () => {
    setSubmenu(null);
  };

  const handleItemClick = (item) => {
    if (item.tab) {
      onClose();
      navigate("/");
      setTab(item.tab);
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

  const menuItem = (iconName, label, onClick, hasChevron = false, active = false) => (
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
      <Icon name={iconName} size={20} />
      <span style={{ flex: 1, fontFamily: "var(--font-ui)" }}>{label}</span>
      {hasChevron && <Icon name="chevron-right" size={16} style={{ color: theme.textMuted }} />}
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
              color: theme.textSecondary, cursor: "pointer",
              padding: "4px 8px", lineHeight: 1,
              display: "inline-flex", alignItems: "center",
            }}
          ><Icon name="x" size={20} /></button>
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
                  <Icon name="arrow-left" size={16} />
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
          <span style={{ fontSize: 14, color: theme.textSecondary, fontFamily: "var(--font-ui)", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name={darkMode ? "sun" : "moon"} size={16} />
            {darkMode ? "Tryb jasny" : "Tryb ciemny"}
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

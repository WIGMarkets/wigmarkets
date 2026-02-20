import { useIsMobile } from "../../hooks/useIsMobile.js";
import Icon from "./Icon.jsx";

const CTA_CONFIGS = {
  screener: {
    iconName: "search",
    title: "Sprawdź to w praktyce",
    description: "Skorzystaj z naszego screenera i przeszukaj wszystkie spółki GPW według własnych kryteriów.",
    buttonText: "Otwórz screener GPW",
    link: "/",
  },
  portfolio: {
    iconName: "wallet",
    title: "Śledź swój portfel",
    description: "Dodaj spółki do swojego wirtualnego portfela i śledź wyniki w czasie rzeczywistym.",
    buttonText: "Przejdź do portfela",
    link: "/portfolio",
  },
  news: {
    iconName: "newspaper",
    title: "Bądź na bieżąco",
    description: "Czytaj najnowsze wiadomości z rynków finansowych i GPW.",
    buttonText: "Czytaj wiadomości",
    link: "/wiadomosci",
  },
  feargreed: {
    iconName: "trending-down",
    title: "Sprawdź nastroje rynku",
    description: "Zobacz aktualny indeks Fear & Greed dla GPW i oceń nastroje inwestorów.",
    buttonText: "Indeks Fear & Greed",
    link: "/indeks",
  },
  default: {
    iconName: "trending-up",
    title: "Sprawdź aktualne notowania GPW",
    description: "Przeglądaj notowania wszystkich spółek z Giełdy Papierów Wartościowych w czasie rzeczywistym.",
    buttonText: "Otwórz notowania GPW",
    link: "/",
  },
};

export default function CTABox({ ctaType = "default", ctaText, ctaLink, theme, onNavigate }) {
  const isMobile = useIsMobile();
  const cfg = CTA_CONFIGS[ctaType] || CTA_CONFIGS.default;
  const link = ctaLink || cfg.link;
  const text = ctaText || cfg.buttonText;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${theme.accent}18 0%, ${theme.accent}08 100%)`,
      border: `1px solid ${theme.accent}40`,
      borderRadius: 14,
      padding: isMobile ? "20px 16px" : "28px 28px",
      marginTop: 40,
      marginBottom: 32,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: theme.accent }}><Icon name={cfg.iconName} size={28} /></span>
        <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, color: theme.textBright }}>{cfg.title}</div>
      </div>
      <p style={{ margin: 0, fontSize: 15, color: theme.text, lineHeight: 1.6 }}>{cfg.description}</p>
      <div>
        <a
          href={link}
          onClick={e => { e.preventDefault(); onNavigate?.(link); }}
          style={{
            display: isMobile ? "block" : "inline-block",
            background: theme.accent,
            color: "#000",
            padding: "14px 24px",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
            textAlign: "center",
            transition: "opacity 0.15s",
            minHeight: 48,
            boxSizing: "border-box",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{text} <Icon name="arrow-right" size={16} /></span>
        </a>
      </div>
    </div>
  );
}

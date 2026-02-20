const CTA_CONFIGS = {
  screener: {
    icon: "🔍",
    title: "Sprawdź to w praktyce",
    description: "Skorzystaj z naszego screenera i przeszukaj wszystkie spółki GPW według własnych kryteriów.",
    buttonText: "Otwórz screener GPW",
    link: "/",
  },
  portfolio: {
    icon: "📊",
    title: "Śledź swój portfel",
    description: "Dodaj spółki do swojego wirtualnego portfela i śledź wyniki w czasie rzeczywistym.",
    buttonText: "Przejdź do portfela",
    link: "/portfolio",
  },
  news: {
    icon: "📰",
    title: "Bądź na bieżąco",
    description: "Czytaj najnowsze wiadomości z rynków finansowych i GPW.",
    buttonText: "Czytaj wiadomości",
    link: "/wiadomosci",
  },
  feargreed: {
    icon: "📉",
    title: "Sprawdź nastroje rynku",
    description: "Zobacz aktualny indeks Fear & Greed dla GPW i oceń nastroje inwestorów.",
    buttonText: "Indeks Fear & Greed",
    link: "/indeks",
  },
  default: {
    icon: "📈",
    title: "Sprawdź aktualne notowania GPW",
    description: "Przeglądaj notowania wszystkich spółek z Giełdy Papierów Wartościowych w czasie rzeczywistym.",
    buttonText: "Otwórz notowania GPW",
    link: "/",
  },
};

export default function CTABox({ ctaType = "default", ctaText, ctaLink, theme, onNavigate }) {
  const cfg = CTA_CONFIGS[ctaType] || CTA_CONFIGS.default;
  const link = ctaLink || cfg.link;
  const text = ctaText || cfg.buttonText;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${theme.accent}18 0%, ${theme.accent}08 100%)`,
      border: `1px solid ${theme.accent}40`,
      borderRadius: 14,
      padding: "28px 28px",
      marginTop: 40,
      marginBottom: 32,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 28 }}>{cfg.icon}</span>
        <div style={{ fontSize: 18, fontWeight: 800, color: theme.textBright }}>{cfg.title}</div>
      </div>
      <p style={{ margin: 0, fontSize: 15, color: theme.text, lineHeight: 1.6 }}>{cfg.description}</p>
      <div>
        <a
          href={link}
          onClick={e => { e.preventDefault(); onNavigate?.(link); }}
          style={{
            display: "inline-block",
            background: theme.accent,
            color: "#000",
            padding: "12px 24px",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          {text} →
        </a>
      </div>
    </div>
  );
}

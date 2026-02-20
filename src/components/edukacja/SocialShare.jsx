import { useState } from "react";
import Icon from "./Icon.jsx";

export default function SocialShare({ title, url, theme }) {
  const [copied, setCopied] = useState(false);
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url || window.location.href);

  const buttons = [
    {
      label: "Twitter/X",
      icon: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "#1da1f2",
    },
    {
      label: "Facebook",
      icon: "f",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "#1877f2",
    },
    {
      label: "LinkedIn",
      icon: "in",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "#0a66c2",
    },
  ];

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 32, paddingTop: 20, borderTop: `1px solid ${theme.border}` }}>
      <span style={{ fontSize: 13, color: theme.textSecondary, fontWeight: 600 }}>Udostępnij:</span>
      {buttons.map(btn => (
        <a
          key={btn.label}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Udostępnij na ${btn.label}`}
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 44, height: 44, borderRadius: 8,
            background: `${btn.color}20`,
            color: btn.color,
            fontWeight: 800, fontSize: 16, textDecoration: "none",
            border: `1px solid ${btn.color}40`,
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = `${btn.color}40`}
          onMouseLeave={e => e.currentTarget.style.background = `${btn.color}20`}
        >
          {btn.icon}
        </a>
      ))}
      <button
        onClick={copyLink}
        style={{
          padding: "10px 16px", borderRadius: 8, border: `1px solid ${theme.border}`,
          background: theme.bgCardAlt, color: theme.textSecondary,
          fontFamily: "inherit", fontSize: 13, cursor: "pointer", minHeight: 44,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          {copied ? <><Icon name="check" size={14} color="#00c896" /> Skopiowano!</> : <><Icon name="link" size={14} /> Kopiuj link</>}
        </span>
      </button>
    </div>
  );
}

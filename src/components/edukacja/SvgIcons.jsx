import React from "react";

/* ------------------------------------------------------------------ */
/* IconTip - Lightbulb                                                 */
/* ------------------------------------------------------------------ */
export function IconTip({ color = "#f0883e", size = 24 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bulb */}
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 2.61 1.43 4.88 3.5 6.12V17.5c0 .28.22.5.5.5h6c.28 0 .5-.22.5-.5v-2.38C17.57 13.88 19 11.61 19 9c0-3.87-3.13-7-7-7z"
        fill={color}
        opacity="0.85"
      />
      {/* Rays */}
      <line x1="12" y1="0.5" x2="12" y2="1.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <line x1="4" y1="4" x2="4.8" y2="4.8" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <line x1="20" y1="4" x2="19.2" y2="4.8" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <line x1="2" y1="9" x2="3" y2="9" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <line x1="21" y1="9" x2="22" y2="9" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      {/* Base lines */}
      <rect x="9" y="19" width="6" height="1.2" rx="0.6" fill={color} opacity="0.6" />
      <rect x="9.5" y="21" width="5" height="1.2" rx="0.6" fill={color} opacity="0.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* IconWarning - Triangle with exclamation mark                        */
/* ------------------------------------------------------------------ */
export function IconWarning({ color = "#ef4444", size = 24 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Triangle */}
      <path
        d="M12 2.5L1.5 21.5h21L12 2.5z"
        fill={color}
        opacity="0.85"
        strokeLinejoin="round"
      />
      {/* Exclamation line */}
      <line x1="12" y1="9" x2="12" y2="15" stroke="#0d1117" strokeWidth="2" strokeLinecap="round" />
      {/* Exclamation dot */}
      <circle cx="12" cy="18" r="1.2" fill="#0d1117" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* IconInfo - Circle with "i"                                          */
/* ------------------------------------------------------------------ */
export function IconInfo({ color = "#3b82f6", size = 24 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle */}
      <circle cx="12" cy="12" r="10" fill={color} opacity="0.85" />
      {/* Letter i - dot */}
      <circle cx="12" cy="8" r="1.3" fill="#0d1117" />
      {/* Letter i - stem */}
      <rect x="10.8" y="10.5" width="2.4" height="7" rx="1.2" fill="#0d1117" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* IconBasics - Open book (for "Podstawy" category)                    */
/* ------------------------------------------------------------------ */
export function IconBasics({ color = "#3b82f6", size = 32 }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left page */}
      <path
        d="M4 6C4 6 6 4 16 4L16 26C6 26 4 28 4 28V6z"
        fill={color}
        opacity="0.7"
      />
      {/* Right page */}
      <path
        d="M28 6C28 6 26 4 16 4L16 26C26 26 28 28 28 28V6z"
        fill={color}
        opacity="0.85"
      />
      {/* Spine */}
      <line x1="16" y1="4" x2="16" y2="26" stroke="#0d1117" strokeWidth="1" opacity="0.4" />
      {/* Text lines - left page */}
      <rect x="7" y="10" width="6" height="1.2" rx="0.6" fill="#0d1117" opacity="0.3" />
      <rect x="7" y="13" width="5" height="1.2" rx="0.6" fill="#0d1117" opacity="0.25" />
      <rect x="7" y="16" width="6.5" height="1.2" rx="0.6" fill="#0d1117" opacity="0.3" />
      <rect x="7" y="19" width="4.5" height="1.2" rx="0.6" fill="#0d1117" opacity="0.25" />
      {/* Text lines - right page */}
      <rect x="19" y="10" width="6" height="1.2" rx="0.6" fill="#0d1117" opacity="0.25" />
      <rect x="19" y="13" width="5.5" height="1.2" rx="0.6" fill="#0d1117" opacity="0.2" />
      <rect x="19" y="16" width="6" height="1.2" rx="0.6" fill="#0d1117" opacity="0.25" />
      <rect x="19" y="19" width="5" height="1.2" rx="0.6" fill="#0d1117" opacity="0.2" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* IconAnalysis - Chart with magnifier (for "Analiza" category)        */
/* ------------------------------------------------------------------ */
export function IconAnalysis({ color = "#22c55e", size = 32 }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bar chart */}
      <rect x="4" y="20" width="5" height="8" rx="1.5" fill={color} opacity="0.5" />
      <rect x="11" y="14" width="5" height="14" rx="1.5" fill={color} opacity="0.7" />
      <rect x="18" y="10" width="5" height="18" rx="1.5" fill={color} opacity="0.85" />
      {/* Magnifying glass */}
      <circle cx="24" cy="10" r="6" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="24" cy="10" r="4" fill={color} opacity="0.1" />
      <line x1="28.2" y1="14.2" x2="31" y2="17" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Axis */}
      <line x1="3" y1="28.5" x2="24" y2="28.5" stroke={color} strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* IconStrategy - Target / crosshair (for "Strategia" category)        */
/* ------------------------------------------------------------------ */
export function IconStrategy({ color = "#f0883e", size = 32 }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer ring */}
      <circle cx="16" cy="16" r="12" fill="none" stroke={color} strokeWidth="2" opacity="0.4" />
      {/* Middle ring */}
      <circle cx="16" cy="16" r="8" fill="none" stroke={color} strokeWidth="2" opacity="0.6" />
      {/* Inner ring */}
      <circle cx="16" cy="16" r="4" fill="none" stroke={color} strokeWidth="2" opacity="0.8" />
      {/* Bullseye */}
      <circle cx="16" cy="16" r="1.8" fill={color} />
      {/* Crosshair lines */}
      <line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="16" y1="26" x2="16" y2="30" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="2" y1="16" x2="6" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="26" y1="16" x2="30" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

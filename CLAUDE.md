# CLAUDE.md — WIGmarkets.pl

## Projekt

WIGmarkets.pl to premium polski portal giełdowy — kompleksowe źródło danych o spółkach notowanych na GPW (Giełda Papierów Wartościowych w Warszawie). Portal oferuje notowania w czasie rzeczywistym, analizę fundamentalną i techniczną, Fear & Greed Index, screener, śledzenie dywidend i portfolio tracking.

**Cel:** Stać się najlepszym polskim narzędziem do analizy spółek GPW — czytelnym, szybkim i wizualnie na poziomie światowych fintech products.

**Grupa docelowa:** Polscy inwestorzy indywidualni — od początkujących (potrzebują kontekstu i wyjaśnień) po zaawansowanych (potrzebują szybkiego dostępu do danych). Średnio-zaawansowany użytkownik to nasz primary persona.

**Język interfejsu:** Polski. Wszelkie labele, nagłówki, opisy, buttony, tooltips — po polsku. Angielski dopuszczalny w skrótach branżowych (P/E, EPS, RSI, MACD, SMA itp.).

## Stack technologiczny

* Framework: React 18+ (Next.js, App Router)
* Hosting: Vercel
* Styling: Tailwind CSS 3+
* Wykresy: Recharts (bar, line, pie) + Lightweight Charts by TradingView (wykresy cenowe)
* State management: React hooks (useState, useEffect, useContext). Zustand jeśli potrzebny global state.
* Dane: Yahoo Finance API (via backend proxy), dane cachowane, aktualizowane daily/intraday
* Monospace/dane: Font z tabular-nums dla wszystkich wartości liczbowych

## Design System

### Filozofia

Premium fintech dark mode. Inspiracje: Linear (spacing, czytelność), Stripe Dashboard (hierarchia informacji), TradingView (data density), Arc Browser (elegancja dark UI).

**Zasada nadrzędna:** Dane mówią same za siebie — design im nie przeszkadza, a pomaga. Każdy piksel whitespace jest celowy. Każdy element ma jasną hierarchię. Użytkownik w 3 sekundy wie, gdzie patrzeć.

### Paleta kolorów

```css
/* Surface depth system — 4 poziomy głębokości */
--bg-base: #09090b;        /* najgłębsze tło strony */
--bg-card: #111114;        /* karty, sekcje, kontenery */
--bg-elevated: #1a1a1f;    /* hover states, elementy uniesione */
--bg-surface: #222228;     /* inputy, active states, selected */

/* Borders */
--border-subtle: #1e1e24;  /* delikatne separatory */
--border-default: #2a2a32; /* domyślne obramowania kart */
--border-hover: #3a3a44;   /* hover na kartach */

/* Tekst */
--text-primary: #f4f4f5;   /* główny tekst, wartości */
--text-secondary: #a1a1aa; /* labels, opisy, meta */
--text-muted: #63636e;     /* placeholder, disabled, footnotes */

/* Semantyczne — rynek */
--color-up: #10b981;       /* wzrost, bullish, pozytywny */
--color-up-bg: #10b98115;  /* tło badge wzrostu */
--color-down: #ef4444;     /* spadek, bearish, negatywny */
--color-down-bg: #ef444415;/* tło badge spadku */
--color-neutral: #3b82f6;  /* neutralny akcent, linki, interactive */
--color-neutral-bg: #3b82f615;

/* Dodatkowe akcenty */
--color-warning: #f59e0b;  /* ostrzeżenia, "neutralny" w sygnałach */
--color-warning-bg: #f59e0b15;
```

**Zasada kolorów rynkowych:** Zielony = wzrost/pozytywny, Czerwony = spadek/negatywny. Zawsze. Nigdy nie odwracaj tej konwencji. Użytkownik musi móc skanować kolory wzrokiem bez czytania liczb.

### Typografia

```css
/* Font stack */
--font-display: 'Geist', system-ui, sans-serif;     /* nagłówki, UI elements */
--font-mono: 'Geist Mono', 'JetBrains Mono', monospace; /* ceny, wartości liczbowe */

/* Skala typograficzna */
--text-hero: 48px;      /* cena w hero sekcji */
--text-h1: 28-32px;     /* nazwa spółki, główne nagłówki stron */
--text-h2: 20-24px;     /* wartości w kartach (EPS, przychody) */
--text-h3: 16-18px;     /* wartości w tabelach */
--text-body: 14-15px;   /* tekst body, opisy */
--text-small: 12-13px;  /* labels, meta, footnotes */
--text-micro: 11px;     /* ALL CAPS section headers */

/* Nagłówki sekcji */
/* ZAWSZE: uppercase, letter-spacing: 0.05-0.1em, font-weight 600, kolor --text-secondary */
/* Przykład: "DANE FUNDAMENTALNE", "WSKAŹNIKI TECHNICZNE" */

/* Wartości liczbowe */
/* ZAWSZE: font-mono, font-variant-numeric: tabular-nums */
/* Dzięki temu cyfry są aligned w kolumnach tabel */
```

**Hierarchia:** Na każdej stronie musi być JEDEN element dominujący (np. cena spółki). Reszta organizuje się wokół niego w jasnej hierarchii malejącej.

### Spacing & Layout

```css
/* Spacing scale */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;

/* Layout */
--content-max-width: 1200px;  /* centered, z auto margins */
--card-padding: 24px;         /* wewnętrzny padding kart */
--card-radius: 12px;          /* border-radius kart */
--section-gap: 48-64px;       /* gap między sekcjami strony */
--table-row-height: 48px;     /* minimum height wiersza tabeli */
```

**Zasada whitespace:** Więcej powietrza = lepiej. Jeśli masz wątpliwość czy dodać padding — dodaj. Ciasny interfejs wygląda jak spreadsheet. Premium interfejs oddycha.

### Ikony

**Biblioteka:** Lucide React (`lucide-react`) — spójna, lekka, open-source, doskonała dla fintech UI.

```bash
npm install lucide-react
```

```jsx
import { TrendingUp, TrendingDown, Star, Search, ChevronDown, ExternalLink, Info } from 'lucide-react';

// Domyślne props dla spójności:
<TrendingUp size={16} strokeWidth={2} className="text-emerald-500" />
```

**Zasady użycia ikon:**

* NIGDY nie używaj emoji w UI. Emoji renderują się niespójnie między systemami (Windows vs Mac vs Android), nie skalujesz ich precyzyjnie i nie kontrolujesz koloru. Zawsze SVG z Lucide.
* Rozmiary: 16px (inline z tekstem, tabele), 20px (buttony, nav), 24px (hero elements, empty states)
* strokeWidth: 2 (domyślnie), 1.5 (dla większych ikon 24px+)
* Kolor: via Tailwind className — nigdy inline color prop
* Ikony rynkowe: TrendingUp (wzrost, zielony), TrendingDown (spadek, czerwony), Minus (bez zmian, muted)
* Ikona gwiazdki (watchlist): Star — outline = nie obserwujesz, filled = obserwujesz (fill="currentColor")
* Każda ikona w nawigacji/toolbarze MUSI mieć towarzyszący `<span>` z tekstem LUB title/aria-label dla dostępności

**Mapowanie zastosowań:**

```
Nawigacja:       Search, Bell, Sun/Moon, Star, ChevronDown, Menu
Akcje:           Star (watchlist), Plus (portfolio), ExternalLink (linki zewn.)
Dane rynkowe:    TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight
Sekcje:          ChevronDown/ChevronUp (collapse), Maximize2 (fullscreen chart)
Informacyjne:    Info (tooltips), HelpCircle (wyjaśnienia), AlertTriangle (warning)
Tabele:          ArrowUpDown (sortowanie), Download (CSV export), Filter
```

## Komponenty — wspólne wzorce

**Karty (Card):**
* bg: `var(--bg-card)`, border: `1px solid var(--border-subtle)`, border-radius: `var(--card-radius)`
* Hover: `border-color: var(--border-hover)`, `transform: translateY(-1px)`, `transition: all 0.2s ease`
* Padding: `var(--card-padding)`

**Pill Badge:**
* Mały zaokrąglony element z tłem i tekstem
* Warianty: up (zielone bg + zielony tekst), down (czerwone), neutral (niebieskie), muted (szare)
* `padding: 2px 8px`, `border-radius: 6px`, `font-size: 12-13px`, `font-weight: 500`

**Tabele:**
* Header: text-secondary, uppercase, letter-spacing: 0.05em, font-size: 11px, sticky
* Wiersz: `border-bottom: 1px solid var(--border-subtle)`
* Hover: `bg: var(--bg-elevated)`
* Zebra striping: NIE stosujemy. Używamy hover i subtelnych borders.

**Buttons:**
* Primary: `bg: var(--color-neutral)`, white text, `border-radius: 8px`
* Ghost: transparent bg, `border: 1px solid var(--border-default)`, text-secondary
* Hover: subtle brightness increase, nie dramatyczne zmiany

**Tooltip / micro-kontekst:**
* Przy wskaźnikach technicznych i fundamentalnych — krótki tekst wyjaśniający co dana wartość oznacza
* `font-size: 12px`, `color: var(--text-muted)`, kursywa LUB w nawiasach

## Architektura projektu

```
src/
├── app/                    # Next.js App Router
│   ├── page.jsx            # Strona główna (dashboard GPW)
│   ├── stock/[ticker]/     # Profil spółki (dynamiczny route)
│   ├── screener/           # Screener akcji
│   ├── dividends/          # Kalendarz dywidend
│   └── layout.jsx          # Root layout (nav, footer, providers)
├── components/
│   ├── ui/                 # Atomic components (Button, Badge, Card, Tooltip)
│   ├── charts/             # Chart components (PriceChart, BarChart, GaugeChart)
│   ├── stock/              # Stock-specific (StockHero, KeyMetrics, TechnicalAnalysis)
│   ├── market/             # Market-wide (FearGreedIndex, SectorDominance, MarketTicker)
│   └── layout/             # Navbar, Footer, Sidebar, Breadcrumbs
├── lib/
│   ├── utils.js            # Formattery (formatPrice, formatVolume, formatPercent)
│   ├── api.js              # API calls, data fetching
│   └── constants.js        # Stałe (sektory, indeksy, config)
├── hooks/                  # Custom hooks (useStock, useWatchlist, usePortfolio)
└── styles/
    └── globals.css         # CSS variables, base styles, Tailwind config
```

### Konwencje nazewnictwa

* Komponenty: PascalCase (`StockHero.jsx`, `FearGreedIndex.jsx`)
* Utility functions: camelCase (`formatPrice`, `getChangeColor`)
* CSS classes: Tailwind utilities (nie custom CSS classes, chyba że absolutnie konieczne)
* Pliki danych/lib: camelCase (`stockData.js`, `apiHelpers.js`)

## Formatowanie danych — utility functions

Zawsze używaj spójnych formatterów:

```js
// Ceny: "109,94 zł" — polska notacja (przecinek dziesiętny), z walutą
formatPrice(109.94) → "109,94 zł"

// Duże liczby: "127,6 mld zł", "134.9 mln", "1.2 mln"
formatLargeNumber(127600000000) → "127,6 mld"
formatLargeNumber(134900000) → "134,9 mln"
formatLargeNumber(1200000) → "1,2 mln"

// Procenty: "+1,46%" z kolorem, "▲ +1,46%" ze strzałką
formatPercent(1.46) → "+1,46%"  // zielony
formatPercent(-1.40) → "-1,40%" // czerwony

// Wskaźniki: "19,84x" (z "x" suffix dla mnożników)
formatMultiple(19.84) → "19,84x"
```

**WAŻNE:** Polska notacja liczbowa — przecinek jako separator dziesiętny, kropka lub spacja jako separator tysięcy. "1 200 000" lub "1.200.000", NIE "1,200,000".

## Anti-patterns — czego NIGDY nie robimy

### Design

* Kolorowe ikonki-badge'e (fioletowe "P", zielone "ZN" itp.) — nie komunikują znaczenia, to wizualny szum
* Generyczne fonty: Inter, Roboto, Arial, system-ui jako primary font
* Agresywne CTA: "KUPUJ" / "SPRZEDAJ" w dużych kolorowych przyciskach — jesteśmy portalem informacyjnym, nie brokerem. Sygnały techniczne opisujemy jako "Pozytywny" / "Neutralny" / "Negatywny"
* Purple gradients na białym tle — typowy "AI slop"
* Zbyt ciasne row heights w tabelach (<44px) — dane muszą oddychać
* Ikony bez labeli — każda ikona w navie musi mieć tooltip lub tekst
* Emoji w UI — nigdy. Zawsze SVG ikony z Lucide React. Emoji są niespójne cross-platform, niestylowalne i nieprofesjonalne
* Jednorodne dark mode — bez depth system wygląda płasko. Zawsze używaj min. 3 poziomów surface
* Zebra striping w tabelach — zamiast tego: hover state + subtle borders

### Kod

* Inline styles — używaj Tailwind classes
* Hardcoded kolory w JSX — zawsze CSS variables lub Tailwind config
* Brak obsługi null/undefined — jeśli dane są niedostępne, pokaż "b.d." (brak danych) w muted color, nie "—", "0", "null" czy pusty string
* console.log w produkcji — czyść przed deployem
* Gigantyczne komponenty — max ~200 linii na komponent, potem wydzielaj

### UX

* Wall of data bez hierarchii — każda strona musi mieć jasny focal point
* Brak disclaimerów przy sygnałach technicznych — zawsze dodawaj "Nie stanowi rekomendacji inwestycyjnej"
* Brak loading states — każdy komponent z danymi musi mieć skeleton/pulse loading
* Brak hover/active states — każdy klikalny element musi mieć feedback

## Wskazówki dla Claude Code

1. Zanim zaczniesz kodować nową stronę lub komponent — najpierw opisz krótko plan (jakie sekcje, jaki layout, jakie dane). Potem koduj.
2. Spójność > Kreatywność — nowe elementy muszą wyglądać jak część tego samego systemu. Sprawdź istniejące komponenty zanim stworzysz nowy.
3. Mobile-first responsywność — zawsze myśl o tym, jak komponent wygląda na 375px. Tabele dostają horizontal scroll, gridy stack się do single-column.
4. Dane po polsku — labele, nagłówki, opisy UI, buttony, placeholder tekst — wszystko po polsku. Komentarze w kodzie mogą być po angielsku.
5. Testy wizualne — po stworzeniu komponentu, sprawdź czy:
   * Hierarchia wizualna jest jasna (co jest najważniejsze?)
   * Spacing jest konsystentny (nie "na oko")
   * Kolory semantyczne są prawidłowe (zielony=wzrost, czerwony=spadek)
   * Font mono jest użyty dla WSZYSTKICH wartości liczbowych
   * Brak danych jest obsłużony ("b.d." zamiast crash)

# CLAUDE.md — WIGmarkets.pl

## Projekt

WIGmarkets.pl to premium polski portal gieldowy — kompleksowe zrodlo danych o spolkach notowanych na GPW (Gielda Papierow Wartosciowych w Warszawie). Portal oferuje notowania w czasie rzeczywistym, analize fundamentalna i techniczna, Fear & Greed Index, screener, sledzenie dywidend i portfolio tracking.

**Cel:** Stac sie najlepszym polskim narzedziem do analizy spolek GPW — czytelnym, szybkim i wizualnie na poziomie swiatowych fintech products.

**Grupa docelowa:** Polscy inwestorzy indywidualni — od poczatkujacych (potrzebuja kontekstu i wyjasnien) po zaawansowanych (potrzebuja szybkiego dostepu do danych). Srednio-zaawansowany uzytkownik to nasz primary persona.

**Jezyk interfejsu:** Polski. Wszelkie labele, naglowki, opisy, buttony, tooltips — po polsku. Angielski dopuszczalny w skrotach branzowych (P/E, EPS, RSI, MACD, SMA itp.).

## Stack technologiczny

| Warstwa | Technologia |
|---|---|
| Framework | React 18+ (Vite jako bundler/dev server) |
| Routing | React Router DOM (client-side SPA routing) |
| Hosting | Vercel (static SPA + Serverless Functions) |
| Backend/API | Vercel Serverless Functions (`/api` folder w roocie) — proxy do Yahoo Finance, cache, obliczenia |
| Styling | Tailwind CSS 3+ |
| Wykresy | Recharts (bar, line, pie) + Lightweight Charts by TradingView (wykresy cenowe) |
| Ikony | Lucide React (SVG, zadnych emoji) |
| State management | React hooks (useState, useEffect, useContext). Zustand jesli potrzebny global state. |
| Dane | Yahoo Finance API (via `/api` serverless proxy), dane cachowane, aktualizowane daily/intraday |
| Monospace/dane | Font z `tabular-nums` dla wszystkich wartosci liczbowych |
| Build | `vite build` → output do `dist/`, Vercel deployuje automatycznie |

## Komendy deweloperskie

```bash
npm install        # Instalacja zaleznosci
npm run dev        # Serwer deweloperski (http://localhost:5173)
npm run build      # Produkcyjny build (output: dist/)
npm run preview    # Podglad produkcyjnego buildu
```

## Design System

### Filozofia

Premium fintech dark mode. Inspiracje: Linear (spacing, czytelnosc), Stripe Dashboard (hierarchia informacji), TradingView (data density), Arc Browser (elegancja dark UI).

**Zasada nadrzedna:** Dane mowia same za siebie — design im nie przeszkadza, a pomaga. Kazdy piksel whitespace jest celowy. Kazdy element ma jasna hierarchie. Uzytkownik w 3 sekundy wie, gdzie patrzec.

### Paleta kolorow

```css
/* Surface depth system — 4 poziomy glebokosci */
--bg-base: #09090b;        /* najglebsze tlo strony */
--bg-card: #111114;        /* karty, sekcje, kontenery */
--bg-elevated: #1a1a1f;    /* hover states, elementy uniesione */
--bg-surface: #222228;     /* inputy, active states, selected */

/* Borders */
--border-subtle: #1e1e24;  /* delikatne separatory */
--border-default: #2a2a32; /* domyslne obramowania kart */
--border-hover: #3a3a44;   /* hover na kartach */

/* Tekst */
--text-primary: #f4f4f5;   /* glowny tekst, wartosci */
--text-secondary: #a1a1aa; /* labels, opisy, meta */
--text-muted: #63636e;     /* placeholder, disabled, footnotes */

/* Semantyczne — rynek */
--color-up: #10b981;       /* wzrost, bullish, pozytywny */
--color-up-bg: #10b98115;  /* tlo badge wzrostu */
--color-down: #ef4444;     /* spadek, bearish, negatywny */
--color-down-bg: #ef444415;/* tlo badge spadku */
--color-neutral: #3b82f6;  /* neutralny akcent, linki, interactive */
--color-neutral-bg: #3b82f615;

/* Dodatkowe akcenty */
--color-warning: #f59e0b;  /* ostrzezenia, "neutralny" w sygnalach */
--color-warning-bg: #f59e0b15;
```

**Zasada kolorow rynkowych:** Zielony = wzrost/pozytywny, Czerwony = spadek/negatywny. Zawsze. Nigdy nie odwracaj tej konwencji. Uzytkownik musi moc skanowac kolory wzrokiem bez czytania liczb.

### Typografia

```css
/* Font stack */
--font-display: 'Geist', system-ui, sans-serif;     /* naglowki, UI elements */
--font-mono: 'Geist Mono', 'JetBrains Mono', monospace; /* ceny, wartosci liczbowe */

/* Skala typograficzna */
--text-hero: 48px;      /* cena w hero sekcji */
--text-h1: 28-32px;     /* nazwa spolki, glowne naglowki stron */
--text-h2: 20-24px;     /* wartosci w kartach (EPS, przychody) */
--text-h3: 16-18px;     /* wartosci w tabelach */
--text-body: 14-15px;   /* tekst body, opisy */
--text-small: 12-13px;  /* labels, meta, footnotes */
--text-micro: 11px;     /* ALL CAPS section headers */

/* Naglowki sekcji */
/* ZAWSZE: uppercase, letter-spacing: 0.05-0.1em, font-weight 600, kolor --text-secondary */
/* Przyklad: "DANE FUNDAMENTALNE", "WSKAZNIKI TECHNICZNE" */

/* Wartosci liczbowe */
/* ZAWSZE: font-mono, font-variant-numeric: tabular-nums */
/* Dzieki temu cyfry sa aligned w kolumnach tabel */
```

**Hierarchia:** Na kazdej stronie musi byc JEDEN element dominujacy (np. cena spolki). Reszta organizuje sie wokol niego w jasnej hierarchii malejacej.

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
--card-padding: 24px;         /* wewnetrzny padding kart */
--card-radius: 12px;          /* border-radius kart */
--section-gap: 48-64px;       /* gap miedzy sekcjami strony */
--table-row-height: 48px;     /* minimum height wiersza tabeli */
```

**Zasada whitespace:** Wiecej powietrza = lepiej. Jesli masz watpliwosc czy dodac padding — dodaj. Ciasny interfejs wyglada jak spreadsheet. Premium interfejs oddycha.

### Ikony

Biblioteka: **Lucide React** (`lucide-react`) — spojna, lekka, open-source, doskonala dla fintech UI.

```bash
npm install lucide-react
```

```jsx
import { TrendingUp, TrendingDown, Star, Search, ChevronDown, ExternalLink, Info } from 'lucide-react';

// Domyslne props dla spojnosci:
<TrendingUp size={16} strokeWidth={2} className="text-emerald-500" />
```

**Zasady uzycia ikon:**

- NIGDY nie uzywaj emoji w UI. Emoji renderuja sie niespoznie miedzy systemami (Windows vs Mac vs Android), nie skalujesz ich precyzyjnie i nie kontrolujesz koloru. Zawsze SVG z Lucide.
- Rozmiary: 16px (inline z tekstem, tabele), 20px (buttony, nav), 24px (hero elements, empty states)
- `strokeWidth`: 2 (domyslnie), 1.5 (dla wiekszych ikon 24px+)
- Kolor: via Tailwind `className` — nigdy inline color prop
- Ikony rynkowe: `TrendingUp` (wzrost, zielony), `TrendingDown` (spadek, czerwony), `Minus` (bez zmian, muted)
- Ikona gwiazdki (watchlist): `Star` — outline = nie obserwujesz, filled = obserwujesz (`fill="currentColor"`)
- Kazda ikona w nawigacji/toolbarze MUSI miec towarzyszacy `<span>` z tekstem LUB `title`/`aria-label` dla dostepnosci

**Mapowanie zastosowan:**

| Kontekst | Ikony |
|---|---|
| Nawigacja | Search, Bell, Sun/Moon, Star, ChevronDown, Menu |
| Akcje | Star (watchlist), Plus (portfolio), ExternalLink (linki zewn.) |
| Dane rynkowe | TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight |
| Sekcje | ChevronDown/ChevronUp (collapse), Maximize2 (fullscreen chart) |
| Informacyjne | Info (tooltips), HelpCircle (wyjasnienia), AlertTriangle (warning) |
| Tabele | ArrowUpDown (sortowanie), Download (CSV export), Filter |

### Komponenty — wspolne wzorce

**Karty (Card):**
- bg: `var(--bg-card)`, border: `1px solid var(--border-subtle)`, border-radius: `var(--card-radius)`
- Hover: `border-color: var(--border-hover)`, `transform: translateY(-1px)`, `transition: all 0.2s ease`
- Padding: `var(--card-padding)`

**Pill Badge:**
- Maly zaokraglony element z tlem i tekstem
- Warianty: up (zielone bg + zielony tekst), down (czerwone), neutral (niebieskie), muted (szare)
- `padding: 2px 8px`, `border-radius: 6px`, `font-size: 12-13px`, `font-weight: 500`

**Tabele:**
- Header: `text-secondary`, uppercase, `letter-spacing: 0.05em`, `font-size: 11px`, sticky
- Wiersz: `border-bottom: 1px solid var(--border-subtle)`
- Hover: `bg: var(--bg-elevated)`
- Zebra striping: NIE stosujemy. Uzywamy hover i subtelnych borders.

**Buttons:**
- Primary: `bg: var(--color-neutral)`, white text, `border-radius: 8px`
- Ghost: transparent bg, `border: 1px solid var(--border-default)`, `text-secondary`
- Hover: subtle brightness increase, nie dramatyczne zmiany

**Tooltip / micro-kontekst:**
- Przy wskaznikach technicznych i fundamentalnych — krotki tekst wyjasniajacy co dana wartosc oznacza
- `font-size: 12px`, `color: var(--text-muted)`, kursywa LUB w nawiasach

## Architektura projektu

```
wigmarkets/
├── api/                        # Vercel Serverless Functions (Node.js)
│   ├── stock.js                # /api/stock?ticker=PKN — dane spolki
│   ├── market.js               # /api/market — dane rynkowe (WIG20, WIG)
│   └── ...                     # Inne endpointy API
├── public/                     # Statyczne assety (logo SVG, favicons, OG images)
├── src/
│   ├── components/
│   │   ├── ui/                 # Atomic components (Button, Badge, Card, Tooltip)
│   │   ├── charts/             # Chart components (PriceChart, BarChart, GaugeChart)
│   │   ├── stock/              # Stock-specific (StockHero, KeyMetrics, TechnicalAnalysis)
│   │   ├── market/             # Market-wide (FearGreedIndex, SectorDominance, MarketTicker)
│   │   └── layout/             # Navbar, Footer, Sidebar, Breadcrumbs
│   ├── pages/                  # Route-level components (mapped via React Router)
│   │   ├── Home.jsx            # Strona glowna — dashboard GPW
│   │   ├── StockDetail.jsx     # Profil spolki (/stock/:ticker)
│   │   ├── Screener.jsx        # Screener akcji
│   │   └── Dividends.jsx       # Kalendarz dywidend
│   ├── lib/
│   │   ├── utils.js            # Formattery (formatPrice, formatVolume, formatPercent)
│   │   ├── api.js              # fetch() calls do /api/* endpointow
│   │   └── constants.js        # Stale (sektory, indeksy, config)
│   ├── hooks/                  # Custom hooks (useStock, useWatchlist, usePortfolio)
│   ├── data/                   # Statyczne dane (gpw-companies.js itp.)
│   ├── styles/
│   │   └── globals.css         # CSS variables, base styles, Tailwind imports
│   ├── App.jsx                 # React Router setup, route definitions
│   └── main.jsx                # Entry point (ReactDOM.createRoot)
├── CLAUDE.md                   # Ten plik — design system & project guidelines
├── index.html                  # Vite HTML entry point
├── vite.config.js              # Vite config (plugins, proxy, aliases)
├── vercel.json                 # Vercel config (rewrites SPA → index.html, serverless)
├── tailwind.config.js          # Tailwind config
└── package.json
```

**Wazne konwencje:**

- `/api` folder MUSI byc w roocie (wymaganie Vercel Serverless Functions)
- `gpw-companies.js` i inne pliki danych → przenieS do `src/data/`
- Glowny komponent aplikacji (`wigmarkets.jsx`) → powinien byc w `src/` jako `App.jsx`
- Routing: React Router DOM z `<BrowserRouter>`, definiowany w `App.jsx`
- Vercel rewrites: `vercel.json` musi przekierowywac wszystkie non-API routes do `index.html` (SPA fallback)

## Konwencje nazewnictwa

- Komponenty: PascalCase (`StockHero.jsx`, `FearGreedIndex.jsx`)
- Utility functions: camelCase (`formatPrice`, `getChangeColor`)
- CSS classes: Tailwind utilities (nie custom CSS classes, chyba ze absolutnie konieczne)
- Pliki danych/lib: camelCase (`stockData.js`, `apiHelpers.js`)

## Formatowanie danych — utility functions

Zawsze uzywaj spojnych formatterow:

```js
// Ceny: "109,94 zl" — polska notacja (przecinek dziesietny), z waluta
formatPrice(109.94) // → "109,94 zl"

// Duze liczby: "127,6 mld zl", "134.9 mln", "1.2 mln"
formatLargeNumber(127600000000) // → "127,6 mld"
formatLargeNumber(134900000)    // → "134,9 mln"
formatLargeNumber(1200000)      // → "1,2 mln"

// Procenty: "+1,46%" z kolorem, "▲ +1,46%" ze strzalka
formatPercent(1.46)  // → "+1,46%"  // zielony
formatPercent(-1.40) // → "-1,40%"  // czerwony

// Wskazniki: "19,84x" (z "x" suffix dla mnoznikow)
formatMultiple(19.84) // → "19,84x"
```

**WAZNE:** Polska notacja liczbowa — przecinek jako separator dziesietny, kropka lub spacja jako separator tysiecy. "1 200 000" lub "1.200.000", NIE "1,200,000".

## Endpointy API

### `GET /api/stooq?symbol={symbol}`

Pojedyncza spolka — kurs, wolumen, zmiana.

**Parametry:** `symbol` (wymagany) — symbol stooq (np. `pkn`, `cdr`, `xau`)

**Odpowiedz:**
```json
{ "symbol": "pkn", "close": 106.5, "volume": 312000, "change24h": 1.23, "change7d": -0.45 }
```

### `GET /api/gpw-bulk?symbols={symbols}`

Batch — wiele spolek jednoczesnie (max 300).

**Parametry:** `symbols` (wymagany) — symbole stooq, rozdzielone przecinkami (np. `pkn,cdr,pko`)

**Odpowiedz:**
```json
{
  "pkn": { "close": 106.5, "volume": 312000, "change24h": 1.23, "change7d": -0.45, "sparkline": [104.2, 105.1, 106.5] },
  "cdr": { "close": 182.4, "volume": 423000, "change24h": -2.90, "change7d": -4.15, "sparkline": [190.0, 185.2, 182.4] }
}
```

**Cache:** `s-maxage=30, stale-while-revalidate=60`

### `GET /api/gpw-screener`

Pelna lista ~330 spolek GPW z cenami i fundamentals.

**Parametry:** brak

**Odpowiedz:**
```json
{
  "ok": true,
  "stocks": [{ "id": 1, "ticker": "ALE", "stooq": "ale", "name": "Allegro.eu", "sector": "E-commerce", "cap": 24600, "pe": 22.1, "div": null }],
  "quotes": { "ALE": { "close": 38.72, "volume": 389000, "change24h": -3.21, "change7d": 0 } },
  "ts": "2026-02-20T12:00:00.000Z"
}
```

**Cache:** `s-maxage=86400, stale-while-revalidate=3600` (24h)

### `GET /api/history?symbol={symbol}&interval={interval}`

Historia cen OHLC.

**Parametry:**
- `symbol` (wymagany) — symbol stooq
- `interval` (opcjonalny) — `1d` (domyslnie, zakres 1 rok) lub `1h` (zakres 7 dni)

**Odpowiedz:**
```json
{
  "prices": [
    { "date": "2025-01-01", "open": 103.0, "high": 105.5, "low": 102.8, "close": 104.2 },
    { "date": "2025-01-02", "open": 104.2, "high": 107.0, "low": 104.0, "close": 106.5 }
  ]
}
```

### `GET /api/intraday?symbol={symbol}`

Dane intraday (5-minutowe bary) z ostatniego dnia handlowego.

**Parametry:** `symbol` (wymagany) — symbol stooq

**Odpowiedz:**
```json
{
  "prices": [
    { "time": "09:00", "open": 104.0, "high": 104.5, "low": 103.8, "close": 104.2 },
    { "time": "09:05", "open": 104.2, "high": 104.8, "low": 104.1, "close": 104.6 }
  ]
}
```

### `GET /api/indices`

Indeksy GPW (WIG20, WIG, mWIG40, sWIG80).

**Parametry:** brak

**Odpowiedz:**
```json
[
  { "name": "WIG20", "value": 2341.87, "change24h": 0.82, "sparkline": [{ "date": "2025-01-01", "close": 2300.0 }] }
]
```

**Cache:** `s-maxage=30, stale-while-revalidate=60`

### `GET /api/fundamentals?symbol={symbol}`

Dane fundamentalne spolki (income statement, balance sheet, key statistics).

**Parametry:** `symbol` (wymagany) — symbol stooq

**Odpowiedz:**
```json
{
  "symbol": "pkn",
  "years": [2024, 2023, 2022, 2021],
  "annual": [{ "year": 2024, "revenue": 120000, "netIncome": 8500, "ebitda": 15000 }],
  "current": { "revenue": 120000, "netIncome": 8500, "ebitda": 15000, "eps": 12.5, "bookValue": 95.2, "netDebt": 25000 }
}
```

Wartosci revenue/netIncome/ebitda/netDebt w **milionach PLN**. EPS i bookValue w **PLN/akcje**.

### `GET /api/news?q={query}&limit={limit}`

Wiadomosci rynkowe z Google News RSS.

**Parametry:**
- `q` (opcjonalny) — fraza wyszukiwania (domyslnie: `GPW gielda akcje spolki`)
- `limit` (opcjonalny) — max wynikow (domyslnie: 10, max: 30)

**Odpowiedz:**
```json
{
  "items": [{ "title": "PKN Orlen...", "link": "https://...", "pubDate": "2026-02-20T10:00:00Z", "source": "Bankier.pl" }]
}
```

### `GET /api/reddit?tickers={tickers}`

Trendy z Reddit — wzmianki tickerow na r/inwestowanie i r/gielda.

**Parametry:** `tickers` (wymagany) — tickery GPW, rozdzielone przecinkami (np. `PKN,CDR,PKO`)

**Odpowiedz:**
```json
{ "ranked": [{ "ticker": "CDR", "mentions": 12 }, { "ticker": "PKN", "mentions": 5 }], "postsScanned": 350 }
```

**Cache:** `public, max-age=300` (5 min)

## Przeplyw danych

### Zrodla danych

Wszystkie dane rynkowe pochodza z **Yahoo Finance API**, proxy'owane przez serverless functions w `api/`:

1. **Yahoo Finance v8/chart** (bez auth) — dane cenowe: close, volume, OHLC, sparkline
2. **Yahoo Finance v7/quote** (wymaga crumb + cookie) — ceny + fundamentals (marketCap, P/E, divYield)
3. **Yahoo Finance v10/quoteSummary** (wymaga crumb + cookie) — income statement, balance sheet, EPS
4. **Google News RSS** — wiadomosci (parsowanie XML)
5. **Reddit JSON API** — trendy z r/inwestowanie, r/gielda

### Mapowanie symboli

Symbole stooq (lowercase, np. `pkn`) sa mapowane na symbole Yahoo Finance przez `api/yahoo-map.js`:

- Spolki GPW: `pkn` → `PKN.WA` (dodaje `.WA`)
- Indeksy: `wig20` → `^WIG20` (prefix `^`)
- Forex: `eurusd` → `EURUSD=X` (suffix `=X`)
- Surowce: `xau` → `GC=F`, `cl.f` → `CL=F` (jawne mapowanie)
- Specjalne: `dia` → `DIAG.WA`, `inp` → `INPST.AS` (niestandardowe)

### Persystencja lokalna (localStorage)

| Klucz | Dane |
|---|---|
| `theme` | `"dark"` / `"light"` — tryb ciemny/jasny |
| `watchlist` | JSON array tickerow obserwowanych |
| `portfolio_v1` | JSON array pozycji portfela |
| `price_alerts_v1` | JSON array alertow cenowych |

## Zmienne srodowiskowe

Projekt **nie wymaga** zadnych zmiennych srodowiskowych. Wszystkie API (Yahoo Finance, Google News, Reddit) sa publiczne i nie wymagaja kluczy API. Crumb auth do Yahoo jest pobierany dynamicznie w runtime.

Pliki `.env`, `.env.local`, `.env.*.local` sa w `.gitignore` na wypadek przyszlego uzycia.

## Anti-patterns — czego NIGDY nie robimy

### Design

- Kolorowe ikonki-badge'e (fioletowe "P", zielone "ZN" itp.) — nie komunikuja znaczenia, to wizualny szum
- Generyczne fonty: Inter, Roboto, Arial, system-ui jako primary font
- Agresywne CTA: "KUPUJ" / "SPRZEDAJ" w duzych kolorowych przyciskach — jestesmy portalem informacyjnym, nie brokerem. Sygnaly techniczne opisujemy jako "Pozytywny" / "Neutralny" / "Negatywny"
- Purple gradients na bialym tle — typowy "AI slop"
- Zbyt ciasne row heights w tabelach (<44px) — dane musza oddychac
- Ikony bez labeli — kazda ikona w navie musi miec tooltip lub tekst
- Emoji w UI — nigdy. Zawsze SVG ikony z Lucide React. Emoji sa niesporine cross-platform, niestylowalne i nieprofesjonalne
- Jednorodne dark mode — bez depth system wyglada plasko. Zawsze uzywaj min. 3 poziomow surface
- Zebra striping w tabelach — zamiast tego: hover state + subtle borders

### Kod

- Inline styles — uzywaj Tailwind classes
- Hardcoded kolory w JSX — zawsze CSS variables lub Tailwind config
- Brak obslugi null/undefined — jesli dane sa niedostepne, pokaz "b.d." (brak danych) w muted color, nie "—", "0", "null" czy pusty string
- `console.log` w produkcji — czysc przed deployem
- Gigantyczne komponenty — max ~200 linii na komponent, potem wydzielaj

### UX

- Wall of data bez hierarchii — kazda strona musi miec jasny focal point
- Brak disclaimerow przy sygnalach technicznych — zawsze dodawaj "Nie stanowi rekomendacji inwestycyjnej"
- Brak loading states — kazdy komponent z danymi musi miec skeleton/pulse loading
- Brak hover/active states — kazdy klikalny element musi miec feedback

## Wskazowki dla Claude Code

1. **Zanim zaczniesz kodowac** nowa strone lub komponent — najpierw opisz krotko plan (jakie sekcje, jaki layout, jakie dane). Potem koduj.
2. **Spojnosc > Kreatywnosc** — nowe elementy musza wygladac jak czesc tego samego systemu. Sprawdz istniejace komponenty zanim stworzysz nowy.
3. **Mobile-first responsywnosc** — zawsze mysl o tym, jak komponent wyglada na 375px. Tabele dostaja horizontal scroll, gridy stack sie do single-column.
4. **Dane po polsku** — labele, naglowki, opisy UI, buttony, placeholder tekst — wszystko po polsku. Komentarze w kodzie moga byc po angielsku.
5. **Testy wizualne** — po stworzeniu komponentu, sprawdz czy:
   - Hierarchia wizualna jest jasna (co jest najwazniejsze?)
   - Spacing jest konsystentny (nie "na oko")
   - Kolory semantyczne sa prawidlowe (zielony=wzrost, czerwony=spadek)
   - Font mono jest uzyty dla WSZYSTKICH wartosci liczbowych
   - Brak danych jest obsluzony ("b.d." zamiast crash)
6. **Pracuj na branchu wskazanym w instrukcjach** — nigdy nie pushuj bezposrednio na `main` bez jawnego pozwolenia
7. **Testuj build przed commitem** — uruchom `npm run build` i upewnij sie, ze nie ma bledow przed pushowaniem zmian
8. **Preferuj male, focused commity** — kazdy commit powinien robic jedna rzecz; opisuj "co" i "dlaczego"
9. **Zachowuj kompatybilnosc z Vercel** — API handlery musza eksportowac `default async function handler(req, res)`; file-based routing
10. **Symbole stooq lowercase, tickery uppercase** — zachowuj te konwencje we wszystkich nowych danych
11. **Nie modyfikuj `gpw-companies.js` bez potrzeby** — to master lista; zmiany wplywaja na caly projekt
12. **Formatuj liczby po polsku** — uzywaj formatterow z `utils.js` (locale `pl-PL`), nie `.toFixed()`

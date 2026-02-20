# WIGmarkets

Dashboard rynkowy w czasie rzeczywistym dla Giełdy Papierów Wartościowych w Warszawie (GPW). Aplikacja wyświetla notowania ~330 spółek GPW, surowców i par walutowych, z danymi pobieranymi z Yahoo Finance przez serverless API.

## Stack technologiczny

| Warstwa       | Technologia                                       |
|---------------|---------------------------------------------------|
| Frontend      | React 18 + Vite 5                                 |
| Język         | JavaScript / JSX (brak TypeScript)                |
| API           | Vercel serverless functions (`api/*.js`)           |
| Dane rynkowe  | Yahoo Finance v7/v8 API (przez proxy serverless)   |
| Wiadomości    | Google News RSS                                   |
| Reddit        | Reddit JSON API (r/inwestowanie, r/gielda)        |
| Styling       | Inline style objects w JSX (brak CSS framework)   |
| Hosting       | Vercel (z CDN cache na API)                       |
| PWA           | Web App Manifest + meta tagi                      |

Zależności npm: wyłącznie `react` i `react-dom` (+ `@vitejs/plugin-react` i `vite` jako devDeps).

## Komendy deweloperskie

```bash
npm install        # Instalacja zależności
npm run dev        # Serwer deweloperski (http://localhost:5173)
npm run build      # Produkcyjny build (output: dist/)
npm run preview    # Podgląd produkcyjnego buildu
```

## Mapa plików

### Root

| Plik                | Opis |
|---------------------|------|
| `index.html`        | Punkt wejścia HTML — ładuje czcionki (DM Sans, IBM Plex, JetBrains Mono), definiuje zmienne CSS, animacje flash/skeleton/toast/gauge |
| `package.json`      | Konfiguracja npm — React 18, Vite 5, brak testów ani lintera |
| `vite.config.js`    | Konfiguracja Vite z pluginem `apiDevPlugin()` — emuluje Vercel serverless w dev (przechwytuje `/api/*` i uruchamia handlery z `api/`) |
| `vercel.json`       | Rewrites Vercel: `/api/*` → handlery, `/spolka/*` i `/dywidendy` → `index.html` (SPA routing) |
| `gpw-companies.js`  | Master lista ~330 spółek GPW z tickerami, symbolami stooq, sektorami i przynależnością do indeksów (WIG20/mWIG40/sWIG80/WIG); eksportuje helpery `getByIndex()`, `getWIG140()`, `getByTicker()`, `getByStooq()` |
| `wigmarkets.jsx`    | Samodzielna wersja demo z mock danymi i symulowanymi tick'ami (bez API) — przydatna do pracy nad UI bez backendu |
| `.gitignore`        | Ignoruje `node_modules/`, `dist/`, `.env`, `.env.local`, `.env.*.local` |
| `README.md`         | Minimalna strona profilu GitHub |

### `src/` — Frontend

| Plik              | Opis |
|-------------------|------|
| `main.jsx`        | Główny komponent aplikacji (~830 linii) — SPA routing, fetching danych, tabela instrumentów, pasek nawigacji, sidebar, Fear&Greed gauge, top movers, statystyki rynku; renderuje się do `#root` |
| `api.js`          | Warstwa fetch — wrapper'y do wszystkich endpointów API (`fetchStooq`, `fetchBulk`, `fetchHistory`, `fetchHourly`, `fetchIntraday`, `fetchIndices`, `fetchFundamentals`, `fetchMarketNews`, `fetchRedditTrends`, `fetchDynamicList`) |
| `themes.js`       | Definicje `DARK_THEME` i `LIGHT_THEME` — obiekty z kolorami tła, tekstu, akcentu, bordera |
| `utils.js`        | Funkcje pomocnicze: `fmt()` (formatowanie PL), `changeColor()`, `changeFmt()` (format zmiany %), `getYahooSymbol()`, `calculateRSI()`, `isForex()`, `isCommodity()` |

### `src/data/`

| Plik              | Opis |
|-------------------|------|
| `stocks.js`       | Generuje tablicę `STOCKS` z `GPW_COMPANIES` (fallback gdy API niedostępne); definiuje `COMMODITIES` (10 surowców) i `FOREX` (50 par walutowych w grupach: PLN, Główne, EUR, GBP, Krzyżowe, Egzotyczne) |
| `constants.js`    | `SECTOR_AVERAGES` (średnie P/E, P/B, EV/EBITDA, div per sektor), `FEAR_COMPONENTS` (6 składników Fear&Greed), `FEAR_HISTORY` (30-dniowa historia), `FEAR_HISTORY_YEAR` (730-dniowa symulowana historia) |
| `dividends.js`    | Kalendarz dywidend GPW 2025/2026 — tablica `DIVIDENDS` z polami: ticker, divPerShare, divYield, exDate, payDate, recordDate, payoutRatio, streak, history |

### `src/hooks/`

| Plik                     | Opis |
|--------------------------|------|
| `useIsMobile.js`         | Hook responsywności — zwraca `true` gdy `window.innerWidth < 768` |
| `useKeyboardShortcuts.js`| Globalne skróty klawiszowe: `/` → fokus szukania, `j/k` → nawigacja, `Enter` → otwórz, `?` → pomoc, `Esc` → zamknij |
| `usePriceAlerts.js`      | System alertów cenowych — sprawdza progi przy każdej aktualizacji cen, wysyła toast i notyfikację przeglądarki; persystuje w `localStorage` pod kluczem `price_alerts_v1` |
| `usePriceFlash.js`       | Animacja flashowania wiersza — zwraca klasę CSS `price-flash-up`/`price-flash-down` gdy cena się zmieni |

### `src/components/`

| Plik                       | Opis |
|----------------------------|------|
| `StockPage.jsx`            | Dedykowana strona spółki (`/spolka/:TICKER`) — duży wykres (liniowy/candlestick, zakresy 1D–1Y), wskaźnik RSI, dane fundamentalne, wiadomości, link do Yahoo Finance |
| `StockModal.jsx`           | Modal na mobile z danymi spółki — mini-wykres, zmiana 24h/7d, wiadomości; otwiera się zamiast StockPage na urządzeniach mobilnych |
| `LargeChart.jsx`           | Komponent wykresu dla StockPage — obsługuje tryb liniowy i candlestick, SVG z tooltipem, zakresy 1D/1W/1M/3M/1Y |
| `MiniChart.jsx`            | Mniejszy wykres dla StockModal — SVG liniowy z wypełnieniem gradientowym |
| `Sparkline.jsx`            | Minimalistyczny sparkline SVG (7 dni) wyświetlany w tabeli instrumentów |
| `FearGauge.jsx`            | Wskaźnik Fear & Greed w formie półokrągłego gauge (SVG) z igłą animowaną, komponentami i historią |
| `FearGreedPage.jsx`        | Dedykowana strona Fear & Greed (`/indeks`) — pełny gauge, opisy składników, wykresy historyczne 1M/3M/6M/1Y/2Y |
| `MarketOverviewCards.jsx`  | Karty przeglądu rynku na stronie głównej — indeksy GPW (WIG20, WIG, mWIG40, sWIG80), top gainers/losers |
| `IndeksyView.jsx`          | Widok zakładki Indeksy — karty indeksów z sparkline i zmianą procentową |
| `ScreenerView.jsx`         | Screener zaawansowany — filtry P/E, div%, kapitalizacja, sektor, zmiana; sortowanie, eksport CSV, mini-wykresy RSI |
| `DividendPage.jsx`         | Strona dywidend (`/dywidendy`) — kalendarz, ranking stopy dywidendy, filtry sektorowe, historia wypłat |
| `NewsPage.jsx`             | Strona wiadomości (`/wiadomosci`) — newsy z Google News RSS, filtrowane po okresie (dziś/tydzień/miesiąc) |
| `PortfolioPage.jsx`        | Wirtualny portfel (`/portfolio`) — dodawanie pozycji, śledzenie P/L, persystencja w `localStorage` pod kluczem `portfolio_v1` |
| `AlertsModal.jsx`          | Modal zarządzania alertami cenowymi — dodawanie/usuwanie alertów z warunkami "powyżej"/"poniżej" |
| `ProfitCalculatorModal.jsx`| Kalkulator zysku/straty — symulacja P/L na podstawie ceny kupna, ilości i prowizji |
| `Heatmap.jsx`              | Heatmapa spółek GPW — widok alternatywny do tabeli, rozmiar proporcjonalny do kapitalizacji |
| `SectorDonut.jsx`          | Wykres donut rozkładu sektorowego spółek (sidebar) |
| `MarqueeTicker.jsx`        | Pasek przesuwających się notowań (ticker tape) na górze strony |
| `CompanyMonogram.jsx`      | Generuje monogram spółki (dwie litery) z kolorem per sektor; obsługuje loga z CDN (logo.clearbit.com) |
| `StockLogo.jsx`            | Wrapper na logo spółki — próbuje załadować z clearbit, fallback do CompanyMonogram |
| `WatchStar.jsx`            | Gwiazdka obserwowanych — toggle dodawania do watchlisty |
| `WIGMarketsLogo.jsx`       | Logo "WIGmarkets" w trzech rozmiarach (small/default/large) |
| `SkeletonRow.jsx`          | Szkieletowy wiersz tabeli (loading state) z animacją pulse |
| `ToastContainer.jsx`       | System notyfikacji toast — eksportuje funkcję `toast(message, type)` |
| `RSIGauge.jsx`             | Mini gauge wskaźnika RSI (SVG) na stronie spółki |
| `FinancialBarChart.jsx`    | Wykres słupkowy danych finansowych (przychody, zysk netto, EBITDA) |
| `FundamentalsSection.jsx`  | Sekcja danych fundamentalnych na StockPage — P/E, P/B, EPS, bookValue, porównanie z sektorem |

### `src/components/edukacja/`

| Plik                       | Opis |
|----------------------------|------|
| `EdukacjaHome.jsx`         | Strona główna sekcji edukacyjnej (`/edukacja`) — kategorie (Podstawy, Analiza, Strategia), popularne artykuły |
| `CategoryPage.jsx`         | Strona kategorii (`/edukacja/:kategoria`) — lista artykułów w danej kategorii |
| `ArticlePage.jsx`          | Strona artykułu (`/edukacja/:slug`) — renderuje sekcje z JSON, TOC, social share, powiązane artykuły |
| `ArticleCard.jsx`          | Karta artykułu (miniatura z tytułem, opisem, kategorią) |
| `ArticleIllustration.jsx`  | Generowane SVG ilustracje artykułów na podstawie tematu |
| `SectionRenderer.jsx`      | Renderuje sekcje artykułu z JSON — obsługuje typy: text, heading, list, quote, table, callout, code, interactive |
| `Breadcrumbs.jsx`          | Nawigacja breadcrumbs (Edukacja > Kategoria > Artykuł) |
| `CTABox.jsx`               | Call-to-action box w artykułach |
| `FAQSection.jsx`           | Sekcja FAQ z akordeonem |
| `Icon.jsx`                 | Biblioteka ikon SVG — ~40 ikon (chevron, star, bell, download, chart itp.) |
| `SvgIcons.jsx`             | Dodatkowe ikony SVG dla artykułów |
| `SocialShare.jsx`          | Przyciski udostępniania (Twitter, Facebook, LinkedIn, kopiuj link) |
| `TOC.jsx`                  | Table of Contents — automatycznie generowany spis treści artykułu |
| `RelatedArticles.jsx`      | Lista powiązanych artykułów na końcu strony |

### `src/components/edukacja/interactive/`

| Plik                    | Opis |
|-------------------------|------|
| `Calculator.jsx`        | Interaktywny kalkulator (np. zysku złożonego) osadzany w artykułach |
| `ComparisonTable.jsx`   | Interaktywna tabela porównawcza (np. brokerzy) |
| `DividendRanking.jsx`   | Ranking dywidendowy osadzany w artykułach |
| `QuizBlock.jsx`         | Quiz sprawdzający wiedzę czytelnika |
| `ScreenerPreview.jsx`   | Mini-screener osadzany w artykułach edukacyjnych |
| `StockTableWidget.jsx`  | Widget tabeli spółek osadzany w artykułach |

### `src/content/edukacja/`

| Plik             | Opis |
|------------------|------|
| `articles.js`    | Indeks artykułów — importuje 19 plików JSON i eksportuje `ARTICLES`, `getArticleBySlug()`, `getArticlesByCategory()` |
| `*.json` (×19)   | Artykuły edukacyjne w formacie JSON — każdy zawiera: slug, title, category, description, sections (z typami: text, heading, list, quote, table, callout, interactive) |

### `api/` — Serverless Functions

| Plik              | Opis |
|-------------------|------|
| `yahoo-map.js`    | Shared moduł mapowania symboli stooq → Yahoo Finance; eksportuje `toYahoo(stooq)` i `YF_HEADERS` |
| `stooq.js`        | Endpoint pojedynczej spółki — zwraca close, volume, change24h, change7d (Yahoo v8 chart API) |
| `gpw-bulk.js`     | Batch endpoint — pobiera dane wielu symboli równolegle w porcjach po 15 z retry i backoff |
| `gpw-screener.js` | Pełna lista ~330 spółek z cenami i fundamentals — dwutorowa strategia: v7/quote (z crumb auth) lub fallback v8/chart; CDN cache 24h |
| `history.js`      | Historia OHLC — 1 rok dziennie lub 7 dni godzinowo; endpoint do wykresów |
| `intraday.js`     | Dane intraday (5-minutowe bary) ostatniego dnia handlowego |
| `indices.js`      | Indeksy GPW (WIG20, WIG, mWIG40, sWIG80) — wartość, zmiana 24h, sparkline |
| `fundamentals.js` | Dane fundamentalne spółki — income statement, balance sheet, P/E, EPS, book value (v10/quoteSummary z crumb auth) |
| `news.js`         | Wiadomości rynkowe — parsuje Google News RSS, sortuje po dacie |
| `reddit.js`       | Trendy z Reddit — skanuje r/inwestowanie i r/gielda, liczy wzmianki tickerów |

### `public/`

| Plik             | Opis |
|------------------|------|
| `favicon.svg`    | Ikona favicon (SVG) |
| `icon.svg`       | Ikona PWA (SVG) |
| `manifest.json`  | Web App Manifest — konfiguracja PWA (standalone mode, kolory) |
| `robots.txt`     | Pozwala crawlerom na indeksowanie |
| `sitemap.xml`    | Mapa strony dla SEO |

## Przepływ danych

### Źródła danych

Wszystkie dane rynkowe pochodzą z **Yahoo Finance API**, proxy'owane przez serverless functions w `api/`:

1. **Yahoo Finance v8/chart** (bez auth) — dane cenowe: close, volume, OHLC, sparkline
2. **Yahoo Finance v7/quote** (wymaga crumb + cookie) — ceny + fundamentals (marketCap, P/E, divYield)
3. **Yahoo Finance v10/quoteSummary** (wymaga crumb + cookie) — income statement, balance sheet, EPS
4. **Google News RSS** — wiadomości (parsowanie XML)
5. **Reddit JSON API** — trendy z r/inwestowanie, r/gielda

### Mapowanie symboli

Symbole stooq (lowercase, np. `pkn`) są mapowane na symbole Yahoo Finance przez `api/yahoo-map.js`:

- Spółki GPW: `pkn` → `PKN.WA` (dodaje `.WA`)
- Indeksy: `wig20` → `^WIG20` (prefix `^`)
- Forex: `eurusd` → `EURUSD=X` (suffix `=X`)
- Surowce: `xau` → `GC=F`, `cl.f` → `CL=F` (jawne mapowanie)
- Specjalne: `dia` → `DIAG.WA`, `inp` → `INPST.AS` (niestandardowe)

### Cykl odświeżania

```
[Frontend: main.jsx]
    │
    ├── Na starcie: fetchDynamicList() → /api/gpw-screener
    │                                     ↓
    │                              Pełna lista ~330 spółek + ceny + fundamentals
    │                              (CDN cache 24h)
    │
    ├── Co 60 sekund: fetchBulk(symbols) → /api/gpw-bulk
    │                                       ↓
    │                                Yahoo v8/chart × N (batch po 15)
    │                                → prices{}, changes{} (change24h, change7d, volume, sparkline)
    │
    ├── Na otwarcie spółki: fetchHistory(sym) → /api/history → Yahoo v8/chart (1y daily / 7d hourly)
    │                        fetchFundamentals(sym) → /api/fundamentals → Yahoo v10/quoteSummary
    │                        fetchIntraday(sym) → /api/intraday → Yahoo v8/chart (5m interval)
    │
    ├── Zakładka Popularne: fetchRedditTrends() → /api/reddit → Reddit JSON (co 5 min)
    │
    └── Wiadomości: fetchMarketNews() → /api/news → Google News RSS
```

### Persystencja lokalna (localStorage)

| Klucz              | Dane                                    |
|--------------------|-----------------------------------------|
| `theme`            | `"dark"` / `"light"` — tryb ciemny/jasny |
| `watchlist`        | JSON array tickerów obserwowanych        |
| `portfolio_v1`     | JSON array pozycji portfela              |
| `price_alerts_v1`  | JSON array alertów cenowych              |

## Zmienne środowiskowe

Projekt **nie wymaga** żadnych zmiennych środowiskowych. Wszystkie API (Yahoo Finance, Google News, Reddit) są publiczne i nie wymagają kluczy API. Crumb auth do Yahoo jest pobierany dynamicznie w runtime.

Pliki `.env`, `.env.local`, `.env.*.local` są w `.gitignore` na wypadek przyszłego użycia.

## Routing (SPA)

Aplikacja używa `history.pushState()` + `popstate` listener (bez react-router):

| Ścieżka                     | Komponent          | Opis |
|------------------------------|--------------------|------|
| `/`                          | Home (main.jsx)    | Główny dashboard z tabelą instrumentów |
| `/spolka/:TICKER`            | StockPage          | Dedykowana strona spółki |
| `/indeks`                    | FearGreedPage      | Strona Fear & Greed Index |
| `/wiadomosci`                | NewsPage           | Wiadomości rynkowe |
| `/portfolio`                 | PortfolioPage      | Wirtualny portfel |
| `/dywidendy`                 | DividendPage       | Kalendarz dywidend |
| `/edukacja`                  | EdukacjaHome       | Strona główna edukacji |
| `/edukacja/:kategoria`       | CategoryPage       | Kategoria (podstawy/analiza/strategia) |
| `/edukacja/:slug`            | ArticlePage        | Artykuł edukacyjny |

Zakładki na stronie głównej (bez zmiany URL): Akcje GPW, Popularne, Indeksy, Surowce, Forex, Screener, Obserwowane.

## Endpointy API

### `GET /api/stooq?symbol={symbol}`

Pojedyncza spółka — kurs, wolumen, zmiana.

**Parametry:** `symbol` (wymagany) — symbol stooq (np. `pkn`, `cdr`, `xau`)

**Odpowiedź:**
```json
{ "symbol": "pkn", "close": 106.5, "volume": 312000, "change24h": 1.23, "change7d": -0.45 }
```

### `GET /api/gpw-bulk?symbols={symbols}`

Batch — wiele spółek jednocześnie (max 300).

**Parametry:** `symbols` (wymagany) — symbole stooq, rozdzielone przecinkami (np. `pkn,cdr,pko`)

**Odpowiedź:**
```json
{
  "pkn": { "close": 106.5, "volume": 312000, "change24h": 1.23, "change7d": -0.45, "sparkline": [104.2, 105.1, 106.5] },
  "cdr": { "close": 182.4, "volume": 423000, "change24h": -2.90, "change7d": -4.15, "sparkline": [190.0, 185.2, 182.4] }
}
```

**Cache:** `s-maxage=30, stale-while-revalidate=60`

### `GET /api/gpw-screener`

Pełna lista ~330 spółek GPW z cenami i fundamentals.

**Parametry:** brak

**Odpowiedź:**
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
- `interval` (opcjonalny) — `1d` (domyślnie, zakres 1 rok) lub `1h` (zakres 7 dni)

**Odpowiedź:**
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

**Odpowiedź:**
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

**Odpowiedź:**
```json
[
  { "name": "WIG20", "value": 2341.87, "change24h": 0.82, "sparkline": [{ "date": "2025-01-01", "close": 2300.0 }] }
]
```

**Cache:** `s-maxage=30, stale-while-revalidate=60`

### `GET /api/fundamentals?symbol={symbol}`

Dane fundamentalne spółki (income statement, balance sheet, key statistics).

**Parametry:** `symbol` (wymagany) — symbol stooq

**Odpowiedź:**
```json
{
  "symbol": "pkn",
  "years": [2024, 2023, 2022, 2021],
  "annual": [{ "year": 2024, "revenue": 120000, "netIncome": 8500, "ebitda": 15000 }],
  "current": { "revenue": 120000, "netIncome": 8500, "ebitda": 15000, "eps": 12.5, "bookValue": 95.2, "netDebt": 25000 }
}
```

Wartości revenue/netIncome/ebitda/netDebt w **milionach PLN**. EPS i bookValue w **PLN/akcję**.

### `GET /api/news?q={query}&limit={limit}`

Wiadomości rynkowe z Google News RSS.

**Parametry:**
- `q` (opcjonalny) — fraza wyszukiwania (domyślnie: `GPW giełda akcje spółki`)
- `limit` (opcjonalny) — max wyników (domyślnie: 10, max: 30)

**Odpowiedź:**
```json
{
  "items": [{ "title": "PKN Orlen...", "link": "https://...", "pubDate": "2026-02-20T10:00:00Z", "source": "Bankier.pl" }]
}
```

### `GET /api/reddit?tickers={tickers}`

Trendy z Reddit — wzmianki tickerów na r/inwestowanie i r/gielda.

**Parametry:** `tickers` (wymagany) — tickery GPW, rozdzielone przecinkami (np. `PKN,CDR,PKO`)

**Odpowiedź:**
```json
{ "ranked": [{ "ticker": "CDR", "mentions": 12 }, { "ticker": "PKN", "mentions": 5 }], "postsScanned": 350 }
```

**Cache:** `public, max-age=300` (5 min)

## Konwencje kodu

### Styling

- **Inline style objects** — wszystkie style jako obiekty JS w atrybucie `style={{}}`
- **Brak CSS-in-JS** ani klas CSS (poza kilkoma animacjami w `index.html`)
- Kolory z obiektu `theme` (ciemny/jasny) — nigdy hardcoded (chyba że w wigmarkets.jsx demo)
- Czcionki: `var(--font-ui)` (IBM Plex Sans / DM Sans) i `var(--font-mono)` (JetBrains Mono / IBM Plex Mono)
- Numeryczne wartości: `fontVariantNumeric: "tabular-nums"` dla wyrównania kolumn

### Język

- **UI w języku polskim** — etykiety, komunikaty, sektory, nazwy zakładek
- **Kod w języku angielskim** — nazwy zmiennych, funkcji, komponentów, komentarze (mieszane, część po polsku)
- Nazwy plików: camelCase dla `.js`, PascalCase dla `.jsx` komponentów

### Nazewnictwo

- Komponenty React: PascalCase (`StockPage`, `FearGauge`)
- Hooki: `use*` prefix (`useIsMobile`, `usePriceFlash`)
- Funkcje API: `fetch*` prefix (`fetchBulk`, `fetchHistory`)
- Stałe: UPPER_SNAKE_CASE (`STOCKS`, `COMMODITIES`, `FEAR_HISTORY`)
- Symbole stooq: zawsze lowercase (`pkn`, `cdr`, `xau`)
- Tickery GPW: zawsze uppercase (`PKN`, `CDR`, `XAU`)

### Struktura komponentów

- Brak react-router — routing ręczny przez `history.pushState()` + `getRouteFromPath()`
- Stan globalny w `main.jsx` (brak Redux/Context) — `prices`, `changes`, `watchlist`, `alerts`
- Dane per-strona ładowane w `useEffect` wewnątrz komponentu strony
- Mobile-first responsive — `useIsMobile()` hook, kolumny tabeli ukrywane na mobile

### API handlers

- Format: `export default async function handler(req, res)`
- Parametry z `req.query`
- Odpowiedź przez `res.status(code).json(data)`
- W dev mode: `vite.config.js` emuluje Vercel serverless (mock req/res)
- Retry z exponential backoff dla Yahoo Finance (status 429/5xx)

## Jak dodać nową funkcję

### Nowa strona / widok

1. Utwórz komponent w `src/components/NowaStrona.jsx`
2. W `src/main.jsx`:
   - Dodaj import komponentu
   - Dodaj case w `getRouteFromPath()` dla nowej ścieżki
   - Dodaj funkcję `navigateToNowaStrona` z `useCallback`
   - Dodaj rendering warunkowy `if (route.page === "nowa") return <NowaStrona />`
   - Opcjonalnie dodaj zakładkę/przycisk w nawigacji
3. W `vercel.json` — dodaj rewrite jeśli potrzebny SPA routing: `{ "source": "/nowa-sciezka", "destination": "/index.html" }`

### Nowy endpoint API

1. Utwórz plik `api/nowy-endpoint.js` z `export default async function handler(req, res) { ... }`
2. Endpoint będzie dostępny jako `/api/nowy-endpoint` (file-based routing Vercel)
3. W `vite.config.js` plugin `apiDevPlugin` automatycznie obsłuży nowy plik w dev
4. Dodaj wrapper fetch w `src/api.js`: `export async function fetchNowy() { ... }`
5. Użyj w komponencie przez import z `api.js`

### Nowy instrument / ticker

1. Dodaj wpis do `gpw-companies.js` (jeśli GPW) lub do `COMMODITIES`/`FOREX` w `src/data/stocks.js`
2. Upewnij się, że mapowanie stooq → Yahoo jest poprawne:
   - Standardowa spółka GPW: `ticker.toLowerCase() + ".WA"` (automatyczne)
   - Niestandardowy symbol: dodaj wpis w `api/yahoo-map.js` → `YAHOO_MAP`
   - Commodity/forex: dodaj jawne mapowanie w `YAHOO_MAP`

### Nowy artykuł edukacyjny

1. Utwórz plik JSON w `src/content/edukacja/` z polami: `slug`, `title`, `category` ("podstawy"/"analiza"/"strategia"), `description`, `sections`
2. Importuj w `src/content/edukacja/articles.js` i dodaj do tablicy `ARTICLES`
3. Artykuł automatycznie pojawi się w kategorii i będzie dostępny pod `/edukacja/:slug`

## Znane ograniczenia

- **Brak testów** — brak frameworka testowego (jest, vitest) i jakichkolwiek plików testowych
- **Brak lintera** — nie skonfigurowano ESLint ani Prettier
- **Brak TypeScript** — cały kod w JavaScript/JSX
- **Yahoo Finance rate limiting** — batch po 15 symboli z delay 100ms; retry z backoff; brak klucza API
- **Yahoo crumb auth** — może się zepsuć gdy Yahoo zmieni mechanizm; v7/v10 fallback'ują do v8/chart
- **Dane Fear & Greed są mock'owane** — `FEAR_COMPONENTS` i `FEAR_HISTORY` to hardcoded wartości, nie live dane
- **Dane dywidendowe statyczne** — `dividends.js` wymaga ręcznej aktualizacji
- **Brak SSR** — aplikacja jest w pełni client-side; SEO opiera się na `sitemap.xml` i `robots.txt`
- **Limit 300 symboli** w `gpw-bulk` — endpoint obcina listę do 300 pozycji
- **Brak websocketów** — dane odświeżane pollingiem (co 60s ceny, co 5min Reddit)
- **Brak auth** — aplikacja jest publiczna, portfolio i alerty tylko w localStorage przeglądarki
- **main.jsx ma ~830 linii** — monolityczny komponent z całym stanem aplikacji; nie jest podzielony na mniejsze moduły

## Zasady dla Claude Code

1. **Pracuj na branchu wskazanym w instrukcjach** — nigdy nie pushuj bezpośrednio na `main` bez jawnego pozwolenia
2. **Testuj build przed commitem** — uruchom `npm run build` i upewnij się, że nie ma błędów przed pushowaniem zmian
3. **Zachowuj istniejący styl** — inline style objects, brak klas CSS, kolory z obiektu `theme`, polskie etykiety UI, angielskie nazwy zmiennych
4. **Preferuj małe, focused commity** — każdy commit powinien robić jedną rzecz; opisuj "co" i "dlaczego"
5. **Nie dodawaj zależności bez potrzeby** — projekt celowo ma minimalne zależności (tylko React + Vite)
6. **Zachowuj kompatybilność z Vercel** — API handlery muszą eksportować `default async function handler(req, res)`; file-based routing
7. **Symbole stooq lowercase, tickery uppercase** — zachowuj tę konwencję we wszystkich nowych danych
8. **Nie modyfikuj `gpw-companies.js` bez potrzeby** — to master lista; zmiany wpływają na cały projekt
9. **Testuj na mobile** — UI jest responsive; sprawdzaj `useIsMobile()` hook przy nowych komponentach
10. **Formatuj liczby po polsku** — używaj `fmt()` z `utils.js` (locale `pl-PL`), nie `.toFixed()`

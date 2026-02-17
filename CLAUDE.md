# WIGmarkets — CLAUDE.md

A Polish stock market (GPW) dashboard built with React 18 + Vite. Displays real-time-like quotes for 12 major companies listed on the Warsaw Stock Exchange.

## Repository Structure

```
wigmarkets/
├── api/
│   └── stooq.js          # Serverless API handler — fetches data from stooq.pl
├── src/
│   └── main.jsx          # Active production entry point (React app)
├── wigmarkets.jsx         # Legacy/demo version of the component (simulated prices)
├── index.html            # HTML shell; lang="pl", mounts React at #root
├── package.json          # React 18, Vite 5 — no test or lint tooling
└── vite.config.js        # Vite config with @vitejs/plugin-react
```

## Development Commands

```bash
npm run dev       # Start Vite dev server (hot reload)
npm run build     # Production build → dist/
npm run preview   # Serve the production build locally
```

There is **no test runner and no linter configured**. There are no pre-commit hooks.

## Key Files

### `src/main.jsx` — Production App

The canonical entry point. Renders `<WigMarkets />` via `ReactDOM.createRoot`.

**Components:**
| Component | Purpose |
|---|---|
| `WigMarkets` | Root component; state management, filtering, sorting, pagination |
| `StockModal` | Click-through modal with historical chart and key metrics |
| `MiniChart` | SVG line chart with gradient fill (used inside StockModal) |
| `Sparkline` | Tiny 80×40 SVG sparkline for the 7-day column |
| `FearGauge` | Animated semicircle gauge for the GPW Fear & Greed Index |

**Data flow:**
- `STOCKS` — hardcoded baseline data for 12 companies (price, cap, P/E, dividend, etc.)
- `INDICES` — hardcoded index tickers (WIG20, WIG, mWIG40, sWIG80)
- On mount and every **60 seconds**, fetches live prices via `GET /api/stooq?symbol=<ticker>`
- `StockModal` fetches price history via `GET /api/history?symbol=<ticker>`
- Live prices override static `STOCKS.price`; static data is the fallback

**State in `WigMarkets`:**
| State | Type | Description |
|---|---|---|
| `prices` | `{ [ticker]: number }` | Live prices, initialized from STOCKS |
| `changes` | `{ [ticker]: { change24h, change7d } }` | Live % changes from API |
| `search` | `string` | Name/ticker search string |
| `filter` | `string` | Active sector filter (`"all"` or sector name) |
| `sortBy` | `string` | Active sort column key |
| `sortDir` | `"asc" \| "desc"` | Sort direction |
| `page` | `number` | Current pagination page (10 rows per page) |
| `selected` | `stock \| null` | Currently open modal stock |

### `wigmarkets.jsx` — Legacy Demo Version

A standalone component (no `ReactDOM.createRoot` call — it is a default export meant to be imported). Uses a **client-side `setInterval` every 2 seconds** to randomly fluctuate prices by ±0.1%. No API calls. Contains an extra `change1h` column absent from the production file. Use this as a reference for the original UI design.

### `api/stooq.js` — Serverless API Handler

Proxies requests to `https://stooq.pl/q/d/l/?s=<symbol>&i=d` (daily CSV).

Parses the CSV to compute:
- `close` — latest closing price
- `change24h` — % change vs previous day
- `change7d` — % change vs 5 trading days ago (index `-6`)

**Note:** `src/main.jsx` also calls `/api/history` but there is currently **no `api/history.js` file** — that endpoint is not implemented.

## Data Constants

### Tracked Tickers (TICKERS in main.jsx)
`pkn`, `pko`, `pzu`, `kgh`, `cdr`, `lpp`, `ale`, `peo`, `dnp`, `jsw`, `ccc`, `pge`

### STOCKS Array Fields
| Field | Description |
|---|---|
| `id` | Row number (1–12) |
| `ticker` | Uppercase ticker symbol |
| `name` | Full company name (Polish) |
| `sector` | Sector in Polish (e.g. "Banki", "Energetyka") |
| `price` | Static baseline price in PLN |
| `change24h` | 24h % change (static fallback) |
| `change7d` | 7-day % change (static fallback) |
| `cap` | Market cap in millions PLN |
| `vol` | Daily volume in thousands |
| `pe` | P/E ratio (`0` = no data) |
| `div` | Dividend yield % (`0.0` = none) |

### Fear & Greed Index Components (hardcoded)
Six components with static values 0–100: market momentum, volume strength, market breadth, GPW VIX volatility, put/call ratio, safe asset demand.

## Styling Conventions

All styles are **inline style objects** — no CSS files, no CSS modules, no styled-components.

**Color palette (GitHub dark-inspired):**
| Token | Hex | Usage |
|---|---|---|
| Background deep | `#010409` | Page background |
| Background mid | `#0d1117` | Cards, header, table |
| Background light | `#161b22` | Row hover, nested cards |
| Border | `#21262d` | All borders |
| Border light | `#30363d` | Input/select borders |
| Text primary | `#e6edf3` | Main text, tickers |
| Text secondary | `#c9d1d9` | Body text |
| Text muted | `#8b949e` | Labels, metadata |
| Accent blue | `#58a6ff` | Active sort, links, logo |
| Positive green | `#00c896` | Price up, gains |
| Negative red | `#ff4d6d` | Price down, losses |
| Warning yellow | `#ffd700` | Neutral/average values |

**Font:** `'IBM Plex Mono', 'Courier New', monospace` — applied globally on root `<div>`.

**Layout:** CSS Grid with `gridTemplateColumns: "1fr 280px"` for main content + sidebar. Max-width 1400px centered.

## Localization

The entire UI is in **Polish**:
- HTML `lang="pl"`
- Numbers formatted with `toLocaleString("pl-PL")` (comma decimal separator)
- Time with `toLocaleTimeString("pl-PL")`
- All labels, column headers, and placeholders are Polish

Do not translate UI text unless explicitly asked.

## Architecture Notes

- **No routing** — single-page, single view
- **No global state library** — all state in `WigMarkets` via `useState`
- **No CSS framework** — pure inline styles
- **No TypeScript** — plain JSX/JS throughout
- **No error boundaries** — API failures are caught with try/catch returning `null`; components handle `null` data gracefully
- The `wigmarkets.jsx` file at the root is **not imported anywhere** — it is a standalone reference/prototype

## Common Tasks

### Adding a new stock
1. Add an entry to the `STOCKS` array in `src/main.jsx` with all required fields
2. Add the lowercase ticker to the `TICKERS` array so live data is fetched
3. The sector filter and market stats update automatically

### Adding a new sidebar widget
Add a new `<div>` inside the right-column `<div>` in `WigMarkets` return, styled consistently with the existing card pattern (`background: "#0d1117"`, `border: "1px solid #21262d"`, `borderRadius: 16`, `padding: 20`).

### Implementing the missing `/api/history` endpoint
Create `api/history.js` following the same serverless handler pattern as `api/stooq.js`. It should return `{ prices: [{ date, close }] }` for the requested symbol. The `StockModal` in `main.jsx` expects `data.prices` as an array of `{ close }` objects.

### Changing the polling interval
In `src/main.jsx`, find the `setInterval(fetchAll, 60000)` call inside the `useEffect` and adjust the millisecond value.

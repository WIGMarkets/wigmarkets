# WIGmarkets

A real-time market data dashboard for the Warsaw Stock Exchange (GPW - Giełda Papierów Wartościowych).

## Project Overview

WIGmarkets displays live quotes for GPW-listed stocks and commodities, sourced from stooq.pl. Features include:
- Real-time price updates (polling every 60 seconds via stooq.pl API)
- GPW Fear & Greed Index gauge
- Stock/commodities table with sorting, filtering, and pagination
- Per-instrument modal with historical mini-chart (1W/1M/3M/1Y)
- Top movers and market stats sidebar

## Tech Stack

- **Frontend**: React 18 + Vite 5
- **Language**: JavaScript/JSX
- **API**: Vercel-style serverless functions (`api/*.js`)
- **Data source**: stooq.pl (CSV over HTTP)
- **No CSS framework** — all styling is inline JSX

## Project Structure

```
wigmarkets/
├── index.html          # HTML entry point
├── vite.config.js      # Vite config (React plugin)
├── package.json        # npm dependencies
├── wigmarkets.jsx      # Standalone demo component (static mock data, no API)
├── src/
│   └── main.jsx        # Main app entry point (live data from stooq.pl)
└── api/
    ├── stooq.js        # Serverless handler: latest price + 24h/7d change
    └── history.js      # Serverless handler: up to 365 days of OHLC history
```

## Development Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Production build (output: dist/)
npm run preview    # Preview production build locally
```

## Key Files

### `src/main.jsx`
The main application. Fetches live data from `/api/stooq` and `/api/history` for each ticker. Manages two tabs: GPW stocks (`STOCKS` array) and commodities (`COMMODITIES` array).

### `wigmarkets.jsx`
A self-contained demo version using static/mock data with simulated price ticks (no API calls). Useful for UI development without a backend.

### `api/stooq.js`
Proxies requests to `https://stooq.pl/q/d/l/?s={symbol}&i=d` (daily CSV). Returns:
```json
{ "symbol": "pkn", "close": 106.5, "volume": 312000, "change24h": 1.23, "change7d": -0.45 }
```

### `api/history.js`
Returns up to 365 days of closing prices for charting:
```json
{ "prices": [{ "date": "2025-01-01", "close": 104.2 }, ...] }
```

## Notes

- UI text is in Polish (the app targets Polish investors)
- No test framework is configured
- No linter (ESLint) is configured
- The `api/` directory follows Vercel's file-based routing convention
- Ticker symbols for stooq.pl use lowercase (e.g., `pkn`, `xau`, `cl.f`)

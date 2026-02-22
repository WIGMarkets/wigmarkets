/**
 * GPW Rankings configuration.
 *
 * Each ranking defines how to filter, sort, and display stocks.
 * Data comes from /api/gpw-screener (stocks + quotes) — no new API needed.
 *
 * Field mapping:
 *   Stock fields (from screener): ticker, stooq, name, sector, cap, pe, div
 *   Quote fields (merged at runtime): close, change24h, change7d, volume
 *   Static fields (from GPW_COMPANIES): index (WIG20, mWIG40, sWIG80)
 */

export const RANKINGS = [
  {
    slug: "najwieksze-wzrosty-dzis",
    title: "Największe wzrosty dziś",
    icon: "trending-up",
    description: "Spółki GPW z największym wzrostem kursu w dzisiejszej sesji giełdowej.",
    sortBy: "change24h",
    sortOrder: "desc",
    filterFn: (stock) => stock.change24h > 0,
    valueKey: "change24h",
    valueFormat: "percent",
    valueColor: "green",
    valueLabel: "ZMIANA",
    seoTitle: "Największe wzrosty na GPW dziś",
    seoDescription: "Które spółki GPW rosną najbardziej? Aktualna lista spółek z największym wzrostem kursu na Giełdzie Papierów Wartościowych.",
    related: ["najwieksze-spadki-dzis", "najwieksze-wzrosty-tydzien", "najaktywniejsze-spolki"],
  },
  {
    slug: "najwieksze-spadki-dzis",
    title: "Największe spadki dziś",
    icon: "trending-down",
    description: "Spółki GPW z największym spadkiem kursu w dzisiejszej sesji giełdowej.",
    sortBy: "change24h",
    sortOrder: "asc",
    filterFn: (stock) => stock.change24h < 0,
    valueKey: "change24h",
    valueFormat: "percent",
    valueColor: "red",
    valueLabel: "ZMIANA",
    seoTitle: "Największe spadki na GPW dziś",
    seoDescription: "Które spółki GPW tracą najbardziej? Lista spółek z największym spadkiem kursu na giełdzie.",
    related: ["najwieksze-wzrosty-dzis", "najwieksze-spadki-tydzien", "najaktywniejsze-spolki"],
  },
  {
    slug: "najwieksze-wzrosty-tydzien",
    title: "Największe wzrosty (7 dni)",
    icon: "arrow-up-right",
    description: "Spółki GPW z największym wzrostem kursu w ostatnim tygodniu.",
    sortBy: "change7d",
    sortOrder: "desc",
    filterFn: (stock) => stock.change7d > 0,
    valueKey: "change7d",
    valueFormat: "percent",
    valueColor: "green",
    valueLabel: "ZMIANA 7D",
    seoTitle: "Największe wzrosty na GPW w tym tygodniu",
    seoDescription: "Które spółki GPW wzrosły najbardziej w ostatnim tygodniu? Tygodniowy ranking wzrostów.",
    related: ["najwieksze-spadki-tydzien", "najwieksze-wzrosty-dzis", "najaktywniejsze-spolki"],
  },
  {
    slug: "najwieksze-spadki-tydzien",
    title: "Największe spadki (7 dni)",
    icon: "arrow-down-right",
    description: "Spółki GPW z największym spadkiem kursu w ostatnim tygodniu.",
    sortBy: "change7d",
    sortOrder: "asc",
    filterFn: (stock) => stock.change7d < 0,
    valueKey: "change7d",
    valueFormat: "percent",
    valueColor: "red",
    valueLabel: "ZMIANA 7D",
    seoTitle: "Największe spadki na GPW w tym tygodniu",
    seoDescription: "Które spółki GPW straciły najbardziej w ostatnim tygodniu? Tygodniowy ranking spadków.",
    related: ["najwieksze-wzrosty-tydzien", "najwieksze-spadki-dzis", "najaktywniejsze-spolki"],
  },
  {
    slug: "najwyzsze-dywidendy",
    title: "Najwyższe dywidendy",
    icon: "coins",
    description: "Spółki GPW z najwyższą stopą dywidendy. Ranking dla inwestorów szukających regularnego dochodu z akcji.",
    sortBy: "div",
    sortOrder: "desc",
    filterFn: (stock) => stock.div > 0,
    valueKey: "div",
    valueFormat: "dividendYield",
    valueColor: "green",
    valueLabel: "STOPA DYW.",
    seoTitle: "Najwyższe dywidendy na GPW — ranking spółek",
    seoDescription: "Które spółki GPW płacą najwyższe dywidendy? Aktualny ranking stopy dywidendy na Giełdzie Papierów Wartościowych.",
    related: ["najwieksze-spolki", "najtansze-spolki-pe", "spolki-wig20"],
  },
  {
    slug: "najwieksze-spolki",
    title: "Największe spółki GPW",
    icon: "building",
    description: "Ranking spółek GPW według kapitalizacji rynkowej. Największe i najważniejsze przedsiębiorstwa na polskiej giełdzie.",
    sortBy: "cap",
    sortOrder: "desc",
    filterFn: (stock) => stock.cap > 0,
    valueKey: "cap",
    valueFormat: "marketcap",
    valueColor: "neutral",
    valueLabel: "KAPITALIZACJA",
    seoTitle: "Największe spółki na GPW — ranking kapitalizacji",
    seoDescription: "Ranking największych spółek na Giełdzie Papierów Wartościowych według kapitalizacji rynkowej.",
    related: ["spolki-wig20", "najaktywniejsze-spolki", "najwyzsze-dywidendy"],
  },
  {
    slug: "najaktywniejsze-spolki",
    title: "Najaktywniejsze spółki",
    icon: "activity",
    description: "Spółki GPW z największym obrotem w dzisiejszej sesji. Pokazuje gdzie koncentruje się uwaga inwestorów.",
    sortBy: "volumePln",
    sortOrder: "desc",
    filterFn: (stock) => stock.volume > 0 && stock.close > 0,
    valueKey: "volumePln",
    valueFormat: "volume",
    valueColor: "neutral",
    valueLabel: "OBRÓT",
    seoTitle: "Najaktywniejsze spółki na GPW — ranking obrotu",
    seoDescription: "Które spółki GPW mają największy obrót? Ranking najbardziej aktywnych spółek na giełdzie.",
    related: ["najwieksze-wzrosty-dzis", "najwieksze-spadki-dzis", "najwieksze-spolki"],
  },
  {
    slug: "najtansze-spolki-pe",
    title: "Najtańsze spółki (P/E)",
    icon: "search",
    description: "Spółki GPW z najniższym wskaźnikiem P/E. Potencjalnie niedowartościowane akcje dla inwestorów wartościowych.",
    sortBy: "pe",
    sortOrder: "asc",
    filterFn: (stock) => stock.pe > 0 && stock.pe < 100,
    valueKey: "pe",
    valueFormat: "number",
    valueColor: "neutral",
    valueLabel: "P/E",
    seoTitle: "Najtańsze spółki na GPW — najniższy wskaźnik P/E",
    seoDescription: "Ranking spółek GPW z najniższym wskaźnikiem cena/zysk (P/E). Znajdź potencjalnie niedowartościowane akcje.",
    related: ["najdrozsze-spolki-pe", "najwyzsze-dywidendy", "najwieksze-spolki"],
  },
  {
    slug: "najdrozsze-spolki-pe",
    title: "Najdroższe spółki (P/E)",
    icon: "diamond",
    description: "Spółki GPW z najwyższym wskaźnikiem P/E. Spółki wzrostowe, za które rynek jest gotowy zapłacić premię.",
    sortBy: "pe",
    sortOrder: "desc",
    filterFn: (stock) => stock.pe > 0 && stock.pe < 500,
    valueKey: "pe",
    valueFormat: "number",
    valueColor: "neutral",
    valueLabel: "P/E",
    seoTitle: "Najdroższe spółki na GPW — najwyższy wskaźnik P/E",
    seoDescription: "Ranking spółek GPW z najwyższym wskaźnikiem P/E. Spółki wzrostowe na polskiej giełdzie.",
    related: ["najtansze-spolki-pe", "najwieksze-spolki", "najwyzsze-dywidendy"],
  },
  {
    slug: "spolki-wig20",
    title: "Spółki WIG20",
    icon: "trophy",
    description: "Skład indeksu WIG20 — 20 największych i najbardziej płynnych spółek na GPW.",
    sortBy: "cap",
    sortOrder: "desc",
    filterFn: (stock) => stock.index === "WIG20",
    valueKey: "close",
    valueFormat: "price",
    valueColor: "neutral",
    valueLabel: "KURS",
    seoTitle: "Skład WIG20 — lista spółek z cenami",
    seoDescription: "Aktualna lista spółek wchodzących w skład indeksu WIG20 z kursami i zmianami cen.",
    related: ["najwieksze-spolki", "najaktywniejsze-spolki", "najwyzsze-dywidendy"],
  },
];

/**
 * Merge stock data with quote data and index info for ranking use.
 * Returns a flat array of enriched stock objects.
 */
export function buildRankingData(liveStocks, prices, changes, indexMap) {
  return liveStocks
    .map((s) => {
      const quote = changes[s.ticker] || {};
      const close = prices[s.ticker] || 0;
      return {
        ...s,
        close,
        change24h: quote.change24h ?? 0,
        change7d: quote.change7d ?? 0,
        volume: quote.volume ?? 0,
        sparkline: quote.sparkline ?? null,
        volumePln: (quote.volume ?? 0) * close,
        index: indexMap?.[s.ticker] || null,
      };
    })
    .filter((s) => s.close > 0); // Exclude stocks with no price data
}

/**
 * Apply a ranking definition to enriched stock data.
 * Returns sorted and filtered array.
 */
export function applyRanking(ranking, enrichedStocks) {
  return enrichedStocks
    .filter(ranking.filterFn)
    .sort((a, b) => {
      const valA = a[ranking.sortBy] ?? 0;
      const valB = b[ranking.sortBy] ?? 0;
      return ranking.sortOrder === "desc" ? valB - valA : valA - valB;
    });
}

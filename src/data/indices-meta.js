// Master list of all tracked indices with metadata, descriptions, and slug mappings.
// Used by IndeksyPage, IndexDetailPage, and SEO components.

export const INDICES_META = [
  // ── Polskie indeksy GPW ─────────────────────────────────────────────
  {
    slug: "wig20",
    name: "WIG20",
    fullName: "Warszawski Indeks Giełdowy 20",
    stooq: "wig20",
    country: "PL",
    region: "Polska",
    color: "#3b82f6",
    components: 20,
    baseDate: "16 kwietnia 1994",
    baseValue: "1 000 punktów",
    description: [
      "WIG20 to flagowy indeks Giełdy Papierów Wartościowych w Warszawie, obejmujący 20 największych i najbardziej płynnych spółek notowanych na głównym rynku. Jest najważniejszym benchmarkiem polskiego rynku kapitałowego i stanowi punkt odniesienia dla funduszy inwestycyjnych, ETF-ów oraz kontraktów terminowych.",
      "Indeks jest obliczany od 16 kwietnia 1994 roku z wartością bazową 1 000 punktów. Skład jest rewizowany co kwartał na podstawie kapitalizacji rynkowej w wolnym obrocie oraz obrotów. WIG20 jest indeksem cenowym — nie uwzględnia dywidend, w odróżnieniu od WIG20TR (total return).",
      "W skład WIG20 wchodzą spółki z różnych sektorów — od bankowości (PKO BP, Pekao, mBank) przez energetykę (PKN Orlen, PGE) po technologie (CD Projekt, Allegro). Dominującą rolę odgrywają spółki z sektora finansowego, które stanowią ponad 40% wagi indeksu."
    ],
    relatedSlugs: ["wig", "mwig40", "swig80"],
  },
  {
    slug: "wig",
    name: "WIG",
    fullName: "Warszawski Indeks Giełdowy",
    stooq: "wig",
    country: "PL",
    region: "Polska",
    color: "#3b82f6",
    components: null,
    baseDate: "16 kwietnia 1991",
    baseValue: "1 000 punktów",
    description: [
      "WIG (Warszawski Indeks Giełdowy) to najstarszy i najszerszy indeks GPW, obejmujący wszystkie spółki notowane na rynku głównym, które spełniają bazowe kryteria uczestnictwa. Jest jedynym indeksem typu dochodowego na GPW — uwzględnia zarówno zmiany cen, jak i dochody z dywidend i praw poboru.",
      "Indeks jest obliczany nieprzerwanie od 16 kwietnia 1991 roku, czyli od pierwszej sesji giełdowej w historii nowoczesnej GPW. Jego wartość bazowa wynosi 1 000 punktów. WIG obejmuje ponad 300 spółek, co czyni go najlepszym miernikiem kondycji całego polskiego rynku akcji.",
      "Ze względu na metodologię dochodową, WIG lepiej oddaje rzeczywiste stopy zwrotu inwestorów niż indeksy cenowe (WIG20, mWIG40, sWIG80). Jest wykorzystywany jako benchmark dla funduszy otwartych inwestujących na szerokim rynku GPW."
    ],
    relatedSlugs: ["wig20", "mwig40", "swig80"],
  },
  {
    slug: "mwig40",
    name: "mWIG40",
    fullName: "Indeks średnich spółek GPW",
    stooq: "mwig40",
    country: "PL",
    region: "Polska",
    color: "#3b82f6",
    components: 40,
    baseDate: "31 grudnia 1997",
    baseValue: "1 000 punktów",
    description: [
      "mWIG40 to indeks grupujący 40 średnich spółek notowanych na GPW, które plasują się pod względem kapitalizacji i obrotów tuż za spółkami z WIG20. Indeks jest cenowy — nie uwzględnia dochodów z dywidend.",
      "Spółki z mWIG40 często określa się jako \"perły\" polskiej giełdy. Są to firmy o stabilnej pozycji rynkowej, ale wciąż z dużym potencjałem wzrostu. Wiele z nich to liderzy w swoich niszach — od spółek deweloperskich, przez firmy IT, po producenckie.",
      "Historycznie mWIG40 często przewyższał stopami zwrotu zarówno WIG20, jak i sWIG80 w dłuższych horyzontach inwestycyjnych. Wynika to z lepszego bilansu między płynnością a potencjałem wzrostu, co przyciąga zarówno inwestorów instytucjonalnych, jak i indywidualnych."
    ],
    relatedSlugs: ["wig20", "wig", "swig80"],
  },
  {
    slug: "swig80",
    name: "sWIG80",
    fullName: "Indeks małych spółek GPW",
    stooq: "swig80",
    country: "PL",
    region: "Polska",
    color: "#3b82f6",
    components: 80,
    baseDate: "31 grudnia 2002",
    baseValue: "1 000 punktów",
    description: [
      "sWIG80 to indeks obejmujący 80 mniejszych spółek z GPW, następujących po tych z WIG20 i mWIG40 pod względem kapitalizacji rynkowej. Jest indeksem cenowym — nie uwzględnia dywidend.",
      "Segment małych spółek (small cap) jest tradycyjnie bardziej zmienny niż blue chips, ale oferuje wyższy potencjał wzrostu. Wiele spółek z sWIG80 to firmy na wczesnym etapie ekspansji lub niszowi liderzy, którzy mogą awansować do mWIG40 w przyszłości.",
      "Inwestowanie w small caps wymaga dokładniejszej analizy ze względu na niższą płynność i mniejszą pokrywalność analityczną. sWIG80 jest popularny wśród inwestorów indywidualnych szukających okazji wzrostowych poza głównymi indeksami."
    ],
    relatedSlugs: ["wig20", "wig", "mwig40"],
  },

  // ── Indeksy amerykańskie ──────────────────────────────────────────
  {
    slug: "sp500",
    name: "S&P 500",
    fullName: "Standard & Poor's 500",
    stooq: "sp500",
    country: "US",
    region: "USA",
    color: "#3b82f6",
    components: 500,
    baseDate: "4 marca 1957",
    baseValue: "10 punktów (rebazowany)",
    description: [
      "S&P 500 to najważniejszy indeks giełdowy na świecie, grupujący 500 największych amerykańskich spółek publicznych pod względem kapitalizacji rynkowej. Obejmuje firmy notowane na NYSE i NASDAQ i jest powszechnie uznawany za najlepszy barometr amerykańskiej gospodarki.",
      "W skład indeksu wchodzą takie ikony jak Apple, Microsoft, Amazon, NVIDIA, Alphabet (Google) i Meta (Facebook). Łączna kapitalizacja spółek z S&P 500 przekracza 40 bln dolarów, co stanowi ponad 80% wartości całego rynku akcji w USA.",
      "S&P 500 jest benchmarkiem, do którego porównuje się niemal każdy fundusz inwestycyjny na świecie. Historycznie przynosił średnio ok. 10% rocznej stopy zwrotu (łącznie z dywidendami), co czyni go jednym z najbardziej efektywnych instrumentów długoterminowego inwestowania."
    ],
    relatedSlugs: ["nasdaq", "dow-jones"],
  },
  {
    slug: "nasdaq",
    name: "NASDAQ",
    fullName: "NASDAQ Composite",
    stooq: "nasdaq",
    country: "US",
    region: "USA",
    color: "#8b5cf6",
    components: null,
    baseDate: "5 lutego 1971",
    baseValue: "100 punktów",
    description: [
      "NASDAQ Composite to indeks obejmujący ponad 3 000 spółek notowanych na giełdzie NASDAQ — drugiej co do wielkości giełdzie papierów wartościowych na świecie. Jest silnie zdominowany przez sektor technologiczny, co czyni go kluczowym barometrem dla branży tech.",
      "W indeksie NASDAQ znajdują się takie firmy jak Apple, Microsoft, Amazon, Alphabet, Meta, Tesla i NVIDIA. Sektor technologiczny odpowiada za ponad 50% wagi indeksu, co sprawia, że NASDAQ jest znacznie bardziej zmienny niż S&P 500 — zarówno w fazie wzrostów, jak i spadków.",
      "NASDAQ Composite jest popularny wśród inwestorów szukających ekspozycji na innowacje i wzrost. W ostatnich dekadach wielokrotnie przewyższał stopy zwrotu tradycyjnych indeksów, choć kosztem wyższej zmienności — jak pokazał krach dot-com w 2000 roku, gdy indeks stracił ponad 75%."
    ],
    relatedSlugs: ["sp500", "dow-jones"],
  },
  {
    slug: "dow-jones",
    name: "Dow Jones",
    fullName: "Dow Jones Industrial Average",
    stooq: "djia",
    country: "US",
    region: "USA",
    color: "#0ea5e9",
    components: 30,
    baseDate: "26 maja 1896",
    baseValue: "40,94 punktów",
    description: [
      "Dow Jones Industrial Average (DJIA) to najstarszy i najbardziej rozpoznawalny indeks giełdowy na świecie, obliczany od 1896 roku. Obejmuje 30 największych i najbardziej wpływowych amerykańskich spółek blue chip, w tym Apple, Microsoft, Goldman Sachs, Johnson & Johnson, Coca-Colę i Walmart.",
      "W odróżnieniu od S&P 500, Dow Jones jest indeksem ważonym ceną akcji, a nie kapitalizacją rynkową. Oznacza to, że spółki z wyższą ceną za akcję mają większy wpływ na wartość indeksu, niezależnie od ich rzeczywistej wielkości rynkowej.",
      "Mimo że analitycy często krytykują metodologię Dow Jones jako przestarzałą, indeks pozostaje jednym z najczęściej cytowanych wskaźników w mediach finansowych. Jego zmiany są postrzegane jako sygnał nastrojów na Wall Street i w amerykańskiej gospodarce."
    ],
    relatedSlugs: ["sp500", "nasdaq"],
  },

  // ── Indeksy europejskie ──────────────────────────────────────────
  {
    slug: "dax",
    name: "DAX",
    fullName: "Deutscher Aktienindex",
    stooq: "dax",
    country: "DE",
    region: "Europa",
    color: "#f59e0b",
    components: 40,
    baseDate: "1 lipca 1988",
    baseValue: "1 000 punktów",
    description: [
      "DAX (Deutscher Aktienindex) to główny indeks giełdy frankfurckiej (Xetra), obejmujący 40 największych i najbardziej płynnych spółek notowanych w Niemczech. Od 2021 roku indeks został rozszerzony z 30 do 40 komponentów.",
      "W skład DAX wchodzą globalne koncerny takie jak SAP, Siemens, Allianz, Deutsche Telekom, BMW, Mercedes-Benz, Adidas i BASF. DAX jest indeksem dochodowym (total return) — uwzględnia reinwestycję dywidend, co czyni go porównywalnym z WIG na GPW.",
      "Jako największa gospodarka Europy, Niemcy i ich indeks DAX są kluczowym barometrem europejskiej koniunktury. DAX jest szczególnie wrażliwy na kondycję sektora przemysłowego i eksportowego, a także na kurs EUR/USD."
    ],
    relatedSlugs: ["ftse100", "cac40"],
  },
  {
    slug: "ftse100",
    name: "FTSE 100",
    fullName: "Financial Times Stock Exchange 100",
    stooq: "ftse",
    country: "GB",
    region: "Europa",
    color: "#ef4444",
    components: 100,
    baseDate: "3 stycznia 1984",
    baseValue: "1 000 punktów",
    description: [
      "FTSE 100 (wymawiane \"futsi\") to główny indeks Londyńskiej Giełdy Papierów Wartościowych (LSE), grupujący 100 największych spółek notowanych w Wielkiej Brytanii pod względem kapitalizacji rynkowej.",
      "W FTSE 100 dominują globalne korporacje z sektorów surowcowego (Shell, BP), finansowego (HSBC, Barclays), farmaceutycznego (AstraZeneca, GSK) i dóbr luksusowych (Unilever, Diageo). Wiele z tych firm generuje większość przychodów poza Wielką Brytanią, co czyni FTSE 100 bardziej globalnym niż brytyjskim indeksem.",
      "FTSE 100 jest indeksem cenowym — nie uwzględnia dywidend. Ze względu na wysoki udział spółek dywidendowych (średnia stopa dywidendy ok. 3-4%), indeks total return (FTSE 100 TR) daje znacznie wyższe stopy zwrotu w dłuższym horyzoncie."
    ],
    relatedSlugs: ["dax", "cac40"],
  },
  {
    slug: "cac40",
    name: "CAC 40",
    fullName: "Cotation Assistée en Continu 40",
    stooq: "cac40",
    country: "FR",
    region: "Europa",
    color: "#06b6d4",
    components: 40,
    baseDate: "31 grudnia 1987",
    baseValue: "1 000 punktów",
    description: [
      "CAC 40 to główny indeks giełdy paryskiej (Euronext Paris), obejmujący 40 największych spółek notowanych we Francji. Nazwa pochodzi od dawnego systemu notowań — Cotation Assistée en Continu (notowania ciągłe wspomagane komputerowo).",
      "W skład CAC 40 wchodzą globalne koncerny takie jak LVMH (Louis Vuitton), L'Oréal, TotalEnergies, Hermès, Airbus, BNP Paribas i Schneider Electric. Sektor dóbr luksusowych i kosmetyczny stanowi unikalną cechę tego indeksu — LVMH i Hermès to jedne z najcenniejszych firm w Europie.",
      "Francja jest drugą co do wielkości gospodarką UE, a CAC 40 jest ważnym komponentem paneuropejskiego indeksu Euro Stoxx 50. Indeks jest silnie powiązany z nastrojami w strefie euro i polityką Europejskiego Banku Centralnego."
    ],
    relatedSlugs: ["dax", "ftse100"],
  },

  // ── Indeksy azjatyckie ──────────────────────────────────────────
  {
    slug: "nikkei225",
    name: "Nikkei 225",
    fullName: "Nikkei Stock Average",
    stooq: "nikkei",
    country: "JP",
    region: "Azja",
    color: "#ec4899",
    components: 225,
    baseDate: "16 maja 1949",
    baseValue: "176,21 jenów",
    description: [
      "Nikkei 225 to główny indeks giełdy tokijskiej (Tokyo Stock Exchange), obejmujący 225 wybranych spółek japońskich. Jest najstarszym indeksem azjatyckim i jednym z najważniejszych barometrów gospodarki Japonii.",
      "W skład Nikkei 225 wchodzą takie firmy jak Toyota, Sony, SoftBank, Fast Retailing (Uniqlo), Keyence i Tokyo Electron. Indeks jest ważony cenami akcji (podobnie jak Dow Jones), co oznacza, że spółki z wysoką ceną za akcję mają nieproporcjonalnie duży wpływ na jego wartość.",
      "Nikkei 225 jest znany z dramatycznej historii — osiągnął rekordowe 38 916 punktów w grudniu 1989 roku podczas japońskiej bańki spekulacyjnej, po czym spadł o ponad 80%. Dopiero w 2024 roku indeks powrócił do historycznych szczytów, co zajęło ponad 34 lata."
    ],
    relatedSlugs: ["hang-seng"],
  },
  {
    slug: "hang-seng",
    name: "Hang Seng",
    fullName: "Hang Seng Index",
    stooq: "hsi",
    country: "HK",
    region: "Azja",
    color: "#f97316",
    components: 82,
    baseDate: "24 listopada 1969",
    baseValue: "100 punktów",
    description: [
      "Hang Seng Index (HSI) to główny indeks giełdy w Hongkongu (HKEX), obejmujący największe i najbardziej płynne spółki notowane na tym rynku. Jest kluczowym barometrem nastrojów inwestorów wobec Chin i całego regionu Azji-Pacyfiku.",
      "W indeksie Hang Seng dominują chińskie spółki technologiczne (Tencent, Alibaba, Meituan, JD.com), banki (HSBC, Bank of China, ICBC) oraz firmy nieruchomościowe. Od 2023 roku indeks rozszerzono do 82 komponentów, co lepiej oddaje strukturę rynku.",
      "Hang Seng jest silnie wrażliwy na politykę gospodarczą Chin, regulacje technologiczne oraz napięcia geopolityczne między USA a Chinami. W ostatnich latach indeks przeżywał znaczne wahania związane z restrykcjami regulacyjnymi wobec chińskiego sektora tech."
    ],
    relatedSlugs: ["nikkei225"],
  },
];

// ── Lookup helpers ─────────────────────────────────────────────────

export const INDICES_BY_SLUG = Object.fromEntries(
  INDICES_META.map(idx => [idx.slug, idx])
);

export const INDICES_BY_NAME = Object.fromEntries(
  INDICES_META.map(idx => [idx.name, idx])
);

// Ordered list of slugs for prev/next navigation
export const INDEX_SLUGS_ORDERED = INDICES_META.map(idx => idx.slug);

// Polish indices (have composition data)
export const PL_INDEX_NAMES = ["WIG20", "mWIG40", "sWIG80"];

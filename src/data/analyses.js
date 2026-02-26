/**
 * Fundamental analyses for top GPW companies.
 *
 * Each analysis contains: company profile, financial results, valuation,
 * dividend policy, risks, and summary with recommendation.
 *
 * 10 companies: PKN, PKO, KGH, SPL, PEO, PZU, ING, DNP, LPP, CDR
 * Last updated: 2026-02-26
 */

export const ANALYSES = [
  {
    ticker: "PKN",
    slug: "pkn-orlen",
    name: "PKN Orlen",
    title: "Analiza fundamentalna PKN Orlen — lider transformacji energetycznej w Polsce",
    author: "WIGmarkets Research",
    publishedAt: "2026-02-20",
    updatedAt: "2026-02-26",
    summary: "PKN Orlen to największy koncern paliwowo-energetyczny w Europie Środkowej po przejęciach Lotosu, PGNiG i Energi. Spółka realizuje ambitną strategię transformacji w kierunku zielonej energii, jednocześnie generując stabilne przepływy pieniężne z segmentu rafineryjnego i detalicznego.",
    recommendation: "Trzymaj",
    targetPrice: 72,
    currentMetrics: {
      pe: 7.2,
      pb: 0.85,
      evEbitda: 4.1,
      divYield: 5.8,
      roe: 11.8,
      debtToEquity: 0.42,
      marketCap: "68,5 mld zł",
    },
    sections: [
      {
        id: "profil",
        title: "Profil spółki",
        content: `PKN Orlen to zintegrowany koncern multienergetyczny, powstały z połączenia PKN Orlen, Grupy Lotos, PGNiG oraz Energi. Spółka jest największym przedsiębiorstwem w Europie Środkowej pod względem przychodów.

**Segmenty działalności:**
- **Rafineria i petrochemia** — 6 rafinerii w Polsce, Czechach i na Litwie o łącznej zdolności przerobu ponad 35 mln ton ropy rocznie
- **Detal** — ponad 3500 stacji paliw w Polsce, Niemczech, Czechach i krajach bałtyckich
- **Wydobycie** — produkcja ropy i gazu (po przejęciu PGNiG) z zasobami ok. 1,1 mld boe
- **Energetyka** — moce zainstalowane ponad 3,5 GW (po przejęciu Energi), rosnący portfel OZE
- **Handel gazem** — wiodący dostawca gazu w Polsce z portfelem kontraktów LNG

**Pozycja rynkowa:** Lider na rynku polskim z ponad 30% udziałem w sprzedaży paliw. Znacząca pozycja na rynku energii elektrycznej i gazu. W perspektywie do 2030 roku spółka planuje zainwestować ponad 320 mld zł w transformację energetyczną.`,
      },
      {
        id: "wyniki",
        title: "Wyniki finansowe",
        content: `Wyniki PKN Orlen za 2025 rok były solidne, choć niższe od rekordowego 2022 roku, co było oczekiwane po normalizacji marż rafineryjnych.

**Kluczowe dane za 2025:**
- Przychody: ~280 mld zł (spadek o 8% r/r, głównie przez niższe ceny ropy)
- EBITDA LIFO: ~32 mld zł (wzrost o 5% r/r dzięki poprawie w segmencie energetyki)
- Zysk netto: ~12 mld zł (stabilnie r/r)
- Capex: ~25 mld zł (intensywne inwestycje w OZE i petrochemię)
- FCF: ~8 mld zł

**Trendy:**
Spółka skutecznie dywersyfikuje źródła przychodów. Segment energetyczny rośnie najszybciej dzięki inwestycjom w farmy wiatrowe morskie i lądowe. Segment detaliczny utrzymuje stabilną marżę dzięki rosnącej sprzedaży pozapaliwowej (gastronomia, convenience).

Marże rafineryjne w 2025 r. ustabilizowały się na poziomie ok. 10-12 USD/bbl — powyżej historycznej średniej, ale znacznie poniżej szczytu z 2022 r. (ponad 20 USD/bbl).`,
      },
      {
        id: "wycena",
        title: "Wycena",
        content: `PKN Orlen jest notowany z istotnym dyskontem do europejskich spółek paliwowo-energetycznych, co częściowo wynika z postrzegania ryzyka politycznego i złożoności po serii przejęć.

**Porównanie wskaźnikowe:**

| Wskaźnik | PKN Orlen | Średnia sektora (Europa) |
|---|---|---|
| P/E | 7,2x | 9,5x |
| P/B | 0,85x | 1,2x |
| EV/EBITDA | 4,1x | 5,8x |
| Stopa dywidendy | 5,8% | 4,2% |

**Wycena DCF:** Przy WACC 9,5% i terminalnym tempie wzrostu 1,5%, model DCF sugeruje wartość godziwą na poziomie ok. 72-78 zł na akcję.

**Katalizatory wzrostu:**
- Realizacja synergii z przejęć (cel: 3,5 mld zł rocznie do 2027)
- Rozwój segmentu OZE (morskie farmy wiatrowe na Bałtyku)
- Potencjalne włączenie do indeksów ESG po poprawie ratingu`,
      },
      {
        id: "dywidenda",
        title: "Polityka dywidendowa",
        content: `PKN Orlen prowadzi przewidywalną politykę dywidendową, wypłacając minimum 3,50 zł na akcję rocznie, z tendencją do podwyższania dywidendy.

**Historia dywidend:**
- 2025 (za 2024): 4,15 zł/akcję (stopa ~5,8%)
- 2024 (za 2023): 4,00 zł/akcję
- 2023 (za 2022): 5,50 zł/akcję (rekordowa, z zysków po fuzji)
- 2022 (za 2021): 3,50 zł/akcję

**Polityka:** Spółka deklaruje utrzymanie dywidendy na poziomie minimum 3,50 zł/akcję z możliwością podwyżki w zależności od wyników. Payout ratio w ostatnich latach wynosił ok. 35-45%, co daje przestrzeń do dalszych podwyżek.

Przy obecnej cenie akcji stopa dywidendy wynosi ok. 5,8% — atrakcyjna na tle polskiego rynku i porównywalna z europejskimi spółkami surowcowymi.`,
      },
      {
        id: "ryzyka",
        title: "Czynniki ryzyka",
        content: `**Ryzyka makroekonomiczne:**
- Zmienność cen ropy naftowej i marż rafineryjnych — kluczowy driver wyników
- Kurs USD/PLN — przychody denominowane częściowo w USD, koszty w PLN
- Regulacje emisyjne UE (EU ETS) — rosnący koszt emisji CO₂

**Ryzyka operacyjne:**
- Integracja przejętych spółek (Lotos, PGNiG, Energa) — ryzyko opóźnień i przekroczenia kosztów
- Transformacja energetyczna — wymaga ogromnych nakładów inwestycyjnych z niepewnym zwrotem
- Konkurencja ze strony samochodów elektrycznych w segmencie detalicznym

**Ryzyka polityczne:**
- Spółka z udziałem Skarbu Państwa — ryzyko decyzji nieoptymalizujących wartość dla akcjonariuszy
- Regulacje cenowe na rynku energii i gazu mogą ograniczać marże
- Potencjalne zmiany w polityce dywidendowej pod wpływem potrzeb inwestycyjnych`,
      },
      {
        id: "podsumowanie",
        title: "Podsumowanie i rekomendacja",
        content: `PKN Orlen to stabilna spółka dywidendowa z atrakcyjną wyceną fundamentalną. P/E poniżej 8x i stopa dywidendy blisko 6% stanowią solidną podstawę inwestycyjną.

**Argumenty za (bull case):**
- Atrakcyjna wycena z istotnym dyskontem do europejskich rówieśników
- Stabilna i rosnąca dywidenda
- Dywersyfikacja źródeł przychodów zmniejsza cykliczność
- Duży portfel projektów OZE

**Argumenty przeciw (bear case):**
- Ryzyko polityczne jako spółka z udziałem SP
- Ogromne nakłady inwestycyjne mogą ograniczyć zwrot na kapitale
- Normalizacja marż rafineryjnych
- Potencjalne obciążenie ESG przez segment wydobywczy

**Rekomendacja: Trzymaj** z ceną docelową 72 zł. Spółka jest fair wyceniona z uwzględnieniem dywidendy. Warto trzymać jako stabilny składnik portfela dywidendowego. Kupno przy spadku kursu poniżej 60 zł.

*Niniejsza analiza nie stanowi rekomendacji inwestycyjnej w rozumieniu przepisów prawa. Decyzje inwestycyjne podejmowane są na własne ryzyko.*`,
      },
    ],
    seo: {
      title: "PKN Orlen — analiza fundamentalna 2026 | WIGmarkets",
      description: "Kompleksowa analiza fundamentalna PKN Orlen: wyniki finansowe, wycena, dywidenda, ryzyka. P/E 7,2x, stopa dywidendy 5,8%. Rekomendacja: Trzymaj.",
    },
  },
  {
    ticker: "PKO",
    slug: "pko-bp",
    name: "PKO BP",
    title: "Analiza fundamentalna PKO BP — największy bank w Polsce",
    author: "WIGmarkets Research",
    publishedAt: "2026-02-20",
    updatedAt: "2026-02-26",
    summary: "PKO Bank Polski to największy bank w Polsce pod względem aktywów, depozytów i liczby klientów. Spółka konsekwentnie generuje wysokie zyski dzięki środowisku podwyższonych stóp procentowych i rosnącej marży odsetkowej.",
    recommendation: "Kupuj",
    targetPrice: 72,
    currentMetrics: {
      pe: 8.5,
      pb: 1.45,
      evEbitda: null,
      divYield: 6.2,
      roe: 17.1,
      debtToEquity: null,
      marketCap: "72,3 mld zł",
    },
    sections: [
      {
        id: "profil",
        title: "Profil spółki",
        content: `PKO Bank Polski to wiodąca instytucja finansowa w Polsce z ponad 11 mln klientów detalicznych i ponad 400 tys. klientów korporacyjnych. Bank obsługuje ok. 1100 oddziałów i placówek.

**Pozycja rynkowa:**
- Lider w depozytach (udział ~18%) i kredytach (~18%)
- Największy bank hipoteczny w Polsce
- Wiodący gracz w bankowości mobilnej (aplikacja IKO — ponad 8 mln użytkowników)
- Istotny udział w bankowości korporacyjnej i inwestycyjnej

**Struktura grupy:**
Grupa kapitałowa obejmuje m.in. PKO TFI, PKO Leasing, PKO Faktoring oraz spółki ubezpieczeniowe. Dywersyfikacja przychodów obejmuje prowizje od funduszy, leasing, faktoring i ubezpieczenia.`,
      },
      {
        id: "wyniki",
        title: "Wyniki finansowe",
        content: `PKO BP notuje rekordowe wyniki dzięki utrzymaniu wysokich stóp procentowych w Polsce (referencyjna 5,75%).

**Kluczowe dane za 2025:**
- Wynik z tytułu odsetek: ~19,5 mld zł (+3% r/r)
- Wynik z tytułu prowizji: ~4,8 mld zł (+5% r/r)
- Koszty działania: ~9,2 mld zł (C/I ratio ~38%)
- Zysk netto: ~8,5 mld zł
- ROE: 17,1%

**Komentarz:**
Marża odsetkowa netto (NIM) pozostaje na podwyższonym poziomie ~3,7%, wspierana przez wysokie stopy procentowe i rosnący portfel kredytowy. Jakość portfela kredytowego jest dobra — wskaźnik NPL utrzymuje się poniżej 4%.

Kluczowym ryzykiem jest potencjalne obniżenie stóp procentowych przez RPP w 2026/2027, co obniżyłoby NIM. Bank jednak systematycznie poprawia efektywność kosztową i rozwija przychody prowizyjne.`,
      },
      {
        id: "wycena",
        title: "Wycena",
        content: `PKO BP jest notowany z umiarkowaną premią do polskiego sektora bankowego, co jest uzasadnione najwyższą rentownością i dominującą pozycją rynkową.

**Porównanie:**

| Wskaźnik | PKO BP | Średnia polskich banków |
|---|---|---|
| P/E | 8,5x | 7,8x |
| P/B | 1,45x | 1,2x |
| ROE | 17,1% | 14,5% |
| Stopa dywidendy | 6,2% | 5,5% |

**Wycena metodą Gordona:** Przy ROE 15% (normalizowane po obniżce stóp), koszcie kapitału 11% i stopie wzrostu 3%, uzasadniony P/B = 1,5x → cena docelowa ~72 zł.

**Katalizatory:** Konsolidacja sektora bankowego, rozwój bankowości cyfrowej, potencjalny program rządowego kredytu mieszkaniowego.`,
      },
      {
        id: "dywidenda",
        title: "Polityka dywidendowa",
        content: `PKO BP to jedna z najlepszych spółek dywidendowych na GPW. Bank regularnie wypłaca wysokie dywidendy.

**Historia:**
- 2025 (za 2024): 3,64 zł/akcję (stopa ~6,2%)
- 2024 (za 2023): 2,80 zł/akcję
- 2023 (za 2022): 1,75 zł/akcję (powrót po przerwie covidowej)

**Polityka:** Bank dąży do wypłaty 50-75% zysku netto. Przy obecnych rekordowych zyskach przestrzeń do dywidendy jest duża. Payout ratio za 2024 rok wyniósł ok. 52%.

Oczekujemy utrzymania dywidendy na poziomie co najmniej 3,50 zł/akcję w kolejnych latach, co przy obecnej cenie daje stopę dywidendy powyżej 6%.`,
      },
      {
        id: "ryzyka",
        title: "Czynniki ryzyka",
        content: `**Ryzyko stóp procentowych:**
Potencjalne obniżki stóp przez RPP stanowią główne ryzyko — każde 50 pb obniżki to szacowany spadek wyniku odsetkowego o ok. 1,0-1,2 mld zł rocznie.

**Ryzyko kredytów frankowych:**
Portfel kredytów CHF systematycznie maleje (ugody i wyroki sądowe), ale rezerwy na ten cel (ok. 8 mld zł skumulowane) stanowią istotne obciążenie.

**Ryzyko regulacyjne:**
- Wakacje kredytowe mogą być przedłużane
- Podatek bankowy (0,44% aktywów) ogranicza rentowność
- Potencjalne nowe wymogi kapitałowe (CRR III / Basel IV)

**Ryzyko polityczne:**
Skarb Państwa posiada ok. 29,4% akcji — ryzyko decyzji niezgodnych z interesem akcjonariuszy mniejszościowych.`,
      },
      {
        id: "podsumowanie",
        title: "Podsumowanie i rekomendacja",
        content: `PKO BP to solidny wybór dla inwestora szukającego ekspozycji na polski sektor bankowy. Dominująca pozycja rynkowa, wysokie ROE i atrakcyjna dywidenda kompensują ryzyka regulacyjne i polityczne.

**Bull case:** ROE powyżej 15% nawet po obniżkach stóp, rosnąca dywidenda, konsolidacja sektora
**Bear case:** Agresywne obniżki stóp, przedłużone wakacje kredytowe, wyższe rezerwy CHF

**Rekomendacja: Kupuj** z ceną docelową 72 zł. Spółka jest atrakcyjnie wyceniona przy P/E 8,5x i dywidendzie ponad 6%. Idealny komponent portfela dywidendowego.

*Niniejsza analiza nie stanowi rekomendacji inwestycyjnej w rozumieniu przepisów prawa.*`,
      },
    ],
    seo: {
      title: "PKO BP — analiza fundamentalna 2026 | WIGmarkets",
      description: "Analiza fundamentalna PKO BP: wyniki, wycena P/E 8,5x, P/B 1,45x, ROE 17,1%, dywidenda 6,2%. Rekomendacja: Kupuj.",
    },
  },
  {
    ticker: "KGH",
    slug: "kghm",
    name: "KGHM",
    title: "Analiza fundamentalna KGHM — globalny producent miedzi i srebra",
    author: "WIGmarkets Research",
    publishedAt: "2026-02-20",
    updatedAt: "2026-02-26",
    summary: "KGHM Polska Miedź to jeden z największych producentów miedzi i srebra na świecie. Spółka posiada kopalnie w Polsce, Chile i Kanadzie. Wyniki są silnie skorelowane z cenami miedzi, która korzysta na megatrendzie elektryfikacji i transformacji energetycznej.",
    recommendation: "Kupuj",
    targetPrice: 185,
    currentMetrics: {
      pe: 9.8,
      pb: 0.95,
      evEbitda: 5.2,
      divYield: 3.4,
      roe: 9.7,
      debtToEquity: 0.38,
      marketCap: "32,4 mld zł",
    },
    sections: [
      {
        id: "profil",
        title: "Profil spółki",
        content: `KGHM Polska Miedź jest globalnym producentem miedzi, srebra, złota i metali towarzyszących. Spółka jest drugim co do wielkości producentem srebra na świecie i jednym z czołowych producentów miedzi w Europie.

**Aktywa produkcyjne:**
- **Polska (LGOM):** Trzy kopalnie podziemne w Zagłębiu Miedziowym (Lubin, Polkowice-Sieroszowice, Rudna) — rdzeń działalności, produkcja ~440 tys. ton miedzi
- **Chile (Sierra Gorda):** Kopalnia odkrywkowa z potencjałem rozbudowy — ok. 55 tys. ton Cu
- **Kanada (Robinson, Sudbury):** Kopalnie wspierające dywersyfikację geograficzną

**Produkty:** Miedź (65% przychodów), srebro (15%), złoto (8%), reszta: nikiel, platyna, selen, molibden.

**Unikalna przewaga:** Jedyny zintegrowany producent od wydobycia po przetworzenie na terenie UE, z własnymi hutami i walcowniami.`,
      },
      {
        id: "wyniki",
        title: "Wyniki finansowe",
        content: `Wyniki KGHM za 2025 rok poprawiły się dzięki wzrostowi cen miedzi i osłabieniu PLN wobec USD.

**Kluczowe dane za 2025:**
- Przychody: ~32 mld zł (+12% r/r)
- EBITDA: ~10 mld zł (+18% r/r)
- Zysk netto: ~3,3 mld zł (+25% r/r)
- Produkcja miedzi: ~700 tys. ton (grupa)
- Koszt C1 (Polska): ~3 200 USD/t

**Ceny surowców kluczowe dla wyników:**
Miedź: ~9 500 USD/t (wzrost o 15% r/r dzięki popytowi na EV i infrastrukturę elektryczną)
Srebro: ~30 USD/oz (wzrost o 20% r/r)

Spółka systematycznie obniża koszty produkcji w Polsce i poprawia efektywność Sierra Gorda. Podatek od wydobycia miedzi i srebra w Polsce pozostaje istotnym obciążeniem (~2,5 mld zł rocznie).`,
      },
      {
        id: "wycena",
        title: "Wycena",
        content: `KGHM jest notowany z dyskontem do globalnych producentów miedzi (Freeport-McMoRan, Southern Copper), co wynika z niższej marżowości i ryzyka podatku wydobywczego.

**Porównanie:**

| Wskaźnik | KGHM | Freeport-McMoRan | Średnia sektora |
|---|---|---|---|
| P/E | 9,8x | 18x | 14x |
| P/B | 0,95x | 3,2x | 2,1x |
| EV/EBITDA | 5,2x | 8,5x | 7,0x |

**Wrażliwość na cenę miedzi:**
- Cu = 8 500 USD/t → zysk netto ~2,2 mld zł
- Cu = 9 500 USD/t → zysk netto ~3,3 mld zł
- Cu = 10 500 USD/t → zysk netto ~4,5 mld zł

Przy scenariuszu miedzi powyżej 10 000 USD/t (prawdopodobny w horyzoncie 2-3 lat dzięki deficytowi podażowemu), KGHM jest istotnie niedowartościowany.`,
      },
      {
        id: "dywidenda",
        title: "Polityka dywidendowa",
        content: `Polityka dywidendowa KGHM przewiduje wypłatę do 1/3 skonsolidowanego zysku netto, z zastrzeżeniem poziomu zadłużenia i potrzeb inwestycyjnych.

**Historia:**
- 2025 (za 2024): ~5,50 zł/akcję (stopa ~3,4%)
- 2024 (za 2023): 3,00 zł/akcję
- 2023 (za 2022): 1,50 zł/akcję

Dywidenda KGHM jest cykliczna i mocno zależy od cen surowców. W latach wysokich cen miedzi wypłaty są atrakcyjne, w dołkach cyklu mogą być pomijane. Spółka jednocześnie realizuje duży program inwestycyjny.`,
      },
      {
        id: "ryzyka",
        title: "Czynniki ryzyka",
        content: `**Ryzyko surowcowe:** Wyniki KGHM są silnie uzależnione od cen miedzi i srebra. Spadek ceny miedzi o 20% obniża zysk netto o ok. 40-50%.

**Podatek od wydobycia:** Podatek od miedzi i srebra stanowi ok. 8% przychodów z kopalń polskich. Potencjalne podwyżki stanowią ryzyko.

**Ryzyko geologiczne:** Kopalnie polskie działają na coraz większych głębokościach (ponad 1200 m), co zwiększa koszty i ryzyko zdarzeń sejsmicznych.

**Ryzyko walutowe:** Przychody w USD, koszty głównie w PLN — umocnienie złotego jest negatywne dla wyników.

**Sierra Gorda:** Kopalnia w Chile historycznie generowała straty, choć od 2023 r. poprawiła rentowność. Ryzyko polityczne w Chile (zmiany koncesyjne).

**Skarb Państwa:** 31,8% udział Skarbu Państwa — podobne ryzyka jak w PKN i PKO.`,
      },
      {
        id: "podsumowanie",
        title: "Podsumowanie i rekomendacja",
        content: `KGHM to unikalny play na miedź na europejskim rynku. Megatrend elektryfikacji (EV, OZE, sieci energetyczne) zapewnia strukturalny wzrost popytu na miedź.

**Bull case:** Miedź powyżej 10 000 USD/t, poprawa Sierra Gorda, nowe złoża
**Bear case:** Spadek cen miedzi, podwyżka podatku wydobywczego, problemy geologiczne

**Rekomendacja: Kupuj** z ceną docelową 185 zł. Przy obecnej wycenie P/B poniżej 1x i strukturalnym wzroście popytu na miedź, KGHM oferuje atrakcyjny stosunek ryzyka do zysku w horyzoncie 12-18 miesięcy.

*Niniejsza analiza nie stanowi rekomendacji inwestycyjnej w rozumieniu przepisów prawa.*`,
      },
    ],
    seo: {
      title: "KGHM — analiza fundamentalna 2026 | WIGmarkets",
      description: "Analiza fundamentalna KGHM Polska Miedź: wyniki, wycena P/E 9,8x, ekspozycja na cenę miedzi, dywidenda 3,4%. Rekomendacja: Kupuj.",
    },
  },
  {
    ticker: "SPL",
    slug: "santander-bp",
    name: "Santander Bank Polska",
    title: "Analiza fundamentalna Santander BP — najefektywniejszy bank na GPW",
    author: "WIGmarkets Research",
    publishedAt: "2026-02-20",
    updatedAt: "2026-02-26",
    summary: "Santander Bank Polska wyróżnia się najniższym wskaźnikiem koszty/dochody wśród polskich banków i konsekwentnie wysokim ROE. Spółka korzysta z synergii grupy Santander i rosnącej bankowości cyfrowej.",
    recommendation: "Trzymaj",
    targetPrice: 580,
    currentMetrics: {
      pe: 9.2,
      pb: 1.65,
      evEbitda: null,
      divYield: 5.5,
      roe: 18.0,
      debtToEquity: null,
      marketCap: "55,8 mld zł",
    },
    sections: [
      {
        id: "profil",
        title: "Profil spółki",
        content: `Santander Bank Polska (dawniej BZ WBK) jest piątym co do wielkości bankiem w Polsce. Należy do globalnej Grupy Santander — jednego z największych banków na świecie. Bank obsługuje ok. 5,5 mln klientów detalicznych i ponad 24 tys. klientów korporacyjnych.

**Przewagi konkurencyjne:**
- Najniższy wskaźnik C/I w polskim sektorze bankowym (~34%)
- Zaawansowana bankowość cyfrowa i mobilna
- Wsparcie grupy globalnej w technologii, procesach i zarządzaniu ryzykiem
- Silna pozycja w segmencie korporacyjnym i MŚP

**Linie biznesowe:**
Bankowość detaliczna, korporacyjna, inwestycyjna, leasing (Santander Leasing), faktoring, TFI, biuro maklerskie.`,
      },
      {
        id: "wyniki",
        title: "Wyniki finansowe",
        content: `Santander BP kontynuuje trend poprawy wyników, utrzymując najwyższą efektywność kosztową w sektorze.

**Dane za 2025:**
- Wynik z odsetek: ~10,5 mld zł
- Wynik z prowizji: ~2,8 mld zł
- C/I ratio: ~34% (najlepszy w sektorze)
- Zysk netto: ~6,1 mld zł
- ROE: ~18%

**Komentarz:**
Bank wyróżnia się bardzo dobrą dyscypliną kosztową i rosnącymi przychodami prowizyjnymi. Portfel kredytowy rośnie szybciej niż rynek (ok. 8% r/r), z dobrą jakością — NPL poniżej 3,5%. Ekspozycja na kredyty CHF jest znacznie mniejsza niż w PKO BP czy mBanku.`,
      },
      {
        id: "wycena",
        title: "Wycena",
        content: `Santander BP jest wyceniany z premią do sektora, co jest uzasadnione wyższym ROE i lepszą efektywnością kosztową.

| Wskaźnik | Santander BP | Średnia polskich banków |
|---|---|---|
| P/E | 9,2x | 7,8x |
| P/B | 1,65x | 1,2x |
| ROE | 18% | 14,5% |
| C/I | 34% | 42% |

Premia P/B jest uzasadniona podwyższonym ROE. Przy normalizacji stóp procentowych i spadku ROE do ~14%, fair value P/B to ~1,3x, co sugeruje obecną wycenę bliską wartości godziwej.`,
      },
      {
        id: "dywidenda",
        title: "Polityka dywidendowa",
        content: `Santander BP regularnie wypłaca dywidendę, dążąc do payout ratio 50-75%.

**Historia:**
- 2025 (za 2024): ~30 zł/akcję (stopa ~5,5%)
- 2024 (za 2023): 25,29 zł/akcję
- 2023 (za 2022): 17,37 zł/akcję

Rosnące zyski pozwalają na systematyczne podwyższanie dywidendy. Bank ma komfortowy poziom współczynników kapitałowych (TCR >19%), co daje przestrzeń do hojnych wypłat.`,
      },
      {
        id: "ryzyka",
        title: "Czynniki ryzyka",
        content: `**Ryzyko stóp procentowych:** Podobnie jak cały sektor — obniżki stóp obniżą NIM.

**Ryzyko większościowego akcjonariusza:** Grupa Santander posiada ~67% akcji. Teoretyczne ryzyko delistingu lub squeeze-outu, choć mało prawdopodobne.

**Ryzyko regulacyjne:** Podatek bankowy, potencjalne wakacje kredytowe, Basel IV.

**Konkurencja:** Rosnąca konkurencja fintechów i neobanków w segmencie detalicznym.`,
      },
      {
        id: "podsumowanie",
        title: "Podsumowanie i rekomendacja",
        content: `Santander BP to premium exposure na polski sektor bankowy — najefektywniejszy bank z najwyższym ROE. Wysoka jakość zarządzania i wsparcie grupy globalnej minimalizują ryzyko operacyjne.

**Rekomendacja: Trzymaj** z ceną docelową 580 zł. Spółka jest fair wyceniona przy obecnym poziomie. Atrakcyjna dywidenda (~5,5%) stanowi dodatkowy argument za trzymaniem pozycji.

*Niniejsza analiza nie stanowi rekomendacji inwestycyjnej w rozumieniu przepisów prawa.*`,
      },
    ],
    seo: {
      title: "Santander BP — analiza fundamentalna 2026 | WIGmarkets",
      description: "Analiza fundamentalna Santander Bank Polska: ROE 18%, C/I 34%, dywidenda 5,5%. Najefektywniejszy bank na GPW. Rekomendacja: Trzymaj.",
    },
  },
  {
    ticker: "PEO",
    slug: "pekao",
    name: "Bank Pekao",
    title: "Analiza fundamentalna Bank Pekao — stabilny gracz sektora bankowego",
    author: "WIGmarkets Research",
    publishedAt: "2026-02-20",
    updatedAt: "2026-02-26",
    summary: "Bank Pekao to drugi co do wielkości bank w Polsce. Spółka poprawia efektywność operacyjną i oferuje atrakcyjną dywidendę. Kontrolowany przez PZU i Skarb Państwa.",
    recommendation: "Trzymaj",
    targetPrice: 185,
    currentMetrics: {
      pe: 8.8,
      pb: 1.35,
      evEbitda: null,
      divYield: 7.1,
      roe: 15.4,
      debtToEquity: null,
      marketCap: "46,2 mld zł",
    },
    sections: [
      {
        id: "profil",
        title: "Profil spółki",
        content: `Bank Pekao (dawniej Bank Pekao SA, UniCredit) to drugi największy bank w Polsce. Od 2017 roku kontrolowany pośrednio przez Skarb Państwa (przez PZU i PFR, łącznie ~32%).

**Pozycja rynkowa:**
- Drugi pod względem aktywów (~400 mld zł)
- Silna marka historyczna (założony w 1929 r.)
- Ok. 5,8 mln klientów
- Ok. 700 placówek

**Segmenty:** Bankowość detaliczna, korporacyjna, private banking, leasing, faktoring, biuro maklerskie, TFI.`,
      },
      {
        id: "wyniki",
        title: "Wyniki finansowe",
        content: `**Dane za 2025:**
- Wynik z odsetek: ~11,2 mld zł
- Wynik z prowizji: ~3,1 mld zł
- C/I ratio: ~39% (poprawa z 42% w 2023)
- Zysk netto: ~5,3 mld zł
- ROE: ~15,4%

Pekao systematycznie poprawia efektywność kosztową, zbliżając się do PKO BP. Cyfryzacja procesów i redukcja sieci placówek przynoszą oszczędności. Bank ma konserwatywny profil ryzyka — mniej kredytów CHF niż konkurencja, niski NPL (~3,0%).`,
      },
      {
        id: "wycena",
        title: "Wycena",
        content: `| Wskaźnik | Pekao | Średnia sektora |
|---|---|---|
| P/E | 8,8x | 7,8x |
| P/B | 1,35x | 1,2x |
| ROE | 15,4% | 14,5% |
| Stopa dywidendy | 7,1% | 5,5% |

Wycena Pekao jest zbliżona do średniej sektora. Wyróżnikiem jest najwyższa stopa dywidendy — bank wypłaca ok. 75-90% zysku, co czyni go typowym income stock.`,
      },
      {
        id: "dywidenda",
        title: "Polityka dywidendowa",
        content: `Bank Pekao wyróżnia się najwyższym payout ratio wśród polskich banków.

**Historia:**
- 2025 (za 2024): ~12,50 zł/akcję (stopa ~7,1%)
- 2024 (za 2023): 14,90 zł/akcję
- 2023 (za 2022): 12,15 zł/akcję

Payout ratio: 75-90%. Bank deklaruje utrzymanie polityki wysokich dywidend, co wynika z niskich potrzeb kapitałowych (TCR >18%) i ograniczonego wzrostu portfela kredytowego.`,
      },
      {
        id: "ryzyka",
        title: "Czynniki ryzyka",
        content: `Główne ryzyka pokrywają się z sektorem bankowym: obniżki stóp procentowych, ryzyko regulacyjne, wakacje kredytowe.

**Specyficzne dla Pekao:**
- Pośrednia kontrola Skarbu Państwa (przez PZU + PFR) — potencjalny konflikt interesów
- Wolniejszy wzrost portfela kredytowego niż PKO BP i Santander BP
- Wyższe C/I ratio niż Santander BP`,
      },
      {
        id: "podsumowanie",
        title: "Podsumowanie i rekomendacja",
        content: `Pekao to klasyczna spółka dywidendowa o stabilnym, ale mało dynamicznym profilu. Atrakcyjna dywidenda powyżej 7% przy solidnych fundamentach.

**Rekomendacja: Trzymaj** z ceną docelową 185 zł. Spółka jest odpowiednia dla konserwatywnych inwestorów szukających wysokiej stopy dywidendy. Brakuje katalizatorów do istotnego wzrostu kursu.

*Niniejsza analiza nie stanowi rekomendacji inwestycyjnej w rozumieniu przepisów prawa.*`,
      },
    ],
    seo: {
      title: "Bank Pekao — analiza fundamentalna 2026 | WIGmarkets",
      description: "Analiza fundamentalna Bank Pekao: P/E 8,8x, dywidenda 7,1% (najwyższa wśród banków). Stabilna spółka dywidendowa. Rekomendacja: Trzymaj.",
    },
  },
  {
    ticker: "PZU",
    slug: "pzu",
    name: "PZU",
    title: "Analiza fundamentalna PZU — lider rynku ubezpieczeń w CEE",
    author: "WIGmarkets Research",
    publishedAt: "2026-02-20",
    updatedAt: "2026-02-26",
    summary: "PZU to największa grupa ubezpieczeniowo-finansowa w Europie Środkowo-Wschodniej. Spółka łączy działalność ubezpieczeniową z bankowością (kontroluje Bank Pekao i Alior Bank), tworząc unikalny model konglomeratu finansowego.",
    recommendation: "Kupuj",
    targetPrice: 55,
    currentMetrics: {
      pe: 8.0,
      pb: 1.75,
      evEbitda: null,
      divYield: 6.8,
      roe: 21.8,
      debtToEquity: null,
      marketCap: "39,8 mld zł",
    },
    sections: [
      {
        id: "profil",
        title: "Profil spółki",
        content: `PZU (Powszechny Zakład Ubezpieczeń) to lider rynku ubezpieczeniowego w Polsce z ponad 200-letnią tradycją. Grupa PZU to jedyny konglomerat finansowy w regionie CEE, obejmujący:

**Ubezpieczenia:**
- ~33% udział w polskim rynku ubezpieczeń majątkowych
- ~40% udział w rynku ubezpieczeń na życie
- Operacje w krajach bałtyckich i na Ukrainie

**Bankowość:**
- Bank Pekao (20% udziału w PZU) — drugi największy bank w Polsce
- Alior Bank (kontrola pakietowa) — bank specjalizujący się w bankowości detalicznej

**Zarządzanie aktywami:**
- TFI PZU — jeden z wiodących TFI w Polsce
- OFE PZU — jedyny z dużych OFE pod kontrolą ubezpieczyciela`,
      },
      {
        id: "wyniki",
        title: "Wyniki finansowe",
        content: `PZU generuje rekordowe wyniki dzięki kombinacji wysokich składek ubezpieczeniowych i zysków z bankowości.

**Dane skonsolidowane za 2025:**
- Składka przypisana brutto: ~28 mld zł (+8% r/r)
- Wynik netto ubezpieczeniowy: ~4,5 mld zł
- Wynik netto grupy (z bankami): ~5,0 mld zł
- ROE: 21,8%
- Combined Ratio (majątkowe): ~88% (doskonały)

**Segmenty wyniku:**
- Ubezpieczenia majątkowe: silne dzięki podwyżkom taryf OC/AC i niskiej szkodowości
- Ubezpieczenia na życie: stabilne z rosnącym udziałem unit-linked
- Bankowość: rekordowe zyski Pekao i Alior Bank (wysokie stopy procentowe)

Combined Ratio poniżej 90% świadczy o doskonałej dyscyplinie underwritingowej.`,
      },
      {
        id: "wycena",
        title: "Wycena",
        content: `PZU jest jednym z najtańszych dużych ubezpieczycieli w Europie przy jednocześnie najwyższym ROE.

| Wskaźnik | PZU | Allianz | AXA | Średnia sektora |
|---|---|---|---|---|
| P/E | 8,0x | 11x | 9x | 10x |
| P/B | 1,75x | 2,1x | 1,0x | 1,5x |
| ROE | 21,8% | 16% | 12% | 14% |
| Stopa dywidendy | 6,8% | 5,2% | 6,0% | 5,5% |

**Dyskonto wynika z:**
- Kontroli Skarbu Państwa (~34%)
- Złożoności konglomeratowej (ubezpieczenia + banki)
- Ryzyka regulacyjnego w Polsce

Przy ROE powyżej 20% i P/E poniżej 8x, PZU jest jednym z najatrakcyjniej wycenianych ubezpieczycieli w Europie.`,
      },
      {
        id: "dywidenda",
        title: "Polityka dywidendowa",
        content: `PZU jest jedną z najbardziej przewidywalnych spółek dywidendowych na GPW.

**Historia:**
- 2025 (za 2024): 3,00 zł/akcję (stopa ~6,8%)
- 2024 (za 2023): 2,80 zł/akcję
- 2023 (za 2022): 2,40 zł/akcję
- 2022 (za 2021): 2,00 zł/akcję

**Polityka:** Payout ratio 50-80% skonsolidowanego zysku netto. Spółka systematycznie podnosi dywidendę i ma ambicję płacenia co najmniej 2,50 zł/akcję rocznie. Przy obecnych zyskach jest przestrzeń do dalszego wzrostu.`,
      },
      {
        id: "ryzyka",
        title: "Czynniki ryzyka",
        content: `**Ryzyko katastroficzne:** Duże zdarzenia losowe (powodzie, huragany) mogą jednorazowo obniżyć wynik. PZU zarządza tym ryzykiem przez reasekurację.

**Ryzyko regulacyjne:** Potencjalne zmiany w taryfikacji OC/AC, limity cen polis.

**Ryzyko bankowe:** Obniżki stóp procentowych obniżą zyski Pekao i Alior Bank, co przekłada się na skonsolidowany wynik PZU.

**Ryzyko polityczne:** Kontrola SP — potencjalnie suboptymalne decyzje strategiczne.

**Złożoność konglomeratowa:** Rynek wycenia PZU z dyskontem konglomeratowym, bo trudno analizować jednocześnie ubezpieczenia i bankowość.`,
      },
      {
        id: "podsumowanie",
        title: "Podsumowanie i rekomendacja",
        content: `PZU to unikalna propozycja na GPW — ekspozycja na ubezpieczenia i bankowość w jednej spółce, z ROE powyżej 20% i dywidendą blisko 7%.

**Bull case:** Wzrost taryf OC/AC, redukcja dyskontu konglomeratowego, rozwój na rynkach CEE
**Bear case:** Obniżki stóp procentowych, katastroficzne zdarzenia, ingerencja polityczna

**Rekomendacja: Kupuj** z ceną docelową 55 zł. Spółka jest niedowartościowana przy P/E 8x i ROE powyżej 20%. Dywidenda blisko 7% stanowi solidny dochód pasywny.

*Niniejsza analiza nie stanowi rekomendacji inwestycyjnej w rozumieniu przepisów prawa.*`,
      },
    ],
    seo: {
      title: "PZU — analiza fundamentalna 2026 | WIGmarkets",
      description: "Analiza fundamentalna PZU: ROE 21,8%, P/E 8x, dywidenda 6,8%. Największy ubezpieczyciel w CEE. Rekomendacja: Kupuj.",
    },
  },
  {
    ticker: "ING",
    slug: "ing-bsk",
    name: "ING BSK",
    title: "Analiza fundamentalna ING Bank Śląski — innowator sektora bankowego",
    author: "WIGmarkets Research",
    publishedAt: "2026-02-20",
    updatedAt: "2026-02-26",
    summary: "ING Bank Śląski to jeden z najdynamiczniej rozwijających się banków w Polsce. Wyróżnia się innowacyjną bankowością mobilną, szybkim wzrostem portfela kredytowego i doskonałą jakością aktywów. Należy do globalnej Grupy ING.",
    recommendation: "Trzymaj",
    targetPrice: 310,
    currentMetrics: {
      pe: 10.5,
      pb: 1.85,
      evEbitda: null,
      divYield: 4.2,
      roe: 17.6,
      debtToEquity: null,
      marketCap: "38,5 mld zł",
    },
    sections: [
      {
        id: "profil",
        title: "Profil spółki",
        content: `ING Bank Śląski to szósty co do wielkości bank w Polsce, część holenderskiej Grupy ING (75% akcji). Bank obsługuje ok. 4,5 mln klientów detalicznych i ponad 500 tys. klientów firmowych.

**Wyróżniki:**
- Lider bankowości mobilnej — aplikacja Moje ING uznawana za jedną z najlepszych w Europie
- Najszybciej rosnący portfel kredytowy wśród dużych banków (+10-12% r/r)
- Doskonała jakość aktywów — NPL ~2,5% (najniższy wśród dużych banków)
- Innowacyjna oferta (Apple Pay jako pierwszy, płatności BLIK, Green Bond)

Bank nie ma ekspozycji na kredyty frankowe, co stanowi istotną przewagę.`,
      },
      {
        id: "wyniki",
        title: "Wyniki finansowe",
        content: `**Dane za 2025:**
- Wynik z odsetek: ~8,2 mld zł (+7% r/r, najszybciej w sektorze)
- Wynik z prowizji: ~2,2 mld zł
- C/I ratio: ~37%
- Zysk netto: ~3,7 mld zł
- ROE: 17,6%

Bank rośnie szybciej niż sektor dzięki przyciąganiu nowych klientów (ok. 500 tys. nowych klientów detalicznych rocznie). Brak rezerw na CHF to kluczowa przewaga finansowa nad konkurentami.`,
      },
      {
        id: "wycena",
        title: "Wycena",
        content: `ING BSK jest wyceniany z premią do sektora, co jest uzasadnione wyższym tempem wzrostu, brakiem obciążenia CHF i jakością zarządzania.

| Wskaźnik | ING BSK | Średnia sektora |
|---|---|---|
| P/E | 10,5x | 7,8x |
| P/B | 1,85x | 1,2x |
| ROE | 17,6% | 14,5% |
| Wzrost kredytów | +11% | +5% |

Premia jest uzasadniona, ale ogranicza dalszy potencjał wzrostu kursu. Kluczem jest utrzymanie dynamiki pozyskiwania klientów.`,
      },
      {
        id: "dywidenda",
        title: "Polityka dywidendowa",
        content: `ING BSK prowadzi umiarkowaną politykę dywidendową, przeznaczając większość zysku na wzrost organiczny.

**Historia:**
- 2025 (za 2024): ~12 zł/akcję (stopa ~4,2%)
- 2024 (za 2023): 10,50 zł/akcję
- 2023 (za 2022): 7,00 zł/akcję

Payout ratio: 40-50%. Bank reinwestuje więcej niż konkurenci w celu utrzymania szybkiego wzrostu.`,
      },
      {
        id: "ryzyka",
        title: "Czynniki ryzyka",
        content: `**Ryzyko stóp procentowych:** Podobne jak w całym sektorze.
**Ryzyko większościowego akcjonariusza:** Grupa ING (75%) — niski free float, ograniczona płynność.
**Ryzyko wyceny premium:** Wysoki P/E i P/B oznaczają, że rozczarowanie wynikami może spowodować istotny spadek kursu.
**Konkurencja w bankowości cyfrowej:** Fintechy i neobanki intensywnie konkurują o tę samą grupę klientów.`,
      },
      {
        id: "podsumowanie",
        title: "Podsumowanie i rekomendacja",
        content: `ING BSK to najwyższej jakości ekspozycja na polski sektor bankowy — bez ryzyka CHF, z najszybszym wzrostem i doskonałą bankowością cyfrową. Premia wycenowa jest uzasadniona, ale ogranicza potencjał wzrostu kursu.

**Rekomendacja: Trzymaj** z ceną docelową 310 zł. Spółka jest fair wyceniona. Warto trzymać jako quality holding, ale nie dopłacać powyżej 320 zł.

*Niniejsza analiza nie stanowi rekomendacji inwestycyjnej w rozumieniu przepisów prawa.*`,
      },
    ],
    seo: {
      title: "ING Bank Śląski — analiza fundamentalna 2026 | WIGmarkets",
      description: "Analiza fundamentalna ING BSK: ROE 17,6%, brak CHF, najszybszy wzrost portfela. Lider bankowości mobilnej na GPW. Rekomendacja: Trzymaj.",
    },
  },
  {
    ticker: "DNP",
    slug: "dino-polska",
    name: "Dino Polska",
    title: "Analiza fundamentalna Dino Polska — imperium handlowe małych miast",
    author: "WIGmarkets Research",
    publishedAt: "2026-02-20",
    updatedAt: "2026-02-26",
    summary: "Dino Polska to najdynamiczniej rozwijająca się sieć supermarketów w Polsce. Spółka konsekwentnie otwiera 350-400 nowych sklepów rocznie, dominując w segmencie proximity retail w małych i średnich miastach.",
    recommendation: "Kupuj",
    targetPrice: 520,
    currentMetrics: {
      pe: 24.5,
      pb: 6.8,
      evEbitda: 14.2,
      divYield: 0,
      roe: 27.8,
      debtToEquity: 0.55,
      marketCap: "47,2 mld zł",
    },
    sections: [
      {
        id: "profil",
        title: "Profil spółki",
        content: `Dino Polska to operator sieci supermarketów w formacie proximity (bliskości), z ponad 2500 sklepami w Polsce. Spółka została założona w 1999 roku przez Tomasza Biernackiego, który pozostaje większościowym akcjonariuszem (~51%).

**Model biznesowy:**
- Format: supermarkety o powierzchni 350-450 m², zlokalizowane w małych i średnich miastach
- Oferta: 5000 SKU z naciskiem na produkty świeże (mięso, warzywa, nabiał)
- Własne zaplecze: zakład mięsny, centrum dystrybucyjne, flota transportowa
- Ekspansja: 350-400 nowych sklepów rocznie (jak-za-jak model sklepu)

**Przewagi:**
- Jedyny operator tej skali w segmencie proximity w Polsce
- Verticalna integracja (własne mięso, logistyka) zapewnia kontrolę jakości i marży
- Niski koszt otwarcia sklepu (~2 mln zł) z szybkim payback (~3 lata)
- Biały plamy na mapie — wciąż ponad 50% gmin w Polsce bez sklepu Dino`,
      },
      {
        id: "wyniki",
        title: "Wyniki finansowe",
        content: `Dino utrzymuje imponujące tempo wzrostu, z dwucyfrową dynamiką przychodów i zysku.

**Dane za 2025:**
- Przychody: ~26 mld zł (+20% r/r)
- EBITDA: ~3,3 mld zł (+18% r/r)
- Zysk netto: ~1,9 mld zł (+15% r/r)
- Marża EBITDA: ~12,7%
- Nowe sklepy: ~380 (łącznie >2500)
- LFL (like-for-like): +8%

**Growth drivers:**
Dwucyfrowy wzrost pochodzi z kombinacji nowych sklepów (~12% r/r wzrost sieci) i wzrostu LFL (inflacja + traffic). Marża EBITDA jest stabilna na poziomie 12-13%, co świadczy o skalowalności modelu. Spółka generuje rosnący FCF mimo intensywnego capexu na ekspansję.`,
      },
      {
        id: "wycena",
        title: "Wycena",
        content: `Dino jest wyceniane z premią growth, co jest uzasadnione tempem ekspansji i przewidywalnością modelu.

| Wskaźnik | Dino | Żabka | Biedronka (JM) | Średnia retail |
|---|---|---|---|---|
| P/E | 24,5x | ~22x | 16x | 18x |
| EV/EBITDA | 14,2x | ~12x | 9x | 10x |
| Wzrost przychodów | +20% | +15% | +8% | +10% |
| Marża EBITDA | 12,7% | 8% | 7% | 8% |

**Uzasadnienie premii:**
- Wzrost 20% r/r przy marży EBITDA 12-13% — rzadka kombinacja w retail
- Runway na kolejne 5-7 lat ekspansji (cel: 4000+ sklepów)
- Wysoki ROIC (~25%), co oznacza, że każdy zainwestowany złoty generuje atrakcyjny zwrot

**Model DCF:** Przy WACC 9% i terminale growth 2%, wycena DCF daje ~520 zł/akcję.`,
      },
      {
        id: "dywidenda",
        title: "Polityka dywidendowa",
        content: `Dino nie wypłaca dywidendy — cały zysk reinwestuje w ekspansję sieci. Przy ROIC ~25% to optymalna strategia alokacji kapitału. Spółka tworzy wartość szybciej reinwestując zyski niż wypłacając dywidendy.

Oczekujemy, że Dino zacznie wypłacać dywidendę dopiero po osiągnięciu nasycenia rynku (prawdopodobnie po 2030 roku, powyżej 4000 sklepów).`,
      },
      {
        id: "ryzyka",
        title: "Czynniki ryzyka",
        content: `**Ryzyko nasycenia:** Spółka otwiera 350-400 sklepów rocznie — w pewnym momencie nowe lokalizacje będą kanibalizować istniejące.

**Ryzyko konkurencyjne:** Biedronka, Lidl i Żabka intensywnie rozbudowują sieci, szczególnie w małych miastach.

**Ryzyko kosztowe:** Rosnące koszty pracy (+12% r/r), energii i logistyki mogą erodować marżę.

**Ryzyko key-man:** Tomasz Biernacki kontroluje spółkę i podejmuje kluczowe decyzje. Brak jasnego planu sukcesji.

**Ryzyko regulacyjne:** Podatek od handlu detalicznego, ograniczenia niedzielnego handlu.`,
      },
      {
        id: "podsumowanie",
        title: "Podsumowanie i rekomendacja",
        content: `Dino to najlepsza historia wzrostu na GPW. Unikalna kombinacja 20% wzrostu przychodów, 25% ROIC i przewidywalnego modelu ekspansji czyni spółkę jedną z najciekawszych propozycji inwestycyjnych w regionie CEE.

**Bull case:** Przyspieszenie ekspansji, wejście do nowych formatów, wzrost marży dzięki skali
**Bear case:** Spowolnienie LFL, nasycenie rynku, presja kosztowa

**Rekomendacja: Kupuj** z ceną docelową 520 zł. Premium wycena jest uzasadniona tempem wzrostu i jakością modelu biznesowego. Spółka nadaje się do długoterminowego portfela growth.

*Niniejsza analiza nie stanowi rekomendacji inwestycyjnej w rozumieniu przepisów prawa.*`,
      },
    ],
    seo: {
      title: "Dino Polska — analiza fundamentalna 2026 | WIGmarkets",
      description: "Analiza fundamentalna Dino Polska: wzrost 20% r/r, ROIC 25%, 2500+ sklepów. Najlepsza historia wzrostu na GPW. Rekomendacja: Kupuj.",
    },
  },
  {
    ticker: "LPP",
    slug: "lpp",
    name: "LPP",
    title: "Analiza fundamentalna LPP — globalny lider polskiej mody",
    author: "WIGmarkets Research",
    publishedAt: "2026-02-20",
    updatedAt: "2026-02-26",
    summary: "LPP to największa polska firma odzieżowa z markami Reserved, Cropp, House, Mohito i Sinsay. Spółka dynamicznie ekspanduje na rynki zagraniczne i rośnie dwucyfrowo dzięki marce Sinsay.",
    recommendation: "Trzymaj",
    targetPrice: 18500,
    currentMetrics: {
      pe: 18.2,
      pb: 5.4,
      evEbitda: 10.8,
      divYield: 1.2,
      roe: 29.7,
      debtToEquity: 0.85,
      marketCap: "32,5 mld zł",
    },
    sections: [
      {
        id: "profil",
        title: "Profil spółki",
        content: `LPP to polska grupa odzieżowa, właściciel pięciu marek modowych: Reserved (premium casual), Cropp (young fashion), House (streetwear), Mohito (women's fashion) i Sinsay (value fashion). Spółka zarządza ponad 2300 sklepami w 40 krajach.

**Marki i pozycjonowanie:**
- **Sinsay** — motor wzrostu, najszybciej rosnąca marka (~40% r/r), segment value fashion
- **Reserved** — flagowa marka, pozycjonowana jako konkurent Zary, najwyższe przychody
- **Cropp** i **House** — stabilne marki dla młodzieży
- **Mohito** — moda damska, nisza premium-value

**Kluczowe rynki:** Polska (~35% przychodów), Rumunia, Czechy, Węgry, kraje bałtyckie, Bliski Wschód (ekspansja). Po wyjściu z Rosji w 2022 r. spółka z sukcesem przesunęła fokus na Europę Zachodnią i Bliski Wschód.`,
      },
      {
        id: "wyniki",
        title: "Wyniki finansowe",
        content: `**Dane za rok obrotowy 2024/25 (do stycznia 2025):**
- Przychody: ~20 mld zł (+18% r/r)
- EBITDA: ~4,2 mld zł (+15% r/r)
- Zysk netto: ~1,8 mld zł
- Marża EBITDA: ~21%
- Nowe sklepy: ~300 (głównie Sinsay)

**Segmenty:**
Sinsay odpowiada za ~35% przychodów i rośnie najszybciej (+40% r/r). Reserved generuje ~40% przychodów z umiarkowanym wzrostem (~8% r/r). Cropp, House i Mohito to stabilne ~25%.

Spółka efektywnie zarządza zapasami (rotacja ~80 dni) i generuje rosnący FCF pomimo intensywnego capexu na ekspansję Sinsay.`,
      },
      {
        id: "wycena",
        title: "Wycena",
        content: `LPP jest wyceniane na poziomie zbliżonym do europejskich spółek odzieżowych o podobnym tempie wzrostu.

| Wskaźnik | LPP | Inditex (Zara) | H&M | Średnia sektora |
|---|---|---|---|---|
| P/E | 18,2x | 25x | 18x | 20x |
| EV/EBITDA | 10,8x | 14x | 9x | 11x |
| Marża EBITDA | 21% | 22% | 12% | 16% |
| Wzrost | +18% | +10% | +5% | +10% |

LPP jest tańsze niż Inditex przy wyższym tempie wzrostu. Dyskonto wynika z mniejszej skali i ryzyka geopolitycznego (bliskość rynków wschodnich).`,
      },
      {
        id: "dywidenda",
        title: "Polityka dywidendowa",
        content: `LPP prowadzi symboliczną politykę dywidendową — ok. 200 zł/akcję (stopa ~1,2%). Spółka preferuje reinwestycję w ekspansję Sinsay, co przy ROE ~30% jest optymalną strategią.

Dywidenda ma charakter bardziej symboliczny i stanowi niewielką część całkowitego zwrotu dla akcjonariusza (który jest generowany głównie przez wzrost kursu).`,
      },
      {
        id: "ryzyka",
        title: "Czynniki ryzyka",
        content: `**Ryzyko modowe:** Branża odzieżowa jest cykliczna i podlega zmiennym trendom. Błędna kolekcja może obniżyć marżę.

**Ryzyko walutowe:** Przychody w wielu walutach (PLN, RON, CZK, HUF, EUR), koszty zakupów w USD i CNY.

**Ryzyko geopolityczne:** Bliskość rynków wschodnich (Ukraina, kraje bałtyckie) — ryzyko destabilizacji.

**Ryzyko konkurencyjne:** Intensywna konkurencja ze strony Shein, Temu i fast fashion online.

**Ryzyko ESG:** Branża fast fashion pod rosnącą presją regulacyjną (dyrektywa UE o zrównoważonym tekstyliach).`,
      },
      {
        id: "podsumowanie",
        title: "Podsumowanie i rekomendacja",
        content: `LPP to polski sukces w branży odzieżowej — spółka z globalnym zasięgiem, silnymi markami i imponującym tempem wzrostu dzięki Sinsay.

**Bull case:** Ekspansja Sinsay w Europie Zachodniej, poprawa marży Reserved, potencjał Bliskiego Wschodu
**Bear case:** Spowolnienie konsumpcji, konkurencja ultra-fast fashion (Shein), ryzyko walutowe

**Rekomendacja: Trzymaj** z ceną docelową 18 500 zł. Spółka jest fair wyceniona z uwzględnieniem tempa wzrostu. Warto trzymać w portfelu growth, ale nie dopłacać powyżej 19 000 zł.

*Niniejsza analiza nie stanowi rekomendacji inwestycyjnej w rozumieniu przepisów prawa.*`,
      },
    ],
    seo: {
      title: "LPP — analiza fundamentalna 2026 | WIGmarkets",
      description: "Analiza fundamentalna LPP: wzrost 18% r/r, marża EBITDA 21%, ROE 30%. Reserved, Sinsay, Cropp. Rekomendacja: Trzymaj.",
    },
  },
  {
    ticker: "CDR",
    slug: "cd-projekt",
    name: "CD Projekt",
    title: "Analiza fundamentalna CD Projekt — twórca Wiedźmina i Cyberpunka",
    author: "WIGmarkets Research",
    publishedAt: "2026-02-20",
    updatedAt: "2026-02-26",
    summary: "CD Projekt to najsłynniejsza polska spółka gamingowa, twórca serii Wiedźmin i Cyberpunk 2077. Spółka pracuje nad nowym Wiedźminem (Polaris) i sequelem Cyberpunka (Orion). GOG.com to dodatkowa linia biznesowa — platforma dystrybucji gier.",
    recommendation: "Trzymaj",
    targetPrice: 210,
    currentMetrics: {
      pe: 42.0,
      pb: 4.5,
      evEbitda: 35.0,
      divYield: 0.5,
      roe: 10.7,
      debtToEquity: 0.02,
      marketCap: "20,8 mld zł",
    },
    sections: [
      {
        id: "profil",
        title: "Profil spółki",
        content: `CD Projekt to polska spółka gamingowa, twórca dwóch flagowych serii: Wiedźmin (The Witcher) i Cyberpunk 2077. Obok studia deweloperskiego, spółka prowadzi GOG.com — platformę dystrybucji cyfrowej gier.

**Pipeline gier:**
- **Polaris (Wiedźmin 4)** — nowa saga Wiedźmina na Unreal Engine 5, w fazie pełnej produkcji
- **Orion (Cyberpunk sequel)** — wczesna faza pre-produkcji
- **Sirius** — spin-off Wiedźmina (studio The Molasses Flood)
- **Hadar** — nowa marka IP (wczesna koncepcja)

**GOG.com:**
Platforma z ok. 3% udziałem w rynku dystrybucji cyfrowej PC (dominuje Steam ~75%). Koncentracja na grach bez DRM i klasyce.

**Przewagi:** Najsilniejszy brand gamingowy w Polsce, globalny zasięg, zero długu, wysoka marża na nowych premierach (>70%).`,
      },
      {
        id: "wyniki",
        title: "Wyniki finansowe",
        content: `CD Projekt jest w fazie inwestycyjnej — pomiędzy dużymi premierami. Wyniki za 2025 odzwierciedlają sprzedaż katalogu (Wiedźmin 3, Cyberpunk 2077 + DLC Phantom Liberty).

**Dane za 2025:**
- Przychody: ~920 mln zł (spadek r/r, brak nowej premiery)
- EBITDA: ~340 mln zł
- Zysk netto: ~280 mln zł
- Gotówka netto: ~1,2 mld zł (zero długu)

**Struktura przychodów:**
- Cyberpunk 2077 + Phantom Liberty: ~55% (tail sales)
- Seria Wiedźmin: ~25%
- GOG.com: ~20%

Kluczowe jest, że CD Projekt generuje zyski nawet pomiędzy premierami dzięki silnej katalogowej sprzedaży. Cyberpunk 2077 sprzedał ponad 30 mln kopii łącznie, Wiedźmin 3 ponad 50 mln.`,
      },
      {
        id: "wycena",
        title: "Wycena",
        content: `CD Projekt jest wyceniany na zasadzie przyszłych premier, a nie bieżących wyników. P/E 42x jest optycznie wysokie, ale nie uwzględnia potencjału Wiedźmina 4.

| Wskaźnik | CD Projekt | Ubisoft | Take-Two | EA |
|---|---|---|---|---|
| P/E | 42x | 15x | 30x | 18x |
| EV/Sales | 12x | 1,5x | 8x | 5x |

**Wycena metodą SOTP:**
- Polaris (Wiedźmin 4) — oczekiwane przychody z premiery: 4-6 mld zł, NPV: ~12 mld zł
- Orion (Cyberpunk 2) — wczesna faza, NPV: ~5 mld zł
- Katalog (istniejące gry) — DCF: ~4 mld zł
- GOG.com — ~1,5 mld zł
- Gotówka netto: ~1,2 mld zł
- **SOTP fair value: ~23-24 mld zł** (~230 zł/akcję)

Obecna wycena ~21 mld zł implikuje umiarkowane dyskonto do SOTP.`,
      },
      {
        id: "dywidenda",
        title: "Polityka dywidendowa",
        content: `CD Projekt wypłaca symboliczną dywidendę (1,00 zł/akcję, stopa ~0,5%). Spółka gromadzi gotówkę na finansowanie produkcji nowych gier. Przy braku długu i rosnącej kasie, oczekujemy podwyżki dywidendy po premierze Wiedźmina 4 (est. 2027/2028).`,
      },
      {
        id: "ryzyka",
        title: "Czynniki ryzyka",
        content: `**Ryzyko produkcyjne:** Historia CD Projekt (problemy z Cyberpunk 2077 na premierę) pokazuje, że opóźnienia i jakość przy premierze stanowią kluczowe ryzyko.

**Ryzyko binary outcome:** Wartość spółki jest silnie uzależniona od sukcesu Wiedźmina 4. Rozczarowująca premiera może spowodować spadek kursu o 30-40%.

**Ryzyko technologiczne:** Przejście na Unreal Engine 5 (z własnego REDengine) niesie ryzyko opóźnień i problemów technicznych.

**Ryzyko retencji talentów:** Branża gamingowa zmaga się z odpływem talentów. Utrata kluczowych osób może wpłynąć na jakość gier.

**Ryzyko rynkowe:** Rynek gier AAA staje się coraz bardziej konkurencyjny i kosztowny (budżety >500 mln USD).`,
      },
      {
        id: "podsumowanie",
        title: "Podsumowanie i rekomendacja",
        content: `CD Projekt to unikalna propozycja na GPW — ekspozycja na globalny rynek gier przez jednego z najbardziej rozpoznawalnych producentów. Spółka jest zakładem na sukces Wiedźmina 4.

**Bull case:** Wiedźmin 4 bestsellerem (15+ mln kopii w roku premiery), wzrost GOG, nowa IP
**Bear case:** Opóźnienie/problemy jakościowe Wiedźmina 4, odpływ talentów, erozja rynku AAA

**Rekomendacja: Trzymaj** z ceną docelową 210 zł. Obecna wycena fair zakłada sukces Wiedźmina 4 — upside ograniczony do execution risk. Kupno przy ewentualnej korekcie poniżej 170 zł.

*Niniejsza analiza nie stanowi rekomendacji inwestycyjnej w rozumieniu przepisów prawa.*`,
      },
    ],
    seo: {
      title: "CD Projekt — analiza fundamentalna 2026 | WIGmarkets",
      description: "Analiza fundamentalna CD Projekt: Wiedźmin 4 w produkcji, gotówka 1,2 mld zł, P/E 42x. Twórca Wiedźmina i Cyberpunka. Rekomendacja: Trzymaj.",
    },
  },
];

// Helper: get analysis by ticker
export function getAnalysisByTicker(ticker) {
  return ANALYSES.find(a => a.ticker === ticker?.toUpperCase()) || null;
}

// Helper: get analysis by slug
export function getAnalysisBySlug(slug) {
  return ANALYSES.find(a => a.slug === slug) || null;
}

// Helper: list all analyses (summaries only, no full sections)
export function getAnalysesList() {
  return ANALYSES.map(({ ticker, slug, name, title, summary, recommendation, publishedAt, updatedAt, currentMetrics, seo }) => ({
    ticker, slug, name, title, summary, recommendation, publishedAt, updatedAt, currentMetrics, seo,
  }));
}

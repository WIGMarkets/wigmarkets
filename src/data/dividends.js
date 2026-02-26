/**
 * Dane dywidendowe spółek GPW — kalendarz dywidend 2024/2025/2026.
 *
 * Źródła danych:
 * - GPW oficjalne komunikaty ESPI/EBI
 * - StockWatch.pl/dywidendy
 * - BiznesRadar.pl
 * - Strefa Inwestorów
 * - Raporty roczne spółek
 *
 * Pola:
 *   ticker       — symbol GPW (uppercase)
 *   name         — pełna nazwa spółki
 *   sector       — sektor (polski, zgodny z GPW)
 *   divPerShare  — dywidenda na akcję (PLN)
 *   divYield     — stopa dywidendy (%, na dzień ustalenia)
 *   exDate       — dzień odcięcia prawa do dywidendy (YYYY-MM-DD)
 *   payDate      — dzień wypłaty dywidendy (YYYY-MM-DD)
 *   recordDate   — dzień ustalenia prawa do dywidendy (YYYY-MM-DD)
 *   year         — rok obrotowy, za który wypłacana jest dywidenda
 *   frequency    — "roczna" | "półroczna" | "kwartalna"
 *   payoutRatio  — % zysku netto przeznaczony na dywidendę
 *   streak       — ile lat z rzędu spółka wypłaca dywidendę
 *   status       — "Wypłacona" | "Zatwierdzona" | "Rekomendacja zarządu" | "Prognoza"
 *   history      — tablica ostatnich dywidend [{ year, amount, yield }]
 */

export const DIVIDENDS = [
  // ═══════════════════════════════════════════════════════════════════
  // Dywidendy za rok obrotowy 2024 (wypłacone w 2025)
  // ═══════════════════════════════════════════════════════════════════

  // ─── Maj 2025 ─────────────────────────────────────────────────────
  {
    ticker: "XTP", name: "XTB S.A.", sector: "Finanse",
    divPerShare: 4.80, divYield: 7.5,
    exDate: "2025-05-07", payDate: "2025-05-28", recordDate: "2025-05-09",
    year: 2024, frequency: "roczna", payoutRatio: 80, streak: 5, status: "Wypłacona",
    history: [
      { year: 2023, amount: 6.00, yield: 8.2 },
      { year: 2022, amount: 9.24, yield: 14.5 },
      { year: 2021, amount: 0.95, yield: 2.2 },
      { year: 2020, amount: 2.00, yield: 6.8 },
      { year: 2019, amount: 0.23, yield: 1.5 },
    ],
  },
  {
    ticker: "KTY", name: "Kęty S.A.", sector: "Przemysł",
    divPerShare: 56.60, divYield: 7.2,
    exDate: "2025-05-14", payDate: "2025-06-04", recordDate: "2025-05-16",
    year: 2024, frequency: "roczna", payoutRatio: 90, streak: 20, status: "Wypłacona",
    history: [
      { year: 2023, amount: 52.00, yield: 6.8 },
      { year: 2022, amount: 48.40, yield: 7.1 },
      { year: 2021, amount: 42.00, yield: 5.5 },
      { year: 2020, amount: 20.00, yield: 3.8 },
      { year: 2019, amount: 36.00, yield: 6.2 },
    ],
  },
  {
    ticker: "BDX", name: "Budimex S.A.", sector: "Budownictwo",
    divPerShare: 38.79, divYield: 5.2,
    exDate: "2025-05-21", payDate: "2025-06-11", recordDate: "2025-05-23",
    year: 2024, frequency: "roczna", payoutRatio: 90, streak: 15, status: "Wypłacona",
    history: [
      { year: 2023, amount: 31.58, yield: 4.8 },
      { year: 2022, amount: 19.12, yield: 4.0 },
      { year: 2021, amount: 17.42, yield: 5.5 },
      { year: 2020, amount: 8.70, yield: 3.2 },
      { year: 2019, amount: 16.18, yield: 5.8 },
    ],
  },
  {
    ticker: "ETL", name: "Eurotel S.A.", sector: "Handel",
    divPerShare: 6.00, divYield: 8.5,
    exDate: "2025-05-28", payDate: "2025-06-18", recordDate: "2025-05-30",
    year: 2024, frequency: "roczna", payoutRatio: 85, streak: 12, status: "Wypłacona",
    history: [
      { year: 2023, amount: 5.50, yield: 8.0 },
      { year: 2022, amount: 5.00, yield: 7.5 },
      { year: 2021, amount: 4.50, yield: 7.0 },
      { year: 2020, amount: 3.00, yield: 5.5 },
      { year: 2019, amount: 4.00, yield: 6.8 },
    ],
  },

  // ─── Czerwiec 2025 (wczesny) ──────────────────────────────────────
  {
    ticker: "ALE", name: "Allegro.eu S.A.", sector: "E-commerce",
    divPerShare: 0.70, divYield: 1.8,
    exDate: "2025-06-04", payDate: "2025-06-25", recordDate: "2025-06-06",
    year: 2024, frequency: "roczna", payoutRatio: 25, streak: 2, status: "Wypłacona",
    history: [
      { year: 2023, amount: 0.50, yield: 1.3 },
      { year: 2022, amount: 0, yield: 0 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "DOM", name: "Dom Development S.A.", sector: "Nieruchomości",
    divPerShare: 13.00, divYield: 7.8,
    exDate: "2025-06-04", payDate: "2025-06-25", recordDate: "2025-06-06",
    year: 2024, frequency: "roczna", payoutRatio: 85, streak: 14, status: "Wypłacona",
    history: [
      { year: 2023, amount: 11.50, yield: 7.2 },
      { year: 2022, amount: 9.00, yield: 6.1 },
      { year: 2021, amount: 7.00, yield: 5.3 },
      { year: 2020, amount: 4.40, yield: 4.5 },
      { year: 2019, amount: 5.00, yield: 6.0 },
    ],
  },
  {
    ticker: "IFI", name: "Inter Cars S.A.", sector: "Motoryzacja",
    divPerShare: 6.30, divYield: 1.0,
    exDate: "2025-06-04", payDate: "2025-06-25", recordDate: "2025-06-06",
    year: 2024, frequency: "roczna", payoutRatio: 20, streak: 8, status: "Wypłacona",
    history: [
      { year: 2023, amount: 5.37, yield: 0.9 },
      { year: 2022, amount: 4.50, yield: 0.8 },
      { year: 2021, amount: 3.50, yield: 0.7 },
      { year: 2020, amount: 1.25, yield: 0.5 },
      { year: 2019, amount: 2.00, yield: 1.0 },
    ],
  },
  {
    ticker: "WPL", name: "Wirtualna Polska Holding S.A.", sector: "Media",
    divPerShare: 5.60, divYield: 4.5,
    exDate: "2025-06-04", payDate: "2025-06-25", recordDate: "2025-06-06",
    year: 2024, frequency: "roczna", payoutRatio: 60, streak: 7, status: "Wypłacona",
    history: [
      { year: 2023, amount: 5.20, yield: 4.2 },
      { year: 2022, amount: 4.80, yield: 4.0 },
      { year: 2021, amount: 4.20, yield: 2.8 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 3.00, yield: 4.5 },
    ],
  },
  {
    ticker: "PLW", name: "PlayWay S.A.", sector: "Gry",
    divPerShare: 5.00, divYield: 1.8,
    exDate: "2025-06-04", payDate: "2025-06-25", recordDate: "2025-06-06",
    year: 2024, frequency: "roczna", payoutRatio: 40, streak: 4, status: "Wypłacona",
    history: [
      { year: 2023, amount: 4.50, yield: 1.5 },
      { year: 2022, amount: 4.00, yield: 1.3 },
      { year: 2021, amount: 3.50, yield: 1.0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },

  // ─── Czerwiec 2025 (połowa) ───────────────────────────────────────
  {
    ticker: "KRU", name: "Kruk S.A.", sector: "Finanse",
    divPerShare: 18.00, divYield: 3.4,
    exDate: "2025-06-11", payDate: "2025-07-02", recordDate: "2025-06-13",
    year: 2024, frequency: "roczna", payoutRatio: 35, streak: 10, status: "Wypłacona",
    history: [
      { year: 2023, amount: 16.00, yield: 3.1 },
      { year: 2022, amount: 14.00, yield: 3.0 },
      { year: 2021, amount: 10.00, yield: 3.2 },
      { year: 2020, amount: 3.00, yield: 1.8 },
      { year: 2019, amount: 5.00, yield: 2.9 },
    ],
  },
  {
    ticker: "NEU", name: "Neuca S.A.", sector: "Farmacja",
    divPerShare: 12.00, divYield: 1.4,
    exDate: "2025-06-11", payDate: "2025-07-02", recordDate: "2025-06-13",
    year: 2024, frequency: "roczna", payoutRatio: 30, streak: 15, status: "Wypłacona",
    history: [
      { year: 2023, amount: 11.00, yield: 1.3 },
      { year: 2022, amount: 9.50, yield: 1.2 },
      { year: 2021, amount: 8.00, yield: 1.0 },
      { year: 2020, amount: 5.00, yield: 0.8 },
      { year: 2019, amount: 6.00, yield: 1.1 },
    ],
  },
  {
    ticker: "TEN", name: "Ten Square Games S.A.", sector: "Gry",
    divPerShare: 3.00, divYield: 5.8,
    exDate: "2025-06-11", payDate: "2025-07-02", recordDate: "2025-06-13",
    year: 2024, frequency: "roczna", payoutRatio: 70, streak: 4, status: "Wypłacona",
    history: [
      { year: 2023, amount: 5.00, yield: 7.0 },
      { year: 2022, amount: 8.00, yield: 8.5 },
      { year: 2021, amount: 5.00, yield: 3.0 },
      { year: 2020, amount: 4.00, yield: 2.5 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "WWL", name: "Wawel S.A.", sector: "Spożywczy",
    divPerShare: 25.00, divYield: 3.5,
    exDate: "2025-06-11", payDate: "2025-07-02", recordDate: "2025-06-13",
    year: 2024, frequency: "roczna", payoutRatio: 55, streak: 18, status: "Wypłacona",
    history: [
      { year: 2023, amount: 20.00, yield: 3.0 },
      { year: 2022, amount: 15.00, yield: 2.5 },
      { year: 2021, amount: 10.00, yield: 2.0 },
      { year: 2020, amount: 15.00, yield: 2.8 },
      { year: 2019, amount: 25.00, yield: 4.0 },
    ],
  },

  // ─── Czerwiec 2025 (trzeci tydzień) ──────────────────────────────
  {
    ticker: "DNP", name: "DINO Polska S.A.", sector: "Handel",
    divPerShare: 1.20, divYield: 0.3,
    exDate: "2025-06-18", payDate: "2025-07-09", recordDate: "2025-06-20",
    year: 2024, frequency: "roczna", payoutRatio: 10, streak: 6, status: "Wypłacona",
    history: [
      { year: 2023, amount: 1.00, yield: 0.3 },
      { year: 2022, amount: 1.00, yield: 0.2 },
      { year: 2021, amount: 0.67, yield: 0.2 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "ING", name: "ING Bank Śląski S.A.", sector: "Banki",
    divPerShare: 18.50, divYield: 5.1,
    exDate: "2025-06-18", payDate: "2025-07-09", recordDate: "2025-06-20",
    year: 2024, frequency: "roczna", payoutRatio: 50, streak: 3, status: "Wypłacona",
    history: [
      { year: 2023, amount: 16.00, yield: 4.8 },
      { year: 2022, amount: 0, yield: 0 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 7.80, yield: 3.5 },
      { year: 2019, amount: 7.40, yield: 3.2 },
    ],
  },
  {
    ticker: "ASE", name: "Asseco South Eastern Europe S.A.", sector: "Technologia",
    divPerShare: 1.40, divYield: 3.2,
    exDate: "2025-06-18", payDate: "2025-07-09", recordDate: "2025-06-20",
    year: 2024, frequency: "roczna", payoutRatio: 65, streak: 10, status: "Wypłacona",
    history: [
      { year: 2023, amount: 1.30, yield: 3.0 },
      { year: 2022, amount: 1.21, yield: 2.8 },
      { year: 2021, amount: 1.10, yield: 2.5 },
      { year: 2020, amount: 0.95, yield: 2.3 },
      { year: 2019, amount: 0.87, yield: 2.1 },
    ],
  },
  {
    ticker: "CDR", name: "CD Projekt S.A.", sector: "Gry",
    divPerShare: 1.00, divYield: 0.5,
    exDate: "2025-06-18", payDate: "2025-07-09", recordDate: "2025-06-20",
    year: 2024, frequency: "roczna", payoutRatio: 15, streak: 1, status: "Wypłacona",
    history: [
      { year: 2023, amount: 1.00, yield: 0.4 },
      { year: 2022, amount: 0, yield: 0 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 5.00, yield: 1.5 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "TXT", name: "Text S.A.", sector: "Technologia",
    divPerShare: 3.80, divYield: 2.8,
    exDate: "2025-06-18", payDate: "2025-07-09", recordDate: "2025-06-20",
    year: 2024, frequency: "roczna", payoutRatio: 70, streak: 5, status: "Wypłacona",
    history: [
      { year: 2023, amount: 3.40, yield: 2.5 },
      { year: 2022, amount: 5.00, yield: 3.5 },
      { year: 2021, amount: 2.50, yield: 1.5 },
      { year: 2020, amount: 1.50, yield: 1.2 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "MBR", name: "Mo-BRUK S.A.", sector: "Usługi środowiskowe",
    divPerShare: 8.00, divYield: 4.5,
    exDate: "2025-06-18", payDate: "2025-07-09", recordDate: "2025-06-20",
    year: 2024, frequency: "roczna", payoutRatio: 60, streak: 5, status: "Wypłacona",
    history: [
      { year: 2023, amount: 7.50, yield: 4.2 },
      { year: 2022, amount: 14.00, yield: 6.5 },
      { year: 2021, amount: 10.00, yield: 5.0 },
      { year: 2020, amount: 3.50, yield: 3.5 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },

  // ─── Czerwiec 2025 (koniec) ───────────────────────────────────────
  {
    ticker: "SPL", name: "Santander Bank Polska S.A.", sector: "Banki",
    divPerShare: 28.80, divYield: 5.3,
    exDate: "2025-06-25", payDate: "2025-07-16", recordDate: "2025-06-27",
    year: 2024, frequency: "roczna", payoutRatio: 50, streak: 3, status: "Wypłacona",
    history: [
      { year: 2023, amount: 25.00, yield: 4.9 },
      { year: 2022, amount: 7.00, yield: 2.1 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 5.00, yield: 1.5 },
    ],
  },
  {
    ticker: "UNI", name: "Unimot S.A.", sector: "Energetyka",
    divPerShare: 4.50, divYield: 6.4,
    exDate: "2025-06-25", payDate: "2025-07-16", recordDate: "2025-06-27",
    year: 2024, frequency: "roczna", payoutRatio: 50, streak: 6, status: "Wypłacona",
    history: [
      { year: 2023, amount: 4.00, yield: 5.8 },
      { year: 2022, amount: 5.00, yield: 7.2 },
      { year: 2021, amount: 2.00, yield: 3.5 },
      { year: 2020, amount: 1.50, yield: 2.8 },
      { year: 2019, amount: 1.00, yield: 2.2 },
    ],
  },
  {
    ticker: "STS", name: "STS Holding S.A.", sector: "Rozrywka",
    divPerShare: 1.40, divYield: 6.5,
    exDate: "2025-06-25", payDate: "2025-07-16", recordDate: "2025-06-27",
    year: 2024, frequency: "roczna", payoutRatio: 70, streak: 3, status: "Wypłacona",
    history: [
      { year: 2023, amount: 1.20, yield: 5.8 },
      { year: 2022, amount: 1.00, yield: 4.5 },
      { year: 2021, amount: 0.90, yield: 3.5 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "ACP", name: "Asseco Poland S.A.", sector: "Technologia",
    divPerShare: 3.71, divYield: 4.2,
    exDate: "2025-06-25", payDate: "2025-07-16", recordDate: "2025-06-27",
    year: 2024, frequency: "roczna", payoutRatio: 60, streak: 14, status: "Wypłacona",
    history: [
      { year: 2023, amount: 3.51, yield: 4.0 },
      { year: 2022, amount: 3.01, yield: 3.6 },
      { year: 2021, amount: 3.01, yield: 3.5 },
      { year: 2020, amount: 3.01, yield: 4.5 },
      { year: 2019, amount: 3.01, yield: 4.0 },
    ],
  },
  {
    ticker: "BNP", name: "BNP Paribas Bank Polska S.A.", sector: "Banki",
    divPerShare: 10.47, divYield: 5.8,
    exDate: "2025-06-25", payDate: "2025-07-16", recordDate: "2025-06-27",
    year: 2024, frequency: "roczna", payoutRatio: 50, streak: 3, status: "Wypłacona",
    history: [
      { year: 2023, amount: 8.50, yield: 5.0 },
      { year: 2022, amount: 5.50, yield: 3.8 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "DVL", name: "Develia S.A.", sector: "Nieruchomości",
    divPerShare: 0.45, divYield: 3.5,
    exDate: "2025-06-25", payDate: "2025-07-16", recordDate: "2025-06-27",
    year: 2024, frequency: "roczna", payoutRatio: 45, streak: 4, status: "Wypłacona",
    history: [
      { year: 2023, amount: 0.40, yield: 3.2 },
      { year: 2022, amount: 0.30, yield: 2.8 },
      { year: 2021, amount: 0.20, yield: 1.8 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "PHN", name: "Polski Holding Nieruchomości S.A.", sector: "Nieruchomości",
    divPerShare: 0.58, divYield: 3.8,
    exDate: "2025-06-25", payDate: "2025-07-16", recordDate: "2025-06-27",
    year: 2024, frequency: "roczna", payoutRatio: 50, streak: 4, status: "Wypłacona",
    history: [
      { year: 2023, amount: 0.50, yield: 3.5 },
      { year: 2022, amount: 0.40, yield: 3.0 },
      { year: 2021, amount: 0.30, yield: 2.2 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },

  // ─── Lipiec 2025 (wczesny) ────────────────────────────────────────
  {
    ticker: "MIL", name: "Bank Millennium S.A.", sector: "Banki",
    divPerShare: 0.80, divYield: 6.7,
    exDate: "2025-07-02", payDate: "2025-07-23", recordDate: "2025-07-04",
    year: 2024, frequency: "roczna", payoutRatio: 50, streak: 1, status: "Wypłacona",
    history: [
      { year: 2023, amount: 0, yield: 0 },
      { year: 2022, amount: 0, yield: 0 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 0.42, yield: 5.2 },
    ],
  },
  {
    ticker: "BHW", name: "Bank Handlowy w Warszawie S.A.", sector: "Banki",
    divPerShare: 10.34, divYield: 8.6,
    exDate: "2025-07-02", payDate: "2025-07-23", recordDate: "2025-07-04",
    year: 2024, frequency: "roczna", payoutRatio: 75, streak: 8, status: "Wypłacona",
    history: [
      { year: 2023, amount: 9.25, yield: 7.8 },
      { year: 2022, amount: 6.16, yield: 6.5 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 9.39, yield: 11.2 },
    ],
  },
  {
    ticker: "BFT", name: "Benefit Systems S.A.", sector: "HR/Benefity",
    divPerShare: 20.00, divYield: 2.2,
    exDate: "2025-07-02", payDate: "2025-07-23", recordDate: "2025-07-04",
    year: 2024, frequency: "roczna", payoutRatio: 40, streak: 5, status: "Wypłacona",
    history: [
      { year: 2023, amount: 16.00, yield: 1.8 },
      { year: 2022, amount: 0, yield: 0 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 30.00, yield: 3.5 },
    ],
  },
  {
    ticker: "CPS", name: "Cyfrowy Polsat S.A.", sector: "Media",
    divPerShare: 1.50, divYield: 5.5,
    exDate: "2025-07-02", payDate: "2025-07-23", recordDate: "2025-07-04",
    year: 2024, frequency: "roczna", payoutRatio: 65, streak: 10, status: "Wypłacona",
    history: [
      { year: 2023, amount: 1.00, yield: 4.0 },
      { year: 2022, amount: 0.70, yield: 3.5 },
      { year: 2021, amount: 0.05, yield: 0.3 },
      { year: 2020, amount: 1.50, yield: 5.0 },
      { year: 2019, amount: 1.50, yield: 5.8 },
    ],
  },
  {
    ticker: "VRG", name: "VRG S.A.", sector: "Handel",
    divPerShare: 0.08, divYield: 1.5,
    exDate: "2025-07-02", payDate: "2025-07-23", recordDate: "2025-07-04",
    year: 2024, frequency: "roczna", payoutRatio: 20, streak: 3, status: "Wypłacona",
    history: [
      { year: 2023, amount: 0.06, yield: 1.2 },
      { year: 2022, amount: 0.05, yield: 1.0 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },

  // ─── Lipiec 2025 (połowa – pierwszy tydzień) ─────────────────────
  {
    ticker: "PEO", name: "Bank Pekao S.A.", sector: "Banki",
    divPerShare: 16.60, divYield: 8.2,
    exDate: "2025-07-04", payDate: "2025-07-25", recordDate: "2025-07-08",
    year: 2024, frequency: "roczna", payoutRatio: 75, streak: 4, status: "Wypłacona",
    history: [
      { year: 2023, amount: 14.99, yield: 7.8 },
      { year: 2022, amount: 9.00, yield: 6.2 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 6.60, yield: 5.8 },
    ],
  },

  // ─── Lipiec 2025 (drugi tydzień) ─────────────────────────────────
  {
    ticker: "PKO", name: "PKO Bank Polski S.A.", sector: "Banki",
    divPerShare: 2.62, divYield: 4.1,
    exDate: "2025-07-09", payDate: "2025-07-30", recordDate: "2025-07-11",
    year: 2024, frequency: "roczna", payoutRatio: 50, streak: 4, status: "Wypłacona",
    history: [
      { year: 2023, amount: 1.98, yield: 3.3 },
      { year: 2022, amount: 1.44, yield: 3.0 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 1.33, yield: 3.5 },
    ],
  },
  {
    ticker: "ATC", name: "Arctic Paper S.A.", sector: "Przemysł",
    divPerShare: 2.00, divYield: 8.5,
    exDate: "2025-07-09", payDate: "2025-07-30", recordDate: "2025-07-11",
    year: 2024, frequency: "roczna", payoutRatio: 50, streak: 4, status: "Wypłacona",
    history: [
      { year: 2023, amount: 3.00, yield: 10.2 },
      { year: 2022, amount: 4.00, yield: 12.1 },
      { year: 2021, amount: 1.50, yield: 6.0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "SNK", name: "Fabryka Farb i Lakierów Śnieżka S.A.", sector: "Chemia",
    divPerShare: 2.90, divYield: 4.5,
    exDate: "2025-07-09", payDate: "2025-07-30", recordDate: "2025-07-11",
    year: 2024, frequency: "roczna", payoutRatio: 55, streak: 12, status: "Wypłacona",
    history: [
      { year: 2023, amount: 2.60, yield: 4.2 },
      { year: 2022, amount: 2.30, yield: 4.0 },
      { year: 2021, amount: 2.00, yield: 3.5 },
      { year: 2020, amount: 1.50, yield: 3.0 },
      { year: 2019, amount: 2.00, yield: 3.8 },
    ],
  },
  {
    ticker: "FMF", name: "Ferro S.A.", sector: "Przemysł",
    divPerShare: 3.50, divYield: 5.0,
    exDate: "2025-07-09", payDate: "2025-07-30", recordDate: "2025-07-11",
    year: 2024, frequency: "roczna", payoutRatio: 55, streak: 6, status: "Wypłacona",
    history: [
      { year: 2023, amount: 3.20, yield: 4.8 },
      { year: 2022, amount: 2.80, yield: 4.5 },
      { year: 2021, amount: 2.20, yield: 3.8 },
      { year: 2020, amount: 1.00, yield: 2.5 },
      { year: 2019, amount: 1.50, yield: 3.0 },
    ],
  },

  // ─── Lipiec 2025 (trzeci tydzień) ────────────────────────────────
  {
    ticker: "KGH", name: "KGHM Polska Miedź S.A.", sector: "Surowce",
    divPerShare: 3.00, divYield: 1.8,
    exDate: "2025-07-16", payDate: "2025-08-06", recordDate: "2025-07-18",
    year: 2024, frequency: "roczna", payoutRatio: 30, streak: 3, status: "Wypłacona",
    history: [
      { year: 2023, amount: 3.00, yield: 2.0 },
      { year: 2022, amount: 1.50, yield: 1.2 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 1.50, yield: 1.5 },
    ],
  },
  {
    ticker: "OPL", name: "Orange Polska S.A.", sector: "Telekomunikacja",
    divPerShare: 0.35, divYield: 4.4,
    exDate: "2025-07-16", payDate: "2025-08-06", recordDate: "2025-07-18",
    year: 2024, frequency: "roczna", payoutRatio: 65, streak: 4, status: "Wypłacona",
    history: [
      { year: 2023, amount: 0.30, yield: 3.8 },
      { year: 2022, amount: 0.25, yield: 3.2 },
      { year: 2021, amount: 0.15, yield: 2.0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "STP", name: "Stalprodukt S.A.", sector: "Przemysł",
    divPerShare: 15.00, divYield: 3.8,
    exDate: "2025-07-16", payDate: "2025-08-06", recordDate: "2025-07-18",
    year: 2024, frequency: "roczna", payoutRatio: 50, streak: 22, status: "Wypłacona",
    history: [
      { year: 2023, amount: 12.00, yield: 3.2 },
      { year: 2022, amount: 10.00, yield: 3.0 },
      { year: 2021, amount: 8.00, yield: 2.5 },
      { year: 2020, amount: 5.00, yield: 1.8 },
      { year: 2019, amount: 10.00, yield: 3.5 },
    ],
  },
  {
    ticker: "CIG", name: "CI Games S.A.", sector: "Gry",
    divPerShare: 0.15, divYield: 4.2,
    exDate: "2025-07-16", payDate: "2025-08-06", recordDate: "2025-07-18",
    year: 2024, frequency: "roczna", payoutRatio: 50, streak: 2, status: "Wypłacona",
    history: [
      { year: 2023, amount: 0.10, yield: 3.5 },
      { year: 2022, amount: 0, yield: 0 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "CMR", name: "Comarch S.A.", sector: "Technologia",
    divPerShare: 3.00, divYield: 1.2,
    exDate: "2025-07-16", payDate: "2025-08-06", recordDate: "2025-07-18",
    year: 2024, frequency: "roczna", payoutRatio: 25, streak: 8, status: "Wypłacona",
    history: [
      { year: 2023, amount: 3.00, yield: 1.0 },
      { year: 2022, amount: 3.00, yield: 1.2 },
      { year: 2021, amount: 1.50, yield: 0.8 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 1.50, yield: 0.9 },
    ],
  },

  // ─── Lipiec 2025 (czwarty tydzień) ───────────────────────────────
  {
    ticker: "PKN", name: "PKN ORLEN S.A.", sector: "Energetyka",
    divPerShare: 4.15, divYield: 5.6,
    exDate: "2025-07-22", payDate: "2025-08-12", recordDate: "2025-07-24",
    year: 2024, frequency: "roczna", payoutRatio: 40, streak: 8, status: "Wypłacona",
    history: [
      { year: 2023, amount: 5.50, yield: 6.8 },
      { year: 2022, amount: 3.50, yield: 4.6 },
      { year: 2021, amount: 3.50, yield: 4.2 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 3.50, yield: 5.1 },
    ],
  },
  {
    ticker: "GPW", name: "GPW S.A.", sector: "Finanse",
    divPerShare: 3.15, divYield: 6.1,
    exDate: "2025-07-22", payDate: "2025-08-06", recordDate: "2025-07-24",
    year: 2024, frequency: "roczna", payoutRatio: 70, streak: 12, status: "Wypłacona",
    history: [
      { year: 2023, amount: 2.80, yield: 5.8 },
      { year: 2022, amount: 2.40, yield: 5.5 },
      { year: 2021, amount: 2.20, yield: 5.0 },
      { year: 2020, amount: 1.50, yield: 4.0 },
      { year: 2019, amount: 2.40, yield: 5.8 },
    ],
  },
  {
    ticker: "PCR", name: "PCC Rokita S.A.", sector: "Chemia",
    divPerShare: 6.50, divYield: 5.2,
    exDate: "2025-07-23", payDate: "2025-08-13", recordDate: "2025-07-25",
    year: 2024, frequency: "roczna", payoutRatio: 60, streak: 8, status: "Wypłacona",
    history: [
      { year: 2023, amount: 5.50, yield: 4.8 },
      { year: 2022, amount: 8.00, yield: 6.5 },
      { year: 2021, amount: 5.00, yield: 4.0 },
      { year: 2020, amount: 2.50, yield: 3.0 },
      { year: 2019, amount: 4.00, yield: 4.5 },
    ],
  },
  {
    ticker: "ALR", name: "Alior Bank S.A.", sector: "Banki",
    divPerShare: 4.40, divYield: 4.0,
    exDate: "2025-07-23", payDate: "2025-08-13", recordDate: "2025-07-25",
    year: 2024, frequency: "roczna", payoutRatio: 50, streak: 2, status: "Wypłacona",
    history: [
      { year: 2023, amount: 2.20, yield: 2.5 },
      { year: 2022, amount: 0, yield: 0 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },

  // ─── Lipiec/Sierpień 2025 ────────────────────────────────────────
  {
    ticker: "APR", name: "Apator S.A.", sector: "Przemysł",
    divPerShare: 0.50, divYield: 3.0,
    exDate: "2025-07-30", payDate: "2025-08-20", recordDate: "2025-08-01",
    year: 2024, frequency: "roczna", payoutRatio: 45, streak: 12, status: "Wypłacona",
    history: [
      { year: 2023, amount: 0.50, yield: 3.2 },
      { year: 2022, amount: 0.50, yield: 3.5 },
      { year: 2021, amount: 0.40, yield: 2.5 },
      { year: 2020, amount: 0.30, yield: 2.0 },
      { year: 2019, amount: 0.40, yield: 2.8 },
    ],
  },
  {
    ticker: "PGE", name: "PGE Polska Grupa Energetyczna S.A.", sector: "Energetyka",
    divPerShare: 0.38, divYield: 4.8,
    exDate: "2025-08-06", payDate: "2025-08-27", recordDate: "2025-08-08",
    year: 2024, frequency: "roczna", payoutRatio: 40, streak: 2, status: "Wypłacona",
    history: [
      { year: 2023, amount: 0.25, yield: 3.2 },
      { year: 2022, amount: 0, yield: 0 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 0.27, yield: 2.8 },
    ],
  },
  {
    ticker: "MBK", name: "mBank S.A.", sector: "Banki",
    divPerShare: 32.20, divYield: 4.6,
    exDate: "2025-08-13", payDate: "2025-09-03", recordDate: "2025-08-15",
    year: 2024, frequency: "roczna", payoutRatio: 50, streak: 2, status: "Wypłacona",
    history: [
      { year: 2023, amount: 20.30, yield: 3.0 },
      { year: 2022, amount: 0, yield: 0 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "LWB", name: "Bogdanka S.A.", sector: "Surowce",
    divPerShare: 5.20, divYield: 8.9,
    exDate: "2025-08-13", payDate: "2025-09-03", recordDate: "2025-08-15",
    year: 2024, frequency: "roczna", payoutRatio: 60, streak: 6, status: "Wypłacona",
    history: [
      { year: 2023, amount: 7.50, yield: 10.5 },
      { year: 2022, amount: 10.00, yield: 12.0 },
      { year: 2021, amount: 2.00, yield: 3.8 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 1.00, yield: 2.0 },
    ],
  },
  {
    ticker: "TPE", name: "TAURON Polska Energia S.A.", sector: "Energetyka",
    divPerShare: 0.12, divYield: 2.9,
    exDate: "2025-08-20", payDate: "2025-09-10", recordDate: "2025-08-22",
    year: 2024, frequency: "roczna", payoutRatio: 30, streak: 1, status: "Wypłacona",
    history: [
      { year: 2023, amount: 0, yield: 0 },
      { year: 2022, amount: 0, yield: 0 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 0.04, yield: 1.5 },
    ],
  },
  {
    ticker: "ZAB", name: "Żabka Group S.A.", sector: "Handel",
    divPerShare: 1.00, divYield: 2.0,
    exDate: "2025-08-27", payDate: "2025-09-17", recordDate: "2025-08-29",
    year: 2024, frequency: "roczna", payoutRatio: 25, streak: 1, status: "Wypłacona",
    history: [
      { year: 2023, amount: 0, yield: 0 },
      { year: 2022, amount: 0, yield: 0 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },

  // ─── Wrzesień–Grudzień 2025 ──────────────────────────────────────
  {
    ticker: "LPP", name: "LPP S.A.", sector: "Handel",
    divPerShare: 250.00, divYield: 1.5,
    exDate: "2025-09-03", payDate: "2025-09-24", recordDate: "2025-09-05",
    year: 2024, frequency: "roczna", payoutRatio: 30, streak: 10, status: "Wypłacona",
    history: [
      { year: 2023, amount: 230.00, yield: 1.4 },
      { year: 2022, amount: 200.00, yield: 1.5 },
      { year: 2021, amount: 100.00, yield: 0.9 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 60.00, yield: 0.8 },
    ],
  },
  {
    ticker: "PZU", name: "PZU S.A.", sector: "Ubezpieczenia",
    divPerShare: 2.90, divYield: 5.8,
    exDate: "2025-09-10", payDate: "2025-10-01", recordDate: "2025-09-12",
    year: 2024, frequency: "roczna", payoutRatio: 75, streak: 12, status: "Wypłacona",
    history: [
      { year: 2023, amount: 2.80, yield: 5.6 },
      { year: 2022, amount: 2.40, yield: 5.2 },
      { year: 2021, amount: 1.94, yield: 4.8 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 2.80, yield: 6.9 },
    ],
  },
  {
    ticker: "CCC", name: "CCC S.A.", sector: "Handel",
    divPerShare: 3.50, divYield: 1.8,
    exDate: "2025-09-17", payDate: "2025-10-08", recordDate: "2025-09-19",
    year: 2024, frequency: "roczna", payoutRatio: 25, streak: 1, status: "Wypłacona",
    history: [
      { year: 2023, amount: 0, yield: 0 },
      { year: 2022, amount: 0, yield: 0 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 2.30, yield: 2.5 },
    ],
  },
  {
    ticker: "SNT", name: "Synektik S.A.", sector: "Medycyna",
    divPerShare: 2.50, divYield: 1.8,
    exDate: "2025-09-24", payDate: "2025-10-15", recordDate: "2025-09-26",
    year: 2024, frequency: "roczna", payoutRatio: 30, streak: 5, status: "Wypłacona",
    history: [
      { year: 2023, amount: 2.00, yield: 1.5 },
      { year: 2022, amount: 1.50, yield: 1.2 },
      { year: 2021, amount: 1.00, yield: 1.0 },
      { year: 2020, amount: 0.50, yield: 0.8 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "EAT", name: "AmRest Holdings SE", sector: "Restauracje",
    divPerShare: 4.00, divYield: 1.5,
    exDate: "2025-10-08", payDate: "2025-10-29", recordDate: "2025-10-10",
    year: 2024, frequency: "roczna", payoutRatio: 20, streak: 1, status: "Wypłacona",
    history: [
      { year: 2023, amount: 0, yield: 0 },
      { year: 2022, amount: 0, yield: 0 },
      { year: 2021, amount: 0, yield: 0 },
      { year: 2020, amount: 0, yield: 0 },
      { year: 2019, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "ASB", name: "ASBISc Enterprises Plc", sector: "Technologia",
    divPerShare: 0.74, divYield: 2.6,
    exDate: "2025-11-17", payDate: "2025-11-27", recordDate: "2025-11-19",
    year: 2024, frequency: "roczna", payoutRatio: 40, streak: 6, status: "Wypłacona",
    history: [
      { year: 2023, amount: 0.80, yield: 3.0 },
      { year: 2022, amount: 1.00, yield: 4.5 },
      { year: 2021, amount: 0.50, yield: 2.0 },
      { year: 2020, amount: 0.30, yield: 1.5 },
      { year: 2019, amount: 0.20, yield: 1.2 },
    ],
  },
  {
    ticker: "KER", name: "Kernel Holding S.A.", sector: "Rolnictwo",
    divPerShare: 0.50, divYield: 3.8,
    exDate: "2025-12-03", payDate: "2025-12-24", recordDate: "2025-12-05",
    year: 2024, frequency: "roczna", payoutRatio: 25, streak: 1, status: "Wypłacona",
    history: [
      { year: 2023, amount: 0, yield: 0 },
      { year: 2022, amount: 0, yield: 0 },
      { year: 2021, amount: 0.25, yield: 0.5 },
      { year: 2020, amount: 0.25, yield: 0.8 },
      { year: 2019, amount: 0.25, yield: 1.0 },
    ],
  },
  {
    ticker: "AMB", name: "Ambra S.A.", sector: "Spożywczy",
    divPerShare: 1.20, divYield: 4.2,
    exDate: "2025-12-10", payDate: "2025-12-31", recordDate: "2025-12-12",
    year: 2024, frequency: "roczna", payoutRatio: 60, streak: 18, status: "Wypłacona",
    history: [
      { year: 2023, amount: 1.10, yield: 4.0 },
      { year: 2022, amount: 1.00, yield: 3.8 },
      { year: 2021, amount: 0.90, yield: 3.5 },
      { year: 2020, amount: 0.60, yield: 2.5 },
      { year: 2019, amount: 0.80, yield: 3.6 },
    ],
  },
  {
    ticker: "ABE", name: "AB S.A.", sector: "Technologia",
    divPerShare: 3.80, divYield: 5.0,
    exDate: "2025-12-17", payDate: "2026-01-07", recordDate: "2025-12-19",
    year: 2024, frequency: "roczna", payoutRatio: 55, streak: 10, status: "Wypłacona",
    history: [
      { year: 2023, amount: 3.50, yield: 4.8 },
      { year: 2022, amount: 3.00, yield: 4.5 },
      { year: 2021, amount: 2.50, yield: 3.8 },
      { year: 2020, amount: 1.20, yield: 2.5 },
      { year: 2019, amount: 2.00, yield: 3.5 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // Dywidendy za rok obrotowy 2025 (nadchodzące, wypłata 2025/2026)
  // ═══════════════════════════════════════════════════════════════════

  // ─── Już wypłacone (SNT, TXT — niestandardowe okresy) ────────────
  {
    ticker: "SNT", name: "Synektik S.A.", sector: "Medycyna",
    divPerShare: 10.75, divYield: 3.6,
    exDate: "2026-01-27", payDate: "2026-02-02", recordDate: "2026-01-29",
    year: 2025, frequency: "roczna", payoutRatio: 50, streak: 6, status: "Wypłacona",
    history: [
      { year: 2024, amount: 2.50, yield: 1.8 },
      { year: 2023, amount: 2.00, yield: 1.5 },
      { year: 2022, amount: 1.50, yield: 1.2 },
    ],
  },
  {
    ticker: "TXT", name: "Text S.A.", sector: "Technologia",
    divPerShare: 1.15, divYield: 2.7,
    exDate: "2026-02-05", payDate: "2026-02-16", recordDate: "2026-02-09",
    year: 2025, frequency: "kwartalna", payoutRatio: 70, streak: 6, status: "Wypłacona",
    history: [
      { year: 2024, amount: 3.80, yield: 2.8 },
      { year: 2023, amount: 3.40, yield: 2.5 },
      { year: 2022, amount: 5.00, yield: 3.5 },
    ],
  },

  // ─── Zatwierdzone (WZA approved) ──────────────────────────────────
  {
    ticker: "LPP", name: "LPP S.A.", sector: "Handel",
    divPerShare: 400.00, divYield: 1.9,
    exDate: "2026-04-21", payDate: "2026-04-30", recordDate: "2026-04-23",
    year: 2025, frequency: "roczna", payoutRatio: 35, streak: 11, status: "Zatwierdzona",
    history: [
      { year: 2024, amount: 250.00, yield: 1.5 },
      { year: 2023, amount: 230.00, yield: 1.4 },
      { year: 2022, amount: 200.00, yield: 1.5 },
    ],
  },

  // ─── Rekomendacja zarządu ─────────────────────────────────────────
  {
    ticker: "ABE", name: "AB S.A.", sector: "Technologia",
    divPerShare: 6.45, divYield: 4.9,
    exDate: "2026-12-16", payDate: "2027-01-06", recordDate: "2026-12-18",
    year: 2025, frequency: "roczna", payoutRatio: 60, streak: 11, status: "Rekomendacja zarządu",
    history: [
      { year: 2024, amount: 3.80, yield: 5.0 },
      { year: 2023, amount: 3.50, yield: 4.8 },
      { year: 2022, amount: 3.00, yield: 4.5 },
    ],
  },
  {
    ticker: "ASE", name: "Asseco South Eastern Europe S.A.", sector: "Technologia",
    divPerShare: 1.95, divYield: 3.1,
    exDate: "2026-06-17", payDate: "2026-07-08", recordDate: "2026-06-19",
    year: 2025, frequency: "roczna", payoutRatio: 70, streak: 11, status: "Rekomendacja zarządu",
    history: [
      { year: 2024, amount: 1.40, yield: 3.2 },
      { year: 2023, amount: 1.30, yield: 3.0 },
      { year: 2022, amount: 1.21, yield: 2.8 },
    ],
  },
  {
    ticker: "OPL", name: "Orange Polska S.A.", sector: "Telekomunikacja",
    divPerShare: 0.61, divYield: 4.4,
    exDate: "2026-06-22", payDate: "2026-07-08", recordDate: "2026-06-24",
    year: 2025, frequency: "roczna", payoutRatio: 70, streak: 5, status: "Rekomendacja zarządu",
    history: [
      { year: 2024, amount: 0.35, yield: 4.4 },
      { year: 2023, amount: 0.30, yield: 3.8 },
      { year: 2022, amount: 0.25, yield: 3.2 },
    ],
  },
  {
    ticker: "BNP", name: "BNP Paribas Bank Polska S.A.", sector: "Banki",
    divPerShare: 12.00, divYield: 6.0,
    exDate: "2026-06-24", payDate: "2026-07-15", recordDate: "2026-06-26",
    year: 2025, frequency: "roczna", payoutRatio: 50, streak: 4, status: "Rekomendacja zarządu",
    history: [
      { year: 2024, amount: 10.47, yield: 5.8 },
      { year: 2023, amount: 8.50, yield: 5.0 },
      { year: 2022, amount: 5.50, yield: 3.8 },
    ],
  },
  {
    ticker: "ING", name: "ING Bank Śląski S.A.", sector: "Banki",
    divPerShare: 22.00, divYield: 5.5,
    exDate: "2026-06-17", payDate: "2026-07-08", recordDate: "2026-06-19",
    year: 2025, frequency: "roczna", payoutRatio: 55, streak: 4, status: "Rekomendacja zarządu",
    history: [
      { year: 2024, amount: 18.50, yield: 5.1 },
      { year: 2023, amount: 16.00, yield: 4.8 },
      { year: 2022, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "KTY", name: "Kęty S.A.", sector: "Przemysł",
    divPerShare: 60.00, divYield: 7.5,
    exDate: "2026-05-13", payDate: "2026-06-03", recordDate: "2026-05-15",
    year: 2025, frequency: "roczna", payoutRatio: 90, streak: 21, status: "Rekomendacja zarządu",
    history: [
      { year: 2024, amount: 56.60, yield: 7.2 },
      { year: 2023, amount: 52.00, yield: 6.8 },
      { year: 2022, amount: 48.40, yield: 7.1 },
    ],
  },
  {
    ticker: "XTP", name: "XTB S.A.", sector: "Finanse",
    divPerShare: 5.20, divYield: 7.8,
    exDate: "2026-05-06", payDate: "2026-05-27", recordDate: "2026-05-08",
    year: 2025, frequency: "roczna", payoutRatio: 80, streak: 6, status: "Rekomendacja zarządu",
    history: [
      { year: 2024, amount: 4.80, yield: 7.5 },
      { year: 2023, amount: 6.00, yield: 8.2 },
      { year: 2022, amount: 9.24, yield: 14.5 },
    ],
  },
  {
    ticker: "BDX", name: "Budimex S.A.", sector: "Budownictwo",
    divPerShare: 42.00, divYield: 5.5,
    exDate: "2026-05-20", payDate: "2026-06-10", recordDate: "2026-05-22",
    year: 2025, frequency: "roczna", payoutRatio: 90, streak: 16, status: "Rekomendacja zarządu",
    history: [
      { year: 2024, amount: 38.79, yield: 5.2 },
      { year: 2023, amount: 31.58, yield: 4.8 },
      { year: 2022, amount: 19.12, yield: 4.0 },
    ],
  },
  {
    ticker: "DOM", name: "Dom Development S.A.", sector: "Nieruchomości",
    divPerShare: 14.00, divYield: 8.0,
    exDate: "2026-06-03", payDate: "2026-06-24", recordDate: "2026-06-05",
    year: 2025, frequency: "roczna", payoutRatio: 85, streak: 15, status: "Rekomendacja zarządu",
    history: [
      { year: 2024, amount: 13.00, yield: 7.8 },
      { year: 2023, amount: 11.50, yield: 7.2 },
      { year: 2022, amount: 9.00, yield: 6.1 },
    ],
  },

  // ─── Prognozy (maj–czerwiec 2026) ─────────────────────────────────
  {
    ticker: "ETL", name: "Eurotel S.A.", sector: "Handel",
    divPerShare: 6.50, divYield: 8.5,
    exDate: "2026-05-27", payDate: "2026-06-17", recordDate: "2026-05-29",
    year: 2025, frequency: "roczna", payoutRatio: 85, streak: 13, status: "Prognoza",
    history: [
      { year: 2024, amount: 6.00, yield: 8.5 },
      { year: 2023, amount: 5.50, yield: 8.0 },
      { year: 2022, amount: 5.00, yield: 7.5 },
    ],
  },
  {
    ticker: "ALE", name: "Allegro.eu S.A.", sector: "E-commerce",
    divPerShare: 0.85, divYield: 2.0,
    exDate: "2026-06-03", payDate: "2026-06-24", recordDate: "2026-06-05",
    year: 2025, frequency: "roczna", payoutRatio: 28, streak: 3, status: "Prognoza",
    history: [
      { year: 2024, amount: 0.70, yield: 1.8 },
      { year: 2023, amount: 0.50, yield: 1.3 },
      { year: 2022, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "WPL", name: "Wirtualna Polska Holding S.A.", sector: "Media",
    divPerShare: 6.00, divYield: 4.5,
    exDate: "2026-06-03", payDate: "2026-06-24", recordDate: "2026-06-05",
    year: 2025, frequency: "roczna", payoutRatio: 60, streak: 8, status: "Prognoza",
    history: [
      { year: 2024, amount: 5.60, yield: 4.5 },
      { year: 2023, amount: 5.20, yield: 4.2 },
      { year: 2022, amount: 4.80, yield: 4.0 },
    ],
  },
  {
    ticker: "IFI", name: "Inter Cars S.A.", sector: "Motoryzacja",
    divPerShare: 7.00, divYield: 1.0,
    exDate: "2026-06-03", payDate: "2026-06-24", recordDate: "2026-06-05",
    year: 2025, frequency: "roczna", payoutRatio: 20, streak: 9, status: "Prognoza",
    history: [
      { year: 2024, amount: 6.30, yield: 1.0 },
      { year: 2023, amount: 5.37, yield: 0.9 },
      { year: 2022, amount: 4.50, yield: 0.8 },
    ],
  },
  {
    ticker: "PLW", name: "PlayWay S.A.", sector: "Gry",
    divPerShare: 5.50, divYield: 2.0,
    exDate: "2026-06-03", payDate: "2026-06-24", recordDate: "2026-06-05",
    year: 2025, frequency: "roczna", payoutRatio: 40, streak: 5, status: "Prognoza",
    history: [
      { year: 2024, amount: 5.00, yield: 1.8 },
      { year: 2023, amount: 4.50, yield: 1.5 },
      { year: 2022, amount: 4.00, yield: 1.3 },
    ],
  },
  {
    ticker: "KRU", name: "Kruk S.A.", sector: "Finanse",
    divPerShare: 20.00, divYield: 3.5,
    exDate: "2026-06-10", payDate: "2026-07-01", recordDate: "2026-06-12",
    year: 2025, frequency: "roczna", payoutRatio: 35, streak: 11, status: "Prognoza",
    history: [
      { year: 2024, amount: 18.00, yield: 3.4 },
      { year: 2023, amount: 16.00, yield: 3.1 },
      { year: 2022, amount: 14.00, yield: 3.0 },
    ],
  },
  {
    ticker: "NEU", name: "Neuca S.A.", sector: "Farmacja",
    divPerShare: 13.00, divYield: 1.4,
    exDate: "2026-06-10", payDate: "2026-07-01", recordDate: "2026-06-12",
    year: 2025, frequency: "roczna", payoutRatio: 30, streak: 16, status: "Prognoza",
    history: [
      { year: 2024, amount: 12.00, yield: 1.4 },
      { year: 2023, amount: 11.00, yield: 1.3 },
      { year: 2022, amount: 9.50, yield: 1.2 },
    ],
  },
  {
    ticker: "TEN", name: "Ten Square Games S.A.", sector: "Gry",
    divPerShare: 3.50, divYield: 5.5,
    exDate: "2026-06-10", payDate: "2026-07-01", recordDate: "2026-06-12",
    year: 2025, frequency: "roczna", payoutRatio: 70, streak: 5, status: "Prognoza",
    history: [
      { year: 2024, amount: 3.00, yield: 5.8 },
      { year: 2023, amount: 5.00, yield: 7.0 },
      { year: 2022, amount: 8.00, yield: 8.5 },
    ],
  },
  {
    ticker: "WWL", name: "Wawel S.A.", sector: "Spożywczy",
    divPerShare: 26.00, divYield: 3.5,
    exDate: "2026-06-10", payDate: "2026-07-01", recordDate: "2026-06-12",
    year: 2025, frequency: "roczna", payoutRatio: 55, streak: 19, status: "Prognoza",
    history: [
      { year: 2024, amount: 25.00, yield: 3.5 },
      { year: 2023, amount: 20.00, yield: 3.0 },
      { year: 2022, amount: 15.00, yield: 2.5 },
    ],
  },
  {
    ticker: "DNP", name: "DINO Polska S.A.", sector: "Handel",
    divPerShare: 1.40, divYield: 0.3,
    exDate: "2026-06-17", payDate: "2026-07-08", recordDate: "2026-06-19",
    year: 2025, frequency: "roczna", payoutRatio: 10, streak: 7, status: "Prognoza",
    history: [
      { year: 2024, amount: 1.20, yield: 0.3 },
      { year: 2023, amount: 1.00, yield: 0.3 },
      { year: 2022, amount: 1.00, yield: 0.2 },
    ],
  },
  {
    ticker: "CDR", name: "CD Projekt S.A.", sector: "Gry",
    divPerShare: 1.20, divYield: 0.5,
    exDate: "2026-06-17", payDate: "2026-07-08", recordDate: "2026-06-19",
    year: 2025, frequency: "roczna", payoutRatio: 15, streak: 2, status: "Prognoza",
    history: [
      { year: 2024, amount: 1.00, yield: 0.5 },
      { year: 2023, amount: 1.00, yield: 0.4 },
      { year: 2022, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "MBR", name: "Mo-BRUK S.A.", sector: "Usługi środowiskowe",
    divPerShare: 8.50, divYield: 4.5,
    exDate: "2026-06-17", payDate: "2026-07-08", recordDate: "2026-06-19",
    year: 2025, frequency: "roczna", payoutRatio: 60, streak: 6, status: "Prognoza",
    history: [
      { year: 2024, amount: 8.00, yield: 4.5 },
      { year: 2023, amount: 7.50, yield: 4.2 },
      { year: 2022, amount: 14.00, yield: 6.5 },
    ],
  },

  // ─── Prognozy (koniec czerwca – lipiec 2026) ─────────────────────
  {
    ticker: "SPL", name: "Santander Bank Polska S.A.", sector: "Banki",
    divPerShare: 36.00, divYield: 6.0,
    exDate: "2026-06-24", payDate: "2026-07-15", recordDate: "2026-06-26",
    year: 2025, frequency: "roczna", payoutRatio: 75, streak: 4, status: "Prognoza",
    history: [
      { year: 2024, amount: 28.80, yield: 5.3 },
      { year: 2023, amount: 25.00, yield: 4.9 },
      { year: 2022, amount: 7.00, yield: 2.1 },
    ],
  },
  {
    ticker: "UNI", name: "Unimot S.A.", sector: "Energetyka",
    divPerShare: 5.00, divYield: 6.5,
    exDate: "2026-06-24", payDate: "2026-07-15", recordDate: "2026-06-26",
    year: 2025, frequency: "roczna", payoutRatio: 50, streak: 7, status: "Prognoza",
    history: [
      { year: 2024, amount: 4.50, yield: 6.4 },
      { year: 2023, amount: 4.00, yield: 5.8 },
      { year: 2022, amount: 5.00, yield: 7.2 },
    ],
  },
  {
    ticker: "STS", name: "STS Holding S.A.", sector: "Rozrywka",
    divPerShare: 1.50, divYield: 6.0,
    exDate: "2026-06-24", payDate: "2026-07-15", recordDate: "2026-06-26",
    year: 2025, frequency: "roczna", payoutRatio: 70, streak: 4, status: "Prognoza",
    history: [
      { year: 2024, amount: 1.40, yield: 6.5 },
      { year: 2023, amount: 1.20, yield: 5.8 },
      { year: 2022, amount: 1.00, yield: 4.5 },
    ],
  },
  {
    ticker: "ACP", name: "Asseco Poland S.A.", sector: "Technologia",
    divPerShare: 3.90, divYield: 4.0,
    exDate: "2026-06-24", payDate: "2026-07-15", recordDate: "2026-06-26",
    year: 2025, frequency: "roczna", payoutRatio: 60, streak: 15, status: "Prognoza",
    history: [
      { year: 2024, amount: 3.71, yield: 4.2 },
      { year: 2023, amount: 3.51, yield: 4.0 },
      { year: 2022, amount: 3.01, yield: 3.6 },
    ],
  },
  {
    ticker: "DVL", name: "Develia S.A.", sector: "Nieruchomości",
    divPerShare: 0.50, divYield: 3.5,
    exDate: "2026-06-24", payDate: "2026-07-15", recordDate: "2026-06-26",
    year: 2025, frequency: "roczna", payoutRatio: 45, streak: 5, status: "Prognoza",
    history: [
      { year: 2024, amount: 0.45, yield: 3.5 },
      { year: 2023, amount: 0.40, yield: 3.2 },
      { year: 2022, amount: 0.30, yield: 2.8 },
    ],
  },
  {
    ticker: "PHN", name: "Polski Holding Nieruchomości S.A.", sector: "Nieruchomości",
    divPerShare: 0.65, divYield: 4.0,
    exDate: "2026-06-24", payDate: "2026-07-15", recordDate: "2026-06-26",
    year: 2025, frequency: "roczna", payoutRatio: 50, streak: 5, status: "Prognoza",
    history: [
      { year: 2024, amount: 0.58, yield: 3.8 },
      { year: 2023, amount: 0.50, yield: 3.5 },
      { year: 2022, amount: 0.40, yield: 3.0 },
    ],
  },
  {
    ticker: "MIL", name: "Bank Millennium S.A.", sector: "Banki",
    divPerShare: 1.00, divYield: 6.5,
    exDate: "2026-07-01", payDate: "2026-07-22", recordDate: "2026-07-03",
    year: 2025, frequency: "roczna", payoutRatio: 55, streak: 2, status: "Prognoza",
    history: [
      { year: 2024, amount: 0.80, yield: 6.7 },
      { year: 2023, amount: 0, yield: 0 },
      { year: 2022, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "BHW", name: "Bank Handlowy w Warszawie S.A.", sector: "Banki",
    divPerShare: 14.00, divYield: 12.5,
    exDate: "2026-07-01", payDate: "2026-07-22", recordDate: "2026-07-03",
    year: 2025, frequency: "roczna", payoutRatio: 100, streak: 9, status: "Prognoza",
    history: [
      { year: 2024, amount: 10.34, yield: 8.6 },
      { year: 2023, amount: 9.25, yield: 7.8 },
      { year: 2022, amount: 6.16, yield: 6.5 },
    ],
  },
  {
    ticker: "BFT", name: "Benefit Systems S.A.", sector: "HR/Benefity",
    divPerShare: 24.00, divYield: 2.4,
    exDate: "2026-07-01", payDate: "2026-07-22", recordDate: "2026-07-03",
    year: 2025, frequency: "roczna", payoutRatio: 45, streak: 6, status: "Prognoza",
    history: [
      { year: 2024, amount: 20.00, yield: 2.2 },
      { year: 2023, amount: 16.00, yield: 1.8 },
      { year: 2022, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "CPS", name: "Cyfrowy Polsat S.A.", sector: "Media",
    divPerShare: 1.60, divYield: 5.5,
    exDate: "2026-07-01", payDate: "2026-07-22", recordDate: "2026-07-03",
    year: 2025, frequency: "roczna", payoutRatio: 65, streak: 11, status: "Prognoza",
    history: [
      { year: 2024, amount: 1.50, yield: 5.5 },
      { year: 2023, amount: 1.00, yield: 4.0 },
      { year: 2022, amount: 0.70, yield: 3.5 },
    ],
  },
  {
    ticker: "PEO", name: "Bank Pekao S.A.", sector: "Banki",
    divPerShare: 18.00, divYield: 8.5,
    exDate: "2026-07-01", payDate: "2026-07-22", recordDate: "2026-07-03",
    year: 2025, frequency: "roczna", payoutRatio: 75, streak: 5, status: "Prognoza",
    history: [
      { year: 2024, amount: 16.60, yield: 8.2 },
      { year: 2023, amount: 14.99, yield: 7.8 },
      { year: 2022, amount: 9.00, yield: 6.2 },
    ],
  },
  {
    ticker: "PKO", name: "PKO Bank Polski S.A.", sector: "Banki",
    divPerShare: 3.00, divYield: 4.5,
    exDate: "2026-07-08", payDate: "2026-07-29", recordDate: "2026-07-10",
    year: 2025, frequency: "roczna", payoutRatio: 50, streak: 5, status: "Prognoza",
    history: [
      { year: 2024, amount: 2.62, yield: 4.1 },
      { year: 2023, amount: 1.98, yield: 3.3 },
      { year: 2022, amount: 1.44, yield: 3.0 },
    ],
  },
  {
    ticker: "SNK", name: "Fabryka Farb i Lakierów Śnieżka S.A.", sector: "Chemia",
    divPerShare: 3.10, divYield: 4.5,
    exDate: "2026-07-08", payDate: "2026-07-29", recordDate: "2026-07-10",
    year: 2025, frequency: "roczna", payoutRatio: 55, streak: 13, status: "Prognoza",
    history: [
      { year: 2024, amount: 2.90, yield: 4.5 },
      { year: 2023, amount: 2.60, yield: 4.2 },
      { year: 2022, amount: 2.30, yield: 4.0 },
    ],
  },
  {
    ticker: "FMF", name: "Ferro S.A.", sector: "Przemysł",
    divPerShare: 3.80, divYield: 5.0,
    exDate: "2026-07-08", payDate: "2026-07-29", recordDate: "2026-07-10",
    year: 2025, frequency: "roczna", payoutRatio: 55, streak: 7, status: "Prognoza",
    history: [
      { year: 2024, amount: 3.50, yield: 5.0 },
      { year: 2023, amount: 3.20, yield: 4.8 },
      { year: 2022, amount: 2.80, yield: 4.5 },
    ],
  },
  {
    ticker: "KGH", name: "KGHM Polska Miedź S.A.", sector: "Surowce",
    divPerShare: 3.50, divYield: 2.0,
    exDate: "2026-07-15", payDate: "2026-08-05", recordDate: "2026-07-17",
    year: 2025, frequency: "roczna", payoutRatio: 30, streak: 4, status: "Prognoza",
    history: [
      { year: 2024, amount: 3.00, yield: 1.8 },
      { year: 2023, amount: 3.00, yield: 2.0 },
      { year: 2022, amount: 1.50, yield: 1.2 },
    ],
  },
  {
    ticker: "STP", name: "Stalprodukt S.A.", sector: "Przemysł",
    divPerShare: 16.00, divYield: 3.8,
    exDate: "2026-07-15", payDate: "2026-08-05", recordDate: "2026-07-17",
    year: 2025, frequency: "roczna", payoutRatio: 50, streak: 23, status: "Prognoza",
    history: [
      { year: 2024, amount: 15.00, yield: 3.8 },
      { year: 2023, amount: 12.00, yield: 3.2 },
      { year: 2022, amount: 10.00, yield: 3.0 },
    ],
  },
  {
    ticker: "CMR", name: "Comarch S.A.", sector: "Technologia",
    divPerShare: 3.00, divYield: 1.2,
    exDate: "2026-07-15", payDate: "2026-08-05", recordDate: "2026-07-17",
    year: 2025, frequency: "roczna", payoutRatio: 25, streak: 9, status: "Prognoza",
    history: [
      { year: 2024, amount: 3.00, yield: 1.2 },
      { year: 2023, amount: 3.00, yield: 1.0 },
      { year: 2022, amount: 3.00, yield: 1.2 },
    ],
  },

  // ─── Prognozy (druga połowa lipca – sierpień 2026) ───────────────
  {
    ticker: "PKN", name: "PKN ORLEN S.A.", sector: "Energetyka",
    divPerShare: 4.50, divYield: 5.5,
    exDate: "2026-07-22", payDate: "2026-08-12", recordDate: "2026-07-24",
    year: 2025, frequency: "roczna", payoutRatio: 40, streak: 9, status: "Prognoza",
    history: [
      { year: 2024, amount: 4.15, yield: 5.6 },
      { year: 2023, amount: 5.50, yield: 6.8 },
      { year: 2022, amount: 3.50, yield: 4.6 },
    ],
  },
  {
    ticker: "GPW", name: "GPW S.A.", sector: "Finanse",
    divPerShare: 3.25, divYield: 5.0,
    exDate: "2026-07-22", payDate: "2026-08-05", recordDate: "2026-07-24",
    year: 2025, frequency: "roczna", payoutRatio: 72, streak: 13, status: "Prognoza",
    history: [
      { year: 2024, amount: 3.15, yield: 6.1 },
      { year: 2023, amount: 2.80, yield: 5.8 },
      { year: 2022, amount: 2.40, yield: 5.5 },
    ],
  },
  {
    ticker: "PCR", name: "PCC Rokita S.A.", sector: "Chemia",
    divPerShare: 7.00, divYield: 5.5,
    exDate: "2026-07-22", payDate: "2026-08-12", recordDate: "2026-07-24",
    year: 2025, frequency: "roczna", payoutRatio: 60, streak: 9, status: "Prognoza",
    history: [
      { year: 2024, amount: 6.50, yield: 5.2 },
      { year: 2023, amount: 5.50, yield: 4.8 },
      { year: 2022, amount: 8.00, yield: 6.5 },
    ],
  },
  {
    ticker: "ALR", name: "Alior Bank S.A.", sector: "Banki",
    divPerShare: 5.00, divYield: 4.5,
    exDate: "2026-07-22", payDate: "2026-08-12", recordDate: "2026-07-24",
    year: 2025, frequency: "roczna", payoutRatio: 50, streak: 3, status: "Prognoza",
    history: [
      { year: 2024, amount: 4.40, yield: 4.0 },
      { year: 2023, amount: 2.20, yield: 2.5 },
      { year: 2022, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "APR", name: "Apator S.A.", sector: "Przemysł",
    divPerShare: 0.55, divYield: 3.0,
    exDate: "2026-07-29", payDate: "2026-08-19", recordDate: "2026-07-31",
    year: 2025, frequency: "roczna", payoutRatio: 45, streak: 13, status: "Prognoza",
    history: [
      { year: 2024, amount: 0.50, yield: 3.0 },
      { year: 2023, amount: 0.50, yield: 3.2 },
      { year: 2022, amount: 0.50, yield: 3.5 },
    ],
  },
  {
    ticker: "PGE", name: "PGE Polska Grupa Energetyczna S.A.", sector: "Energetyka",
    divPerShare: 0.42, divYield: 4.5,
    exDate: "2026-08-05", payDate: "2026-08-26", recordDate: "2026-08-07",
    year: 2025, frequency: "roczna", payoutRatio: 40, streak: 3, status: "Prognoza",
    history: [
      { year: 2024, amount: 0.38, yield: 4.8 },
      { year: 2023, amount: 0.25, yield: 3.2 },
      { year: 2022, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "MBK", name: "mBank S.A.", sector: "Banki",
    divPerShare: 35.00, divYield: 4.8,
    exDate: "2026-08-12", payDate: "2026-09-02", recordDate: "2026-08-14",
    year: 2025, frequency: "roczna", payoutRatio: 55, streak: 3, status: "Prognoza",
    history: [
      { year: 2024, amount: 32.20, yield: 4.6 },
      { year: 2023, amount: 20.30, yield: 3.0 },
      { year: 2022, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "LWB", name: "Bogdanka S.A.", sector: "Surowce",
    divPerShare: 4.00, divYield: 7.0,
    exDate: "2026-08-12", payDate: "2026-09-02", recordDate: "2026-08-14",
    year: 2025, frequency: "roczna", payoutRatio: 55, streak: 7, status: "Prognoza",
    history: [
      { year: 2024, amount: 5.20, yield: 8.9 },
      { year: 2023, amount: 7.50, yield: 10.5 },
      { year: 2022, amount: 10.00, yield: 12.0 },
    ],
  },
  {
    ticker: "ZAB", name: "Żabka Group S.A.", sector: "Handel",
    divPerShare: 1.20, divYield: 2.0,
    exDate: "2026-08-26", payDate: "2026-09-16", recordDate: "2026-08-28",
    year: 2025, frequency: "roczna", payoutRatio: 28, streak: 2, status: "Prognoza",
    history: [
      { year: 2024, amount: 1.00, yield: 2.0 },
      { year: 2023, amount: 0, yield: 0 },
      { year: 2022, amount: 0, yield: 0 },
    ],
  },

  // ─── Prognozy (wrzesień–grudzień 2026) ────────────────────────────
  {
    ticker: "PZU", name: "PZU S.A.", sector: "Ubezpieczenia",
    divPerShare: 3.10, divYield: 5.5,
    exDate: "2026-09-09", payDate: "2026-09-30", recordDate: "2026-09-11",
    year: 2025, frequency: "roczna", payoutRatio: 75, streak: 13, status: "Prognoza",
    history: [
      { year: 2024, amount: 2.90, yield: 5.8 },
      { year: 2023, amount: 2.80, yield: 5.6 },
      { year: 2022, amount: 2.40, yield: 5.2 },
    ],
  },
  {
    ticker: "CCC", name: "CCC S.A.", sector: "Handel",
    divPerShare: 4.00, divYield: 2.0,
    exDate: "2026-09-16", payDate: "2026-10-07", recordDate: "2026-09-18",
    year: 2025, frequency: "roczna", payoutRatio: 28, streak: 2, status: "Prognoza",
    history: [
      { year: 2024, amount: 3.50, yield: 1.8 },
      { year: 2023, amount: 0, yield: 0 },
      { year: 2022, amount: 0, yield: 0 },
    ],
  },
  {
    ticker: "ASB", name: "ASBISc Enterprises Plc", sector: "Technologia",
    divPerShare: 0.80, divYield: 2.8,
    exDate: "2026-11-16", payDate: "2026-11-26", recordDate: "2026-11-18",
    year: 2025, frequency: "roczna", payoutRatio: 42, streak: 7, status: "Prognoza",
    history: [
      { year: 2024, amount: 0.74, yield: 2.6 },
      { year: 2023, amount: 0.80, yield: 3.0 },
      { year: 2022, amount: 1.00, yield: 4.5 },
    ],
  },
  {
    ticker: "AMB", name: "Ambra S.A.", sector: "Spożywczy",
    divPerShare: 1.30, divYield: 4.2,
    exDate: "2026-12-09", payDate: "2026-12-30", recordDate: "2026-12-11",
    year: 2025, frequency: "roczna", payoutRatio: 60, streak: 19, status: "Prognoza",
    history: [
      { year: 2024, amount: 1.20, yield: 4.2 },
      { year: 2023, amount: 1.10, yield: 4.0 },
      { year: 2022, amount: 1.00, yield: 3.8 },
    ],
  },
];

/**
 * Miesiące po polsku
 */
export const MONTHS_PL = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
];

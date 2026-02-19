import { useState, useEffect, useMemo, useCallback } from "react";
import ReactDOM from "react-dom/client";

const DARK_THEME = {
  bgPage: "#010409",
  bgCard: "#0d1117",
  bgCardAlt: "#161b22",
  border: "#21262d",
  borderInput: "#30363d",
  text: "#c9d1d9",
  textSecondary: "#8b949e",
  textBright: "#e6edf3",
  accent: "#58a6ff",
  fearGaugeBg: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
};

const LIGHT_THEME = {
  bgPage: "#f6f8fa",
  bgCard: "#ffffff",
  bgCardAlt: "#f0f2f5",
  border: "#d0d7de",
  borderInput: "#d0d7de",
  text: "#24292f",
  textSecondary: "#656d76",
  textBright: "#1f2328",
  accent: "#0969da",
  fearGaugeBg: "linear-gradient(135deg, #ffffff 0%, #f0f2f5 100%)",
};

async function fetchStooq(symbol) {
  try {
    const res = await fetch(`/api/stooq?symbol=${symbol}`);
    const data = await res.json();
    return data;
  } catch { return null; }
}

async function fetchBulk(symbols) {
  try {
    const res = await fetch(`/api/gpw-bulk?symbols=${symbols.join(",")}`);
    return await res.json();
  } catch { return {}; }
}

async function fetchHistory(symbol) {
  try {
    const res = await fetch(`/api/history?symbol=${symbol}`);
    const data = await res.json();
    return data;
  } catch { return null; }
}

async function fetchIndices() {
  try {
    const res = await fetch("/api/indices");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

const STOCKS = [
  // ─── WIG20 ───────────────────────────────────────────────────
  { id: 1, ticker: "PKN", stooq: "pkn", name: "PKN ORLEN", sector: "Energetyka", price: 0, cap: 74500, pe: 8.2, div: 5.1 },
  { id: 2, ticker: "PKO", stooq: "pko", name: "PKO Bank Polski", sector: "Banki", price: 0, cap: 58200, pe: 10.1, div: 6.8 },
  { id: 3, ticker: "PZU", stooq: "pzu", name: "PZU SA", sector: "Ubezpieczenia", price: 0, cap: 41800, pe: 11.3, div: 8.2 },
  { id: 4, ticker: "KGH", stooq: "kgh", name: "KGHM Polska Miedź", sector: "Surowce", price: 0, cap: 35600, pe: 12.8, div: 3.5 },
  { id: 5, ticker: "CDR", stooq: "cdr", name: "CD Projekt", sector: "Gry", price: 0, cap: 17200, pe: 35.6, div: 0 },
  { id: 6, ticker: "LPP", stooq: "lpp", name: "LPP SA", sector: "Handel", price: 0, cap: 31400, pe: 28.4, div: 1.2 },
  { id: 7, ticker: "ALE", stooq: "ale", name: "Allegro.eu", sector: "E-commerce", price: 0, cap: 24600, pe: 22.1, div: 0 },
  { id: 8, ticker: "PEO", stooq: "peo", name: "Bank Pekao", sector: "Banki", price: 0, cap: 18700, pe: 9.5, div: 7.4 },
  { id: 9, ticker: "DNP", stooq: "dnp", name: "Dino Polska", sector: "Handel", price: 0, cap: 15300, pe: 24.7, div: 0 },
  { id: 10, ticker: "SPL", stooq: "spl", name: "Santander Bank Polska", sector: "Banki", price: 0, cap: 14200, pe: 10.8, div: 5.2 },
  { id: 11, ticker: "CPS", stooq: "cps", name: "Cyfrowy Polsat", sector: "Media", price: 0, cap: 12400, pe: 9.2, div: 4.8 },
  { id: 12, ticker: "ING", stooq: "ing", name: "ING Bank Śląski", sector: "Banki", price: 0, cap: 12800, pe: 13.2, div: 5.8 },
  { id: 13, ticker: "PGE", stooq: "pge", name: "PGE Polska Grupa Energetyczna", sector: "Energetyka", price: 0, cap: 14100, pe: 6.8, div: 4.2 },
  { id: 14, ticker: "MBK", stooq: "mbk", name: "mBank", sector: "Banki", price: 0, cap: 8900, pe: 11.8, div: 2.1 },
  { id: 15, ticker: "KTY", stooq: "kty", name: "Grupa Kęty", sector: "Przemysł", price: 0, cap: 5200, pe: 14.2, div: 3.8 },
  { id: 16, ticker: "JSW", stooq: "jsw", name: "JSW SA", sector: "Surowce", price: 0, cap: 4200, pe: 4.1, div: 0 },
  { id: 17, ticker: "BDX", stooq: "bdx", name: "Budimex", sector: "Budownictwo", price: 0, cap: 5900, pe: 18.2, div: 6.1 },
  { id: 18, ticker: "KRU", stooq: "kru", name: "Kruk SA", sector: "Finanse", price: 0, cap: 4800, pe: 12.4, div: 3.8 },
  { id: 19, ticker: "CCC", stooq: "ccc", name: "CCC SA", sector: "Handel", price: 0, cap: 6800, pe: 0, div: 0 },
  { id: 20, ticker: "OPL", stooq: "opl", name: "Orange Polska", sector: "Telekomunikacja", price: 0, cap: 6100, pe: 18.4, div: 5.5 },
  // ─── mWIG40 ──────────────────────────────────────────────────
  { id: 21, ticker: "TPE", stooq: "tpe", name: "Tauron Polska Energia", sector: "Energetyka", price: 0, cap: 4800, pe: 5.9, div: 0 },
  { id: 22, ticker: "ACP", stooq: "acp", name: "Asseco Poland", sector: "Technologia", price: 0, cap: 4100, pe: 19.8, div: 4.3 },
  { id: 23, ticker: "ALR", stooq: "alr", name: "Alior Bank", sector: "Banki", price: 0, cap: 3800, pe: 7.2, div: 2.4 },
  { id: 24, ticker: "MIL", stooq: "mil", name: "Bank Millennium", sector: "Banki", price: 0, cap: 4200, pe: 8.9, div: 3.1 },
  { id: 25, ticker: "BHW", stooq: "bhw", name: "Bank Handlowy", sector: "Banki", price: 0, cap: 3600, pe: 10.4, div: 8.2 },
  { id: 26, ticker: "AMR", stooq: "eat", name: "AmRest Holdings", sector: "Restauracje", price: 0, cap: 2100, pe: 0, div: 0 },
  { id: 27, ticker: "BFT", stooq: "bft", name: "Benefit Systems", sector: "HR/Benefity", price: 0, cap: 3200, pe: 24.8, div: 2.1 },
  { id: 28, ticker: "CMR", stooq: "cmr", name: "Comarch", sector: "Technologia", price: 0, cap: 2800, pe: 22.4, div: 1.8 },
  { id: 29, ticker: "DOM", stooq: "dom", name: "Dom Development", sector: "Nieruchomości", price: 0, cap: 3100, pe: 8.4, div: 9.2 },
  { id: 30, ticker: "ENA", stooq: "ena", name: "Enea SA", sector: "Energetyka", price: 0, cap: 4200, pe: 5.4, div: 0 },
  { id: 31, ticker: "EUR", stooq: "eur", name: "Eurocash", sector: "Handel", price: 0, cap: 1800, pe: 12.4, div: 2.1 },
  { id: 32, ticker: "GPW", stooq: "gpw", name: "Giełda Papierów Wartościowych", sector: "Finanse", price: 0, cap: 1700, pe: 16.3, div: 7.2 },
  { id: 33, ticker: "GTC", stooq: "gtc", name: "Globe Trade Centre", sector: "Nieruchomości", price: 0, cap: 1900, pe: 0, div: 3.2 },
  { id: 34, ticker: "LVC", stooq: "lvc", name: "LiveChat Software", sector: "Technologia", price: 0, cap: 2800, pe: 18.6, div: 4.1 },
  { id: 35, ticker: "NEU", stooq: "neu", name: "Neuca SA", sector: "Medycyna", price: 0, cap: 2400, pe: 14.2, div: 3.2 },
  { id: 36, ticker: "CIE", stooq: "cie", name: "Ciech SA", sector: "Chemia", price: 0, cap: 2100, pe: 8.6, div: 0 },
  { id: 37, ticker: "DVL", stooq: "dvl", name: "Develia", sector: "Nieruchomości", price: 0, cap: 1800, pe: 6.2, div: 5.8 },
  { id: 38, ticker: "ECH", stooq: "ech", name: "Echo Investment", sector: "Nieruchomości", price: 0, cap: 1600, pe: 7.8, div: 6.4 },
  { id: 39, ticker: "ENG", stooq: "eng", name: "Energa SA", sector: "Energetyka", price: 0, cap: 3400, pe: 9.1, div: 3.2 },
  { id: 40, ticker: "XTB", stooq: "xtb", name: "XTB SA", sector: "Finanse", price: 0, cap: 6200, pe: 9.8, div: 8.4 },
  { id: 41, ticker: "TXT", stooq: "txt", name: "Text SA (LiveChat)", sector: "Technologia", price: 0, cap: 3400, pe: 16.2, div: 4.8 },
  { id: 42, ticker: "WPL", stooq: "wpl", name: "Wirtualna Polska", sector: "Media", price: 0, cap: 2200, pe: 14.8, div: 2.4 },
  { id: 43, ticker: "ASE", stooq: "ase", name: "Asseco SEE", sector: "Technologia", price: 0, cap: 2100, pe: 16.8, div: 2.8 },
  { id: 44, ticker: "MRC", stooq: "mrc", name: "Mercator Medical", sector: "Medycyna", price: 0, cap: 890, pe: 8.7, div: 0 },
  { id: 45, ticker: "LWB", stooq: "lwb", name: "Bogdanka (LW Bogdanka)", sector: "Surowce", price: 0, cap: 2400, pe: 6.2, div: 5.4 },
  { id: 46, ticker: "ATT", stooq: "att", name: "Grupa Azoty", sector: "Chemia", price: 0, cap: 2800, pe: 0, div: 0 },
  { id: 47, ticker: "PHN", stooq: "phn", name: "Polski Holding Nieruchomości", sector: "Nieruchomości", price: 0, cap: 1800, pe: 0, div: 4.8 },
  { id: 48, ticker: "MAB", stooq: "mab", name: "Mabion", sector: "Biotechnologia", price: 0, cap: 420, pe: 0, div: 0 },
  { id: 49, ticker: "CAR", stooq: "car", name: "Inter Cars", sector: "Motoryzacja", price: 0, cap: 4200, pe: 12.1, div: 2.4 },
  { id: 50, ticker: "PXM", stooq: "pxm", name: "Polimex-Mostostal", sector: "Budownictwo", price: 0, cap: 680, pe: 0, div: 0 },
  { id: 51, ticker: "STP", stooq: "stp", name: "Stalprodukt", sector: "Przemysł", price: 0, cap: 1200, pe: 10.4, div: 4.2 },
  { id: 52, ticker: "APR", stooq: "apr", name: "Auto Partner", sector: "Motoryzacja", price: 0, cap: 1600, pe: 11.2, div: 2.8 },
  { id: 53, ticker: "PKP", stooq: "pkp", name: "PKP Cargo", sector: "Transport", price: 0, cap: 890, pe: 0, div: 0 },
  { id: 54, ticker: "ATC", stooq: "atc", name: "Arctic Paper", sector: "Przemysł", price: 0, cap: 920, pe: 5.8, div: 6.2 },
  { id: 55, ticker: "1AT", stooq: "1at", name: "Atal SA", sector: "Nieruchomości", price: 0, cap: 2100, pe: 7.4, div: 8.6 },
  // ─── sWIG80 (wybrane) ────────────────────────────────────────
  { id: 56, ticker: "VGO", stooq: "vgo", name: "Vigo Photonics", sector: "Technologia", price: 0, cap: 890, pe: 28.4, div: 0 },
  { id: 57, ticker: "WAR", stooq: "war", name: "Wawel SA", sector: "Spożywczy", price: 0, cap: 890, pe: 16.4, div: 4.2 },
  { id: 58, ticker: "SNK", stooq: "snk", name: "Sanok Rubber Company", sector: "Przemysł", price: 0, cap: 620, pe: 11.4, div: 4.2 },
  { id: 59, ticker: "SGN", stooq: "sgn", name: "Selvita", sector: "Biotechnologia", price: 0, cap: 580, pe: 0, div: 0 },
  { id: 60, ticker: "SKA", stooq: "ska", name: "Skarbiec Holding", sector: "Finanse", price: 0, cap: 180, pe: 14.2, div: 5.8 },
  { id: 61, ticker: "11B", stooq: "11b", name: "11 bit studios", sector: "Gry", price: 0, cap: 1400, pe: 32.6, div: 0 },
  { id: 62, ticker: "HUG", stooq: "hug", name: "Huuuge Inc.", sector: "Gry", price: 0, cap: 680, pe: 0, div: 0 },
  { id: 63, ticker: "TEN", stooq: "ten", name: "Ten Square Games", sector: "Gry", price: 0, cap: 320, pe: 0, div: 0 },
  { id: 64, ticker: "PCR", stooq: "pcr", name: "PGNiG (zintegrowane z PKN)", sector: "Energetyka", price: 0, cap: 11200, pe: 7.2, div: 6.1 },
  { id: 65, ticker: "NTT", stooq: "ntt", name: "NTT System", sector: "Technologia", price: 0, cap: 98, pe: 12.1, div: 0 },
  { id: 66, ticker: "ZEP", stooq: "zep", name: "ZE PAK", sector: "Energetyka", price: 0, cap: 1200, pe: 6.4, div: 4.1 },
  { id: 67, ticker: "VRG", stooq: "vrg", name: "VRG SA", sector: "Handel", price: 0, cap: 580, pe: 9.8, div: 3.4 },
  { id: 68, ticker: "TRK", stooq: "trk", name: "Trakcja SA", sector: "Budownictwo", price: 0, cap: 280, pe: 0, div: 0 },
  { id: 69, ticker: "VOX", stooq: "vox", name: "Voxel SA", sector: "Medycyna", price: 0, cap: 480, pe: 14.2, div: 2.8 },
  { id: 70, ticker: "TOA", stooq: "toa", name: "Toya SA", sector: "Handel", price: 0, cap: 320, pe: 8.4, div: 3.2 },
  { id: 71, ticker: "KER", stooq: "ker", name: "Kernel Holding", sector: "Rolnictwo", price: 0, cap: 1200, pe: 0, div: 0 },
  { id: 72, ticker: "ENT", stooq: "ent", name: "Enter Air", sector: "Transport", price: 0, cap: 420, pe: 6.8, div: 0 },
  { id: 73, ticker: "CLN", stooq: "cln", name: "Clovin SA", sector: "FMCG", price: 0, cap: 140, pe: 0, div: 0 },
  { id: 74, ticker: "WLT", stooq: "wlt", name: "Wielton SA", sector: "Przemysł", price: 0, cap: 680, pe: 8.4, div: 3.2 },
  { id: 75, ticker: "RFK", stooq: "rfk", name: "Rafako SA", sector: "Przemysł", price: 0, cap: 210, pe: 0, div: 0 },
  { id: 76, ticker: "RBW", stooq: "rbw", name: "Rainbow Tours", sector: "Turystyka", price: 0, cap: 680, pe: 10.2, div: 2.4 },
  { id: 77, ticker: "IZO", stooq: "izo", name: "Izolacja Jarocin", sector: "Budownictwo", price: 0, cap: 120, pe: 0, div: 0 },
  { id: 78, ticker: "ABS", stooq: "abs", name: "Asseco Business Solutions", sector: "Technologia", price: 0, cap: 1400, pe: 18.4, div: 4.2 },
  { id: 79, ticker: "AGO", stooq: "ago", name: "Agora SA", sector: "Media", price: 0, cap: 620, pe: 0, div: 0 },
  { id: 80, ticker: "AMC", stooq: "amc", name: "Amica SA", sector: "AGD", price: 0, cap: 780, pe: 12.3, div: 3.5 },
  { id: 81, ticker: "BIO", stooq: "bio", name: "Bioton SA", sector: "Biotechnologia", price: 0, cap: 210, pe: 0, div: 0 },
  { id: 82, ticker: "EMC", stooq: "emc", name: "EMC Instytut Medyczny", sector: "Medycyna", price: 0, cap: 230, pe: 16.4, div: 2.8 },
  { id: 83, ticker: "EAT", stooq: "eat", name: "AmRest Holdings", sector: "Restauracje", price: 0, cap: 4200, pe: 18.2, div: 0 },
  { id: 84, ticker: "CIG", stooq: "cig", name: "CI Games", sector: "Gry", price: 0, cap: 1200, pe: 0, div: 0 },
  { id: 85, ticker: "MBR", stooq: "mbr", name: "Mo-BRUK", sector: "Ekologia", price: 0, cap: 1800, pe: 14.2, div: 5.8 },
  { id: 86, ticker: "MFO", stooq: "mfo", name: "MFO SA", sector: "Przemysł", price: 0, cap: 320, pe: 8.4, div: 6.2 },
  { id: 87, ticker: "PLW", stooq: "plw", name: "Playway SA", sector: "Gry", price: 0, cap: 1600, pe: 12.8, div: 6.4 },
  { id: 88, ticker: "SLV", stooq: "slv", name: "Silvair", sector: "Technologia", price: 0, cap: 80, pe: 0, div: 0 },
  { id: 89, ticker: "GRN", stooq: "grn", name: "Grenevia (Famur)", sector: "Przemysł", price: 0, cap: 1400, pe: 0, div: 0 },
  { id: 90, ticker: "TOR", stooq: "tor", name: "Torowa", sector: "Budownictwo", price: 0, cap: 180, pe: 0, div: 0 },
  { id: 91, ticker: "UNI", stooq: "uni", name: "Unimot SA", sector: "Energetyka", price: 0, cap: 680, pe: 6.4, div: 4.2 },
  { id: 92, ticker: "ZWC", stooq: "zwc", name: "Żywiec SA", sector: "Spożywczy", price: 0, cap: 2800, pe: 18.4, div: 6.8 },
  { id: 93, ticker: "MRB", stooq: "mrb", name: "Mirbud SA", sector: "Budownictwo", price: 0, cap: 680, pe: 6.8, div: 3.2 },
  { id: 94, ticker: "KST", stooq: "kst", name: "Konsorcjum Stali", sector: "Przemysł", price: 0, cap: 420, pe: 8.2, div: 4.8 },
  { id: 95, ticker: "MOL", stooq: "mol", name: "Monnari Trade", sector: "Handel", price: 0, cap: 140, pe: 0, div: 0 },
  { id: 96, ticker: "STX", stooq: "stx", name: "Stalprofil SA", sector: "Przemysł", price: 0, cap: 320, pe: 6.2, div: 5.4 },
  { id: 97, ticker: "WWL", stooq: "wwl", name: "Wawrzaszek ISS", sector: "Technologia", price: 0, cap: 80, pe: 0, div: 0 },
  { id: 98, ticker: "MLB", stooq: "mlb", name: "Milog SA", sector: "Transport", price: 0, cap: 120, pe: 0, div: 0 },
  { id: 99, ticker: "OPN", stooq: "opn", name: "Oponeo.pl", sector: "E-commerce", price: 0, cap: 480, pe: 14.2, div: 2.4 },
  { id: 100, ticker: "KGN", stooq: "kgn", name: "Kogeneracja SA", sector: "Energetyka", price: 0, cap: 890, pe: 10.2, div: 4.8 },
  { id: 101, ticker: "IMP", stooq: "imp", name: "Impel SA", sector: "Usługi", price: 0, cap: 280, pe: 0, div: 0 },
  { id: 102, ticker: "ELT", stooq: "elt", name: "Elemental Holding", sector: "Surowce", price: 0, cap: 340, pe: 0, div: 0 },
  { id: 103, ticker: "RPC", stooq: "rpc", name: "Relpol SA", sector: "Przemysł", price: 0, cap: 80, pe: 12.4, div: 4.8 },
  { id: 104, ticker: "PEP", stooq: "pep", name: "Pepco Group", sector: "Handel", price: 0, cap: 8400, pe: 18.4, div: 0 },
  { id: 105, ticker: "ZAP", stooq: "zap", name: "Grupa Azoty Puławy", sector: "Chemia", price: 0, cap: 1800, pe: 0, div: 0 },
  { id: 106, ticker: "FMF", stooq: "fmf", name: "Ferro SA", sector: "Przemysł", price: 0, cap: 420, pe: 8.4, div: 5.2 },
  { id: 107, ticker: "ACE", stooq: "ace", name: "Asseco Central Europe", sector: "Technologia", price: 0, cap: 680, pe: 14.8, div: 3.8 },
  { id: 108, ticker: "AST", stooq: "ast", name: "ASBISc Enterprises", sector: "Technologia", price: 0, cap: 1200, pe: 6.4, div: 4.2 },
  { id: 109, ticker: "KPL", stooq: "kpl", name: "Kęty Profiles (KETY)", sector: "Przemysł", price: 0, cap: 180, pe: 0, div: 0 },
  { id: 110, ticker: "VIN", stooq: "vin", name: "Vindexus SA", sector: "Finanse", price: 0, cap: 140, pe: 8.2, div: 5.4 },
  { id: 111, ticker: "DCR", stooq: "dcr", name: "Decora SA", sector: "Budownictwo", price: 0, cap: 320, pe: 10.8, div: 4.2 },
  { id: 112, ticker: "SES", stooq: "ses", name: "Sescom SA", sector: "Technologia", price: 0, cap: 80, pe: 0, div: 0 },
  { id: 113, ticker: "CNT", stooq: "cnt", name: "Centrum Nowoczesnych Technologii", sector: "Budownictwo", price: 0, cap: 89, pe: 0, div: 0 },
  { id: 114, ticker: "SWG", stooq: "swg", name: "Śnieżka SA", sector: "Chemia", price: 0, cap: 1200, pe: 16.4, div: 4.8 },
  { id: 115, ticker: "KRK", stooq: "krk", name: "Krka d.d.", sector: "Farmacja", price: 0, cap: 4800, pe: 12.8, div: 4.2 },
  { id: 116, ticker: "ERB", stooq: "erb", name: "ERBud SA", sector: "Budownictwo", price: 0, cap: 420, pe: 5.8, div: 3.4 },
  { id: 117, ticker: "ATA", stooq: "ata", name: "Atende SA", sector: "Technologia", price: 0, cap: 98, pe: 0, div: 0 },
  { id: 118, ticker: "HRS", stooq: "hrs", name: "Horsehead Holding", sector: "Przemysł", price: 0, cap: 120, pe: 0, div: 0 },
  { id: 119, ticker: "PGN", stooq: "pgn", name: "Polskie Górnictwo Naftowe i Gazownictwo", sector: "Energetyka", price: 0, cap: 11200, pe: 7.2, div: 6.1 },
  { id: 120, ticker: "MSW", stooq: "msw", name: "Mostostal Warszawa", sector: "Budownictwo", price: 0, cap: 320, pe: 8.4, div: 0 },
  { id: 121, ticker: "OVO", stooq: "ovo", name: "OVOcard SA", sector: "Finanse", price: 0, cap: 80, pe: 0, div: 0 },
  { id: 122, ticker: "NET", stooq: "net", name: "Netia SA", sector: "Telekomunikacja", price: 0, cap: 620, pe: 12.4, div: 0 },
  { id: 123, ticker: "MLG", stooq: "mlg", name: "ML System", sector: "Technologia", price: 0, cap: 320, pe: 0, div: 0 },
  { id: 124, ticker: "SFG", stooq: "sfg", name: "Synektik SA", sector: "Medycyna", price: 0, cap: 480, pe: 22.4, div: 0 },
  { id: 125, ticker: "VOT", stooq: "vot", name: "Votum SA", sector: "Finanse", price: 0, cap: 280, pe: 8.6, div: 4.2 },
  { id: 126, ticker: "TIM", stooq: "tim", name: "TIM SA", sector: "Handel", price: 0, cap: 480, pe: 10.2, div: 3.8 },
  { id: 127, ticker: "MDG", stooq: "mdg", name: "Medicalgorithmics", sector: "Medycyna", price: 0, cap: 140, pe: 0, div: 0 },
  { id: 128, ticker: "APN", stooq: "apn", name: "Action SA", sector: "Technologia", price: 0, cap: 320, pe: 6.8, div: 2.4 },
  { id: 129, ticker: "LBW", stooq: "lbw", name: "Lubawa SA", sector: "Obronność", price: 0, cap: 420, pe: 12.4, div: 2.8 },
  { id: 130, ticker: "PCE", stooq: "pce", name: "PCC Exol", sector: "Chemia", price: 0, cap: 280, pe: 10.4, div: 4.8 },
];

const COMMODITIES = [
  { id: 101, ticker: "XAU", stooq: "xau", name: "Złoto", sector: "Metal szlachetny", price: 0, change24h: 0, change7d: 0, unit: "USD/oz" },
  { id: 102, ticker: "XAG", stooq: "xag", name: "Srebro", sector: "Metal szlachetny", price: 0, change24h: 0, change7d: 0, unit: "USD/oz" },
  { id: 103, ticker: "CL", stooq: "cl.f", name: "Ropa naftowa WTI", sector: "Energia", price: 0, change24h: 0, change7d: 0, unit: "USD/bbl" },
  { id: 104, ticker: "NG", stooq: "ng.f", name: "Gaz ziemny", sector: "Energia", price: 0, change24h: 0, change7d: 0, unit: "USD/MMBtu" },
  { id: 105, ticker: "HG", stooq: "hg.f", name: "Miedź", sector: "Metal przemysłowy", price: 0, change24h: 0, change7d: 0, unit: "USD/lb" },
  { id: 106, ticker: "WEAT", stooq: "weat.us", name: "Pszenica", sector: "Rolnictwo", price: 0, change24h: 0, change7d: 0, unit: "USD/bu" },
  { id: 107, ticker: "CORN", stooq: "corn.us", name: "Kukurydza", sector: "Rolnictwo", price: 0, change24h: 0, change7d: 0, unit: "USD/bu" },
  { id: 108, ticker: "SOY", stooq: "soy.us", name: "Soja", sector: "Rolnictwo", price: 0, change24h: 0, change7d: 0, unit: "USD/bu" },
  { id: 109, ticker: "XPT", stooq: "xpt", name: "Platyna", sector: "Metal szlachetny", price: 0, change24h: 0, change7d: 0, unit: "USD/oz" },
  { id: 110, ticker: "XPD", stooq: "xpd", name: "Pallad", sector: "Metal szlachetny", price: 0, change24h: 0, change7d: 0, unit: "USD/oz" },
];

const FEAR_COMPONENTS = [
  { label: "Momentum rynku", val: 68 },
  { label: "Siła wolumenu", val: 55 },
  { label: "Szerokość rynku", val: 72 },
  { label: "Zmienność (VIX GPW)", val: 44 },
  { label: "Put/Call ratio", val: 60 },
  { label: "Popyt na bezpieczne aktywa", val: 38 },
];

const fmt = (n, d = 2) => n?.toLocaleString("pl-PL", { minimumFractionDigits: d, maximumFractionDigits: d }) ?? "—";
const changeColor = (v) => v > 0 ? "#00c896" : v < 0 ? "#ff4d6d" : "#8b949e";
const changeFmt = (v) => `${v > 0 ? "+" : ""}${fmt(v)}%`;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function generateSparkline(trend) {
  const points = [];
  let val = 50 + Math.random() * 20;
  for (let i = 0; i < 20; i++) {
    val += (Math.random() - 0.5) * 8 + (trend > 0 ? 0.5 : -0.5);
    val = Math.max(20, Math.min(80, val));
    points.push(val);
  }
  const min = Math.min(...points), max = Math.max(...points);
  return points.map((p, i) => `${(i / 19) * 100},${40 - ((p - min) / (max - min + 1)) * 36}`).join(" ");
}

function Sparkline({ trend }) {
  const path = useMemo(() => generateSparkline(trend), [trend]);
  const color = trend >= 0 ? "#00c896" : "#ff4d6d";
  return (
    <svg width="60" height="32" viewBox="0 0 100 40" style={{ display: "block" }}>
      <polyline points={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

function MiniChart({ data, color }) {
  if (!data || data.length < 2) return <div style={{ color: "#8b949e", fontSize: 12, textAlign: "center", padding: "40px 0" }}>Ładowanie wykresu...</div>;
  const gradId = `cg-${color.replace("#", "")}`;
  const prices = data.map(d => d.close);
  const min = Math.min(...prices), max = Math.max(...prices);
  const w = 600, h = 160;
  const pts = prices.map((p, i) => `${(i / (prices.length - 1)) * w},${h - ((p - min) / (max - min + 0.01)) * (h - 20) - 10}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${gradId})`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Marquee Ticker ──────────────────────────────────────────── */
function MarqueeTicker({ stocks, prices, changes, theme, onSelect }) {
  const items = stocks.filter(s => prices[s.ticker]);
  if (!items.length) return null;
  const row = items.map(s => {
    const c = changes[s.ticker]?.change24h ?? 0;
    return (
      <span key={s.ticker} onClick={() => onSelect(s)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "0 18px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
        <span style={{ fontWeight: 700, fontSize: 11, color: theme.textBright }}>{s.ticker}</span>
        <span style={{ fontSize: 11, color: theme.text }}>{fmt(prices[s.ticker])}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: changeColor(c) }}>{changeFmt(c)}</span>
      </span>
    );
  });
  return (
    <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}`, overflow: "hidden", position: "relative", height: 32, display: "flex", alignItems: "center" }}>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      <div style={{ display: "flex", animation: "marquee 60s linear infinite", width: "max-content" }}>
        {row}{row}
      </div>
    </div>
  );
}

/* ─── Heatmap (Treemap) ──────────────────────────────────────── */
function Heatmap({ stocks, prices, changes, theme, onSelect }) {
  const items = stocks
    .map(s => ({ ...s, cap: s.cap || 1, c24h: changes[s.ticker]?.change24h ?? 0, price: prices[s.ticker] }))
    .filter(s => s.price)
    .sort((a, b) => b.cap - a.cap);
  const totalCap = items.reduce((a, s) => a + s.cap, 0);
  if (!totalCap) return null;

  // Simple squarified treemap layout
  const layoutRows = (items, x, y, w, h) => {
    if (!items.length) return [];
    const rects = [];
    let remaining = [...items];
    let cx = x, cy = y, cw = w, ch = h;

    while (remaining.length) {
      const total = remaining.reduce((a, s) => a + s.cap, 0);
      const isWide = cw >= ch;
      const side = isWide ? ch : cw;
      let row = [remaining[0]];
      let rowSum = remaining[0].cap;

      for (let i = 1; i < remaining.length; i++) {
        const nextSum = rowSum + remaining[i].cap;
        const rowFrac = rowSum / total;
        const nextFrac = nextSum / total;
        const rowThick = rowFrac * (isWide ? cw : ch);
        const nextThick = nextFrac * (isWide ? cw : ch);
        // worst aspect ratio for current row vs adding next item
        const worstCur = row.reduce((worst, s) => {
          const len = (s.cap / rowSum) * side;
          const ar = Math.max(rowThick / len, len / rowThick);
          return Math.max(worst, ar);
        }, 0);
        const worstNext = [...row, remaining[i]].reduce((worst, s) => {
          const len = (s.cap / nextSum) * side;
          const ar = Math.max(nextThick / len, len / nextThick);
          return Math.max(worst, ar);
        }, 0);
        if (worstNext <= worstCur) {
          row.push(remaining[i]);
          rowSum = nextSum;
        } else break;
      }

      const rowFrac = rowSum / total;
      const thick = rowFrac * (isWide ? cw : ch);
      let offset = 0;
      for (const s of row) {
        const frac = s.cap / rowSum;
        const len = frac * side;
        const rx = isWide ? cx : cx + offset;
        const ry = isWide ? cy + offset : cy;
        const rw = isWide ? thick : len;
        const rh = isWide ? len : thick;
        rects.push({ ...s, rx, ry, rw, rh });
        offset += len;
      }

      remaining = remaining.slice(row.length);
      if (isWide) { cx += thick; cw -= thick; }
      else { cy += thick; ch -= thick; }
    }
    return rects;
  };

  const rects = layoutRows(items, 0, 0, 100, 100);
  const maxAbs = Math.max(...items.map(s => Math.abs(s.c24h)), 3);

  const heatColor = (v) => {
    const t = Math.min(Math.abs(v) / maxAbs, 1);
    if (v >= 0) return `rgba(0,200,150,${0.15 + t * 0.65})`;
    return `rgba(255,77,109,${0.15 + t * 0.65})`;
  };

  return (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.textBright, textTransform: "uppercase", letterSpacing: 1 }}>Heatmapa rynku</div>
        <div style={{ display: "flex", gap: 8, fontSize: 10, color: theme.textSecondary }}>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#ff4d6d" }} /> Spadek</span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#444" }} /> 0%</span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#00c896" }} /> Wzrost</span>
        </div>
      </div>
      <div style={{ position: "relative", width: "100%", paddingBottom: "50%", overflow: "hidden" }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {rects.map(r => (
            <g key={r.ticker} onClick={() => onSelect(r)} style={{ cursor: "pointer" }}>
              <rect x={r.rx} y={r.ry} width={Math.max(r.rw - 0.15, 0)} height={Math.max(r.rh - 0.15, 0)} rx="0.3"
                fill={heatColor(r.c24h)} stroke={theme.border} strokeWidth="0.15" />
              {r.rw > 6 && r.rh > 5 && (
                <>
                  <text x={r.rx + r.rw / 2} y={r.ry + r.rh / 2 - (r.rh > 10 ? 1.2 : 0)} textAnchor="middle" dominantBaseline="central"
                    fill={theme.textBright} fontSize={r.rw > 12 ? 2.2 : 1.6} fontWeight="800" fontFamily="'Space Grotesk',sans-serif">{r.ticker}</text>
                  {r.rh > 10 && (
                    <text x={r.rx + r.rw / 2} y={r.ry + r.rh / 2 + 2.2} textAnchor="middle" dominantBaseline="central"
                      fill={changeColor(r.c24h)} fontSize={1.5} fontWeight="700" fontFamily="'Space Grotesk',sans-serif">
                      {r.c24h > 0 ? "+" : ""}{r.c24h.toFixed(1)}%
                    </text>
                  )}
                </>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ─── Sector Donut Chart ─────────────────────────────────────── */
function SectorDonut({ stocks, theme }) {
  const sectorCaps = {};
  for (const s of stocks) {
    sectorCaps[s.sector] = (sectorCaps[s.sector] || 0) + (s.cap || 0);
  }
  const sorted = Object.entries(sectorCaps).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((a, [, v]) => a + v, 0);
  if (!total) return null;

  const COLORS = ["#58a6ff", "#00c896", "#ff4d6d", "#ffd700", "#a371f7", "#f78166", "#3fb950", "#d2a8ff", "#79c0ff", "#f0883e", "#7ee787", "#ff7b72", "#d29922", "#56d364"];
  const cx = 50, cy = 50, r = 38, ir = 24;
  let angle = -90;
  const slices = sorted.map(([sector, cap], i) => {
    const frac = cap / total;
    const startAngle = angle;
    const sweep = frac * 360;
    angle += sweep;
    const endAngle = angle;
    const large = sweep > 180 ? 1 : 0;
    const s1 = (startAngle * Math.PI) / 180, e1 = (endAngle * Math.PI) / 180;
    const x1 = cx + r * Math.cos(s1), y1 = cy + r * Math.sin(s1);
    const x2 = cx + r * Math.cos(e1), y2 = cy + r * Math.sin(e1);
    const x3 = cx + ir * Math.cos(e1), y3 = cy + ir * Math.sin(e1);
    const x4 = cx + ir * Math.cos(s1), y4 = cy + ir * Math.sin(s1);
    const d = `M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${ir},${ir} 0 ${large} 0 ${x4},${y4} Z`;
    return { sector, cap, frac, d, color: COLORS[i % COLORS.length] };
  });

  return (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
      <div style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Dominacja sektorowa</div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <svg width="140" height="140" viewBox="0 0 100 100">
          {slices.map(s => <path key={s.sector} d={s.d} fill={s.color} opacity="0.85" stroke={theme.bgCard} strokeWidth="0.5" />)}
          <text x="50" y="47" textAnchor="middle" fill={theme.textBright} fontSize="7" fontWeight="800" fontFamily="'Space Grotesk',sans-serif">{(total / 1000).toFixed(0)}</text>
          <text x="50" y="56" textAnchor="middle" fill={theme.textSecondary} fontSize="3.5" fontFamily="'Space Grotesk',sans-serif">mld zł</text>
        </svg>
      </div>
      {sorted.slice(0, 6).map(([sector, cap], i) => (
        <div key={sector} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", fontSize: 11 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
            <span style={{ color: theme.text }}>{sector}</span>
          </div>
          <span style={{ color: theme.textSecondary, fontSize: 10 }}>{(cap / total * 100).toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Watchlist Star ─────────────────────────────────────────── */
function WatchStar({ active, onClick, theme }) {
  return (
    <span
      onClick={e => { e.stopPropagation(); onClick(); }}
      style={{ cursor: "pointer", fontSize: 14, lineHeight: 1, color: active ? "#ffd700" : theme.borderInput, transition: "color 0.15s", userSelect: "none" }}
      title={active ? "Usuń z obserwowanych" : "Dodaj do obserwowanych"}
    >
      {active ? "★" : "☆"}
    </span>
  );
}

function ProfitCalculatorModal({ stock, currentPrice, onClose, theme }) {
  const [shares, setShares] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const isMobile = useIsMobile();

  const sharesNum = parseFloat(shares) || 0;
  const buyPriceNum = parseFloat(buyPrice.replace(",", ".")) || 0;

  const purchaseCost = sharesNum * buyPriceNum;
  const currentValue = sharesNum * (currentPrice || 0);
  const profitPLN = currentValue - purchaseCost;
  const profitPct = buyPriceNum > 0 ? ((currentPrice - buyPriceNum) / buyPriceNum) * 100 : 0;
  const hasCalc = sharesNum > 0 && buyPriceNum > 0;
  const color = profitPLN >= 0 ? "#00c896" : "#ff4d6d";
  const sign = (v) => (v >= 0 ? "+" : "");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 8 : 24 }} onClick={onClose}>
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderInput}`, borderRadius: 20, padding: isMobile ? 20 : 32, width: "100%", maxWidth: 460 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #1f6feb22, #58a6ff33)", border: "1px solid #58a6ff44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🧮</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: theme.textBright }}>Kalkulator zysku/straty</div>
              <div style={{ fontSize: 11, color: theme.textSecondary }}>{stock.ticker} · {stock.name}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: theme.bgCardAlt, border: "none", borderRadius: 8, color: theme.textSecondary, width: 32, height: 32, fontSize: 18, cursor: "pointer" }}>×</button>
        </div>

        <div style={{ background: theme.bgCardAlt, borderRadius: 10, padding: "10px 14px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: theme.textSecondary }}>Kurs bieżący</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: theme.textBright }}>{fmt(currentPrice)} {stock.unit || "zł"}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Liczba akcji</label>
            <input type="number" value={shares} onChange={e => setShares(e.target.value)} placeholder="np. 100" min="0"
              style={{ width: "100%", background: theme.bgPage, border: `1px solid ${theme.borderInput}`, borderRadius: 8, padding: "10px 12px", color: theme.text, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: theme.textSecondary, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Cena zakupu ({stock.unit || "zł"})</label>
            <input type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} placeholder={`np. ${fmt(currentPrice)}`} min="0" step="0.01"
              style={{ width: "100%", background: theme.bgPage, border: `1px solid ${theme.borderInput}`, borderRadius: 8, padding: "10px 12px", color: theme.text, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
          </div>
        </div>

        {hasCalc ? (
          <div style={{ borderRadius: 12, border: `1px solid ${color}44`, background: `${color}0f`, padding: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div style={{ background: theme.bgCardAlt, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 4 }}>Wartość zakupu</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: theme.textBright }}>{fmt(purchaseCost)} {stock.unit || "zł"}</div>
              </div>
              <div style={{ background: theme.bgCardAlt, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 4 }}>Wartość bieżąca</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: theme.textBright }}>{fmt(currentValue)} {stock.unit || "zł"}</div>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${color}33`, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 4 }}>Zysk / Strata</div>
                <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 800, color }}>{sign(profitPLN)}{fmt(profitPLN)} {stock.unit || "zł"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 4 }}>Zwrot</div>
                <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 800, color }}>{sign(profitPct)}{fmt(profitPct)}%</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0", color: theme.textSecondary, fontSize: 12 }}>
            Wprowadź liczbę akcji i cenę zakupu, aby zobaczyć wynik
          </div>
        )}
      </div>
    </div>
  );
}

function StockModal({ stock, price, change24h, change7d, onClose, theme }) {
  const [history, setHistory] = useState(null);
  const [range, setRange] = useState("1M");
  const isMobile = useIsMobile();
  const [news, setNews] = useState(null);
  const color = change24h >= 0 ? "#00c896" : "#ff4d6d";

  useEffect(() => {
    fetchHistory(stock.stooq || stock.ticker.toLowerCase()).then(d => setHistory(d?.prices || null));
    fetch(`/api/news?q=${encodeURIComponent(stock.name)}`)
      .then(r => r.json())
      .then(d => setNews(d?.items || []))
      .catch(() => setNews([]));
  }, [stock.ticker, stock.name]);

  const filteredHistory = useMemo(() => {
    if (!history) return [];
    const days = { "1W": 7, "1M": 30, "3M": 90, "1R": 365 };
    return history.slice(-(days[range] || 30));
  }, [history, range]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 8 : 24 }} onClick={onClose}>
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderInput}`, borderRadius: 20, padding: isMobile ? 20 : 32, width: "100%", maxWidth: 720, maxHeight: "95vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg, #1f6feb22, #58a6ff33)", border: "1px solid #58a6ff44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: theme.accent }}>{stock.ticker.slice(0, 2)}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: isMobile ? 16 : 20, color: theme.textBright }}>{stock.ticker}</div>
              <div style={{ fontSize: 11, color: theme.textSecondary }}>{stock.name} · {stock.sector}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: theme.bgCardAlt, border: "none", borderRadius: 8, color: theme.textSecondary, width: 32, height: 32, fontSize: 18, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: theme.textBright }}>{fmt(price)} {stock.unit || "zł"}</div>
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            <span style={{ padding: "4px 12px", borderRadius: 6, background: `${color}20`, color, fontWeight: 700, fontSize: 13 }}>24h: {changeFmt(change24h)}</span>
            <span style={{ padding: "4px 12px", borderRadius: 6, background: `${color}20`, color, fontWeight: 700, fontSize: 13 }}>7d: {changeFmt(change7d)}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {["1W", "1M", "3M", "1R"].map(r => (
            <button key={r} onClick={() => setRange(r)} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid", borderColor: range === r ? theme.accent : theme.borderInput, background: range === r ? "#1f6feb22" : "transparent", color: range === r ? theme.accent : theme.textSecondary, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{r}</button>
          ))}
        </div>
        <div style={{ background: theme.bgPage, borderRadius: 12, padding: "12px 8px", marginBottom: 20 }}>
          <MiniChart data={filteredHistory} color={color} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            ["Kapitalizacja", stock.cap ? `${fmt(stock.cap, 0)} mln zł` : "—"],
            ["C/Z (P/E)", stock.pe > 0 ? fmt(stock.pe) : "—"],
            ["Dywidenda", stock.div > 0 ? `${fmt(stock.div)}%` : "Brak"],
            ["Sektor", stock.sector],
          ].map(([label, val]) => (
            <div key={label} style={{ background: theme.bgCardAlt, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: theme.textBright }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
            Najnowsze wiadomości
          </div>
          {news === null && (
            <div style={{ color: theme.textSecondary, fontSize: 12, padding: "12px 0" }}>Ładowanie wiadomości...</div>
          )}
          {news !== null && news.length === 0 && (
            <div style={{ color: theme.textSecondary, fontSize: 12, padding: "12px 0" }}>Brak wiadomości.</div>
          )}
          {news !== null && news.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              style={{ display: "block", textDecoration: "none", padding: "10px 0", borderBottom: `1px solid ${theme.border}` }}
            >
              <div style={{ fontSize: 13, color: theme.textBright, lineHeight: 1.4, marginBottom: 4 }}>{item.title}</div>
              <div style={{ display: "flex", gap: 12, fontSize: 11, color: theme.textSecondary }}>
                {item.source && <span>{item.source}</span>}
                {item.pubDate && <span>{new Date(item.pubDate).toLocaleDateString("pl-PL")}</span>}
              </div>
            </a>
          ))}
        </div>
        <a href={`https://stooq.pl/q/?s=${stock.stooq || stock.ticker.toLowerCase()}`} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", color: theme.accent, fontSize: 12, textDecoration: "none" }}>
          Zobacz pełne dane na stooq.pl →
        </a>
      </div>
    </div>
  );
}

/* ─── RSI Calculation ─────────────────────────────────────────── */
function calculateRSI(prices, period = 14) {
  if (!prices || prices.length < period + 1) return null;
  const closes = prices.map(p => p.close);
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff; else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + (diff > 0 ? diff : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (diff < 0 ? -diff : 0)) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function RSIGauge({ value, theme }) {
  if (value == null) return <div style={{ color: theme.textSecondary, fontSize: 12 }}>Ładowanie RSI...</div>;
  const label = value > 70 ? "Wykupiony" : value < 30 ? "Wyprzedany" : "Neutralny";
  const color = value > 70 ? "#ff4d6d" : value < 30 ? "#00c896" : "#ffd700";
  const pct = Math.min(Math.max(value / 100, 0), 1);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>RSI (14)</span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color }}>{value.toFixed(1)}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color }}>{label}</span>
        </div>
      </div>
      <div style={{ height: 8, background: theme.border, borderRadius: 6, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 6,
          width: `${pct * 100}%`, background: `linear-gradient(90deg, #00c896, #ffd700, #ff4d6d)`,
          transition: "width 0.6s ease"
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: theme.textSecondary, marginTop: 3 }}>
        <span>Wyprzedany (0)</span><span>Neutralny (50)</span><span>Wykupiony (100)</span>
      </div>
    </div>
  );
}

/* ─── Large Chart for StockPage ──────────────────────────────── */
function LargeChart({ data, color, theme }) {
  if (!data || data.length < 2) return <div style={{ color: theme.textSecondary, fontSize: 12, textAlign: "center", padding: "60px 0" }}>Ładowanie wykresu...</div>;
  const gradId = `lg-${color.replace("#", "")}`;
  const prices = data.map(d => d.close);
  const min = Math.min(...prices), max = Math.max(...prices);
  const range = max - min || 1;
  const w = 800, h = 280, padTop = 20, padBot = 30, padLeft = 60, padRight = 20;
  const chartW = w - padLeft - padRight, chartH = h - padTop - padBot;

  const pts = prices.map((p, i) => {
    const x = padLeft + (i / (prices.length - 1)) * chartW;
    const y = padTop + chartH - ((p - min) / range) * chartH;
    return `${x},${y}`;
  }).join(" ");

  const gridLines = 5;
  const yLabels = Array.from({ length: gridLines + 1 }, (_, i) => {
    const val = min + (range * i) / gridLines;
    const y = padTop + chartH - (i / gridLines) * chartH;
    return { val, y };
  });

  const dateStep = Math.max(1, Math.floor(data.length / 6));
  const xLabels = data.filter((_, i) => i % dateStep === 0 || i === data.length - 1).map((d, _, arr) => {
    const idx = data.indexOf(d);
    const x = padLeft + (idx / (data.length - 1)) * chartW;
    return { date: d.date, x };
  });

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {yLabels.map((l, i) => (
        <g key={i}>
          <line x1={padLeft} y1={l.y} x2={w - padRight} y2={l.y} stroke={theme.border} strokeWidth="0.5" strokeDasharray="4,3" />
          <text x={padLeft - 8} y={l.y + 3} textAnchor="end" fill={theme.textSecondary} fontSize="9" fontFamily="'Space Grotesk',sans-serif">{l.val.toFixed(2)}</text>
        </g>
      ))}
      {xLabels.map((l, i) => (
        <text key={i} x={l.x} y={h - 6} textAnchor="middle" fill={theme.textSecondary} fontSize="8" fontFamily="'Space Grotesk',sans-serif">
          {new Date(l.date).toLocaleDateString("pl-PL", { day: "numeric", month: "short" })}
        </text>
      ))}
      <polyline points={`${padLeft},${padTop + chartH} ${pts} ${w - padRight},${padTop + chartH}`} fill={`url(#${gradId})`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Stock Page (dedicated company page) ────────────────────── */
function StockPage({ stock, prices, changes, onBack, theme }) {
  const [history, setHistory] = useState(null);
  const [range, setRange] = useState("3M");
  const [news, setNews] = useState(null);
  const isMobile = useIsMobile();

  const currentPrice = prices[stock.ticker];
  const c24h = changes[stock.ticker]?.change24h ?? 0;
  const c7d = changes[stock.ticker]?.change7d ?? 0;
  const color = c24h >= 0 ? "#00c896" : "#ff4d6d";

  useEffect(() => {
    fetchHistory(stock.stooq || stock.ticker.toLowerCase()).then(d => setHistory(d?.prices || null));
    fetch(`/api/news?q=${encodeURIComponent(stock.name)}`)
      .then(r => r.json())
      .then(d => setNews(d?.items || []))
      .catch(() => setNews([]));
  }, [stock.ticker, stock.name, stock.stooq]);

  useEffect(() => {
    document.title = `${stock.name} (${stock.ticker}) — kurs akcji, wykres, wiadomości | WIGmarkets`;
    let meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", `Aktualny kurs ${stock.name} (${stock.ticker}) na GPW. Wykres, zmiana 24h/7d, wskaźnik RSI, kapitalizacja, C/Z, dywidenda. Dane na żywo z GPW.`);
  }, [stock.ticker, stock.name]);

  const filteredHistory = useMemo(() => {
    if (!history) return [];
    const days = { "1W": 7, "1M": 30, "3M": 90, "1R": 365 };
    return history.slice(-(days[range] || 90));
  }, [history, range]);

  const rsi = useMemo(() => calculateRSI(history), [history]);

  return (
    <div style={{ minHeight: "100vh", background: theme.bgPage, color: theme.text, fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}`, padding: "0 16px" }}>
        <div style={{ display: "flex", gap: 16, padding: "10px 0", alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
          <button onClick={onBack} style={{
            display: "flex", alignItems: "center", gap: 6, background: theme.bgCardAlt, border: `1px solid ${theme.border}`,
            borderRadius: 8, color: theme.textSecondary, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600
          }}>
            ← Wstecz
          </button>
          <div style={{ fontWeight: 800, fontSize: 16, color: theme.textBright, whiteSpace: "nowrap", cursor: "pointer" }} onClick={onBack}>
            WIG<span style={{ color: theme.accent }}>markets</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "20px 12px" : "32px 24px" }}>
        {/* Stock header */}
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, #1f6feb22, #58a6ff33)",
            border: "1px solid #58a6ff44", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 800, color: theme.accent
          }}>{stock.ticker.slice(0, 2)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: theme.textBright }}>{stock.ticker}</div>
            <div style={{ fontSize: 13, color: theme.textSecondary }}>{stock.name} · {stock.sector}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: theme.textBright }}>{fmt(currentPrice)} {stock.unit || "zł"}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <span style={{ padding: "4px 14px", borderRadius: 8, background: `${changeColor(c24h)}20`, color: changeColor(c24h), fontWeight: 700, fontSize: 13 }}>24h: {changeFmt(c24h)}</span>
              <span style={{ padding: "4px 14px", borderRadius: 8, background: `${changeColor(c7d)}20`, color: changeColor(c7d), fontWeight: 700, fontSize: 13 }}>7d: {changeFmt(c7d)}</span>
            </div>
          </div>
        </div>

        {/* Chart section */}
        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? 16 : 24, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>Wykres historyczny</div>
            <div style={{ display: "flex", gap: 6 }}>
              {["1W", "1M", "3M", "1R"].map(r => (
                <button key={r} onClick={() => setRange(r)} style={{
                  padding: "6px 16px", borderRadius: 8, border: "1px solid",
                  borderColor: range === r ? theme.accent : theme.borderInput,
                  background: range === r ? "#1f6feb22" : "transparent",
                  color: range === r ? theme.accent : theme.textSecondary,
                  fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: range === r ? 700 : 400
                }}>{r}</button>
              ))}
            </div>
          </div>
          <div style={{ background: theme.bgPage, borderRadius: 12, padding: "16px 8px" }}>
            <LargeChart data={filteredHistory} color={color} theme={theme} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24, marginBottom: 24 }}>
          {/* Key metrics */}
          <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? 16 : 24 }}>
            <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>Dane spółki</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                ["Kurs", currentPrice ? `${fmt(currentPrice)} ${stock.unit || "zł"}` : "—"],
                ["Zmiana 24h", changeFmt(c24h)],
                ["Zmiana 7d", changeFmt(c7d)],
                ["Kapitalizacja", stock.cap ? `${fmt(stock.cap, 0)} mln zł` : "—"],
                ["C/Z (P/E)", stock.pe > 0 ? fmt(stock.pe) : "—"],
                ["Dywidenda", stock.div > 0 ? `${fmt(stock.div)}%` : "Brak"],
              ].map(([label, val]) => (
                <div key={label} style={{ background: theme.bgCardAlt, borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: label.includes("Zmiana") ? changeColor(label.includes("24h") ? c24h : c7d) : theme.textBright }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RSI indicator */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? 16 : 24 }}>
              <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>Wskaźnik techniczny</div>
              <RSIGauge value={rsi} theme={theme} />
            </div>
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? 16 : 24 }}>
              <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>Informacje</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["Sektor", stock.sector],
                  ["Ticker stooq", stock.stooq || stock.ticker.toLowerCase()],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${theme.bgCardAlt}`, fontSize: 12 }}>
                    <span style={{ color: theme.textSecondary }}>{label}</span>
                    <span style={{ fontWeight: 600, color: theme.textBright }}>{val}</span>
                  </div>
                ))}
              </div>
              <a href={`https://stooq.pl/q/?s=${stock.stooq || stock.ticker.toLowerCase()}`} target="_blank" rel="noreferrer"
                style={{ display: "block", textAlign: "center", color: theme.accent, fontSize: 12, textDecoration: "none", marginTop: 14, fontWeight: 600 }}>
                Zobacz pełne dane na stooq.pl →
              </a>
            </div>
          </div>
        </div>

        {/* News section */}
        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? 16 : 24, marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>
            Najnowsze wiadomości
          </div>
          {news === null && (
            <div style={{ color: theme.textSecondary, fontSize: 12, padding: "16px 0" }}>Ładowanie wiadomości...</div>
          )}
          {news !== null && news.length === 0 && (
            <div style={{ color: theme.textSecondary, fontSize: 12, padding: "16px 0" }}>Brak wiadomości dla {stock.name}.</div>
          )}
          {news !== null && news.map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noreferrer"
              style={{ display: "block", textDecoration: "none", padding: "14px 0", borderBottom: i < news.length - 1 ? `1px solid ${theme.border}` : "none" }}>
              <div style={{ fontSize: 14, color: theme.textBright, lineHeight: 1.5, marginBottom: 6, fontWeight: 500 }}>{item.title}</div>
              <div style={{ display: "flex", gap: 12, fontSize: 11, color: theme.textSecondary }}>
                {item.source && <span style={{ fontWeight: 600 }}>{item.source}</span>}
                {item.pubDate && <span>{new Date(item.pubDate).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}</span>}
              </div>
            </a>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "24px", fontSize: 10, color: theme.textSecondary }}>
        WIGmarkets © 2026 · Dane z GPW via stooq.pl · Nie stanowią rekomendacji inwestycyjnej
      </div>
    </div>
  );
}

function FearGauge({ value = 62, isMobile, theme }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 400); }, []);
  const getLabel = (v) => { if (v < 20) return "Skrajna panika"; if (v < 40) return "Strach"; if (v < 60) return "Neutralny"; if (v < 80) return "Chciwość"; return "Ekstremalna chciwość"; };
  const getColor = (v) => { if (v < 20) return "#ff2244"; if (v < 40) return "#ff6b35"; if (v < 60) return "#ffd700"; if (v < 80) return "#7ecb5f"; return "#00e676"; };
  const angle = animated ? (value / 100) * 180 - 90 : -90;
  const color = getColor(value);
  const arcPath = (startDeg, endDeg, r, c) => {
    const cx = 100, cy = 90, s = (startDeg * Math.PI) / 180, e = (endDeg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(s - Math.PI), y1 = cy + r * Math.sin(s - Math.PI);
    const x2 = cx + r * Math.cos(e - Math.PI), y2 = cy + r * Math.sin(e - Math.PI);
    return <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${endDeg - startDeg > 180 ? 1 : 0} 1 ${x2} ${y2}`} fill="none" stroke={c} strokeWidth="10" strokeLinecap="round" opacity="0.85" />;
  };
  return (
    <div style={{ background: theme.fearGaugeBg, border: `1px solid ${theme.border}`, borderRadius: 16, padding: "20px", display: "flex", flexDirection: isMobile ? "row" : "column", alignItems: "center", gap: isMobile ? 16 : 0 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ color: theme.textSecondary, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Fear & Greed</div>
        <svg width={isMobile ? 140 : 200} height={isMobile ? 77 : 110} viewBox="0 0 200 110">
          {arcPath(0, 36, 75, "#ff2244")}{arcPath(36, 72, 75, "#ff6b35")}{arcPath(72, 108, 75, "#ffd700")}{arcPath(108, 144, 75, "#7ecb5f")}{arcPath(144, 180, 75, "#00e676")}
          <g transform={`rotate(${angle}, 100, 90)`} style={{ transition: "transform 1.2s cubic-bezier(0.34,1.2,0.64,1)" }}>
            <line x1="100" y1="90" x2="100" y2="24" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="100" cy="90" r="5" fill={color} />
          </g>
          <circle cx="100" cy="90" r="3" fill={theme.bgCard} />
        </svg>
        <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1, marginTop: -6 }}>{value}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color, marginTop: 4 }}>{getLabel(value)}</div>
      </div>
      {!isMobile && (
        <div style={{ marginTop: 16, width: "100%" }}>
          {FEAR_COMPONENTS.map((f) => (
            <div key={f.label} style={{ marginBottom: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: theme.textSecondary, marginBottom: 2 }}>
                <span>{f.label}</span><span style={{ color: getColor(f.val) }}>{f.val}</span>
              </div>
              <div style={{ height: 3, background: theme.border, borderRadius: 4 }}>
                <div style={{ height: "100%", borderRadius: 4, width: animated ? `${f.val}%` : "0%", background: getColor(f.val), transition: "width 1s cubic-bezier(0.34,1.2,0.64,1)", transitionDelay: "0.3s" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const ALL_INSTRUMENTS = [...STOCKS, ...COMMODITIES];

function getRouteFromPath(pathname) {
  const match = pathname.match(/^\/spolka\/([A-Za-z0-9]+)$/);
  if (match) {
    const ticker = match[1].toUpperCase();
    const stock = ALL_INSTRUMENTS.find(s => s.ticker === ticker);
    if (stock) return { page: "stock", stock };
  }
  return { page: "home", stock: null };
}

export default function WigMarkets() {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState("akcje");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("cap");
  const [sortDir, setSortDir] = useState("desc");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [prices, setPrices] = useState({});
  const [changes, setChanges] = useState({});
  const [selected, setSelected] = useState(null);
  const [calcStock, setCalcStock] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") !== "light");
  const [indices, setIndices] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [watchlist, setWatchlist] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("watchlist") || "[]")); } catch { return new Set(); }
  });
  const [watchFilter, setWatchFilter] = useState(false);
  const [route, setRoute] = useState(() => getRouteFromPath(window.location.pathname));
  const PER_PAGE = 20;
  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  // SPA routing
  useEffect(() => {
    const onPopState = () => setRoute(getRouteFromPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigateToStock = useCallback((stock) => {
    window.history.pushState(null, "", `/spolka/${stock.ticker}`);
    setRoute({ page: "stock", stock });
  }, []);

  const navigateHome = useCallback(() => {
    window.history.pushState(null, "", "/");
    setRoute({ page: "home", stock: null });
    document.title = "WIGmarkets - Notowania GPW";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Notowania GPW w czasie rzeczywistym");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.style.background = theme.bgPage;
  }, [darkMode, theme.bgPage]);

  const toggleWatch = (ticker) => {
    setWatchlist(prev => {
      const next = new Set(prev);
      next.has(ticker) ? next.delete(ticker) : next.add(ticker);
      localStorage.setItem("watchlist", JSON.stringify([...next]));
      return next;
    });
  };

  useEffect(() => {
    const load = async () => {
      const data = await fetchIndices();
      if (data.length) setIndices(data);
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const activeData = tab === "akcje" ? STOCKS : COMMODITIES;
    const symbols = activeData.map(item => item.stooq || item.ticker.toLowerCase());
    const fetchAll = async () => {
      const bulk = await fetchBulk(symbols);
      const newPrices = {};
      const newChanges = {};
      for (const item of activeData) {
        const sym = item.stooq || item.ticker.toLowerCase();
        const data = bulk[sym];
        if (data?.close) {
          newPrices[item.ticker] = data.close;
          newChanges[item.ticker] = { change24h: data.change24h ?? 0, change7d: data.change7d ?? 0 };
        }
      }
      if (Object.keys(newPrices).length) {
        setPrices(prev => ({ ...prev, ...newPrices }));
        setChanges(prev => ({ ...prev, ...newChanges }));
      }
    };
    fetchAll();
    const interval = setInterval(fetchAll, 60000);
    return () => clearInterval(interval);
  }, [tab]);

  const activeData = tab === "akcje" ? STOCKS : COMMODITIES;
  const sectors = useMemo(() => ["all", ...Array.from(new Set(activeData.map(s => s.sector)))], [activeData]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return activeData
      .filter(s => !watchFilter || watchlist.has(s.ticker))
      .filter(s => filter === "all" || s.sector === filter)
      .filter(s => s.name.toLowerCase().includes(q) || s.ticker.toLowerCase().includes(q))
      .sort((a, b) => {
        let av = a[sortBy] ?? 0, bv = b[sortBy] ?? 0;
        if (sortBy === "price") { av = prices[a.ticker] || 0; bv = prices[b.ticker] || 0; }
        if (sortBy === "change24h") { av = changes[a.ticker]?.change24h ?? 0; bv = changes[b.ticker]?.change24h ?? 0; }
        if (sortBy === "change7d") { av = changes[a.ticker]?.change7d ?? 0; bv = changes[b.ticker]?.change7d ?? 0; }
        return sortDir === "desc" ? bv - av : av - bv;
      });
  }, [activeData, filter, search, sortBy, sortDir, prices, changes, watchFilter, watchlist]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const handleSort = (col) => { if (sortBy === col) setSortDir(d => d === "desc" ? "asc" : "desc"); else { setSortBy(col); setSortDir("desc"); } };
  const col = (label, key, right = true) => (
    <th onClick={() => handleSort(key)} style={{ padding: isMobile ? "8px 8px" : "10px 16px", textAlign: right ? "right" : "left", fontSize: 10, color: sortBy === key ? theme.accent : theme.textSecondary, cursor: "pointer", whiteSpace: "nowrap", userSelect: "none", borderBottom: `1px solid ${theme.border}`, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
      {label} {sortBy === key ? (sortDir === "desc" ? "↓" : "↑") : ""}
    </th>
  );
  const fmtIdx = (v) => v != null ? v.toLocaleString("pl-PL", { maximumFractionDigits: 2 }) : "—";
  const fmtIdxChange = (v) => v != null ? `${v >= 0 ? "+" : ""}${v.toFixed(2)}%` : "—";

  const topGainers = useMemo(() =>
    [...STOCKS].sort((a, b) => (changes[b.ticker]?.change24h ?? 0) - (changes[a.ticker]?.change24h ?? 0)).slice(0, 5),
    [changes]
  );
  const topLosers = useMemo(() =>
    [...STOCKS].sort((a, b) => (changes[a.ticker]?.change24h ?? 0) - (changes[b.ticker]?.change24h ?? 0)).slice(0, 5),
    [changes]
  );
  const marketStats = useMemo(() => [
    ["Spółki rosnące", `${STOCKS.filter(s => (changes[s.ticker]?.change24h ?? 0) > 0).length}/${STOCKS.length}`, "#00c896"],
    ["Kap. łączna (mld zł)", fmt(STOCKS.reduce((a, s) => a + s.cap, 0) / 1000, 1), "#58a6ff"],
    ["Śr. zmiana 24h", changeFmt(STOCKS.reduce((a, s) => a + (changes[s.ticker]?.change24h ?? 0), 0) / STOCKS.length), "#ffd700"],
  ], [changes]);

  // Route: dedicated stock page
  if (route.page === "stock" && route.stock) {
    return (
      <>
        {calcStock && <ProfitCalculatorModal stock={calcStock} currentPrice={prices[calcStock.ticker]} onClose={() => setCalcStock(null)} theme={theme} />}
        <StockPage stock={route.stock} prices={prices} changes={changes} onBack={navigateHome} theme={theme} />
      </>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.bgPage, color: theme.text, fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>

      {selected && <StockModal stock={selected} price={prices[selected.ticker]} change24h={changes[selected.ticker]?.change24h ?? 0} change7d={changes[selected.ticker]?.change7d ?? 0} onClose={() => setSelected(null)} theme={theme} />}
      {calcStock && <ProfitCalculatorModal stock={calcStock} currentPrice={prices[calcStock.ticker]} onClose={() => setCalcStock(null)} theme={theme} />}

      {/* Top bar */}
      <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}`, padding: "0 16px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: isMobile ? 16 : 32, padding: "10px 0", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: theme.textBright, whiteSpace: "nowrap" }}>WIG<span style={{ color: theme.accent }}>markets</span></div>
          {!isMobile && indices.map(idx => (
            <div key={idx.name} style={{ display: "flex", gap: 8, alignItems: "baseline", whiteSpace: "nowrap" }}>
              <span style={{ color: theme.accent, fontWeight: 700, fontSize: 11 }}>{idx.name}</span>
              <span style={{ fontSize: 12, color: theme.textBright }}>{fmtIdx(idx.value)}</span>
              <span style={{ fontSize: 11, color: idx.change24h >= 0 ? "#00c896" : "#ff4d6d" }}>{fmtIdxChange(idx.change24h)}</span>
            </div>
          ))}
          {isMobile && indices.slice(0, 2).map(idx => (
            <div key={idx.name} style={{ display: "flex", gap: 6, alignItems: "baseline", whiteSpace: "nowrap" }}>
              <span style={{ color: theme.accent, fontWeight: 700, fontSize: 10 }}>{idx.name}</span>
              <span style={{ fontSize: 11, color: idx.change24h >= 0 ? "#00c896" : "#ff4d6d" }}>{fmtIdxChange(idx.change24h)}</span>
            </div>
          ))}
          <button onClick={() => setDarkMode(d => !d)} style={{ marginLeft: "auto", background: theme.bgCardAlt, border: `1px solid ${theme.border}`, borderRadius: 6, color: theme.textSecondary, padding: "4px 10px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          {isMobile && (
            <button onClick={() => setSidebarOpen(o => !o)} style={{ background: theme.bgCardAlt, border: `1px solid ${theme.border}`, borderRadius: 6, color: theme.textSecondary, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
              {sidebarOpen ? "✕" : "📊"}
            </button>
          )}
        </div>
      </div>

      {/* Marquee ticker */}
      <MarqueeTicker stocks={[...STOCKS, ...COMMODITIES]} prices={prices} changes={changes} theme={theme} onSelect={navigateToStock} />

      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div style={{ padding: "16px", background: theme.bgCard, borderBottom: `1px solid ${theme.border}` }}>
          <FearGauge value={62} isMobile={true} theme={theme} />
        </div>
      )}

      <div style={{ padding: isMobile ? "16px 12px 0" : "24px 24px 0", maxWidth: 1400, margin: "0 auto" }}>
        {/* Tabs + View toggle */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          {[["akcje", "🏛️ Akcje GPW"], ["surowce", "🥇 Surowce"]].map(([key, label]) => (
            <button key={key} onClick={() => { setTab(key); setPage(1); setFilter("all"); setWatchFilter(false); }} style={{ padding: isMobile ? "6px 14px" : "8px 20px", borderRadius: 8, border: "1px solid", borderColor: tab === key ? theme.accent : theme.borderInput, background: tab === key ? "#1f6feb22" : "transparent", color: tab === key ? theme.accent : theme.textSecondary, fontSize: isMobile ? 12 : 13, fontWeight: tab === key ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }}>{label}</button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            <button onClick={() => setWatchFilter(f => !f)} style={{ padding: isMobile ? "6px 10px" : "8px 14px", borderRadius: 8, border: "1px solid", borderColor: watchFilter ? "#ffd700" : theme.borderInput, background: watchFilter ? "#ffd70022" : "transparent", color: watchFilter ? "#ffd700" : theme.textSecondary, fontSize: isMobile ? 11 : 12, cursor: "pointer", fontFamily: "inherit", fontWeight: watchFilter ? 700 : 400 }}>
              ★ Obserwowane{watchlist.size > 0 ? ` (${watchlist.size})` : ""}
            </button>
            {tab === "akcje" && !isMobile && (
              <div style={{ display: "flex", borderRadius: 8, border: `1px solid ${theme.borderInput}`, overflow: "hidden" }}>
                {[["table", "Tabela"], ["heatmap", "Heatmapa"]].map(([key, label]) => (
                  <button key={key} onClick={() => setViewMode(key)} style={{ padding: "8px 14px", border: "none", background: viewMode === key ? "#1f6feb22" : "transparent", color: viewMode === key ? theme.accent : theme.textSecondary, fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: viewMode === key ? 700 : 400 }}>{label}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", display: isMobile ? "block" : "grid", gridTemplateColumns: "1fr 280px", gap: 24, padding: isMobile ? "0 12px" : "0 24px" }}>
        <div>
          {/* Heatmap view */}
          {viewMode === "heatmap" && tab === "akcje" && !isMobile && (
            <Heatmap stocks={STOCKS} prices={prices} changes={changes} theme={theme} onSelect={navigateToStock} />
          )}

          {/* Controls */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Szukaj..."
              style={{ flex: 1, minWidth: 140, background: theme.bgCard, border: `1px solid ${theme.borderInput}`, borderRadius: 8, padding: "7px 12px", color: theme.text, fontSize: 12, outline: "none", fontFamily: "inherit" }} />
            <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}
              style={{ background: theme.bgCard, border: `1px solid ${theme.borderInput}`, borderRadius: 8, padding: "7px 10px", color: theme.text, fontSize: 11, cursor: "pointer", fontFamily: "inherit", outline: "none" }}>
              {sectors.map(s => <option key={s} value={s}>{s === "all" ? "Wszystkie sektory" : s}</option>)}
            </select>
          </div>

          {/* Table */}
          <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 12 : 13, minWidth: isMobile ? "auto" : 600 }}>
                <thead>
                  <tr>
                    <th style={{ padding: isMobile ? "8px 4px" : "10px 8px", borderBottom: `1px solid ${theme.border}`, width: 28 }}></th>
                    {!isMobile && col("#", "id", false)}
                    <th style={{ padding: isMobile ? "8px 10px" : "10px 16px", textAlign: "left", fontSize: 10, color: theme.textSecondary, borderBottom: `1px solid ${theme.border}`, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Instrument</th>
                    {col("Kurs", "price")}
                    {col("24h %", "change24h")}
                    {!isMobile && col("7d %", "change7d")}
                    {!isMobile && tab === "akcje" && col("Kap.", "cap")}
                    {!isMobile && <th style={{ padding: "10px 16px", textAlign: "right", fontSize: 10, color: theme.textSecondary, borderBottom: `1px solid ${theme.border}`, fontWeight: 600 }}>7D</th>}
                    <th style={{ padding: isMobile ? "8px 8px" : "10px 16px", borderBottom: `1px solid ${theme.border}` }}></th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((s, i) => {
                    const currentPrice = prices[s.ticker];
                    const c24h = changes[s.ticker]?.change24h ?? 0;
                    const c7d = changes[s.ticker]?.change7d ?? 0;
                    const priceColor = c24h > 0 ? "#00c896" : c24h < 0 ? "#ff4d6d" : "#c9d1d9";
                    return (
                      <tr key={s.id} onClick={() => navigateToStock(s)} style={{ borderBottom: `1px solid ${theme.bgCardAlt}`, cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = theme.bgCardAlt}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: isMobile ? "10px 4px" : "10px 8px", textAlign: "center" }}>
                          <WatchStar active={watchlist.has(s.ticker)} onClick={() => toggleWatch(s.ticker)} theme={theme} />
                        </td>
                        {!isMobile && <td style={{ padding: "10px 16px", color: theme.textSecondary, fontSize: 11 }}>{(page - 1) * PER_PAGE + i + 1}</td>}
                        <td style={{ padding: isMobile ? "10px 10px" : "10px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 6, background: "linear-gradient(135deg, #1f6feb22, #58a6ff33)", border: "1px solid #58a6ff44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#58a6ff", flexShrink: 0 }}>{s.ticker.slice(0, 2)}</div>
                            <div>
                              <div style={{ fontWeight: 700, color: theme.textBright, fontSize: isMobile ? 12 : 13 }}>{s.ticker}</div>
                              {!isMobile && <div style={{ fontSize: 10, color: theme.textSecondary }}>{s.name}</div>}
                              {isMobile && <div style={{ fontSize: 10, color: theme.textSecondary, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: isMobile ? "10px 8px" : "10px 16px", textAlign: "right", fontWeight: 700, color: priceColor, fontSize: isMobile ? 12 : 13, whiteSpace: "nowrap" }}>{fmt(currentPrice)} {s.unit || "zł"}</td>
                        <td style={{ padding: isMobile ? "10px 8px" : "10px 16px", textAlign: "right" }}>
                          <span style={{ padding: "2px 6px", borderRadius: 5, fontSize: isMobile ? 11 : 12, fontWeight: 700, background: c24h > 0 ? "#00c89620" : "#ff4d6d20", color: changeColor(c24h), whiteSpace: "nowrap" }}>{changeFmt(c24h)}</span>
                        </td>
                        {!isMobile && <td style={{ padding: "10px 16px", textAlign: "right", color: changeColor(c7d), fontSize: 12 }}>{changeFmt(c7d)}</td>}
                        {!isMobile && tab === "akcje" && <td style={{ padding: "10px 16px", textAlign: "right", color: theme.textSecondary, fontSize: 12 }}>{fmt(s.cap, 0)}</td>}
                        {!isMobile && <td style={{ padding: "10px 16px", textAlign: "right" }}><Sparkline trend={c7d} /></td>}
                        <td style={{ padding: isMobile ? "6px 8px" : "10px 16px", textAlign: "right" }}>
                          <button
                            onClick={e => { e.stopPropagation(); setCalcStock(s); }}
                            style={{ padding: isMobile ? "4px 7px" : "5px 11px", borderRadius: 6, border: `1px solid ${theme.borderInput}`, background: "transparent", color: theme.textSecondary, fontSize: isMobile ? 12 : 11, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", lineHeight: 1.2 }}
                            title="Kalkulator zysku/straty"
                          >
                            {isMobile ? "🧮" : "Kalkulator"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${theme.border}`, flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: 11, color: theme.textSecondary }}>{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} z {filtered.length}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{ width: 26, height: 26, borderRadius: 5, border: "1px solid", borderColor: p === page ? theme.accent : theme.borderInput, background: p === page ? "#1f6feb22" : "transparent", color: p === page ? theme.accent : theme.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        {!isMobile && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FearGauge value={62} isMobile={false} theme={theme} />
            {tab === "akcje" && <SectorDonut stocks={STOCKS} theme={theme} />}
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Top wzrosty 24h</div>
              {topGainers.map(s => (
                <div key={s.ticker} onClick={() => navigateToStock(s)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${theme.bgCardAlt}`, cursor: "pointer" }}>
                  <div><div style={{ fontWeight: 700, fontSize: 12, color: theme.textBright }}>{s.ticker}</div><div style={{ fontSize: 10, color: theme.textSecondary }}>{s.sector}</div></div>
                  <span style={{ padding: "2px 7px", borderRadius: 5, fontSize: 11, fontWeight: 700, background: "#00c89620", color: "#00c896" }}>{changeFmt(changes[s.ticker]?.change24h ?? 0)}</span>
                </div>
              ))}
            </div>
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Top spadki 24h</div>
              {topLosers.map(s => (
                <div key={s.ticker} onClick={() => navigateToStock(s)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${theme.bgCardAlt}`, cursor: "pointer" }}>
                  <div><div style={{ fontWeight: 700, fontSize: 12, color: theme.textBright }}>{s.ticker}</div><div style={{ fontSize: 10, color: theme.textSecondary }}>{s.sector}</div></div>
                  <span style={{ padding: "2px 7px", borderRadius: 5, fontSize: 11, fontWeight: 700, background: "#ff4d6d20", color: "#ff4d6d" }}>{changeFmt(changes[s.ticker]?.change24h ?? 0)}</span>
                </div>
              ))}
            </div>
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: 10, color: theme.textSecondary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Statystyki rynku</div>
              {marketStats.map(([label, val, color]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${theme.bgCardAlt}`, fontSize: 11 }}>
                  <span style={{ color: theme.textSecondary }}>{label}</span>
                  <span style={{ fontWeight: 700, color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "24px", fontSize: 10, color: theme.textSecondary }}>
        WIGmarkets © 2026 · Dane z GPW via stooq.pl · Nie stanowią rekomendacji inwestycyjnej
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<WigMarkets />);

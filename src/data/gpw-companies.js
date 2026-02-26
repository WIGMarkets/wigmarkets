/**
 * Comprehensive list of companies listed on the Warsaw Stock Exchange (GPW) Main Market.
 *
 * Data compiled from multiple sources:
 * - GPW official website (gpw.pl/list-of-companies)
 * - GPW Benchmark index compositions (gpwbenchmark.pl)
 * - Stooq.pl ticker conventions
 * - BiznesRadar.pl, Investing.com, StockWatch.pl
 *
 * Index membership reflects the state after:
 * - Annual revision: March 21, 2025 (WIG20: +CCC, +ZAB; -CPS, -JSW)
 * - Quarterly adj: June 20, 2025 (mWIG40: +BNP, +ASE; -GRN, -SLV)
 * - Quarterly adj: September 19, 2025 (mWIG40: +DIAG; -CEL | sWIG80: +CEL, +DAD; -DIAG, -MLP)
 * - Quarterly adj: December 19, 2025 (sWIG80: +ARL, +MLP; -Molecure, -Rank Progress)
 *
 * IMPORTANT NOTES:
 * - Stooq symbols are lowercase versions of GPW tickers (no exchange suffix needed)
 * - Some stooq symbols differ from GPW tickers (e.g., AmRest: GPW=EAT, stooq=eat)
 * - Index compositions change quarterly; verify against gpwbenchmark.pl for latest
 * - Companies outside WIG20/mWIG40/sWIG80 are marked as index: "WIG" (broad market index)
 * - ~400 companies on GPW Main Market; this list covers ~226 with verified data availability
 * - Sector names are in Polish (matching GPW classification)
 *
 * Last updated: February 2026
 */

export const GPW_COMPANIES = [

  // ═══════════════════════════════════════════════════════════════════
  // WIG20 — 20 largest and most liquid companies
  // ═══════════════════════════════════════════════════════════════════
  { ticker: "ALE", stooq: "ale", name: "Allegro.eu", sector: "E-commerce", index: "WIG20" },
  { ticker: "ALR", stooq: "alr", name: "Alior Bank", sector: "Banki", index: "WIG20" },
  { ticker: "BDX", stooq: "bdx", name: "Budimex", sector: "Budownictwo", index: "WIG20" },
  { ticker: "CCC", stooq: "ccc", name: "CCC SA (Modivo)", sector: "Handel", index: "WIG20" },
  { ticker: "CDR", stooq: "cdr", name: "CD Projekt", sector: "Gry", index: "WIG20" },
  { ticker: "DNP", stooq: "dnp", name: "Dino Polska", sector: "Handel", index: "WIG20" },
  { ticker: "KGH", stooq: "kgh", name: "KGHM Polska Miedź", sector: "Surowce", index: "WIG20" },
  { ticker: "KRU", stooq: "kru", name: "Kruk SA", sector: "Finanse", index: "WIG20" },
  { ticker: "KTY", stooq: "kty", name: "Grupa Kęty", sector: "Przemysł", index: "WIG20" },
  { ticker: "LPP", stooq: "lpp", name: "LPP SA", sector: "Handel", index: "WIG20" },
  { ticker: "MBK", stooq: "mbk", name: "mBank", sector: "Banki", index: "WIG20" },
  { ticker: "OPL", stooq: "opl", name: "Orange Polska", sector: "Telekomunikacja", index: "WIG20" },
  { ticker: "PCO", stooq: "pco", name: "Pepco Group", sector: "Handel", index: "WIG20" },
  { ticker: "PEO", stooq: "peo", name: "Bank Pekao", sector: "Banki", index: "WIG20" },
  { ticker: "PGE", stooq: "pge", name: "PGE Polska Grupa Energetyczna", sector: "Energetyka", index: "WIG20" },
  { ticker: "PKN", stooq: "pkn", name: "PKN ORLEN", sector: "Energetyka", index: "WIG20" },
  { ticker: "PKO", stooq: "pko", name: "PKO Bank Polski", sector: "Banki", index: "WIG20" },
  { ticker: "PZU", stooq: "pzu", name: "PZU SA", sector: "Ubezpieczenia", index: "WIG20" },
  { ticker: "SPL", stooq: "spl", name: "Santander Bank Polska", sector: "Banki", index: "WIG20" },
  { ticker: "ZAB", stooq: "zab", name: "Żabka Group", sector: "Handel", index: "WIG20" },

  // ═══════════════════════════════════════════════════════════════════
  // mWIG40 — 37 of 40 (CMR, DIAG, PRC delisted/acquired — no data)
  // ═══════════════════════════════════════════════════════════════════
  { ticker: "11B", stooq: "11b", name: "11 bit studios", sector: "Gry", index: "mWIG40" },
  { ticker: "ACP", stooq: "acp", name: "Asseco Poland", sector: "Technologia", index: "mWIG40" },
  { ticker: "APR", stooq: "apr", name: "Auto Partner", sector: "Motoryzacja", index: "mWIG40" },
  { ticker: "ASB", stooq: "asb", name: "ASBISc Enterprises", sector: "Technologia", index: "mWIG40" },
  { ticker: "ASE", stooq: "ase", name: "Asseco South Eastern Europe", sector: "Technologia", index: "mWIG40" },
  { ticker: "BFT", stooq: "bft", name: "Benefit Systems", sector: "HR/Benefity", index: "mWIG40" },
  { ticker: "BHW", stooq: "bhw", name: "Bank Handlowy w Warszawie", sector: "Banki", index: "mWIG40" },
  { ticker: "BNP", stooq: "bnp", name: "BNP Paribas Bank Polska", sector: "Banki", index: "mWIG40" },
  { ticker: "CAR", stooq: "car", name: "Inter Cars", sector: "Motoryzacja", index: "mWIG40" },
  { ticker: "COG", stooq: "cog", name: "Cognor Holding", sector: "Przemysł", index: "mWIG40" },
  { ticker: "CPS", stooq: "cps", name: "Cyfrowy Polsat", sector: "Media", index: "mWIG40" },
  { ticker: "DOM", stooq: "dom", name: "Dom Development", sector: "Nieruchomości", index: "mWIG40" },
  { ticker: "DVL", stooq: "dvl", name: "Develia", sector: "Nieruchomości", index: "mWIG40" },
  { ticker: "EAT", stooq: "eat", name: "AmRest Holdings", sector: "Restauracje", index: "mWIG40" },
  { ticker: "ECH", stooq: "ech", name: "Echo Investment", sector: "Nieruchomości", index: "mWIG40" },
  { ticker: "ENA", stooq: "ena", name: "Enea SA", sector: "Energetyka", index: "mWIG40" },
  { ticker: "EUR", stooq: "eur", name: "Eurocash", sector: "Handel", index: "mWIG40" },
  { ticker: "GPW", stooq: "gpw", name: "Giełda Papierów Wartościowych", sector: "Finanse", index: "mWIG40" },
  { ticker: "GTC", stooq: "gtc", name: "Globe Trade Centre", sector: "Nieruchomości", index: "mWIG40" },
  { ticker: "HUG", stooq: "hug", name: "Huuuge Inc.", sector: "Gry", index: "mWIG40" },
  { ticker: "ING", stooq: "ing", name: "ING Bank Śląski", sector: "Banki", index: "mWIG40" },
  { ticker: "JSW", stooq: "jsw", name: "JSW (Jastrzębska Spółka Węglowa)", sector: "Surowce", index: "mWIG40" },
  { ticker: "KER", stooq: "ker", name: "Kernel Holding", sector: "Rolnictwo", index: "mWIG40" },
  { ticker: "LBW", stooq: "lbw", name: "Lubawa SA", sector: "Obronność", index: "mWIG40" },
  { ticker: "MIL", stooq: "mil", name: "Bank Millennium", sector: "Banki", index: "mWIG40" },
  { ticker: "NEU", stooq: "neu", name: "Neuca SA", sector: "Farmacja", index: "mWIG40" },
  { ticker: "NWG", stooq: "nwg", name: "Newag SA", sector: "Przemysł", index: "mWIG40" },
  { ticker: "PEP", stooq: "pep", name: "Polenergia SA", sector: "Energetyka", index: "mWIG40" },
  { ticker: "STP", stooq: "stp", name: "Stalprodukt", sector: "Przemysł", index: "mWIG40" },
  { ticker: "STS", stooq: "sts", name: "STS Holding", sector: "Rozrywka", index: "mWIG40" },
  { ticker: "TEN", stooq: "ten", name: "Ten Square Games", sector: "Gry", index: "mWIG40" },
  { ticker: "TPE", stooq: "tpe", name: "Tauron Polska Energia", sector: "Energetyka", index: "mWIG40" },
  { ticker: "TXT", stooq: "txt", name: "Text SA (LiveChat)", sector: "Technologia", index: "mWIG40" },
  { ticker: "VRC", stooq: "vrc", name: "Vercom SA", sector: "Technologia", index: "mWIG40" },
  { ticker: "VOX", stooq: "vox", name: "Voxel SA", sector: "Medycyna", index: "mWIG40" },
  { ticker: "WPL", stooq: "wpl", name: "Wirtualna Polska Holding", sector: "Media", index: "mWIG40" },
  { ticker: "XTB", stooq: "xtb", name: "XTB SA", sector: "Finanse", index: "mWIG40" },

  // ═══════════════════════════════════════════════════════════════════
  // sWIG80 — 70 of 80 (ARC, CEL, CIE, KST, NET, TIM, WAR, ZWC, ACE, ELZ
  //                     delisted/acquired — no data from Yahoo or Stooq)
  // ═══════════════════════════════════════════════════════════════════
  { ticker: "ACG", stooq: "acg", name: "AC SA (Acautogaz)", sector: "Motoryzacja", index: "sWIG80" },
  { ticker: "AGO", stooq: "ago", name: "Agora SA", sector: "Media", index: "sWIG80" },
  { ticker: "ALL", stooq: "all", name: "Ailleron SA", sector: "Technologia", index: "sWIG80" },
  { ticker: "AMB", stooq: "amb", name: "Ambra SA", sector: "Spożywczy", index: "sWIG80" },
  { ticker: "AMC", stooq: "amc", name: "Amica SA", sector: "AGD", index: "sWIG80" },
  { ticker: "APT", stooq: "apt", name: "Apator SA", sector: "Przemysł", index: "sWIG80" },
  { ticker: "ARL", stooq: "arl", name: "Arlen SA", sector: "Przemysł", index: "sWIG80" },
  { ticker: "ABS", stooq: "abs", name: "Asseco Business Solutions", sector: "Technologia", index: "sWIG80" },
  { ticker: "ATC", stooq: "atc", name: "Arctic Paper", sector: "Przemysł", index: "sWIG80" },
  { ticker: "1AT", stooq: "1at", name: "Atal SA", sector: "Nieruchomości", index: "sWIG80" },
  { ticker: "ATT", stooq: "att", name: "Grupa Azoty", sector: "Chemia", index: "sWIG80" },
  { ticker: "BRS", stooq: "brs", name: "Boryszew SA", sector: "Przemysł", index: "sWIG80" },
  { ticker: "BOS", stooq: "bos", name: "Bank Ochrony Środowiska", sector: "Banki", index: "sWIG80" },
  { ticker: "CIG", stooq: "cig", name: "CI Games", sector: "Gry", index: "sWIG80" },
  { ticker: "CLE", stooq: "cle", name: "Coal Energy", sector: "Energetyka", index: "sWIG80" },
  { ticker: "DAD", stooq: "dad", name: "Dadelo SA", sector: "E-commerce", index: "sWIG80" },
  { ticker: "DCR", stooq: "dcr", name: "Decora SA", sector: "Budownictwo", index: "sWIG80" },
  { ticker: "ELT", stooq: "elt", name: "Elemental Holding", sector: "Surowce", index: "sWIG80" },
  { ticker: "ENT", stooq: "ent", name: "Enter Air", sector: "Transport", index: "sWIG80" },
  { ticker: "ERB", stooq: "erb", name: "Erbud SA", sector: "Budownictwo", index: "sWIG80" },
  { ticker: "FRO", stooq: "fro", name: "Ferro SA", sector: "Przemysł", index: "sWIG80" },
  { ticker: "FTE", stooq: "fte", name: "Fabryki Mebli Forte", sector: "Przemysł", index: "sWIG80" },
  { ticker: "GRN", stooq: "grn", name: "Grenevia SA (Famur)", sector: "Przemysł", index: "sWIG80" },
  { ticker: "GRX", stooq: "grx", name: "GreenX Metals", sector: "Surowce", index: "sWIG80" },
  { ticker: "IMC", stooq: "imc", name: "IMC SA", sector: "Rolnictwo", index: "sWIG80" },
  { ticker: "IZB", stooq: "izb", name: "Izoblok SA", sector: "Motoryzacja", index: "sWIG80" },
  { ticker: "KGN", stooq: "kgn", name: "Kogeneracja SA", sector: "Energetyka", index: "sWIG80" },
  { ticker: "KRK", stooq: "krk", name: "Krka d.d.", sector: "Farmacja", index: "sWIG80" },
  { ticker: "LWB", stooq: "lwb", name: "LW Bogdanka", sector: "Surowce", index: "sWIG80" },
  { ticker: "MBR", stooq: "mbr", name: "Mo-BRUK SA", sector: "Ekologia", index: "sWIG80" },
  { ticker: "MCR", stooq: "mcr", name: "Mercor SA", sector: "Przemysł", index: "sWIG80" },
  { ticker: "MDG", stooq: "mdg", name: "Medicalgorithmics", sector: "Medycyna", index: "sWIG80" },
  { ticker: "MLP", stooq: "mlp", name: "MLP Group", sector: "Nieruchomości", index: "sWIG80" },
  { ticker: "MNC", stooq: "mnc", name: "Mennica Polska", sector: "Przemysł", index: "sWIG80" },
  { ticker: "MRB", stooq: "mrb", name: "Mirbud SA", sector: "Budownictwo", index: "sWIG80" },
  { ticker: "MRC", stooq: "mrc", name: "Mercator Medical", sector: "Medycyna", index: "sWIG80" },
  { ticker: "OPN", stooq: "opn", name: "Oponeo.pl", sector: "E-commerce", index: "sWIG80" },
  { ticker: "PCE", stooq: "pce", name: "PCC Exol", sector: "Chemia", index: "sWIG80" },
  { ticker: "PCR", stooq: "pcr", name: "PCC Rokita", sector: "Chemia", index: "sWIG80" },
  { ticker: "PPS", stooq: "pps", name: "Pepees SA", sector: "Spożywczy", index: "sWIG80" },
  { ticker: "PHN", stooq: "phn", name: "Polski Holding Nieruchomości", sector: "Nieruchomości", index: "sWIG80" },
  { ticker: "PKP", stooq: "pkp", name: "PKP Cargo", sector: "Transport", index: "sWIG80" },
  { ticker: "PLW", stooq: "plw", name: "PlayWay SA", sector: "Gry", index: "sWIG80" },
  { ticker: "QRS", stooq: "qrs", name: "Quercus TFI", sector: "Finanse", index: "sWIG80" },
  { ticker: "RBW", stooq: "rbw", name: "Rainbow Tours", sector: "Turystyka", index: "sWIG80" },
  { ticker: "RVU", stooq: "rvu", name: "Ryvu Therapeutics", sector: "Biotechnologia", index: "sWIG80" },
  { ticker: "SFG", stooq: "sfg", name: "Synektik SA", sector: "Medycyna", index: "sWIG80" },
  { ticker: "SHO", stooq: "sho", name: "Shoper SA", sector: "E-commerce", index: "sWIG80" },
  { ticker: "SLV", stooq: "slv", name: "Selvita SA", sector: "Biotechnologia", index: "sWIG80" },
  { ticker: "SNK", stooq: "snk", name: "Sanok Rubber Company", sector: "Przemysł", index: "sWIG80" },
  { ticker: "STX", stooq: "stx", name: "Stalprofil SA", sector: "Przemysł", index: "sWIG80" },
  { ticker: "SWG", stooq: "swg", name: "Śnieżka SA", sector: "Chemia", index: "sWIG80" },
  { ticker: "TRK", stooq: "trk", name: "Trakcja SA", sector: "Budownictwo", index: "sWIG80" },
  { ticker: "UNI", stooq: "uni", name: "Unimot SA", sector: "Energetyka", index: "sWIG80" },
  { ticker: "VGO", stooq: "vgo", name: "Vigo Photonics", sector: "Technologia", index: "sWIG80" },
  { ticker: "VIN", stooq: "vin", name: "Vindexus SA", sector: "Finanse", index: "sWIG80" },
  { ticker: "VRG", stooq: "vrg", name: "VRG SA (Vistula)", sector: "Handel", index: "sWIG80" },
  { ticker: "WLT", stooq: "wlt", name: "Wielton SA", sector: "Przemysł", index: "sWIG80" },
  { ticker: "WTN", stooq: "wtn", name: "Wittchen SA", sector: "Handel", index: "sWIG80" },
  { ticker: "ZAP", stooq: "zap", name: "Grupa Azoty Puławy", sector: "Chemia", index: "sWIG80" },
  { ticker: "ZEP", stooq: "zep", name: "ZE PAK", sector: "Energetyka", index: "sWIG80" },
  { ticker: "AST", stooq: "ast", name: "Astarta Holding", sector: "Rolnictwo", index: "sWIG80" },
  { ticker: "BIO", stooq: "bio", name: "Bioton SA", sector: "Biotechnologia", index: "sWIG80" },
  { ticker: "BMC", stooq: "bmc", name: "Bumech SA", sector: "Surowce", index: "sWIG80" },
  { ticker: "CMP", stooq: "cmp", name: "Comp SA", sector: "Technologia", index: "sWIG80" },
  { ticker: "DGA", stooq: "dga", name: "DGA SA", sector: "Usługi", index: "sWIG80" },
  { ticker: "MLG", stooq: "mlg", name: "ML System SA", sector: "Technologia", index: "sWIG80" },
  { ticker: "PBX", stooq: "pbx", name: "Pekabex SA", sector: "Budownictwo", index: "sWIG80" },
  { ticker: "PXM", stooq: "pxm", name: "Polimex-Mostostal", sector: "Budownictwo", index: "sWIG80" },
  { ticker: "SKA", stooq: "ska", name: "Skarbiec Holding", sector: "Finanse", index: "sWIG80" },

  // ═══════════════════════════════════════════════════════════════════
  // WIG (broad index) — companies on GPW Main Market outside WIG20/mWIG40/sWIG80
  // These are smaller/less liquid companies on the main market
  // ═══════════════════════════════════════════════════════════════════
  { ticker: "ABE", stooq: "abe", name: "AB SA", sector: "Technologia", index: "WIG" },
  { ticker: "APN", stooq: "apn", name: "Action SA", sector: "Technologia", index: "WIG" },
  { ticker: "ATA", stooq: "ata", name: "Atende SA", sector: "Technologia", index: "WIG" },
  { ticker: "ATR", stooq: "atr", name: "Atrem SA", sector: "Budownictwo", index: "WIG" },

  { ticker: "BBT", stooq: "bbt", name: "Boombit SA", sector: "Gry", index: "WIG" },
  { ticker: "BLO", stooq: "blo", name: "Bloober Team", sector: "Gry", index: "WIG" },
  { ticker: "BST", stooq: "bst", name: "Best SA", sector: "Finanse", index: "WIG" },
  { ticker: "CDL", stooq: "cdl", name: "CDRL SA", sector: "Handel", index: "WIG" },
  { ticker: "CLC", stooq: "clc", name: "Columbus Energy", sector: "Energetyka", index: "WIG" },
  { ticker: "CPD", stooq: "cpd", name: "CPD SA", sector: "Nieruchomości", index: "WIG" },
  { ticker: "CRJ", stooq: "crj", name: "Creepy Jar", sector: "Gry", index: "WIG" },
  { ticker: "DEL", stooq: "del", name: "Delko SA", sector: "Handel", index: "WIG" },
  { ticker: "EAH", stooq: "eah", name: "e-Kancelaria SA", sector: "Finanse", index: "WIG" },
  { ticker: "EKP", stooq: "ekp", name: "Elkop Estonia SE", sector: "Budownictwo", index: "WIG" },
  { ticker: "FOR", stooq: "for", name: "Forbuild SA", sector: "Budownictwo", index: "WIG" },
  { ticker: "GKI", stooq: "gki", name: "GK Immobile SA", sector: "Nieruchomości", index: "WIG" },
  { ticker: "GTN", stooq: "gtn", name: "Getin Holding", sector: "Finanse", index: "WIG" },
  { ticker: "GEA", stooq: "gea", name: "Games SA", sector: "Gry", index: "WIG" },
  { ticker: "HRP", stooq: "hrp", name: "Harper Hygienics", sector: "FMCG", index: "WIG" },

  { ticker: "INC", stooq: "inc", name: "INC SA", sector: "Finanse", index: "WIG" },
  { ticker: "IRL", stooq: "irl", name: "Ifirma SA", sector: "Technologia", index: "WIG" },
  { ticker: "IZO", stooq: "izo", name: "Izolacja Jarocin", sector: "Budownictwo", index: "WIG" },
  { ticker: "JRH", stooq: "jrh", name: "JR Holding", sector: "Finanse", index: "WIG" },
  { ticker: "LRQ", stooq: "lrq", name: "Larq SA", sector: "Finanse", index: "WIG" },
  { ticker: "LTX", stooq: "ltx", name: "Lentex SA", sector: "Przemysł", index: "WIG" },
  { ticker: "MAB", stooq: "mab", name: "Mabion SA", sector: "Biotechnologia", index: "WIG" },
  { ticker: "MFO", stooq: "mfo", name: "MFO SA", sector: "Przemysł", index: "WIG" },
  { ticker: "MLB", stooq: "mlb", name: "Milog SA", sector: "Transport", index: "WIG" },
  { ticker: "MOJ", stooq: "moj", name: "Moje Bambino SA", sector: "Handel", index: "WIG" },
  { ticker: "MON", stooq: "mon", name: "Monnari Trade", sector: "Handel", index: "WIG" },
  { ticker: "MSW", stooq: "msw", name: "Mostostal Warszawa", sector: "Budownictwo", index: "WIG" },
  { ticker: "MSZ", stooq: "msz", name: "Mostostal Zabrze", sector: "Budownictwo", index: "WIG" },
  { ticker: "NTT", stooq: "ntt", name: "NTT System", sector: "Technologia", index: "WIG" },
  { ticker: "PAT", stooq: "pat", name: "Patentus SA", sector: "Przemysł", index: "WIG" },


  { ticker: "RPC", stooq: "rpc", name: "Relpol SA", sector: "Przemysł", index: "WIG" },
  { ticker: "SEK", stooq: "sek", name: "Seko SA", sector: "Spożywczy", index: "WIG" },
  { ticker: "SNW", stooq: "snw", name: "Sunex SA", sector: "Energetyka", index: "WIG" },
  { ticker: "TOR", stooq: "tor", name: "Torowa SA", sector: "Budownictwo", index: "WIG" },
  { ticker: "TMP", stooq: "tmp", name: "Torpol SA", sector: "Budownictwo", index: "WIG" },
  { ticker: "TOA", stooq: "toa", name: "Toya SA", sector: "Handel", index: "WIG" },
  { ticker: "TSG", stooq: "tsg", name: "Tesgas SA", sector: "Przemysł", index: "WIG" },
  { ticker: "ULG", stooq: "ulg", name: "Ulma Construccion", sector: "Budownictwo", index: "WIG" },
  { ticker: "VOT", stooq: "vot", name: "Votum SA", sector: "Finanse", index: "WIG" },
  { ticker: "WWL", stooq: "wwl", name: "Wawrzaszek ISS", sector: "Technologia", index: "WIG" },
  { ticker: "ZUE", stooq: "zue", name: "ZUE SA", sector: "Budownictwo", index: "WIG" },

  { ticker: "LEN", stooq: "len", name: "Lena Lighting", sector: "Przemysł", index: "WIG" },
  { ticker: "OBL", stooq: "obl", name: "Oble SA", sector: "Technologia", index: "WIG" },
  { ticker: "ONO", stooq: "ono", name: "OncoArendi Therapeutics", sector: "Biotechnologia", index: "WIG" },
  { ticker: "QNA", stooq: "qna", name: "QNA Technology SA", sector: "Technologia", index: "WIG" },
  { ticker: "TAR", stooq: "tar", name: "Tarczynski SA", sector: "Spożywczy", index: "WIG" },
  { ticker: "TOW", stooq: "tow", name: "Tower Investments", sector: "Nieruchomości", index: "WIG" },
  { ticker: "DBC", stooq: "dbc", name: "Dębica SA", sector: "Motoryzacja", index: "WIG" },
  { ticker: "MCI", stooq: "mci", name: "MCI Capital SA", sector: "Finanse", index: "WIG" },
  { ticker: "SPH", stooq: "sph", name: "Spyrosoft SA", sector: "Technologia", index: "WIG" },
  { ticker: "KPL", stooq: "kpl", name: "Kino Polska TV SA", sector: "Media", index: "WIG" },
  { ticker: "PCF", stooq: "pcf", name: "PCF Group SA (People Can Fly)", sector: "Gry", index: "WIG" },
  { ticker: "INP", stooq: "inp", name: "InPost SA", sector: "Logistyka", index: "WIG" },

  { ticker: "ANR", stooq: "anr", name: "Answear.com SA", sector: "E-commerce", index: "WIG" },
  { ticker: "ART", stooq: "art", name: "Artifex Mundi SA", sector: "Gry", index: "WIG" },
  { ticker: "ATG", stooq: "atg", name: "ATM Grupa SA", sector: "Media", index: "WIG" },
  { ticker: "BOW", stooq: "bow", name: "Bowim SA", sector: "Handel", index: "WIG" },
  { ticker: "DEK", stooq: "dek", name: "Dekpol SA", sector: "Budownictwo", index: "WIG" },
  { ticker: "HRS", stooq: "hrs", name: "Herkules SA", sector: "Budownictwo", index: "WIG" },
  { ticker: "LKD", stooq: "lkd", name: "Lokum Deweloper SA", sector: "Nieruchomości", index: "WIG" },
  { ticker: "MEX", stooq: "mex", name: "Mex Polska SA", sector: "Restauracje", index: "WIG" },
  { ticker: "MVP", stooq: "mvp", name: "Marvipol Development SA", sector: "Nieruchomości", index: "WIG" },
  { ticker: "OND", stooq: "ond", name: "Onde SA", sector: "Budownictwo", index: "WIG" },
  { ticker: "OTS", stooq: "ots", name: "OT Logistics SA", sector: "Transport", index: "WIG" },
  { ticker: "TLX", stooq: "tlx", name: "Talex SA", sector: "Technologia", index: "WIG" },
  { ticker: "ZMT", stooq: "zmt", name: "Zetkama SA", sector: "Przemysł", index: "WIG" },
  { ticker: "INT", stooq: "int", name: "INTROL SA", sector: "Technologia", index: "WIG" },
  { ticker: "IZS", stooq: "izs", name: "Izostal SA", sector: "Przemysł", index: "WIG" },
  { ticker: "KCI", stooq: "kci", name: "KCI SA", sector: "Nieruchomości", index: "WIG" },
  { ticker: "LSI", stooq: "lsi", name: "LSI Software SA", sector: "Technologia", index: "WIG" },
  { ticker: "MAK", stooq: "mak", name: "Makarony Polskie SA", sector: "Spożywczy", index: "WIG" },
  { ticker: "MIR", stooq: "mir", name: "Miraculum SA", sector: "FMCG", index: "WIG" },
  { ticker: "PLT", stooq: "plt", name: "Poltreg SA", sector: "Biotechnologia", index: "WIG" },
  { ticker: "PUR", stooq: "pur", name: "Pure Biologics SA", sector: "Biotechnologia", index: "WIG" },
  { ticker: "RNK", stooq: "rnk", name: "Rank Progress SA", sector: "Nieruchomości", index: "WIG" },
  { ticker: "WIK", stooq: "wik", name: "Wikana SA", sector: "Nieruchomości", index: "WIG" },
  { ticker: "PHR", stooq: "phr", name: "Pharmena SA", sector: "Farmacja", index: "WIG" },
  { ticker: "DIG", stooq: "dig", name: "Digital Network SA", sector: "Media", index: "WIG" },
  { ticker: "SCP", stooq: "scp", name: "Scope Fluidics SA", sector: "Biotechnologia", index: "WIG" },
  { ticker: "PJP", stooq: "pjp", name: "PJP Makrum SA", sector: "Przemysł", index: "WIG" },
  { ticker: "RAF", stooq: "raf", name: "Rafamet SA", sector: "Przemysł", index: "WIG" },
  { ticker: "SEL", stooq: "sel", name: "Selena FM SA", sector: "Chemia", index: "WIG" },
  { ticker: "STA", stooq: "sta", name: "Stalexport Autostrady SA", sector: "Transport", index: "WIG" },
  { ticker: "TRR", stooq: "trr", name: "Trans Polonia SA", sector: "Transport", index: "WIG" },
  { ticker: "LBT", stooq: "lbt", name: "Libet SA", sector: "Budownictwo", index: "WIG" },
  { ticker: "UNT", stooq: "unt", name: "Unima 2000 SA", sector: "Technologia", index: "WIG" },
  { ticker: "KBJ", stooq: "kbj", name: "KBJ SA", sector: "Technologia", index: "WIG" },
  { ticker: "EFE", stooq: "efe", name: "Efekt SA", sector: "Handel", index: "WIG" },
  { ticker: "GOB", stooq: "gob", name: "Gobarto SA (PKM Duda)", sector: "Spożywczy", index: "WIG" },

  { ticker: "PEN", stooq: "pen", name: "Peniol SA", sector: "Chemia", index: "WIG" },

  { ticker: "HUB", stooq: "hub", name: "Hub.Tech SA", sector: "Technologia", index: "WIG" },
  { ticker: "WAS", stooq: "was", name: "Wasko SA", sector: "Technologia", index: "WIG" },
  { ticker: "PWX", stooq: "pwx", name: "Pragma Inkaso SA", sector: "Finanse", index: "WIG" },



  { ticker: "MWT", stooq: "mwt", name: "M.W. Trade SA", sector: "Finanse", index: "WIG" },

  { ticker: "PGM", stooq: "pgm", name: "PMPG Polskie Media SA", sector: "Media", index: "WIG" },
];

/**
 * Index composition summary:
 *
 * WIG20 (20 companies) = 20 largest, most liquid
 * mWIG40 (37 in list) = next 40 after WIG20 (3 delisted: CMR, DIAG, PRC)
 * sWIG80 (70 in list) = next 80 after mWIG40 (10 delisted/acquired)
 * WIG = remaining smaller/less liquid companies (99 in list)
 * Total: 226 companies with verified data (Feb 2026 audit)
 *
 * Stooq symbol convention:
 * - GPW stocks: lowercase ticker, no suffix (e.g., "pkn", "pko", "cdr")
 * - International stocks on stooq: use suffix (e.g., "aapl.us", "vod.uk")
 * - Commodities: special codes (e.g., "xau", "cl.f", "ng.f")
 *
 * Known stooq symbols that differ from GPW tickers:
 * - AmRest: GPW ticker = EAT, stooq = eat
 * - Pepco Group: GPW ticker = PCO, stooq = pco
 * - Żabka Group: GPW ticker = ZAB, stooq = zab
 * - Diagnostyka: GPW ticker = DIAG, stooq = dia (delisted Feb 2026)
 * - Newag: GPW ticker = NWG, stooq = nwg
 * - Polenergia: GPW ticker = PEP, stooq = pep
 * - Vercom: GPW ticker = VRC, stooq = vrc
 * - BNP Paribas BP: GPW ticker = BNP, stooq = bnp
 *
 * SECTORS used (Polish, matching GPW classification):
 * AGD, Banki, Biotechnologia, Budownictwo, Chemia, E-commerce, Ekologia,
 * Energetyka, Farmacja, Finanse, FMCG, Gry, Handel, HR/Benefity, Media,
 * Medycyna, Motoryzacja, Nieruchomości, Obronność, Przemysł, Restauracje,
 * Rolnictwo, Rozrywka, Spożywczy, Surowce, Technologia, Telekomunikacja,
 * Transport, Turystyka, Ubezpieczenia, Usługi
 */

/**
 * Helper: Filter companies by index
 */
export function getByIndex(indexName) {
  return GPW_COMPANIES.filter(c => c.index === indexName);
}

/**
 * Helper: Get WIG140 (WIG20 + mWIG40 + sWIG80)
 */
export function getWIG140() {
  return GPW_COMPANIES.filter(c => ["WIG20", "mWIG40", "sWIG80"].includes(c.index));
}

/**
 * Helper: Lookup by ticker
 */
export function getByTicker(ticker) {
  return GPW_COMPANIES.find(c => c.ticker === ticker.toUpperCase());
}

/**
 * Helper: Lookup by stooq symbol
 */
export function getByStooq(stooq) {
  return GPW_COMPANIES.find(c => c.stooq === stooq.toLowerCase());
}

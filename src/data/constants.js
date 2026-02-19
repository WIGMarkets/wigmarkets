export const SECTOR_AVERAGES = {
  "Banki":          { pe: 9.8,  pb: 1.15, evEbitda: null, div: 6.2 },
  "Energetyka":     { pe: 7.5,  pb: 0.85, evEbitda: 5.2,  div: 4.8 },
  "Surowce":        { pe: 9.2,  pb: 1.1,  evEbitda: 6.1,  div: 4.2 },
  "Handel":         { pe: 18.4, pb: 2.8,  evEbitda: 11.2, div: 2.1 },
  "Gry":            { pe: 28.6, pb: 4.8,  evEbitda: 16.4, div: 1.2 },
  "Technologia":    { pe: 18.2, pb: 2.9,  evEbitda: 13.1, div: 3.2 },
  "Nieruchomości":  { pe: 8.1,  pb: 0.92, evEbitda: 14.2, div: 6.4 },
  "Ubezpieczenia":  { pe: 10.8, pb: 1.82, evEbitda: null, div: 7.8 },
  "Finanse":        { pe: 11.4, pb: 1.65, evEbitda: 9.2,  div: 6.4 },
  "Budownictwo":    { pe: 9.4,  pb: 1.48, evEbitda: 7.8,  div: 4.2 },
  "Media":          { pe: 14.2, pb: 1.9,  evEbitda: 8.4,  div: 4.1 },
  "Telekomunikacja":{ pe: 16.8, pb: 2.1,  evEbitda: 9.2,  div: 5.2 },
  "Chemia":         { pe: 11.2, pb: 1.4,  evEbitda: 6.8,  div: 2.4 },
  "Przemysł":       { pe: 12.4, pb: 1.8,  evEbitda: 8.6,  div: 4.2 },
  "E-commerce":     { pe: 20.2, pb: 3.4,  evEbitda: 14.8, div: 0   },
  "Medycyna":       { pe: 15.8, pb: 2.4,  evEbitda: 11.2, div: 2.8 },
  "Biotechnologia": { pe: null, pb: 2.2,  evEbitda: null, div: 0   },
  "Spożywczy":      { pe: 16.2, pb: 2.8,  evEbitda: 9.6,  div: 4.8 },
  "Transport":      { pe: 8.4,  pb: 1.2,  evEbitda: 5.8,  div: 2.4 },
  "Motoryzacja":    { pe: 11.8, pb: 1.7,  evEbitda: 7.2,  div: 2.6 },
  "Farmacja":       { pe: 14.2, pb: 2.4,  evEbitda: 9.8,  div: 3.8 },
  "HR/Benefity":    { pe: 22.4, pb: 3.2,  evEbitda: 14.8, div: 1.8 },
  "Restauracje":    { pe: 16.4, pb: 2.4,  evEbitda: 10.2, div: 0   },
  "Rolnictwo":      { pe: null, pb: 0.8,  evEbitda: 6.4,  div: 0   },
  "FMCG":           { pe: 18.4, pb: 2.6,  evEbitda: 12.2, div: 2.4 },
  "Turystyka":      { pe: 9.8,  pb: 1.6,  evEbitda: 6.4,  div: 2.4 },
  "AGD":            { pe: 11.8, pb: 1.8,  evEbitda: 8.2,  div: 3.2 },
  "Ekologia":       { pe: 13.4, pb: 2.0,  evEbitda: 9.4,  div: 4.8 },
  "Obronność":      { pe: 14.8, pb: 2.2,  evEbitda: 10.4, div: 2.8 },
  "Usługi":         { pe: 12.4, pb: 1.8,  evEbitda: 8.8,  div: 3.2 },
  "default":        { pe: 12.4, pb: 1.6,  evEbitda: 9.2,  div: 3.8 },
};

export const FEAR_COMPONENTS = [
  { label: "Momentum rynku",           val: 68 },
  { label: "Siła wolumenu",            val: 55 },
  { label: "Szerokość rynku",          val: 72 },
  { label: "Zmienność (VIX GPW)",      val: 44 },
  { label: "Put/Call ratio",           val: 60 },
  { label: "Popyt na bezpieczne aktywa", val: 38 },
];

// 30-day mock history for Fear & Greed sparkline (ends at current value 62)
export const FEAR_HISTORY = [
  48, 44, 41, 38, 42, 47, 50, 53, 49, 46,
  43, 48, 55, 59, 63, 61, 57, 54, 58, 63,
  67, 71, 68, 65, 60, 57, 59, 63, 61, 62,
];

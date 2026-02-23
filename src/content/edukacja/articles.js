import jakZaczac from "./jak-zaczac-inwestowac-na-gpw.json";
import najlepszeBrokera from "./najlepsze-konto-maklerskie.json";
import coToJestGpw from "./co-to-jest-gpw.json";
import wskaznikPe from "./wskaznik-pe.json";
import spolkiDywidendowe from "./spolki-dywidendowe-gpw.json";
import analizaTechniczna from "./analiza-techniczna-podstawy.json";
import jakCzytacWyniki from "./jak-czytac-wyniki-finansowe.json";
import etfNaGpw from "./etf-na-gpw.json";
import wig20Indeksy from "./wig20-mwig40-swig80.json";
import ilePieniedzy from "./ile-pieniedzy-zeby-zaczac.json";
import xtbVsMbank from "./xtb-vs-mbank-vs-bossa.json";
import jakKupicAkcje from "./jak-kupic-akcje-krok-po-kroku.json";
import podatekBelki from "./podatek-belki-pit-38.json";
import ikeVsIkze from "./ike-vs-ikze.json";
import obligacjeSkarbowe from "./obligacje-skarbowe-2026.json";
import najlepszeAplikacje from "./najlepsze-aplikacje-do-inwestowania.json";
import wskaznikiFundamentalne from "./wskazniki-fundamentalne-gpw.json";
import jakBudowacPortfel from "./jak-budowac-portfel-inwestycyjny.json";
import rodzajeZlecen from "./rodzaje-zlecen-gieldowych.json";
import sezonWynikow from "./sezon-wynikow-gpw.json";

/* New articles — Podstawy */
import czymJestDywidenda from "./czym-jest-dywidenda.json";
import jakDzialaSesja from "./jak-dziala-sesja-gieldowa.json";
import shortSelling from "./short-selling.json";
import newconnectRynek from "./newconnect-rynek.json";
import kontraktyTerminowe from "./kontrakty-terminowe.json";

/* New articles — Analiza */
import wskaznikRsi from "./wskaznik-rsi.json";
import wskaznikMacd from "./wskaznik-macd.json";
import srednieKroczace from "./srednie-kroczace-sma-ema.json";
import wykresSwiecowy from "./wykres-swiecowy-formacje.json";
import wskaznikRoe from "./wskaznik-roe.json";

/* New articles — Strategia */
import strategiaDca from "./strategia-dca.json";
import valueInvesting from "./value-investing-gpw.json";
import stopLossTakeProfit from "./stop-loss-take-profit.json";
import momentumInvesting from "./momentum-investing.json";
import inwestowanieZloto from "./inwestowanie-zloto-surowce.json";

export const ARTICLES = [
  jakZaczac,
  najlepszeBrokera,
  coToJestGpw,
  wskaznikPe,
  spolkiDywidendowe,
  analizaTechniczna,
  jakCzytacWyniki,
  etfNaGpw,
  wig20Indeksy,
  ilePieniedzy,
  xtbVsMbank,
  jakKupicAkcje,
  podatekBelki,
  ikeVsIkze,
  obligacjeSkarbowe,
  najlepszeAplikacje,
  wskaznikiFundamentalne,
  jakBudowacPortfel,
  rodzajeZlecen,
  sezonWynikow,
  /* New — Podstawy */
  czymJestDywidenda,
  jakDzialaSesja,
  shortSelling,
  newconnectRynek,
  kontraktyTerminowe,
  /* New — Analiza */
  wskaznikRsi,
  wskaznikMacd,
  srednieKroczace,
  wykresSwiecowy,
  wskaznikRoe,
  /* New — Strategia */
  strategiaDca,
  valueInvesting,
  stopLossTakeProfit,
  momentumInvesting,
  inwestowanieZloto,
];

export function getArticleBySlug(slug) {
  return ARTICLES.find(a => a.slug === slug) || null;
}

export function getArticlesByCategory(category) {
  return ARTICLES.filter(a => a.category === category);
}

export function getArticlesBySlug(slugs) {
  return (slugs || []).map(slug => getArticleBySlug(slug)).filter(Boolean);
}

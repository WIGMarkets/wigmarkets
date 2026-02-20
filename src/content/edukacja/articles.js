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

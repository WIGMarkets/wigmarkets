// StockLogo → CompanyMonogram (wrapper dla wstecznej kompatybilności)
// Wszystkie użycia <StockLogo ticker size borderRadius sector> przechodzą
// na nowy ujednolicony styl monogramów.
import CompanyMonogram from "./CompanyMonogram.jsx";

export default function StockLogo({ ticker, size = 28, sector = "" }) {
  return <CompanyMonogram ticker={ticker} sector={sector} size={size} />;
}

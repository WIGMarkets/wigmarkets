import { useParams, Navigate } from "react-router-dom";
import StockPage from "../components/StockPage.jsx";

export function StockPageRoute({ prices, changes, theme, watchlist, toggleWatch, liveStocks, allInstruments }) {
  const { ticker } = useParams();
  const stock = allInstruments.find(s => s.ticker === ticker?.toUpperCase())
             || liveStocks?.find(s => s.ticker === ticker?.toUpperCase());
  if (!stock) return <Navigate to="/" replace />;
  return <StockPage stock={stock} prices={prices} changes={changes} theme={theme} watchlist={watchlist} toggleWatch={toggleWatch} liveStocks={liveStocks} />;
}

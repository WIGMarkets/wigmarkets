import { useParams, Navigate } from "react-router-dom";
import StockPage from "../components/StockPage.jsx";
import CategoryPage from "../components/edukacja/CategoryPage.jsx";
import ArticlePage from "../components/edukacja/ArticlePage.jsx";

const EDUKACJA_CATEGORIES = ["podstawy", "analiza", "strategia"];

export function StockPageRoute({ prices, changes, theme, watchlist, toggleWatch, liveStocks, allInstruments }) {
  const { ticker } = useParams();
  const stock = allInstruments.find(s => s.ticker === ticker?.toUpperCase())
             || liveStocks?.find(s => s.ticker === ticker?.toUpperCase());
  if (!stock) return <Navigate to="/" replace />;
  return <StockPage stock={stock} prices={prices} changes={changes} theme={theme} watchlist={watchlist} toggleWatch={toggleWatch} liveStocks={liveStocks} />;
}

export function EdukacjaSlugRoute({ theme }) {
  const { slug } = useParams();
  if (EDUKACJA_CATEGORIES.includes(slug)) {
    return <CategoryPage theme={theme} />;
  }
  return <ArticlePage theme={theme} />;
}

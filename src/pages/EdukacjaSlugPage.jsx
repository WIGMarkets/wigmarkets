import { useParams } from "react-router-dom";
import CategoryPage from "../components/edukacja/CategoryPage.jsx";
import ArticlePage from "../components/edukacja/ArticlePage.jsx";

const EDUKACJA_CATEGORIES = ["podstawy", "analiza", "strategia"];

export default function EdukacjaSlugRoute({ theme }) {
  const { slug } = useParams();
  if (EDUKACJA_CATEGORIES.includes(slug)) {
    return <CategoryPage theme={theme} />;
  }
  return <ArticlePage theme={theme} />;
}

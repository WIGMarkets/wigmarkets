// Lightweight article index — only metadata (~36 kB), no full content.
// Full article content (sections, faq) is loaded on demand via loadFullArticle().
import ARTICLES_META from "./articles-meta.json";

export const ARTICLES = ARTICLES_META;

export function getArticlesByCategory(category) {
  return ARTICLES.filter(a => a.category === category);
}

export function getArticlesBySlug(slugs) {
  return (slugs || []).map(slug => ARTICLES.find(a => a.slug === slug)).filter(Boolean);
}

// Synchronous metadata lookup (for listing pages)
export function getArticleBySlug(slug) {
  return ARTICLES.find(a => a.slug === slug) || null;
}

// Vite glob import — each JSON becomes a lazy chunk, loaded on demand.
// Excludes the metadata index file.
const articleModules = import.meta.glob(
  ['./*.json', '!./articles-meta.json'],
  { import: 'default' }
);

// Async full article loader — loads only the specific article the user is reading.
export async function loadFullArticle(slug) {
  const meta = ARTICLES.find(a => a.slug === slug);
  if (!meta) return null;
  const loader = articleModules[`./${slug}.json`];
  if (!loader) return null;
  return loader();
}

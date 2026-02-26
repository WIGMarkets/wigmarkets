import { promises as fsp } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const newsPath = path.join(process.cwd(), 'data', 'news.json');

    let raw;
    try {
      raw = JSON.parse(await fsp.readFile(newsPath, 'utf-8'));
    } catch {
      return res.status(200).json({ articles: [], updatedAt: null });
    }

    // Support both new format { articles, updatedAt } and legacy array format
    const articles = Array.isArray(raw) ? raw : (raw.articles || []);
    const updatedAt = raw.updatedAt || (await fsp.stat(newsPath)).mtime.toISOString();

    const { source, days, limit } = req.query;

    let filtered = articles;

    if (source) {
      filtered = filtered.filter(a => a.source.toLowerCase().includes(source.toLowerCase()));
    }

    if (days) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - parseInt(days));
      filtered = filtered.filter(a => new Date(a.dateISO) >= cutoff);
    }

    if (limit) {
      filtered = filtered.slice(0, parseInt(limit));
    }

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=120');
    res.json({
      articles: filtered,
      total: filtered.length,
      updatedAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

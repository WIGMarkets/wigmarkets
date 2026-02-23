import fs from "fs";
import path from "path";
import glossaryData from "../src/data/glossary.json";
import { GPW_COMPANIES } from "../src/data/gpw-companies.js";
import { RANKINGS } from "../src/data/rankings.js";

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export default function handler(req, res) {
  const today = new Date().toISOString().split("T")[0];
  const base = "https://wigmarkets.pl";

  // ── Dynamic: education articles ────────────────────────────────────────────
  const articlesDir = path.join(process.cwd(), "src/content/edukacja");
  const articleFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith(".json"));
  const articles = articleFiles
    .map(f => {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(articlesDir, f), "utf-8"));
        return data.slug ? data : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  // ── Static: top-level pages ─────────────────────────────────────────────────
  const staticPages = [
    { loc: `${base}/`,          lastmod: today, changefreq: "daily",   priority: "1.0" },
    { loc: `${base}/fear-greed`, lastmod: today, changefreq: "daily",   priority: "0.8" },
    { loc: `${base}/wiadomosci`, lastmod: today, changefreq: "daily",   priority: "0.8" },
    { loc: `${base}/dywidendy`,  lastmod: today, changefreq: "weekly",  priority: "0.7" },
    { loc: `${base}/portfolio`,  lastmod: today, changefreq: "monthly", priority: "0.5" },
  ];

  // ── Education: hub + categories ─────────────────────────────────────────────
  const educationStaticPages = [
    { loc: `${base}/edukacja`,           lastmod: today, changefreq: "weekly", priority: "0.8" },
    { loc: `${base}/edukacja/slowniczek`, lastmod: today, changefreq: "weekly", priority: "0.8" },
    { loc: `${base}/edukacja/podstawy`,  lastmod: today, changefreq: "weekly", priority: "0.7" },
    { loc: `${base}/edukacja/analiza`,   lastmod: today, changefreq: "weekly", priority: "0.7" },
    { loc: `${base}/edukacja/strategia`, lastmod: today, changefreq: "weekly", priority: "0.7" },
  ];

  // ── Dynamic: education articles ─────────────────────────────────────────────
  const articlePages = articles.map(a => ({
    loc: `${base}/edukacja/${a.slug}`,
    lastmod: a.updatedDate || a.publishDate || today,
    changefreq: "monthly",
    priority: "0.6",
  }));

  // ── Dynamic: glossary terms ──────────────────────────────────────────────────
  const glossaryPages = glossaryData.map(g => ({
    loc: `${base}/edukacja/slowniczek/${g.slug}`,
    lastmod: today,
    changefreq: "monthly",
    priority: "0.5",
  }));

  // ── Rankings ─────────────────────────────────────────────────────────────────
  const rankingPages = [
    { loc: `${base}/rankingi`, lastmod: today, changefreq: "daily", priority: "0.8" },
    ...RANKINGS.map(r => ({
      loc: `${base}/rankingi/${r.slug}`,
      lastmod: today,
      changefreq: "daily",
      priority: "0.7",
    })),
  ];

  // ── Indices ──────────────────────────────────────────────────────────────────
  const indexSlugs = ["wig20", "wig", "mwig40", "swig80", "sp500", "nasdaq", "dow-jones", "dax", "ftse100", "cac40", "nikkei225", "hang-seng"];
  const indexPages = [
    { loc: `${base}/indeksy`, lastmod: today, changefreq: "daily", priority: "0.7" },
    ...indexSlugs.map(s => ({
      loc: `${base}/indeksy/${s}`,
      lastmod: today,
      changefreq: "daily",
      priority: "0.6",
    })),
  ];

  // ── Dynamic: stock pages ─────────────────────────────────────────────────────
  const stockPages = GPW_COMPANIES.map(c => ({
    loc: `${base}/spolka/${c.ticker}`,
    lastmod: today,
    changefreq: "daily",
    priority: "0.6",
  }));

  const allPages = [
    ...staticPages,
    ...educationStaticPages,
    ...articlePages,
    ...glossaryPages,
    ...rankingPages,
    ...indexPages,
    ...stockPages,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(urlEntry).join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(xml);
}

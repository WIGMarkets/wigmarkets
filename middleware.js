// Vercel Edge Middleware
// Intercepts social media crawlers and serves them HTML with proper OG meta tags.
// Normal users get the standard SPA.

import glossaryData from "./src/data/glossary.json";
import { GPW_COMPANIES } from "./src/data/gpw-companies.js";
import companyDescriptions from "./src/data/company-descriptions.json";
import { RANKINGS } from "./src/data/rankings.js";

const CRAWLER_RE = /Twitterbot|facebookexternalhit|LinkedInBot|Slackbot|Discordbot|WhatsApp|Googlebot|bingbot/i;

const glossaryBySlug = Object.fromEntries(glossaryData.map(e => [e.slug, e]));
const tickerToName = Object.fromEntries(GPW_COMPANIES.map(c => [c.ticker, c.name]));
const rankingBySlug = Object.fromEntries(RANKINGS.map(r => [r.slug, r]));

function truncateDesc(str, max = 155) {
  if (!str || str.length <= max) return str || "";
  const cut = str.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max - 25 ? cut.slice(0, lastSpace) : cut) + "…";
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function htmlShell({ title, description, image, url, jsonLd }) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const img = image ? escapeHtml(image) : "";
  const u = escapeHtml(url);
  const imgTags = img
    ? `  <meta property="og:image" content="${img}" />\n  <meta name="twitter:image" content="${img}" />\n  <meta name="twitter:card" content="summary_large_image" />`
    : `  <meta name="twitter:card" content="summary" />`;
  const ldTag = jsonLd
    ? `\n  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
    : "";
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <title>${t}</title>
  <meta name="description" content="${d}" />
  <meta property="og:title" content="${t}" />
  <meta property="og:description" content="${d}" />
${imgTags}
  <meta property="og:url" content="${u}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="WIGmarkets.pl" />
  <meta name="twitter:title" content="${t}" />
  <meta name="twitter:description" content="${d}" />
  <link rel="canonical" href="${u}" />${ldTag}
</head>
<body>
  <p>Redirecting to <a href="${u}">${t}</a>...</p>
</body>
</html>`;
}

export default function middleware(req) {
  const userAgent = req.headers.get("user-agent") || "";

  // Only intercept crawlers
  if (!CRAWLER_RE.test(userAgent)) return;

  const url = new URL(req.url);
  const path = url.pathname;
  const base = "https://wigmarkets.pl";

  // Fear & Greed page
  if (path === "/fear-greed" || path === "/indeks") {
    return new Response(
      htmlShell({
        title: "GPW Fear & Greed Index — WIGmarkets.pl",
        description:
          "Sprawdź aktualny sentyment rynku GPW. Wskaźnik obliczany z 7 składowych: momentum, szerokość rynku, zmienność, nowe szczyty, wolumen, małe vs duże spółki, popyt na bezpieczne aktywa.",
        image: `${base}/api/og?type=fear-greed`,
        url: `${base}/fear-greed`,
      }),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // Stock detail page (/spolka/PKN or /stock/PKN)
  const stockMatch = path.match(/^\/(spolka|stock)\/([A-Za-z0-9]+)$/);
  if (stockMatch) {
    const ticker = stockMatch[2].toUpperCase();
    const name = tickerToName[ticker] || ticker;
    const descData = companyDescriptions[ticker];
    const rawDesc = descData?.description ||
      `Kurs, analiza techniczna i fundamentalna spółki ${name} (${ticker}) na Giełdzie Papierów Wartościowych w Warszawie.`;
    const shortDesc = truncateDesc(rawDesc);
    const pageUrl = `${base}/spolka/${ticker}`;
    return new Response(
      htmlShell({
        title: `${name} (${ticker}) — kurs akcji GPW — WIGmarkets.pl`,
        description: shortDesc,
        image: `${base}/api/og?type=stock&ticker=${ticker}`,
        url: pageUrl,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": name,
          "description": shortDesc,
          "url": pageUrl,
        },
      }),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // Glossary term detail page (/edukacja/slowniczek/:slug)
  const glossaryTermMatch = path.match(/^\/edukacja\/slowniczek\/([a-z0-9-]+)$/);
  if (glossaryTermMatch) {
    const slug = glossaryTermMatch[1];
    const entry = glossaryBySlug[slug];
    if (entry) {
      return new Response(
        htmlShell({
          title: `${entry.term} — Słowniczek giełdowy — WIGmarkets.pl`,
          description: `${entry.shortDef} Definicja, wzór, przykład.`,
          url: `${base}/edukacja/slowniczek/${slug}`,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            "name": entry.term,
            "description": entry.shortDef,
            "url": `${base}/edukacja/slowniczek/${slug}`,
            "inDefinedTermSet": {
              "@type": "DefinedTermSet",
              "name": "Słowniczek giełdowy WIGmarkets.pl",
              "url": `${base}/edukacja/slowniczek`,
            },
          },
        }),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }
  }

  // Glossary list page (/edukacja/slowniczek)
  if (path === "/edukacja/slowniczek" || path === "/edukacja/slowniczek/") {
    return new Response(
      htmlShell({
        title: "Słowniczek giełdowy — WIGmarkets.pl",
        description: `${glossaryData.length} najważniejszych pojęć giełdowych wyjaśnionych prostym językiem. Akcje, wskaźniki, analiza techniczna i fundamentalna — kompendium wiedzy o GPW.`,
        url: `${base}/edukacja/slowniczek`,
      }),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // Rankings list page (/rankingi)
  if (path === "/rankingi" || path === "/rankingi/") {
    return new Response(
      htmlShell({
        title: "Rankingi GPW — WIGmarkets.pl",
        description: "Automatycznie aktualizowane rankingi spółek na Giełdzie Papierów Wartościowych. Wzrosty, spadki, dywidendy, kapitalizacja i więcej.",
        url: `${base}/rankingi`,
      }),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // Ranking detail page (/rankingi/:slug)
  const rankingMatch = path.match(/^\/rankingi\/([a-z0-9-]+)$/);
  if (rankingMatch) {
    const slug = rankingMatch[1];
    const ranking = rankingBySlug[slug];
    if (ranking) {
      return new Response(
        htmlShell({
          title: `${ranking.seoTitle} — WIGmarkets.pl`,
          description: ranking.seoDescription,
          url: `${base}/rankingi/${slug}`,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": ranking.seoTitle,
            "url": `${base}/rankingi/${slug}`,
          },
        }),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }
  }

  // All other pages — let them through (will use index.html default OG tags)
}

export const config = {
  matcher: ["/fear-greed", "/indeks", "/spolka/:path*", "/stock/:path*", "/edukacja/slowniczek", "/edukacja/slowniczek/:path*", "/rankingi", "/rankingi/:path*"],
};

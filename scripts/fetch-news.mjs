import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { parseStringPromise } from 'xml2js';

const SPAM_KEYWORDS = [
  'premii', 'premia', 'promocja', 'konto za 0 zł', 'pożyczka',
  'kredyt gotówkowy', 'cashback', 'bonus za założenie', 'oferta dla',
  'oprocentowanie', 'lokata',
];

const RSS_FEEDS = [
  {
    name: 'Bankier.pl',
    category: 'gielda',
    url: 'https://www.bankier.pl/rss/gielda.xml',
    color: '#e74c3c',
  },
  {
    name: 'Bankier.pl',
    category: 'wiadomosci',
    url: 'https://www.bankier.pl/rss/wiadomosci.xml',
    color: '#e74c3c',
  },
  {
    name: 'Stooq',
    category: 'gielda',
    url: 'https://stooq.pl/rss/',
    color: '#3498db',
  },
  {
    name: 'Money.pl',
    category: 'gielda',
    url: 'https://www.money.pl/rss/gielda.xml',
    color: '#27ae60',
  },
  {
    name: 'Business Insider Polska',
    category: 'finanse',
    url: 'https://businessinsider.com.pl/.feed',
    color: '#2c3e50',
  },
  {
    name: 'Investing.com PL',
    category: 'gielda',
    url: 'https://pl.investing.com/rss/news_301.rss',
    color: '#e67e22',
  },
];

async function fetchFeed(feed) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(feed.url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'WIGmarkets/1.0 RSS Reader' },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[SKIP] ${feed.name} (${feed.category}): HTTP ${res.status}`);
      return [];
    }

    const xml = await res.text();
    let parsed;
    try {
      parsed = await parseStringPromise(xml, { explicitArray: false });
    } catch {
      // Try Atom format fallback
      console.warn(`[SKIP] ${feed.name}: could not parse XML`);
      return [];
    }

    // RSS 2.0 format
    const channel = parsed?.rss?.channel;
    if (!channel?.item) {
      // Try Atom format
      const feed_data = parsed?.feed;
      if (feed_data?.entry) {
        const entries = Array.isArray(feed_data.entry) ? feed_data.entry : [feed_data.entry];
        return entries.map(entry => ({
          title: cleanText(typeof entry.title === 'string' ? entry.title : entry.title?._ || ''),
          link: typeof entry.link === 'string' ? entry.link : (entry.link?.$ ? entry.link.$.href : (Array.isArray(entry.link) ? (entry.link.find(l => l.$?.rel === 'alternate')?.$.href || entry.link[0]?.$.href || '') : '')),
          description: cleanText((typeof entry.summary === 'string' ? entry.summary : entry.summary?._ || entry.content?._ || '')).slice(0, 300),
          pubDate: entry.published || entry.updated || '',
          source: feed.name,
          sourceColor: feed.color,
          category: feed.category,
          image: extractImageFromAtom(entry),
        })).filter(item => item.title && item.link);
      }
      console.warn(`[SKIP] ${feed.name}: no items found in RSS`);
      return [];
    }

    const items = Array.isArray(channel.item) ? channel.item : [channel.item];

    return items.map(item => ({
      title: cleanText(item.title || ''),
      link: item.link || '',
      description: cleanText(item.description || '').slice(0, 300),
      pubDate: item.pubDate || item['dc:date'] || '',
      source: feed.name,
      sourceColor: feed.color,
      category: feed.category,
      image: extractImageFromRSS(item),
    })).filter(item => item.title && item.link);

  } catch (err) {
    console.warn(`[ERROR] ${feed.name} (${feed.category}): ${err.message}`);
    return [];
  }
}

function extractImageFromRSS(item) {
  // 1. <enclosure> tag
  if (item.enclosure?.$?.url) return item.enclosure.$.url;
  if (typeof item.enclosure === 'string') return null;

  // 2. <media:content> or <media:thumbnail>
  const media = item['media:content'] || item['media:thumbnail'];
  if (media?.$?.url) return media.$.url;
  if (Array.isArray(media) && media[0]?.$?.url) return media[0].$.url;

  // 3. Image in <description> HTML
  const descHtml = item.description || '';
  const imgMatch = descHtml.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch) return imgMatch[1];

  return null;
}

function extractImageFromAtom(entry) {
  const media = entry['media:content'] || entry['media:thumbnail'];
  if (media?.$?.url) return media.$.url;
  if (Array.isArray(media) && media[0]?.$?.url) return media[0].$.url;

  const content = entry.content?._ || entry.summary?._ || '';
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch) return imgMatch[1];

  return null;
}

function cleanText(text) {
  return text
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchOGImage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'WIGmarkets/1.0 RSS Reader' },
      redirect: 'follow',
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const reader = res.body.getReader();
    let html = '';
    while (html.length < 20000) {
      const { done, value } = await reader.read();
      if (done) break;
      html += new TextDecoder().decode(value);
    }
    reader.cancel();

    const ogMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i
    );

    if (ogMatch && ogMatch[1]) {
      const imgUrl = ogMatch[1];
      if (imgUrl.startsWith('http')) return imgUrl;
    }

    return null;
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

function formatPolishDate(date) {
  if (isNaN(date.getTime())) return '';
  const months = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
    'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

async function main() {
  console.log(`Fetching news from ${RSS_FEEDS.length} feeds...`);

  const results = await Promise.allSettled(
    RSS_FEEDS.map(feed => fetchFeed(feed))
  );

  let allArticles = [];
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const feed = RSS_FEEDS[i];
    if (r.status === 'fulfilled') {
      console.log(`  [OK] ${feed.name} (${feed.category}): ${r.value.length} articles`);
      allArticles.push(...r.value);
    } else {
      console.log(`  [FAIL] ${feed.name} (${feed.category}): ${r.reason?.message || 'unknown error'}`);
    }
  }

  console.log(`Fetched ${allArticles.length} articles total`);

  // Filter out articles older than 30 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const beforeFilter = allArticles.length;
  allArticles = allArticles.filter(article => {
    const d = new Date(article.pubDate);
    return !isNaN(d.getTime()) && d >= cutoff;
  });
  console.log(`Filtered out ${beforeFilter - allArticles.length} articles older than 30 days`);

  // Filter out spam/ads
  const beforeSpam = allArticles.length;
  allArticles = allArticles.filter(article => {
    const text = `${article.title} ${article.description}`.toLowerCase();
    return !SPAM_KEYWORDS.some(kw => text.includes(kw));
  });
  console.log(`Filtered out ${beforeSpam - allArticles.length} spam/ad articles`);

  // Deduplicate by URL
  const seen = new Set();
  allArticles = allArticles.filter(article => {
    const key = article.link.replace(/[?#].*$/, '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by date (newest first)
  allArticles.sort((a, b) => {
    const dateA = new Date(a.pubDate);
    const dateB = new Date(b.pubDate);
    return dateB - dateA;
  });

  // Keep top 100
  allArticles = allArticles.slice(0, 100);

  // Fetch OG images for top 20 articles without images
  console.log('Fetching OG images for top 20 articles without images...');

  const articlesNeedingImages = allArticles
    .slice(0, 20)
    .filter(a => !a.image);

  for (let i = 0; i < articlesNeedingImages.length; i += 5) {
    const batch = articlesNeedingImages.slice(i, i + 5);
    await Promise.allSettled(
      batch.map(async (article) => {
        try {
          const ogImage = await fetchOGImage(article.link);
          if (ogImage) article.image = ogImage;
        } catch {
          // no image is fine
        }
      })
    );
  }

  const withImages = allArticles.filter(a => a.image).length;
  console.log(`Articles with images: ${withImages}/${allArticles.length}`);

  // Add parsed dates
  allArticles = allArticles.map(article => ({
    ...article,
    dateISO: new Date(article.pubDate).toISOString(),
    dateFormatted: formatPolishDate(new Date(article.pubDate)),
  }));

  // Ensure data/ directory exists
  if (!existsSync('data')) {
    mkdirSync('data', { recursive: true });
  }

  const output = {
    articles: allArticles,
    updatedAt: new Date().toISOString(),
  };

  writeFileSync(
    'data/news.json',
    JSON.stringify(output, null, 2),
    'utf-8'
  );

  console.log(`Saved ${allArticles.length} articles to data/news.json`);

  // Summary per source
  const bySource = {};
  allArticles.forEach(a => {
    bySource[a.source] = (bySource[a.source] || 0) + 1;
  });
  console.log('Per source:', bySource);
}

main();

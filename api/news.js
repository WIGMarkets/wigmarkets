export default async function handler(req, res) {
  const { q } = req.query;
  const limit = Math.min(parseInt(req.query.limit) || 10, 30);
  const query = q ? q + " GPW when:30d" : "GPW giełda akcje spółki when:30d";

  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pl&gl=PL&ceid=PL:pl`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; WIGmarkets/1.0)" },
    });
    const xml = await response.text();

    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
      const block = match[1];

      const title = (/<title><!\[CDATA\[(.*?)\]\]><\/title>/.exec(block) ||
                     /<title>(.*?)<\/title>/.exec(block))?.[1]?.trim() ?? "";
      const link = (/<link>(.*?)<\/link>/.exec(block) ||
                    /<link\s[^>]*href="([^"]+)"/.exec(block))?.[1]?.trim() ?? "";
      const pubDate = /<pubDate>(.*?)<\/pubDate>/.exec(block)?.[1]?.trim() ?? "";
      const source = (/<source[^>]*>(.*?)<\/source>/.exec(block))?.[1]?.trim() ?? "";

      if (title && link) {
        items.push({ title, link, pubDate, source });
      }
    }

    items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}

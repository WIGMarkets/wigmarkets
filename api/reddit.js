const FETCH_TIMEOUT_MS = 8_000;

export default async function handler(req, res) {
  const tickersParam = req.query?.tickers;
  if (!tickersParam) {
    return res.status(200).json({ ranked: [], postsScanned: 0 });
  }

  const tickers = tickersParam
    .split(",")
    .map(t => t.trim().toUpperCase())
    .filter(t => t.length >= 2);

  // Fetch both "new" and "hot" from multiple subreddits for better coverage
  const feeds = [
    "inwestowanie/new",
    "inwestowanie/hot",
    "gielda/new",
    "gielda/hot",
    "polska/search?q=gielda&sort=new",
  ];
  const allPosts = [];
  const seen = new Set();

  for (const feed of feeds) {
    try {
      const url = feed.includes("search")
        ? `https://www.reddit.com/r/${feed}&limit=50`
        : `https://www.reddit.com/r/${feed}.json?limit=100`;
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
      const r = await fetch(url, {
        signal: ctrl.signal,
        headers: { "User-Agent": "WIGmarkets/1.0 (market data dashboard)" },
      });
      clearTimeout(t);
      if (!r.ok) continue;
      const json = await r.json();
      const posts = json?.data?.children?.map(c => c.data) ?? [];
      for (const post of posts) {
        if (!seen.has(post.id)) {
          seen.add(post.id);
          allPosts.push(post);
        }
      }
    } catch {
      // feed unavailable — skip
    }
  }

  // Build regex map: match bare ticker and $TICKER cashtag format
  const regexMap = {};
  for (const ticker of tickers) {
    // matches: PKN, $PKN, #PKN (whole word, case-insensitive)
    regexMap[ticker] = new RegExp(`(?:\\$|#)?\\b${ticker}\\b`, "gi");
  }

  const counts = {};
  for (const post of allPosts) {
    const text = `${post.title ?? ""} ${post.selftext ?? ""}`;
    for (const ticker of tickers) {
      const matches = text.match(regexMap[ticker]);
      if (matches) {
        counts[ticker] = (counts[ticker] ?? 0) + matches.length;
      }
    }
  }

  const ranked = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([ticker, mentions]) => ({ ticker, mentions }));

  res.setHeader("Cache-Control", "public, max-age=300");
  res.status(200).json({ ranked, postsScanned: allPosts.length });
}

export default async function handler(req, res) {
  const tickersParam = req.query?.tickers;
  if (!tickersParam) {
    return res.status(200).json({ ranked: [], postsScanned: 0 });
  }

  const tickers = tickersParam
    .split(",")
    .map(t => t.trim().toUpperCase())
    .filter(t => t.length >= 2);

  const subreddits = ["inwestowanie", "gielda"];
  const allPosts = [];

  for (const sub of subreddits) {
    try {
      const r = await fetch(
        `https://www.reddit.com/r/${sub}/new.json?limit=100`,
        { headers: { "User-Agent": "WIGmarkets/1.0 (market data dashboard)" } }
      );
      if (!r.ok) continue;
      const json = await r.json();
      const posts = json?.data?.children?.map(c => c.data) ?? [];
      allPosts.push(...posts);
    } catch {
      // subreddit unavailable — skip
    }
  }

  // Build regex map once for efficiency
  const regexMap = {};
  for (const ticker of tickers) {
    regexMap[ticker] = new RegExp(`\\b${ticker}\\b`, "gi");
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

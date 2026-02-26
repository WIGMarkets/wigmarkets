/**
 * Shared Yahoo Finance crumb authentication with in-memory cache.
 *
 * Crumb + cookies are cached for 30 minutes (module-level variable).
 * On Vercel serverless, a warm instance reuses the cached value across
 * invocations, saving 2 round-trips to Yahoo (homepage + crumb endpoint).
 *
 * Both fetches use AbortController with 8 s timeout.
 */

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

const CRUMB_TTL_MS = 30 * 60 * 1000; // 30 minutes
const FETCH_TIMEOUT_MS = 8_000;

let _cached = null; // { crumb, cookieStr, ts }

export async function getYahooCrumb() {
  if (_cached && Date.now() - _cached.ts < CRUMB_TTL_MS) {
    return { crumb: _cached.crumb, cookieStr: _cached.cookieStr };
  }

  // Step 1: Get cookies from Yahoo Finance homepage
  const ctrl1 = new AbortController();
  const t1 = setTimeout(() => ctrl1.abort(), FETCH_TIMEOUT_MS);

  const cookieRes = await fetch("https://finance.yahoo.com/", {
    signal: ctrl1.signal,
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    redirect: "follow",
  });
  clearTimeout(t1);

  let rawCookies = [];
  if (typeof cookieRes.headers.getSetCookie === "function") {
    rawCookies = cookieRes.headers.getSetCookie();
  } else {
    const raw = cookieRes.headers.get("set-cookie") || "";
    rawCookies = raw ? raw.split(/,(?=[^ ])/) : [];
  }
  const cookieStr = rawCookies
    .map((c) => c.split(";")[0].trim())
    .filter(Boolean)
    .join("; ");

  // Step 2: Get crumb using the session cookie
  const ctrl2 = new AbortController();
  const t2 = setTimeout(() => ctrl2.abort(), FETCH_TIMEOUT_MS);

  const crumbRes = await fetch(
    "https://query1.finance.yahoo.com/v1/test/getcrumb",
    {
      signal: ctrl2.signal,
      headers: {
        "User-Agent": UA,
        Cookie: cookieStr,
        Accept: "text/plain, */*",
      },
    }
  );
  clearTimeout(t2);

  const crumb = (await crumbRes.text()).trim();
  if (!crumb || crumb.startsWith("{") || crumb.length > 20) {
    throw new Error(`Invalid crumb: ${crumb.slice(0, 50)}`);
  }

  _cached = { crumb, cookieStr, ts: Date.now() };
  return { crumb, cookieStr };
}

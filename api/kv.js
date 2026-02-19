/**
 * Minimal Upstash Redis REST API client.
 *
 * Supports both env-var conventions:
 *   • Old Vercel KV:  KV_REST_API_URL  + KV_REST_API_TOKEN
 *   • New Upstash:    UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 *
 * Setup on Vercel:
 *   1. Go to https://vercel.com/marketplace?category=storage&search=redis
 *   2. Add the Upstash Redis integration and connect it to your project.
 *   3. Vercel will automatically inject UPSTASH_REDIS_REST_URL and
 *      UPSTASH_REDIS_REST_TOKEN into your environment.
 */

function getConfig() {
  const url   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN  || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Redis KV env vars not set (UPSTASH_REDIS_REST_URL / _TOKEN)");
  return { url, token };
}

async function pipeline(commands) {
  const { url, token } = getConfig();
  const resp = await fetch(`${url}/pipeline`, {
    method:  "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body:    JSON.stringify(commands),
  });
  if (!resp.ok) throw new Error(`KV pipeline HTTP ${resp.status}`);
  return resp.json(); // array of { result: ... }
}

/** Get a single key. Returns null if not found. */
export async function kvGet(key) {
  const [res] = await pipeline([["GET", key]]);
  const raw = res?.result;
  if (raw == null) return null;
  try   { return JSON.parse(raw); }
  catch { return raw; }
}

/** Get multiple keys in one round-trip. Returns array in same order. */
export async function kvMGet(...keys) {
  const results = await pipeline(keys.map(k => ["GET", k]));
  return results.map(r => {
    const raw = r?.result;
    if (raw == null) return null;
    try   { return JSON.parse(raw); }
    catch { return raw; }
  });
}

/**
 * Set key with optional TTL (seconds).
 * Value is JSON-serialised automatically.
 */
export async function kvSet(key, value, exSeconds) {
  const serialised = typeof value === "string" ? value : JSON.stringify(value);
  const cmd = exSeconds
    ? ["SET", key, serialised, "EX", exSeconds]
    : ["SET", key, serialised];
  await pipeline([cmd]);
}

/** Set multiple keys atomically with a shared TTL. */
export async function kvMSet(pairs, exSeconds) {
  // pairs: [{ key, value }, ...]
  const commands = pairs.map(({ key, value }) => {
    const serialised = typeof value === "string" ? value : JSON.stringify(value);
    return exSeconds
      ? ["SET", key, serialised, "EX", exSeconds]
      : ["SET", key, serialised];
  });
  await pipeline(commands);
}

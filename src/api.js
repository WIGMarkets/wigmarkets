export async function fetchStooq(symbol) {
  try {
    const res = await fetch(`/api/stooq?symbol=${symbol}`);
    const data = await res.json();
    return data;
  } catch { return null; }
}

export async function fetchBulk(symbols) {
  try {
    const res = await fetch(`/api/gpw-bulk?symbols=${symbols.join(",")}`);
    return await res.json();
  } catch { return {}; }
}

export async function fetchHistory(symbol) {
  try {
    const res = await fetch(`/api/history?symbol=${symbol}`);
    const data = await res.json();
    return data;
  } catch { return null; }
}

export async function fetchIndices() {
  try {
    const res = await fetch("/api/indices");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export async function fetchFundamentals(symbol) {
  try {
    const res = await fetch(`/api/fundamentals?symbol=${symbol}`);
    const data = await res.json();
    return data?.error ? null : data;
  } catch { return null; }
}

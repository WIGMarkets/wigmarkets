import { ImageResponse } from "@vercel/og";

// --- Fear & Greed helpers ---
function fgColor(value) {
  if (value <= 24) return "#ef4444";
  if (value <= 44) return "#f97316";
  if (value <= 55) return "#eab308";
  if (value <= 74) return "#22c55e";
  return "#10b981";
}

function fgLabel(value) {
  if (value < 25) return "Skrajna panika";
  if (value < 45) return "Strach";
  if (value < 55) return "Neutralny";
  if (value < 75) return "Chciwość";
  return "Skrajna chciwość";
}

// --- Stock helpers ---
function formatPrice(v) {
  if (v == null || isNaN(v)) return "b.d.";
  return v.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " zł";
}

// --- Shared ---
function baseUrl(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

// --- Fear & Greed OG image ---
async function fearGreedImage(req, res) {
  let data = null;
  try {
    const resp = await fetch(`${baseUrl(req)}/api/fear-greed`, {
      headers: { "User-Agent": "WIGmarkets-OG-Generator" },
    });
    if (resp.ok) {
      const json = await resp.json();
      if (json?.current?.value != null) data = json;
    }
  } catch {}

  const value = data?.current?.value ?? 50;
  const label = data?.current?.label ?? fgLabel(value);
  const color = fgColor(value);
  const date = new Date().toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" });

  const imageResponse = new ImageResponse(
    (
      <div style={{ width: "1200px", height: "630px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#09090b", fontFamily: "sans-serif", position: "relative" }}>
        <div style={{ position: "absolute", top: "0", left: "0", right: "0", bottom: "0", display: "flex", background: `radial-gradient(ellipse at center, ${color}15 0%, transparent 65%)` }} />
        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "22px", marginBottom: "8px" }}>
          <span style={{ color: "#f4f4f5", fontWeight: 700 }}>WIG</span>
          <span style={{ color: "#10b981", fontWeight: 700 }}>markets</span>
          <span style={{ color: "#63636e", fontSize: "18px" }}>.pl</span>
        </div>
        <div style={{ fontSize: "18px", color: "#71717a", marginBottom: "36px", letterSpacing: "0.12em", textTransform: "uppercase" }}>GPW Fear & Greed Index</div>
        <div style={{ display: "flex", marginBottom: "12px" }}>
          <svg width="280" height="160" viewBox="0 0 280 160">
            <path d="M 20 140 A 110 110 0 0 1 260 140" fill="none" stroke="#222228" stroke-width="18" stroke-linecap="round" />
            <path d="M 20 140 A 110 110 0 0 1 71.3 43.2" fill="none" stroke="#ef4444" stroke-width="18" stroke-linecap="round" opacity="0.85" />
            <path d="M 71.3 43.2 A 110 110 0 0 1 127.8 31.2" fill="none" stroke="#f97316" stroke-width="18" opacity="0.85" />
            <path d="M 127.8 31.2 A 110 110 0 0 1 152.2 31.2" fill="none" stroke="#eab308" stroke-width="18" opacity="0.85" />
            <path d="M 152.2 31.2 A 110 110 0 0 1 208.7 43.2" fill="none" stroke="#22c55e" stroke-width="18" opacity="0.85" />
            <path d="M 208.7 43.2 A 110 110 0 0 1 260 140" fill="none" stroke="#10b981" stroke-width="18" stroke-linecap="round" opacity="0.85" />
            {(() => {
              const cx = 140, cy = 140, r = 110;
              const angle = Math.PI + (value / 100) * Math.PI;
              const dx = cx + r * Math.cos(angle);
              const dy = cy + r * Math.sin(angle);
              return (<><circle cx={dx} cy={dy} r="10" fill={color} opacity="0.4" /><circle cx={dx} cy={dy} r="6" fill={color} /><circle cx={dx} cy={dy} r="3" fill="white" opacity="0.9" /></>);
            })()}
          </svg>
        </div>
        <div style={{ fontSize: "96px", fontWeight: 800, color: color, lineHeight: "1", marginBottom: "6px" }}>{value}</div>
        <div style={{ fontSize: "30px", fontWeight: 600, color: color, marginBottom: "28px" }}>{label}</div>
        <div style={{ fontSize: "15px", color: "#52525b" }}>{date}</div>
        <div style={{ position: "absolute", bottom: "36px", display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ color: "#ef4444", fontSize: "12px" }}>Skrajna panika</span>
          <div style={{ width: "280px", height: "6px", borderRadius: "3px", display: "flex", background: "linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #10b981)" }} />
          <span style={{ color: "#10b981", fontSize: "12px" }}>Skrajna chciwość</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );

  const buffer = Buffer.from(await imageResponse.arrayBuffer());
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=600");
  res.send(buffer);
}

// --- Stock OG image ---
async function stockImage(req, res, ticker) {
  let stockData = null;
  try {
    const resp = await fetch(`${baseUrl(req)}/api/stooq?symbol=${ticker.toLowerCase()}`);
    if (resp.ok) stockData = await resp.json();
  } catch {}

  const price = stockData?.close;
  const change = stockData?.change24h;
  const changeStr = change != null ? (change >= 0 ? "+" : "") + change.toFixed(2) + "%" : "b.d.";
  const changeColor = change == null ? "#71717a" : change >= 0 ? "#22c55e" : "#ef4444";
  const changeBg = change == null ? "#71717a15" : change >= 0 ? "#22c55e18" : "#ef444418";

  const imageResponse = new ImageResponse(
    (
      <div style={{ width: "1200px", height: "630px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#09090b", fontFamily: "sans-serif", position: "relative" }}>
        <div style={{ position: "absolute", top: "32px", left: "40px", display: "flex", alignItems: "center", gap: "4px", fontSize: "20px" }}>
          <span style={{ color: "#f4f4f5", fontWeight: 700 }}>WIG</span>
          <span style={{ color: "#10b981", fontWeight: 700 }}>markets</span>
          <span style={{ color: "#63636e", fontSize: "16px" }}>.pl</span>
        </div>
        <div style={{ position: "absolute", top: "0", left: "0", right: "0", height: "300px", display: "flex", background: `radial-gradient(ellipse at center top, ${changeColor}10 0%, transparent 70%)` }} />
        <div style={{ fontSize: "16px", color: "#52525b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>Giełda Papierów Wartościowych</div>
        <div style={{ fontSize: "72px", fontWeight: 800, color: "#f4f4f5", lineHeight: "1", marginBottom: "20px", letterSpacing: "-1px" }}>{ticker}</div>
        <div style={{ fontSize: "56px", fontWeight: 700, color: "#e4e4e7", lineHeight: "1", marginBottom: "20px" }}>{price != null ? formatPrice(price) : "—"}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 24px", borderRadius: "12px", background: changeBg }}>
          <span style={{ fontSize: "28px", fontWeight: 700, color: changeColor }}>{changeStr}</span>
          <span style={{ fontSize: "16px", color: "#71717a" }}>24h</span>
        </div>
        <div style={{ position: "absolute", bottom: "32px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#52525b" }}>
          <span>wigmarkets.pl/spolka/{ticker}</span>
          <span style={{ color: "#3f3f46" }}>•</span>
          <span>Notowania GPW</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );

  const buffer = Buffer.from(await imageResponse.arrayBuffer());
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=600");
  res.send(buffer);
}

// --- Main handler ---
// Usage: /api/og?type=fear-greed  OR  /api/og?type=stock&ticker=PKN
export default async function handler(req, res) {
  const type = req.query?.type || "fear-greed";

  if (type === "stock") {
    const ticker = (req.query?.ticker || "").toUpperCase();
    if (!ticker) {
      res.status(400).json({ error: "Missing ticker parameter" });
      return;
    }
    return stockImage(req, res, ticker);
  }

  return fearGreedImage(req, res);
}

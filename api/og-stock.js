import { ImageResponse } from "@vercel/og";

function formatPrice(v) {
  if (v == null || isNaN(v)) return "b.d.";
  return v.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " zł";
}

export default async function handler(req, res) {
  const ticker = (req.query?.ticker || "").toUpperCase();
  if (!ticker) {
    res.status(400).send("Missing ticker parameter");
    return;
  }

  // Fetch stock data from own API
  let stockData = null;
  try {
    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const baseUrl = `${proto}://${host}`;
    const resp = await fetch(`${baseUrl}/api/stooq?symbol=${ticker.toLowerCase()}`);
    if (resp.ok) stockData = await resp.json();
  } catch {}

  const price = stockData?.close;
  const change = stockData?.change24h;
  const changeStr = change != null
    ? (change >= 0 ? "+" : "") + change.toFixed(2) + "%"
    : "b.d.";
  const changeColor = change == null ? "#71717a" : change >= 0 ? "#22c55e" : "#ef4444";
  const changeBg = change == null ? "#71717a15" : change >= 0 ? "#22c55e18" : "#ef444418";

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Logo top-left */}
        <div
          style={{
            position: "absolute",
            top: "32px",
            left: "40px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "20px",
          }}
        >
          <span style={{ color: "#f4f4f5", fontWeight: 700 }}>WIG</span>
          <span style={{ color: "#10b981", fontWeight: 700 }}>markets</span>
          <span style={{ color: "#63636e", fontSize: "16px" }}>.pl</span>
        </div>

        {/* Subtle top glow */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "300px",
            display: "flex",
            background: `radial-gradient(ellipse at center top, ${changeColor}10 0%, transparent 70%)`,
          }}
        />

        {/* Exchange label */}
        <div
          style={{
            fontSize: "16px",
            color: "#52525b",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          Giełda Papierów Wartościowych
        </div>

        {/* Ticker */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 800,
            color: "#f4f4f5",
            lineHeight: "1",
            marginBottom: "20px",
            letterSpacing: "-1px",
          }}
        >
          {ticker}
        </div>

        {/* Price */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#e4e4e7",
            lineHeight: "1",
            marginBottom: "20px",
          }}
        >
          {price != null ? formatPrice(price) : "—"}
        </div>

        {/* Change badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 24px",
            borderRadius: "12px",
            background: changeBg,
          }}
        >
          <span
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: changeColor,
            }}
          >
            {changeStr}
          </span>
          <span style={{ fontSize: "16px", color: "#71717a" }}>24h</span>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            color: "#52525b",
          }}
        >
          <span>wigmarkets.pl/spolka/{ticker}</span>
          <span style={{ color: "#3f3f46" }}>•</span>
          <span>Notowania GPW</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );

  const buffer = Buffer.from(await imageResponse.arrayBuffer());
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=600");
  res.send(buffer);
}

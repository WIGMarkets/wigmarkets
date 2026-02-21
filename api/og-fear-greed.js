import { ImageResponse } from "@vercel/og";

function getColor(value) {
  if (value <= 24) return "#ef4444";
  if (value <= 44) return "#f97316";
  if (value <= 55) return "#eab308";
  if (value <= 74) return "#22c55e";
  return "#10b981";
}

function getLabel(value) {
  if (value < 25) return "Skrajna panika";
  if (value < 45) return "Strach";
  if (value < 55) return "Neutralny";
  if (value < 75) return "Chciwość";
  return "Skrajna chciwość";
}

async function getFearGreedData(req) {
  try {
    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const baseUrl = `${proto}://${host}`;
    const resp = await fetch(`${baseUrl}/api/fear-greed`, {
      headers: { "User-Agent": "WIGmarkets-OG-Generator" },
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data?.current?.value != null) return data;
    }
  } catch {}
  return null;
}

export default async function handler(req, res) {
  const data = await getFearGreedData(req);
  const value = data?.current?.value ?? 50;
  const label = data?.current?.label ?? getLabel(value);
  const color = getColor(value);

  const date = new Date().toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

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
        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            display: "flex",
            background: `radial-gradient(ellipse at center, ${color}15 0%, transparent 65%)`,
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "22px",
            marginBottom: "8px",
          }}
        >
          <span style={{ color: "#f4f4f5", fontWeight: 700 }}>WIG</span>
          <span style={{ color: "#10b981", fontWeight: 700 }}>markets</span>
          <span style={{ color: "#63636e", fontSize: "18px" }}>.pl</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "18px",
            color: "#71717a",
            marginBottom: "36px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          GPW Fear & Greed Index
        </div>

        {/* Gauge SVG */}
        <div style={{ display: "flex", marginBottom: "12px" }}>
          <svg width="280" height="160" viewBox="0 0 280 160">
            {/* Background arc */}
            <path
              d="M 20 140 A 110 110 0 0 1 260 140"
              fill="none"
              stroke="#222228"
              stroke-width="18"
              stroke-linecap="round"
            />
            {/* Colored arc segments */}
            <path
              d="M 20 140 A 110 110 0 0 1 71.3 43.2"
              fill="none"
              stroke="#ef4444"
              stroke-width="18"
              stroke-linecap="round"
              opacity="0.85"
            />
            <path
              d="M 71.3 43.2 A 110 110 0 0 1 127.8 31.2"
              fill="none"
              stroke="#f97316"
              stroke-width="18"
              opacity="0.85"
            />
            <path
              d="M 127.8 31.2 A 110 110 0 0 1 152.2 31.2"
              fill="none"
              stroke="#eab308"
              stroke-width="18"
              opacity="0.85"
            />
            <path
              d="M 152.2 31.2 A 110 110 0 0 1 208.7 43.2"
              fill="none"
              stroke="#22c55e"
              stroke-width="18"
              opacity="0.85"
            />
            <path
              d="M 208.7 43.2 A 110 110 0 0 1 260 140"
              fill="none"
              stroke="#10b981"
              stroke-width="18"
              stroke-linecap="round"
              opacity="0.85"
            />
            {/* Indicator dot */}
            {(() => {
              const cx = 140, cy = 140, r = 110;
              const angle = Math.PI + (value / 100) * Math.PI;
              const dx = cx + r * Math.cos(angle);
              const dy = cy + r * Math.sin(angle);
              return (
                <>
                  <circle cx={dx} cy={dy} r="10" fill={color} opacity="0.4" />
                  <circle cx={dx} cy={dy} r="6" fill={color} />
                  <circle cx={dx} cy={dy} r="3" fill="white" opacity="0.9" />
                </>
              );
            })()}
          </svg>
        </div>

        {/* Value */}
        <div
          style={{
            fontSize: "96px",
            fontWeight: 800,
            color: color,
            lineHeight: "1",
            marginBottom: "6px",
          }}
        >
          {value}
        </div>

        {/* Label */}
        <div
          style={{
            fontSize: "30px",
            fontWeight: 600,
            color: color,
            marginBottom: "28px",
          }}
        >
          {label}
        </div>

        {/* Date */}
        <div style={{ fontSize: "15px", color: "#52525b" }}>{date}</div>

        {/* Scale bar at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "36px",
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#ef4444", fontSize: "12px" }}>
            Skrajna panika
          </span>
          <div
            style={{
              width: "280px",
              height: "6px",
              borderRadius: "3px",
              display: "flex",
              background:
                "linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #10b981)",
            }}
          />
          <span style={{ color: "#10b981", fontSize: "12px" }}>
            Skrajna chciwość
          </span>
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

import { Helmet } from "react-helmet-async";
import { useAnalysesList } from "../hooks/useAnalysis.js";
import AnalysisCard from "../components/analysis/AnalysisCard.jsx";

function ListSkeleton({ theme, count = 6 }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
      gap: 20,
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderRadius: 14,
          padding: 20,
          height: 220,
          animation: "pulse 1.5s ease-in-out infinite",
        }} />
      ))}
    </div>
  );
}

export default function AnalysesListPage({ theme }) {
  const { analyses, loading } = useAnalysesList();

  const buyCount = analyses.filter(a => a.recommendation === "Kupuj").length;
  const holdCount = analyses.filter(a => a.recommendation === "Trzymaj").length;

  return (
    <>
      <Helmet>
        <title>Analizy fundamentalne spółek GPW | WIGmarkets</title>
        <meta name="description" content="Kompleksowe analizy fundamentalne największych spółek GPW: wyniki finansowe, wycena, dywidendy, ryzyka i rekomendacje inwestycyjne." />
        <link rel="canonical" href="https://wigmarkets.pl/analizy" />
      </Helmet>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 64px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 28, fontWeight: 700, color: theme.textBright,
            fontFamily: "var(--font-ui)", margin: "0 0 8px",
          }}>
            Analizy fundamentalne
          </h1>
          <p style={{
            fontSize: 14, color: theme.textSecondary, fontFamily: "var(--font-ui)",
            margin: "0 0 16px", lineHeight: 1.5,
          }}>
            Dogłębne analizy największych spółek notowanych na Giełdzie Papierów Wartościowych w Warszawie.
            Każda analiza zawiera profil spółki, wyniki finansowe, wycenę, politykę dywidendową i czynniki ryzyka.
          </p>

          {/* Stats */}
          {analyses.length > 0 && (
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <StatChip label="Analizy" value={analyses.length} theme={theme} />
              <StatChip label="Kupuj" value={buyCount} color="#10b981" theme={theme} />
              <StatChip label="Trzymaj" value={holdCount} color="#3b82f6" theme={theme} />
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <ListSkeleton theme={theme} />
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: 20,
          }}>
            {analyses.map(a => (
              <AnalysisCard key={a.ticker} analysis={a} theme={theme} />
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <p style={{
          marginTop: 40, fontSize: 11, color: theme.textMuted,
          fontFamily: "var(--font-ui)", lineHeight: 1.5, fontStyle: "italic",
        }}>
          Powyższe analizy mają charakter wyłącznie informacyjny i edukacyjny. Nie stanowią rekomendacji
          inwestycyjnej w rozumieniu przepisów prawa. Decyzje inwestycyjne podejmowane są na własne ryzyko.
        </p>
      </div>

      <style>{`
        @media (max-width: 480px) {
          div[style*="minmax(360px"] { grid-template-columns: 1fr !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </>
  );
}

function StatChip({ label, value, color, theme }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "4px 12px", borderRadius: 8,
      background: theme.bgElevated,
      border: `1px solid ${theme.border}`,
    }}>
      <span style={{ fontSize: 12, color: theme.textMuted, fontFamily: "var(--font-ui)" }}>{label}:</span>
      <span style={{
        fontSize: 13, fontWeight: 700,
        color: color || theme.textBright,
        fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums",
      }}>{value}</span>
    </div>
  );
}

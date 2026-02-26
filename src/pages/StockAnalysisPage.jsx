import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAnalysis } from "../hooks/useAnalysis.js";
import AnalysisHeader from "../components/analysis/AnalysisHeader.jsx";
import AnalysisSection from "../components/analysis/AnalysisSection.jsx";
import AnalysisTOC from "../components/analysis/AnalysisTOC.jsx";
import KeyMetricsTable from "../components/analysis/KeyMetricsTable.jsx";

function AnalysisSkeleton({ theme }) {
  const bar = (w, h = 14) => (
    <div style={{
      width: w, height: h, borderRadius: 6,
      background: theme.bgElevated, animation: "pulse 1.5s ease-in-out infinite",
    }} />
  );
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      {bar("120px", 12)}
      <div style={{ height: 16 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: theme.bgElevated }} />
        <div>{bar("100px")}</div>
      </div>
      {bar("80%", 28)}
      <div style={{ height: 12 }} />
      {bar("60%", 28)}
      <div style={{ height: 24 }} />
      {bar("100%", 80)}
      <div style={{ height: 32 }} />
      {[1,2,3].map(i => (
        <div key={i} style={{ marginBottom: 32 }}>
          {bar("40%", 20)}
          <div style={{ height: 12 }} />
          {bar("100%", 60)}
        </div>
      ))}
    </div>
  );
}

export default function StockAnalysisPage({ theme }) {
  const { ticker } = useParams();
  const { analysis, loading, error } = useAnalysis(ticker?.toUpperCase());

  if (loading) return <AnalysisSkeleton theme={theme} />;
  if (error || !analysis) return <Navigate to={`/spolka/${ticker}`} replace />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: analysis.title,
    description: analysis.summary,
    author: { "@type": "Organization", name: analysis.author },
    datePublished: analysis.publishedAt,
    dateModified: analysis.updatedAt || analysis.publishedAt,
    publisher: {
      "@type": "Organization",
      name: "WIGmarkets",
      url: "https://wigmarkets.pl",
    },
  };

  return (
    <>
      <Helmet>
        <title>{analysis.seo?.title || `${analysis.name} — analiza fundamentalna | WIGmarkets`}</title>
        <meta name="description" content={analysis.seo?.description || analysis.summary} />
        <meta property="og:title" content={analysis.seo?.title || analysis.title} />
        <meta property="og:description" content={analysis.seo?.description || analysis.summary} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={analysis.publishedAt} />
        <meta property="article:modified_time" content={analysis.updatedAt || analysis.publishedAt} />
        <link rel="canonical" href={`https://wigmarkets.pl/spolka/${analysis.ticker}/analiza`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 64px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 32,
          alignItems: "start",
        }}>
          {/* Main content */}
          <div style={{ minWidth: 0 }}>
            <AnalysisHeader analysis={analysis} theme={theme} />
            {analysis.sections.map(section => (
              <AnalysisSection key={section.id} section={section} theme={theme} />
            ))}
          </div>

          {/* Sidebar */}
          <aside style={{
            position: "sticky", top: 80,
            display: "flex", flexDirection: "column", gap: 16,
          }}
            className="analysis-sidebar"
          >
            <KeyMetricsTable metrics={analysis.currentMetrics} theme={theme} />
            <AnalysisTOC sections={analysis.sections} theme={theme} />
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .analysis-sidebar { display: none !important; }
          div[style*="grid-template-columns: 1fr 280px"] {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </>
  );
}

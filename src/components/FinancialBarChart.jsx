export default function FinancialBarChart({ annual, theme }) {
  const data = (annual || []).filter(d => d.revenue !== null || d.netIncome !== null).slice(0, 4).reverse();
  if (data.length === 0) return (
    <div style={{ color: theme.textSecondary, fontSize: 12, textAlign: "center", padding: "32px 0" }}>
      Brak danych historycznych
    </div>
  );

  const allVals = data.flatMap(d => [d.revenue ?? 0, Math.abs(d.netIncome ?? 0)]);
  const maxVal = Math.max(...allVals, 1);

  const fmtVal = (v) => {
    if (v === null || v === undefined) return "";
    const abs = Math.abs(v);
    if (abs >= 1000) return `${(v / 1000).toFixed(1)}B`;
    if (abs >= 1) return `${v.toFixed(0)}M`;
    return `${v.toFixed(2)}`;
  };

  const W = 580, H = 200, padL = 10, padR = 10, padT = 28, padB = 24;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const n = data.length;
  const groupW = chartW / n;
  const barW = Math.min(groupW * 0.32, 42);
  const hasRevenue = data.some(d => d.revenue !== null);
  const hasNetIncome = data.some(d => d.netIncome !== null);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
      {hasRevenue && <>
        <rect x={padL} y={8} width={9} height={9} fill="#3b82f6" opacity="0.85" rx="2" />
        <text x={padL + 13} y={16} fill={theme.textSecondary} fontSize="9" fontFamily="'IBM Plex Mono',monospace">Przychody</text>
      </>}
      {hasNetIncome && <>
        <rect x={padL + 82} y={8} width={9} height={9} fill="#22c55e" opacity="0.85" rx="2" />
        <text x={padL + 95} y={16} fill={theme.textSecondary} fontSize="9" fontFamily="'IBM Plex Mono',monospace">Zysk netto</text>
      </>}
      {data.map((d, i) => {
        const cx = padL + i * groupW + groupW / 2;
        const revH = d.revenue !== null ? Math.max(3, (Math.abs(d.revenue) / maxVal) * chartH) : 0;
        const netH = d.netIncome !== null ? Math.max(3, (Math.abs(d.netIncome) / maxVal) * chartH) : 0;
        const netColor = (d.netIncome ?? 0) >= 0 ? "#22c55e" : "#ef4444";
        const gap = 3;
        return (
          <g key={d.year}>
            {d.revenue !== null && hasRevenue && <>
              <rect x={cx - barW - gap} y={padT + chartH - revH} width={barW} height={revH} fill="#3b82f6" opacity="0.85" rx="2" />
              <text x={cx - barW / 2 - gap} y={padT + chartH - revH - 4} textAnchor="middle" fill={theme.textSecondary} fontSize="7" fontFamily="'IBM Plex Mono',monospace">{fmtVal(d.revenue)}</text>
            </>}
            {d.netIncome !== null && hasNetIncome && <>
              <rect x={cx + gap} y={padT + chartH - netH} width={barW} height={netH} fill={netColor} opacity="0.85" rx="2" />
              <text x={cx + barW / 2 + gap} y={padT + chartH - netH - 4} textAnchor="middle" fill={theme.textSecondary} fontSize="7" fontFamily="'IBM Plex Mono',monospace">{fmtVal(d.netIncome)}</text>
            </>}
            <text x={cx} y={H - 6} textAnchor="middle" fill={theme.textSecondary} fontSize="10" fontFamily="'IBM Plex Mono',monospace">{d.year}</text>
          </g>
        );
      })}
    </svg>
  );
}

"use client";

/** Gráfico de área leve (SVG puro) — receita dos últimos 7 dias. */
export function RevenueChart({
  data,
  labels,
}: {
  data: number[];
  labels: string[];
}) {
  const w = 560;
  const h = 200;
  const pad = 28;
  const max = Math.max(...data, 1);
  const stepX = (w - pad * 2) / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (v / max) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${h - pad} L${pts[0][0]},${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A36A" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#C9A36A" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <line
          key={g}
          x1={pad}
          x2={w - pad}
          y1={h - pad - g * (h - pad * 2)}
          y2={h - pad - g * (h - pad * 2)}
          stroke="#C9A36A"
          strokeOpacity="0.08"
        />
      ))}
      <path d={area} fill="url(#rev)" />
      <path d={line} fill="none" stroke="#C9A36A" strokeWidth="2" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#E9DCC6" />
      ))}
      {labels.map((l, i) => (
        <text
          key={l}
          x={pad + i * stepX}
          y={h - 8}
          textAnchor="middle"
          fontSize="10"
          fill="#F6F1E7"
          fillOpacity="0.45"
        >
          {l}
        </text>
      ))}
    </svg>
  );
}

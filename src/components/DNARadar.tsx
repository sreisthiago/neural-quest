// ═══════════════════════════════════════════════════════════════
// Neural Quest V5.0 — DNA Radar Chart (SVG Puro)
// Visualização radar do DNA Operacional
// ═══════════════════════════════════════════════════════════════

interface DNARadarProps {
  ld: number;
  ra: number;
  ta: number;
  size?: number;
}

export default function DNARadar({ ld, ra, ta, size = 240 }: DNARadarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;

  // 3 eixos: LD (topo), RA (dir-baixo), TA (esq-baixo) - triângulo
  const angles = [-90, 150, 30].map((deg) => (deg * Math.PI) / 180);
  const labels = [
    { key: 'LD', label: 'Latência de Decisão', value: ld },
    { key: 'RA', label: 'Resiliência Adaptativa', value: ra },
    { key: 'TA', label: 'Tolerância à Ambiguidade', value: ta },
  ];

  const getPoint = (angle: number, ratio: number) => ({
    x: cx + r * ratio * Math.cos(angle),
    y: cy + r * ratio * Math.sin(angle),
  });

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Data polygon
  const dataPoints = labels.map((l, i) => getPoint(angles[i], l.value / 100));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid rings */}
        {rings.map((ring) => (
          <polygon
            key={ring}
            points={angles.map((a) => {
              const p = getPoint(a, ring);
              return `${p.x},${p.y}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(139,92,246,0.15)"
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {angles.map((angle, i) => {
          const end = getPoint(angle, 1);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="rgba(139,92,246,0.2)"
              strokeWidth={1}
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={dataPath.replace(/[MLZ]/g, ' ')}
          fill="rgba(139,92,246,0.2)"
          stroke="rgb(139,92,246)"
          strokeWidth={2}
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="rgb(139,92,246)"
            stroke="white"
            strokeWidth={2}
          />
        ))}

        {/* Labels */}
        {labels.map((l, i) => {
          const labelPoint = getPoint(angles[i], 1.25);
          return (
            <text
              key={l.key}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-300 text-xs font-medium"
            >
              {l.key}: {l.value}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

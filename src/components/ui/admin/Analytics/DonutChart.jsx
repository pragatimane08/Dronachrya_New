import React from "react";

export default function DonutChart({ data, size = 360, thickness = 70 }) {
  const radius = size / 2 - thickness / 2;
  const circumference = 2 * Math.PI * radius;

  // 🟡 Normalize data with minimum visible size using log scale
  const normalizedData = data.map((d) => ({
    ...d,
    adjusted: d.value > 0 ? Math.max(Math.log10(d.value + 1) * 10, 5) : 0,
  }));

  const total = normalizedData.reduce((sum, d) => sum + d.adjusted, 0);

  let cumulative = 0;

  if (total === 0) {
    return <p className="text-gray-400 text-center">No data to display</p>;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Donut chart"
      className="mx-auto"
    >
      {/* Donut Segments */}
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {normalizedData.map((d, i) => {
          const fraction = d.adjusted / total;
          const dash = fraction * circumference;
          const gap = circumference - dash;
          const strokeDasharray = `${dash} ${gap}`;
          const strokeDashoffset = -cumulative * circumference;
          cumulative += fraction;

          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={thickness}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            >
              <title>{`${d.label}: ${d.value}`}</title>
            </circle>
          );
        })}
      </g>

      {/* Labels */}
      {(() => {
        let cum = 0;
        return normalizedData.map((d, i) => {
          const rawValue = data[i].value;
          const fraction = d.adjusted / total;
          const angle = (cum + fraction / 2) * 2 * Math.PI - Math.PI / 2;
          cum += fraction;

          if (!isFinite(angle)) return null;

          const r = radius - thickness / 2 + 6;
          const x = size / 2 + Math.cos(angle) * r;
          const y = size / 2 + Math.sin(angle) * r + 4;

          return (
            <text
              key={`label-${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              className="fill-gray-800 font-semibold text-sm select-none"
            >
              {rawValue}
            </text>
          );
        });
      })()}
    </svg>
  );
}

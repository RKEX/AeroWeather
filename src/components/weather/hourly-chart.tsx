"use client";

import { memo, useMemo } from "react";

interface HourlyChartPoint {
  time: string;
  temp: number;
  precip: number;
}

interface HourlyChartProps {
  data: HourlyChartPoint[];
}

function buildPath(points: number[], width: number, height: number, min: number, max: number): string {
  const range = Math.max(1, max - min);
  const stepX = points.length > 1 ? width / (points.length - 1) : width;

  let path = "";
  for (let i = 0; i < points.length; i += 1) {
    const x = i * stepX;
    const normalized = (points[i] - min) / range;
    const y = height - normalized * height;
    path += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return path.trim();
}

function HourlyChartComponent({ data }: HourlyChartProps) {
  const width = 760;
  const height = 220;

  const chart = useMemo(() => {
    const temps = data.map((d) => d.temp);
    const precip = data.map((d) => d.precip);

    const tempMinRaw = Math.min(...temps);
    const tempMaxRaw = Math.max(...temps);
    const tempMin = Math.floor(tempMinRaw - 2);
    const tempMax = Math.ceil(tempMaxRaw + 2);

    const tempPath = buildPath(temps, width, height, tempMin, tempMax);

    const precipPath = precip
      .map((value, i) => {
        const x = data.length > 1 ? (i / (data.length - 1)) * width : 0;
        const y = height - (Math.max(0, Math.min(100, value)) / 100) * height;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");

    const areaPath = `${tempPath} L ${width} ${height} L 0 ${height} Z`;

    const yTicks = Array.from({ length: 5 }, (_, i) => {
      const t = i / 4;
      return {
        value: Math.round(tempMax - (tempMax - tempMin) * t),
        y: height * t,
      };
    });

    return {
      tempPath,
      precipPath,
      areaPath,
      yTicks,
    };
  }, [data]);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height + 36}`}
        className="h-62.5 w-full min-w-160"
        role="img"
        aria-label="Hourly temperature and precipitation chart"
      >
        <defs>
          <linearGradient id="hourly-temp-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
          </linearGradient>
        </defs>

        {chart.yTicks.map((tick) => (
          <g key={tick.y}>
            <line x1="0" y1={tick.y} x2={width} y2={tick.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <text x="6" y={tick.y + 12} fill="rgba(255,255,255,0.6)" fontSize="11">
              {tick.value}°
            </text>
          </g>
        ))}

        <path d={chart.areaPath} fill="url(#hourly-temp-fill)" />
        <path d={chart.tempPath} fill="none" stroke="#facc15" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        <path
          d={chart.precipPath}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2"
          strokeDasharray="5 5"
          vectorEffect="non-scaling-stroke"
        />

        {data.map((d, i) => {
          const x = data.length > 1 ? (i / (data.length - 1)) * width : 0;
          return (
            <text key={`${d.time}-${i}`} x={x} y={height + 24} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="11">
              {d.time}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export const HourlyChart = memo(HourlyChartComponent);
HourlyChart.displayName = "HourlyChart";

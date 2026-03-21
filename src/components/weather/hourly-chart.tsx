"use client";

import { memo, useEffect, useMemo, useRef } from "react";

interface HourlyChartPoint {
  time: string;
  temp: number;
  precip: number;
}

interface HourlyChartProps {
  data: HourlyChartPoint[];
}

const SVG_W = 760;
const SVG_H = 200;
const PAD_B = 36;

// ✅ Smooth catmull-rom spline
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return `M${pts[0]?.x ?? 0} ${pts[0]?.y ?? 0}`;
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x.toFixed(1)} ${cp1y.toFixed(1)},${cp2x.toFixed(1)} ${cp2y.toFixed(1)},${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function HourlyChartComponent({ data }: HourlyChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Refs for DOM elements we'll mutate directly (no re-render)
  const lineRef      = useRef<SVGLineElement>(null);
  const dotOuterRef  = useRef<SVGCircleElement>(null);
  const dotRingRef   = useRef<SVGCircleElement>(null);
  const dotInnerRef  = useRef<SVGCircleElement>(null);
  const ttBoxRef     = useRef<SVGRectElement>(null);
  const ttTimeRef    = useRef<SVGTextElement>(null);
  const ttSepRef     = useRef<SVGLineElement>(null);
  const ttTDotRef    = useRef<SVGCircleElement>(null);
  const ttTempRef    = useRef<SVGTextElement>(null);
  const ttPDotRef    = useRef<SVGCircleElement>(null);
  const ttPrecipRef  = useRef<SVGTextElement>(null);
  const ttHeightRef  = useRef(50);

  const chart = useMemo(() => {
    const temps  = data.map((d) => d.temp);
    const precips = data.map((d) => d.precip);

    const rawMin = Math.min(...temps);
    const rawMax = Math.max(...temps);
    const tMin = Math.floor(rawMin - 2);
    const tMax = Math.ceil(rawMax + 2);
    const range = Math.max(1, tMax - tMin);

    const pts = temps.map((t, i) => ({
      x: data.length > 1 ? (i / (data.length - 1)) * SVG_W : 0,
      y: SVG_H - ((t - tMin) / range) * SVG_H,
    }));

    const tempPath  = smoothPath(pts);
    const areaPath  = `${tempPath} L${SVG_W} ${SVG_H} L0 ${SVG_H} Z`;

    const precipPath = precips.map((v, i) => {
      const x = data.length > 1 ? (i / (data.length - 1)) * SVG_W : 0;
      const y = SVG_H - (Math.max(0, Math.min(100, v)) / 100) * SVG_H;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ");

    const yTicks = Array.from({ length: 5 }, (_, i) => ({
      value: Math.round(tMax - (tMax - tMin) * (i / 4)),
      y: SVG_H * (i / 4),
    }));

    return { tempPath, areaPath, precipPath, yTicks, pts };
  }, [data]);

  // ✅ Mouse handler — directly mutates DOM, zero React re-renders
  useEffect(() => {
    const container = containerRef.current;
    const svg = container?.querySelector("svg");
    if (!svg) return;

    const HIDDEN = "none";
    const VISIBLE = "block";

    const show = (el: SVGElement | null) => { if (el) el.style.display = VISIBLE; };
    const hide = (el: SVGElement | null) => { if (el) el.style.display = HIDDEN; };

    const hideAll = () => {
      hide(lineRef.current);
      hide(dotOuterRef.current);
      hide(dotRingRef.current);
      hide(dotInnerRef.current);
      hide(ttBoxRef.current);
      hide(ttTimeRef.current);
      hide(ttSepRef.current);
      hide(ttTDotRef.current);
      hide(ttTempRef.current);
      hide(ttPDotRef.current);
      hide(ttPrecipRef.current);
    };

    hideAll();

    const onMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const svgX = (mouseX / rect.width) * SVG_W;
      const idx = Math.max(0, Math.min(data.length - 1, Math.round((svgX / SVG_W) * (data.length - 1))));
      const dot = chart.pts[idx];
      const d = data[idx];
      if (!dot || !d) return;

      const hasPrecip = d.precip > 0;
      const ttH = hasPrecip ? 70 : 52;
      ttHeightRef.current = ttH;

      // vertical line
      const ln = lineRef.current;
      if (ln) { ln.setAttribute("x1", dot.x.toFixed(1)); ln.setAttribute("x2", dot.x.toFixed(1)); ln.style.display = VISIBLE; }

      // dots
      const setCircle = (el: SVGCircleElement | null, cx: number, cy: number) => {
        if (!el) return;
        el.setAttribute("cx", cx.toFixed(1));
        el.setAttribute("cy", cy.toFixed(1));
        el.style.display = VISIBLE;
      };
      setCircle(dotOuterRef.current, dot.x, dot.y);
      setCircle(dotRingRef.current, dot.x, dot.y);
      setCircle(dotInnerRef.current, dot.x, dot.y);

      // tooltip position
      const ttX = dot.x > SVG_W * 0.7 ? dot.x - 132 : dot.x + 12;
      const ttY = Math.max(6, dot.y - 52);

      // box
      const box = ttBoxRef.current;
      if (box) {
        box.setAttribute("x", ttX.toFixed(1));
        box.setAttribute("y", ttY.toFixed(1));
        box.setAttribute("height", ttH.toString());
        box.style.display = VISIBLE;
      }

      // time
      const tm = ttTimeRef.current;
      if (tm) { tm.setAttribute("x", (ttX + 12).toFixed(1)); tm.setAttribute("y", (ttY + 20).toFixed(1)); tm.textContent = d.time; tm.style.display = VISIBLE; }

      // separator
      const sep = ttSepRef.current;
      if (sep) { sep.setAttribute("x1", (ttX + 12).toFixed(1)); sep.setAttribute("x2", (ttX + 108).toFixed(1)); sep.setAttribute("y1", (ttY + 26).toFixed(1)); sep.setAttribute("y2", (ttY + 26).toFixed(1)); sep.style.display = VISIBLE; }

      // temp dot + text
      const td = ttTDotRef.current;
      if (td) { td.setAttribute("cx", (ttX + 18).toFixed(1)); td.setAttribute("cy", (ttY + 40).toFixed(1)); td.style.display = VISIBLE; }
      const tt = ttTempRef.current;
      if (tt) { tt.setAttribute("x", (ttX + 28).toFixed(1)); tt.setAttribute("y", (ttY + 44).toFixed(1)); tt.textContent = `${d.temp}°C`; tt.style.display = VISIBLE; }

      // precip
      if (hasPrecip) {
        const pd = ttPDotRef.current;
        if (pd) { pd.setAttribute("cx", (ttX + 18).toFixed(1)); pd.setAttribute("cy", (ttY + 57).toFixed(1)); pd.style.display = VISIBLE; }
        const pt = ttPrecipRef.current;
        if (pt) { pt.setAttribute("x", (ttX + 28).toFixed(1)); pt.setAttribute("y", (ttY + 61).toFixed(1)); pt.textContent = `${d.precip}% rain`; pt.style.display = VISIBLE; }
      } else {
        hide(ttPDotRef.current);
        hide(ttPrecipRef.current);
      }
    };

    svg.addEventListener("mousemove", onMove, { passive: true });
    svg.addEventListener("mouseleave", hideAll);

    return () => {
      svg.removeEventListener("mousemove", onMove);
      svg.removeEventListener("mouseleave", hideAll);
    };
  }, [chart.pts, data]);

  return (
    <div ref={containerRef} className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H + PAD_B}`}
        className="h-62.5 w-full min-w-160 cursor-crosshair"
        aria-label="Hourly temperature chart"
      >
        <defs>
          <linearGradient id="hc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
          </linearGradient>
          <filter id="hc-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Grid + Y labels */}
        {chart.yTicks.map((tick) => (
          <g key={tick.y}>
            <line x1="0" y1={tick.y} x2={SVG_W} y2={tick.y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            <text x="6" y={tick.y + 12} fill="rgba(255,255,255,0.45)" fontSize="11">{tick.value}°</text>
          </g>
        ))}

        {/* Area */}
        <path d={chart.areaPath} fill="url(#hc-fill)" />

        {/* Temp line */}
        <path d={chart.tempPath} fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

        {/* Precip dashed */}
        <path d={chart.precipPath} fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.65" vectorEffect="non-scaling-stroke" />

        {/* X labels — every 3rd */}
        {data.map((d, i) => {
          if (i % 3 !== 0) return null;
          const x = data.length > 1 ? (i / (data.length - 1)) * SVG_W : 0;
          return (
            <text key={i} x={x} y={SVG_H + 24} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">
              {d.time}
            </text>
          );
        })}

        {/* ── Hover elements (hidden by default, shown via DOM mutation) ── */}

        {/* Vertical cursor line */}
        <line ref={lineRef} x1="0" y1="0" x2="0" y2={SVG_H}
          stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 3"
          style={{ display: "none" }} />

        {/* Glow outer */}
        <circle ref={dotOuterRef} cx="0" cy="0" r="12"
          fill="#facc15" opacity="0.18" filter="url(#hc-glow)"
          style={{ display: "none" }} />

        {/* White ring */}
        <circle ref={dotRingRef} cx="0" cy="0" r="6"
          fill="white" stroke="#facc15" strokeWidth="2.5"
          style={{ display: "none" }} />

        {/* Inner dot */}
        <circle ref={dotInnerRef} cx="0" cy="0" r="3"
          fill="#facc15"
          style={{ display: "none" }} />

        {/* Tooltip box */}
        <rect ref={ttBoxRef} x="0" y="0" width="120" height="52" rx="10" ry="10"
          fill="rgba(10,12,22,0.88)" stroke="rgba(255,255,255,0.13)" strokeWidth="1"
          style={{ display: "none" }} />

        {/* Tooltip: time */}
        <text ref={ttTimeRef} x="0" y="0"
          fill="rgba(255,255,255,0.65)" fontSize="12" fontWeight="500"
          style={{ display: "none" }} />

        {/* Tooltip: separator */}
        <line ref={ttSepRef} x1="0" y1="0" x2="0" y2="0"
          stroke="rgba(255,255,255,0.1)" strokeWidth="1"
          style={{ display: "none" }} />

        {/* Tooltip: temp dot */}
        <circle ref={ttTDotRef} cx="0" cy="0" r="4" fill="#facc15"
          style={{ display: "none" }} />

        {/* Tooltip: temp text */}
        <text ref={ttTempRef} x="0" y="0"
          fill="white" fontSize="13" fontWeight="600"
          style={{ display: "none" }} />

        {/* Tooltip: precip dot */}
        <circle ref={ttPDotRef} cx="0" cy="0" r="4" fill="#60a5fa"
          style={{ display: "none" }} />

        {/* Tooltip: precip text */}
        <text ref={ttPrecipRef} x="0" y="0"
          fill="#bfdbfe" fontSize="12"
          style={{ display: "none" }} />
      </svg>
    </div>
  );
}

export const HourlyChart = memo(HourlyChartComponent);
HourlyChart.displayName = "HourlyChart";
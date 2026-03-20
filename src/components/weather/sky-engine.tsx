"use client";

import { useEffect, useRef, useState } from "react";
import { usePerformance } from "@/components/Providers/performance-provider";

interface SkyEngineProps {
  initialWeatherCode?: number;
}

type TimePeriod = "morning" | "day" | "sunset" | "night";
type Condition = "clear" | "cloudy" | "rain" | "storm" | "snow" | "fog";

/* ── Helpers ── */
function getTimePeriod(): TimePeriod {
  const h = new Date().getHours();
  if (h >= 5 && h < 9) return "morning";
  if (h >= 9 && h < 17) return "day";
  if (h >= 17 && h < 19) return "sunset";
  return "night";
}

function codeToCondition(code: number): Condition {
  if (code === 0) return "clear";
  if (code <= 3) return "cloudy";
  if (code >= 45 && code <= 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 95) return "storm";
  return "clear";
}

const SKY_GRADIENTS: Record<TimePeriod, [string, string, string]> = {
  morning: ["#1a1a2e", "#e96c50", "#f7b267"],
  day: ["#0f4c81", "#1a8fe3", "#7ec8e3"],
  sunset: ["#1a1a2e", "#b04632", "#f7862e"],
  night: ["#05050f", "#0d1b2a", "#161a2b"],
};

/* ── Particle objects ── */
type CloudLayer = "far" | "mid" | "near";
interface Star { x: number; y: number; r: number; tw: number; twSpeed: number; dx: number; }
interface Cloud { x: number; y: number; scale: number; speed: number; opacity: number; layer: CloudLayer; }
interface Drop { x: number; y: number; vx: number; speed: number; len: number; opacity: number; }
interface Flake { x: number; y: number; r: number; speed: number; sway: number; swayPhase: number; }
interface Wisp { x: number; y: number; w: number; h: number; speed: number; }

/* ── Factory functions ── */
const mkStar = (W: number, H: number): Star => ({
  x: Math.random() * W, y: Math.random() * H * 0.7, r: Math.random() * 1.4 + 0.2,
  tw: Math.random() * Math.PI * 2, twSpeed: 0.01 + Math.random() * 0.02, dx: Math.random() * 0.03 + 0.01,
});
const mkCloud = (W: number, H: number, layer: CloudLayer): Cloud => {
  let scale = 1, speed = 0.1, opacity = 0.1;
  if (layer === "far") { scale = 0.4 + Math.random() * 0.3; speed = 0.03 + Math.random() * 0.03; opacity = 0.04 + Math.random() * 0.04; }
  else if (layer === "mid") { scale = 0.8 + Math.random() * 0.4; speed = 0.08 + Math.random() * 0.08; opacity = 0.08 + Math.random() * 0.06; }
  else { scale = 1.4 + Math.random() * 0.6; speed = 0.15 + Math.random() * 0.15; opacity = 0.1 + Math.random() * 0.1; }
  return { x: Math.random() * W * 1.5 - W * 0.25, y: Math.random() * H * 0.55, scale, speed, opacity, layer };
};
const mkDrop = (W: number, H: number): Drop => ({
  x: Math.random() * W * 1.5, y: Math.random() * -H, vx: 2 + Math.random() * 4, speed: 12 + Math.random() * 10, len: 10 + Math.random() * 15, opacity: 0.1 + Math.random() * 0.3,
});
const mkFlake = (W: number, H: number): Flake => ({
  x: Math.random() * W, y: Math.random() * -H, r: 1 + Math.random() * 2, speed: 0.5 + Math.random() * 1.0, sway: Math.random() * 0.5, swayPhase: Math.random() * Math.PI * 2,
});
const mkWisp = (W: number, H: number): Wisp => ({
  x: Math.random() * W * 1.4 - W * 0.2, y: H * 0.4 + Math.random() * H * 0.5, w: 150 + Math.random() * 250, h: 30 + Math.random() * 50, speed: 0.1 + Math.random() * 0.2,
});

/* ── Draw helpers ── */
function drawCloud(ctx: CanvasRenderingContext2D, c: Cloud, nightMode: boolean) {
  ctx.save(); ctx.globalAlpha = c.opacity; ctx.fillStyle = nightMode ? "#4a5568" : "#f1f5f9";
  const { x, y, scale: s } = c; ctx.beginPath(); ctx.arc(x, y, 40 * s, 0, Math.PI * 2); ctx.arc(x + 45 * s, y - 10 * s, 30 * s, 0, Math.PI * 2); ctx.arc(x + 80 * s, y, 35 * s, 0, Math.PI * 2); ctx.arc(x + 30 * s, y + 20 * s, 25 * s, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
function drawDrop(ctx: CanvasRenderingContext2D, d: Drop) {
  ctx.save(); ctx.globalAlpha = d.opacity; ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - d.vx, d.y + d.len); ctx.stroke(); ctx.restore();
}
function drawFlake(ctx: CanvasRenderingContext2D, f: Flake) {
  ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
function drawWisp(ctx: CanvasRenderingContext2D, wp: Wisp) {
  const grad = ctx.createRadialGradient(wp.x, wp.y, 0, wp.x, wp.y, wp.w); grad.addColorStop(0, "rgba(226,232,240,0.05)"); grad.addColorStop(1, "rgba(226,232,240,0)"); ctx.fillStyle = grad; ctx.beginPath(); ctx.ellipse(wp.x, wp.y, wp.w, wp.h, 0, 0, Math.PI * 2); ctx.fill();
}

export default function SkyEngine({ initialWeatherCode = 0 }: SkyEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [weatherCode, setWeatherCode] = useState(initialWeatherCode);
  const { quality, registerCallback, unregisterCallback } = usePerformance();

  const particlesRef = useRef({
    stars: [] as Star[], clouds: [] as Cloud[], drops: [] as Drop[], flakes: [] as Flake[], wisps: [] as Wisp[],
    lightningOpacity: 0, lightningTimer: 0
  });

  const dimsRef = useRef({ W: 0, H: 0 });

  useEffect(() => {
    const handleWeatherUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      if (typeof customEvent.detail === "number") setWeatherCode(customEvent.detail);
    };
    window.addEventListener("aeroweather_code_update", handleWeatherUpdate);
    return () => window.removeEventListener("aeroweather_code_update", handleWeatherUpdate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const updateDimensions = () => {
      dimsRef.current.W = canvas.width = window.innerWidth;
      dimsRef.current.H = canvas.height = window.innerHeight;
      init();
    };

    const init = () => {
      const { W, H } = dimsRef.current;
      const period = getTimePeriod();
      const condition = codeToCondition(weatherCode);
      const isNight = period === "night";

      // ── Adaptive Scaling ──
      const multiplier = quality === "LITE" ? 0.2 : quality === "BALANCED" ? 0.6 : 1.0;

      particlesRef.current.stars = isNight ? Array.from({ length: Math.floor(100 * multiplier) }, () => mkStar(W, H)) : [];
      const cloudN = Math.floor((condition === "cloudy" || condition === "fog" ? 15 : 5) * multiplier);
      particlesRef.current.clouds = Array.from({ length: cloudN }, (_, i) => {
        const layer = i < cloudN / 3 ? "far" : i < (2 * cloudN) / 3 ? "mid" : "near";
        return mkCloud(W, H, layer);
      });
      particlesRef.current.drops = (condition === "rain" || condition === "storm") ? 
        Array.from({ length: Math.floor(120 * multiplier) }, () => mkDrop(W, H)) : [];
      particlesRef.current.flakes = condition === "snow" ? 
        Array.from({ length: Math.floor(150 * multiplier) }, () => mkFlake(W, H)) : [];
      particlesRef.current.wisps = condition === "fog" ? 
        Array.from({ length: Math.floor(10 * multiplier) }, () => mkWisp(W, H)) : [];
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const period = getTimePeriod();
    const condition = codeToCondition(weatherCode);
    const [c1, c2, c3] = SKY_GRADIENTS[period];
    const isNight = period === "night";

    const render = () => {
      if (document.hidden && quality !== "ULTRA") return; // LITE/BALANCED logic: stop loop when hidden
      const { W, H } = dimsRef.current;
      const { stars, clouds, drops, flakes, wisps } = particlesRef.current;
      
      // Use fillRect instead of clearRect for performance with opaque background
      ctx.fillStyle = c3; 
      ctx.fillRect(0, 0, W, H);

      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, c1); skyGrad.addColorStop(0.5, c2); skyGrad.addColorStop(1, c3);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      if (isNight && quality !== "LITE") {
        stars.forEach((s) => {
          s.tw += s.twSpeed; s.x -= s.dx;
          if (s.x < -10) s.x = W + 10;
          ctx.save(); ctx.globalAlpha = (0.3 + Math.sin(s.tw) * 0.7) * 0.8;
          ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        });
      }

      clouds.forEach((c) => {
        c.x += c.speed; if (c.x > W + 200) c.x = -200;
        drawCloud(ctx, c, isNight);
      });

      if (quality !== "LITE" || condition !== "clear") {
        drops.forEach((d) => {
          d.y += d.speed; d.x -= d.vx * 0.5;
          if (d.y > H || d.x < -100) { d.y = Math.random() * -200; d.x = Math.random() * W * 1.5; }
          drawDrop(ctx, d);
        });
        flakes.forEach((f) => {
          f.swayPhase += 0.02; f.x += Math.sin(f.swayPhase) * f.sway; f.y += f.speed;
          if (f.y > H) { f.y = -20; f.x = Math.random() * W; }
          drawFlake(ctx, f);
        });
        wisps.forEach((wp) => {
          wp.x += wp.speed; if (wp.x > W + 400) wp.x = -400;
          drawWisp(ctx, wp);
        });
      }

      if (condition === "storm" && quality !== "LITE") {
        particlesRef.current.lightningTimer++;
        if (particlesRef.current.lightningTimer > 200 && Math.random() < 0.015) {
          particlesRef.current.lightningOpacity = 0.6 + Math.random() * 0.4;
          particlesRef.current.lightningTimer = 0;
        }
        if (particlesRef.current.lightningOpacity > 0) {
          ctx.save(); ctx.globalAlpha = Math.min(0.3, particlesRef.current.lightningOpacity);
          ctx.fillStyle = "white"; ctx.fillRect(0, 0, W, H); ctx.restore();
          particlesRef.current.lightningOpacity -= 0.05;
        }
      }
    };

    registerCallback("sky-engine", render);
    return () => {
      unregisterCallback("sky-engine");
      window.removeEventListener("resize", updateDimensions);
    };
  }, [weatherCode, quality, registerCallback, unregisterCallback]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" style={{ transform: "translateZ(0)", willChange: "transform" }} />;
}

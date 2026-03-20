"use client";

import { useEffect, useRef } from "react";

interface WeatherBackgroundProps {
  weatherCode?: number;
}

type TimePeriod = "morning" | "day" | "sunset" | "night";
type Condition = "clear" | "cloudy" | "rain" | "storm" | "snow" | "fog";

/* ── Helpers ── */
function getTimePeriod(): TimePeriod {
  const h = new Date().getHours();
  if (h >= 6 && h < 10) return "morning";
  if (h >= 10 && h < 17) return "day";
  if (h >= 17 && h < 20) return "sunset";
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
  day:     ["#0f4c81", "#1a8fe3", "#7ec8e3"],
  sunset:  ["#1a1a2e", "#b04632", "#f7862e"],
  night:   ["#05050f", "#0d1b2a", "#161a2b"],
};

/* ── Moon Phase Calculation ── */
// Returns a phase value from 0.0 to 1.0
// 0.0 = New Moon, 0.5 = Full Moon, 1.0 = Next New Moon
function getMoonPhase(): number {
  const LUNAR_MONTH = 29.53058867;
  // Known new moon: Jan 11, 2024, 11:57 UTC
  const knownNewMoon = new Date(Date.UTC(2024, 0, 11, 11, 57)).getTime();
  const now = Date.now();
  const diffDays = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
  return (diffDays % LUNAR_MONTH) / LUNAR_MONTH;
}

/* ── Particle objects (plain interfaces, no classes) ── */
type CloudLayer = "far" | "mid" | "near";
interface Star  { x: number; y: number; r: number; tw: number; twSpeed: number; dx: number }
interface Cloud { x: number; y: number; scale: number; speed: number; opacity: number; layer: CloudLayer }
interface Drop  { x: number; y: number; vx: number; speed: number; len: number; opacity: number }
interface Flake { x: number; y: number; r: number; speed: number; sway: number; swayPhase: number }
interface Wisp  { x: number; y: number; w: number; h: number; speed: number }

/* ── Factory functions ── */
const mkStar  = (W: number, H: number): Star  => ({ 
  x: Math.random()*W, 
  y: Math.random()*H*0.7, 
  r: Math.random()*1.4+0.2, 
  tw: Math.random()*Math.PI*2, 
  twSpeed: 0.01+Math.random()*0.02,
  dx: (Math.random() * 0.05 + 0.02) // slow parallax drift
});
const mkCloud = (W: number, H: number, layer: CloudLayer): Cloud => {
  let scale = 1, speed = 0.1, opacity = 0.1;
  if (layer === "far") {
    scale = 0.4 + Math.random() * 0.3;     // smallest
    speed = 0.05 + Math.random() * 0.05;   // slowest
    opacity = 0.05 + Math.random() * 0.05; // faintest
  } else if (layer === "mid") {
    scale = 0.8 + Math.random() * 0.4;
    speed = 0.15 + Math.random() * 0.1;
    opacity = 0.10 + Math.random() * 0.08;
  } else {
    scale = 1.4 + Math.random() * 0.6;     // largest
    speed = 0.3 + Math.random() * 0.2;     // fastest
    opacity = 0.15 + Math.random() * 0.1;  // most solid
  }
  return { 
    x: Math.random() * W * 1.5 - W * 0.25, 
    y: Math.random() * H * 0.55, 
    scale, speed, opacity, layer 
  };
};
const mkDrop  = (W: number, H: number): Drop  => ({ 
  x: Math.random() * W * 1.5, 
  y: Math.random() * -H, 
  vx: 2 + Math.random() * 4, // wind direction speed
  speed: 15 + Math.random() * 15, 
  len: 12 + Math.random() * 18, 
  opacity: 0.15 + Math.random() * 0.35 
});
const mkFlake = (W: number, H: number): Flake => ({ x: Math.random()*W, y: Math.random()*-H, r: 1+Math.random()*2.5, speed: 0.8+Math.random()*1.5, sway: Math.random()*0.8, swayPhase: Math.random()*Math.PI*2 });
const mkWisp  = (W: number, H: number): Wisp  => ({ x: Math.random()*W*1.4-W*0.2, y: H*0.4+Math.random()*H*0.5, w: 200+Math.random()*300, h: 40+Math.random()*60, speed: 0.2+Math.random()*0.3 });

/* ── Draw helpers ── */
function drawCloud(ctx: CanvasRenderingContext2D, c: Cloud, nightMode: boolean) {
  ctx.save();
  ctx.globalAlpha = c.opacity;
  ctx.fillStyle = nightMode ? "#4a5568" : "#e2e8f0";
  const { x, y, scale: s } = c;
  ctx.beginPath();
  ctx.arc(x,            y,            40*s, 0, Math.PI*2);
  ctx.arc(x + 45*s,     y - 10*s,    30*s, 0, Math.PI*2);
  ctx.arc(x + 80*s,     y,            35*s, 0, Math.PI*2);
  ctx.arc(x + 30*s,     y + 20*s,    25*s, 0, Math.PI*2);
  ctx.arc(x + 60*s,     y + 18*s,    22*s, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function drawDrop(ctx: CanvasRenderingContext2D, d: Drop) {
  ctx.save();
  ctx.globalAlpha = d.opacity;
  ctx.strokeStyle = "#a0c4ff";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(d.x, d.y);
  // the drop is slanted heavily based on its wind vx component relative to vertical speed
  ctx.lineTo(d.x - d.vx * 1.8, d.y + d.len);
  ctx.stroke();
  ctx.restore();
}

function drawFlake(ctx: CanvasRenderingContext2D, f: Flake) {
  ctx.save();
  ctx.globalAlpha = 0.65;
  ctx.fillStyle = "#dbeafe";
  ctx.beginPath();
  ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function drawWisp(ctx: CanvasRenderingContext2D, wp: Wisp) {
  const grad = ctx.createRadialGradient(wp.x, wp.y, 0, wp.x, wp.y, wp.w);
  grad.addColorStop(0,   "rgba(200,210,220,0.07)");
  grad.addColorStop(1,   "rgba(200,210,220,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(wp.x, wp.y, wp.w, wp.h, 0, 0, Math.PI*2);
  ctx.fill();
}

/* ─────────────────────────────────────────────────── */

export function WeatherBackground({ weatherCode = 0 }: WeatherBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let raf: number;

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const period    = getTimePeriod();
    const condition = codeToCondition(weatherCode);
    const [c1, c2, c3] = SKY_GRADIENTS[period];
    const isNight = period === "night";

    /* particles */
    const stars: Star[]   = isNight ? Array.from({ length: 200 }, () => mkStar(W, H))  : [];
    const cloudN          = condition === "cloudy" || condition === "fog" ? 18 : condition === "rain" || condition === "storm" ? 12 : 6;
    const clouds: Cloud[] = Array.from({ length: cloudN }, (_, i) => {
      const layer = i < cloudN / 3 ? "far" : i < (cloudN * 2) / 3 ? "mid" : "near";
      return mkCloud(W, H, layer);
    });
    const drops:  Drop[]  = (condition === "rain" || condition === "storm") ? Array.from({ length: 180 }, () => mkDrop(W, H))  : [];
    const flakes: Flake[] = condition === "snow"  ? Array.from({ length: 200 }, () => mkFlake(W, H)) : [];
    const wisps:  Wisp[]  = condition === "fog"   ? Array.from({ length: 12  }, () => mkWisp(W, H))  : [];

    const moon = { x: W * 0.82, y: H * 0.15, r: 36 };

    let lightningOpacity = 0;
    let lightningTimer   = 0;

    const render = () => {
      ctx.clearRect(0, 0, W, H);

      /* sky */
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0,   c1);
      skyGrad.addColorStop(0.5, c2);
      skyGrad.addColorStop(1,   c3);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      /* night: stars + moon */
      if (isNight) {
        // Star Parallax & Twinkle
        stars.forEach((s) => {
          s.tw += s.twSpeed;
          s.x -= s.dx; // parallax drift left
          if (s.x < -10) s.x = W + 10;
          ctx.save();
          ctx.globalAlpha = (0.4 + Math.sin(s.tw) * 0.6) * 0.9;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
          ctx.restore();
        });

        // Moon Outer Glow
        const mg = ctx.createRadialGradient(moon.x, moon.y, 0, moon.x, moon.y, moon.r * 6);
        mg.addColorStop(0,   "rgba(255,255,210,0.35)");
        mg.addColorStop(0.4, "rgba(255,255,200,0.08)");
        mg.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.fillStyle = mg;
        ctx.fillRect(0, 0, W, H);

        // Moon Phase Render
        const phase = getMoonPhase();
        ctx.save();
        ctx.translate(moon.x, moon.y);
        ctx.rotate(-Math.PI / 4); // tilt the moon slightly

        // Base moon disk
        ctx.fillStyle = "#fffde8";
        ctx.beginPath();
        ctx.arc(0, 0, moon.r, 0, Math.PI * 2);
        ctx.fill();

        // Overlay shadow for phase
        ctx.fillStyle = "#161a2b"; // Night sky match
        ctx.beginPath();
        ctx.arc(0, 0, moon.r, -Math.PI/2, Math.PI/2, phase < 0.5); 
        // Use an ellipse to draw the curve of the terminator line
        const terminatorX = Math.cos(phase * Math.PI * 2) * moon.r;
        ctx.ellipse(0, 0, Math.abs(terminatorX), moon.r, 0, Math.PI/2, -Math.PI/2, phase < 0.5 === terminatorX > 0);
        ctx.fill();
        
        ctx.restore();
      }

      /* morning / sunset horizon glow */
      if (period === "morning") {
        const g = ctx.createRadialGradient(W*0.3, H*0.88, 0, W*0.3, H*0.88, H*0.55);
        g.addColorStop(0, "rgba(255,210,80,0.35)");
        g.addColorStop(0.5, "rgba(255,140,40,0.12)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
      if (period === "sunset") {
        const g = ctx.createRadialGradient(W*0.5, H*0.92, 0, W*0.5, H*0.92, H*0.6);
        g.addColorStop(0, "rgba(255,140,40,0.5)");
        g.addColorStop(0.45, "rgba(180,60,30,0.18)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }

      /* clouds */
      clouds.forEach((c) => {
        c.x += c.speed;
        if (c.x > W + 250) c.x = -250;
        drawCloud(ctx, c, isNight);
      });

      /* weather particles */
      drops.forEach((d) => {
        d.y += d.speed;
        d.x -= d.vx;
        if (d.y > H || d.x < -100) { 
          d.y = Math.random() * -200 - 50; 
          d.x = Math.random() * W * 1.5; // span wider to account for wind
        }
        drawDrop(ctx, d);
      });
      flakes.forEach((f) => {
        f.swayPhase += 0.02;
        f.x += Math.sin(f.swayPhase) * f.sway;
        f.y += f.speed;
        if (f.y > H) { f.y = -20; f.x = Math.random() * W; }
        drawFlake(ctx, f);
      });
      wisps.forEach((wp) => {
        wp.x += wp.speed;
        if (wp.x > W + 400) wp.x = -400;
        drawWisp(ctx, wp);
      });

      /* lightning */
      if (condition === "storm") {
        lightningTimer++;
        if (lightningTimer > 120 && Math.random() < 0.02) {
          lightningOpacity = 0.8 + Math.random() * 0.5; // intense starting value
          lightningTimer = 0;
        }
        if (lightningOpacity > 0) {
          ctx.save();
          ctx.globalCompositeOperation = "screen";
          ctx.globalAlpha = Math.min(1, lightningOpacity);
          
          // create a massive semi-radial flash from top centre to bottom
          const flashGrad = ctx.createRadialGradient(W/2, 0, 0, W/2, 0, H);
          flashGrad.addColorStop(0, "rgba(255,255,255,1)");
          flashGrad.addColorStop(1, "rgba(220,230,255,0.3)");
          
          ctx.fillStyle = flashGrad;
          ctx.fillRect(0, 0, W, H);
          ctx.restore();
          
          lightningOpacity -= 0.06; // fade relatively quickly but persist for a few frames
        }
      }

      /* horizon vignette */
      const vignette = ctx.createLinearGradient(0, H * 0.65, 0, H);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.45)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(render);
    };

    let isActive = true;
    const timer = setTimeout(() => {
      if (isActive) render();
    }, 600); // Slightly more delay than SkyEngine

    return () => {
      isActive = false;
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [weatherCode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full"
      aria-hidden="true"
    />
  );
}

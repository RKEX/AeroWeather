"use client";

import { subscribeSharedRaf } from "@/lib/shared-raf";
import { useEffect, useMemo, useRef, useState } from "react";

interface SkyEngineProps {
  initialWeatherCode?: number;
}

type TimePeriod = "morning" | "day" | "sunset" | "night";
type Condition = "clear" | "cloudy" | "rain" | "storm" | "snow" | "fog";
type CloudLayer = "far" | "mid" | "near";

interface Star {
  x: number;
  y: number;
  r: number;
  tw: number;
  twSpeed: number;
  dx: number;
}

interface Cloud {
  x: number;
  y: number;
  scale: number;
  speed: number;
  opacity: number;
  layer: CloudLayer;
}

interface Drop {
  x: number;
  y: number;
  vx: number;
  speed: number;
  len: number;
  opacity: number;
}

interface Flake {
  x: number;
  y: number;
  r: number;
  speed: number;
  sway: number;
  swayPhase: number;
}

interface Wisp {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
}

interface ParticlePools {
  stars: Star[];
  clouds: Cloud[];
  drops: Drop[];
  flakes: Flake[];
  wisps: Wisp[];
}

interface CachedPaints {
  skyGradient: CanvasGradient;
  morningGlow?: CanvasGradient;
  sunsetGlow?: CanvasGradient;
  moonGlow?: CanvasGradient;
  sunGlowDay?: CanvasGradient;
  sunGlowSunset?: CanvasGradient;
  lightningFlash?: CanvasGradient;
}

interface DrawEnv {
  W: number;
  H: number;
  isNight: boolean;
  dpr: number;
  renderScale: number;
  speedScale: number;
  lowEnd: boolean;
  mobile: boolean;
  reducedMotion: boolean;
  period: TimePeriod;
  condition: Condition;
}

const SKY_GRADIENTS: Record<TimePeriod, [string, string, string]> = {
  morning: ["#1a1a2e", "#e96c50", "#f7b267"],
  day: ["#0f4c81", "#1a8fe3", "#7ec8e3"],
  sunset: ["#1a1a2e", "#b04632", "#f7862e"],
  night: ["#05050f", "#0d1b2a", "#161a2b"],
};

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

function getMoonPhase(): number {
  const LUNAR_MONTH = 29.53058867;
  const knownNewMoon = new Date(Date.UTC(2024, 0, 11, 11, 57)).getTime();
  const now = Date.now();
  const diffDays = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
  return (diffDays % LUNAR_MONTH) / LUNAR_MONTH;
}

// Adaptive DPR: low-end devices cap at 1.2, high-end allow up to 2.
// Slight oversampling (1.1x render scale) improves perceived sharpness
// without meaningfully increasing fill rate cost.
function computeAdaptiveDpr(rawDpr: number, lowEnd: boolean): number {
  const cap = lowEnd ? 1.2 : 2.0;
  return Math.min(rawDpr, cap);
}

const RENDER_OVERSAMPLE = 1.1;

const mkStar = (W: number, H: number): Star => ({
  x: Math.random() * W,
  y: Math.random() * H * 0.7,
  // Slightly larger radii (0.3–1.9) for crisper visibility at any DPR
  r: Math.random() * 1.6 + 0.3,
  tw: Math.random() * Math.PI * 2,
  twSpeed: 0.01 + Math.random() * 0.02,
  dx: Math.random() * 0.05 + 0.02,
});

const mkCloud = (W: number, H: number, layer: CloudLayer): Cloud => {
  let scale = 1;
  let speed = 0.1;
  let opacity = 0.1;

  if (layer === "far") {
    scale = 0.4 + Math.random() * 0.3;
    speed = 0.05 + Math.random() * 0.05;
    opacity = 0.05 + Math.random() * 0.05;
  } else if (layer === "mid") {
    scale = 0.8 + Math.random() * 0.4;
    speed = 0.15 + Math.random() * 0.1;
    opacity = 0.1 + Math.random() * 0.08;
  } else {
    scale = 1.4 + Math.random() * 0.6;
    speed = 0.3 + Math.random() * 0.2;
    opacity = 0.12 + Math.random() * 0.12;
  }

  return {
    x: Math.random() * W * 1.5 - W * 0.25,
    y: Math.random() * H * 0.55,
    scale,
    speed,
    opacity,
    layer,
  };
};

const mkDrop = (W: number, H: number): Drop => ({
  x: Math.random() * W * 1.5,
  y: Math.random() * -H,
  vx: 2 + Math.random() * 4,
  speed: 15 + Math.random() * 15,
  len: 12 + Math.random() * 18,
  opacity: 0.15 + Math.random() * 0.35,
});

const mkFlake = (W: number, H: number): Flake => ({
  x: Math.random() * W,
  y: Math.random() * -H,
  r: 1 + Math.random() * 2.5,
  speed: 0.8 + Math.random() * 1.5,
  sway: Math.random() * 0.8,
  swayPhase: Math.random() * Math.PI * 2,
});

const mkWisp = (W: number, H: number): Wisp => ({
  x: Math.random() * W * 1.4 - W * 0.2,
  y: H * 0.4 + Math.random() * H * 0.5,
  w: 200 + Math.random() * 300,
  h: 40 + Math.random() * 60,
  speed: 0.2 + Math.random() * 0.3,
});

function drawCloud(
  ctx: CanvasRenderingContext2D,
  c: Cloud,
  nightMode: boolean,
  lowEnd: boolean,
) {
  const prevAlpha = ctx.globalAlpha;
  ctx.globalAlpha = c.opacity;
  ctx.fillStyle = nightMode ? "#4a5568" : "#e2e8f0";

  // shadowBlur only on mid/near layers; skip for far clouds to save fill cost.
  // No global canvas blur — only intentional per-shape softness.
  if (!lowEnd && c.layer !== "far") {
    ctx.shadowColor = nightMode ? "#4a5568" : "#e2e8f0";
    ctx.shadowBlur = 8 * c.scale;
  }

  const { x, y, scale: s } = c;
  ctx.beginPath();
  ctx.arc(x, y, 40 * s, 0, Math.PI * 2);
  ctx.arc(x + 45 * s, y - 10 * s, 30 * s, 0, Math.PI * 2);
  ctx.arc(x + 80 * s, y, 35 * s, 0, Math.PI * 2);
  ctx.arc(x + 30 * s, y + 20 * s, 25 * s, 0, Math.PI * 2);
  ctx.arc(x + 60 * s, y + 18 * s, 22 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.globalAlpha = prevAlpha;
}

function drawDrop(ctx: CanvasRenderingContext2D, d: Drop) {
  const prevAlpha = ctx.globalAlpha;
  ctx.globalAlpha = d.opacity;
  ctx.strokeStyle = "#a0c4ff";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(d.x, d.y);
  ctx.lineTo(d.x - d.vx * 1.8, d.y + d.len);
  ctx.stroke();
  ctx.globalAlpha = prevAlpha;
}

// Opacity boosted slightly (0.75 base instead of 0.65) for crisper visibility
function drawFlake(ctx: CanvasRenderingContext2D, f: Flake, opacityScale: number) {
  const prevAlpha = ctx.globalAlpha;
  ctx.globalAlpha = 0.75 * opacityScale;
  ctx.fillStyle = "#dbeafe";
  ctx.beginPath();
  ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = prevAlpha;
}

function drawWisp(
  ctx: CanvasRenderingContext2D,
  wp: Wisp,
  opacityScale: number,
  lowEnd: boolean,
) {
  const grad = ctx.createRadialGradient(wp.x, wp.y, 0, wp.x, wp.y, wp.w);
  grad.addColorStop(0, `rgba(200,210,220,${0.09 * opacityScale})`);
  grad.addColorStop(1, "rgba(200,210,220,0)");
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.ellipse(wp.x, wp.y, wp.w, wp.h, 0, 0, Math.PI * 2);
  ctx.fill();

  if (lowEnd) {
    return;
  }
}

function getTargetCounts(condition: Condition, isNight: boolean, lowEnd: boolean) {
  return {
    stars: isNight ? (lowEnd ? 80 : 200) : 0,
    clouds: condition === "cloudy" || condition === "fog" ? (lowEnd ? 8 : 18) : 6,
    drops: condition === "rain" || condition === "storm" ? (lowEnd ? 80 : 180) : 0,
    flakes: condition === "snow" ? (lowEnd ? 80 : 200) : 0,
    wisps: condition === "fog" ? (lowEnd ? 6 : 12) : 0,
  };
}

function syncPool<T>(pool: T[], target: number, create: () => T) {
  if (pool.length < target) {
    while (pool.length < target) pool.push(create());
    return;
  }
  if (pool.length > target) pool.length = target;
}

function createCachedPaints(
  ctx: CanvasRenderingContext2D,
  period: TimePeriod,
  W: number,
  H: number,
): CachedPaints {
  const [c1, c2, c3] = SKY_GRADIENTS[period];

  const skyGradient = ctx.createLinearGradient(0, 0, 0, H);
  skyGradient.addColorStop(0, c1);
  skyGradient.addColorStop(0.5, c2);
  skyGradient.addColorStop(1, c3);

  const paints: CachedPaints = { skyGradient };

  if (period === "morning") {
    const g = ctx.createRadialGradient(W * 0.3, H * 0.88, 0, W * 0.3, H * 0.88, H * 0.55);
    g.addColorStop(0, "rgba(255,210,80,0.35)");
    g.addColorStop(0.5, "rgba(255,140,40,0.12)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    paints.morningGlow = g;
  }

  if (period === "sunset") {
    const g = ctx.createRadialGradient(W * 0.5, H * 0.92, 0, W * 0.5, H * 0.92, H * 0.6);
    g.addColorStop(0, "rgba(255,140,40,0.5)");
    g.addColorStop(0.45, "rgba(180,60,30,0.18)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    paints.sunsetGlow = g;
  }

  const moonGlow = ctx.createRadialGradient(W * 0.85, H * 0.15, 0, W * 0.85, H * 0.15, 220);
  moonGlow.addColorStop(0, "rgba(255,255,210,0.45)");
  moonGlow.addColorStop(0.4, "rgba(255,255,200,0.1)");
  moonGlow.addColorStop(1, "rgba(0,0,0,0)");
  paints.moonGlow = moonGlow;

  const sunGlowDay = ctx.createRadialGradient(W * 0.5, H * 0.2, 0, W * 0.5, H * 0.2, 160);
  sunGlowDay.addColorStop(0, "rgba(255,255,180,0.4)");
  sunGlowDay.addColorStop(1, "rgba(0,0,0,0)");
  paints.sunGlowDay = sunGlowDay;

  const sunGlowSunset = ctx.createRadialGradient(W * 0.5, H * 0.2, 0, W * 0.5, H * 0.2, 160);
  sunGlowSunset.addColorStop(0, "rgba(255,150,50,0.6)");
  sunGlowSunset.addColorStop(1, "rgba(0,0,0,0)");
  paints.sunGlowSunset = sunGlowSunset;

  const lightningFlash = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, Math.hypot(W / 2, H));
  lightningFlash.addColorStop(0, "rgba(255,255,255,1)");
  lightningFlash.addColorStop(1, "rgba(200,220,255,0.2)");
  paints.lightningFlash = lightningFlash;

  return paints;
}

function drawStaticLayer(
  targetCtx: CanvasRenderingContext2D,
  env: DrawEnv,
  pools: ParticlePools,
  paints: CachedPaints,
) {
  targetCtx.setTransform(env.dpr * env.renderScale, 0, 0, env.dpr * env.renderScale, 0, 0);
  targetCtx.clearRect(0, 0, env.W, env.H);

  // Enable high-quality image smoothing for crisper gradient and image rendering
  targetCtx.imageSmoothingEnabled = true;
  targetCtx.imageSmoothingQuality = "high";

  targetCtx.fillStyle = paints.skyGradient;
  targetCtx.fillRect(0, 0, env.W, env.H);

  if (env.period === "morning" && paints.morningGlow) {
    targetCtx.fillStyle = paints.morningGlow;
    targetCtx.fillRect(0, 0, env.W, env.H);
  }

  if (env.period === "sunset" && paints.sunsetGlow) {
    targetCtx.fillStyle = paints.sunsetGlow;
    targetCtx.fillRect(0, 0, env.W, env.H);
  }

  if (env.isNight) {
    for (let i = 0; i < pools.stars.length; i += 1) {
      const s = pools.stars[i];
      // Slightly boosted max opacity (0.95 vs 0.9) for crisper star appearance
      targetCtx.globalAlpha = (0.4 + Math.sin(s.tw) * 0.6) * 0.95;
      targetCtx.fillStyle = "#ffffff";
      targetCtx.beginPath();
      targetCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      targetCtx.fill();
    }

    targetCtx.globalAlpha = 1;

    targetCtx.strokeStyle = "rgba(255,255,255,0.05)";
    targetCtx.lineWidth = 0.5;
    for (let i = 0; i < pools.stars.length; i += 10) {
      const s1 = pools.stars[i];
      const s2 = pools.stars[i + 1];
      if (s2 && Math.hypot(s1.x - s2.x, s1.y - s2.y) < 150) {
        targetCtx.beginPath();
        targetCtx.moveTo(s1.x, s1.y);
        targetCtx.lineTo(s2.x, s2.y);
        targetCtx.stroke();
      }
    }

    if (paints.moonGlow) {
      const moon = { x: env.W * 0.85, y: env.H * 0.15, r: 40 };
      targetCtx.fillStyle = paints.moonGlow;
      targetCtx.beginPath();
      targetCtx.arc(moon.x, moon.y, moon.r * 4, 0, Math.PI * 2);
      targetCtx.fill();

      const phase = getMoonPhase();
      targetCtx.save();
      targetCtx.translate(moon.x, moon.y);
      targetCtx.rotate(-Math.PI / 4);
      targetCtx.fillStyle = "#fffde8";
      targetCtx.beginPath();
      targetCtx.arc(0, 0, moon.r, 0, Math.PI * 2);
      targetCtx.fill();

      targetCtx.fillStyle = SKY_GRADIENTS[env.period][0];
      targetCtx.beginPath();
      targetCtx.arc(0, 0, moon.r, -Math.PI / 2, Math.PI / 2, phase < 0.5);
      const terminatorX = Math.cos(phase * Math.PI * 2) * moon.r;
      targetCtx.ellipse(
        0,
        0,
        Math.abs(terminatorX),
        moon.r,
        0,
        Math.PI / 2,
        -Math.PI / 2,
        phase < 0.5 === terminatorX > 0,
      );
      targetCtx.fill();
      targetCtx.restore();
    }
  }

  if (!env.isNight) {
    const hour = new Date().getHours() + new Date().getMinutes() / 60;
    const t = (hour - 6) / 12;
    const sunX = env.W * 0.1 + env.W * 0.8 * t;
    const sunY = env.H * 0.9 - Math.sin(t * Math.PI) * env.H * 0.75;

    targetCtx.fillStyle =
      env.period === "day" && paints.sunGlowDay
        ? paints.sunGlowDay
        : paints.sunGlowSunset || "rgba(0,0,0,0)";
    targetCtx.fillRect(0, 0, env.W, env.H);

    targetCtx.fillStyle = env.period === "day" ? "#fff9e3" : "#ffcc77";
    targetCtx.beginPath();
    targetCtx.arc(sunX, sunY, 30, 0, Math.PI * 2);
    targetCtx.fill();
  }

  targetCtx.globalAlpha = 1;
}

export default function SkyEngine({ initialWeatherCode = 0 }: SkyEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [weatherCode, setWeatherCode] = useState(() => {
    if (typeof window === "undefined") return initialWeatherCode;
    const saved = localStorage.getItem("aeroweather_current_code");
    const parsed = saved ? Number.parseInt(saved, 10) : NaN;
    return Number.isNaN(parsed) ? initialWeatherCode : parsed;
  });

  const period = useMemo(() => getTimePeriod(), []);
  const condition = useMemo(() => codeToCondition(weatherCode), [weatherCode]);

  useEffect(() => {
    const handleWeatherUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      if (typeof customEvent.detail === "number") {
        setWeatherCode((prev) => (prev === customEvent.detail ? prev : customEvent.detail));
      }
    };
    window.addEventListener("aeroweather_code_update", handleWeatherUpdate);
    return () => window.removeEventListener("aeroweather_code_update", handleWeatherUpdate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;

    const rawDpr = window.devicePixelRatio || 1;
    const cores = navigator.hardwareConcurrency || 4;
    const mobile = window.innerWidth < 768;
    // Low-end: ≤4 cores OR raw DPR > 2 (high-density cheap screens)
    const lowEnd = cores <= 4 || rawDpr > 2;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Adaptive DPR + oversampling
    const dpr = computeAdaptiveDpr(rawDpr, lowEnd);
    const renderScale = RENDER_OVERSAMPLE;

    const env: DrawEnv = {
      W,
      H,
      isNight: period === "night",
      dpr,
      renderScale,
      speedScale: mobile ? 0.9 : 1,
      lowEnd,
      mobile,
      reducedMotion,
      period,
      condition,
    };

    const pools: ParticlePools = {
      stars: [],
      clouds: [],
      drops: [],
      flakes: [],
      wisps: [],
    };

    const resizeCanvas = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      env.W = W;
      env.H = H;

      // Physical pixels = logical size × dpr × renderScale
      const physW = Math.floor(W * dpr * renderScale);
      const physH = Math.floor(H * dpr * renderScale);
      canvas.width = physW;
      canvas.height = physH;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr * renderScale, dpr * renderScale);

      // High-quality smoothing on the main canvas
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };

    resizeCanvas();

    const targetCounts = getTargetCounts(env.condition, env.isNight, env.lowEnd);

    syncPool(pools.stars, targetCounts.stars, () => mkStar(W, H));
    syncPool(pools.clouds, targetCounts.clouds, () => {
      const i = pools.clouds.length;
      const cloudN = Math.max(1, targetCounts.clouds);
      const layer =
        i < cloudN / 3 ? "far" : i < (2 * cloudN) / 3 ? "mid" : "near";
      return mkCloud(W, H, layer);
    });
    syncPool(pools.drops, targetCounts.drops, () => mkDrop(W, H));
    syncPool(pools.flakes, targetCounts.flakes, () => mkFlake(W, H));
    syncPool(pools.wisps, targetCounts.wisps, () => mkWisp(W, H));

    let staticCanvas: OffscreenCanvas | HTMLCanvasElement;
    let staticCtx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | null = null;

    const physW = Math.floor(W * dpr * renderScale);
    const physH = Math.floor(H * dpr * renderScale);

    if (typeof OffscreenCanvas !== "undefined") {
      staticCanvas = new OffscreenCanvas(physW, physH);
      staticCtx = staticCanvas.getContext("2d", { alpha: true });
    } else {
      staticCanvas = document.createElement("canvas");
      staticCanvas.width = physW;
      staticCanvas.height = physH;
      staticCtx = staticCanvas.getContext("2d", { alpha: true });
    }

    if (!staticCtx) return;

    // High-quality smoothing on the offscreen (static layer) canvas too
    (staticCtx as CanvasRenderingContext2D).imageSmoothingEnabled = true;
    (staticCtx as CanvasRenderingContext2D).imageSmoothingQuality = "high";

    let paints = createCachedPaints(ctx, env.period, W, H);

    const rebuildStatic = () => {
      if (!staticCtx) return;

      const pw = Math.floor(W * dpr * renderScale);
      const ph = Math.floor(H * dpr * renderScale);
      staticCanvas.width = pw;
      staticCanvas.height = ph;

      if ("setTransform" in staticCtx) staticCtx.setTransform(1, 0, 0, 1, 0, 0);
      if ("scale" in staticCtx) staticCtx.scale(dpr * renderScale, dpr * renderScale);

      (staticCtx as CanvasRenderingContext2D).imageSmoothingEnabled = true;
      (staticCtx as CanvasRenderingContext2D).imageSmoothingQuality = "high";

      paints = createCachedPaints(ctx, env.period, W, H);
      drawStaticLayer(staticCtx as CanvasRenderingContext2D, env, pools, paints);
    };

    rebuildStatic();

    let pausedByVisibility = document.visibilityState !== "visible";
    let pausedByViewport = false;

    const observer = new IntersectionObserver(
      (entries) => { pausedByViewport = !entries[0]?.isIntersecting; },
      { threshold: 0.01 },
    );
    observer.observe(canvas);

    const onVisibilityChange = () => { pausedByVisibility = document.visibilityState !== "visible"; };
    document.addEventListener("visibilitychange", onVisibilityChange);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizeCanvas();
        rebuildStatic();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    let lightningOpacity = 0;
    let lightningTimer = 0;

    const targetFps = env.reducedMotion ? 20 : env.mobile || env.lowEnd ? 30 : 60;
    const frameInterval = 1000 / targetFps;
    let frameAccumulator = 0;

    const updateDynamic = (dtNorm: number) => {
      const speedScale = env.reducedMotion ? 0.75 : env.speedScale;

      for (let i = 0; i < pools.stars.length; i += 1) {
        const s = pools.stars[i];
        s.tw += s.twSpeed * dtNorm;
        s.x -= s.dx * dtNorm;
        if (s.x < -10) s.x = W + 10;
      }

      for (let i = 0; i < pools.clouds.length; i += 1) {
        const c = pools.clouds[i];
        c.x += c.speed * dtNorm * speedScale;
        if (c.x > W + 250) c.x = -250;
      }

      for (let i = 0; i < pools.drops.length; i += 1) {
        const d = pools.drops[i];
        d.y += d.speed * dtNorm * speedScale;
        d.x -= d.vx * dtNorm * speedScale;
        if (d.y > H || d.x < -100) {
          d.y = Math.random() * -200 - 50;
          d.x = Math.random() * W * 1.5;
        }
      }

      for (let i = 0; i < pools.flakes.length; i += 1) {
        const f = pools.flakes[i];
        f.swayPhase += 0.02 * dtNorm;
        f.x += Math.sin(f.swayPhase) * f.sway * dtNorm;
        f.y += f.speed * dtNorm * speedScale;
        if (f.y > H) {
          f.y = -20;
          f.x = Math.random() * W;
        }
      }

      for (let i = 0; i < pools.wisps.length; i += 1) {
        const wp = pools.wisps[i];
        wp.x += wp.speed * dtNorm * speedScale;
        if (wp.x > W + 400) wp.x = -400;
      }
    };

    const renderDynamic = () => {
      ctx.setTransform(dpr * renderScale, 0, 0, dpr * renderScale, 0, 0);
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, W, H);

      // Blit the static layer at logical size; imageSmoothingQuality="high" on
      // both canvases ensures crisp downsampling from the oversampled buffer.
      ctx.drawImage(staticCanvas as CanvasImageSource, 0, 0, W, H);

      for (let i = 0; i < pools.clouds.length; i += 1) {
        drawCloud(ctx, pools.clouds[i], env.isNight, env.lowEnd);
      }

      for (let i = 0; i < pools.drops.length; i += 1) {
        drawDrop(ctx, pools.drops[i]);
      }

      for (let i = 0; i < pools.flakes.length; i += 1) {
        drawFlake(ctx, pools.flakes[i], env.mobile ? 0.8 : 1);
      }

      // Wisps get selective cinematic blur — only their draw call uses the filter
      for (let i = 0; i < pools.wisps.length; i += 1) {
        drawWisp(ctx, pools.wisps[i], env.mobile ? 0.8 : 1, env.lowEnd);
      }

      if (env.condition === "storm" && !env.mobile) {
        lightningTimer += 1;
        if (lightningTimer > 150 && Math.random() < 0.02) {
          lightningOpacity = 0.8 + Math.random() * 0.5;
          lightningTimer = 0;
        }

        if (lightningOpacity > 0 && paints.lightningFlash) {
          ctx.globalAlpha = Math.min(1, lightningOpacity * (env.mobile ? 0.7 : 1));
          ctx.fillStyle = paints.lightningFlash;
          ctx.fillRect(0, 0, W, H);
          ctx.globalAlpha = 1;
          lightningOpacity -= env.reducedMotion ? 0.11 : 0.07;
        }
      }
    };

    const unsubscribeRaf = subscribeSharedRaf((_time, deltaMs) => {
      if (pausedByVisibility || pausedByViewport) return;

      frameAccumulator += deltaMs;
      if (frameAccumulator < frameInterval) return;

      const elapsed = frameAccumulator;
      frameAccumulator = 0;

      const dtNorm = elapsed / (1000 / 60);
      updateDynamic(dtNorm);

      if (env.isNight) {
        drawStaticLayer(staticCtx as CanvasRenderingContext2D, env, pools, paints);
      }

      renderDynamic();
    });

    return () => {
      unsubscribeRaf();
      observer.disconnect();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [condition, period]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
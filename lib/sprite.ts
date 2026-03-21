// /lib/sprite.ts

export interface SkySprites {
  star: OffscreenCanvas;
  cloudFar: OffscreenCanvas;
  cloudMid: OffscreenCanvas;
  cloudNear: OffscreenCanvas;
  rain: OffscreenCanvas;
  snow: OffscreenCanvas;
  sun: OffscreenCanvas;
  moon: OffscreenCanvas;
}

function makeCanvas(size: number): OffscreenCanvas {
  return new OffscreenCanvas(size, size);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function createStarSprite(size = 20): OffscreenCanvas {
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2D context not available for star sprite");
  }

  const c = size * 0.5;
  const r = size * 0.22;

  const glow = ctx.createRadialGradient(c, c, r * 0.4, c, c, r * 2.6);
  glow.addColorStop(0, "rgba(255,255,255,1)");
  glow.addColorStop(0.5, "rgba(221,235,255,0.68)");
  glow.addColorStop(1, "rgba(160,190,255,0)");

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fillRect(c - 0.6, c - r, 1.2, r * 2);
  ctx.fillRect(c - r, c - 0.6, r * 2, 1.2);

  return canvas;
}

export function createCloudSprite(size = 192, density = 0.65): OffscreenCanvas {
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2D context not available for cloud sprite");
  }

  const d = clamp(density, 0.3, 1);
  const alpha = 0.18 + d * 0.32;

  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
  grad.addColorStop(1, `rgba(210,225,240,${alpha * 0.82})`);

  ctx.fillStyle = grad;

  const p = new Path2D();
  p.moveTo(size * 0.1, size * 0.58);
  p.bezierCurveTo(size * 0.16, size * 0.4, size * 0.28, size * 0.34, size * 0.42, size * 0.42);
  p.bezierCurveTo(size * 0.5, size * 0.26, size * 0.7, size * 0.28, size * 0.75, size * 0.45);
  p.bezierCurveTo(size * 0.9, size * 0.44, size * 0.96, size * 0.58, size * 0.9, size * 0.68);
  p.bezierCurveTo(size * 0.8, size * 0.82, size * 0.26, size * 0.84, size * 0.13, size * 0.7);
  p.closePath();

  ctx.fill(p);

  return canvas;
}

export function createRainSprite(width = 8, height = 28): OffscreenCanvas {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2D context not available for rain sprite");
  }

  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "rgba(175,212,255,0.15)");
  grad.addColorStop(0.5, "rgba(195,225,255,0.8)");
  grad.addColorStop(1, "rgba(175,212,255,0.15)");

  ctx.strokeStyle = grad;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(width * 0.1, 0);
  ctx.lineTo(width * 0.9, height);
  ctx.stroke();

  return canvas;
}

export function createSnowSprite(size = 18): OffscreenCanvas {
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2D context not available for snow sprite");
  }

  const c = size * 0.5;
  const r = size * 0.18;

  const g = ctx.createRadialGradient(c, c, r * 0.2, c, c, r * 2.5);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.5, "rgba(236,245,255,0.9)");
  g.addColorStop(1, "rgba(236,245,255,0)");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(c - r * 1.6, c);
  ctx.lineTo(c + r * 1.6, c);
  ctx.moveTo(c, c - r * 1.6);
  ctx.lineTo(c, c + r * 1.6);
  ctx.moveTo(c - r * 1.2, c - r * 1.2);
  ctx.lineTo(c + r * 1.2, c + r * 1.2);
  ctx.moveTo(c + r * 1.2, c - r * 1.2);
  ctx.lineTo(c - r * 1.2, c + r * 1.2);
  ctx.stroke();

  return canvas;
}

export function createSunSprite(size = 180): OffscreenCanvas {
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2D context not available for sun sprite");
  }

  const c = size * 0.5;
  const r = size * 0.18;

  const halo = ctx.createRadialGradient(c, c, r * 0.7, c, c, r * 3.2);
  halo.addColorStop(0, "rgba(255,242,180,1)");
  halo.addColorStop(0.4, "rgba(255,214,128,0.75)");
  halo.addColorStop(1, "rgba(255,160,80,0)");

  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, size, size);

  return canvas;
}

export function createMoonSprite(size = 160): OffscreenCanvas {
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2D context not available for moon sprite");
  }

  const c = size * 0.5;
  const r = size * 0.16;

  const glow = ctx.createRadialGradient(c, c, r * 0.7, c, c, r * 2.8);
  glow.addColorStop(0, "rgba(242,246,255,0.9)");
  glow.addColorStop(1, "rgba(187,203,232,0)");

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  return canvas;
}

export function createSpriteAtlas(): SkySprites {
  return {
    star: createStarSprite(),
    cloudFar: createCloudSprite(144, 0.45),
    cloudMid: createCloudSprite(176, 0.62),
    cloudNear: createCloudSprite(208, 0.82),
    rain: createRainSprite(),
    snow: createSnowSprite(),
    sun: createSunSprite(),
    moon: createMoonSprite(),
  };
}

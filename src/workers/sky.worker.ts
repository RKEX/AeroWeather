// /workers/sky.worker.ts

import { createSpriteAtlas, type SkySprites } from "../lib/sprite";

type WeatherKind = "clear" | "cloudy" | "rain" | "snow" | "fog" | "storm";

type InitMessage = {
  type: "init";
  canvas: OffscreenCanvas;
  width: number;
  height: number;
  dpr: number;
  weather: WeatherKind;
  mobile: boolean;
  lowEnd: boolean;
  renderScale: number;
};

type ResizeMessage = {
  type: "resize";
  width: number;
  height: number;
  dpr: number;
  renderScale: number;
};

type WeatherMessage = {
  type: "weather";
  weather: WeatherKind;
};

type PauseMessage = {
  type: "pause";
};

type ResumeMessage = {
  type: "resume";
};

type VisibilityMessage = {
  type: "visibility";
  visible: boolean;
};

type WorkerMessage =
  | InitMessage
  | ResizeMessage
  | WeatherMessage
  | PauseMessage
  | ResumeMessage
  | VisibilityMessage;

type SkyKey = "morning" | "day" | "sunset" | "night";
type F32 = Float32Array<ArrayBufferLike>;

const SKY_COLORS: Record<SkyKey, [string, string, string]> = {
  morning: ["#3f2f56", "#e08156", "#ffd7a3"],
  day: ["#2e7cc7", "#67b7f7", "#d8f0ff"],
  sunset: ["#2e204b", "#c25742", "#ffb067"],
  night: ["#040915", "#0e1f38", "#1d2a44"],
};

const LUNAR_MONTH = 29.530588853;
const KNOWN_NEW_MOON_UTC = Date.UTC(2000, 0, 6, 18, 14, 0);

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let sprites: SkySprites | null = null;

let cssWidth = 1;
let cssHeight = 1;
let dpr = 1;
let renderScale = 1;
let mobile = false;
let lowEnd = false;

let weather: WeatherKind = "clear";

let paused = true;
let visible = true;

let targetFps = 60;
let frameIntervalMs = 1000 / 60;

let rafId = 0;
let lastFrameTs = 0;
let avgFrameMs = 16;
let quality = 1;
let minQuality = 0.45;
let maxQuality = 1;
let qualityEvalAt = 0;

let currentHour = 12;
let moonPhase = 0;
let lastClockUpdate = -1;
let skyAIndex = 1;
let skyBIndex = 2;
let skyMix = 0;

let skyTextures: OffscreenCanvas[] = [];
let moonPhaseSprite: OffscreenCanvas | null = null;
let moonPhaseBucket = -1;

let sunX = 0;
let sunY = 0;
let moonX = 0;
let moonY = 0;

let starsCount = 0;
let starsX: F32 = new Float32Array(0);
let starsY: F32 = new Float32Array(0);
let starsSize: F32 = new Float32Array(0);
let starsPhase: F32 = new Float32Array(0);
let starsSpeed: F32 = new Float32Array(0);

let cloudFarCount = 0;
let cloudFarX: F32 = new Float32Array(0);
let cloudFarY: F32 = new Float32Array(0);
let cloudFarScale: F32 = new Float32Array(0);
let cloudFarSpeed: F32 = new Float32Array(0);
let cloudFarOpacity: F32 = new Float32Array(0);

let cloudMidCount = 0;
let cloudMidX: F32 = new Float32Array(0);
let cloudMidY: F32 = new Float32Array(0);
let cloudMidScale: F32 = new Float32Array(0);
let cloudMidSpeed: F32 = new Float32Array(0);
let cloudMidOpacity: F32 = new Float32Array(0);

let cloudNearCount = 0;
let cloudNearX: F32 = new Float32Array(0);
let cloudNearY: F32 = new Float32Array(0);
let cloudNearScale: F32 = new Float32Array(0);
let cloudNearSpeed: F32 = new Float32Array(0);
let cloudNearOpacity: F32 = new Float32Array(0);

let rainCount = 0;
let rainX: F32 = new Float32Array(0);
let rainY: F32 = new Float32Array(0);
let rainVX: F32 = new Float32Array(0);
let rainVY: F32 = new Float32Array(0);
let rainScale: F32 = new Float32Array(0);
let rainAlpha: F32 = new Float32Array(0);

let snowCount = 0;
let snowX: F32 = new Float32Array(0);
let snowY: F32 = new Float32Array(0);
let snowVX: F32 = new Float32Array(0);
let snowVY: F32 = new Float32Array(0);
let snowScale: F32 = new Float32Array(0);
let snowAlpha: F32 = new Float32Array(0);
let snowPhase: F32 = new Float32Array(0);

let fogCount = 0;
let fogX: F32 = new Float32Array(0);
let fogY: F32 = new Float32Array(0);
let fogScale: F32 = new Float32Array(0);
let fogSpeed: F32 = new Float32Array(0);
let fogAlpha: F32 = new Float32Array(0);

let lightningAlpha = 0;
let lightningCooldown = 0;

function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function setTargetFps(): void {
  if (mobile) {
    targetFps = lowEnd ? 24 : 30;
  } else {
    targetFps = 60;
  }
  frameIntervalMs = 1000 / targetFps;
}

function updateTargetFpsFromPerformance(): void {
  if (!mobile) {
    if (avgFrameMs > 24 && targetFps > 45) {
      targetFps = 45;
      frameIntervalMs = 1000 / targetFps;
    } else if (avgFrameMs < 16 && targetFps < 60) {
      targetFps = 60;
      frameIntervalMs = 1000 / targetFps;
    }
    return;
  }

  const desired = avgFrameMs > 25 ? 24 : lowEnd ? 24 : 30;
  if (desired !== targetFps) {
    targetFps = desired;
    frameIntervalMs = 1000 / targetFps;
  }
}

function buildSkyTexture(width: number, height: number, key: SkyKey): OffscreenCanvas {
  const tex = new OffscreenCanvas(width, height);
  const tctx = tex.getContext("2d");
  if (!tctx) {
    throw new Error("2D context not available for sky texture");
  }

  const [top, mid, bottom] = SKY_COLORS[key];
  const g = tctx.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, top);
  g.addColorStop(0.55, mid);
  g.addColorStop(1, bottom);
  tctx.fillStyle = g;
  tctx.fillRect(0, 0, width, height);

  return tex;
}

function rebuildSkyTextures(): void {
  const texW = Math.max(32, Math.floor(cssWidth));
  const texH = Math.max(32, Math.floor(cssHeight));
  skyTextures = [
    buildSkyTexture(texW, texH, "morning"),
    buildSkyTexture(texW, texH, "day"),
    buildSkyTexture(texW, texH, "sunset"),
    buildSkyTexture(texW, texH, "night"),
  ];
}

function moonPhaseAt(timeMs: number): number {
  const days = (timeMs - KNOWN_NEW_MOON_UTC) / 86400000;
  const cycleDays = ((days % LUNAR_MONTH) + LUNAR_MONTH) % LUNAR_MONTH;
  return cycleDays / LUNAR_MONTH;
}

function rebuildMoonPhaseSprite(phase: number): void {
  const size = 220;
  const moon = new OffscreenCanvas(size, size);
  const mctx = moon.getContext("2d");
  if (!mctx) {
    return;
  }

  const c = size * 0.5;
  const r = size * 0.22;

  const base = mctx.createRadialGradient(c, c, r * 0.15, c, c, r * 1.15);
  base.addColorStop(0, "rgba(244,248,255,1)");
  base.addColorStop(1, "rgba(210,224,247,1)");

  mctx.fillStyle = base;
  mctx.beginPath();
  mctx.arc(c, c, r, 0, Math.PI * 2);
  mctx.fill();

  const waxing = phase < 0.5;
  const phaseCurve = Math.cos(phase * Math.PI * 2);
  const shadeOffset = phaseCurve * r;

  mctx.globalCompositeOperation = "destination-out";
  mctx.beginPath();
  if (waxing) {
    mctx.arc(c - shadeOffset, c, r * 1.02, 0, Math.PI * 2);
  } else {
    mctx.arc(c + shadeOffset, c, r * 1.02, 0, Math.PI * 2);
  }
  mctx.fill();
  mctx.globalCompositeOperation = "source-over";

  moonPhaseSprite = moon;
}

function updateClock(nowMs: number): void {
  if (lastClockUpdate > 0 && nowMs - lastClockUpdate < 1000) {
    return;
  }

  const now = new Date();
  currentHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  moonPhase = moonPhaseAt(now.getTime());

  const phaseBucket = Math.floor(moonPhase * 48);
  if (phaseBucket !== moonPhaseBucket) {
    moonPhaseBucket = phaseBucket;
    rebuildMoonPhaseSprite(moonPhase);
  }

  if (currentHour < 9) {
    skyAIndex = 0;
    skyBIndex = 1;
    skyMix = clamp((currentHour - 5) / 4, 0, 1);
  } else if (currentHour < 17) {
    skyAIndex = 1;
    skyBIndex = 2;
    skyMix = clamp((currentHour - 9) / 8, 0, 1);
  } else if (currentHour < 20) {
    skyAIndex = 2;
    skyBIndex = 3;
    skyMix = clamp((currentHour - 17) / 3, 0, 1);
  } else {
    skyAIndex = 3;
    skyBIndex = 0;
    const h = currentHour >= 20 ? currentHour - 20 : currentHour + 4;
    skyMix = clamp(h / 9, 0, 1);
  }

  const tSun = clamp((currentHour - 6) / 12, 0, 1);
  sunX = cssWidth * 0.1 + cssWidth * 0.8 * tSun;
  sunY = cssHeight * 0.9 - Math.sin(tSun * Math.PI) * cssHeight * 0.75;

  const tMoon = currentHour >= 18 ? (currentHour - 18) / 12 : (currentHour + 6) / 12;
  const tMoonClamp = clamp(tMoon, 0, 1);
  moonX = cssWidth * 0.1 + cssWidth * 0.8 * tMoonClamp;
  moonY = cssHeight * 0.9 - Math.sin(tMoonClamp * Math.PI) * cssHeight * 0.68;

  lastClockUpdate = nowMs;
}

function resizeCanvas(width: number, height: number, nextDpr: number, nextRenderScale: number): void {
  if (!canvas) {
    return;
  }

  cssWidth = Math.max(1, Math.floor(width));
  cssHeight = Math.max(1, Math.floor(height));
  dpr = Math.max(0.75, nextDpr);
  renderScale = clamp(nextRenderScale, 0.5, 1);

  const pixelRatio = dpr * renderScale;
  canvas.width = Math.max(1, Math.floor(cssWidth * pixelRatio));
  canvas.height = Math.max(1, Math.floor(cssHeight * pixelRatio));

  if (ctx) {
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
  }

  rebuildSkyTextures();
  rebuildPools();
}

function allocCloudLayer(
  count: number,
  minY: number,
  maxY: number,
  minScale: number,
  maxScale: number,
  minSpeed: number,
  maxSpeed: number,
  minOpacity: number,
  maxOpacity: number,
): [F32, F32, F32, F32, F32] {
  const x: F32 = new Float32Array(count);
  const y: F32 = new Float32Array(count);
  const scale: F32 = new Float32Array(count);
  const speed: F32 = new Float32Array(count);
  const opacity: F32 = new Float32Array(count);

  const widthSpan = cssWidth * 1.4;
  for (let i = 0; i < count; i += 1) {
    x[i] = randomRange(-cssWidth * 0.2, widthSpan);
    y[i] = randomRange(minY, maxY);
    scale[i] = randomRange(minScale, maxScale);
    speed[i] = randomRange(minSpeed, maxSpeed);
    opacity[i] = randomRange(minOpacity, maxOpacity);
  }

  return [x, y, scale, speed, opacity];
}

function rebuildPools(): void {
  const areaScale = Math.max(0.4, Math.min(1.5, (cssWidth * cssHeight) / (1280 * 720)));
  const q = quality;

  starsCount = Math.max(40, Math.floor(180 * areaScale * q));
  starsX = new Float32Array(starsCount);
  starsY = new Float32Array(starsCount);
  starsSize = new Float32Array(starsCount);
  starsPhase = new Float32Array(starsCount);
  starsSpeed = new Float32Array(starsCount);

  for (let i = 0; i < starsCount; i += 1) {
    starsX[i] = Math.random() * cssWidth;
    starsY[i] = Math.random() * cssHeight * 0.72;
    starsSize[i] = randomRange(8, 20);
    starsPhase[i] = randomRange(0, Math.PI * 2);
    starsSpeed[i] = randomRange(0.6, 1.4);
  }

  cloudFarCount = Math.max(8, Math.floor(18 * areaScale * q));
  cloudMidCount = Math.max(6, Math.floor(14 * areaScale * q));
  cloudNearCount = Math.max(4, Math.floor(10 * areaScale * q));

  [cloudFarX, cloudFarY, cloudFarScale, cloudFarSpeed, cloudFarOpacity] = allocCloudLayer(
    cloudFarCount,
    cssHeight * 0.08,
    cssHeight * 0.42,
    0.55,
    1.05,
    6,
    14,
    0.16,
    0.32,
  );

  [cloudMidX, cloudMidY, cloudMidScale, cloudMidSpeed, cloudMidOpacity] = allocCloudLayer(
    cloudMidCount,
    cssHeight * 0.12,
    cssHeight * 0.5,
    0.75,
    1.25,
    12,
    24,
    0.2,
    0.42,
  );

  [cloudNearX, cloudNearY, cloudNearScale, cloudNearSpeed, cloudNearOpacity] = allocCloudLayer(
    cloudNearCount,
    cssHeight * 0.18,
    cssHeight * 0.56,
    0.95,
    1.55,
    20,
    34,
    0.24,
    0.5,
  );

  rainCount = Math.max(40, Math.floor(360 * areaScale * q));
  rainX = new Float32Array(rainCount);
  rainY = new Float32Array(rainCount);
  rainVX = new Float32Array(rainCount);
  rainVY = new Float32Array(rainCount);
  rainScale = new Float32Array(rainCount);
  rainAlpha = new Float32Array(rainCount);

  for (let i = 0; i < rainCount; i += 1) {
    rainX[i] = Math.random() * cssWidth;
    rainY[i] = randomRange(-cssHeight, cssHeight);
    rainVX[i] = randomRange(-70, -38);
    rainVY[i] = randomRange(520, 760);
    rainScale[i] = randomRange(0.65, 1.18);
    rainAlpha[i] = randomRange(0.25, 0.75);
  }

  snowCount = Math.max(28, Math.floor(180 * areaScale * q));
  snowX = new Float32Array(snowCount);
  snowY = new Float32Array(snowCount);
  snowVX = new Float32Array(snowCount);
  snowVY = new Float32Array(snowCount);
  snowScale = new Float32Array(snowCount);
  snowAlpha = new Float32Array(snowCount);
  snowPhase = new Float32Array(snowCount);

  for (let i = 0; i < snowCount; i += 1) {
    snowX[i] = Math.random() * cssWidth;
    snowY[i] = randomRange(-cssHeight, cssHeight);
    snowVX[i] = randomRange(10, 28);
    snowVY[i] = randomRange(40, 95);
    snowScale[i] = randomRange(0.6, 1.35);
    snowAlpha[i] = randomRange(0.45, 0.95);
    snowPhase[i] = randomRange(0, Math.PI * 2);
  }

  fogCount = Math.max(10, Math.floor(40 * areaScale * q));
  fogX = new Float32Array(fogCount);
  fogY = new Float32Array(fogCount);
  fogScale = new Float32Array(fogCount);
  fogSpeed = new Float32Array(fogCount);
  fogAlpha = new Float32Array(fogCount);

  for (let i = 0; i < fogCount; i += 1) {
    fogX[i] = randomRange(-cssWidth * 0.3, cssWidth * 1.3);
    fogY[i] = randomRange(cssHeight * 0.3, cssHeight * 0.9);
    fogScale[i] = randomRange(1.3, 2.8);
    fogSpeed[i] = randomRange(6, 18);
    fogAlpha[i] = randomRange(0.08, 0.26);
  }
}

function updateQuality(nowTs: number): void {
  if (nowTs - qualityEvalAt < 2000) {
    return;
  }

  qualityEvalAt = nowTs;

  if (avgFrameMs > 25 && quality > minQuality) {
    quality = Math.max(minQuality, quality - 0.1);
    rebuildPools();
  } else if (avgFrameMs < 16 && quality < maxQuality) {
    quality = Math.min(maxQuality, quality + 0.05);
    rebuildPools();
  }

  updateTargetFpsFromPerformance();
}

function updateStars(dt: number): void {
  for (let i = 0; i < starsCount; i += 1) {
    starsPhase[i] += starsSpeed[i] * dt;
  }
}

function updateCloudLayer(
  count: number,
  x: F32,
  speed: F32,
  dt: number,
): void {
  const resetX = -cssWidth * 0.36;
  const maxX = cssWidth * 1.35;

  for (let i = 0; i < count; i += 1) {
    x[i] += speed[i] * dt;
    if (x[i] > maxX) {
      x[i] = resetX;
    }
  }
}

function updateRain(dt: number): void {
  const maxY = cssHeight + 40;
  const maxX = cssWidth + 80;

  for (let i = 0; i < rainCount; i += 1) {
    rainX[i] += rainVX[i] * dt;
    rainY[i] += rainVY[i] * dt;

    if (rainY[i] > maxY || rainX[i] < -80) {
      rainX[i] = Math.random() * maxX;
      rainY[i] = randomRange(-cssHeight, -20);
    }
  }
}

function updateSnow(dt: number): void {
  const maxY = cssHeight + 24;

  for (let i = 0; i < snowCount; i += 1) {
    snowPhase[i] += dt * 1.4;
    snowX[i] += (snowVX[i] + Math.sin(snowPhase[i]) * 22) * dt;
    snowY[i] += snowVY[i] * dt;

    if (snowY[i] > maxY) {
      snowY[i] = randomRange(-120, -8);
      snowX[i] = Math.random() * cssWidth;
    }
    if (snowX[i] > cssWidth + 12) {
      snowX[i] = -12;
    }
    if (snowX[i] < -12) {
      snowX[i] = cssWidth + 12;
    }
  }
}

function updateFog(dt: number): void {
  const maxX = cssWidth * 1.35;
  const resetX = -cssWidth * 0.4;

  for (let i = 0; i < fogCount; i += 1) {
    fogX[i] += fogSpeed[i] * dt;
    if (fogX[i] > maxX) {
      fogX[i] = resetX;
    }
  }
}

function updateStormEffects(dt: number): void {
  if (weather !== "storm") {
    lightningAlpha = 0;
    lightningCooldown = 0;
    return;
  }

  lightningCooldown -= dt;
  if (lightningCooldown <= 0) {
    if (Math.random() < 0.06) {
      lightningAlpha = randomRange(0.65, 0.95);
      lightningCooldown = randomRange(2.2, 5.4);
    } else {
      lightningCooldown = randomRange(0.4, 1.2);
    }
  }

  lightningAlpha = Math.max(0, lightningAlpha - dt * 2.8);
}

function update(dt: number, nowTs: number): void {
  updateClock(nowTs);

  updateStars(dt);
  updateCloudLayer(cloudFarCount, cloudFarX, cloudFarSpeed, dt);
  updateCloudLayer(cloudMidCount, cloudMidX, cloudMidSpeed, dt);
  updateCloudLayer(cloudNearCount, cloudNearX, cloudNearSpeed, dt);

  if (weather === "rain" || weather === "storm") {
    updateRain(dt);
  }

  if (weather === "snow") {
    updateSnow(dt);
  }

  if (weather === "fog") {
    updateFog(dt);
  }

  updateStormEffects(dt);
  updateQuality(nowTs);
}

function drawCloudLayer(
  sprite: OffscreenCanvas,
  count: number,
  x: F32,
  y: F32,
  scale: F32,
  opacity: F32,
  tintBoost: number,
): void {
  if (!ctx) {
    return;
  }

  const baseW = sprite.width;
  const baseH = sprite.height;

  for (let i = 0; i < count; i += 1) {
    const w = baseW * scale[i];
    const h = baseH * scale[i] * 0.55;
    ctx.globalAlpha = clamp(opacity[i] + tintBoost, 0.02, 0.95);
    ctx.drawImage(sprite, x[i], y[i], w, h);
  }
  ctx.globalAlpha = 1;
}

function drawStars(nowTs: number): void {
  if (!ctx || !sprites) {
    return;
  }

  const hourWrapped = currentHour >= 24 ? currentHour - 24 : currentHour;
  const nightFactor =
    hourWrapped >= 19 || hourWrapped <= 5
      ? 1
      : hourWrapped < 7
        ? clamp((7 - hourWrapped) / 2, 0, 1)
        : clamp((hourWrapped - 17) / 2, 0, 1);

  if (nightFactor <= 0.01) {
    return;
  }

  const twinkleTime = nowTs * 0.001;
  const sprite = sprites.star;

  for (let i = 0; i < starsCount; i += 1) {
    const twinkle = 0.45 + 0.55 * Math.sin(starsPhase[i] + twinkleTime * starsSpeed[i]);
    ctx.globalAlpha = twinkle * nightFactor;
    const size = starsSize[i];
    ctx.drawImage(sprite, starsX[i] - size * 0.5, starsY[i] - size * 0.5, size, size);
  }
  ctx.globalAlpha = 1;
}

function drawSunAndMoon(): void {
  if (!ctx || !sprites) {
    return;
  }

  const sunVisible = currentHour >= 5.5 && currentHour <= 19;
  if (sunVisible) {
    const sunSize = cssWidth * 0.18;
    ctx.globalAlpha = 0.98;
    ctx.drawImage(sprites.sun, sunX - sunSize * 0.5, sunY - sunSize * 0.5, sunSize, sunSize);
  }

  const moonVisible = currentHour >= 18 || currentHour <= 6.5;
  if (moonVisible && moonPhaseSprite) {
    const moonSize = cssWidth * 0.14;
    ctx.globalAlpha = 0.9;
    ctx.drawImage(
      sprites.moon,
      moonX - moonSize * 0.62,
      moonY - moonSize * 0.62,
      moonSize * 1.24,
      moonSize * 1.24,
    );
    ctx.globalAlpha = 0.95;
    ctx.drawImage(
      moonPhaseSprite,
      moonX - moonSize * 0.5,
      moonY - moonSize * 0.5,
      moonSize,
      moonSize,
    );
  }

  ctx.globalAlpha = 1;
}

function drawRain(): void {
  if (!ctx || !sprites) {
    return;
  }

  const sprite = sprites.rain;
  const sw = sprite.width;
  const sh = sprite.height;

  for (let i = 0; i < rainCount; i += 1) {
    const scale = rainScale[i];
    const w = sw * scale;
    const h = sh * scale;
    ctx.globalAlpha = rainAlpha[i];
    ctx.drawImage(sprite, rainX[i], rainY[i], w, h);
  }

  ctx.globalAlpha = 1;
}

function drawSnow(): void {
  if (!ctx || !sprites) {
    return;
  }

  const sprite = sprites.snow;
  const sw = sprite.width;
  const sh = sprite.height;

  for (let i = 0; i < snowCount; i += 1) {
    const scale = snowScale[i];
    const w = sw * scale;
    const h = sh * scale;
    ctx.globalAlpha = snowAlpha[i];
    ctx.drawImage(sprite, snowX[i] - w * 0.5, snowY[i] - h * 0.5, w, h);
  }

  ctx.globalAlpha = 1;
}

function drawFog(): void {
  if (!ctx || !sprites) {
    return;
  }

  const sprite = sprites.cloudFar;
  const sw = sprite.width;
  const sh = sprite.height;

  for (let i = 0; i < fogCount; i += 1) {
    const s = fogScale[i];
    const w = sw * s;
    const h = sh * s * 0.55;
    ctx.globalAlpha = fogAlpha[i];
    ctx.drawImage(sprite, fogX[i], fogY[i], w, h);
  }

  ctx.globalAlpha = 1;
}

function drawWeatherTint(): void {
  if (!ctx) {
    return;
  }

  if (weather === "cloudy") {
    ctx.fillStyle = "rgba(150,170,195,0.09)";
    ctx.fillRect(0, 0, cssWidth, cssHeight);
  } else if (weather === "rain") {
    ctx.fillStyle = "rgba(85,106,138,0.16)";
    ctx.fillRect(0, 0, cssWidth, cssHeight);
  } else if (weather === "snow") {
    ctx.fillStyle = "rgba(225,236,249,0.11)";
    ctx.fillRect(0, 0, cssWidth, cssHeight);
  } else if (weather === "fog") {
    ctx.fillStyle = "rgba(196,210,224,0.2)";
    ctx.fillRect(0, 0, cssWidth, cssHeight);
  } else if (weather === "storm") {
    ctx.fillStyle = "rgba(54,72,103,0.22)";
    ctx.fillRect(0, 0, cssWidth, cssHeight);
  }
}

function render(nowTs: number): void {
  if (!ctx || !sprites || skyTextures.length !== 4) {
    return;
  }

  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, cssWidth, cssHeight);

  ctx.drawImage(skyTextures[skyAIndex], 0, 0, cssWidth, cssHeight);
  if (skyMix > 0.0001) {
    ctx.globalAlpha = skyMix;
    ctx.drawImage(skyTextures[skyBIndex], 0, 0, cssWidth, cssHeight);
    ctx.globalAlpha = 1;
  }

  drawStars(nowTs);
  drawSunAndMoon();

  const cloudTint = weather === "storm" ? 0.2 : weather === "cloudy" ? 0.12 : 0;
  drawCloudLayer(sprites.cloudFar, cloudFarCount, cloudFarX, cloudFarY, cloudFarScale, cloudFarOpacity, cloudTint);
  drawCloudLayer(sprites.cloudMid, cloudMidCount, cloudMidX, cloudMidY, cloudMidScale, cloudMidOpacity, cloudTint);
  drawCloudLayer(
    sprites.cloudNear,
    cloudNearCount,
    cloudNearX,
    cloudNearY,
    cloudNearScale,
    cloudNearOpacity,
    cloudTint,
  );

  if (weather === "rain" || weather === "storm") {
    drawRain();
  }

  if (weather === "snow") {
    drawSnow();
  }

  if (weather === "fog") {
    drawFog();
  }

  drawWeatherTint();

  if (weather === "storm" && lightningAlpha > 0) {
    ctx.globalAlpha = lightningAlpha;
    ctx.fillStyle = "rgba(230,240,255,1)";
    ctx.fillRect(0, 0, cssWidth, cssHeight);
    ctx.globalAlpha = 1;
  }
}

function rafLoop(ts: number): void {
  if (lastFrameTs === 0) {
    lastFrameTs = ts;
  }

  rafId = self.requestAnimationFrame(rafLoop);

  if (paused || !visible) {
    lastFrameTs = ts;
    return;
  }

  const elapsed = ts - lastFrameTs;
  if (elapsed < frameIntervalMs) {
    return;
  }

  lastFrameTs = ts;

  const dt = Math.min(0.05, elapsed * 0.001);
  update(dt, ts);
  render(ts);

  avgFrameMs = avgFrameMs * 0.92 + elapsed * 0.08;
}

function startLoop(): void {
  if (rafId !== 0) {
    self.cancelAnimationFrame(rafId);
    rafId = 0;
  }
  lastFrameTs = 0;
  rafId = self.requestAnimationFrame(rafLoop);
}

function handleInit(msg: InitMessage): void {
  canvas = msg.canvas;
  weather = msg.weather;
  mobile = msg.mobile;
  lowEnd = msg.lowEnd;
  renderScale = msg.renderScale;

  ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: true,
  });

  if (!ctx) {
    throw new Error("Unable to initialize 2D context for sky worker");
  }

  sprites = createSpriteAtlas();
  minQuality = lowEnd ? 0.4 : mobile ? 0.5 : 0.6;
  maxQuality = 1;
  quality = lowEnd ? 0.72 : mobile ? 0.86 : 1;

  setTargetFps();
  resizeCanvas(msg.width, msg.height, msg.dpr, msg.renderScale);

  paused = false;
  visible = true;
  qualityEvalAt = 0;

  updateClock(performance.now());
  rebuildMoonPhaseSprite(moonPhase);
  startLoop();
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const msg = event.data;

  switch (msg.type) {
    case "init": {
      handleInit(msg);
      break;
    }
    case "resize": {
      resizeCanvas(msg.width, msg.height, msg.dpr, msg.renderScale);
      break;
    }
    case "weather": {
      weather = msg.weather;
      break;
    }
    case "pause": {
      paused = true;
      break;
    }
    case "resume": {
      paused = false;
      break;
    }
    case "visibility": {
      visible = msg.visible;
      break;
    }
    default: {
      const neverMessage: never = msg;
      void neverMessage;
    }
  }
};

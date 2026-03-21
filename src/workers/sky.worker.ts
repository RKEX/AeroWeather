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
  timezone?: string;
};

type ResizeMessage   = { type: "resize"; width: number; height: number; dpr: number; renderScale: number };
type WeatherMessage  = { type: "weather"; weather: WeatherKind };
type TimezoneMessage = { type: "timezone"; timezone: string }; // ✅ নতুন
type PauseMessage    = { type: "pause" };
type ResumeMessage   = { type: "resume" };
type VisibilityMessage = { type: "visibility"; visible: boolean };

type WorkerMessage = InitMessage | ResizeMessage | WeatherMessage | TimezoneMessage | PauseMessage | ResumeMessage | VisibilityMessage;

type SkyKey = "morning" | "day" | "sunset" | "night";
type F32 = Float32Array<ArrayBufferLike>;

const SKY_COLORS: Record<SkyKey, [string, string, string]> = {
  morning: ["#3f2f56", "#e08156", "#ffd7a3"],
  day:     ["#2e7cc7", "#67b7f7", "#d8f0ff"],
  sunset:  ["#2e204b", "#c25742", "#ffb067"],
  night:   ["#040915", "#0e1f38", "#1d2a44"],
};

const LUNAR_MONTH = 29.530588853;
const KNOWN_NEW_MOON_UTC = Date.UTC(2000, 0, 6, 18, 14, 0);

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let sprites: SkySprites | null = null;

let cssWidth = 1, cssHeight = 1, dpr = 1, renderScale = 1;
let mobile = false, lowEnd = false;
let weather: WeatherKind = "clear";
let locationTimezone = ""; // ✅ location timezone

let paused = true, visible = true;
let targetFps = 60, frameIntervalMs = 1000 / 60;
let rafId = 0, lastFrameTs = 0, avgFrameMs = 16;
let quality = 1, minQuality = 0.45, maxQuality = 1, qualityEvalAt = 0;

let currentHour = 12, moonPhase = 0, lastClockUpdate = -1;
let skyAIndex = 1, skyBIndex = 2, skyMix = 0;
let skyTextures: OffscreenCanvas[] = [];
let moonPhaseSprite: OffscreenCanvas | null = null, moonPhaseBucket = -1;
let sunX = 0, sunY = 0, moonX = 0, moonY = 0;

let starsCount = 0;
let starsX: F32 = new Float32Array(0), starsY: F32 = new Float32Array(0);
let starsSize: F32 = new Float32Array(0), starsPhase: F32 = new Float32Array(0), starsSpeed: F32 = new Float32Array(0);

let cloudFarCount = 0, cloudMidCount = 0, cloudNearCount = 0;
let cloudFarX: F32 = new Float32Array(0), cloudFarY: F32 = new Float32Array(0);
let cloudFarScale: F32 = new Float32Array(0), cloudFarSpeed: F32 = new Float32Array(0), cloudFarOpacity: F32 = new Float32Array(0);
let cloudMidX: F32 = new Float32Array(0), cloudMidY: F32 = new Float32Array(0);
let cloudMidScale: F32 = new Float32Array(0), cloudMidSpeed: F32 = new Float32Array(0), cloudMidOpacity: F32 = new Float32Array(0);
let cloudNearX: F32 = new Float32Array(0), cloudNearY: F32 = new Float32Array(0);
let cloudNearScale: F32 = new Float32Array(0), cloudNearSpeed: F32 = new Float32Array(0), cloudNearOpacity: F32 = new Float32Array(0);

let rainCount = 0;
let rainX: F32 = new Float32Array(0), rainY: F32 = new Float32Array(0);
let rainVX: F32 = new Float32Array(0), rainVY: F32 = new Float32Array(0);
let rainScale: F32 = new Float32Array(0), rainAlpha: F32 = new Float32Array(0);

let snowCount = 0;
let snowX: F32 = new Float32Array(0), snowY: F32 = new Float32Array(0);
let snowVX: F32 = new Float32Array(0), snowVY: F32 = new Float32Array(0);
let snowScale: F32 = new Float32Array(0), snowAlpha: F32 = new Float32Array(0), snowPhase: F32 = new Float32Array(0);

let fogCount = 0;
let fogX: F32 = new Float32Array(0), fogY: F32 = new Float32Array(0);
let fogScale: F32 = new Float32Array(0), fogSpeed: F32 = new Float32Array(0), fogAlpha: F32 = new Float32Array(0);

let lightningAlpha = 0, lightningCooldown = 0;

function randomRange(min: number, max: number) { return min + Math.random() * (max - min); }
function clamp(v: number, min: number, max: number) { return Math.min(max, Math.max(min, v)); }

function setTargetFps() {
  targetFps = mobile ? (lowEnd ? 24 : 30) : 60;
  frameIntervalMs = 1000 / targetFps;
}

function updateTargetFpsFromPerformance() {
  if (!mobile) {
    if (avgFrameMs > 24 && targetFps > 45) { targetFps = 45; frameIntervalMs = 1000 / 45; }
    else if (avgFrameMs < 16 && targetFps < 60) { targetFps = 60; frameIntervalMs = 1000 / 60; }
    return;
  }
  const desired = avgFrameMs > 25 ? 24 : lowEnd ? 24 : 30;
  if (desired !== targetFps) { targetFps = desired; frameIntervalMs = 1000 / desired; }
}

function buildSkyTexture(w: number, h: number, key: SkyKey): OffscreenCanvas {
  const tex = new OffscreenCanvas(w, h);
  const tctx = tex.getContext("2d")!;
  const [top, mid, bot] = SKY_COLORS[key];
  const g = tctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, top); g.addColorStop(0.55, mid); g.addColorStop(1, bot);
  tctx.fillStyle = g; tctx.fillRect(0, 0, w, h);
  return tex;
}

function rebuildSkyTextures() {
  const w = Math.max(32, Math.floor(cssWidth));
  const h = Math.max(32, Math.floor(cssHeight));
  skyTextures = [
    buildSkyTexture(w, h, "morning"),
    buildSkyTexture(w, h, "day"),
    buildSkyTexture(w, h, "sunset"),
    buildSkyTexture(w, h, "night"),
  ];
}

function moonPhaseAt(ms: number) {
  const days = (ms - KNOWN_NEW_MOON_UTC) / 86400000;
  return (((days % LUNAR_MONTH) + LUNAR_MONTH) % LUNAR_MONTH) / LUNAR_MONTH;
}

function rebuildMoonPhaseSprite(phase: number) {
  const size = 220, moon = new OffscreenCanvas(size, size);
  const mctx = moon.getContext("2d"); if (!mctx) return;
  const c = size * 0.5, r = size * 0.22;
  const base = mctx.createRadialGradient(c, c, r * 0.15, c, c, r * 1.15);
  base.addColorStop(0, "rgba(244,248,255,1)"); base.addColorStop(1, "rgba(210,224,247,1)");
  mctx.fillStyle = base; mctx.beginPath(); mctx.arc(c, c, r, 0, Math.PI * 2); mctx.fill();
  const phaseCurve = Math.cos(phase * Math.PI * 2);
  const shadeOffset = phaseCurve * r;
  mctx.globalCompositeOperation = "destination-out"; mctx.beginPath();
  if (phase < 0.5) { mctx.arc(c - shadeOffset, c, r * 1.02, 0, Math.PI * 2); }
  else             { mctx.arc(c + shadeOffset, c, r * 1.02, 0, Math.PI * 2); }
  mctx.fill(); mctx.globalCompositeOperation = "source-over";
  moonPhaseSprite = moon;
}

// ✅ KEY FIX: location timezone অনুযায়ী hour বের করো
function getLocationHour(): number {
  if (locationTimezone) {
    try {
      const locStr = new Date().toLocaleString("en-US", { timeZone: locationTimezone });
      const d = new Date(locStr);
      return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
    } catch { /* fallback */ }
  }
  const now = new Date();
  return now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
}

function updateClock(nowMs: number) {
  if (lastClockUpdate > 0 && nowMs - lastClockUpdate < 1000) return;

  // ✅ location time use করো
  currentHour = getLocationHour();
  moonPhase = moonPhaseAt(Date.now());

  const phaseBucket = Math.floor(moonPhase * 48);
  if (phaseBucket !== moonPhaseBucket) { moonPhaseBucket = phaseBucket; rebuildMoonPhaseSprite(moonPhase); }

  if (currentHour < 9)       { skyAIndex = 0; skyBIndex = 1; skyMix = clamp((currentHour - 5) / 4, 0, 1); }
  else if (currentHour < 17) { skyAIndex = 1; skyBIndex = 2; skyMix = clamp((currentHour - 9) / 8, 0, 1); }
  else if (currentHour < 20) { skyAIndex = 2; skyBIndex = 3; skyMix = clamp((currentHour - 17) / 3, 0, 1); }
  else                       { skyAIndex = 3; skyBIndex = 0; const h = currentHour >= 20 ? currentHour - 20 : currentHour + 4; skyMix = clamp(h / 9, 0, 1); }

  const tSun = clamp((currentHour - 6) / 12, 0, 1);
  sunX = cssWidth * 0.1 + cssWidth * 0.8 * tSun;
  sunY = cssHeight * 0.9 - Math.sin(tSun * Math.PI) * cssHeight * 0.75;

  const tMoon = currentHour >= 18 ? (currentHour - 18) / 12 : (currentHour + 6) / 12;
  const tMoonC = clamp(tMoon, 0, 1);
  moonX = cssWidth * 0.1 + cssWidth * 0.8 * tMoonC;
  moonY = cssHeight * 0.9 - Math.sin(tMoonC * Math.PI) * cssHeight * 0.68;

  lastClockUpdate = nowMs;
}

function resizeCanvas(w: number, h: number, nextDpr: number, nextRenderScale: number) {
  if (!canvas) return;
  cssWidth = Math.max(1, Math.floor(w)); cssHeight = Math.max(1, Math.floor(h));
  dpr = Math.max(0.75, nextDpr); renderScale = clamp(nextRenderScale, 0.5, 1);
  const pr = dpr * renderScale;
  canvas.width = Math.max(1, Math.floor(cssWidth * pr));
  canvas.height = Math.max(1, Math.floor(cssHeight * pr));
  if (ctx) { ctx.setTransform(pr, 0, 0, pr, 0, 0); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high"; }
  rebuildSkyTextures(); rebuildPools();
}

function allocCloudLayer(count: number, minY: number, maxY: number, minSc: number, maxSc: number, minSp: number, maxSp: number, minOp: number, maxOp: number): [F32, F32, F32, F32, F32] {
  const x = new Float32Array(count), y = new Float32Array(count);
  const scale = new Float32Array(count), speed = new Float32Array(count), opacity = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    x[i] = randomRange(-cssWidth * 0.2, cssWidth * 1.4); y[i] = randomRange(minY, maxY);
    scale[i] = randomRange(minSc, maxSc); speed[i] = randomRange(minSp, maxSp); opacity[i] = randomRange(minOp, maxOp);
  }
  return [x, y, scale, speed, opacity];
}

function rebuildPools() {
  const areaScale = Math.max(0.4, Math.min(1.5, (cssWidth * cssHeight) / (1280 * 720)));
  const q = quality;

  starsCount = Math.max(40, Math.floor(180 * areaScale * q));
  starsX = new Float32Array(starsCount); starsY = new Float32Array(starsCount);
  starsSize = new Float32Array(starsCount); starsPhase = new Float32Array(starsCount); starsSpeed = new Float32Array(starsCount);
  for (let i = 0; i < starsCount; i++) {
    starsX[i] = Math.random() * cssWidth; starsY[i] = Math.random() * cssHeight * 0.72;
    starsSize[i] = randomRange(8, 20); starsPhase[i] = randomRange(0, Math.PI * 2); starsSpeed[i] = randomRange(0.6, 1.4);
  }

  cloudFarCount = Math.max(8, Math.floor(18 * areaScale * q));
  cloudMidCount = Math.max(6, Math.floor(14 * areaScale * q));
  cloudNearCount = Math.max(4, Math.floor(10 * areaScale * q));

  [cloudFarX, cloudFarY, cloudFarScale, cloudFarSpeed, cloudFarOpacity]   = allocCloudLayer(cloudFarCount,  cssHeight*0.08, cssHeight*0.42, 0.55,1.05, 6,14,  0.16,0.32);
  [cloudMidX, cloudMidY, cloudMidScale, cloudMidSpeed, cloudMidOpacity]   = allocCloudLayer(cloudMidCount,  cssHeight*0.12, cssHeight*0.5,  0.75,1.25, 12,24, 0.2,0.42);
  [cloudNearX,cloudNearY,cloudNearScale,cloudNearSpeed,cloudNearOpacity]  = allocCloudLayer(cloudNearCount, cssHeight*0.18, cssHeight*0.56, 0.95,1.55, 20,34, 0.24,0.5);

  rainCount = Math.max(40, Math.floor(360 * areaScale * q));
  rainX = new Float32Array(rainCount); rainY = new Float32Array(rainCount);
  rainVX = new Float32Array(rainCount); rainVY = new Float32Array(rainCount);
  rainScale = new Float32Array(rainCount); rainAlpha = new Float32Array(rainCount);
  for (let i = 0; i < rainCount; i++) {
    rainX[i] = Math.random()*cssWidth; rainY[i] = randomRange(-cssHeight,cssHeight);
    rainVX[i] = randomRange(-70,-38); rainVY[i] = randomRange(520,760);
    rainScale[i] = randomRange(0.65,1.18); rainAlpha[i] = randomRange(0.25,0.75);
  }

  snowCount = Math.max(28, Math.floor(180 * areaScale * q));
  snowX = new Float32Array(snowCount); snowY = new Float32Array(snowCount);
  snowVX = new Float32Array(snowCount); snowVY = new Float32Array(snowCount);
  snowScale = new Float32Array(snowCount); snowAlpha = new Float32Array(snowCount); snowPhase = new Float32Array(snowCount);
  for (let i = 0; i < snowCount; i++) {
    snowX[i] = Math.random()*cssWidth; snowY[i] = randomRange(-cssHeight,cssHeight);
    snowVX[i] = randomRange(10,28); snowVY[i] = randomRange(40,95);
    snowScale[i] = randomRange(0.6,1.35); snowAlpha[i] = randomRange(0.45,0.95); snowPhase[i] = randomRange(0,Math.PI*2);
  }

  fogCount = Math.max(10, Math.floor(40 * areaScale * q));
  fogX = new Float32Array(fogCount); fogY = new Float32Array(fogCount);
  fogScale = new Float32Array(fogCount); fogSpeed = new Float32Array(fogCount); fogAlpha = new Float32Array(fogCount);
  for (let i = 0; i < fogCount; i++) {
    fogX[i] = randomRange(-cssWidth*0.3,cssWidth*1.3); fogY[i] = randomRange(cssHeight*0.3,cssHeight*0.9);
    fogScale[i] = randomRange(1.3,2.8); fogSpeed[i] = randomRange(6,18); fogAlpha[i] = randomRange(0.08,0.26);
  }
}

function updateQuality(nowTs: number) {
  if (nowTs - qualityEvalAt < 2000) return;
  qualityEvalAt = nowTs;
  if (avgFrameMs > 25 && quality > minQuality) { quality = Math.max(minQuality, quality - 0.1); rebuildPools(); }
  else if (avgFrameMs < 16 && quality < maxQuality) { quality = Math.min(maxQuality, quality + 0.05); rebuildPools(); }
  updateTargetFpsFromPerformance();
}

function updateStars(dt: number) { for (let i = 0; i < starsCount; i++) starsPhase[i] += starsSpeed[i] * dt; }

function updateCloudLayer(count: number, x: F32, speed: F32, dt: number) {
  const resetX = -cssWidth * 0.36, maxX = cssWidth * 1.35;
  for (let i = 0; i < count; i++) { x[i] += speed[i] * dt; if (x[i] > maxX) x[i] = resetX; }
}

function updateRain(dt: number) {
  const maxY = cssHeight + 40, maxX = cssWidth + 80;
  for (let i = 0; i < rainCount; i++) {
    rainX[i] += rainVX[i] * dt; rainY[i] += rainVY[i] * dt;
    if (rainY[i] > maxY || rainX[i] < -80) { rainX[i] = Math.random() * maxX; rainY[i] = randomRange(-cssHeight, -20); }
  }
}

function updateSnow(dt: number) {
  const maxY = cssHeight + 24;
  for (let i = 0; i < snowCount; i++) {
    snowPhase[i] += dt * 1.4;
    snowX[i] += (snowVX[i] + Math.sin(snowPhase[i]) * 22) * dt; snowY[i] += snowVY[i] * dt;
    if (snowY[i] > maxY) { snowY[i] = randomRange(-120,-8); snowX[i] = Math.random()*cssWidth; }
    if (snowX[i] > cssWidth+12) snowX[i] = -12;
    if (snowX[i] < -12) snowX[i] = cssWidth+12;
  }
}

function updateFog(dt: number) {
  const maxX = cssWidth*1.35, resetX = -cssWidth*0.4;
  for (let i = 0; i < fogCount; i++) { fogX[i] += fogSpeed[i]*dt; if (fogX[i] > maxX) fogX[i] = resetX; }
}

function updateStormEffects(dt: number) {
  if (weather !== "storm") { lightningAlpha = 0; lightningCooldown = 0; return; }
  lightningCooldown -= dt;
  if (lightningCooldown <= 0) {
    if (Math.random() < 0.06) { lightningAlpha = randomRange(0.65,0.95); lightningCooldown = randomRange(2.2,5.4); }
    else lightningCooldown = randomRange(0.4,1.2);
  }
  lightningAlpha = Math.max(0, lightningAlpha - dt * 2.8);
}

function update(dt: number, nowTs: number) {
  updateClock(nowTs);
  updateStars(dt);
  updateCloudLayer(cloudFarCount, cloudFarX, cloudFarSpeed, dt);
  updateCloudLayer(cloudMidCount, cloudMidX, cloudMidSpeed, dt);
  updateCloudLayer(cloudNearCount, cloudNearX, cloudNearSpeed, dt);
  if (weather === "rain" || weather === "storm") updateRain(dt);
  if (weather === "snow") updateSnow(dt);
  if (weather === "fog") updateFog(dt);
  updateStormEffects(dt);
  updateQuality(nowTs);
}

function drawCloudLayer(sprite: OffscreenCanvas, count: number, x: F32, y: F32, scale: F32, opacity: F32, tintBoost: number) {
  if (!ctx) return;
  const bw = sprite.width, bh = sprite.height;
  for (let i = 0; i < count; i++) {
    ctx.globalAlpha = clamp(opacity[i]+tintBoost,0.02,0.95);
    ctx.drawImage(sprite, x[i], y[i], bw*scale[i], bh*scale[i]*0.55);
  }
  ctx.globalAlpha = 1;
}

function drawStars(nowTs: number) {
  if (!ctx || !sprites) return;
  const hw = currentHour >= 24 ? currentHour - 24 : currentHour;
  const nf = hw >= 19 || hw <= 5 ? 1 : hw < 7 ? clamp((7-hw)/2,0,1) : clamp((hw-17)/2,0,1);
  if (nf <= 0.01) return;
  const tt = nowTs*0.001;
  const sprite = sprites.star;
  for (let i = 0; i < starsCount; i++) {
    const tw = 0.45 + 0.55 * Math.sin(starsPhase[i] + tt*starsSpeed[i]);
    ctx.globalAlpha = tw*nf;
    const sz = starsSize[i];
    ctx.drawImage(sprite, starsX[i]-sz*0.5, starsY[i]-sz*0.5, sz, sz);
  }
  ctx.globalAlpha = 1;
}

function drawSunAndMoon() {
  if (!ctx || !sprites) return;
  if (currentHour >= 5.5 && currentHour <= 19) {
    const sz = cssWidth*0.18; ctx.globalAlpha = 0.98;
    ctx.drawImage(sprites.sun, sunX-sz*0.5, sunY-sz*0.5, sz, sz);
  }
  if ((currentHour >= 18 || currentHour <= 6.5) && moonPhaseSprite) {
    const sz = cssWidth*0.14; ctx.globalAlpha = 0.9;
    ctx.drawImage(sprites.moon, moonX-sz*0.62, moonY-sz*0.62, sz*1.24, sz*1.24);
    ctx.globalAlpha = 0.95;
    ctx.drawImage(moonPhaseSprite, moonX-sz*0.5, moonY-sz*0.5, sz, sz);
  }
  ctx.globalAlpha = 1;
}

function drawRain() {
  if (!ctx||!sprites) return;
  const sp=sprites.rain, sw=sp.width, sh=sp.height;
  for (let i=0;i<rainCount;i++) { ctx.globalAlpha=rainAlpha[i]; ctx.drawImage(sp,rainX[i],rainY[i],sw*rainScale[i],sh*rainScale[i]); }
  ctx.globalAlpha=1;
}

function drawSnow() {
  if (!ctx||!sprites) return;
  const sp=sprites.snow, sw=sp.width, sh=sp.height;
  for (let i=0;i<snowCount;i++) { ctx.globalAlpha=snowAlpha[i]; ctx.drawImage(sp,snowX[i]-sw*snowScale[i]*0.5,snowY[i]-sh*snowScale[i]*0.5,sw*snowScale[i],sh*snowScale[i]); }
  ctx.globalAlpha=1;
}

function drawFog() {
  if (!ctx||!sprites) return;
  const sp=sprites.cloudFar, sw=sp.width, sh=sp.height;
  for (let i=0;i<fogCount;i++) { ctx.globalAlpha=fogAlpha[i]; ctx.drawImage(sp,fogX[i],fogY[i],sw*fogScale[i],sh*fogScale[i]*0.55); }
  ctx.globalAlpha=1;
}

function drawWeatherTint() {
  if (!ctx) return;
  const tints: Partial<Record<WeatherKind,string>> = {
    cloudy:"rgba(150,170,195,0.09)", rain:"rgba(85,106,138,0.16)",
    snow:"rgba(225,236,249,0.11)", fog:"rgba(196,210,224,0.2)", storm:"rgba(54,72,103,0.22)"
  };
  const t = tints[weather];
  if (t) { ctx.fillStyle=t; ctx.fillRect(0,0,cssWidth,cssHeight); }
}

function render(nowTs: number) {
  if (!ctx||!sprites||skyTextures.length!==4) return;
  ctx.globalAlpha=1; ctx.clearRect(0,0,cssWidth,cssHeight);
  ctx.drawImage(skyTextures[skyAIndex],0,0,cssWidth,cssHeight);
  if (skyMix>0.0001) { ctx.globalAlpha=skyMix; ctx.drawImage(skyTextures[skyBIndex],0,0,cssWidth,cssHeight); ctx.globalAlpha=1; }
  drawStars(nowTs); drawSunAndMoon();
  const ct = weather==="storm"?0.2:weather==="cloudy"?0.12:0;
  drawCloudLayer(sprites.cloudFar,cloudFarCount,cloudFarX,cloudFarY,cloudFarScale,cloudFarOpacity,ct);
  drawCloudLayer(sprites.cloudMid,cloudMidCount,cloudMidX,cloudMidY,cloudMidScale,cloudMidOpacity,ct);
  drawCloudLayer(sprites.cloudNear,cloudNearCount,cloudNearX,cloudNearY,cloudNearScale,cloudNearOpacity,ct);
  if (weather==="rain"||weather==="storm") drawRain();
  if (weather==="snow") drawSnow();
  if (weather==="fog") drawFog();
  drawWeatherTint();
  if (weather==="storm"&&lightningAlpha>0) {
    ctx.globalAlpha=lightningAlpha; ctx.fillStyle="rgba(230,240,255,1)"; ctx.fillRect(0,0,cssWidth,cssHeight); ctx.globalAlpha=1;
  }
}

function rafLoop(ts: number) {
  if (lastFrameTs===0) lastFrameTs=ts;
  rafId=self.requestAnimationFrame(rafLoop);
  if (paused||!visible) { lastFrameTs=ts; return; }
  const elapsed=ts-lastFrameTs;
  if (elapsed<frameIntervalMs) return;
  lastFrameTs=ts;
  const dt=Math.min(0.05,elapsed*0.001);
  update(dt,ts); render(ts);
  avgFrameMs=avgFrameMs*0.92+elapsed*0.08;
}

function startLoop() {
  if (rafId!==0) { self.cancelAnimationFrame(rafId); rafId=0; }
  lastFrameTs=0; rafId=self.requestAnimationFrame(rafLoop);
}

function handleInit(msg: InitMessage) {
  canvas=msg.canvas; weather=msg.weather; mobile=msg.mobile; lowEnd=msg.lowEnd; renderScale=msg.renderScale;
  locationTimezone=msg.timezone??""; // ✅ timezone set

  ctx=canvas.getContext("2d",{alpha:true,desynchronized:true});
  if (!ctx) throw new Error("Unable to initialize 2D context");

  sprites=createSpriteAtlas();
  minQuality=lowEnd?0.4:mobile?0.5:0.6; maxQuality=1; quality=lowEnd?0.72:mobile?0.86:1;
  setTargetFps();
  resizeCanvas(msg.width,msg.height,msg.dpr,msg.renderScale);
  paused=false; visible=true; qualityEvalAt=0;
  lastClockUpdate=-1; // ✅ force recalculate with new timezone
  updateClock(performance.now());
  rebuildMoonPhaseSprite(moonPhase);
  startLoop();
}

self.onmessage=(event: MessageEvent<WorkerMessage>)=>{
  const msg=event.data;
  switch(msg.type){
    case "init":       handleInit(msg); break;
    case "resize":     resizeCanvas(msg.width,msg.height,msg.dpr,msg.renderScale); break;
    case "weather":    weather=msg.weather; break;
    case "timezone":   // ✅ runtime timezone update
      locationTimezone=msg.timezone;
      lastClockUpdate=-1; // force clock recalculate immediately
      break;
    case "pause":      paused=true; break;
    case "resume":     paused=false; break;
    case "visibility": visible=msg.visible; break;
    default: { const _n: never=msg; void _n; }
  }
};
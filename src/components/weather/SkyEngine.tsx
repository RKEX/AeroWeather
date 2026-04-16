// /components/weather/SkyEngine.tsx
"use client";

import type { SkyTimeData } from "@/lib/sky-time";
import { useEffect, useRef } from "react";

type WeatherKind = "clear" | "cloudy" | "rain" | "snow" | "fog" | "storm";

type SkyEngineProps = {
  weather?: WeatherKind;
  timezone?: string;
  timeData?: SkyTimeData | null;
  className?: string;
  onReady?: () => void;
};

type WorkerInitMessage = {
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
  timeData?: SkyTimeData | null;
};

type WorkerResizeMessage = {
  type: "resize";
  width: number;
  height: number;
  dpr: number;
  renderScale: number;
};

type WorkerWeatherMessage = {
  type: "weather";
  weather: WeatherKind;
};

type WorkerTimezoneMessage = {
  type: "timezone";
  timezone: string;
};

type WorkerTimeDataMessage = {
  type: "timeData";
  timeData: SkyTimeData;
};

type WorkerControlMessage =
  | { type: "pause" }
  | { type: "resume" }
  | { type: "visibility"; visible: boolean };

type IncomingMessage = { type: "ready" };

type OutgoingMessage =
  | WorkerInitMessage
  | WorkerResizeMessage
  | WorkerWeatherMessage
  | WorkerTimezoneMessage
  | WorkerTimeDataMessage
  | WorkerControlMessage;

type NavigatorWithMemory = Navigator & { deviceMemory?: number };
type WindowWithIdleCallback = Window & {
  requestIdleCallback: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions
  ) => number;
  cancelIdleCallback: (handle: number) => void;
};
type Timer = ReturnType<typeof setTimeout>;

function detectDeviceTier() {
  const nav = navigator as NavigatorWithMemory;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const dpr = window.devicePixelRatio || 1;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const mobileUa = /Android|iPhone|iPad|iPod|Mobi/i.test(nav.userAgent);
  const mobile = coarse || mobileUa;
  const lowEnd = cores <= 4 || memory <= 4 || (mobile && dpr > 2.2);
  const renderScale = mobile ? (lowEnd ? 0.62 : 0.78) : 1;
  return { mobile, lowEnd, renderScale };
}

export default function SkyEngine({ weather = "clear", timezone, timeData, className, onReady }: SkyEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const offscreenRef = useRef<OffscreenCanvas | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const visibilityHandlerRef = useRef<(() => void) | null>(null);
  const initializedRef = useRef(false);
  const mountCountRef = useRef(0);
  const terminateTimerRef = useRef<Timer | null>(null);
  const readyRef = useRef(false);
  const renderScaleRef = useRef(1);
  const onReadyRef = useRef<SkyEngineProps["onReady"]>(onReady);
  const readySignalSentRef = useRef(false);
  const initCancelRef = useRef<(() => void) | null>(null);
  const latestWeatherRef = useRef<WeatherKind>(weather);
  const latestTimezoneRef = useRef<string | undefined>(timezone);
  const latestTimeDataRef = useRef<SkyTimeData | null | undefined>(timeData);

  useEffect(() => {
    latestWeatherRef.current = weather;
    latestTimezoneRef.current = timezone;
    latestTimeDataRef.current = timeData;
  }, [weather, timezone, timeData]);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !("transferControlToOffscreen" in canvas)) return;

    let cancelled = false;

    mountCountRef.current += 1;
    if (terminateTimerRef.current !== null) {
      clearTimeout(terminateTimerRef.current);
      terminateTimerRef.current = null;
    }

    const bootstrap = () => {
      if (cancelled || initializedRef.current) return;

      const worker = new Worker(new URL("../../workers/sky.worker.ts", import.meta.url), { type: "module" });
      workerRef.current = worker;
      readySignalSentRef.current = false;

      worker.onmessage = (event: MessageEvent<IncomingMessage>) => {
        if (event.data?.type !== "ready" || readySignalSentRef.current) return;
        readySignalSentRef.current = true;
        onReadyRef.current?.();
      };

      const { mobile, lowEnd, renderScale } = detectDeviceTier();
      renderScaleRef.current = renderScale;

      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      const dpr = window.devicePixelRatio || 1;

      if (!offscreenRef.current) offscreenRef.current = canvas.transferControlToOffscreen();
      const offscreen = offscreenRef.current;
      if (!offscreen) return;

      worker.postMessage({
        type: "init", canvas: offscreen,
        width, height, dpr, weather: latestWeatherRef.current,
        mobile, lowEnd, renderScale,
        timezone: latestTimezoneRef.current,
        timeData: latestTimeDataRef.current,
      } as WorkerInitMessage, [offscreen]);

      readyRef.current = true;
      initializedRef.current = true;

      const resizeObserver = new ResizeObserver(() => {
        if (!workerRef.current || !readyRef.current) return;
        const r = canvas.getBoundingClientRect();
        workerRef.current.postMessage({
          type: "resize",
          width: Math.max(1, Math.floor(r.width)),
          height: Math.max(1, Math.floor(r.height)),
          dpr: window.devicePixelRatio || 1,
          renderScale: renderScaleRef.current,
        } as OutgoingMessage);
      });
      resizeObserver.observe(canvas);
      resizeObserverRef.current = resizeObserver;

      const intersectionObserver = new IntersectionObserver((entries) => {
        const isVisible = entries[0]?.isIntersecting ?? true;
        if (!workerRef.current || !readyRef.current) return;
        workerRef.current.postMessage({ type: "visibility", visible: isVisible } as OutgoingMessage);
        workerRef.current.postMessage({ type: isVisible ? "resume" : "pause" } as OutgoingMessage);
      }, { threshold: 0.02 });
      intersectionObserver.observe(canvas);
      intersectionObserverRef.current = intersectionObserver;

      const handleVisibilityChange = () => {
        if (!workerRef.current || !readyRef.current) return;
        const isVisible = document.visibilityState === "visible";
        workerRef.current.postMessage({ type: "visibility", visible: isVisible } as OutgoingMessage);
        workerRef.current.postMessage({ type: isVisible ? "resume" : "pause" } as OutgoingMessage);
      };
      visibilityHandlerRef.current = handleVisibilityChange;
      document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });
    };

    if (!initializedRef.current) {
      const win = window as WindowWithIdleCallback;

      if (typeof win.requestIdleCallback === "function") {
        const idleId = win.requestIdleCallback(() => bootstrap(), { timeout: 180 });
        initCancelRef.current = () => win.cancelIdleCallback(idleId);
      } else {
        const rafId = globalThis.requestAnimationFrame(() => bootstrap());
        initCancelRef.current = () => globalThis.cancelAnimationFrame(rafId);
      }
    }

    return () => {
      cancelled = true;

      if (initCancelRef.current) {
        initCancelRef.current();
        initCancelRef.current = null;
      }

      mountCountRef.current -= 1;
      if (mountCountRef.current > 0) return;

      terminateTimerRef.current = setTimeout(() => {
        if (mountCountRef.current > 0) return;

        if (visibilityHandlerRef.current) {
          document.removeEventListener("visibilitychange", visibilityHandlerRef.current);
          visibilityHandlerRef.current = null;
        }
        intersectionObserverRef.current?.disconnect();
        intersectionObserverRef.current = null;
        resizeObserverRef.current?.disconnect();
        resizeObserverRef.current = null;
        workerRef.current?.terminate();
        if (workerRef.current) {
          workerRef.current.onmessage = null;
        }
        workerRef.current = null;
        initializedRef.current = false;
        offscreenRef.current = null;
        readyRef.current = false;
        readySignalSentRef.current = false;
      }, 0);
    };
  }, []);

  // ✅ weather change → worker কে জানাও
  useEffect(() => {
    if (!workerRef.current || !readyRef.current) return;
    workerRef.current.postMessage({ type: "weather", weather } as OutgoingMessage);
  }, [weather]);

  // ✅ timezone change → worker কে জানাও
  useEffect(() => {
    if (!workerRef.current || !readyRef.current || !timezone) return;
    workerRef.current.postMessage({ type: "timezone", timezone } as OutgoingMessage);
  }, [timezone]);

  useEffect(() => {
    if (!workerRef.current || !readyRef.current || !timeData) return;
    workerRef.current.postMessage({ type: "timeData", timeData } as OutgoingMessage);
  }, [timeData]);

  return (
    <canvas ref={canvasRef} className={className} aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block" }} />
  );
}
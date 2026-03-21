// /components/SkyEngine.tsx

"use client";

import { useEffect, useRef } from "react";

type WeatherKind = "clear" | "cloudy" | "rain" | "snow" | "fog" | "storm";

type SkyEngineProps = {
  weather?: WeatherKind;
  className?: string;
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

type WorkerControlMessage =
  | { type: "pause" }
  | { type: "resume" }
  | { type: "visibility"; visible: boolean };

type OutgoingMessage =
  | WorkerInitMessage
  | WorkerResizeMessage
  | WorkerWeatherMessage
  | WorkerControlMessage;

type NavigatorWithMemory = Navigator & {
  deviceMemory?: number;
};

type Timer = ReturnType<typeof setTimeout>;

function detectDeviceTier(): {
  mobile: boolean;
  lowEnd: boolean;
  renderScale: number;
} {
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

export default function SkyEngine({ weather = "clear", className }: SkyEngineProps) {
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    if (!("transferControlToOffscreen" in canvas)) {
      return;
    }

    mountCountRef.current += 1;
    if (terminateTimerRef.current !== null) {
      clearTimeout(terminateTimerRef.current);
      terminateTimerRef.current = null;
    }

    if (!initializedRef.current) {
      const worker = new Worker(new URL("../workers/sky.worker.ts", import.meta.url), {
        type: "module",
      });
      workerRef.current = worker;

      const { mobile, lowEnd, renderScale } = detectDeviceTier();
      renderScaleRef.current = renderScale;

      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      const dpr = window.devicePixelRatio || 1;

      if (!offscreenRef.current) {
        offscreenRef.current = canvas.transferControlToOffscreen();
      }
      const offscreen = offscreenRef.current;
      if (!offscreen) {
        return;
      }

      const initMessage: WorkerInitMessage = {
        type: "init",
        canvas: offscreen,
        width,
        height,
        dpr,
        weather,
        mobile,
        lowEnd,
        renderScale,
      };

      worker.postMessage(initMessage as OutgoingMessage, [offscreen]);
      readyRef.current = true;
      initializedRef.current = true;

      const handleResize = () => {
        if (!workerRef.current || !readyRef.current) {
          return;
        }
        const nextRect = canvas.getBoundingClientRect();
        const resizeMessage: WorkerResizeMessage = {
          type: "resize",
          width: Math.max(1, Math.floor(nextRect.width)),
          height: Math.max(1, Math.floor(nextRect.height)),
          dpr: window.devicePixelRatio || 1,
          renderScale: renderScaleRef.current,
        };
        workerRef.current.postMessage(resizeMessage as OutgoingMessage);
      };

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(canvas);
      resizeObserverRef.current = resizeObserver;

      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          const isVisible = entries[0]?.isIntersecting ?? true;
          if (!workerRef.current || !readyRef.current) {
            return;
          }

          const visibilityMessage: WorkerControlMessage = {
            type: "visibility",
            visible: isVisible,
          };
          workerRef.current.postMessage(visibilityMessage as OutgoingMessage);

          const controlMessage: WorkerControlMessage = {
            type: isVisible ? "resume" : "pause",
          };
          workerRef.current.postMessage(controlMessage as OutgoingMessage);
        },
        { threshold: 0.02 },
      );
      intersectionObserver.observe(canvas);
      intersectionObserverRef.current = intersectionObserver;

      const handleVisibilityChange = () => {
        if (!workerRef.current || !readyRef.current) {
          return;
        }

        const isVisible = document.visibilityState === "visible";
        const visibilityMessage: WorkerControlMessage = {
          type: "visibility",
          visible: isVisible,
        };
        workerRef.current.postMessage(visibilityMessage as OutgoingMessage);

        const controlMessage: WorkerControlMessage = {
          type: isVisible ? "resume" : "pause",
        };
        workerRef.current.postMessage(controlMessage as OutgoingMessage);
      };

      visibilityHandlerRef.current = handleVisibilityChange;
      document.addEventListener("visibilitychange", handleVisibilityChange, {
        passive: true,
      });
    }

    return () => {
      mountCountRef.current -= 1;
      if (mountCountRef.current > 0) {
        return;
      }

      terminateTimerRef.current = setTimeout(() => {
        if (mountCountRef.current > 0) {
          return;
        }

        if (visibilityHandlerRef.current) {
          document.removeEventListener("visibilitychange", visibilityHandlerRef.current);
          visibilityHandlerRef.current = null;
        }

        if (intersectionObserverRef.current) {
          intersectionObserverRef.current.disconnect();
          intersectionObserverRef.current = null;
        }

        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
          resizeObserverRef.current = null;
        }

        if (workerRef.current) {
          workerRef.current.terminate();
          workerRef.current = null;
        }

        initializedRef.current = false;
        offscreenRef.current = null;
        readyRef.current = false;
      }, 0);
    };
  }, []);

  useEffect(() => {
    if (!workerRef.current || !readyRef.current) {
      return;
    }

    const weatherMessage: WorkerWeatherMessage = {
      type: "weather",
      weather,
    };

    workerRef.current.postMessage(weatherMessage as OutgoingMessage);
  }, [weather]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}

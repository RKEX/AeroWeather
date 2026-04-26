"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import { usePerformance } from "@/components/Providers/performance-provider";
import GlassCard from "@/components/ui/GlassCard";
import { format } from "date-fns";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Pause, Play } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

type RainViewerFrame = {
  time: number;
};

type RainViewerResponse = {
  radar?: {
    past?: RainViewerFrame[];
  };
};

const RADAR_ZOOM = 6;

function lockMapInteractions(map: LeafletMap) {
  map.dragging.disable();
  map.scrollWheelZoom.disable();
  map.doubleClickZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
  map.touchZoom.disable();
}

function unlockMapInteractions(map: LeafletMap) {
  map.dragging.enable();
  map.scrollWheelZoom.disable();
  map.doubleClickZoom.enable();
  map.boxZoom.enable();
  map.keyboard.enable();
  map.touchZoom.enable();
}

const MapReadyController = memo(function MapReadyController({
  onMapReady,
}: {
  onMapReady: (map: LeafletMap) => void;
}) {
  const map = useMap();

  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
  return null;
});

const RadarMapComponent = ({
  lat,
  lon,
  isNight = true,
}: {
  lat: number;
  lon: number;
  isNight?: boolean;
}) => {
  const { t } = useLanguage();
  const { quality } = usePerformance();
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const mapRef = useRef<LeafletMap | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const tileSize = quality === "ULTRA" ? 512 : 256;
  const activeTimestamp = timestamps[currentIndex] ?? null;
  const shouldRunMapEngine = isActive && isInView;
  const shouldRenderBaseLayer = isInView;
  const shouldRenderRadarLayer = shouldRunMapEngine;

  const handleMapReady = useCallback((map: LeafletMap) => {
    if (mapRef.current === map) return;

    mapRef.current = map;

    // Ensure map size is correct once the container has painted.
    requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });
      lockMapInteractions(map);
    });
  }, []);

  useEffect(() => {
    const target = cardRef.current;
    if (!target || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio > 0.08;
        setIsInView((previous) => (previous === visible ? previous : visible));
        if (!visible) {
          setIsActive(false);
          setIsPlaying(false);
        }
      },
      { threshold: [0, 0.08, 0.2] }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadFrames = async () => {
      try {
        const response = await fetch(
          "https://api.rainviewer.com/public/weather-maps.json",
          { signal: controller.signal }
        );

        if (!response.ok) return;

        const data = (await response.json()) as RainViewerResponse;
        const frames = data.radar?.past?.slice(-6) ?? [];
        const nextTimestamps = frames
          .map((frame) => frame.time)
          .filter((time): time is number => Number.isFinite(time));

        if (nextTimestamps.length === 0) return;

        setTimestamps(nextTimestamps);
        setCurrentIndex(nextTimestamps.length - 1);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Failed to load radar frames", error);
        }
      }
    };

    loadFrames();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!isPlaying || timestamps.length <= 1 || !shouldRunMapEngine) return;

    const i = window.setInterval(
      () => setCurrentIndex((p) => (p + 1) % timestamps.length),
      1200
    );

    return () => window.clearInterval(i);
  }, [isPlaying, shouldRunMapEngine, timestamps]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (shouldRunMapEngine) {
      unlockMapInteractions(map);
      requestAnimationFrame(() => map.invalidateSize({ pan: false }));
      return;
    }

    map.stop();
    lockMapInteractions(map);
  }, [shouldRunMapEngine]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.setView([lat, lon], map.getZoom(), { animate: shouldRunMapEngine });
    if (shouldRunMapEngine) {
      map.invalidateSize({ pan: false });
    }
  }, [lat, lon, shouldRunMapEngine]);

  useEffect(() => {
    return () => {
      mapRef.current = null;
    };
  }, []);

  const handleActivate = () => {
    setIsActive(true);
  };

  const handlePlaybackToggle = () => {
    if (!isActive) {
      setIsActive(true);
    }
    setIsPlaying((previous) => !previous);
  };

  const handleTimelineChange = (nextIndex: number) => {
    if (!isActive) {
      setIsActive(true);
    }
    setCurrentIndex(nextIndex);
  };

  const handleLeave = () => {
    setIsActive(false);
    setIsPlaying(false);
  };

  const controlsDisabled = !isInView || timestamps.length === 0;

  return (
    <GlassCard
      ref={cardRef}
      onMouseLeave={handleLeave}
      className="relative min-h-[380px] flex flex-col w-full overflow-hidden rounded-2xl md:min-h-[440px] lg:min-h-[520px]"
    >
      <div className="pointer-events-none absolute top-4 left-4 right-4 z-500 flex items-start justify-between gap-3">
        <GlassCard className="bg-black/20 px-3 py-2 text-white">
          <h3 className="text-base font-semibold md:text-lg">{t("radarLive")}</h3>
          <p className="text-xs text-white/80 md:text-sm">
            {activeTimestamp
              ? format(new Date(activeTimestamp * 1000), "h:mm a")
              : t("radarLoading")}
          </p>
        </GlassCard>

        {!isActive && (
          <div className="text-xs text-white/20">
            {isInView ? t("radarClickToInteract") : t("radarPausedOffscreen")}
          </div>
        )}
      </div>

      <div role="presentation" className="relative flex-1 w-full">
        <div
          className={`absolute inset-0 z-20 bg-transparent opacity-100 backdrop-blur-none ${
            isActive ? "pointer-events-none" : "pointer-events-auto"
          }`}
        >
          <button
            type="button"
            onClick={handleActivate}
            className="h-full w-full cursor-pointer bg-transparent p-0 focus:outline-none"
            aria-label={t("radarActivateAria")}
          />
        </div>

        <div
          className={`absolute inset-0 z-10 ${
            isActive ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <MapContainer
            center={[lat, lon]}
            zoom={RADAR_ZOOM}
            scrollWheelZoom={false}
            className="h-full w-full min-h-[380px]"
            zoomControl
            attributionControl={false}
            preferCanvas
            fadeAnimation={false}
            zoomAnimation={false}
            markerZoomAnimation={false}
          >
            <MapReadyController onMapReady={handleMapReady} />

            {shouldRenderBaseLayer && (
              <>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  updateWhenIdle
                  updateWhenZooming={false}
                  keepBuffer={1}
                />
                {shouldRenderRadarLayer && activeTimestamp && (
                  <TileLayer
                    url={`https://tilecache.rainviewer.com/v2/radar/${activeTimestamp}/${tileSize}/{z}/{x}/{y}/2/1_1.png`}
                    opacity={0.6}
                    updateWhenIdle
                    updateWhenZooming={false}
                    keepBuffer={0}
                  />
                )}
              </>
            )}
          </MapContainer>
        </div>
      </div>

      <GlassCard
        className={`absolute bottom-4 left-4 right-4 z-500 flex items-center gap-3 px-3 py-2 ${
          isNight ? "bg-black/35" : "bg-white/10"
        }`}
      >
        <button
          type="button"
          onClick={handlePlaybackToggle}
          disabled={controlsDisabled || timestamps.length <= 1}
          className="rounded-xl border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <input
          type="range"
          min="0"
          max={Math.max(timestamps.length - 1, 0)}
          value={currentIndex}
          onChange={(e) => handleTimelineChange(Number(e.target.value))}
          disabled={controlsDisabled}
          className="flex-1 accent-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </GlassCard>
    </GlassCard>
  );
};

export const RadarMap = memo(RadarMapComponent);
RadarMap.displayName = "RadarMap";
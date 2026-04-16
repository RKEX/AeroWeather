"use client";

import { usePerformance } from "@/components/Providers/performance-provider";
import { GlassCard } from "@/components/ui/glass-card";
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
  map.scrollWheelZoom.enable();
  map.doubleClickZoom.enable();
  map.boxZoom.enable();
  map.keyboard.enable();
  map.touchZoom.enable();
}

const MapInteractionController = ({
  isActive,
  onMapReady,
}: {
  isActive: boolean;
  onMapReady: (map: LeafletMap) => void;
}) => {
  const map = useMap();

  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);

  useEffect(() => {
    if (isActive) {
      unlockMapInteractions(map);
    } else {
      lockMapInteractions(map);
    }
  }, [isActive, map]);

  return null;
};

const RadarMapComponent = ({
  lat,
  lon,
  isNight = true,
}: {
  lat: number;
  lon: number;
  isNight?: boolean;
}) => {
  const { quality } = usePerformance();
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const mapRef = useRef<LeafletMap | null>(null);

  const tileSize = quality === "ULTRA" ? 512 : 256;
  const activeTimestamp = timestamps[currentIndex] ?? null;

  const handleMapReady = useCallback((map: LeafletMap) => {
    mapRef.current = map;

    // Ensure map size is correct once the container has painted.
    requestAnimationFrame(() => {
      map.invalidateSize();
      lockMapInteractions(map);
    });
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
    if (!isPlaying || timestamps.length <= 1) return;

    const i = setInterval(
      () => setCurrentIndex((p) => (p + 1) % timestamps.length),
      1200
    );

    return () => clearInterval(i);
  }, [isPlaying, timestamps]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.setView([lat, lon], map.getZoom(), { animate: true });
    map.invalidateSize();
  }, [lat, lon]);

  useEffect(() => {
    return () => {
      mapRef.current = null;
    };
  }, []);

  const handleActivate = () => {
    setIsActive(true);
    const map = mapRef.current;
    if (!map) return;
    unlockMapInteractions(map);
  };

  const handleLeave = () => {
    setIsActive(false);
    const map = mapRef.current;
    if (!map) return;
    lockMapInteractions(map);
  };

  return (
    <GlassCard className="relative h-95 w-full overflow-hidden rounded-3xl md:h-110 lg:h-130 xl:h-143.25">
      <div className="pointer-events-none absolute top-4 left-4 right-4 z-500 flex items-start justify-between gap-3">
        <div className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white backdrop-blur-sm">
          <h3 className="text-base font-semibold md:text-lg">Live Radar</h3>
          <p className="text-xs text-white/80 md:text-sm">
            {activeTimestamp
              ? format(new Date(activeTimestamp * 1000), "h:mm a")
              : "Loading radar..."}
          </p>
        </div>

        {!isActive && (
          <div className="rounded-xl border border-white/15 bg-black/35 px-3 py-2 text-xs text-white/85 backdrop-blur-sm">
            Click to interact
          </div>
        )}
      </div>

      <div
        role="presentation"
        onClick={handleActivate}
        onMouseLeave={handleLeave}
        className={`h-full w-full ${isActive ? "cursor-grab" : "cursor-pointer"}`}
      >
        <MapContainer
          center={[lat, lon]}
          zoom={6}
          scrollWheelZoom={false}
          className="h-full w-full"
          zoomControl
          attributionControl={false}
        >
          <MapInteractionController isActive={isActive} onMapReady={handleMapReady} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {activeTimestamp && (
            <TileLayer
              url={`https://tilecache.rainviewer.com/v2/radar/${activeTimestamp}/${tileSize}/{z}/{x}/{y}/2/1_1.png`}
              opacity={0.6}
            />
          )}
        </MapContainer>
      </div>

      <div
        className={`absolute bottom-4 left-4 right-4 z-500 flex items-center gap-3 rounded-2xl border border-white/15 px-3 py-2 backdrop-blur-sm ${
          isNight ? "bg-black/35" : "bg-white/25"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsPlaying((prev) => !prev)}
          className="rounded-xl border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20"
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <input
          type="range"
          min="0"
          max={Math.max(timestamps.length - 1, 0)}
          value={currentIndex}
          onChange={(e) => setCurrentIndex(Number(e.target.value))}
          disabled={timestamps.length === 0}
          className="flex-1 accent-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
    </GlassCard>
  );
};

export const RadarMap = memo(RadarMapComponent);
RadarMap.displayName = "RadarMap";
"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import { usePerformance } from "@/components/Providers/performance-provider";
import { GlassCard } from "@/components/ui/glass-card";
import { format } from "date-fns";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Pause, Play } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const StaticRadarPreview = memo(function StaticRadarPreview({
  lat,
  lon,
  isNight,
  activeTimestamp,
  useFrostedOverlay = false,
}: {
  lat: number;
  lon: number;
  isNight: boolean;
  activeTimestamp: number | null;
  useFrostedOverlay?: boolean;
}) {
  const { t } = useLanguage();
  const staticMapUrl = useMemo(() => {
    const center = `${lat.toFixed(4)},${lon.toFixed(4)}`;
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${center}&zoom=${RADAR_ZOOM}&size=1200x700&maptype=mapnik`;
  }, [lat, lon]);

  return (
    <div className="relative h-full w-full">
      {!useFrostedOverlay ? (
        <div
          className={`h-full w-full bg-cover bg-center ${isNight ? "bg-slate-900" : "bg-slate-300"}`}
          style={{ backgroundImage: `url(${staticMapUrl})` }}
          aria-hidden="true"
        />
      ) : (
        <div
          className="h-full w-full bg-transparent"
          aria-hidden="true"
        />
      )}

      {!useFrostedOverlay && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(56,189,248,0.22),transparent_42%),radial-gradient(circle_at_78%_30%,rgba(59,130,246,0.2),transparent_44%),linear-gradient(to_bottom,rgba(2,6,23,0.14),rgba(2,6,23,0.52))]" />
      )}

      <div className="pointer-events-none absolute right-4 bottom-4 rounded-xl border border-white/15 bg-black/35 px-3 py-2 text-xs text-white/85 backdrop-blur-sm">
        {activeTimestamp
          ? `${t("radarSnapshotPrefix")} ${format(new Date(activeTimestamp * 1000), "h:mm a")}`
          : t("radarStaticPreview")}
      </div>
    </div>
  );
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
  const [hasActivated, setHasActivated] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const mapRef = useRef<LeafletMap | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const tileSize = quality === "ULTRA" ? 512 : 256;
  const activeTimestamp = timestamps[currentIndex] ?? null;
  const shouldRunMapEngine = hasActivated && isActive && isInView;
  const shouldRenderMapLayers = hasActivated && isInView;

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
    setHasActivated(true);
    setIsActive(true);
  };

  const handleLeave = () => {
    setIsActive(false);
    setIsPlaying(false);
  };

  const controlsDisabled = !shouldRunMapEngine || timestamps.length === 0;

  return (
    <GlassCard
      ref={cardRef}
      className="relative h-95 w-full overflow-hidden rounded-3xl md:h-110 lg:h-130 xl:h-143.25"
    >
      <div className="pointer-events-none absolute top-4 left-4 right-4 z-500 flex items-start justify-between gap-3">
        <div className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white backdrop-blur-sm">
          <h3 className="text-base font-semibold md:text-lg">{t("radarLive")}</h3>
          <p className="text-xs text-white/80 md:text-sm">
            {activeTimestamp
              ? format(new Date(activeTimestamp * 1000), "h:mm a")
              : t("radarLoading")}
          </p>
        </div>

        {!isActive && (
          <div className="rounded-xl border border-white/15 bg-black/35 px-3 py-2 text-xs text-white/85 backdrop-blur-sm">
            {isInView ? t("radarClickToInteract") : t("radarPausedOffscreen")}
          </div>
        )}
      </div>

      <div
        role="presentation"
        onMouseLeave={handleLeave}
        className="relative h-full w-full"
      >
        <div
          className={`absolute inset-0 z-20 transition-opacity duration-300 ${
            isActive ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"
          }`}
        >
          <button
            type="button"
            onClick={handleActivate}
            onTouchStart={handleActivate}
            className="h-full w-full cursor-pointer bg-transparent focus:outline-none"
            aria-label={t("radarActivateAria")}
          >
            <StaticRadarPreview
              lat={lat}
              lon={lon}
              isNight={isNight}
              activeTimestamp={activeTimestamp}
              useFrostedOverlay={hasActivated}
            />
          </button>
        </div>

        {hasActivated && (
          <div
            className={`absolute inset-0 z-10 transition-opacity duration-300 ${
              isActive ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-100"
            }`}
          >
            <MapContainer
              center={[lat, lon]}
              zoom={RADAR_ZOOM}
              scrollWheelZoom={false}
              className="h-full w-full"
              zoomControl
              attributionControl={false}
              preferCanvas
              fadeAnimation={false}
              zoomAnimation={false}
              markerZoomAnimation={false}
            >
              <MapReadyController onMapReady={handleMapReady} />

              {shouldRenderMapLayers && (
                <>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    updateWhenIdle
                    keepBuffer={1}
                  />
                  {activeTimestamp && (
                    <TileLayer
                      url={`https://tilecache.rainviewer.com/v2/radar/${activeTimestamp}/${tileSize}/{z}/{x}/{y}/2/1_1.png`}
                      opacity={0.6}
                      updateWhenIdle
                      keepBuffer={1}
                    />
                  )}
                </>
              )}
            </MapContainer>
          </div>
        )}
      </div>

      <div
        className={`absolute bottom-4 left-4 right-4 z-500 flex items-center gap-3 rounded-2xl border border-white/15 px-3 py-2 backdrop-blur-sm ${
          isNight ? "bg-black/35" : "bg-white/25"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsPlaying((prev) => !prev)}
          disabled={!shouldRunMapEngine || timestamps.length <= 1}
          className="rounded-xl border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <input
          type="range"
          min="0"
          max={Math.max(timestamps.length - 1, 0)}
          value={currentIndex}
          onChange={(e) => setCurrentIndex(Number(e.target.value))}
          disabled={controlsDisabled}
          className="flex-1 accent-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
    </GlassCard>
  );
};

export const RadarMap = memo(RadarMapComponent);
RadarMap.displayName = "RadarMap";
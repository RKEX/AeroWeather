"use client";

import { usePerformance } from "@/components/Providers/performance-provider";
import { GlassCard } from "@/components/ui/glass-card";
import { format } from "date-fns";
import "leaflet/dist/leaflet.css";
import { MousePointer2, Pause, Play } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

const MapInteractionController = ({ isActive }: { isActive: boolean }) => {
  const map = useMap();
  useEffect(() => {
    if (isActive) {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
    } else {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
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

  const tileSize = quality === "ULTRA" ? 512 : 256;

  useEffect(() => {
    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then((res) => res.json())
      .then((data) => {
        const frames = data.radar.past.slice(-6);
        setTimestamps(frames.map((f: any) => f.time));
        setCurrentIndex(frames.length - 1);
      });
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const i = setInterval(
      () => setCurrentIndex((p) => (p + 1) % timestamps.length),
      1200
    );
    return () => clearInterval(i);
  }, [isPlaying, timestamps]);

  if (!timestamps.length) return null;

  return (
    <GlassCard className="relative w-full h-[380px] md:h-[440px] lg:h-[520px] xl:h-[573px] overflow-hidden flex flex-col transition-all duration-500">
      <div className="absolute top-4 left-4 z-10 text-white">
        <h3 className="text-xl">Live Radar</h3>
        <p className="text-sm">
          {format(new Date(timestamps[currentIndex] * 1000), "h:mm a")}
        </p>
      </div>

      {!isActive && (
        <div
          onClick={() => setIsActive(true)}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 cursor-pointer"
        >
          <MousePointer2 className="text-white" />
        </div>
      )}

      <MapContainer
        center={[lat, lon]}
        zoom={6}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <MapInteractionController isActive={isActive} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <TileLayer
          url={`https://tilecache.rainviewer.com/v2/radar/${timestamps[currentIndex]}/${tileSize}/{z}/{x}/{y}/2/1_1.png`}
          opacity={0.6}
        />
      </MapContainer>

      <div className="absolute bottom-4 left-4 right-4 flex gap-3">
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <input
          type="range"
          min="0"
          max={timestamps.length - 1}
          value={currentIndex}
          onChange={(e) => setCurrentIndex(Number(e.target.value))}
          className="flex-1"
        />
      </div>
    </GlassCard>
  );
};

export const RadarMap = memo(RadarMapComponent);
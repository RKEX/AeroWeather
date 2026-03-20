"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Play, Pause } from 'lucide-react';
import { format } from "date-fns";
import { GlassCard } from "@/components/ui/glass-card";

import { memo } from 'react';

const RadarMapComponent = ({ lat, lon, isNight = true }: { lat: number, lon: number, isNight?: boolean }) => {
    const [timestamps, setTimestamps] = useState<number[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    useEffect(() => {
        fetch("https://api.rainviewer.com/public/weather-maps.json")
            .then(res => res.json())
            .then(data => {
                if (data && data.radar && data.radar.past) {
                    setTimestamps(data.radar.past.map((item: any) => item.time));
                    setCurrentIndex(data.radar.past.length - 1);
                }
            });
    }, []);

    useEffect(() => {
        if (!isPlaying || timestamps.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % timestamps.length);
        }, 1000);
        return () => clearInterval(interval);
    }, [isPlaying, timestamps]);

    if (timestamps.length === 0) return null;

    return (
        <GlassCard className="relative w-full max-w-full h-105 overflow-hidden flex flex-col">
            {/* Header / Info */}
            <div className="absolute top-4 left-4 z-1000 pointer-events-none">
                <h3 className={`text-xl font-medium drop-shadow-md text-white`}>Live Radar</h3>
                <p className={`text-sm text-white/80 drop-shadow-sm`}>
                    {format(new Date(timestamps[currentIndex] * 1000), 'h:mm a')}
                </p>
            </div>

            <MapContainer
                center={[lat, lon]}
                zoom={6}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    className={isNight ? "map-tiles" : ""}
                />
                
                <TileLayer
                    url={`https://tilecache.rainviewer.com/v2/radar/${timestamps[currentIndex]}/256/{z}/{x}/{y}/2/1_1.png`}
                    attribution='&copy; <a href="https://www.rainviewer.com/">RainViewer</a>'
                    opacity={0.6}
                />

                {isNight && (
                    <div className="absolute inset-0 bg-black/20 pointer-events-none z-400" />
                )}
            </MapContainer>

            {/* Premium Controls */}
            <div className="absolute bottom-4 left-4 right-4 z-1000 flex items-center gap-4 bg-white/10 backdrop-blur-2xl p-3 rounded-2xl border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white border border-white/10"
                >
                    {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                </button>
                
                <input 
                    type="range"
                    min="0"
                    max={timestamps.length - 1}
                    value={currentIndex}
                    onChange={(e) => {
                        setCurrentIndex(parseInt(e.target.value));
                        setIsPlaying(false);
                    }}
                    className="flex-1 accent-blue-500 bg-white/20 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            <style jsx global>{`
                .map-tiles {
                    filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
                }
                .leaflet-container {
                    background: transparent !important;
                }
            `}</style>
        </GlassCard>
    );
};

export const RadarMap = memo(RadarMapComponent);
RadarMap.displayName = "RadarMap";

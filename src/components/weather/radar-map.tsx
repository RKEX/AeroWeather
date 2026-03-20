"use client";

import { useEffect, useState, useRef, memo, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Play, Pause, Lock, MousePointer2 } from 'lucide-react';
import { format } from "date-fns";
import { GlassCard } from "@/components/ui/glass-card";
import { usePerformance } from "@/components/Providers/performance-provider";

interface RainViewerRadarItem {
    time: number;
    path: string;
}

interface RainViewerResponse {
    radar: {
        past: RainViewerRadarItem[];
        nowcast: RainViewerRadarItem[];
    };
}

/* ---------- Map Interaction Controller ---------- */

const MapInteractionController = ({ isActive }: { isActive: boolean }) => {
    const map = useMap();

    useEffect(() => {
        if (isActive) {
            map.dragging.enable();
            map.scrollWheelZoom.enable();
            map.touchZoom.enable();
            map.doubleClickZoom.enable();
        } else {
            map.dragging.disable();
            map.scrollWheelZoom.disable();
            map.touchZoom.disable();
            map.doubleClickZoom.disable();
        }
    }, [isActive, map]);

    return null;
};

/* ---------- Main Component ---------- */

const RadarMapComponent = ({ lat, lon, isNight = true }: { lat: number, lon: number, isNight?: boolean }) => {
    const { quality } = usePerformance();
    const [timestamps, setTimestamps] = useState<number[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inactivityTimerRef = useRef<NodeJS.Timeout| null>(null);

    // Dynamic tile resolution based on quality
    const tileSize = quality === "ULTRA" ? 512 : 256;
    const radarOpacity = quality === "LITE" ? (isActive ? 0.5 : 0.2) : (isActive ? 0.7 : 0.4);

    // Fetch radar data
    useEffect(() => {
        fetch("https://api.rainviewer.com/public/weather-maps.json")
            .then(res => res.json())
            .then((data: RainViewerResponse) => {
                if (data && data.radar && data.radar.past) {
                    setTimestamps(data.radar.past.map((item) => item.time));
                    setCurrentIndex(data.radar.past.length - 1);
                }
            })
            .catch(err => console.error("Failed to fetch radar data", err));
    }, []);

    // Animation loop
    useEffect(() => {
        if (!isPlaying || timestamps.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % timestamps.length);
        }, 1000);
        return () => clearInterval(interval);
    }, [isPlaying, timestamps]);

    const handleDeactivate = useCallback(() => {
        setIsActive(false);
    }, []);

    const resetInactivityTimer = useCallback(() => {
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        if (isActive) {
            inactivityTimerRef.current = setTimeout(() => {
                handleDeactivate();
            }, 3000);
        }
    }, [isActive, handleDeactivate]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleDeactivate();
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                handleDeactivate();
            }
        };

        if (isActive) {
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('touchstart', resetInactivityTimer);
            window.addEventListener('touchmove', resetInactivityTimer);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('touchstart', resetInactivityTimer);
            window.removeEventListener('touchmove', resetInactivityTimer);
            if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        };
    }, [isActive, handleDeactivate, resetInactivityTimer]);

    if (timestamps.length === 0) return null;

    return (
        <GlassCard 
            ref={containerRef}
            onMouseLeave={() => isActive && handleDeactivate()}
            className={`relative w-full max-w-full h-105 overflow-hidden flex flex-col transition-all duration-500 ${
                isActive ? 'ring-2 ring-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''
            }`}
            style={{ 
                transform: 'translateZ(0)',
                willChange: 'transform'
            }}
        >
            <div className="absolute top-4 left-4 z-1000 pointer-events-none">
                <h3 className="text-xl font-medium drop-shadow-md text-white flex items-center gap-2">
                    Live Radar
                    {isActive && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-full text-[10px] uppercase tracking-wider animate-in fade-in zoom-in duration-300">
                           <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                           Active
                        </span>
                    )}
                </h3>
                <p className="text-sm text-white/80 drop-shadow-sm">
                    {format(new Date(timestamps[currentIndex] * 1000), 'h:mm a')}
                </p>
            </div>

            {!isActive && (
                <div 
                    onClick={() => setIsActive(true)}
                    className="absolute inset-0 z-1001 bg-black/5 hover:bg-black/10 cursor-pointer flex flex-col items-center justify-center group transition-all duration-300"
                >
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl flex flex-col items-center gap-3 transition-transform duration-300 group-hover:scale-110">
                        <MousePointer2 className="w-8 h-8 text-white animate-bounce" />
                        <span className="text-white font-medium text-sm px-2">Click to Interact with Map</span>
                    </div>
                </div>
            )}

            <MapContainer
                center={[lat, lon]}
                zoom={6}
                scrollWheelZoom={false}
                zoomControl={false}
                preferCanvas={true}
                className={`h-full w-full transition-opacity duration-500 ${!isActive ? 'opacity-80' : 'opacity-100'}`}
            >
                <MapInteractionController isActive={isActive} />
                
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    className={isNight ? "map-tiles" : ""}
                    updateWhenIdle={true}
                    keepBuffer={1}
                />
                
                <TileLayer
                    url={`https://tilecache.rainviewer.com/v2/radar/${timestamps[currentIndex]}/${tileSize}/{z}/{x}/{y}/2/1_1.png`}
                    attribution='&copy; <a href="https://www.rainviewer.com/">RainViewer</a>'
                    opacity={radarOpacity}
                    updateWhenIdle={true}
                    keepBuffer={0}
                />

                {isNight && (
                    <div className="absolute inset-0 bg-black/20 pointer-events-none z-400" />
                )}
            </MapContainer>

            <div className={`absolute bottom-4 left-4 right-4 z-1000 flex items-center gap-4 bg-white/10 backdrop-blur-2xl p-3 rounded-2xl border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-all duration-500 ${!isActive ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`}>
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

                <button 
                    onClick={handleDeactivate}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-white/60 hover:text-white border border-white/5"
                    title="Unlock Map (ESC)"
                >
                    <Lock className="w-4 h-4" />
                </button>
            </div>

            <style jsx global>{`
                .map-tiles {
                    filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
                }
                .leaflet-container {
                    background: transparent !important;
                }
                .leaflet-control-zoom {
                    border: none !important;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important;
                }
            `}</style>
        </GlassCard>
    );
};

export const RadarMap = memo(RadarMapComponent);
RadarMap.displayName = "RadarMap";

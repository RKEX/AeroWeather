"use client";

import { WeatherData } from "@/types/weather";
import { Wind } from "lucide-react";

interface AqiCardProps {
    aqiData?: WeatherData['airQuality'];
    isNight?: boolean;
}

export function AqiCard({ aqiData, isNight = true }: AqiCardProps) {
    if (!aqiData) return null;

    const textPrimary = isNight ? "text-white" : "text-slate-900";
    const textSecondary = isNight ? "text-white/60" : "text-slate-600";
    const glassCard = isNight
        ? "bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl"
        : "bg-white/70 backdrop-blur-xl border border-slate-200 text-slate-900 shadow-lg";

    const getAqiStatus = (aqi: number) => {
        if (aqi <= 50) return { label: 'Good', color: 'bg-green-500', text: 'text-green-500' };
        if (aqi <= 100) return { label: 'Moderate', color: 'bg-yellow-500', text: 'text-yellow-500' };
        if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', text: 'text-orange-500' };
        if (aqi <= 200) return { label: 'Unhealthy', color: 'bg-red-500', text: 'text-red-500' };
        if (aqi <= 300) return { label: 'Very Unhealthy', color: 'bg-purple-500', text: 'text-purple-500' };
        return { label: 'Hazardous', color: 'bg-rose-900', text: 'text-rose-900' };
    };

    const status = getAqiStatus(aqiData.usAqi);

    return (
        <div className={`w-full rounded-3xl p-6 backdrop-blur-xl transition-all ${glassCard}`}>
            <div className="flex justify-between items-start mb-6">
                <div>
                     <h3 className={`text-xl font-medium flex items-center gap-2 drop-shadow-sm ${textPrimary}`}><Wind className="w-5 h-5"/> Air Quality Index</h3>
                     <p className={`text-sm mt-1 drop-shadow-sm ${textSecondary}`}>Based on US AQI standard</p>
                </div>
                <div className="text-right">
                    <div className={`text-4xl font-bold ${status.text} drop-shadow-md`}>{aqiData.usAqi}</div>
                    <div className={`font-medium mt-1 ${textPrimary}`}>{status.label}</div>
                </div>
            </div>

            {/* Scale Bar */}
            <div className={`w-full h-2 rounded-full mb-6 overflow-hidden flex ${isNight ? 'bg-white/20' : 'bg-black/10'}`}>
                <div className="h-full bg-green-500" style={{width: '20%'}}></div>
                <div className="h-full bg-yellow-500" style={{width: '20%'}}></div>
                <div className="h-full bg-orange-500" style={{width: '20%'}}></div>
                <div className="h-full bg-red-500" style={{width: '20%'}}></div>
                <div className="h-full bg-purple-500" style={{width: '20%'}}></div>
            </div>

            {/* Pollutants Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <Pollutant label="PM2.5" value={aqiData.pm2_5} unit="μg/m³" isNight={isNight} />
                <Pollutant label="PM10" value={aqiData.pm10} unit="μg/m³" isNight={isNight} />
                <Pollutant label="Ozone (O3)" value={aqiData.ozone} unit="μg/m³" isNight={isNight} />
                <Pollutant label="NO2" value={aqiData.nitrogenDioxide} unit="μg/m³" isNight={isNight} />
            </div>
        </div>
    );
}

function Pollutant({ label, value, unit, isNight }: { label: string, value: number, unit: string, isNight: boolean }) {
    const itemBg = isNight ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5";
    const textMain = isNight ? "text-white" : "text-slate-900";
    const textSub = isNight ? "text-white/60" : "text-slate-500";
    const textUnit = isNight ? "text-white/40" : "text-slate-400";

    return (
        <div className={`rounded-2xl p-3 border flex flex-col transition-colors ${itemBg}`}>
            <span className={`text-xs mb-1 ${textSub}`}>{label}</span>
            <span className={`font-medium ${textMain}`}>{value.toFixed(1)} <span className={`text-[10px] ${textUnit}`}>{unit}</span></span>
        </div>
    );
}

export interface RadarTimeStamp {
    time: number;
    path: string;
}

export interface RadarResponse {
    version: string;
    generated: number;
    host: string;
    radar: {
        past: RadarTimeStamp[];
        nowcast: RadarTimeStamp[];
    };
    satellite: {
        infrared: RadarTimeStamp[];
    };
}

const RAINVIEWER_API_URL = "https://api.rainviewer.com/public/weather-maps.json";

export async function getRadarTimestamps(): Promise<RadarResponse | null> {
    try {
        const res = await fetch(RAINVIEWER_API_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch radar timestamps");
        
        const data: RadarResponse = await res.json();
        return data;
    } catch (e) {
        console.error("Error fetching RainViewer timestamps:", e);
        return null;
    }
}

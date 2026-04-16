// /store/useSkyStore.ts
import type { SkyTimeData } from "@/lib/sky-time";
import { create } from "zustand";

type WeatherKind = "clear" | "cloudy" | "rain" | "snow" | "fog" | "storm";

interface SkyState {
  weather: WeatherKind;
  timezone: string;
  timeData: SkyTimeData | null;
  setWeather: (weather: WeatherKind) => void;
  setTimezone: (timezone: string) => void;
  setTimeData: (timeData: SkyTimeData | null) => void;
}

export const useSkyStore = create<SkyState>((set) => ({
  weather: "clear",
  timezone: "",
  timeData: null,
  setWeather: (weather) => set({ weather }),
  setTimezone: (timezone) => set({ timezone }),
  setTimeData: (timeData) => set({ timeData }),
}));
// /store/useSkyStore.ts
import { create } from "zustand";

type WeatherKind = "clear" | "cloudy" | "rain" | "snow" | "fog" | "storm";

interface SkyState {
  weather: WeatherKind;
  timezone: string;
  setWeather: (weather: WeatherKind) => void;
  setTimezone: (timezone: string) => void;
}

export const useSkyStore = create<SkyState>((set) => ({
  weather: "clear",
  timezone: "",
  setWeather: (weather) => set({ weather }),
  setTimezone: (timezone) => set({ timezone }),
}));
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type TempUnit = "celsius" | "fahrenheit";
export type WindUnit = "kmh" | "mph";
export type ThemeMode = "dark" | "light" | "system";

interface SettingsContextType {
  tempUnit: TempUnit;
  windUnit: WindUnit;
  theme: ThemeMode;
  setTempUnit: (unit: TempUnit) => void;
  setWindUnit: (unit: WindUnit) => void;
  setTheme: (theme: ThemeMode) => void;
  convertTemp: (temp: number) => number;
  formatTemp: (temp: number) => string;
  convertWind: (speed: number) => number;
  formatWind: (speed: number) => string;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [tempUnit, setTempUnitState] = useState<TempUnit>("celsius");
  const [windUnit, setWindUnitState] = useState<WindUnit>("kmh");
  const [theme, setThemeState] = useState<ThemeMode>("system");

  // Load settings on mount to avoid hydration mismatch and cascading renders
  useEffect(() => {
    const savedTemp = localStorage.getItem("aeroweather_temp_unit") as TempUnit;
    const savedWind = localStorage.getItem("aeroweather_wind_unit") as WindUnit;
    const savedTheme = localStorage.getItem("aeroweather_theme") as ThemeMode;

    if (savedTemp) setTempUnitState(savedTemp);
    if (savedWind) setWindUnitState(savedWind);
    if (savedTheme) {
      setThemeState(savedTheme);
      if (savedTheme === "dark") document.documentElement.classList.add("dark");
    }
  }, []);

  const setTempUnit = useCallback((unit: TempUnit) => {
    setTempUnitState(unit);
    localStorage.setItem("aeroweather_temp_unit", unit);
  }, []);

  const setWindUnit = useCallback((unit: WindUnit) => {
    setWindUnitState(unit);
    localStorage.setItem("aeroweather_wind_unit", unit);
  }, []);

  const setTheme = useCallback((t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem("aeroweather_theme", t);
    if (t === "dark") document.documentElement.classList.add("dark");
    else if (t === "light") document.documentElement.classList.remove("dark");
    else {
       // system handling
       const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
       if (isDark) document.documentElement.classList.add("dark");
       else document.documentElement.classList.remove("dark");
    }
  }, []);

  const convertTemp = useCallback((c: number) => {
    if (tempUnit === "fahrenheit") return (c * 9) / 5 + 32;
    return c;
  }, [tempUnit]);

  const formatTemp = useCallback((c: number) => {
    const val = convertTemp(c);
    return `${Math.round(val)}°${tempUnit === "celsius" ? "C" : "F"}`;
  }, [convertTemp, tempUnit]);

  const convertWind = useCallback((kmh: number) => {
    if (windUnit === "mph") return kmh * 0.621371;
    return kmh;
  }, [windUnit]);

  const formatWind = useCallback((kmh: number) => {
    const val = convertWind(kmh);
    return `${Math.round(val)} ${windUnit === "kmh" ? "km/h" : "mph"}`;
  }, [convertWind, windUnit]);

  const value = React.useMemo(() => ({
    tempUnit, windUnit, theme,
    setTempUnit, setWindUnit, setTheme,
    convertTemp, formatTemp, convertWind, formatWind
  }), [tempUnit, windUnit, theme, setTempUnit, setWindUnit, setTheme, convertTemp, formatTemp, convertWind, formatWind]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

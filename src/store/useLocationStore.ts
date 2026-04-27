// /store/useLocationStore.ts
// Global location store — SINGLE SOURCE OF TRUTH for the active location.
// localStorage is the persistence layer; Zustand is the runtime layer.

import { create } from "zustand";

const STORAGE_KEY = "aeroweather_location";

export interface LocationData {
  lat: number;
  lon: number;
  name: string;
}

const DEFAULT_LOCATION: LocationData = {
  lat: 22.5726,
  lon: 88.3639,
  name: "Kolkata",
};

interface LocationState {
  /** Current active location used by all pages/components. */
  location: LocationData;
  /** Whether the store has been hydrated from localStorage. */
  hydrated: boolean;
  /** Update location and persist to localStorage. */
  setLocation: (location: LocationData) => void;
  /**
   * Hydrate from localStorage (idempotent — only runs once globally).
   * Call from any component that needs location on mount.
   * @param serverFallback  Optional SSR default to use when localStorage is empty.
   */
  hydrate: (serverFallback?: LocationData) => void;
}

// Module-level flag to guarantee single hydration across all components.
let _hydrated = false;

function readFromStorage(fallback: LocationData): LocationData {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as Partial<LocationData>;
    if (
      typeof parsed.lat === "number" &&
      typeof parsed.lon === "number" &&
      typeof parsed.name === "string"
    ) {
      return { lat: parsed.lat, lon: parsed.lon, name: parsed.name };
    }
  } catch {
    // Corrupted data — fall through to fallback.
  }
  return fallback;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  location: DEFAULT_LOCATION,
  hydrated: false,

  setLocation: (location) => {
    set({ location });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
      } catch {
        // Storage full or blocked — silent fail.
      }
    }
  },

  hydrate: (serverFallback) => {
    if (_hydrated) return;
    _hydrated = true;

    const fallback = serverFallback ?? DEFAULT_LOCATION;
    const resolved = readFromStorage(fallback);
    set({ location: resolved, hydrated: true });
  },
}));

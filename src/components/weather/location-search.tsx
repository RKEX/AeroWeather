"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { searchLocations } from "@/lib/geocode";
import { prefetchWeather } from "@/lib/prefetch";
import { LocationResult } from "@/types/weather";
import { Loader2, MapPin, Navigation, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface LocationSearchProps {
  onSelect: (location: LocationResult) => void;
}

export function LocationSearch({ onSelect }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 500);
  const router = useRouter();

  useEffect(() => {
    async function fetchLocations() {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      const data = await searchLocations(debouncedQuery);
      setResults(data);
      setLoading(false);
      setOpen(true);
    }
    fetchLocations();
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (location: LocationResult) => {
    setQuery("");
    setResults([]);
    setOpen(false);
    onSelect(location);
    router.push(
      `/weather/${location.name.toLowerCase().replace(/\s+/g, "-")}`
    );
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.county ||
            "Current Location";

          const country = data?.address?.country ?? "";
          const timezone =
            Intl.DateTimeFormat().resolvedOptions().timeZone;

          const location: LocationResult = {
            id: 0,
            name: city,
            latitude,
            longitude,
            country,
            timezone,
          };

          setLocating(false);
          onSelect(location);
        } catch {
          setLocating(false);
        }
      },
      () => setLocating(false),
      { timeout: 10000 }
    );
  };

  return (
    <div
      className="relative z-50 mx-auto w-full max-w-md"
      ref={containerRef}
    >
      <div className="flex w-full items-center gap-2">
        
        {/* 🔥 FIXED INPUT */}
        <div className="relative flex-1">
          
          {/* ICON PERFECT CENTER */}
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/70">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setOpen(true);
            }}
            placeholder="Search for a city..."
            className="w-full rounded-2xl border border-white/25 bg-white/15 py-3 pl-11 pr-4 text-white shadow-[0_10px_40px_rgba(0,0,0,0.45)] placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>

        {/* CURRENT LOCATION */}
        <button
          onClick={handleCurrentLocation}
          disabled={locating}
          title="Use current location"
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-white shadow-[0_10px_40px_rgba(0,0,0,0.45)] transition-colors hover:bg-white/25 disabled:opacity-50"
        >
          {locating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Navigation className="h-5 w-5" />
          )}
        </button>
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-[999] mt-2 rounded-2xl border border-white/10 bg-[#030712] shadow-2xl">
          <ul className="glass-scroll flex max-h-60 flex-col overflow-y-auto p-2">
            {results.map((loc) => (
              <li key={`${loc.id}-${loc.latitude}`}>
                <button
                  onClick={() => handleSelect(loc)}
                  onMouseEnter={() =>
                    prefetchWeather(loc.latitude, loc.longitude)
                  }
                  onFocus={() =>
                    prefetchWeather(loc.latitude, loc.longitude)
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-white hover:bg-white/10"
                >
                  <MapPin className="h-4 w-4 opacity-60" />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">
                      {loc.name}
                    </span>
                    <span className="truncate text-xs text-white/70">
                      {loc.admin1 ? `${loc.admin1}, ` : ""}
                      {loc.country}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
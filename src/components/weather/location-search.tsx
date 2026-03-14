"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { searchLocations } from "@/lib/geocode";
import { LocationResult } from "@/types/weather";
import { Loader2, MapPin, Search } from "lucide-react";
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
    router.push(`/weather/${location.name.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <div
      className="relative z-50 mx-auto w-full max-w-md"
      ref={containerRef}>
      {/* Search Input (glass + blur থাকবে) */}
      <div className="relative flex w-full items-center">
        <div className="absolute left-3 text-white/70">
          {loading ?
            <Loader2 className="h-5 w-5 animate-spin" />
          : <Search className="h-5 w-5" />}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          placeholder="Search for a city..."
          className="w-full rounded-2xl border border-white/25 bg-white/15 py-3 pr-4 pl-10 text-white shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl placeholder:text-white/60 focus:ring-2 focus:ring-white/30 focus:outline-none"
        />
      </div>

      {/* Dropdown (Solid opaque background with isolation) */}
      {open && results.length > 0 && (
        <div className="absolute top-full right-0 left-0 z-[999] isolate mt-2 rounded-2xl border border-white/10 bg-[#030712] shadow-2xl">
          <ul 
            className="glass-scroll flex max-h-60 w-full flex-col overflow-y-auto p-2"
            data-lenis-prevent>
            {results.map((loc) => (
              <li
                key={`${loc.id}-${loc.latitude}`}
                className="w-full">
                <button
                  onClick={() => handleSelect(loc)}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-white transition-colors hover:bg-white/10">
                  <MapPin className="h-4 w-4 shrink-0 opacity-60" />

                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">{loc.name}</span>

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

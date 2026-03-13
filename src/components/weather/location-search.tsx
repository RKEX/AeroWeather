"use client";

import { useState, useEffect, useRef } from "react";
import { searchLocations } from "@/lib/geocode";
import { LocationResult } from "@/types/weather";
import { Search, MapPin, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

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
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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
  };

  return (
    <div className="relative w-full max-w-md mx-auto z-50" ref={containerRef}>
      <div className="relative flex items-center w-full">
        <div className="absolute left-3 text-white/70">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setOpen(true) }}
          placeholder="Search for a city..."
          className="w-full pl-10 pr-4 py-3 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] divide-y divide-white/10">
          <ul className="max-h-60 overflow-y-auto w-full p-2 scrollbar-thin scrollbar-thumb-white/20">
            {results.map((loc) => (
              <li key={`${loc.id}-${loc.latitude}`} className="w-full">
                <button
                  onClick={() => handleSelect(loc)}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 text-white rounded-xl transition-colors flex items-center gap-3"
                >
                  <MapPin className="w-4 h-4 opacity-50 flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">{loc.name}</span>
                    <span className="text-xs text-white/60 truncate">
                      {loc.admin1 ? `${loc.admin1}, ` : ""}{loc.country}
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
